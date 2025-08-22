import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardModule,
  ButtonModule,
  ProgressModule,
  BadgeModule,
  ModalModule,
  GridModule,
  UtilitiesModule,
  FormModule,
  SidebarModule,
  OffcanvasModule,
  TooltipModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { AiTutoringService, QuestionData } from '../../../service/ai-tutoring.service';

interface Note {
  id: string;
  content: string;
  timestamp: string;
  question_id?: string;
}

@Component({
  selector: 'app-ai-tutoring',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    ProgressModule,
    BadgeModule,
    ModalModule,
    GridModule,
    UtilitiesModule,
    FormModule,
    SidebarModule,
    OffcanvasModule,
    TooltipModule,
    IconModule
  ],
  templateUrl: './ai-tutoring.component.html',
  styleUrls: ['./ai-tutoring.component.scss']
})
export class AiTutoringComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('drawingCanvas') drawingCanvas!: ElementRef;

  sessionId: string = '';
  currentQuestion: QuestionData | null = null;

  // 對話相關
  chatMessages: Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
  }> = [];
  userInput = '';
  isLoading = false;

  // UI 狀態
  showSidebar = false;
  showNotesModal = false;
  showDrawingModal = false;
  isMobile = false;

  // 筆記功能
  notes: Note[] = [];
  currentNote = '';

  // 繪圖功能
  isDrawing = false;
  drawingContext: CanvasRenderingContext2D | null = null;

  // 學習路徑
  learningPath: QuestionData[] = [];
  currentQuestionIndex = 0;

  // 新增：學習進度追蹤
  learningStage: 'core_concept_confirmation' | 'related_concept_guidance' | 'application_understanding' | 'understanding_verification' = 'core_concept_confirmation';
  understandingLevel: number = 0;
  learningProgress: Array<{
    stage: string;
    understanding_level: number;
    score?: number;
    timestamp: string;
  }> = [];
  
  // 新增：學習統計
  totalLearningTime: number = 0;
  startTime: Date = new Date();
  currentStageStartTime: Date = new Date();
  
  // 新增：題目選擇功能
  showQuestionSelector = false;
  selectedQuestionIndex: number | null = null;
  
  // 新增：學習報告
  learningReport: any = null;
  showLearningReport = false;
  
  // 新增：學習完成狀態
  currentQuestionCompleted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aiTutoringService: AiTutoringService
  ) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.checkMobile();
    
    // 從路由參數獲取sessionId
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
    });
    
    // 從查詢參數初始化
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['source'] === 'quiz_result') {
        this.initializeFromQuizResult(queryParams);
      }
    });
    
    // 自動選擇第一題
    if (this.learningPath.length > 0) {
      this.currentQuestionIndex = 0;
      this.currentQuestion = this.learningPath[0];
      this.startLearningSession();
    }
    
    window.addEventListener('resize', () => this.checkMobile());
  }
  
  // 開始學習會話
  private startLearningSession(): void {
    if (this.currentQuestion) {
      // 自動開始第一題的學習
      this.startQuestionLearning();
    }
  }
  
  // 開始題目學習
  private startQuestionLearning(): void {
    if (!this.currentQuestion) return;
    
    // 重置學習狀態
    this.learningStage = 'core_concept_confirmation';
    this.understandingLevel = 0;
    this.currentStageStartTime = new Date();
    
    // 自動發送第一條AI消息
    const welcomeMessage = `🎯 歡迎來到AI引導教學！讓我們開始學習這道題目。

題目：${this.currentQuestion.question_text}

請告訴我您對這道題目的理解，或者您希望從哪個方面開始學習？`;
    
    this.chatMessages.push({
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date().toISOString()
    });
    
    // 滾動到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkMobile());
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }



  async initializeFromQuizResult(queryParams: any): Promise<void> {
    const resultId = queryParams.result_id;
    
    if (!resultId) {
      this.addMessage('ai', '缺少測驗結果ID，無法載入錯題數據。');
      return;
    }

    try {
      const result = await this.aiTutoringService.startErrorLearning(resultId).toPromise();
      
      if (result?.success) {
        this.learningPath = result.wrongQuestions || [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.learningPath[0];

        if (this.learningPath.length > 0) {
          // 自動觸發後端生成歡迎訊息
          try {
            const welcomeResponse = await this.aiTutoringService.sendTutoringMessage('', this.sessionId).toPromise();
            if (welcomeResponse?.success && welcomeResponse.response) {
              this.addMessage('ai', welcomeResponse.response);
            } else {
              // 如果後端失敗，顯示預設訊息
              this.addMessage('ai', '✅ 錯題數據載入成功！請開始提問。');
            }
          } catch (error) {
            // 如果後端失敗，顯示預設訊息
            this.addMessage('ai', '✅ 錯題數據載入成功！請開始提問。');
          }
        } else {
          this.addMessage('ai', '恭喜！您沒有錯題需要學習。');
        }
      }
    } catch (error) {
      this.addMessage('ai', '載入測驗結果時發生錯誤，請重試。');
    }
  }

  addQuizCompletionWelcomeMessage(): void {
    if (this.currentQuestion) {
      const welcomeMessage = `🎓 歡迎來到 AI 智能教學！

我們將一起學習您的錯題。讓我們從第一道題開始：

**題目：** ${this.currentQuestion.question_text}

我看到您的答案是「${this.currentQuestion.user_answer}」，正確答案是「${this.currentQuestion.correct_answer}」。

讓我們一起探討這個概念。您有什麼問題想問我嗎？`;

      this.addMessage('ai', welcomeMessage);
    }
  }

  addMessage(type: 'user' | 'ai', content: string): void {
    this.chatMessages.push({
      type,
      content,
      timestamp: new Date().toISOString()
    });
    
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isLoading) return;

    const message = this.userInput.trim();
    this.userInput = '';
    this.addMessage('user', message);

    this.isLoading = true;

    try {
      // 發送用戶的訊息
      const response = await this.aiTutoringService.sendTutoringMessage(message, this.sessionId).toPromise();

      if (response?.success && response.response) {
        this.addMessage('ai', response.response);
      } else {
        this.addMessage('ai', response?.error || '抱歉，處理您的回答時發生錯誤。請重試。');
      }
    } catch (error) {
      this.addMessage('ai', '連接錯誤，請檢查網路連接。');
    } finally {
      this.isLoading = false;
    }
  }

  async requestHint(): Promise<void> {
    if (!this.currentQuestion) return;

    this.isLoading = true;
    const hintMessage = `請給我關於「${this.currentQuestion.question_text}」的學習提示`;

    try {
      const response = await this.aiTutoringService.sendTutoringMessage(hintMessage, this.sessionId).toPromise();

      if (response?.success && response.response) {
        this.addMessage('ai', response.response);
      } else {
        this.addMessage('ai', '抱歉，無法獲取學習提示。');
      }
    } catch (error) {
      this.addMessage('ai', '獲取學習提示時發生錯誤。');
    } finally {
      this.isLoading = false;
    }
  }

  async completeQuestion(): Promise<void> {
    if (!this.currentQuestion) return;

    this.isLoading = true;

    try {
      if (this.currentQuestionIndex < this.learningPath.length - 1) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.learningPath[this.currentQuestionIndex];
        
        const nextQuestionMessage = `🎯 讓我們繼續下一道題：

**題目：** ${this.currentQuestion.question_text}

您的答案是「${this.currentQuestion.user_answer}」，正確答案是「${this.currentQuestion.correct_answer}」。

您有什麼問題想問我嗎？`;

        this.addMessage('ai', nextQuestionMessage);
        

      } else {
        this.addMessage('ai', '🎉 恭喜！您已經完成了所有錯題的學習。\n\n您還有其他問題需要幫助嗎？');
        

      }
    } catch (error) {
      this.addMessage('ai', '完成題目學習時發生錯誤。');
    } finally {
      this.isLoading = false;
    }
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  // 移除重複的方法，使用HTML模板中調用的方法名

  addNote(): void {
    if (this.currentNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: this.currentNote,
        timestamp: new Date().toISOString(),
        question_id: this.currentQuestion?.question_id
      };
      
      this.notes.push(note);
      this.currentNote = '';
      this.showNotesModal = false;
    }
  }

  deleteNote(noteId: string): void {
    this.notes = this.notes.filter(note => note.id !== noteId);
  }

  // 移除舊的無參數版本，使用帶參數的版本

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    if (this.drawingContext) {
      this.drawingContext.clearRect(0, 0, this.drawingContext.canvas.width, this.drawingContext.canvas.height);
    }
  }

  getProgressPercentage(): number {
    if (this.learningPath.length === 0) return 0;
    return Math.round((this.currentQuestionIndex / this.learningPath.length) * 100);
  }

  getProgressColor(): string {
    const percentage = this.getProgressPercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  // 添加缺失的方法來匹配HTML模板
  explainQuestion(): void {
    this.requestHint();
  }

  completeCurrentQuestion(): void {
    this.completeQuestion();
  }

  nextQuestion(): void {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.learningPath[this.currentQuestionIndex];
      
      // 自動觸發AI開始講解下一題
      const message = `請開始講解第${this.currentQuestionIndex + 1}題：${this.currentQuestion?.question_text}`;
      
      // 直接添加AI訊息，模擬AI回應
      this.addMessage('ai', `🎯 讓我們繼續下一道題：

**題目：** ${this.currentQuestion.question_text}

您的答案是「${this.currentQuestion.user_answer}」，正確答案是「${this.currentQuestion.correct_answer}」。

您有什麼問題想問我嗎？`);
    }
  }

  hasNextQuestion(): boolean {
    return this.currentQuestionIndex < this.learningPath.length - 1;
  }

  openNotesModal(): void {
    this.showNotesModal = true;
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
  }

  openDrawingModal(): void {
    this.showDrawingModal = true;
    setTimeout(() => this.initializeCanvas(), 100);
  }

  closeDrawingModal(): void {
    this.showDrawingModal = false;
  }

  saveNote(): void {
    this.addNote();
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  initializeCanvas(): void {
    if (this.drawingCanvas) {
      const canvas = this.drawingCanvas.nativeElement;
      this.drawingContext = canvas.getContext('2d');
      
      if (this.drawingContext) {
        this.drawingContext.strokeStyle = '#000';
        this.drawingContext.lineWidth = 2;
        this.drawingContext.lineCap = 'round';
      }
    }
  }

  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    if (this.drawingContext) {
      const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
      this.drawingContext.beginPath();
      this.drawingContext.moveTo(
        event.clientX - rect.left,
        event.clientY - rect.top
      );
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.drawingContext) return;
    
    const rect = this.drawingCanvas.nativeElement.getBoundingClientRect();
    this.drawingContext.lineTo(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    this.drawingContext.stroke();
  }

  // 新增：學習進度追蹤方法
  updateLearningProgress(stage: string, level: number): void {
    this.learningStage = stage as any;
    this.understandingLevel = level;
    
    this.learningProgress.push({
      stage,
      understanding_level: level,
      timestamp: new Date().toISOString()
    });
    
    // 更新階段開始時間
    this.currentStageStartTime = new Date();
  }

  getLearningStageDisplayName(stage: string): string {
    const stageNames = {
      'core_concept_confirmation': '核心概念確認',
      'related_concept_guidance': '相關概念引導',
      'application_understanding': '應用理解',
      'understanding_verification': '理解驗證'
    };
    return stageNames[stage as keyof typeof stageNames] || stage;
  }

  // 新增：獲取題目完成度百分比（用於進度條）
  getQuestionCompletionPercentage(): number {
    if (this.understandingLevel >= 99) return 100;
    if (this.understandingLevel >= 90) return 95;
    if (this.understandingLevel >= 81) return 85;
    if (this.understandingLevel >= 61) return 70;
    if (this.understandingLevel >= 31) return 45;
    return 20;
  }

  // 新增：獲取理解程度顏色
  getUnderstandingLevelColor(level: number): string {
    if (level >= 99) return 'success';
    if (level >= 90) return 'info';
    if (level >= 81) return 'warning';
    if (level >= 61) return 'secondary';
    return 'danger';
  }

  // 新增：獲取理解程度文字描述
  getUnderstandingLevelText(level: number): string {
    if (level >= 99) return '完成';
    if (level >= 90) return '優秀';
    if (level >= 81) return '良好';
    if (level >= 61) return '中等';
    if (level >= 31) return '基礎';
    return '需要改進';
  }

  // 新增：檢查是否可以進入下一題
  canProceedToNextQuestion(): boolean {
    return this.understandingLevel >= 99 && this.currentQuestionCompleted;
  }

  // 新增：學習報告方法
  generateLearningReport(): void {
    this.learningReport = {
      currentQuestion: this.currentQuestion,
      learningStage: this.learningStage,
      understandingLevel: this.understandingLevel,
      totalLearningTime: this.calculateTotalLearningTime(),
      stageProgress: this.analyzeStageProgress(),
      recommendations: this.generateRecommendations()
    };
    this.showLearningReport = true;
  }

  private calculateTotalLearningTime(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.startTime.getTime()) / 1000 / 60); // 分鐘
  }

  private analyzeStageProgress(): any {
    const stageCounts: { [key: string]: number } = {};
    this.learningProgress.forEach(progress => {
      stageCounts[progress.stage] = (stageCounts[progress.stage] || 0) + 1;
    });
    return stageCounts;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.understandingLevel < 30) {
      recommendations.push('建議多花時間理解核心概念');
    }
    
    if (this.learningStage === 'core_concept_confirmation') {
      recommendations.push('繼續深入學習核心概念');
    } else if (this.learningStage === 'understanding_verification') {
      recommendations.push('嘗試用自己的話解釋概念，鞏固理解');
    }
    
    return recommendations;
  }

  // 新增：學習時間追蹤
  startStageTimer(): void {
    this.currentStageStartTime = new Date();
  }

  getStageLearningTime(): number {
    const now = new Date();
    return Math.floor((now.getTime() - this.currentStageStartTime.getTime()) / 1000 / 60); // 分鐘
  }

  // 新增：題目選擇方法
  openQuestionSelector(): void {
    this.showQuestionSelector = true;
  }

  selectQuestion(index: number): void {
    if (index >= 0 && index < this.learningPath.length) {
      this.currentQuestionIndex = index;
      this.currentQuestion = this.learningPath[index];
      
      // 重置學習進度
      this.learningStage = 'core_concept_confirmation';
      this.understandingLevel = 0;
      this.learningProgress = [];
      this.chatMessages = [];
      
      // 開始新的學習會話
      this.startNewLearningSession();
      
      this.showQuestionSelector = false;
    }
  }

  skipCurrentQuestion(): void {
    if (this.hasNextQuestion()) {
      this.nextQuestion();
    }
  }

  restartCurrentQuestion(): void {
    // 重置當前題目的學習進度
    this.learningStage = 'core_concept_confirmation';
    this.understandingLevel = 0;
    this.learningProgress = [];
    this.chatMessages = [];
    
    // 重新開始學習
    this.startNewLearningSession();
  }

  // 新增：獲取階段進度數量
  getStageProgressCount(): number {
    if (this.learningReport && this.learningReport.stageProgress) {
      return Object.keys(this.learningReport.stageProgress).length;
    }
    return 0;
  }

  // 新增：匯出學習報告
  exportLearningReport(): void {
    if (!this.learningReport) return;
    
    const reportData = {
      ...this.learningReport,
      exportTime: new Date().toISOString(),
      sessionId: this.sessionId
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning_report_${this.sessionId}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // 新增：開始新的學習會話
  private startNewLearningSession(): void {
    // 重置學習狀態
    this.learningStage = 'core_concept_confirmation';
    this.understandingLevel = 0;
    this.learningProgress = [];
    this.chatMessages = [];
    
    // 開始階段計時
    this.startStageTimer();
    
    // 可以這裡添加自動開始AI教學的邏輯
    if (this.currentQuestion) {
      this.addMessage('ai', `🎯 讓我們開始學習這道題目：

**題目：** ${this.currentQuestion.question_text}

您的答案是「${this.currentQuestion.user_answer}」，正確答案是「${this.currentQuestion.correct_answer}」。

讓我們從這道題目最核心的概念開始探討。在開始之前，我想先了解您對這道題目涉及的核心概念掌握程度如何。

您能告訴我，這道題目主要是在考什麼概念嗎？或者您覺得這道題目的關鍵點是什麼？`);
    }
  }

  // 處理AI回應
  private processAIResponse(response: any): void {
    try {
      if (response.success && response.data) {
        const aiResponse = response.data;
        
        // 清理AI回應，移除多餘的原始題目信息
        let cleanResponse = aiResponse.response || aiResponse.message || '';
        
        // 移除可能的原始題目信息
        cleanResponse = this.cleanAIResponse(cleanResponse);
        
        // 添加到對話歷史
        this.chatMessages.push({
          type: 'ai',
          content: cleanResponse,
          timestamp: new Date().toISOString()
        });
        
        // 更新學習狀態
        if (aiResponse.understanding_level !== undefined) {
          this.understandingLevel = aiResponse.understanding_level;
          this.updateLearningProgress(this.learningStage, this.understandingLevel);
        }
        
        // 檢查是否達到下一題條件
        if (this.understandingLevel >= 99) {
          this.handleLearningCompletion();
        }
        
        this.isLoading = false;
        this.scrollToBottom();
        
      } else {
        this.handleError('AI回應格式錯誤');
      }
    } catch (error) {
      console.error('❌ 處理AI回應失敗:', error);
      this.handleError('處理AI回應時發生錯誤');
    }
  }
  
  // 清理AI回應，移除多餘信息
  private cleanAIResponse(response: string): string {
    // 移除可能的原始題目信息
    const patterns = [
      /原始題目[：:]\s*.*?(?=\n|$)/g,
      /正確答案[：:]\s*.*?(?=\n|$)/g,
      /用戶答案[：:]\s*.*?(?=\n|$)/g,
      /題目[：:]\s*.*?(?=\n|$)/g
    ];
    
    let cleanResponse = response;
    patterns.forEach(pattern => {
      cleanResponse = cleanResponse.replace(pattern, '');
    });
    
    // 清理多餘的換行
    cleanResponse = cleanResponse.replace(/\n{3,}/g, '\n\n');
    
    return cleanResponse.trim();
  }
  
  // 處理錯誤
  private handleError(message: string): void {
    this.chatMessages.push({
      type: 'ai',
      content: `❌ ${message}`,
      timestamp: new Date().toISOString()
    });
    this.isLoading = false;
    this.scrollToBottom();
  }
  
  // 處理學習完成
  private handleLearningCompletion(): void {
    this.chatMessages.push({
      type: 'ai',
      content: '🎉 恭喜！您已經完全掌握這個概念，可以進入下一題了！',
      timestamp: new Date().toISOString()
    });
    
    // 自動進入下一題
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }
}
