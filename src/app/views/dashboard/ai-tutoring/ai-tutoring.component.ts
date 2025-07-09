import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
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
import { RagAssistantService } from '../../../service/rag-assistant.service';

interface QuestionData {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  is_marked: boolean;
  topic?: string;
  difficulty?: number;
}

interface LearningProgress {
  total_questions: number;
  completed_questions: number;
  current_question_index: number;
  progress_percentage: number;
  remaining_questions: number;
  session_status: string;
}

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
export class AiTutoringComponent implements OnInit, OnDestroy {
  
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('drawingCanvas') drawingCanvas!: ElementRef;
  
  sessionId: string = '';
  currentQuestion: QuestionData | null = null;
  learningProgress: LearningProgress | null = null;
  
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ragService: RagAssistantService
  ) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
    });
    
    // 檢查查詢參數是否有錯題復習模式
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['mode'] === 'mistake_review' && queryParams['questionId']) {
        this.initializeMistakeReview(queryParams['questionId']);
      } else if (queryParams['mode'] === 'batch_review' && queryParams['mistakeIds']) {
        this.initializeBatchReview(queryParams['mistakeIds']);
      } else if (this.sessionId) {
        this.initializeLearningSession();
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
    
    window.addEventListener('resize', () => this.checkMobile());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkMobile());
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  async initializeLearningSession(): Promise<void> {
    try {
      await this.loadLearningProgress();
      await this.loadCurrentQuestion();
      this.addWelcomeMessage();
    } catch (error) {
      console.error('初始化學習會話錯誤:', error);
    }
  }

  async loadLearningProgress(): Promise<void> {
    try {
      const response = await this.ragService.getLearningProgress(this.sessionId).toPromise();
      if (response?.success) {
        this.learningProgress = response.progress;
      }
    } catch (error) {
      console.error('載入學習進度錯誤:', error);
    }
  }

  async loadCurrentQuestion(): Promise<void> {
    // 這裡應該從後端獲取當前題目
    // 暫時使用模擬數據
    this.currentQuestion = {
      question_id: 'q1',
      question_text: '什麼是作業系統中的死鎖（Deadlock）？',
      user_answer: '程式停止運行',
      correct_answer: '兩個或多個程序互相等待對方釋放資源而無法繼續執行的狀態',
      is_correct: false,
      is_marked: true,
      topic: '作業系統',
      difficulty: 3
    };
  }

  addWelcomeMessage(): void {
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
      // 使用已測試的 MultiAITutor 聊天端點，傳遞 session_id
      const response = await this.ragService.sendMessageWithSession(message, 'tutoring', this.sessionId).pipe(
        take(1)
      ).toPromise() as any;

      if (response?.success && response.response) {
        this.addMessage('ai', response.response);
      } else {
        this.addMessage('ai', '抱歉，處理您的回答時發生錯誤。請重試。');
      }
    } catch (error) {
      console.error('發送訊息錯誤:', error);
      this.addMessage('ai', '連接錯誤，請檢查網路連接。');
    } finally {
      this.isLoading = false;
    }
  }

  async requestHint(): Promise<void> {
    this.isLoading = true;

    try {
      const hintMessage = `請給我關於「${this.currentQuestion?.question_text}」的學習提示`;
      const response = await this.ragService.sendMessage(hintMessage, 'tutoring', 'gemini').toPromise();

      if (response?.success && response.response) {
        this.addMessage('ai', response.response);
      } else {
        this.addMessage('ai', '抱歉，無法獲取提示。請重試。');
      }
    } catch (error) {
      console.error('請求提示錯誤:', error);
      this.addMessage('ai', '抱歉，無法獲取提示。請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  async explainQuestion(): Promise<void> {
    this.isLoading = true;

    try {
      const explainMessage = `請詳細解釋「${this.currentQuestion?.question_text}」這道題目`;
      const response = await this.ragService.sendMessage(explainMessage, 'tutoring', 'gemini').toPromise();

      if (response?.success && response.response) {
        this.addMessage('ai', response.response);
      } else {
        this.addMessage('ai', '抱歉，無法解釋題目。請重試。');
      }
    } catch (error) {
      console.error('解釋題目錯誤:', error);
      this.addMessage('ai', '抱歉，無法解釋題目。請重試。');
    } finally {
      this.isLoading = false;
    }
  }

  async completeCurrentQuestion(): Promise<void> {
    if (!this.currentQuestion) return;

    this.addMessage('ai', '✅ 很好！您已經理解了這道題目。讓我們繼續下一個學習內容。');

    // 簡化版本：直接顯示完成訊息
    // 實際應用中可以導航到下一題或返回結果頁面
    setTimeout(() => {
      this.addMessage('ai', '🎉 恭喜！您已完成這道錯題的學習。您可以繼續提問或返回結果頁面查看其他題目。');
    }, 1000);
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  openNotesModal(): void {
    this.showNotesModal = true;
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
  }

  saveNote(): void {
    if (this.currentNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: this.currentNote.trim(),
        timestamp: new Date().toISOString(),
        question_id: this.currentQuestion?.question_id
      };
      
      this.notes.push(note);
      this.currentNote = '';
      this.closeNotesModal();
    }
  }

  deleteNote(noteId: string): void {
    this.notes = this.notes.filter(note => note.id !== noteId);
  }

  openDrawingModal(): void {
    this.showDrawingModal = true;
    setTimeout(() => this.initializeCanvas(), 100);
  }

  closeDrawingModal(): void {
    this.showDrawingModal = false;
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

  stopDrawing(): void {
    this.isDrawing = false;
  }

  clearCanvas(): void {
    if (this.drawingContext && this.drawingCanvas) {
      const canvas = this.drawingCanvas.nativeElement;
      this.drawingContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  getProgressPercentage(): number {
    return this.learningProgress?.progress_percentage || 0;
  }

  getCurrentQuestionNumber(): number {
    return (this.learningProgress?.current_question_index || 0) + 1;
  }

  getTotalQuestions(): number {
    return this.learningProgress?.total_questions || 0;
  }

  async initializeMistakeReview(questionId: string): Promise<void> {
    try {
      console.log('初始化單個錯題復習:', questionId);
      // 這裡可以從錯題數據中找到對應的題目並設置為當前題目
      // 暫時使用一個示例錯題
      this.currentQuestion = {
        question_id: questionId,
        question_text: '這是您之前做錯的題目，讓我們一起複習這個概念...',
        user_answer: '您的錯誤答案',
        correct_answer: '正確答案',
        is_correct: false,
        is_marked: false,
        topic: '錯題復習',
        difficulty: 3
      };
      this.addWelcomeMessage();
    } catch (error) {
      console.error('初始化錯題復習錯誤:', error);
    }
  }

  async initializeBatchReview(mistakeIds: string): Promise<void> {
    try {
      console.log('初始化批量錯題復習:', mistakeIds);
      const ids = mistakeIds.split(',');
      
      // 設置第一個錯題為當前題目
      this.currentQuestion = {
        question_id: ids[0],
        question_text: `您選擇了 ${ids.length} 道錯題進行復習。讓我們從第一道開始...`,
        user_answer: '您的錯誤答案',
        correct_answer: '正確答案',
        is_correct: false,
        is_marked: false,
        topic: '批量錯題復習',
        difficulty: 3
      };
      
      // 設置學習進度
      this.learningProgress = {
        total_questions: ids.length,
        completed_questions: 0,
        current_question_index: 0,
        progress_percentage: 0,
        remaining_questions: ids.length,
        session_status: 'mistake_review'
      };
      
      this.addWelcomeMessage();
    } catch (error) {
      console.error('初始化批量錯題復習錯誤:', error);
    }
  }
}
