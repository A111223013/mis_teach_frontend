import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardModule,
  ButtonModule,
  GridModule,
  ProgressModule,
  BadgeModule,
  AlertModule,
  ModalModule,
  TooltipModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { QuizService } from '../../../service/quiz.service';
import { AuthService } from '../../../service/auth.service';
import { Subscription, interval } from 'rxjs';

interface QuizQuestion {
  id: number;
  question_text: string;
  type: 'single-choice' | 'multiple-choice' | 'fill-in-the-blank' | 'true-false' | 'short-answer' | 'long-answer' | 'choice-answer' | 'draw-answer' | 'coding-answer';
  options?: string[];
  image_file?: string;
  correct_answer?: any;
  original_exam_id?: string;
}

interface QuizResponse {
  quiz_id: string;
  title: string;
  questions: QuizQuestion[];
  time_limit?: number;
}

@Component({
  selector: 'app-quiz-taking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    AlertModule,
    ModalModule,
    TooltipModule,
    IconModule
  ],
  templateUrl: './quiz-taking.component.html',
  styleUrls: ['./quiz-taking.component.css']
})
export class QuizTakingComponent implements OnInit, OnDestroy {
  quizId: string = '';
  quizTitle: string = '';
  questions: QuizQuestion[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: QuizQuestion | null = null;
  userAnswers: { [key: number]: any } = {};
  markedQuestions: { [key: number]: boolean } = {};
  timer: number = 0;
  timeLimit: number = 0;
  isLoading: boolean = true;
  error: string = '';
  showSubmitConfirmation: boolean = false;
  
  // 路由參數 (為了與舊模板兼容)
  quizType: 'knowledge' | 'pastexam' = 'knowledge';
  topic: string = '';
  difficulty: string = '';
  count: string = '';
  school: string = '';
  year: string = '';
  department: string = '';
  
  private timerSubscription?: Subscription;
  private imageLoadState = new Map<string, 'loading' | 'loaded' | 'error'>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const quizId = params['quizId']; // 修改：使用正確的參數名稱 'quizId'
      if (quizId) {
        this.quizId = quizId;
        this.loadQuiz();
      } else {
        this.error = '無效的測驗ID';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadQuiz(): void {
    this.isLoading = true;
    this.error = '';
    
    console.log('🔍 開始載入測驗，quiz ID:', this.quizId);
    
    // 檢查登錄狀態
    if (!this.authService.isLoggedIn()) {
      this.error = '請先登錄';
      this.isLoading = false;
      this.authService.logout();
      return;
    }
    
    this.quizService.getQuiz(this.quizId).subscribe({
      next: (response: QuizResponse) => {
        console.log('✅ 測驗 API 回應:', response);
        
        if (!response) {
          console.error('❌ API 回應為空');
          this.error = '測驗數據載入失敗：API 回應為空';
          this.isLoading = false;
          return;
        }
        
        if (!response.questions || !Array.isArray(response.questions)) {
          console.error('❌ 測驗題目數據格式錯誤:', response);
          this.error = '測驗題目格式錯誤，請聯繫管理員';
          this.isLoading = false;
          return;
        }
        
        this.quizTitle = response.title || '未命名測驗';
        this.questions = response.questions;
        this.timeLimit = response.time_limit || 0;
        
        console.log('📊 測驗基本資訊:');
        console.log('  - 標題:', this.quizTitle);
        console.log('  - 題目數量:', this.questions.length);
        console.log('  - 時間限制:', this.timeLimit, '分鐘');
        
        if (this.questions.length > 0) {
          this.currentQuestion = this.questions[0];
          this.resetImageLoadState();
          this.initializeTimer();
          console.log('✅ 測驗載入成功');
          
          if (this.hasQuestionImages()) {
            this.preloadQuestionImages();
          }
        } else {
          console.warn('⚠️ 測驗沒有題目');
          this.error = '此測驗沒有題目，請聯繫管理員';
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ 載入測驗失敗:', error);
        
        if (error.status === 404) {
          this.error = `測驗 ID ${this.quizId} 不存在或已被刪除`;
        } else if (error.status === 500) {
          this.error = '伺服器內部錯誤，請稍後再試';
        } else if (error.status === 0) {
          this.error = '網路連線錯誤，請檢查網路連接';
        } else {
          this.error = error.error?.message || `載入測驗失敗 (錯誤代碼: ${error.status})`;
        }
        
        this.isLoading = false;
      }
    });
  }

  initializeTimer(): void {
    if (this.timeLimit > 0) {
      this.timer = this.timeLimit * 60; // 轉換為秒
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timer--;
        if (this.timer <= 0) {
          this.submitQuiz();
        }
      });
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.currentQuestion = this.questions[index];
      this.resetImageLoadState(); // 重置圖片載入狀態
      
      // 預載入新題目的圖片
      if (this.hasQuestionImages()) {
        this.preloadQuestionImages();
      }
      
      console.log(`📝 切換到題目 ${index + 1}: ${this.currentQuestion.question_text?.substring(0, 50)}...`);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  }

  toggleMarkQuestion(): void {
    this.markedQuestions[this.currentQuestionIndex] = !this.markedQuestions[this.currentQuestionIndex];
  }

  getQuestionType(question: QuizQuestion): string {
    return question.type || 'single-choice';
  }

  getQuestionTypeDisplayName(type: string): string {
    const typeMap: { [key: string]: string } = {
      'single-choice': '單選題',
      'multiple-choice': '多選題',
      'fill-in-the-blank': '填空題',
      'true-false': '是非題',
      'short-answer': '簡答題',
      'long-answer': '長答題',
      'choice-answer': '選填題',
      'draw-answer': '畫圖題',
      'coding-answer': '程式撰寫題'
    };
    return typeMap[type] || type;
  }

  // 單選題處理
  selectSingleChoice(option: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = option;
  
  }

  isSingleChoiceSelected(option: string): boolean {
    return this.userAnswers[this.currentQuestionIndex] === option;
  }

  // 多選題處理
  toggleMultipleChoice(option: string): void {
    if (!this.currentQuestion) return;
    
    let answers = this.userAnswers[this.currentQuestionIndex] || [];
    if (!Array.isArray(answers)) {
      answers = [];
    }
    
    const index = answers.indexOf(option);
    if (index > -1) {
      answers.splice(index, 1);
    } else {
      answers.push(option);
    }
    
    this.userAnswers[this.currentQuestionIndex] = [...answers];
  }

  isMultipleChoiceSelected(option: string): boolean {
    const answers = this.userAnswers[this.currentQuestionIndex];
    return Array.isArray(answers) && answers.includes(option);
  }

  // 是非題處理
  selectTrueFalse(value: boolean): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  isTrueFalseSelected(value: boolean): boolean {
    return this.userAnswers[this.currentQuestionIndex] === value;
  }

  // 填空題、簡答題、長答題處理
  updateTextAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  getTextAnswer(): string {
    return this.userAnswers[this.currentQuestionIndex] || '';
  }

  // 程式撰寫題處理
  updateCodingAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  getCodingAnswer(): string {
    return this.userAnswers[this.currentQuestionIndex] || '';
  }

  // 選填題處理
  updateChoiceAnswer(index: number, value: string): void {
    if (!this.currentQuestion) return;
    
    let answers = this.userAnswers[this.currentQuestionIndex] || [];
    if (!Array.isArray(answers)) {
      answers = [];
    }
    
    answers[index] = value;
    this.userAnswers[this.currentQuestionIndex] = [...answers];
  }

  getChoiceAnswer(index: number): string {
    const answers = this.userAnswers[this.currentQuestionIndex];
    return Array.isArray(answers) ? (answers[index] || '') : '';
  }

  // 畫圖題處理
  updateDrawAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  getDrawAnswer(): string {
    return this.userAnswers[this.currentQuestionIndex] || '';
  }

  // 通用答案處理
  getCustomAnswer(): any {
    return this.userAnswers[this.currentQuestionIndex];
  }

  updateCustomAnswer(value: any): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  // 圖片處理
  hasQuestionImages(): boolean {
    if (!this.currentQuestion?.image_file) return false;
    const imageFile = typeof this.currentQuestion.image_file === 'string' ? 
                      this.currentQuestion.image_file.trim() : '';
    return imageFile !== '';
  }

  getQuestionImageUrls(): string[] {
    if (!this.currentQuestion?.image_file) return [];
    
    const imageFile = typeof this.currentQuestion.image_file === 'string' ? 
                      this.currentQuestion.image_file.trim() : '';
    if (!imageFile) return [];
    
    // 如果是完整URL，直接返回
    if (imageFile.startsWith('http')) {
      return [imageFile];
    }
    
    // 使用後端的靜態圖片服務
    const baseUrl = this.quizService.getBaseUrl();
    const url = `${baseUrl}/static/images/${imageFile}`;
    console.log(`🖼️ 組合圖片URL: ${url}`);
    return [url];
  }

  getImageUrl(imageFile: string): string {
    if (!imageFile) return '';
    
    // 清理檔名
    const cleanImageFile = typeof imageFile === 'string' ? imageFile.trim() : '';
    if (!cleanImageFile) return '';
    
    // 如果已經是完整URL，直接返回
    if (cleanImageFile.startsWith('http')) {
      return cleanImageFile;
    }
    
    // 使用後端的靜態圖片服務
    const baseUrl = this.quizService.getBaseUrl();
    return `${baseUrl}/static/images/${cleanImageFile}`;
  }

  onImageError(event: any): void {
    console.log('圖片載入失敗:', event.target.src);
    const imageUrl = event.target.src;
    this.imageLoadState.set(imageUrl, 'error');
    event.target.style.display = 'none';
  }

  onImageLoad(event: any): void {
    const imageUrl = event.target.src;
    this.imageLoadState.set(imageUrl, 'loaded');
  }

  isImageLoaded(imageUrl: string): boolean {
    return this.imageLoadState.get(imageUrl) === 'loaded';
  }

  isImageError(imageUrl: string): boolean {
    return this.imageLoadState.get(imageUrl) === 'error';
  }

  // 重置圖片載入狀態（切換題目時調用）
  private resetImageLoadState(): void {
    this.imageLoadState.clear();
  }

  // 預載入圖片
  private preloadQuestionImages(): void {
    const imageUrls = this.getQuestionImageUrls();
    if (imageUrls.length > 0) {
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        img.onload = () => this.imageLoadState.set(url, 'loaded');
        img.onerror = () => this.imageLoadState.set(url, 'error');
      });
    }
  }

