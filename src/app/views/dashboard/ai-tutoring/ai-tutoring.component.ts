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
  
  // 新增：Modal 控制狀態
  showQuestionDetailModal = false;
  showUserAnswerDetailModal = false;
  showCorrectAnswerDetailModal = false;

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
  
  // 新增：安全的 getter 方法
  get safeCurrentQuestion() {
    return this.currentQuestion || {
      question_text: '題目載入中...',
      user_answer: '未作答',
      correct_answer: '答案載入中...',
      is_correct: false,
      score: 0,
      feedback: { explanation: '', strengths: '', weaknesses: '', suggestions: '' },
      question_id: '',
      subject: '計算機概論',
      difficulty: 1,
      topic: '',
      options: [],
      image_file: '',
      question_type: '',
      is_marked: false
    };
  }
  
  // 新增：安全的文本截取方法
  getSafeText(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  
  // 新增：相關知識點
  relatedKnowledgePoints: string[] = ['計算機概論', '作業系統', '程序管理', '同步機制'];
  
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
      } else if (queryParams['mode'] === 'guided_learning') {
        // 新增：處理引導學習模式
        this.initializeGuidedLearning(queryParams);
      } else if (queryParams['mode'] === 'mistake_review') {
        // 處理單題錯題複習模式
        this.initializeMistakeReview(queryParams);
      } else if (queryParams['mode'] === 'batch_review') {
        // 處理批量複習模式
        this.initializeBatchReview(queryParams);
      }
    });
    
    // 注意：題目選擇會在 initializeFromQuizResult 完成後進行
    // 這裡不需要提前選擇，避免數據未載入的問題
    
    window.addEventListener('resize', () => this.checkMobile());
  }
  
  // 注意：startQuestionLearning 方法已移除，避免與 startNewLearningSession 重複

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
          // 題目載入完成，自動開始學習
          this.startNewLearningSession();
        } 
      }
    } catch (error) {
      this.addMessage('ai', '載入測驗結果時發生錯誤，請重試。');
    }
  }

  // 新增：初始化引導學習模式
  async initializeGuidedLearning(queryParams: any): Promise<void> {
    const questionId = queryParams.questionId;
    
    if (!questionId) {
      this.addMessage('ai', '缺少題目ID，無法開始引導學習。');
      return;
    }

    try {
      // 為引導學習生成一個有效的 sessionId
      if (!this.sessionId || this.sessionId === '') {
        this.sessionId = `guided_learning_${Date.now()}_${questionId}`;
      }

      // 創建引導學習的題目數據結構
      const guidedQuestion: QuestionData = {
        question_id: questionId,
        question_text: queryParams.questionText || '題目載入中...',
        user_answer: queryParams.studentAnswer || '未作答',
        correct_answer: queryParams.correctAnswer || '答案載入中...',
        is_correct: queryParams.isCorrect === 'true',
        score: parseInt(queryParams.score) || 0,
        feedback: {
          explanation: '',
          strengths: '',
          weaknesses: '',
          suggestions: ''
        },
        subject: '計算機概論', // 可以從題目信息中獲取
        difficulty: this.getDifficultyFromParams(queryParams.difficulty),
        topic: queryParams.topic || '',
        options: [],
        image_file: '',
        question_type: queryParams.examType || 'general',
        is_marked: false
      };

      // 設置學習路徑為單題
      this.learningPath = [guidedQuestion];
      this.currentQuestionIndex = 0;
      this.currentQuestion = guidedQuestion;

      // 設置引導學習的特定配置
      this.setupGuidedLearningConfig(queryParams);

      // 開始引導學習會話
      this.startGuidedLearningSession(queryParams);
      
    } catch (error) {
      console.error('❌ 初始化引導學習失敗:', error);
      this.addMessage('ai', '初始化引導學習時發生錯誤，請重試。');
    }
  }

  // 新增：初始化單題錯題複習模式
  async initializeMistakeReview(queryParams: any): Promise<void> {
    const questionId = queryParams.questionId;
    
    if (!questionId) {
      this.addMessage('ai', '缺少題目ID，無法開始錯題複習。');
      return;
    }

    try {
      // 為錯題複習生成一個有效的 sessionId
      if (!this.sessionId || this.sessionId === '') {
        this.sessionId = `mistake_review_${Date.now()}_${questionId}`;
      }

      // 創建錯題複習的題目數據結構
      const reviewQuestion: QuestionData = {
        question_id: questionId,
        question_text: queryParams.questionText || '題目載入中...',
        user_answer: queryParams.studentAnswer || '未作答',
        correct_answer: queryParams.correctAnswer || '答案載入中...',
        is_correct: false, // 錯題複習模式
        score: parseInt(queryParams.score) || 0,
        feedback: {
          explanation: '',
          strengths: '',
          weaknesses: '',
          suggestions: ''
        },
        subject: '計算機概論',
        difficulty: 2, // 中等難度
        topic: queryParams.topic || '',
        options: [],
        image_file: '',
        question_type: queryParams.examType || 'general',
        is_marked: false
      };

      this.learningPath = [reviewQuestion];
      this.currentQuestionIndex = 0;
      this.currentQuestion = reviewQuestion;

      // 開始錯題複習會話
      this.startMistakeReviewSession();
      
    } catch (error) {
      console.error('❌ 初始化錯題複習失敗:', error);
      this.addMessage('ai', '初始化錯題複習時發生錯誤，請重試。');
    }
  }

  // 新增：初始化批量複習模式
  async initializeBatchReview(queryParams: any): Promise<void> {
    const questionIds = queryParams.questionIds;
    
    if (!questionIds) {
      this.addMessage('ai', '缺少題目ID列表，無法開始批量複習。');
      return;
    }

    try {
      // 這裡可以從後端獲取批量題目數據
      // 暫時顯示提示信息
      this.addMessage('ai', `準備開始批量複習 ${questionIds.split(',').length} 道題目...`);
      
      // TODO: 實現批量題目載入邏輯
      this.addMessage('ai', '批量複習功能正在開發中，請稍後使用。');
      
    } catch (error) {
      console.error('❌ 初始化批量複習失敗:', error);
      this.addMessage('ai', '初始化批量複習時發生錯誤，請重試。');
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
    
    // 添加題目上下文到用戶訊息
    const messageWithContext = this.currentQuestion ? 
      `題目：${this.currentQuestion.question_text}\n\n用戶問題：${message}` :
      message;
    
    this.addMessage('user', message);

    this.isLoading = true;

    try {
      // 發送用戶的訊息（帶題目上下文和答案信息）
      const response = await this.aiTutoringService.sendTutoringMessage(messageWithContext, this.sessionId, this.currentQuestion).toPromise();
      
      if (response?.success) {
        // 使用 processAIResponse 處理AI回應，確保 understandingLevel 能正確更新
        this.processAIResponse(response);
      } else {
        this.addMessage('ai', response?.error || '抱歉，處理您的回答時發生錯誤。請重試。');
        this.isLoading = false;
      }
    } catch (error) {
      console.error('❌ 發送訊息失敗:', error);
      this.addMessage('ai', '連接錯誤，請檢查網路連接。');
      this.isLoading = false;
    }
  }

  async requestHint(): Promise<void> {
    if (!this.currentQuestion) return;

    this.isLoading = true;
    const hintMessage = `請給我關於「${this.currentQuestion.question_text}」的學習提示。`;

    try {
      
      const response = await this.aiTutoringService.sendTutoringMessage(hintMessage, this.sessionId).toPromise();
      
      if (response?.success) {
        // 使用 processAIResponse 處理AI回應，確保 understandingLevel 能正確更新
        this.processAIResponse(response);
      } else {
        this.addMessage('ai', '抱歉，無法獲取學習提示。');
        this.isLoading = false;
      }
    } catch (error) {
      console.error('❌ 獲取提示失敗:', error);
      this.addMessage('ai', '獲取學習提示時發生錯誤。');
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

在開始之前，我想先了解您對這個概念的理解程度。

請您用自己的話簡單解釋一下，這道題目主要是在考什麼概念？`;

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

  // 新增：搜索知識點
  searchKnowledgePoint(point: string): void {
    // 這裡可以實現知識點搜索功能
    this.addMessage('ai', `我正在為您搜索關於「${point}」的相關知識...`);
  }

  // 優化：題目選擇邏輯
  selectQuestion(index: number): void {
    if (index < 0 || index >= this.learningPath.length) {
      console.warn('⚠️ 無效的題目索引:', index);
      return;
    }

    const question = this.learningPath[index];
    
    // 檢查題目是否有答案
    if (!question.user_answer || question.user_answer.trim() === '') {
      // 可以選擇是否允許跳轉到未答題目
      if (confirm('此題目尚未作答，確定要跳轉嗎？')) {
        this.currentQuestionIndex = index;
        this.currentQuestion = question;
        this.startNewLearningSession();
      }
      return;
    }

    this.currentQuestionIndex = index;
    this.currentQuestion = question;
    this.startNewLearningSession();
  }

  // 優化：檢查是否有下一題
  hasNextQuestion(): boolean {
    return this.currentQuestionIndex < this.learningPath.length - 1;
  }

  // 優化：下一題
  nextQuestion(): void {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.learningPath[this.currentQuestionIndex];
      this.startNewLearningSession();
    }
  }

  // 優化：重新開始當前題目
  restartCurrentQuestion(): void {
    if (this.currentQuestion) {
      this.chatMessages = [];
      this.understandingLevel = 0;
      this.learningStage = 'core_concept_confirmation';
      this.startNewLearningSession();
    }
  }

  // 優化：跳過當前題目
  skipCurrentQuestion(): void {
    if (this.hasNextQuestion()) {
      this.nextQuestion();
    }
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
  
  // 新增：Modal 控制方法
  showQuestionModal(): void {
    this.showQuestionDetailModal = true;
  }
  
  showUserAnswerModal(): void {
    this.showUserAnswerDetailModal = true;
  }
  
  showCorrectAnswerModal(): void {
    this.showCorrectAnswerDetailModal = true;
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
    // 直接返回理解程度作為百分比
    return Math.min(this.understandingLevel, 100);
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
    
    // 檢查題目數據是否正確載入
    if (this.currentQuestion && this.currentQuestion.question_text && this.currentQuestion.question_text !== '初始化會話') {
      // 自動發送初始化訊息給後端，讓AI了解題目和學生答案
      this.initializeAITutoring();
    } else {
      console.warn('⚠️ 題目數據未正確載入，顯示預設訊息');
      this.addMessage('ai', '🎓 歡迎來到 AI 智能教學！\n\n請稍等，我正在載入您的錯題數據...');
    }
  }

  // 新增：輔助方法 - 從參數獲取難度等級
  private getDifficultyFromParams(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      case 'very_hard': return 4;
      default: return 2;
    }
  }

  // 新增：設置引導學習配置
  private setupGuidedLearningConfig(queryParams: any): void {
    // 根據參數設置學習配置
    if (queryParams.learningPath === 'progressive') {
      this.learningStage = 'core_concept_confirmation';
    }
    
    if (queryParams.adaptiveLearning === 'true') {
      // 啟用自適應學習
      this.understandingLevel = 0;
    }
    
    if (queryParams.stepByStep === 'true') {
      // 啟用逐步引導
      this.learningProgress = [];
    }
  }

  // 新增：開始引導學習會話
  private startGuidedLearningSession(queryParams: any): void {
    // 重置學習狀態
    this.learningStage = 'core_concept_confirmation';
    this.understandingLevel = 0;
    this.learningProgress = [];
    this.chatMessages = [];
    
    // 開始階段計時
    this.startStageTimer();
    
    // 根據引導學習模式發送特定的初始化訊息
    this.initializeGuidedAITutoring(queryParams);
  }

  // 新增：開始錯題複習會話
  private startMistakeReviewSession(): void {
    // 重置學習狀態
    this.learningStage = 'core_concept_confirmation';
    this.understandingLevel = 0;
    this.learningProgress = [];
    this.chatMessages = [];
    
    // 開始階段計時
    this.startStageTimer();
    
    // 發送錯題複習的初始化訊息
    this.initializeMistakeReviewAITutoring();
  }

  // 新增：初始化引導學習的AI教學
  private async initializeGuidedAITutoring(queryParams: any): Promise<void> {
    if (!this.currentQuestion) return;

    try {
      this.isLoading = true;
      
      // 使用簡單的初始化訊息，避免後端不支援的格式
      const initMessage = `請幫我分析這道題目：${this.currentQuestion.question_text}`;

      // 發送初始化訊息給後端
      const response = await this.aiTutoringService.sendTutoringMessage(
        initMessage, 
        this.sessionId, 
        this.currentQuestion
      ).toPromise();
      
      if (response?.success) {
        this.processAIResponse(response);
        
        // 如果AI回應成功，再發送一個引導學習的具體請求
        setTimeout(() => {
          this.sendGuidedLearningRequest(queryParams);
        }, 1000);
      } else {
        console.error('❌ 引導學習AI初始化失敗:', response?.error);
        this.addMessage('ai', '抱歉，引導學習初始化失敗，請重試。');
      }
    } catch (error) {
      console.error('❌ 初始化引導學習AI教學失敗:', error);
      this.addMessage('ai', '初始化引導學習AI教學時發生錯誤，請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  // 新增：發送引導學習的具體請求
  private async sendGuidedLearningRequest(queryParams: any): Promise<void> {
    if (!this.currentQuestion) return;

    try {
      this.isLoading = true;
      
      // 構建引導學習的具體請求
      const focusAreas = queryParams.focusAreas ? queryParams.focusAreas.split(',') : [];
      const difficulty = queryParams.difficulty || 'medium';
      
      let guidedMessage = `這道題目涉及${queryParams.topic}領域的${queryParams.chapter}章節，`;
      guidedMessage += `難度等級為${difficulty}。`;
      
      if (focusAreas.length > 0) {
        guidedMessage += `請重點幫助我理解：${focusAreas.join('、')}等概念。`;
      }
      
      guidedMessage += `請為我提供個性化的學習指導，幫助我掌握相關知識。`;

      // 發送引導學習請求
      const response = await this.aiTutoringService.sendTutoringMessage(
        guidedMessage, 
        this.sessionId, 
        this.currentQuestion
      ).toPromise();
      
      if (response?.success) {
        this.processAIResponse(response);
      } else {
        console.error('❌ 引導學習請求失敗:', response?.error);
        this.addMessage('ai', '抱歉，引導學習請求失敗，請重試。');
      }
    } catch (error) {
      console.error('❌ 發送引導學習請求失敗:', error);
      this.addMessage('ai', '發送引導學習請求時發生錯誤，請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  // 新增：初始化錯題複習的AI教學
  private async initializeMistakeReviewAITutoring(): Promise<void> {
    if (!this.currentQuestion) return;

    try {
      this.isLoading = true;
      
      // 使用簡單的初始化訊息
      const initMessage = `請幫我分析這道題目：${this.currentQuestion.question_text}`;

      // 發送初始化訊息給後端
      const response = await this.aiTutoringService.sendTutoringMessage(
        initMessage, 
        this.sessionId, 
        this.currentQuestion
      ).toPromise();
      
      if (response?.success) {
        this.processAIResponse(response);
        
        // 如果AI回應成功，再發送錯題分析的具體請求
        setTimeout(() => {
          this.sendMistakeAnalysisRequest();
        }, 1000);
      } else {
        console.error('❌ 錯題複習AI初始化失敗:', response?.error);
        this.addMessage('ai', '抱歉，錯題複習初始化失敗，請重試。');
      }
    } catch (error) {
      console.error('❌ 初始化錯題複習AI教學失敗:', error);
      this.addMessage('ai', '初始化錯題複習AI教學時發生錯誤，請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  // 新增：發送錯題分析的具體請求
  private async sendMistakeAnalysisRequest(): Promise<void> {
    if (!this.currentQuestion) return;

    try {
      this.isLoading = true;
      
      // 構建錯題分析的具體請求
      let analysisMessage = `我的答案是：${this.currentQuestion.user_answer}，`;
      analysisMessage += `正確答案是：${this.currentQuestion.correct_answer}。`;
      analysisMessage += `請幫我分析錯誤原因，並提供改進建議。`;

      // 發送錯題分析請求
      const response = await this.aiTutoringService.sendTutoringMessage(
        analysisMessage, 
        this.sessionId, 
        this.currentQuestion
      ).toPromise();
      
      if (response?.success) {
        this.processAIResponse(response);
      } else {
        console.error('❌ 錯題分析請求失敗:', response?.error);
        this.addMessage('ai', '抱歉，錯題分析請求失敗，請重試。');
      }
    } catch (error) {
      console.error('❌ 發送錯題分析請求失敗:', error);
      this.addMessage('ai', '發送錯題分析請求時發生錯誤，請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  // 新增：初始化AI教學，自動發送題目信息
  private async initializeAITutoring(): Promise<void> {
    if (!this.currentQuestion) return;

    try {
      
      // 設置載入狀態，顯示「AI正在分析」訊息
      this.isLoading = true;
      
      // 構建初始化訊息
      const initMessage = `開始學習會話：${this.currentQuestion.question_text}`;
      
      // 發送初始化訊息給後端
      const response = await this.aiTutoringService.sendTutoringMessage(
        initMessage, 
        this.sessionId, 
        this.currentQuestion
      ).toPromise();
      
      if (response?.success) {

        this.processAIResponse(response);
      } else {
        console.error('❌ AI初始化失敗:', response?.error);
        this.addMessage('ai', '抱歉，AI初始化失敗，請重試。');
      }
    } catch (error) {
      console.error('❌ 初始化AI教學失敗:', error);
      this.addMessage('ai', '初始化AI教學時發生錯誤，請重試。');
    } finally {
      // 確保載入狀態被重置
      this.isLoading = false;
    }
  }

  // 處理AI回應
  private processAIResponse(response: any): void {

    try {
      if (response.success) {
        // 後端返回的數據結構可能是 response.data 或直接是 response
        const aiResponse = response.data || response;

        // 獲取AI回應內容，處理嵌套的 response 結構
        let aiContent = '';

        
        // 處理嵌套的 response 結構：response.response
        if (aiResponse.response && typeof aiResponse.response === 'object' && aiResponse.response.response) {
          aiContent = aiResponse.response.response;
        } else if (typeof aiResponse.response === 'string') {
          aiContent = aiResponse.response;
        } else if (typeof aiResponse.message === 'string') {
          aiContent = aiResponse.message;
        } else if (typeof aiResponse.content === 'string') {
          aiContent = aiResponse.content;
        } else if (typeof aiResponse === 'string') {
          aiContent = aiResponse;
        } else {
          console.warn('⚠️ AI回應格式異常:', aiResponse);
          aiContent = 'AI回應格式異常，請重試';
        }
        
        // 移除可能的原始題目信息
        const cleanResponse = this.cleanAIResponse(aiContent);
        
        // 確保內容不為空且不是[object Object]
        if (cleanResponse && cleanResponse.trim() && !cleanResponse.includes('[object Object]')) {
          // 添加到對話歷史
          this.chatMessages.push({
            type: 'ai',
            content: cleanResponse,
            timestamp: new Date().toISOString()
          });
        } else {
          console.error('❌ AI回應內容無效:', cleanResponse);
          this.handleError('AI回應內容無效');
          return;
        }
        
        // 更新學習狀態 - 從後端返回的 response 對象中提取數據
        const responseData = aiResponse.response;
        
        // 提取理解程度和學習階段
        const backendUnderstandingLevel = responseData?.understanding_level;
        const backendLearningStage = responseData?.learning_stage;
        
        // 優先使用後端返回的數據
        if (backendUnderstandingLevel !== undefined && typeof backendUnderstandingLevel === 'number') {
          this.understandingLevel = Math.max(0, Math.min(100, backendUnderstandingLevel));
        }
        
        if (backendLearningStage && typeof backendLearningStage === 'string') {
          this.learningStage = backendLearningStage as any;
        }
        
        // 如果後端沒有提供數據，嘗試從回應內容中提取分數
        if (backendUnderstandingLevel === undefined) {
          console.warn('⚠️ 後端沒有提供理解程度數據，嘗試從回應內容中提取');
          
          const scoreMatch = cleanResponse.match(/(\d+)\s*分|(\d+)\s*points?|理解程度[：:]\s*(\d+)/i);
          if (scoreMatch) {
            const extractedScore = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]);
            if (!isNaN(extractedScore) && extractedScore >= 0 && extractedScore <= 100) {
              this.understandingLevel = extractedScore;
            }
          }
        }
        
        // 更新學習進度
        this.updateLearningProgress(this.learningStage, this.understandingLevel);
        
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
    if (!response || typeof response !== 'string') {
      return '';
    }
    
    // 移除可能的原始題目信息（多種格式）
    const patterns = [
      /原始題目[：:]\s*.*?(?=\n|$)/gi,
      /正確答案[：:]\s*.*?(?=\n|$)/gi,
      /用戶答案[：:]\s*.*?(?=\n|$)/gi,
      /題目[：:]\s*.*?(?=\n|$)/gi,
      /您的答案[：:]\s*.*?(?=\n|$)/gi,
      /Question[：:]\s*.*?(?=\n|$)/gi,
      /Answer[：:]\s*.*?(?=\n|$)/gi,
      /Correct Answer[：:]\s*.*?(?=\n|$)/gi,
      /User Answer[：:]\s*.*?(?=\n|$)/gi,
      // 移除特定的重複內容模式
      /.*Employee vacation policy.*?(?=\n|$)/gi,
      /.*Internet platforms.*?(?=\n|$)/gi
    ];
    
    let cleanResponse = response;
    patterns.forEach(pattern => {
      cleanResponse = cleanResponse.replace(pattern, '');
    });
    
    // 清理多餘的換行和空格
    cleanResponse = cleanResponse.replace(/\n{3,}/g, '\n\n');
    cleanResponse = cleanResponse.replace(/^\s+|\s+$/g, '');
    
    // 如果清理後內容太短，返回原始內容的部分
    if (cleanResponse.length < 10 && response.length > cleanResponse.length) {
      // 保留原始回應但移除明顯的重複部分
      cleanResponse = response.replace(/原始題目[：:].*?Employee vacation policy/gi, '')
                             .replace(/您的答案[：:].*?Internet platforms/gi, '')
                             .trim();
    }
    
    return cleanResponse || '正在處理您的回應...';
  }
  
  // 處理錯誤
  private handleError(message: string): void {
    console.error('❌ AI教學錯誤:', message);
    
    // 根據錯誤類型顯示不同的訊息
    let errorMessage = '';
    if (message.includes('AI回應格式錯誤')) {
      errorMessage = 'AI回應格式異常，正在重新處理...';
    } else if (message.includes('AI回應內容無效')) {
      errorMessage = 'AI回應內容異常，正在重新處理...';
    } else if (message.includes('處理AI回應時發生錯誤')) {
      errorMessage = 'AI處理出現問題，請稍後重試...';
    } else {
      errorMessage = `❌ ${message}`;
    }
    
    this.chatMessages.push({
      type: 'ai',
      content: errorMessage,
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

  // 新增：安全處理AI回應，防止[object Object]錯誤
  private sanitizeAIResponse(response: any): string {
    try {
      // 如果回應是字符串，直接返回
      if (typeof response === 'string') {
        return response;
      }
      
      // 如果回應是對象，嘗試提取文本內容
      if (typeof response === 'object' && response !== null) {
        // 檢查常見的字段
        if (response.text) return response.text;
        if (response.content) return response.content;
        if (response.message) return response.message;
        if (response.response) return response.response;
        if (response.answer) return response.answer;
        
        // 如果都沒有，嘗試JSON.stringify但限制長度
        const jsonStr = JSON.stringify(response);
        if (jsonStr.length > 200) {
          return jsonStr.substring(0, 200) + '...';
        }
        return jsonStr;
      }
      
      // 其他類型，轉換為字符串
      return String(response);
    } catch (error) {
      console.error('❌ 處理AI回應時發生錯誤:', error);
      return 'AI回應處理失敗，請重試';
    }
  }
}
