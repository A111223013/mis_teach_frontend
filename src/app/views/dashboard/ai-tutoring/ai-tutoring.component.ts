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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aiTutoringService: AiTutoringService
  ) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
    });
    
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['source'] === 'quiz_result') {
        this.initializeFromQuizResult(queryParams);
      }
    });
    
    window.addEventListener('resize', () => this.checkMobile());
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
}