  // 計算已作答和已標記的題目數量
  get answeredCount(): number {
    return Object.keys(this.userAnswers).length;
  }

  get markedCount(): number {
    return Object.values(this.markedQuestions).filter(marked => marked).length;
  }

  // 時間格式化
  formatTime(seconds: number): string {
    if (seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // 檢查是否可以提交
  canSubmit(): boolean {
    return Object.keys(this.userAnswers).length > 0;
  }

  // 提交測驗
  submitQuiz(): void {
    console.debug('[submitQuiz] 進入 submitQuiz 方法');
    if (!this.canSubmit()) {
      console.debug('[submitQuiz] 無法提交，尚未作答任何題目');
      alert('請至少回答一道題目再提交');
      return;
    }

    if (this.timerSubscription) {
      console.debug('[submitQuiz] 取消計時器訂閱');
      this.timerSubscription.unsubscribe();
    }

    const confirmed = confirm('確定要提交測驗嗎？提交後將無法修改答案。');
    console.debug(`[submitQuiz] 使用者確認提交: ${confirmed}`);
    if (!confirmed) return;

    this.isLoading = true;

    // 檢查登入狀態
    if (!this.authService.isLoggedIn()) {
      console.debug('[submitQuiz] 登入狀態無效，導向登入頁面');
      this.authService.logout();
      return;
    }

    // 準備提交資料
    const submissionData = {
      quiz_id: this.quizId,
      answers: this.userAnswers,
      time_taken: this.timeLimit > 0 ? (this.timeLimit * 60 - this.timer) : 0
    };
    console.log('[submitQuiz] 準備提交資料:', submissionData);

    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {
        console.log('測驗提交成功:', response);
        
        // 準備錯題和標記題目的資料
        const wrongQuestions = this.getWrongQuestions();
        const markedQuestions = this.getMarkedQuestions();
        console.debug('[submitQuiz] 錯題資料:', wrongQuestions);
        console.debug('[submitQuiz] 標記題目資料:', markedQuestions);
        
        // 將測驗結果存入 sessionStorage 供 AI tutoring 使用
        const quizResultData = {
          quiz_id: this.quizId,
          quiz_title: this.quizTitle,
          quiz_type: this.quizType,
          total_questions: this.questions.length,
          wrong_questions: wrongQuestions,
          marked_questions: markedQuestions,
          submission_id: response.submission_id,
          user_answers: this.userAnswers,
          time_taken: submissionData.time_taken
        };
        console.debug('[submitQuiz] 存入 sessionStorage 的 quizResultData:', quizResultData);
        
        sessionStorage.setItem('quiz_result_data', JSON.stringify(quizResultData));
        
        // 導向 AI tutoring 頁面，傳遞 session ID
        const sessionId = response.submission_id || `session_${Date.now()}`;
        console.debug(`[submitQuiz] 導向 AI tutoring 頁面，sessionId: ${sessionId}`);
        this.router.navigate(['/dashboard/ai-tutoring', sessionId], {
          queryParams: { 
            source: 'quiz_completion',
            quiz_id: this.quizId,
            quiz_type: this.quizType 
          }
        });
      },
      error: (error: any) => {
        console.error('提交測驗失敗:', error);
        this.isLoading = false;
        alert(error.error?.message || '提交失敗，請稍後再試');
      }
    });
  }

