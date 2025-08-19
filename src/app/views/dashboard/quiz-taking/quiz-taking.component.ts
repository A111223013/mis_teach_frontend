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
  type: 'single-choice' | 'multiple-choice' | 'fill-in-the-blank' | 'true-false' | 'short-answer' | 'long-answer' | 'choice-answer' | 'draw-answer' | 'coding-answer' | 'group';
  options?: string[];
  image_file?: string;
  correct_answer?: any;
  original_exam_id?: string;
  key_points?: string;
  // 群組題目相關屬性
  group_question_text?: string;
  sub_questions?: SubQuestion[];
}

interface SubQuestion {
  question_number: string;
  question_text: string;
  options: string[];
  answer: string;
  answer_type: string;
  image_file?: string[];
  'detail-answer'?: string;
  'key-points'?: string;
  'difficulty level'?: string;
  'error reason'?: string;
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
  templateId: string = '';  // 考卷模板ID
  quizId: string = '';      // 測驗ID（用於向後兼容）
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
  
  // 添加缺失的属性
  totalQuestions: number = 0;
  answers: any[] = [];
  
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

  // 進度提示相關屬性
  isProgressModalVisible: boolean = false;
  currentProgressStep: number = 0;
  progressMessage: string = '';
  private progressInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const quizId = params['quizId']; // 路由參數名保持不變
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
    this.stopProgressAnimation(); // 確保在組件銷毀時停止動畫
  }

  loadQuiz(): void {
    if (!this.quizId) {
      this.router.navigate(['/dashboard/quiz-center']);
      return;
    }

    // 从路由参数获取基本信息
    const quizType = this.route.snapshot.queryParamMap.get('type');
    const school = this.route.snapshot.queryParamMap.get('school');
    const year = this.route.snapshot.queryParamMap.get('year');
    const department = this.route.snapshot.queryParamMap.get('department');
    const topic = this.route.snapshot.queryParamMap.get('topic');
    const templateId = this.route.snapshot.queryParamMap.get('template_id');
    
    // 设置 templateId
    if (templateId) {
      this.templateId = templateId;
      console.log('✅ 从路由参数获取 template_id:', this.templateId);
    } else {
      console.warn('⚠️ 路由参数中没有 template_id，使用 quizId 作为备选');
      this.templateId = this.quizId;
    }
    
    // 从服务中获取已存储的测验数据
    this.quizService.getCurrentQuizData().subscribe(quizData => {
      console.log('🔍 从服务获取的测验数据:', quizData);
      
      if (quizData && quizData.questions && quizData.questions.length > 0) {
        // 使用已存储的数据
        console.log('✅ 使用已存储的测验数据');
        
        // 设置测验信息
        this.quizTitle = this.generateQuizTitle(quizType, school, year, department, topic);
        this.questions = quizData.questions;
        this.timeLimit = quizData.time_limit || 60;
        this.totalQuestions = this.questions.length;
        
        // 初始化答題狀態
        this.answers = new Array(this.totalQuestions).fill(null);
        this.markedQuestions = {};
        
        // 設置計時器
        this.initializeTimer();
        
        // 載入第一題
        this.currentQuestionIndex = 0;
        this.loadCurrentQuestion();
        
        console.log('✅ 测验加载完成，题目数量:', this.totalQuestions);
        
        // 不要在这里清除数据，等测验完成后再清除
        // this.quizService.clearCurrentQuizData();
        
      } else {
        console.log('❌ 没有找到已存储的测验数据');
        console.log('🔍 调试信息 - quizData:', quizData);
        console.log('🔍 调试信息 - questions:', quizData?.questions);
        console.log('🔍 调试信息 - questions length:', quizData?.questions?.length);
        
        // 檢查是否正在提交測驗，如果是則不重定向
        if (this.isLoading) {
          console.log('🔄 正在提交測驗，等待完成...');
          return;
        }
        
        // 如果不是正在提交，則重定向
        console.log('🔄 重定向到測驗中心');
        alert('測驗數據丟失，請重新創建測驗');
        this.router.navigate(['/dashboard/quiz-center']);
      }
    });
  }

  // 生成测验标题
  private generateQuizTitle(type: string | null, school: string | null, year: string | null, department: string | null, topic: string | null): string {
    if (type === 'pastexam' && school && year && department) {
      return `${school} - ${year}年 - ${department}`;
    } else if (type === 'knowledge' && topic) {
      return `${topic} - 知识测验`;
    } else {
      return '测验';
    }
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

  loadCurrentQuestion(): void {
    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.resetImageLoadState(); // 重置圖片載入狀態
      
      // 預載入新題目的圖片
      if (this.hasQuestionImages()) {
        this.preloadQuestionImages();
      }
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
      'coding-answer': '程式撰寫題',
      'group': '群組題'
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
    console.log(`Debug: 更新文字答案 - 題目 ${this.currentQuestionIndex}, 答案: "${value}"`);
    this.userAnswers[this.currentQuestionIndex] = value;
    console.log(`Debug: 當前用戶答案對象:`, this.userAnswers);
  }

  getTextAnswer(): string {
    const answer = this.userAnswers[this.currentQuestionIndex] || '';
    console.log(`Debug: 獲取文字答案 - 題目 ${this.currentQuestionIndex}, 答案: "${answer}"`);
    return answer;
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

  // 群組題目處理
  getSubQuestionAnswer(subQuestionIndex: number): string {
    const answers = this.userAnswers[this.currentQuestionIndex];
    if (Array.isArray(answers)) {
      return answers[subQuestionIndex] || '';
    }
    return '';
  }

  updateSubQuestionAnswer(subQuestionIndex: number, value: string): void {
    if (!this.currentQuestion) return;
    
    let answers = this.userAnswers[this.currentQuestionIndex];
    if (!Array.isArray(answers)) {
      answers = [];
    }
    
    answers[subQuestionIndex] = value;
    this.userAnswers[this.currentQuestionIndex] = [...answers];
  }

  getSubQuestionTypeDisplayName(answerType: string): string {
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
    return typeMap[answerType] || answerType;
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
    let count = 0;
    Object.keys(this.userAnswers).forEach(key => {
      const questionIndex = parseInt(key);
      const question = this.questions[questionIndex];
      const answer = this.userAnswers[questionIndex];
      
      // 檢查是否有有效答案（包括布爾值false）
      const hasValidAnswer = this.hasValidAnswer(answer, question?.type);
      
      if (hasValidAnswer) {
        if (question?.type === 'group') {
          // 群組題目：檢查是否至少有一個子題有答案
          if (Array.isArray(answer) && answer.some((subAnswer, subIndex) => {
            const subQuestion = question.sub_questions?.[subIndex];
            return this.hasValidAnswer(subAnswer, subQuestion?.answer_type);
          })) {
            count++;
          }
        } else {
          // 一般題目
          count++;
        }
      }
    });
    return count;
  }

  // 檢查是否有有效答案的輔助方法
  private hasValidAnswer(answer: any, questionType?: string): boolean {
    if (answer === undefined || answer === null) {
      return false;
    }
    
    // 對於是非題，布爾值 false 也是有效答案
    if (questionType === 'true-false') {
      return typeof answer === 'boolean';
    }
    
    // 對於其他題型，空字符串視為無答案
    return answer !== '';
  }

  // 檢查指定題目是否已作答（供模板使用）
  isQuestionAnswered(questionIndex: number): boolean {
    const question = this.questions[questionIndex];
    const answer = this.userAnswers[questionIndex];
    return this.hasValidAnswer(answer, question?.type);
  }

  get markedCount(): number {
    return Object.values(this.markedQuestions).filter(marked => marked).length;
  }

  get unansweredCount(): number {
    return this.questions.length - this.answeredCount;
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
    return this.answeredCount > 0;
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
      console.log('Debug: 用戶未登錄，導向登入頁面');
      this.authService.logout();
      return;
    }

    // 檢查 token 是否有效
    if (!this.authService.isTokenValid()) {
      console.log('Debug: Token 無效，導向登入頁面');
      this.authService.logout();
      return;
    }

    console.log('Debug: Token 狀態正常，準備提交測驗');
    
    // 添加詳細的答案調試信息
    console.log('Debug: 答案收集詳情:');
    console.log('  - 總題數:', this.questions.length);
    console.log('  - 當前題目索引:', this.currentQuestionIndex);
    console.log('  - 用戶答案對象:', this.userAnswers);
    console.log('  - 答案鍵值:', Object.keys(this.userAnswers));
    console.log('  - 答案值:', Object.values(this.userAnswers));
    
    // 檢查每題的答案狀態
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      const answer = this.userAnswers[i];
      const hasAnswer = this.hasValidAnswer(answer, question?.type);
      console.log(`  - 題目 ${i}: ${hasAnswer ? '已作答' : '未作答'} (${answer})`);
    }

    // 準備提交資料
    const submissionData = {
      template_id: this.templateId,  // 使用 template_id
      answers: this.userAnswers,
      time_taken: this.timeLimit > 0 ? (this.timeLimit * 60 - this.timer) : 0
    };

    console.log('Debug: 提交資料:', submissionData);
    console.log('Debug: 使用的 template_id:', this.templateId);
    console.log('Debug: 原始 quiz_id:', this.quizId);

    // 顯示進度提示
    this.showProgressModal();

    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {
        // 準備錯題和標記題目的資料
        const wrongQuestions = this.getWrongQuestions();
        const markedQuestions = this.getMarkedQuestions();
        console.debug('[submitQuiz] 錯題資料:', wrongQuestions);
        console.debug('[submitQuiz] 標記題目資料:', markedQuestions);
        
        // 將測驗結果存入 sessionStorage 供 AI tutoring 使用
        const quizResultData = {
          quiz_id: this.templateId,
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
        
        // 隱藏進度提示
        this.hideProgressModal();
        
        // 跳轉到 quiz-result 頁面
        const resultId = response.data?.result_id;
        
        // 在導航成功後清除數據，避免在導航過程中丟失
        this.router.navigate(['/dashboard/quiz-result', resultId]).then(() => {
          // 導航成功後清除數據
          this.quizService.clearCurrentQuizData();
        }).catch(() => {
          // 如果導航失敗，也要清除數據
          this.quizService.clearCurrentQuizData();
        });
      },
      error: (error: any) => {
        console.error('[submitQuiz] 提交測驗失敗:', error);
        this.isLoading = false;
        this.hideProgressModal();
        
        // 顯示錯誤信息
        let errorMessage = '提交測驗失敗';
        if (error.status === 401) {
          errorMessage = '登入已過期，請重新登入';
          this.authService.logout();
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  // 顯示進度提示模態框
  showProgressModal(): void {
    this.isProgressModalVisible = true;
    this.currentProgressStep = 0;
    this.startProgressAnimation();
  }

  // 隱藏進度提示模態框
  hideProgressModal(): void {
    this.isProgressModalVisible = false;
    this.stopProgressAnimation();
  }

  // 開始進度動畫
  startProgressAnimation(): void {
    const progressSteps = [
      '試卷批改中，請稍後...',
      '計算分數中...',
      '評判知識點中...',
      '生成學習計畫中...',
      '完成！'
    ];

    let stepIndex = 0;
    this.currentProgressStep = stepIndex;
    this.progressMessage = progressSteps[stepIndex];

    this.progressInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < progressSteps.length) {
        this.currentProgressStep = stepIndex;
        this.progressMessage = progressSteps[stepIndex];
      } else {
        this.stopProgressAnimation();
      }
    }, 2000); // 每2秒更新一次
  }

  // 停止進度動畫
  stopProgressAnimation(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // 返回測驗中心
  goBack(): void {
    const confirmed = confirm('確定要離開測驗嗎？未保存的答案將會遺失。');
    if (confirmed) {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      // 清除服务中的数据
      this.quizService.clearCurrentQuizData();
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
    
    this.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      
      // 只處理有答案的題目
      if (this.hasValidAnswer(userAnswer, question.type)) {
        const isCorrect = this.checkAnswerCorrectness(question, userAnswer);
        
        if (!isCorrect) {
          wrongQuestions.push({
            question_id: question.id || `q${index + 1}`,
            question_text: question.question_text,
            question_type: question.type,
            user_answer: userAnswer,
            correct_answer: question.correct_answer,
            options: question.options || [],
            image_file: question.image_file || '',
            original_exam_id: question.original_exam_id || '',
            question_index: index
          });
        }
      }
    });
    
    console.log(`Debug: 收集到 ${wrongQuestions.length} 道錯題`);
    return wrongQuestions;
  }

  // 檢查答案正確性
  private checkAnswerCorrectness(question: QuizQuestion, userAnswer: any): boolean {
    const correctAnswer = question.correct_answer;
    
    if (!correctAnswer) {
      return false;
    }
    
    switch (question.type) {
      case 'single-choice':
        return userAnswer === correctAnswer;
        
      case 'multiple-choice':
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort());
        }
        return false;
        
      case 'true-false':
        // 處理布爾值和字符串的轉換
        const userBool = typeof userAnswer === 'boolean' ? userAnswer : 
                        userAnswer === 'true' || userAnswer === 'True' || userAnswer === '是';
        const correctBool = typeof correctAnswer === 'boolean' ? correctAnswer :
                           correctAnswer === 'true' || correctAnswer === 'True' || correctAnswer === '是';
        return userBool === correctBool;
        
      case 'fill-in-the-blank':
      case 'short-answer':
      case 'long-answer':
        const userText = String(userAnswer).trim().toLowerCase();
        const correctText = String(correctAnswer).trim().toLowerCase();
        
        // 完全匹配
        if (userText === correctText) {
          return true;
        }
        
        // 對於較長的答案，檢查關鍵詞匹配
        if (userText.length > 3 && correctText.length > 3) {
          const userWords = new Set(userText.split(/\s+/));
          const correctWords = new Set(correctText.split(/\s+/));
          const intersection = new Set([...userWords].filter(x => correctWords.has(x)));
          const minLength = Math.min(userWords.size, correctWords.size);
          return intersection.size >= minLength * 0.7;
        }
        
        // 對於短答案，允許部分匹配
        if (userText.length <= 3 && correctText.length <= 3) {
          return userText.includes(correctText) || correctText.includes(userText);
        }
        
        return false;
        
      case 'group':
        // 群組題目答案檢查
        if (!Array.isArray(userAnswer) || !question.sub_questions) {
          return false;
        }
        
        let correctCount = 0;
        const totalSubQuestions = question.sub_questions.length;
        
        question.sub_questions.forEach((subQuestion, index) => {
          const subUserAnswer = userAnswer[index];
          const subCorrectAnswer = subQuestion.answer;
          
          if (subUserAnswer && subCorrectAnswer) {
            // 根據子題目類型檢查答案
            switch (subQuestion.answer_type) {
              case 'single-choice':
                if (subUserAnswer === subCorrectAnswer) {
                  correctCount++;
                }
                break;
              case 'short-answer':
              case 'long-answer':
              case 'fill-in-the-blank':
                const subUserText = String(subUserAnswer).trim().toLowerCase();
                const subCorrectText = String(subCorrectAnswer).trim().toLowerCase();
                if (subUserText === subCorrectText || 
                    subUserText.includes(subCorrectText) || 
                    subCorrectText.includes(subUserText)) {
                  correctCount++;
                }
                break;
              default:
                if (subUserAnswer === subCorrectAnswer) {
                  correctCount++;
                }
            }
          }
        });
        
        // 如果超過 70% 的子題答對，則認為群組題答對
        return correctCount >= totalSubQuestions * 0.7;
        
      default:
        return userAnswer === correctAnswer;
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
    
    return markedQuestions;
  }
}
