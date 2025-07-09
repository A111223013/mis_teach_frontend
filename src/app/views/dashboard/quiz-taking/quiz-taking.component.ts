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
import { DashboardService } from '../../../service/dashboard.service';
import { Subscription, interval } from 'rxjs';

interface QuizQuestion {
  id: number;
  question_text: string;
  type: 'single-choice' | 'multiple-choice' | 'fill-in-the-blank' | 'true-false' | 'short-answer' | 'long-answer' | 'choice-answer' | 'draw-answer' | 'coding-answer';
  options?: string[];
  image_file?: string;
  correct_answer?: any;
}

interface QuizResponse {
  quiz_id: number;
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
  quizId: number = 0;
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
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id'], 10);
      if (id) {
        this.quizId = id;
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
    
    this.dashboardService.getQuiz(this.quizId).subscribe({
      next: (response: QuizResponse) => {
        this.quizTitle = response.title;
        this.questions = response.questions || [];
        this.timeLimit = response.time_limit || 0;
        
        if (this.questions.length > 0) {
          this.currentQuestion = this.questions[0];
          this.initializeTimer();
        } else {
          this.error = '此測驗沒有題目';
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('載入測驗失敗:', error);
        
        // 檢查是否為 401 錯誤
        if (error.status === 401) {
          console.log('未授權，導向登入頁面');
          this.router.navigate(['/login']);
          return;
        }
        
        this.error = error.error?.message || '載入測驗失敗，請稍後再試';
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
    
    const baseUrl = this.dashboardService.getBaseUrl();
    const url = imageFile.startsWith('http') ? imageFile : `${baseUrl}/static/images/${imageFile}`;
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
    
    // 否則組合API基礎URL
    const baseUrl = this.dashboardService.getBaseUrl();
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
    if (!this.canSubmit()) {
      alert('請至少回答一道題目再提交');
      return;
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    const confirmed = confirm('確定要提交測驗嗎？提交後將無法修改答案。');
    if (!confirmed) return;

    this.isLoading = true;

    // 檢查登入狀態
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('未找到登入 token，導向登入頁面');
      this.router.navigate(['/login']);
      return;
    }

    // 準備提交資料
    const submissionData = {
      quiz_id: this.quizId,
      answers: this.userAnswers,
      time_taken: this.timeLimit > 0 ? (this.timeLimit * 60 - this.timer) : 0
    };

    this.dashboardService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {
        console.log('測驗提交成功:', response);
        alert('測驗提交成功！');
        this.router.navigate(['/dashboard/quiz-center']);
      },
      error: (error: any) => {
        console.error('提交測驗失敗:', error);
        
        // 檢查是否為 401 錯誤
        if (error.status === 401) {
          console.log('未授權，導向登入頁面');
          this.router.navigate(['/login']);
          return;
        }
        
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
}
