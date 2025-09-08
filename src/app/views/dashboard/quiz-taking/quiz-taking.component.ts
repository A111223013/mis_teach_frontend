import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { AiQuizService } from '../../../service/ai-quiz.service';
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
  
  // 新增：每題作答時間記錄（秒數）
  questionAnswerTimes: { [key: number]: number } = {};  // 每題累積作答時間（秒）
  questionStartTimes: { [key: number]: number } = {};   // 每題開始時間戳（毫秒）
  questionPauseTimes: { [key: number]: number } = {};   // 每題暫停時間戳（毫秒）
  questionIsActive: { [key: number]: boolean } = {};    // 每題是否正在作答中
  
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
  
  // 新增：後端進度追蹤相關屬性
  private progressId: string = '';
  private eventSource: EventSource | null = null;
  private isProgressConnected: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private authService: AuthService,
    private aiQuizService: AiQuizService,
    private cdr: ChangeDetectorRef
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
    this.disconnectProgressTracking(); // 確保在組件銷毀時斷開進度追蹤
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
        this.isLoading = false;
        
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
        
        // 檢查是否已經完成測驗，如果是則不顯示錯誤提示
        const quizResultDataStr = sessionStorage.getItem('quiz_result_data');
        if (quizResultDataStr) {
          try {
            const quizResultData = JSON.parse(quizResultDataStr);
            if (quizResultData.result_id && quizResultData.result_id !== 'undefined') {
              console.log('✅ 測驗已完成，直接跳轉到結果頁面');
              this.router.navigate(['/dashboard/quiz-result', quizResultData.result_id]);
              return;
            }
          } catch (error) {
            console.error('❌ 解析測驗結果數據失敗:', error);
          }
        }
        
        // 如果不是正在提交且沒有完成，則重定向
        console.log('🔄 重定向到測驗中心');
        this.isLoading = false;
        // 移除alert，直接跳轉
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

  // 載入指定題目
  loadCurrentQuestion(): void {
    if (this.questions.length === 0) return;
    
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    
    // 新增：記錄題目開始作答時間（第一題計時器啟動）
    this.recordQuestionStartTime(this.currentQuestionIndex);
    
    this.cdr.detectChanges();
  }
  
  // 新增：記錄題目開始作答時間
  recordQuestionStartTime(questionIndex: number): void {
    if (!this.questionStartTimes[questionIndex]) {
      // 第一次進入題目
      this.questionStartTimes[questionIndex] = new Date().getTime();
      this.questionIsActive[questionIndex] = true;
      this.questionAnswerTimes[questionIndex] = 0; // 初始化累積時間
    } else {
      // 重新進入題目，從暫停的地方繼續
      if (!this.questionIsActive[questionIndex]) {
        // 計算暫停期間的時間，加到累積時間中
        const pauseTime = this.questionPauseTimes[questionIndex] || 0;
        const currentTime = new Date().getTime();
        const pauseDuration = Math.floor((currentTime - pauseTime) / 1000);
        
        // 更新累積作答時間
        this.questionAnswerTimes[questionIndex] = (this.questionAnswerTimes[questionIndex] || 0) + pauseDuration;
        
        // 重新開始計時
        this.questionStartTimes[questionIndex] = currentTime;
        this.questionIsActive[questionIndex] = true;
      }
    }
  }
  
  // 新增：記錄題目暫停作答時間
  recordQuestionPauseTime(questionIndex: number): void {
    if (this.questionIsActive[questionIndex]) {
      this.questionPauseTimes[questionIndex] = new Date().getTime();
      this.questionIsActive[questionIndex] = false;
      
      // 計算當前階段的作答時間，加到累積時間中
      const startTime = this.questionStartTimes[questionIndex];
      const currentTime = new Date().getTime();
      const currentDuration = Math.floor((currentTime - startTime) / 1000);
      
      // 更新累積作答時間
      this.questionAnswerTimes[questionIndex] = (this.questionAnswerTimes[questionIndex] || 0) + currentDuration;
    }
  }
  
  // 新增：記錄題目完成作答時間
  recordQuestionEndTime(questionIndex: number): void {
    if (this.questionIsActive[questionIndex]) {
      const startTime = this.questionStartTimes[questionIndex];
      const endTime = new Date().getTime();
      const currentDuration = Math.floor((endTime - startTime) / 1000);
      
      // 更新累積作答時間
      this.questionAnswerTimes[questionIndex] = (this.questionAnswerTimes[questionIndex] || 0) + currentDuration;
      this.questionIsActive[questionIndex] = false;
    }
  }
  
  // 新增：獲取題目當前累積作答時間（秒）
  getQuestionAnswerTime(questionIndex: number): number {
    return this.questionAnswerTimes[questionIndex] || 0;
  }
  
  // 新增：獲取題目當前活動狀態
  isQuestionActive(questionIndex: number): boolean {
    return this.questionIsActive[questionIndex] || false;
  }
  
  // 新增：格式化作答時間
  formatAnswerTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    } else {
      return `${remainingSeconds}秒`;
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      // 暫停當前題目的計時器
      if (this.currentQuestionIndex !== index) {
        this.recordQuestionPauseTime(this.currentQuestionIndex);
      }
      
      this.currentQuestionIndex = index;
      this.currentQuestion = this.questions[index];
      this.resetImageLoadState(); // 重置圖片載入狀態
      
      // 預載入新題目的圖片
      if (this.hasQuestionImages()) {
        this.preloadQuestionImages();
      }
      
      // 開始新題目的計時器
      this.recordQuestionStartTime(index);
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

  // 判斷是否為AI生成的題目
  isAIQuiz(): boolean {
    return !!(this.templateId && this.templateId.startsWith('ai_template_'));
  }

  // 提交測驗
  submitQuiz(): void {
    console.debug('[submitQuiz] 進入 submitQuiz 方法');
    
    // 記錄當前題目的完成時間
    this.recordQuestionEndTime(this.currentQuestionIndex);
    
    // 檢查是否有未作答的題目
    const unansweredQuestions = [];
    for (let i = 0; i < this.questions.length; i++) {
      if (!this.userAnswers[i] || this.userAnswers[i] === '') {
        unansweredQuestions.push(i);
        // 對於未作答題目，如果還在計時中，則暫停計時
        if (this.questionIsActive[i]) {
          this.recordQuestionPauseTime(i);
        }
      }
    }
    
    if (unansweredQuestions.length > 0) {
      const confirmSubmit = confirm(`您還有 ${unansweredQuestions.length} 題未作答，確定要提交嗎？`);
      if (!confirmSubmit) {
        return;
      }
    }
    
    // 準備提交資料
    const submissionData = {
      template_id: this.templateId,  // 使用 template_id
      answers: this.userAnswers,
      time_taken: this.timeLimit > 0 ? (this.timeLimit * 60 - this.timer) : 0,
      questions: this.questions,  // 新增：傳遞完整的題目數據
      question_answer_times: this.questionAnswerTimes  // 新增：傳遞每題作答時間（秒）
    };

    console.log('Debug: 提交資料:', submissionData);
    console.log('Debug: 使用的 template_id:', this.templateId);
    console.log('Debug: 原始 quiz_id:', this.quizId);
    console.log('Debug: 每題作答時間（秒）:', this.questionAnswerTimes);
    console.log('Debug: 每題活動狀態:', this.questionIsActive);
    
    // 新增：調試作答時間數據
    console.log('🔍 Debug: 檢查作答時間數據:');
    for (let i = 0; i < this.questions.length; i++) {
      const answerTime = this.questionAnswerTimes[i] || 0;
      const isActive = this.questionIsActive[i] || false;
      const startTime = this.questionStartTimes[i];
      console.log(`  題目 ${i}: 作答時間=${answerTime}秒, 活動狀態=${isActive}, 開始時間=${startTime}`);
    }

    // 顯示進度提示
    this.showProgressModal();

    // 判斷是否為AI題目，使用不同的提交邏輯
    if (this.isAIQuiz()) {
      console.log('🎯 檢測到AI題目，使用AI Quiz服務提交');
      this.submitAIQuiz(submissionData);
    } else {
      console.log('📝 傳統題目，使用Quiz服務提交');
      this.submitTraditionalQuiz(submissionData);
    }
  }

  // 提交AI題目 - 按照quiz.py的流程
  private submitAIQuiz(submissionData: any): void {
    
    // 直接調用後端的submit_quiz API，讓後端處理AI題目的提交流程
    // 這樣可以確保AI題目和傳統題目使用相同的提交流程
    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {
        console.log('✅ AI題目提交成功:', response);
        
        // 獲取進度追蹤ID
        const progressId = response.data?.progress_id;
        if (progressId) {
          console.log('🎯 開始進度追蹤，progress_id:', progressId);
          // 連接後端進度追蹤
          this.connectProgressTracking(progressId);
        } else {
          console.warn('⚠️ 沒有收到progress_id，使用默認進度顯示');
          // 如果沒有progress_id，隱藏進度提示並直接跳轉
          this.hideProgressModal();
        }
        
        // 準備錯題和標記題目的資料
        const wrongQuestions = this.getWrongQuestions();
        const markedQuestions = this.getMarkedQuestions();
        console.debug('[submitAIQuiz] 錯題資料:', wrongQuestions);
        console.debug('[submitAIQuiz] 標記題目資料:', markedQuestions);
        
        // 將測驗結果存入 sessionStorage 供 AI tutoring 使用
        const quizResultData = {
          quiz_id: this.templateId,
          quiz_title: this.quizTitle,
          quiz_type: 'ai_generated',
          total_questions: this.questions.length,
          wrong_questions: wrongQuestions,
          marked_questions: markedQuestions,
          submission_id: response.submission_id,
          result_id: response.data?.result_id,
          user_answers: this.userAnswers,
          time_taken: submissionData.time_taken,
          question_answer_times: this.questionAnswerTimes
        };
        console.debug('[submitAIQuiz] 存入 sessionStorage 的 quizResultData:', quizResultData);
        
        sessionStorage.setItem('quiz_result_data', JSON.stringify(quizResultData));
        
        // 注意：現在不立即跳轉，而是等待進度追蹤完成後再跳轉
        // 進度追蹤完成後會在 handleProgressUpdate 中處理跳轉
        
      },
      error: (error: any) => {
        console.error('❌ AI題目提交失敗:', error);
        
        // 隱藏進度提示
        this.hideProgressModal();
        
        // 顯示錯誤信息
        let errorMessage = '提交AI題目失敗';
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

  // 處理AI測驗結果（參考quiz.py的流程）
  private processAIQuizResult(submissionData: any, analysisResponse: any, sessionResponse: any): void {
    console.log('🔄 處理AI測驗結果...');
    
    // 模擬quiz.py的完整提交流程
    
    // 階段1: 試卷批改 - 獲取題目數據
    console.log('🔄 階段1: 試卷批改 - 獲取題目數據');
    
    // 階段2: 計算分數 - 分類題目
    console.log('🔄 階段2: 計算分數 - 分類題目');
    const { correctCount, wrongCount, totalScore, wrongQuestions, answeredCount, unansweredCount } = this.calculateAIQuizScore();
    
    // 階段3: 評判知識點 - AI評分
    console.log('🔄 階段3: 評判知識點 - AI評分');
    
    // 階段4: 生成學習計畫 - 統計結果
    console.log('🔄 階段4: 生成學習計畫 - 統計結果');
    
    // 計算統計數據（類似quiz.py的計算邏輯）
    const totalQuestions = this.questions.length;
    const accuracyRate = (correctCount / totalQuestions * 100) || 0;
    const averageScore = (totalScore / answeredCount) || 0;
    
    // 準備測驗結果數據（完全參考quiz.py的結果格式）
    const quizResultData = {
      // 基本測驗信息
      template_id: this.templateId,
      quiz_history_id: `ai_${Date.now()}`, // AI題目使用時間戳作為ID
      result_id: `ai_result_${Date.now()}`,
      progress_id: `ai_progress_${Date.now()}`,
      
      // 題目統計
      total_questions: totalQuestions,
      answered_questions: answeredCount,
      unanswered_questions: unansweredCount,
      correct_count: correctCount,
      wrong_count: wrongCount,
      marked_count: this.getMarkedQuestions().length,
      
      // 分數統計
      accuracy_rate: Math.round(accuracyRate * 100) / 100,
      average_score: Math.round(averageScore * 100) / 100,
      total_score: totalScore,
      
      // 時間統計
      time_taken: submissionData.time_taken,
      total_time: submissionData.time_taken,
      
      // 詳細結果
      detailed_results: this.questions.map((q, i) => ({
        question_index: i,
        question_text: q.question_text,
        user_answer: this.userAnswers[i] || '',
        correct_answer: q.correct_answer,
        is_correct: this.userAnswers[i] === q.correct_answer,
        score: this.userAnswers[i] === q.correct_answer ? 100 : 0,
        feedback: analysisResponse.analysis || {}
      })),
      
      // 評分階段信息
      grading_stages: [
        { stage: 1, name: '試卷批改', status: 'completed', description: '獲取題目數據完成' },
        { stage: 2, name: '計算分數', status: 'completed', description: '題目分類完成' },
        { stage: 3, name: '評判知識點', status: 'completed', description: `AI評分完成，共評分${answeredCount}題` },
        { stage: 4, name: '生成學習計畫', status: 'completed', description: `統計完成，正確率${accuracyRate.toFixed(1)}%` }
      ],
      
      // AI相關數據
      ai_analysis: analysisResponse.analysis,
      learning_session: sessionResponse.session_data,
      wrong_questions: wrongQuestions,
      user_answers: this.userAnswers,
      question_answer_times: this.questionAnswerTimes,
      submit_time: new Date().toISOString()
    };
    
    console.log('📊 AI測驗結果:', quizResultData);
    
    // 存入sessionStorage（類似quiz.py的數據存儲）
    sessionStorage.setItem('quiz_result_data', JSON.stringify(quizResultData));
    
    // 隱藏進度提示
    this.hideProgressModal();
    
    // 跳轉到AI輔導頁面（類似quiz.py的結果頁面跳轉）
    this.router.navigate(['/dashboard/ai-tutoring'], {
      queryParams: {
        mode: 'ai_quiz_review',
        sessionId: sessionResponse.session_data?.session_id,
        questionId: this.templateId,
        resultData: JSON.stringify(quizResultData)
      }
    });
  }

  // 計算AI測驗分數（參考quiz.py的評分邏輯）
  private calculateAIQuizScore(): { correctCount: number, wrongCount: number, totalScore: number, wrongQuestions: any[], answeredCount: number, unansweredCount: number } {
    let correctCount = 0;
    let wrongCount = 0;
    let totalScore = 0;
    let answeredCount = 0;
    let unansweredCount = 0;
    const wrongQuestions: any[] = [];
    
    this.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      
      if (this.hasValidAnswer(userAnswer, question.type)) {
        answeredCount++;
        const isCorrect = this.checkAnswerCorrectness(question, userAnswer);
        
        if (isCorrect) {
          correctCount++;
          totalScore += 5; // 每題5分，類似quiz.py的評分邏輯
        } else {
          wrongCount++;
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
      } else {
        unansweredCount++;
      }
    });
    
    return { correctCount, wrongCount, totalScore, wrongQuestions, answeredCount, unansweredCount };
  }

  // 提交傳統題目
  private submitTraditionalQuiz(submissionData: any): void {
    console.log('📝 使用傳統Quiz服務提交題目');
    
    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {
        console.log('✅ 測驗提交成功:', response);
        
        // 獲取進度追蹤ID
        const progressId = response.data?.progress_id;
        if (progressId) {
          console.log('🎯 開始進度追蹤，progress_id:', progressId);
          // 連接後端進度追蹤
          this.connectProgressTracking(progressId);
        } else {
          console.warn('⚠️ 沒有收到progress_id，使用默認進度顯示');
          // 如果沒有progress_id，隱藏進度提示並直接跳轉
          this.hideProgressModal();
        }
        
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
          result_id: response.data?.result_id,  // 添加result_id
          user_answers: this.userAnswers,
          time_taken: submissionData.time_taken,
          question_answer_times: this.questionAnswerTimes  // 新增：包含每題作答時間
        };
        console.debug('[submitQuiz] 存入 sessionStorage 的 quizResultData:', quizResultData);
        
        sessionStorage.setItem('quiz_result_data', JSON.stringify(quizResultData));
        
        // 注意：現在不立即跳轉，而是等待進度追蹤完成後再跳轉
        // 進度追蹤完成後會在 handleProgressUpdate 中處理跳轉
        
        // 在導航成功後清除數據，避免在導航過程中丟失
        // this.quizService.clearCurrentQuizData(); // 移到進度完成後
      },
      error: (error: any) => {
        console.error('❌ 測驗提交失敗:', error);
        
        // 隱藏進度提示
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
    // 立即顯示，不使用動畫
    this.isProgressModalVisible = true;
    this.currentProgressStep = 0;
    this.progressMessage = '正在連接進度追蹤...';
    
    // 強制觸發變更檢測
    this.cdr.detectChanges();
  }

  // 隱藏進度提示模態框
  hideProgressModal(): void {
    console.log('🔄 隱藏進度模態框 - 當前狀態:', this.isProgressModalVisible);
    
    // 防止重複調用
    if (!this.isProgressModalVisible) {
      console.log('⚠️ 模態框已經隱藏，跳過');
      return;
    }
    
    // 立即隱藏，不使用動畫
    this.isProgressModalVisible = false;
    this.stopProgressAnimation();
    this.disconnectProgressTracking();
    
    // 強制觸發變更檢測
    this.cdr.detectChanges();
    
    console.log('✅ 進度模態框已隱藏');
  }

  // 開始進度動畫（保留用於向後兼容）
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

  // 新增：連接後端進度追蹤
  connectProgressTracking(progressId: string): void {
    this.progressId = progressId;
    
    try {
      // 使用 Server-Sent Events 連接後端進度通知
      const apiUrl = this.quizService.getBaseUrl();
      const sseUrl = `${apiUrl}/quiz/quiz-progress-sse/${progressId}`;
      
      this.eventSource = new EventSource(sseUrl);
      
      this.eventSource.onopen = () => {
        console.log('✅ 進度追蹤連接已建立');
        this.isProgressConnected = true;
        this.progressMessage = '進度追蹤已連接，等待AI批改...';
      };
      
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleProgressUpdate(data);
        } catch (error) {
          console.error('❌ 解析進度數據失敗:', error);
        }
      };
      
      this.eventSource.onerror = (error) => {
        console.error('❌ 進度追蹤連接錯誤:', error);
        
        // 檢查連接狀態
        if (this.eventSource && this.eventSource.readyState === EventSource.CLOSED) {
          console.log('🔄 SSE連接已正常關閉');
          // 如果已經收到完成消息，不需要處理錯誤
          if (this.currentProgressStep === 4) {
            console.log('✅ 進度已完成，忽略連接關閉錯誤');
            return;
          }
          // 如果沒有完成，嘗試重新連接
          this.fallbackToPolling();
        } else {
          console.log('🔄 SSE連接異常，嘗試回退到輪詢方式');
          this.progressMessage = '進度追蹤連接失敗，請稍後...';
          this.fallbackToPolling();
        }
      };
      
    } catch (error) {
      console.error('❌ 建立進度追蹤失敗:', error);
      this.fallbackToPolling();
    }
  }

  // 新增：處理進度更新
  private handleProgressUpdate(data: any): void {
    console.log('📊 收到進度更新:', data);
    
    switch (data.type) {
      case 'connected':
        this.progressMessage = data.message;
        break;
        
      case 'progress_update':
        this.currentProgressStep = data.current_stage - 1; // 轉換為0-based索引
        this.progressMessage = data.stage_description;
        break;
        
      case 'completion':
        this.currentProgressStep = 4; // 最後一個階段
        this.progressMessage = data.message;
        console.log('✅ 收到完成消息，準備跳轉...');
        
        // 立即斷開SSE連接，避免後續錯誤
        this.disconnectProgressTracking();
        
        // 延遲一下再隱藏模態框，讓用戶看到完成狀態
        setTimeout(() => {
          console.log('🔄 隱藏進度模態框...');
          this.hideProgressModal();
          
          // AI批改完成後，跳轉到結果頁面
          setTimeout(() => {
            this.navigateToResultPage();
          }, 500); // 增加延遲，確保模態框完全關閉
        }, 1000); // 減少延遲，讓用戶更快看到結果
        break;
        
      case 'error':
        console.error('❌ 進度追蹤錯誤:', data.message);
        this.progressMessage = `錯誤: ${data.message}`;
        break;
        
      default:
        console.warn('⚠️ 未知的進度更新類型:', data.type);
    }
  }

  // 新增：跳轉到結果頁面
  private navigateToResultPage(): void {
    console.log('🎯 準備跳轉到結果頁面...');
    
    // 注意：這裡不需要再調用hideProgressModal，因為在handleProgressUpdate中已經調用了
    
    // 從sessionStorage獲取測驗結果數據
    const quizResultDataStr = sessionStorage.getItem('quiz_result_data');
    if (quizResultDataStr) {
      try {
        const quizResultData = JSON.parse(quizResultDataStr);
        const resultId = quizResultData.result_id;
        
        if (resultId && resultId !== 'undefined') {
          console.log('🎯 AI批改完成，導航到結果頁面，result_id:', resultId);
          
          // 清除當前組件狀態
          this.isLoading = false;
          this.userAnswers = {};
          this.markedQuestions = {};
          
          // 強制觸發變更檢測
          this.cdr.detectChanges();
          
          // 延遲一下再導航，確保狀態清理完成
          setTimeout(() => {
            // 導航到結果頁面
            this.router.navigate(['/dashboard/quiz-result', resultId], {
              replaceUrl: true  // 替換當前URL，避免返回按鈕問題
            });
          }, 100);
          
        } else {
          console.warn('⚠️ result_id無效或為undefined，導航到測驗中心');
          this.router.navigate(['/dashboard/quiz-center']);
        }
        
        // 清除數據
        this.quizService.clearCurrentQuizData();
        
      } catch (error) {
        console.error('❌ 解析測驗結果數據失敗:', error);
        this.router.navigate(['/dashboard/quiz-center']);
      }
    } else {
      console.warn('⚠️ 沒有找到測驗結果數據，導航到測驗中心');
      this.router.navigate(['/dashboard/quiz-center']);
    }
  }

  // 新增：斷開進度追蹤
  private disconnectProgressTracking(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isProgressConnected = false;
  }

  // 新增：回退到輪詢方式（如果SSE失敗）
  private fallbackToPolling(): void {
    console.log('🔄 回退到輪詢方式獲取進度');
    
    if (this.progressId) {
      this.progressInterval = setInterval(() => {
        this.pollProgress();
      }, 2000); // 每2秒輪詢一次
    }
  }

  // 新增：輪詢進度
  private pollProgress(): void {
    if (!this.progressId) return;
    
    const apiUrl = this.quizService.getBaseUrl();
    fetch(`${apiUrl}/quiz/quiz-progress/${this.progressId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const progress = data.data;
          this.currentProgressStep = progress.current_stage - 1;
          this.progressMessage = progress.stage_description;
          
          if (progress.is_completed) {
            this.stopProgressAnimation();
            setTimeout(() => {
              this.hideProgressModal();
            }, 1500);
          }
        }
      })
      .catch(error => {
        console.error('❌ 輪詢進度失敗:', error);
      });
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
