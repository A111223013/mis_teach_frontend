import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class QuizTakingComponent implements OnInit, OnDestroy, AfterViewChecked {
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
  
  // 測驗時間記錄
  startTime: number = 0;      // 測驗開始時間戳（毫秒）
  elapsedTime: number = 0;    // 已用時間（秒）
  
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
  private progressId: string = ''
  
  // 數學公式相關屬性
  hasLatexInQuestion: boolean = false;
  mathAnswerMode: 'drawing' | 'formula' = 'drawing';
  mathFormulaAnswer: string = '';
  selectedMathTab: 'quick' | 'templates' = 'quick';
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mathCanvas', { static: false }) mathCanvas?: ElementRef<HTMLCanvasElement>;
  private mathCtx?: CanvasRenderingContext2D;
  private isMathDrawing = false;;
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
    
    // 檢查KaTeX是否正確載入
    this.checkKatexLoaded();

    // 添加路由查詢參數監聽，處理刷新頁面的情況
    this.route.queryParams.subscribe(queryParams => {
      // 如果沒有測驗數據但有查詢參數，嘗試重新載入
      if (this.questions.length === 0 && !this.isLoading && queryParams['type']) {
        this.loadQuiz();
      }
    });
  }

  loadQuizFromBackend(templateId: string, timeoutId: any): void {
    // 從後端載入測驗數據
    console.log('🔍 調試：loadQuizFromBackend 使用 templateId:', templateId);
    this.quizService.getQuiz(templateId).subscribe({
      next: (response) => {
        clearTimeout(timeoutId); // 清除超時計時器
        if (response.success && response.data) {
          const quizData = response.data;
          // 設置測驗信息
          this.quizTitle = quizData.title || quizData.quiz_info?.title || '測驗';
          this.questions = quizData.questions || [];
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

          this.isLoading = false;
          
          // 強制觸發變更檢測
          this.cdr.detectChanges();
          
        } else {
          console.error('❌ 測驗數據格式錯誤:', response);
          this.isLoading = false;
          this.error = '測驗數據載入失敗，請重新生成測驗';
          this.router.navigate(['/dashboard/quiz-center']);
        }
      },
      error: (error: any) => {
        clearTimeout(timeoutId); // 清除超時計時器
        console.error('❌ 載入測驗失敗:', error);
        this.isLoading = false;
        this.error = '載入測驗失敗，請重新生成測驗';
        this.router.navigate(['/dashboard/quiz-center']);
      }
    });
  }

  loadAIGeneratedQuiz(): void {
    // 設置載入狀態
    this.isLoading = true;
    this.error = '';
    
    // 從路由參數獲取基本信息
    const concept = this.route.snapshot.queryParamMap.get('concept');
    const domain = this.route.snapshot.queryParamMap.get('domain');
    const difficulty = this.route.snapshot.queryParamMap.get('difficulty');
    const templateId = this.route.snapshot.queryParamMap.get('template_id');
    
    // 設置 templateId
    if (templateId) {
      this.templateId = templateId;
    } else {
      this.templateId = this.quizId;
    }
    
    // 設置超時機制
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.error = '載入AI測驗超時，請重新開始測驗';
        this.router.navigate(['/dashboard/quiz-center']);
      }
    }, 15000); // 15秒超時，AI測驗可能需要更長時間
    
    // 直接從後端API載入測驗數據
    this.quizService.getQuiz(this.quizId).subscribe({
      next: (quizData: any) => {
        clearTimeout(timeoutId);
        
        if (quizData && quizData.questions && quizData.questions.length > 0) {
          // 設置測驗信息
          this.quizTitle = quizData.title || `${concept} - ${difficulty}難度練習`;
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
          this.isLoading = false;
          
          // 強制觸發變更檢測
          this.cdr.detectChanges();
          
        } else {
          this.isLoading = false;
          this.error = 'AI測驗數據格式錯誤，請重新生成測驗';
          this.router.navigate(['/dashboard/quiz-center']);
        }
      },
      error: (error: any) => {
        clearTimeout(timeoutId);
        console.error('❌ 載入AI測驗失敗:', error);
        this.isLoading = false;
        this.error = '載入AI測驗失敗，請重新生成測驗';
        this.router.navigate(['/dashboard/quiz-center']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.stopProgressAnimation(); // 確保在組件銷毀時停止動畫
    this.disconnectProgressTracking(); // 確保在組件銷毀時斷開進度追蹤
    
    // 保存當前測驗狀態到sessionStorage，以便刷新頁面後復原
    this.saveQuizToSession();
  }

  loadQuiz(): void {
    if (!this.quizId) {
      this.router.navigate(['/dashboard/quiz-center']);
      return;
    }

    // 設置載入狀態
    this.isLoading = true;
    this.error = '';

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
      console.log('🔍 調試：使用查詢參數中的 templateId:', templateId);
    } else {
      // 如果沒有 template_id 查詢參數，嘗試從 sessionStorage 獲取
      const sessionData = this.restoreQuizFromSession();
      if (sessionData && sessionData.template_id) {
        this.templateId = sessionData.template_id;
        console.log('🔍 調試：從 session 獲取 templateId:', sessionData.template_id);
      } else {
        // 最後的備選方案：使用 quizId（但這可能不正確）
        this.templateId = this.quizId;
        console.log('⚠️ 警告：使用 quizId 作為 templateId，這可能不正確:', this.quizId);
      }
    }
    
    // 設置超時機制
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.error = '載入測驗超時，請重新開始測驗';
        this.router.navigate(['/dashboard/quiz-center']);
      }
    }, 10000); // 10秒超時
    
    // 檢查是否有template_id查詢參數，如果有則直接從後端載入
    if (templateId) {
      // 有template_id參數，直接從後端載入測驗
      this.loadQuizFromBackend(templateId, timeoutId);
      return;
    }
    
    // 嘗試從sessionStorage復原測驗狀態
    const restoredQuiz = this.restoreQuizFromSession();
    if (restoredQuiz) {
      // 成功復原測驗狀態
      this.quizTitle = restoredQuiz.quizTitle;
      this.questions = restoredQuiz.questions;
      this.timeLimit = restoredQuiz.timeLimit;
      this.totalQuestions = restoredQuiz.totalQuestions;
      this.answers = restoredQuiz.answers;
      this.markedQuestions = restoredQuiz.markedQuestions;
      this.currentQuestionIndex = restoredQuiz.currentQuestionIndex;
      this.startTime = restoredQuiz.startTime;
      this.elapsedTime = restoredQuiz.elapsedTime;
      
      // 設置計時器
      this.initializeTimer();
      
      // 載入當前題目
      this.loadCurrentQuestion();
      this.isLoading = false;
      
      // 強制觸發變更檢測，確保UI更新
      this.cdr.detectChanges();
      return;
    }
    
    // 如果無法從session復原，嘗試從服務獲取已存儲的測驗數據
    this.quizService.getCurrentQuizData().subscribe({
      next: (quizData) => {
        clearTimeout(timeoutId); // 清除超時計時器
        if (quizData && quizData.questions && quizData.questions.length > 0) {
          // 使用已存储的数据
          
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
          this.isLoading = false;
          
          // 強制觸發變更檢測，確保UI更新
          this.cdr.detectChanges();
          
        } else {
          // 檢查是否為AI生成的測驗，如果是則直接從後端載入
          const aiGenerated = this.route.snapshot.queryParamMap.get('ai_generated');
          if (aiGenerated === 'true') {
            this.loadAIGeneratedQuiz();
            return;
          }
          
          // 檢查是否已經完成測驗，如果是則不顯示錯誤提示
          const quizResultDataStr = sessionStorage.getItem('quiz_result_data');
          if (quizResultDataStr) {
            try {
              const quizResultData = JSON.parse(quizResultDataStr);
              if (quizResultData.result_id && quizResultData.result_id !== 'undefined') {
                this.router.navigate(['/dashboard/quiz-result', quizResultData.result_id]);
                return;
              }
            } catch (error) {
              console.error('❌ 解析測驗結果數據失敗:', error);
            }
          }
          

          this.isLoading = false;
          this.error = '未找到測驗數據，請重新開始測驗';
          this.router.navigate(['/dashboard/quiz-center']);
        }
      },
      error: (error) => {
        clearTimeout(timeoutId); // 清除超時計時器
        console.error('❌ 載入測驗數據失敗:', error);
        this.isLoading = false;
        this.error = '載入測驗失敗，請重新開始測驗';
        this.router.navigate(['/dashboard/quiz-center']);
      }
    });
  }

  // 保存測驗狀態到sessionStorage
  private saveQuizToSession(): void {
    if (this.questions && this.questions.length > 0) {
      const sessionData = {
        session_id: this.generateSessionId(),
        template_id: this.templateId,
        quiz_id: this.quizId,
        quizTitle: this.quizTitle,
        questions: this.questions,
        timeLimit: this.timeLimit,
        totalQuestions: this.totalQuestions,
        answers: this.answers,
        markedQuestions: this.markedQuestions,
        currentQuestionIndex: this.currentQuestionIndex,
        startTime: this.startTime,
        elapsedTime: this.elapsedTime,
        timestamp: Date.now()
      };
      
      try {
        sessionStorage.setItem('quiz_session_data', JSON.stringify(sessionData));
      } catch (error) {
        console.error('❌ 保存測驗狀態到sessionStorage失敗:', error);
      }
    }
  }

  // 從sessionStorage復原測驗狀態
  private restoreQuizFromSession(): any {
    try {
      const sessionDataStr = sessionStorage.getItem('quiz_session_data');
      if (!sessionDataStr) {
        return null;
      }

      const sessionData = JSON.parse(sessionDataStr);
      
      // 驗證session數據的完整性
      if (!this.validateSessionData(sessionData)) {
        console.warn('⚠️ Session數據驗證失敗，清除無效數據');
        this.clearQuizSession();
        return null;
      }

      // 檢查session是否過期（24小時）
      const now = Date.now();
      const sessionAge = now - sessionData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24小時
      
      if (sessionAge > maxAge) {
        console.warn('⚠️ Session已過期，清除數據');
        this.clearQuizSession();
        return null;
      }

      // 檢查template_id和quiz_id是否匹配當前路由
      const currentTemplateId = this.route.snapshot.queryParamMap.get('template_id') || this.quizId;
      if (sessionData.template_id !== currentTemplateId && sessionData.quiz_id !== this.quizId) {
        console.warn('⚠️ Session ID不匹配，清除數據');
        this.clearQuizSession();
        return null;
      }

      console.log('✅ 成功從session復原測驗狀態');
      return sessionData;
      
    } catch (error) {
      console.error('❌ 從sessionStorage復原測驗狀態失敗:', error);
      this.clearQuizSession();
      return null;
    }
  }

  // 驗證session數據的完整性
  private validateSessionData(sessionData: any): boolean {
    const requiredFields = [
      'session_id', 'template_id', 'quiz_id', 'quizTitle', 
      'questions', 'timeLimit', 'totalQuestions', 'answers', 
      'markedQuestions', 'currentQuestionIndex', 'startTime', 
      'elapsedTime', 'timestamp'
    ];
    
    for (const field of requiredFields) {
      if (sessionData[field] === undefined || sessionData[field] === null) {
        console.warn(`⚠️ Session數據缺少必要欄位: ${field}`);
        return false;
      }
    }

    // 檢查questions是否為陣列且不為空
    if (!Array.isArray(sessionData.questions) || sessionData.questions.length === 0) {
      console.warn('⚠️ Session數據中questions格式錯誤');
      return false;
    }

    // 檢查answers是否為陣列且長度正確
    if (!Array.isArray(sessionData.answers) || sessionData.answers.length !== sessionData.totalQuestions) {
      console.warn('⚠️ Session數據中answers格式錯誤');
      return false;
    }

    return true;
  }

  // 清除測驗session數據
  private clearQuizSession(): void {
    try {
      sessionStorage.removeItem('quiz_session_data');
    } catch (error) {
      console.error('❌ 清除測驗session數據失敗:', error);
    }
  }

  // 生成session ID
  private generateSessionId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 生成测验标题
  private generateQuizTitle(type: string | null, school: string | null, year: string | null, department: string | null, topic: string | null): string {
    if (type === 'pastexam' && school && year && department) {
      return `${school} - ${year}年 - ${department}`;
    } else if (type === 'knowledge' && topic) {
      return `${topic} - 知識測驗`;
    } else {
      return '測驗';
    }
  }

  initializeTimer(): void {
    // 設置測驗開始時間
    if (this.startTime === 0) {
      this.startTime = Date.now();
    }
    
    if (this.timeLimit > 0) {
      this.timer = this.timeLimit * 60; // 轉換為秒
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timer--;
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.timer <= 0) {
          this.submitQuiz();
        }
      });
    }
  }

  // 載入指定題目
  loadCurrentQuestion(): void {
    if (this.questions.length === 0) {
      return;
    }
    
    if (this.currentQuestionIndex >= this.questions.length) {
      this.currentQuestionIndex = 0;
    }
    
    // 先清理舊畫布狀態
    this.clearCanvasState();
    
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    
    // 新增：記錄題目開始作答時間（第一題計時器啟動）
    this.recordQuestionStartTime(this.currentQuestionIndex);
    
    // 強制觸發變更檢測，讓 DOM 更新
    this.cdr.detectChanges();
    
    // 如果顯示數學答題模式（包括畫圖題和LaTeX題目），初始化畫布
    if (this.shouldShowMathAnswerMode()) {
      setTimeout(() => {
        this.initializeDrawingCanvas();
        // 初始化後再次檢測變更
        this.cdr.detectChanges();
      }, 500);
    }
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
      
      // 先徹底清理舊畫布狀態
      this.clearCanvasState();
      
      this.currentQuestionIndex = index;
      this.currentQuestion = this.questions[index];
      this.resetImageLoadState(); // 重置圖片載入狀態
      
      // 預載入新題目的圖片
      if (this.hasQuestionImages()) {
        this.preloadQuestionImages();
      }
      
      // 開始新題目的計時器
      this.recordQuestionStartTime(index);
      
      // 強制觸發變更檢測，讓 DOM 更新
      this.cdr.detectChanges();
      
      // 如果顯示數學答題模式（包括畫圖題和LaTeX題目），初始化畫布
      if (this.shouldShowMathAnswerMode()) {
        // 增加延遲時間，確保 DOM 完全準備好
        setTimeout(() => {
          this.initializeDrawingCanvas();
          // 初始化後再次檢測變更
          this.cdr.detectChanges();
        }, 500);
      }
    } else {
      console.log('❌ 無效的題目索引:', index);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
      // 保存當前狀態到session
      this.saveQuizToSession();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
      // 保存當前狀態到session
      this.saveQuizToSession();
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
    
    // 保存當前狀態到session
    this.saveQuizToSession();
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
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  isMultipleChoiceSelected(option: string): boolean {
    const answers = this.userAnswers[this.currentQuestionIndex];
    return Array.isArray(answers) && answers.includes(option);
  }

  // 是非題處理
  selectTrueFalse(value: boolean): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  isTrueFalseSelected(value: boolean): boolean {
    return this.userAnswers[this.currentQuestionIndex] === value;
  }

  // 填空題、簡答題、長答題處理
  updateTextAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  getTextAnswer(): string {
    const answer = this.userAnswers[this.currentQuestionIndex] || '';
    return answer;
  }

  // 程式撰寫題處理
  updateCodingAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
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
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  getChoiceAnswer(index: number): string {
    const answers = this.userAnswers[this.currentQuestionIndex];
    return Array.isArray(answers) ? (answers[index] || '') : '';
  }

  // 畫圖題處理
  updateDrawAnswer(value: string): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  getDrawAnswer(): string {
    return this.userAnswers[this.currentQuestionIndex] || '';
  }

  // 檢查畫圖題是否有已儲存的答案
  hasDrawAnswer(): boolean {
    const answer = this.userAnswers[this.currentQuestionIndex];
    return answer && typeof answer === 'string' && answer.startsWith('data:image/') && answer.length > 100;
  }

  // 檢查數學答題模式是否有已儲存的答案
  hasMathAnswer(): boolean {
    return this.hasDrawAnswer();
  }

  // 檢查畫布是否已初始化
  isCanvasReady(): boolean {
    return !!(this.canvas && this.ctx);
  }

  // 通用答案處理
  getCustomAnswer(): any {
    return this.userAnswers[this.currentQuestionIndex];
  }

  updateCustomAnswer(value: any): void {
    if (!this.currentQuestion) return;
    this.userAnswers[this.currentQuestionIndex] = value;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
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
    
    // 保存當前狀態到session
    this.saveQuizToSession();
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
    
    // 對於畫圖題，檢查是否為有效的base64圖片數據
    if (questionType === 'draw-answer') {
      if (typeof answer === 'string' && answer.startsWith('data:image/')) {
        // 進一步檢查是否為有效的圖片數據
        return answer.length > 100; // base64圖片數據應該有一定長度
      }
      return false;
    }
    
    // 對於程式撰寫題，檢查是否有實際內容
    if (questionType === 'coding-answer') {
      return typeof answer === 'string' && answer.trim().length > 0;
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
    
    // 清除session數據，因為測驗即將完成
    this.clearQuizSession();
    
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
      quiz_id: this.quizId,        // 新增：AI 測驗需要的 quiz_id
      template_id: this.templateId,  // 使用 template_id
      answers: this.userAnswers,
      time_taken: this.timeLimit > 0 ? (this.timeLimit * 60 - this.timer) : 0,
      questions: this.questions,  // 新增：傳遞完整的題目數據
      question_answer_times: this.questionAnswerTimes  // 新增：傳遞每題作答時間（秒）
    };



    // 顯示進度提示
    this.showProgressModal();

    // 判斷是否為AI題目，使用不同的提交邏輯
    if (this.isAIQuiz()) {

      this.submitAIQuiz(submissionData);
    } else {
 
      this.submitTraditionalQuiz(submissionData);
    }
  }

  // 提交AI題目 - 使用 ai-quiz 端點
  private submitAIQuiz(submissionData: any): void {
    
    // 使用 ai-quiz 端點提交 AI 生成的測驗
    this.quizService.submitAiQuiz(submissionData).subscribe({
      next: (response: any) => {
        // 獲取進度追蹤ID
        const progressId = response.data?.progress_id;
        
        if (progressId) {
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

    const { correctCount, wrongCount, totalScore, wrongQuestions, answeredCount, unansweredCount } = this.calculateAIQuizScore();
    

    
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

    this.quizService.submitQuiz(submissionData).subscribe({
      next: (response: any) => {

        // 獲取進度追蹤ID
        const progressId = response.data?.progress_id;
        if (progressId) {

          // 連接後端進度追蹤
          this.connectProgressTracking(progressId);
        } else {

          // 如果沒有progress_id，隱藏進度提示並直接跳轉
          this.hideProgressModal();
        }
        
        // 準備錯題和標記題目的資料
        const wrongQuestions = this.getWrongQuestions();
        const markedQuestions = this.getMarkedQuestions();

        
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

    // 防止重複調用
    if (!this.isProgressModalVisible) {

      return;
    }
    
    // 立即隱藏，不使用動畫
    this.isProgressModalVisible = false;
    this.stopProgressAnimation();
    this.disconnectProgressTracking();
    
    // 強制觸發變更檢測
    this.cdr.detectChanges();
    

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

          // 如果已經收到完成消息，不需要處理錯誤
          if (this.currentProgressStep === 4) {

            return;
          }
          // 如果沒有完成，嘗試重新連接
          this.fallbackToPolling();
        } else {
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

        // 立即斷開SSE連接，避免後續錯誤
        this.disconnectProgressTracking();
        
        // 延遲一下再隱藏模態框，讓用戶看到完成狀態
        setTimeout(() => {

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

    // 注意：這裡不需要再調用hideProgressModal，因為在handleProgressUpdate中已經調用了
    
    // 從sessionStorage獲取測驗結果數據
    const quizResultDataStr = sessionStorage.getItem('quiz_result_data');
    if (quizResultDataStr) {
      try {
        const quizResultData = JSON.parse(quizResultDataStr);
        const resultId = quizResultData.result_id;
        
        if (resultId && resultId !== 'undefined') {

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
  brushColor = '#000000';
  isEraserMode = false;
  canvasWidth = 800;
  canvasHeight = 500;
  showCanvasSizeModal = false;
  private cursorCircle?: HTMLElement;

  startDrawing(event: MouseEvent): void {
    if (!this.canvas || !this.ctx) {
      this.setupCanvas();
    }
    
    if (this.ctx) {
      this.isDrawing = true;
      const rect = this.canvas!.getBoundingClientRect();
      this.ctx.beginPath();
      this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
      
      // 更新游標位置
      this.updateCursorPosition(event);
      
      // 開始繪圖時立即儲存一次（清除之前的記錄）
      this.autoSaveDrawing();
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.ctx || !this.canvas) {
      return;
    }
    
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    
    // 根據模式設置樣式
    if (this.isEraserMode) {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = this.brushColor;
    }
    
    this.ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    
    // 更新游標位置
    this.updateCursorPosition(event);
    
    // 繪圖過程中持續自動儲存（每10次繪圖才儲存一次，避免過於頻繁）
    if (Math.random() < 0.1) { // 10% 機率儲存
      this.autoSaveDrawing();
    }
  }

  stopDrawing(): void {
    if (this.ctx) {
      this.isDrawing = false;
      this.ctx.beginPath();
      
      // 結束繪圖時最後儲存一次
      this.autoSaveDrawing();
    }
  }

  clearCanvas(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // 填充白色背景（避免透明背景轉換為黑色）
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      // 清除後立即儲存空白畫布
      this.autoSaveDrawing();
    }
  }

  // 切換橡皮擦模式
  toggleEraser(): void {
    this.isEraserMode = !this.isEraserMode;
    // 重新創建游標圓圈以更新樣式
    this.createCursorCircle();
  }

  // 設置畫筆顏色
  setBrushColor(color: string): void {
    this.brushColor = color;
    this.isEraserMode = false; // 選擇顏色時自動切換回畫筆模式
    // 重新創建游標圓圈以更新顏色
    this.createCursorCircle();
  }

  // 調整畫布大小
  resizeCanvas(): void {
    if (!this.canvas || !this.ctx) return;
    
    // 保存當前畫布內容
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // 調整畫布大小（這會清除畫布為透明）
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    
    // 填充白色背景（避免透明背景）
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 恢復畫布內容（會被裁切或留白）
    this.ctx.putImageData(imageData, 0, 0);
    
    // 重新設置樣式
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    
    this.showCanvasSizeModal = false;
    this.autoSaveDrawing();
  }

  // 開啟畫布大小設定對話框
  openCanvasSizeModal(): void {
    this.showCanvasSizeModal = true;
  }

  // 關閉畫布大小設定對話框
  closeCanvasSizeModal(): void {
    this.showCanvasSizeModal = false;
  }

  // 創建自訂游標圓圈
  private createCursorCircle(): void {
    if (!this.canvas) return;

    // 移除現有的游標圓圈
    this.removeCursorCircle();

    // 創建新的游標圓圈
    this.cursorCircle = document.createElement('div');
    this.cursorCircle.style.position = 'absolute';
    this.cursorCircle.style.width = this.brushSize + 'px';
    this.cursorCircle.style.height = this.brushSize + 'px';
    this.cursorCircle.style.border = '2px solid ' + (this.isEraserMode ? '#dc3545' : this.brushColor);
    this.cursorCircle.style.borderRadius = '50%';
    this.cursorCircle.style.backgroundColor = this.isEraserMode 
      ? 'rgba(220, 53, 69, 0.2)' 
      : (this.brushColor + '20'); // 添加透明度
    this.cursorCircle.style.pointerEvents = 'none';
    this.cursorCircle.style.zIndex = '1000';
    this.cursorCircle.style.transform = 'translate(-50%, -50%)';
    this.cursorCircle.style.display = 'none';

    // 添加到畫布容器
    const canvasContainer = this.canvas.parentElement;
    if (canvasContainer) {
      canvasContainer.style.position = 'relative';
      canvasContainer.appendChild(this.cursorCircle);
    }
  }

  // 移除游標圓圈
  private removeCursorCircle(): void {
    if (this.cursorCircle && this.cursorCircle.parentElement) {
      this.cursorCircle.parentElement.removeChild(this.cursorCircle);
    }
    this.cursorCircle = undefined;
  }

  // 更新游標圓圈位置
  private updateCursorPosition(event: MouseEvent): void {
    if (!this.cursorCircle || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const containerRect = this.canvas.parentElement!.getBoundingClientRect();
    
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    this.cursorCircle.style.left = x + 'px';
    this.cursorCircle.style.top = y + 'px';
    this.cursorCircle.style.display = 'block';
  }

  // 隱藏游標圓圈
  private hideCursor(): void {
    if (this.cursorCircle) {
      this.cursorCircle.style.display = 'none';
    }
  }

  // 更新筆刷大小時重新創建游標圓圈
  onBrushSizeChange(): void {
    this.createCursorCircle();
  }

  // 自動儲存繪圖（覆蓋式儲存）
  private autoSaveDrawing(): void {
    if (!this.canvas) {
      return;
    }
    
    try {
      const dataURL = this.canvas.toDataURL('image/png');
      
      // 直接覆蓋儲存到該題的答案中
      this.userAnswers[this.currentQuestionIndex] = dataURL;
      
      // 更新狀態顯示
      this.cdr.detectChanges();
    } catch (error) {
      // 儲存失敗，靜默處理
    }
  }

  saveDrawing(): void {
    // 手動儲存按鈕 - 觸發一次儲存
    this.autoSaveDrawing();
    
    // 檢查畫布是否有實際內容
    const hasContent = this.checkCanvasContent();
    if (!hasContent) {
      alert('畫布內容為空，請先繪圖再儲存');
      return;
    }
    
    // 顯示儲存成功訊息
    alert('繪圖已儲存！');
  }

  // 檢查畫布是否有實際內容
  private checkCanvasContent(): boolean {
    if (!this.canvas || !this.ctx) return false;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    // 檢查是否有非透明的像素
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { // 檢查alpha通道
        return true;
      }
    }
    
    return false;
  }

  private setupCanvas(): boolean {
    console.log('🔧 setupCanvas 開始，mathAnswerMode=', this.mathAnswerMode);
    
    // 根據數學答題模式選擇正確的畫布
    let targetCanvas: ElementRef<HTMLCanvasElement> | undefined;
    
    if (this.mathAnswerMode === 'drawing' && this.mathCanvas?.nativeElement) {
      targetCanvas = this.mathCanvas;
      console.log('📍 選擇數學畫布');
    } else if (this.drawingCanvas?.nativeElement) {
      targetCanvas = this.drawingCanvas;
      console.log('📍 選擇繪圖畫布');
    } else {
      console.warn('⚠️ 找不到可用的畫布元素');
      return false;
    }
    
    if (targetCanvas?.nativeElement) {
      this.canvas = targetCanvas.nativeElement;
      
      const context = this.canvas.getContext('2d');
      if (context) {
        this.ctx = context;
        
        // 設置畫布大小
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        
        // 填充白色背景（避免透明背景轉換為黑色）
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 設置繪圖樣式
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        
        // 創建游標圓圈
        this.createCursorCircle();
        
        console.log('✅ setupCanvas 成功');
        return true;
      } else {
        console.error('❌ 無法獲取 2D context');
        return false;
      }
    }
    
    console.error('❌ setupCanvas 失敗：targetCanvas 無效');
    return false;
  }

  // 初始化畫圖題畫布
  private initializeDrawingCanvas(): void {
    if (!this.currentQuestion || !this.shouldShowMathAnswerMode()) {
      console.log('⚠️ 不需要初始化畫布：currentQuestion=', !!this.currentQuestion, 'shouldShow=', this.shouldShowMathAnswerMode());
      return;
    }

    console.log('🎨 開始初始化畫布，當前題目索引：', this.currentQuestionIndex);
    
    // 清理舊的畫布狀態
    this.clearCanvasState();
    
    // 延遲執行，確保DOM已更新
    setTimeout(() => {
      const success = this.setupCanvas();
      if (success) {
        this.loadSavedDrawing();
        console.log('✅ 畫布初始化成功');
      } else {
        console.warn('⚠️ 畫布初始化失敗，將重試');
        // 如果失敗，再次嘗試
        setTimeout(() => {
          const retrySuccess = this.setupCanvas();
          if (retrySuccess) {
            this.loadSavedDrawing();
            console.log('✅ 畫布重試初始化成功');
          } else {
            console.error('❌ 畫布初始化失敗');
          }
        }, 200);
      }
    }, 100);
  }

  // 清理畫布狀態
  private clearCanvasState(): void {
    // 停止任何正在進行的繪圖
    this.isDrawing = false;
    this.isMathDrawing = false;
    
    // 清除游標圓圈
    this.removeCursorCircle();
    
    // 清除畫布引用
    this.canvas = undefined;
    this.ctx = undefined;
    this.mathCtx = undefined;
  }

  // 載入已儲存的繪圖
  private loadSavedDrawing(): void {
    if (!this.canvas || !this.ctx) {
      return;
    }

    // **重要：無論有沒有已保存的圖片，都先填充白色背景**
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let savedAnswer = this.userAnswers[this.currentQuestionIndex];
    
    // 檢測並清除損壞的黑色圖片
    if (savedAnswer && typeof savedAnswer === 'string' && savedAnswer.startsWith('data:image/')) {
      // 如果圖片非常小（可能是空白的黑色圖片），清除它
      if (savedAnswer.length < 1000) {
        savedAnswer = '';
        this.userAnswers[this.currentQuestionIndex] = '';
      }
    }

    if (savedAnswer && typeof savedAnswer === 'string' && savedAnswer.startsWith('data:image/')) {
      const img = new Image();
      img.onload = () => {
        // 清除畫布
        this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
        // 重新填充白色背景（避免透明背景）
        this.ctx!.fillStyle = '#FFFFFF';
        this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
        // 繪製儲存的圖片
        this.ctx!.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
      };
      img.src = savedAnswer;
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
        
      case 'draw-answer':
        // 畫圖題使用AI評分，這裡只做基本檢查
        // 實際評分會在後端進行
        return userAnswer && userAnswer !== '';
        
      case 'coding-answer':
        // 程式撰寫題使用AI評分，這裡只做基本檢查
        return userAnswer && userAnswer !== '';
        
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

  // ==================== 數學公式相關方法 ====================
  
  ngAfterViewChecked(): void {
    // 檢查當前題目是否包含 LaTeX
    this.checkLatexInQuestion();
    // 渲染數學公式
    this.renderMathInElement();
    
    // **關鍵：確保 Canvas 始終有白色背景**
    this.ensureCanvasWhiteBackground();
  }
  
  private ensureCanvasWhiteBackground(): void {
    // 檢查並填充繪圖 Canvas
    if (this.drawingCanvas?.nativeElement) {
      const canvas = this.drawingCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        // 檢查左上角像素是否為白色
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const isWhite = imageData.data[0] === 255 && 
                       imageData.data[1] === 255 && 
                       imageData.data[2] === 255;
        
        if (!isWhite) {
          // 保存當前內容
          const tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // 填充白色背景
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 恢復內容
          ctx.putImageData(tempImageData, 0, 0);
        }
      }
    }
    
    // 檢查並填充數學 Canvas
    if (this.mathCanvas?.nativeElement) {
      const canvas = this.mathCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx && canvas.width > 0 && canvas.height > 0) {
        // 檢查左上角像素是否為白色
        const imageData = ctx.getImageData(0, 0, 1, 1);
        const isWhite = imageData.data[0] === 255 && 
                       imageData.data[1] === 255 && 
                       imageData.data[2] === 255;
        
        if (!isWhite) {
          // 保存當前內容
          const tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          // 填充白色背景
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // 恢復內容
          ctx.putImageData(tempImageData, 0, 0);
        }
      }
    }
  }

  renderQuestionText(): string {
    if (!this.currentQuestion) {
      return '';
    }
    
    const questionType = this.getQuestionType(this.currentQuestion);
    const questionText = questionType === 'group' 
      ? this.currentQuestion.group_question_text 
      : this.currentQuestion.question_text;

    if (!questionText) {
      return '';
    }

    // 將 LaTeX 語法轉換為 HTML 格式供 KaTeX 渲染
    return questionText
      .replace(/\$\$(.*?)\$\$/g, '<div class="math-display">$$$1$$</div>')
      .replace(/\$(.*?)\$/g, '<span class="math-inline">$$$1$$</span>')
      .replace(/\\\((.*?)\\\)/g, '<span class="math-inline">$$$1$$</span>')
      .replace(/\\\[(.*?)\\\]/g, '<div class="math-display">$$$1$$</div>');
  }

  checkKatexLoaded(): void {
    // 檢查KaTeX是否正確載入
    const checkKatex = () => {
      if ((window as any).katex) {
        // KaTeX已載入，觸發變更檢測以重新渲染數學公式
        this.cdr.detectChanges();
      } else {
        console.warn('⚠️ KaTeX 未載入，將在1秒後重試');
        setTimeout(checkKatex, 1000);
      }
    };
    checkKatex();
  }

  renderMathFormula(formula: string): string {
    if (!formula) return '';
    
    try {
      // 使用 KaTeX 渲染數學公式
      if ((window as any).katex) {
        const rendered = (window as any).katex.renderToString(formula, {
          throwOnError: false,
          displayMode: false
        });
        return rendered;
      }
      // 如果KaTeX未載入，返回原始公式
      return formula;
    } catch (error) {
      console.warn('KaTeX rendering error:', error);
      return formula;
    }
  }

  renderMathInElement(): void {
    // 使用 KaTeX 的 auto-render 功能
    if ((window as any).renderMathInElement) {
      setTimeout(() => {
        (window as any).renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
        // 觸發變更檢測以確保所有數學公式都正確渲染
        this.cdr.detectChanges();
      }, 100);
    }
  }

  checkLatexInQuestion(): void;
  checkLatexInQuestion(questionText: string): boolean;
  checkLatexInQuestion(questionText?: string): boolean | void {
    if (questionText !== undefined) {
      // 重載版本：接受questionText參數並返回boolean
      if (!questionText) return false;
      
      const latexPatterns = [
        /\$\$.*?\$\$/g,  // 塊級數學公式
        /\$.*?\$/g,      // 行內數學公式
        /\\\(.*?\\\)/g,  // LaTeX 行內公式
        /\\\[.*?\\\]/g   // LaTeX 塊級公式
      ];
      
      return latexPatterns.some(pattern => pattern.test(questionText));
    } else {
      // 原版本：檢查當前題目並設置hasLatexInQuestion
      if (!this.currentQuestion) {
        this.hasLatexInQuestion = false;
        return;
      }

      const currentQuestionText = this.getQuestionType(this.currentQuestion) === 'group' 
        ? this.currentQuestion.group_question_text 
        : this.currentQuestion.question_text;

      if (!currentQuestionText) {
        this.hasLatexInQuestion = false;
        return;
      }

      this.hasLatexInQuestion = this.checkLatexInQuestion(currentQuestionText);
    }
  }

  shouldShowMathAnswerMode(): boolean {
    if (!this.currentQuestion) return false;
    
    const questionType = this.getQuestionType(this.currentQuestion);
    const isChoiceQuestion = ['single-choice', 'multiple-choice', 'true-false'].includes(questionType);
    
    // 對於畫圖題，總是顯示數學答題模式
    if (questionType === 'draw-answer') {
      return true;
    }
    
    // 對於其他非選擇題，檢查是否有LaTeX內容
    if (!isChoiceQuestion) {
      const questionText = this.currentQuestion.question_text || '';
      return this.checkLatexInQuestion(questionText);
    }
    
    return false;
  }

  switchMathAnswerMode(mode: 'drawing' | 'formula'): void {
    console.log('🔄 切換答題模式：', this.mathAnswerMode, '->', mode);
    
    // 先清理舊的畫布狀態
    this.clearCanvasState();
    
    // 切換模式
    this.mathAnswerMode = mode;
    
    // 強制觸發變更檢測
    this.cdr.detectChanges();
    
    // 如果切換到繪圖模式，重新初始化畫布
    if (mode === 'drawing') {
      setTimeout(() => {
        this.initializeDrawingCanvas();
        // 初始化後再次檢測變更
        this.cdr.detectChanges();
      }, 500);
    }
  }

  // 選擇數學工具標籤頁
  selectMathTab(tab: 'quick' | 'templates'): void {
    this.selectedMathTab = tab;
  }

  // 快捷數學工具
  quickMathTools = [
    // 基本結構
    { symbol: '^{}', name: '上標' },
    { symbol: '_{}', name: '下標' },
    { symbol: '^{}_{}', name: '上下標' },
    { symbol: '\\frac{}{}', name: '分數' },
    { symbol: '\\sqrt{}', name: '根號' },
    { symbol: '\\sqrt[n]{}', name: 'n次方根' },
    
    // 常用組合
    { symbol: 'x^{2}', name: 'x平方' },
    { symbol: 'x_{1}', name: 'x下標1' },
    { symbol: 'x^{2}_{1}', name: 'x平方下標1' },
    { symbol: '\\frac{1}{2}', name: '分數1/2' },
    { symbol: '\\sqrt{2}', name: '根號2' },
    { symbol: '\\sqrt[3]{8}', name: '三次方根8' },
    
    // 括號和分隔符
    { symbol: '\\left( \\right)', name: '括號' },
    { symbol: '\\left[ \\right]', name: '方括號' },
    { symbol: '\\left\\{ \\right\\}', name: '大括號' },
    { symbol: '\\left| \\right|', name: '絕對值' },
    { symbol: '\\left\\langle \\right\\rangle', name: '角括號' },
    
    // 關係符號
    { symbol: '\\leq', name: '小於等於' },
    { symbol: '\\geq', name: '大於等於' },
    { symbol: '\\neq', name: '不等於' },
    { symbol: '\\approx', name: '約等於' },
    { symbol: '\\equiv', name: '恆等於' },
    { symbol: '\\sim', name: '相似' },
    { symbol: '\\propto', name: '正比於' },
    
    // 集合符號
    { symbol: '\\in', name: '屬於' },
    { symbol: '\\notin', name: '不屬於' },
    { symbol: '\\subset', name: '子集' },
    { symbol: '\\supset', name: '超集' },
    { symbol: '\\subseteq', name: '子集或等於' },
    { symbol: '\\supseteq', name: '超集或等於' },
    { symbol: '\\cup', name: '聯集' },
    { symbol: '\\cap', name: '交集' },
    { symbol: '\\emptyset', name: '空集' },
    
    // 邏輯符號
    { symbol: '\\forall', name: '全稱量詞' },
    { symbol: '\\exists', name: '存在量詞' },
    { symbol: '\\land', name: '且' },
    { symbol: '\\lor', name: '或' },
    { symbol: '\\lnot', name: '非' },
    { symbol: '\\Rightarrow', name: '蘊含' },
    { symbol: '\\Leftrightarrow', name: '等價' },
    
    // 運算符號
    { symbol: '\\pm', name: '正負號' },
    { symbol: '\\mp', name: '負正號' },
    { symbol: '\\times', name: '乘號' },
    { symbol: '\\div', name: '除號' },
    { symbol: '\\cdot', name: '點乘' },
    { symbol: '\\ast', name: '星號' },
    { symbol: '\\oplus', name: '直和' },
    { symbol: '\\otimes', name: '張量積' },
    
    // 希臘字母（常用）
    { symbol: '\\alpha', name: 'α' },
    { symbol: '\\beta', name: 'β' },
    { symbol: '\\gamma', name: 'γ' },
    { symbol: '\\delta', name: 'δ' },
    { symbol: '\\epsilon', name: 'ε' },
    { symbol: '\\theta', name: 'θ' },
    { symbol: '\\lambda', name: 'λ' },
    { symbol: '\\mu', name: 'μ' },
    { symbol: '\\pi', name: 'π' },
    { symbol: '\\sigma', name: 'σ' },
    { symbol: '\\phi', name: 'φ' },
    { symbol: '\\omega', name: 'ω' },
    
    // 微積分
    { symbol: '\\sum', name: '求和' },
    { symbol: '\\prod', name: '乘積' },
    { symbol: '\\int', name: '積分' },
    { symbol: '\\oint', name: '環積分' },
    { symbol: '\\lim', name: '極限' },
    { symbol: '\\partial', name: '偏微分' },
    { symbol: '\\nabla', name: '梯度' },
    { symbol: '\\infty', name: '無窮大' },
    
    // 三角函數
    { symbol: '\\sin', name: 'sin' },
    { symbol: '\\cos', name: 'cos' },
    { symbol: '\\tan', name: 'tan' },
    { symbol: '\\arcsin', name: 'arcsin' },
    { symbol: '\\arccos', name: 'arccos' },
    { symbol: '\\arctan', name: 'arctan' },
    
    // 對數和指數
    { symbol: '\\log', name: 'log' },
    { symbol: '\\ln', name: 'ln' },
    { symbol: '\\exp', name: 'exp' },
    { symbol: 'e^{}', name: 'e的次方' },
    
    // 箭頭
    { symbol: '\\rightarrow', name: '右箭頭' },
    { symbol: '\\leftarrow', name: '左箭頭' },
    { symbol: '\\leftrightarrow', name: '雙向箭頭' },
    { symbol: '\\Rightarrow', name: '雙線右箭頭' },
    { symbol: '\\Leftarrow', name: '雙線左箭頭' },
    { symbol: '\\Leftrightarrow', name: '雙線雙向箭頭' },
    
    // 幾何
    { symbol: '\\angle', name: '角度' },
    { symbol: '\\triangle', name: '三角形' },
    { symbol: '\\perp', name: '垂直' },
    { symbol: '\\parallel', name: '平行' },
    { symbol: '\\cong', name: '全等' },
    { symbol: '\\sim', name: '相似' }
  ];

  // 數學繪圖相關方法 - 使用統一的繪圖邏輯
  startMathDrawing(event: MouseEvent): void {
    // 使用統一的繪圖邏輯
    this.startDrawing(event);
  }

  drawMath(event: MouseEvent): void {
    // 使用統一的繪圖邏輯
    this.draw(event);
  }

  stopMathDrawing(): void {
    // 使用統一的繪圖邏輯
    this.stopDrawing();
  }

  clearMathCanvas(): void {
    // 使用統一的清除邏輯
    this.clearCanvas();
  }

  saveMathDrawing(): void {
    // 使用統一的儲存邏輯
    this.saveDrawing();
  }

  private setupMathCanvas(): void {
    if (this.mathCanvas) {
      const context = this.mathCanvas.nativeElement.getContext('2d');
      if (context) {
        this.mathCtx = context;
        
        // 設置畫布大小
        const canvas = this.mathCanvas.nativeElement;
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        
        // 填充白色背景（避免透明背景轉換為黑色）
        this.mathCtx.fillStyle = '#FFFFFF';
        this.mathCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 設置繪圖樣式
        this.mathCtx.strokeStyle = this.brushColor;
        this.mathCtx.lineWidth = this.brushSize;
        this.mathCtx.lineCap = 'round';
      }
    }
  }

  // 數學公式編輯器相關方法
  updateMathFormula(): void {
    this.userAnswers[this.currentQuestionIndex] = this.mathFormulaAnswer;
    
    // 保存當前狀態到session
    this.saveQuizToSession();
  }

  getMathFormulaAnswer(): string {
    return this.userAnswers[this.currentQuestionIndex] || '';
  }

  // 常用的數學符號和公式模板
  insertMathSymbol(symbol: any): void {
    const symbolText = typeof symbol === 'string' ? symbol : symbol.symbol;
    this.insertAtCursor(symbolText);
    this.updateMathFormula();
  }

  insertMathTemplate(template: any): void {
    const templateText = typeof template === 'string' ? template : template.latex;
    this.insertAtCursor(templateText);
    this.updateMathFormula();
  }

  // 在游標位置插入文字
  insertAtCursor(text: string): void {
    const textarea = document.querySelector('.math-latex-input') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = this.mathFormulaAnswer.substring(0, start);
      const after = this.mathFormulaAnswer.substring(end);
      
      this.mathFormulaAnswer = before + text + after;
      
      // 設定游標位置到插入文字之後
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    } else {
      this.mathFormulaAnswer += text;
    }
  }

  // 聚焦公式編輯器
  focusFormulaEditor(): void {
    const editor = document.querySelector('.math-preview-editor') as HTMLElement;
    if (editor) {
      editor.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editor);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }

  // 處理公式編輯器輸入
  onFormulaEditorInput(event: any): void {
    const text = event.target.textContent || '';
    this.mathFormulaAnswer = text;
    this.updateMathFormula();
  }

  // 處理公式編輯器鍵盤事件
  onFormulaEditorKeydown(event: KeyboardEvent): void {
    // 允許基本編輯操作
    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x', 'z', 'y'].includes(event.key.toLowerCase())) {
        return; // 允許複製、貼上、剪下、復原、重做
      }
    }
    
    // 允許數字、字母、基本符號
    if (/[0-9a-zA-Z+\-*/=<>(){}[\].,;:!?@#$%^&|\\]/.test(event.key) || 
        event.key === ' ' || 
        event.key === 'Backspace' || 
        event.key === 'Delete' || 
        event.key === 'ArrowLeft' || 
        event.key === 'ArrowRight' || 
        event.key === 'ArrowUp' || 
        event.key === 'ArrowDown' ||
        event.key === 'Enter' ||
        event.key === 'Tab') {
      return; // 允許這些按鍵
    }
    
    // 阻止其他按鍵
    event.preventDefault();
  }

  // 處理公式編輯器貼上事件
  onFormulaEditorPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    this.insertAtCursor(text);
    this.updateMathFormula();
  }

 // 數學公式模板
mathTemplates = [
  // 基本代數與對數
  { name: '對數換底公式', latex: '\\log_a b = \\frac{\\ln b}{\\ln a}' },
  { name: '對數性質', latex: '\\log(ab)=\\log a + \\log b, \\quad \\log(\\tfrac{a}{b})=\\log a - \\log b' },
  { name: '指數與對數關係', latex: 'a^{\\log_a b} = b' },

  // 極限
  { name: '極限定義', latex: '\\lim_{x \\to a} f(x) = L' },
  { name: '導數定義', latex: '\\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}' },
  { name: 'e的極限', latex: '\\lim_{n \\to \\infty} \\left(1+\\frac{1}{n}\\right)^n = e' },
  { name: '等比數列極限', latex: '\\lim_{n \\to \\infty} r^n = 0, |r|<1' },
  { name: 'sinx極限', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },

  // 微積分
  { name: '導數規則', latex: '(x^n)\' = n x^{n-1}, (e^x)\'=e^x, (\\ln x)\'=1/x' },
  { name: '鏈鎖法則', latex: '(f(g(x)))\' = f\'(g(x)) g\'(x)' },
  { name: '積分基本公式', latex: '\\int x^n dx = \\tfrac{x^{n+1}}{n+1} + C' },
  { name: '分部積分', latex: '\\int u dv = uv - \\int v du' },
  { name: '泰勒展開', latex: 'f(x) = f(a)+f\'(a)(x-a)+\\tfrac{f\'\'(a)}{2!}(x-a)^2+\\cdots' },

  // 線性代數
  { name: '矩陣乘法', latex: '(AB)_{ij} = \\sum_{k} a_{ik} b_{kj}' },
  { name: '行列式2x2', latex: '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad-bc' },
  { name: '克拉瑪法則', latex: 'x_i = \\tfrac{\\det(A_i)}{\\det(A)}' },
  { name: '特徵值方程', latex: '\\det(A-\\lambda I)=0' },
  { name: '內積', latex: '\\vec{a}\\cdot\\vec{b} = \\sum a_i b_i' },
  { name: '範數', latex: '\\|x\\| = \\sqrt{\\sum x_i^2}' },

  // 機率與統計
  { name: '機率加法公式', latex: 'P(A\\cup B) = P(A)+P(B)-P(A\\cap B)' },
  { name: '條件機率', latex: 'P(A|B) = \\tfrac{P(A\\cap B)}{P(B)}' },
  { name: '貝氏定理', latex: 'P(A|B)=\\tfrac{P(B|A)P(A)}{P(B)}' },
  { name: '期望值', latex: 'E[X]=\\sum x P(x)' },
  { name: '變異數', latex: 'Var(X)=E[X^2]-(E[X])^2' },
  { name: '常態分布', latex: 'X \\sim N(\\mu, \\sigma^2)' },
  { name: '中央極限定理', latex: '\\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}} \\to N(0,1)' },

  // 離散數學 / 資管考常用
  { name: '排列', latex: 'P(n,k) = \\tfrac{n!}{(n-k)!}' },
  { name: '組合', latex: '\\binom{n}{k} = \\tfrac{n!}{k!(n-k)!}' },
  { name: '二項式展開', latex: '(a+b)^n = \\sum_{k=0}^n \\binom{n}{k} a^{n-k} b^k' },
  { name: '集合運算', latex: 'A \\cup B, A \\cap B, A - B, A^c' },
  { name: '數列遞迴', latex: 'a_n = r a_{n-1}, \\quad a_n = a_1 r^{n-1}' },
  { name: '大O記號', latex: 'T(n) = O(f(n))' },
  // 基本運算（移除重複項目）
  { name: '階乘', latex: 'n!' },

  // 微積分（移除重複項目）
  { name: '拉普拉斯算子', latex: '\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2}+\\frac{\\partial^2 f}{\\partial y^2}+\\frac{\\partial^2 f}{\\partial z^2}' },
  { name: '曲線積分', latex: '\\int_C \\vec{F} \\cdot d\\vec{r}' },
  { name: '曲面積分', latex: '\\iint_S \\vec{F} \\cdot d\\vec{S}' },
  { name: '線積分(閉合)', latex: '\\oint_C f(x,y) ds' },

  // 級數與求和（移除重複項目）
  { name: '無窮乘積', latex: '\\prod_{n=1}^{\\infty} a_n' },
  { name: '等比級數', latex: 'S_n = a \\frac{1-r^n}{1-r}' },
  { name: '等差級數', latex: 'S_n = \\frac{n(a_1+a_n)}{2}' },

  // 矩陣與向量（移除重複項目）
  { name: '3x3矩陣', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}' },
  { name: '向量範數', latex: '\\|\\vec{v}\\| = \\sqrt{x^2+y^2+z^2}' },

  // 函數（移除重複項目）
  { name: '雙曲函數', latex: '\\sinh(x), \\cosh(x), \\tanh(x)' },
  { name: '對數函數', latex: '\\log_a(x), \\ln(x), \\lg(x)' },
  { name: '指數函數', latex: 'e^x, a^x' },

  // 集合與邏輯（移除重複項目）
  { name: '差集補集', latex: 'A - B, A^{c}' },
  { name: '子集', latex: 'A \\subset B, A \\subseteq B' },
  { name: '全稱量詞', latex: '\\forall x \\in A, P(x)' },
  { name: '存在量詞', latex: '\\exists x \\in A, P(x)' },

  // 方程與不等式（移除重複項目）
  { name: '解二次方程', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  { name: '絕對值', latex: '|x|, |x - a| < \\epsilon' },

  // 幾何（移除重複項目）
  { name: '相似', latex: '\\triangle ABC \\sim \\triangle DEF' },
  { name: '全等', latex: '\\triangle ABC \\cong \\triangle DEF' },
  { name: '畢氏定理', latex: 'a^2+b^2=c^2' },

  // 統計與機率（移除重複項目）
  { name: '標準差', latex: '\\sigma = \\sqrt{Var(X)}' },
  { name: '常態分布', latex: 'X \\sim N(\\mu, \\sigma^2)' },
  { name: '機率', latex: 'P(A \\cap B) = P(A) P(B|A)' },
  { name: '貝氏定理', latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}' }
];

  // 完整的數學符號庫
  mathSymbols = [
    // 希臘字母 (大寫)
    '\\Alpha', '\\Beta', '\\Gamma', '\\Delta', '\\Epsilon', '\\Zeta', '\\Eta', '\\Theta',
    '\\Iota', '\\Kappa', '\\Lambda', '\\Mu', '\\Nu', '\\Xi', '\\Pi', '\\Rho', '\\Sigma',
    '\\Tau', '\\Upsilon', '\\Phi', '\\Chi', '\\Psi', '\\Omega',
    
    // 希臘字母 (小寫)
    '\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon', '\\varepsilon', '\\zeta', '\\eta',
    '\\theta', '\\vartheta', '\\iota', '\\kappa', '\\lambda', '\\mu', '\\nu', '\\xi',
    '\\pi', '\\varpi', '\\rho', '\\varrho', '\\sigma', '\\varsigma', '\\tau', '\\upsilon',
    '\\phi', '\\varphi', '\\chi', '\\psi', '\\omega',
    
    // 基本運算符
    '\\pm', '\\mp', '\\times', '\\div', '\\cdot', '\\ast', '\\star', '\\bullet',
    '\\circ', '\\diamond', '\\triangle', '\\bigtriangleup', '\\bigtriangledown',
    
    // 關係符號
    '\\leq', '\\geq', '\\neq', '\\approx', '\\equiv', '\\propto', '\\sim', '\\simeq',
    '\\cong', '\\ll', '\\gg', '\\prec', '\\succ', '\\preceq', '\\succeq',
    '\\subset', '\\supset', '\\subseteq', '\\supseteq', '\\in', '\\notin',
    '\\cup', '\\cap', '\\sqcup', '\\sqcap', '\\vee', '\\wedge',
    
    // 箭頭符號
    '\\rightarrow', '\\leftarrow', '\\leftrightarrow', '\\Rightarrow', '\\Leftarrow',
    '\\Leftrightarrow', '\\mapsto', '\\hookleftarrow', '\\hookrightarrow',
    '\\nearrow', '\\searrow', '\\swarrow', '\\nwarrow', '\\uparrow', '\\downarrow',
    '\\updownarrow', '\\Uparrow', '\\Downarrow', '\\Updownarrow',
    
    // 微積分符號
    '\\partial', '\\nabla', '\\infty', '\\lim', '\\limsup', '\\liminf',
    '\\int', '\\iint', '\\iiint', '\\oint', '\\sum', '\\prod', '\\coprod',
    '\\bigcup', '\\bigcap', '\\bigsqcup', '\\bigvee', '\\bigwedge',
    '\\bigoplus', '\\bigotimes', '\\bigodot',
    
    // 函數符號
    '\\sin', '\\cos', '\\tan', '\\cot', '\\sec', '\\csc',
    '\\arcsin', '\\arccos', '\\arctan', '\\sinh', '\\cosh', '\\tanh',
    '\\log', '\\ln', '\\lg', '\\exp', '\\min', '\\max', '\\sup', '\\inf',
    '\\det', '\\dim', '\\ker', '\\deg', '\\arg', '\\gcd', '\\lcm',
    
    // 集合符號
    '\\emptyset', '\\varnothing', '\\mathbb{N}', '\\mathbb{Z}', '\\mathbb{Q}',
    '\\mathbb{R}', '\\mathbb{C}', '\\mathbb{P}', '\\mathbb{F}',
    
    // 邏輯符號
    '\\land', '\\lor', '\\lnot', '\\neg', '\\forall', '\\exists', '\\nexists',
    '\\therefore', '\\because', '\\iff', '\\implies', '\\impliedby',
    
    // 其他符號
    '\\hbar', '\\ell', '\\wp', '\\Re', '\\Im', '\\aleph', '\\beth', '\\gimel',
    '\\daleth', '\\backslash', '\\setminus', '\\smallsetminus'
  ];
}
