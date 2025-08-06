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
import { DashboardService } from '../../../service/dashboard.service'; // 新增：引入 DashboardService

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
    private ragService: RagAssistantService,
    private dashboardService: DashboardService // 新增：注入 DashboardService
  ) {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
    });
    
    // 檢查查詢參數是否有不同的模式
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['source'] === 'quiz_completion') {
        // 從測驗完成後導向 AI tutoring
        this.initializeFromQuizCompletion(queryParams);
      } else if (queryParams['source'] === 'quiz_result') {
        // 從 quiz-result 頁面跳轉過來
        this.initializeFromQuizResult(queryParams);
      } else if (queryParams['mode'] === 'mistake_review' && queryParams['questionId']) {
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
      console.log('初始化學習會話，sessionId:', this.sessionId);
      
      // 檢查是否是從quiz-result跳轉過來的學習會話
      if (this.sessionId.startsWith('learning_')) {
        console.log('檢測到學習會話ID，嘗試載入錯題數據');
        
        // 嘗試從後端獲取學習進度
        try {
          await this.loadLearningProgress();
        } catch (error) {
          console.warn('無法載入學習進度，將使用默認設置:', error);
        }
        
        // 嘗試從quiz-result獲取錯題數據
        // 從URL參數或localStorage中獲取result_id
        const resultId = this.getResultIdFromSession();
        
        if (resultId) {
          console.log('找到result_id，嘗試載入測驗結果:', resultId);
          await this.initializeFromQuizResult({ result_id: resultId });
        } else {
          console.log('沒有找到result_id，顯示默認歡迎訊息');
          this.addMessage('ai', '🎓 歡迎來到 AI 智能教學！\n\n我是您的專屬 MIS 教學助理，可以幫助您：\n\n📚 **學習輔導**：\n• 回答 MIS 相關問題\n• 解釋複雜概念\n• 提供學習建議\n\n🎯 **錯題學習**：\n• 分析錯誤原因\n• 提供針對性輔導\n• 確保概念理解\n\n💡 **使用技巧**：\n• 直接提問任何 MIS 相關問題\n• 描述您的困惑和疑問\n• 我會根據您的程度調整解釋方式\n\n現在就開始提問吧！我很樂意幫助您學習。');
        }
      } else {
        // 其他類型的會話
        await this.loadLearningProgress();
        await this.loadCurrentQuestion();
        this.addWelcomeMessage();
      }
    } catch (error) {
      console.error('初始化學習會話錯誤:', error);
      this.addMessage('ai', '抱歉，初始化學習會話時發生錯誤。請重試。');
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
    // 如果 learningPath 中有題目，使用第一個題目
    if (this.learningPath && this.learningPath.length > 0) {
      this.currentQuestion = this.learningPath[this.currentQuestionIndex];
    }
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
      
      // 從API獲取真實的錯題資料
      const submissionId = questionId.split('_')[0]; // 從questionId提取submission_id
      const questionNumber = questionId.split('_')[1]; // 提取題目編號
      
      // 調用API獲取提交詳情
      this.dashboardService.getSubmissionDetail(submissionId).subscribe({
        next: (response: any) => {
          if (response?.submission?.question_details) {
            // 找到對應的錯題
            const targetQuestion = response.submission.question_details.find(
              (q: any) => q.question_number === questionNumber && !q.is_correct
            );
            
            if (targetQuestion) {
              this.currentQuestion = {
                question_id: questionId,
                question_text: targetQuestion.question_text,
                user_answer: targetQuestion.student_answer,
                correct_answer: targetQuestion.correct_answer,
                is_correct: false,
                is_marked: false,
                topic: this.extractTopic(targetQuestion),
                difficulty: 3
              };
              this.addWelcomeMessage();
            } else {
              console.error('找不到指定的錯題');
              this.router.navigate(['/dashboard/mistake-analysis']);
            }
          } else {
            console.error('API回應格式錯誤');
            this.router.navigate(['/dashboard/mistake-analysis']);
          }
        },
        error: (error: any) => {
          console.error('獲取錯題詳情失敗:', error);
          this.router.navigate(['/dashboard/mistake-analysis']);
        }
      });
    } catch (error) {
      console.error('初始化錯題復習錯誤:', error);
      this.router.navigate(['/dashboard/mistake-analysis']);
    }
  }

  async initializeBatchReview(mistakeIds: string): Promise<void> {
    try {
      console.log('初始化批量錯題復習:', mistakeIds);
      const ids = mistakeIds.split(',');
      
      // 從第一個錯題ID提取submission_id
      const firstId = ids[0];
      const submissionId = firstId.split('_')[0];
      
      // 調用API獲取提交詳情
      this.dashboardService.getSubmissionDetail(submissionId).subscribe({
        next: (response: any) => {
          if (response?.submission?.question_details) {
            // 構建學習路徑，包含所有指定的錯題
            this.learningPath = [];
            
            ids.forEach(id => {
              const questionNumber = id.split('_')[1];
              const targetQuestion = response.submission.question_details.find(
                (q: any) => q.question_number === questionNumber && !q.is_correct
              );
              
              if (targetQuestion) {
                this.learningPath.push({
                  question_id: id,
                  question_text: targetQuestion.question_text,
                  user_answer: targetQuestion.student_answer,
                  correct_answer: targetQuestion.correct_answer,
                  is_correct: false,
                  is_marked: false,
                  topic: this.extractTopic(targetQuestion),
                  difficulty: 3
                });
              }
            });
            
            if (this.learningPath.length > 0) {
              // 設置第一個錯題為當前題目
              this.currentQuestion = this.learningPath[0];
              this.currentQuestionIndex = 0;
              
              // 設置學習進度
              this.learningProgress = {
                total_questions: this.learningPath.length,
                completed_questions: 0,
                current_question_index: 0,
                progress_percentage: 0,
                remaining_questions: this.learningPath.length,
                session_status: 'mistake_review'
              };
              
              this.addWelcomeMessage();
            } else {
              console.error('沒有找到有效的錯題');
              this.router.navigate(['/dashboard/mistake-analysis']);
            }
          } else {
            console.error('API回應格式錯誤');
            this.router.navigate(['/dashboard/mistake-analysis']);
          }
        },
        error: (error: any) => {
          console.error('獲取錯題詳情失敗:', error);
          this.router.navigate(['/dashboard/mistake-analysis']);
        }
      });
    } catch (error) {
      console.error('初始化批量錯題復習錯誤:', error);
      this.router.navigate(['/dashboard/mistake-analysis']);
    }
  }

  async initializeFromQuizCompletion(queryParams: any): Promise<void> {
    try {
      console.log('從測驗完成導向 AI tutoring');
      
      // 從 sessionStorage 讀取測驗結果資料
      const quizResultData = sessionStorage.getItem('quiz_result_data');
      if (!quizResultData) {
        console.error('找不到測驗結果資料');
        this.router.navigate(['/dashboard/quiz-center']);
        return;
      }
      
      const quizData = JSON.parse(quizResultData);
      console.log('測驗結果資料:', quizData);
      
      // 設置學習進度
      this.learningProgress = {
        total_questions: quizData.wrong_questions?.length || 0,
        completed_questions: 0,
        current_question_index: 0,
        progress_percentage: 0,
        remaining_questions: quizData.wrong_questions?.length || 0,
        session_status: 'quiz_review'
      };
      
      // 設置學習路徑為錯題和標記題目
      this.learningPath = [
        ...(quizData.wrong_questions || []),
        ...(quizData.marked_questions || [])
      ];
      
      // 去除重複的題目
      this.learningPath = this.learningPath.filter((question, index, self) => 
        index === self.findIndex(q => q.question_id === question.question_id)
      );
      
      if (this.learningPath.length > 0) {
        // 設置第一個題目為當前題目
        this.currentQuestion = this.learningPath[0];
        this.currentQuestionIndex = 0;
        
        // 添加歡迎訊息
        this.addQuizCompletionWelcomeMessage(quizData);
      } else {
        // 沒有錯題或標記題目，給予完成訊息
        this.addNoMistakesMessage(quizData);
      }
      
      // 清除 sessionStorage 資料
      sessionStorage.removeItem('quiz_result_data');
      
    } catch (error) {
      console.error('從測驗完成導向 AI tutoring 錯誤:', error);
      this.router.navigate(['/dashboard/quiz-center']);
    }
  }
  
  private addQuizCompletionWelcomeMessage(quizData: any): void {
    const welcomeMessage = `🎉 測驗完成！

**測驗資訊：**
- 測驗標題：${quizData.quiz_title}
- 總題數：${quizData.total_questions}
- 錯題數：${quizData.wrong_questions?.length || 0}
- 標記題數：${quizData.marked_questions?.length || 0}

我將協助您複習答錯和標記的題目，幫助您掌握相關概念。

讓我們開始第一道題目的學習：

**題目：** ${this.currentQuestion?.question_text}

${this.currentQuestion?.user_answer ? `您的答案：${this.currentQuestion.user_answer}` : ''}
${this.currentQuestion?.correct_answer ? `正確答案：${this.currentQuestion.correct_answer}` : ''}

有什麼問題想要問我嗎？`;

    this.addMessage('ai', welcomeMessage);
  }
  
  private addNoMistakesMessage(quizData: any): void {
    const message = `🎉 恭喜！測驗完成！

**測驗資訊：**
- 測驗標題：${quizData.quiz_title}
- 總題數：${quizData.total_questions}
- 表現：沒有錯題需要複習

您的表現很棒！所有題目都答對了，沒有需要特別複習的地方。

如果您想要：
1. 回到測驗中心進行更多測驗
2. 查看錯題統整功能
3. 或者有其他學習相關的問題

隨時告訴我，我很樂意協助您！`;

    this.addMessage('ai', message);
  }

  async initializeFromQuizResult(queryParams: any): Promise<void> {
    try {
      const resultId = queryParams['result_id'];
      if (!resultId) {
        console.error('缺少 result_id 參數');
        return;
      }

      console.log('從測驗結果初始化 AI tutoring，resultId:', resultId);

      // 從後端獲取測驗結果
      const response = await this.ragService.getQuizResult(resultId).toPromise();
      console.log('測驗結果響應:', response);
      
      if (response?.success && response.result) {
        const quizData = response.result;
        console.log('測驗數據:', quizData);
        
        // 提取錯題 - 檢查不同的數據結構
        let wrongQuestions = [];
        
        if (quizData.answers && Array.isArray(quizData.answers)) {
          // 如果是 answers 數組格式
          wrongQuestions = quizData.answers.filter((answer: any) => !answer.is_correct);
        } else if (quizData.wrong_questions && Array.isArray(quizData.wrong_questions)) {
          // 如果是 wrong_questions 數組格式
          wrongQuestions = quizData.wrong_questions;
        } else if (quizData.answers && typeof quizData.answers === 'object') {
          // 如果是 answers 對象格式
          wrongQuestions = Object.values(quizData.answers).filter((answer: any) => !answer.is_correct);
        }
        
        console.log('提取的錯題:', wrongQuestions);
        
        if (wrongQuestions.length === 0) {
          this.addNoMistakesMessage(quizData);
          return;
        }

        // 轉換為 AI tutoring 需要的格式
        this.learningPath = wrongQuestions.map((question: any) => ({
          question_id: question.question_id || question.question_index || '',
          question_text: question.question_text || '',
          user_answer: question.user_answer || '',
          correct_answer: question.correct_answer || '',
          is_correct: false,
          is_marked: false,
          topic: question.topic || '計算機概論',
          difficulty: question.difficulty || 2,
          options: question.options || [],
          image_file: question.image_file || '',
          question_type: question.question_type || 'short-answer'
        }));

        console.log('轉換後的學習路徑:', this.learningPath);

        this.currentQuestionIndex = 0;
        this.currentQuestion = this.learningPath[0];

        // 設置學習進度
        this.learningProgress = {
          total_questions: this.learningPath.length,
          completed_questions: 0,
          current_question_index: 0,
          progress_percentage: 0,
          remaining_questions: this.learningPath.length,
          session_status: 'active'
        };

        // 添加歡迎訊息
        this.addQuizCompletionWelcomeMessage(quizData);
        
        console.log('AI tutoring 初始化完成');
      } else {
        console.error('無法獲取測驗結果:', response?.error);
        this.addMessage('ai', '抱歉，無法載入您的測驗結果。請重試。');
      }
    } catch (error) {
      console.error('初始化從測驗結果錯誤:', error);
      this.addMessage('ai', '載入測驗結果時發生錯誤，請重試。');
    }
  }

  private getResultIdFromSession(): string | null {
    // 嘗試從多個來源獲取result_id
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('result_id');
    
    if (resultId) {
      return resultId;
    }
    
    // 嘗試從localStorage獲取
    const storedResultId = localStorage.getItem('current_result_id');
    if (storedResultId) {
      return storedResultId;
    }
    
    // 嘗試從sessionStorage獲取
    const sessionResultId = sessionStorage.getItem('current_result_id');
    if (sessionResultId) {
      return sessionResultId;
    }
    
    return null;
  }

  // 新增：提取題目主題的輔助方法
  private extractTopic(question: any): string {
    // 從題目文字中提取主題，這裡可以根據實際需求調整
    const questionText = question.question_text || '';
    
    // 簡單的主題提取邏輯
    if (questionText.includes('資料庫') || questionText.includes('SQL')) {
      return '資料庫管理';
    } else if (questionText.includes('網路') || questionText.includes('TCP') || questionText.includes('IP')) {
      return '網路技術';
    } else if (questionText.includes('作業系統') || questionText.includes('OS')) {
      return '作業系統';
    } else if (questionText.includes('程式') || questionText.includes('Java') || questionText.includes('Python')) {
      return '程式設計';
    } else if (questionText.includes('資料結構') || questionText.includes('演算法')) {
      return '資料結構與演算法';
    } else {
      return '計算機概論';
    }
  }
}