  // 返回測驗中心
  goBack(): void {
    const confirmed = confirm('確定要離開測驗嗎？未保存的答案將會遺失。');
    if (confirmed) {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.router.navigate(['/dashboard/quiz-center']);
    }
  }

  // 通用選擇答案方法（兼容舊模板）
  selectAnswer(option: string): void {
    this.selectSingleChoice(option);
  }

  // 繪圖相關方法
  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private isDrawing = false;
  brushSize = 3;

  startDrawing(event: MouseEvent): void {
    if (!this.canvas || !this.ctx) {
      this.setupCanvas();
    }
    
    if (this.ctx) {
      this.isDrawing = true;
      const rect = this.canvas!.getBoundingClientRect();
      this.ctx.beginPath();
      this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.ctx || !this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000';
    
    this.ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
  }

  stopDrawing(): void {
    if (this.ctx) {
      this.isDrawing = false;
      this.ctx.beginPath();
    }
  }

  clearCanvas(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  saveDrawing(): void {
    if (this.canvas) {
      const dataURL = this.canvas.toDataURL('image/png');
      this.userAnswers[this.currentQuestionIndex] = dataURL;
    }
  }

  private setupCanvas(): void {
    const canvasElement = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvasElement) {
      this.canvas = canvasElement;
      const context = this.canvas.getContext('2d');
      if (context) {
        this.ctx = context;
      }
    }
  }

  // 為了與舊模板兼容的方法
  getSchoolName(): string {
    const schoolNames: Record<string, string> = {
      'ntust': '國立臺灣科技大學',
      'nthu': '國立清華大學',
      'ntu': '國立臺灣大學',
      'ncku': '國立成功大學',
      'nctu': '國立交通大學'
    };
    return schoolNames[this.school] || this.school;
  }
  
  getTopicName(): string {
    const topicNames: Record<string, string> = {
      'database': '資料庫',
      'network': '網路',
      'algorithm': '演算法',
      'security': '資訊安全',
      'software': '軟體工程'
    };
    return topicNames[this.topic] || this.topic;
  }

  // 獲取錯題資料
  private getWrongQuestions(): any[] {
    const wrongQuestions: any[] = [];
    
    Object.keys(this.userAnswers).forEach(questionIndex => {
      const questionIdx = parseInt(questionIndex);
      const question = this.questions[questionIdx];
      const userAnswer = this.userAnswers[questionIdx];
      
      if (question && userAnswer !== null && userAnswer !== undefined && userAnswer !== '') {
        // 檢查答案是否正確
        const isCorrect = this.checkAnswerCorrectness(question, userAnswer);
        
        if (!isCorrect) {
          wrongQuestions.push({
            question_id: question.id,
            question_text: question.question_text,
            question_type: question.type,
            user_answer: userAnswer,
            correct_answer: question.correct_answer,
            options: question.options || [],
            image_file: question.image_file || '',
            original_exam_id: question.original_exam_id || '',
            question_index: questionIdx
          });
        }
      }
    });
    
    console.log(`🔍 找到 ${wrongQuestions.length} 道錯題:`, wrongQuestions);
    return wrongQuestions;
  }

  // 檢查答案正確性
  private checkAnswerCorrectness(question: QuizQuestion, userAnswer: any): boolean {
    const correctAnswer = question.correct_answer;
    
    if (!correctAnswer) {
      // 如果沒有正確答案，暫時視為錯誤以便AI教學
      return false;
    }

    switch (question.type) {
      case 'single-choice':
        return userAnswer === correctAnswer;
        
      case 'multiple-choice':
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          return userAnswer.sort().join(',') === correctAnswer.sort().join(',');
        }
        return false;
        
      case 'true-false':
        return userAnswer === correctAnswer || 
               (userAnswer === true && (correctAnswer === '是' || correctAnswer === 'True' || correctAnswer === true)) ||
               (userAnswer === false && (correctAnswer === '否' || correctAnswer === 'False' || correctAnswer === false));
        
      case 'fill-in-the-blank':
      case 'short-answer':
      case 'long-answer':
        // 對於文字答案，進行簡單的比較（可以後續改進為語義比較）
        const userText = userAnswer.toString().trim().toLowerCase();
        const correctText = correctAnswer.toString().trim().toLowerCase();
        return userText === correctText || userText.includes(correctText) || correctText.includes(userText);
        
      default:
        // 對於其他類型，暫時視為錯誤以便AI教學
        return false;
    }
  }

  // 獲取標記題目資料
  private getMarkedQuestions(): any[] {
    const markedQuestions: any[] = [];
    
    Object.keys(this.markedQuestions).forEach(questionIndex => {
      const questionIdx = parseInt(questionIndex);
      if (this.markedQuestions[questionIdx]) {
        const question = this.questions[questionIdx];
        const userAnswer = this.userAnswers[questionIdx];
        
        if (question) {
          markedQuestions.push({
            question_id: question.id,
            question_text: question.question_text,
            question_type: question.type,
            user_answer: userAnswer,
            correct_answer: question.correct_answer,
            options: question.options || [],
            image_file: question.image_file || '',
            original_exam_id: question.original_exam_id || '',
            question_index: questionIdx
          });
        }
      }
    });
    
    console.log(`🏷️ 找到 ${markedQuestions.length} 道標記題目:`, markedQuestions);
    return markedQuestions;
  }
}
