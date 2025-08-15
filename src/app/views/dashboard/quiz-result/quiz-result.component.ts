import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  ButtonModule,
  ProgressModule,
  BadgeModule,
  ModalModule,
  GridModule,
  UtilitiesModule,
  TooltipModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { RagAssistantService } from '../../../service/rag-assistant.service';

interface QuizAnswer {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  is_marked: boolean;
  topic?: string;
  difficulty?: number;
  answer_time?: number;
}

interface QuizResult {
  user_id: string;
  quiz_id: string;
  answers: QuizAnswer[];
  submit_time: string;
  total_time: number;
  score: number;
  total_questions: number;
  answered_questions: number;  // 添加已作答題數
  correct_count: number;
  wrong_count: number;
  marked_count: number;
  unanswered_count: number;
}

@Component({
  selector: 'app-quiz-result',
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
    TooltipModule,
    IconModule
  ],
  templateUrl: './quiz-result.component.html',
  styleUrls: ['./quiz-result.component.scss']
})
export class QuizResultComponent implements OnInit {
  
  resultId: string = '';
  quizResult: QuizResult | null = null;
  loading = true;
  error = '';
  
  // 篩選和顯示選項
  filterType: 'all' | 'wrong' | 'marked' | 'correct' | 'unanswered' = 'all';
  filteredQuestions: QuizAnswer[] = [];
  
  // 詳細資訊模態框
  selectedQuestion: QuizAnswer | null = null;
  showDetailModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ragService: RagAssistantService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resultId = params['resultId'];
      if (this.resultId) {
        this.loadQuizResult();
      } else {
        this.error = '無效的測驗結果ID';
        this.loading = false;
      }
    });
  }

  async loadQuizResult(): Promise<void> {
    try {
      this.loading = true;
      
      // 如果是 mock 結果 ID，使用本地存儲的數據
      if (this.resultId.startsWith('mock_')) {
        this.loadMockQuizResult();
        return;
      }
      
      const response = await this.ragService.getQuizResult(this.resultId).toPromise();
      
      if (response?.success) {
        // 後端返回的數據在 response.data 中，不是 response.result
        this.quizResult = response.data;
        this.applyFilter();
      } else {
        this.error = response?.error || '載入測驗結果失敗';
      }
    } catch (error) {
      console.error('載入測驗結果錯誤:', error);
      this.error = '載入測驗結果時發生錯誤，請確認測驗結果ID是否正確';
    } finally {
      this.loading = false;
    }
  }

  applyFilter(): void {
    if (!this.quizResult) return;

    switch (this.filterType) {
      case 'wrong':
        this.filteredQuestions = this.quizResult.answers.filter(q => !q.is_correct);
        break;
      case 'marked':
        this.filteredQuestions = this.quizResult.answers.filter(q => q.is_marked);
        break;
      case 'correct':
        this.filteredQuestions = this.quizResult.answers.filter(q => q.is_correct);
        break;
      case 'unanswered':
        // 如果沒有答案數據，顯示所有未答題
        if (!this.quizResult.answers || this.quizResult.answers.length === 0) {
          this.filteredQuestions = this.generateAllQuestionsDisplay();
        } else {
          this.filteredQuestions = this.quizResult.answers.filter(q => q.user_answer === '未作答');
        }
        break;
      default:
        // 如果沒有答案數據，生成所有題目的顯示數據
        if (!this.quizResult.answers || this.quizResult.answers.length === 0) {
          this.filteredQuestions = this.generateAllQuestionsDisplay();
        } else {
          this.filteredQuestions = this.quizResult.answers;
        }
    }
  }

  private generateAllQuestionsDisplay(): QuizAnswer[] {
    if (!this.quizResult) return [];
    
    const allQuestions: QuizAnswer[] = [];
    
    for (let i = 0; i < this.quizResult.total_questions; i++) {
      allQuestions.push({
        question_id: `q${i + 1}`,
        question_text: `題目 ${i + 1}`,
        user_answer: '未作答',
        correct_answer: '無',
        is_correct: false,
        is_marked: false,
        topic: '未分類',
        difficulty: 1
      });
    }
    
    return allQuestions;
  }

  setFilter(type: 'all' | 'wrong' | 'marked' | 'correct' | 'unanswered'): void {
    this.filterType = type;
    this.applyFilter();
  }

  showQuestionDetail(question: QuizAnswer): void {
    this.selectedQuestion = question;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedQuestion = null;
  }

  getScoreColor(): string {
    if (!this.quizResult) return 'secondary';

    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  getScorePercentage(): number {
    if (!this.quizResult || this.quizResult.total_questions === 0) return 0;
    return Math.round((this.quizResult.correct_count / this.quizResult.total_questions) * 100);
  }

  getUnansweredCount(): number {
    if (!this.quizResult) return 0;
    // 計算未答題數
    return this.quizResult.total_questions - this.quizResult.answered_questions;
  }

  getTotalQuestionsCount(): number {
    if (!this.quizResult) return 0;
    return this.quizResult.total_questions;
  }

  getQuestionStatusIcon(question: QuizAnswer): string {
    if (question.is_correct) return 'cilCheckCircle';
    if (question.user_answer === '未作答') return 'cilCircle';
    return 'cilXCircle';
  }

  getQuestionStatusColor(question: QuizAnswer): string {
    if (question.is_correct) return 'success';
    if (question.user_answer === '未作答') return 'secondary';
    return 'danger';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async startErrorLearning(): Promise<void> {
    try {
      console.log('開始錯題學習，resultId:', this.resultId);
      
      // 保存result_id到localStorage，供AI tutoring組件使用
      localStorage.setItem('current_result_id', this.resultId);
      
      // 嘗試調用後端 API
      const response = await this.ragService.startErrorLearning(this.resultId).toPromise();
      
      if (response?.success && response?.session_id) {
        console.log('後端API成功，導航到AI tutoring:', response.session_id);
        // 導航到 AI 智能教學頁面
        this.router.navigate(['/dashboard/ai-tutoring', response.session_id], {
          queryParams: { 
            source: 'quiz_result',
            result_id: this.resultId 
          }
        });
      } else {
        // 如果後端 API 失敗，直接跳轉到 ai-tutoring，使用 resultId 作為 sessionId
        console.warn('後端 API 失敗，直接跳轉到 AI tutoring');
        this.router.navigate(['/dashboard/ai-tutoring', this.resultId], {
          queryParams: { 
            source: 'quiz_result',
            result_id: this.resultId 
          }
        });
      }
    } catch (error) {
      console.error('開始錯題學習錯誤:', error);
      // 發生錯誤時，直接跳轉到 ai-tutoring
      this.router.navigate(['/dashboard/ai-tutoring', this.resultId], {
        queryParams: { 
          source: 'quiz_result',
          result_id: this.resultId 
        }
      });
    }
  }

  viewAllQuestions(): void {
    // 導航到完整的題目檢視頁面
    this.router.navigate(['/dashboard/quiz-center']);
  }

  generateAnalysisReport(): void {
    // 導航到詳細分析報告頁面
    this.router.navigate(['/dashboard/quiz-center']);
  }

  goBackToQuiz(): void {
    this.router.navigate(['/dashboard/quiz-center']);
  }

  getFilterButtonClass(type: string): string {
    return this.filterType === type ? 'btn-primary' : 'btn-outline-primary';
  }

  getWrongQuestionsCount(): number {
    return this.quizResult?.wrong_count || 0;
  }

  getMarkedWrongQuestionsCount(): number {
    if (!this.quizResult) return 0;
    return this.quizResult.answers.filter(q => q.is_marked && !q.is_correct).length;
  }

  // 添加輔助方法來正確顯示答案
  getAnswerText(userAnswer: any): string {
    if (!userAnswer) return '未作答';
    
    if (typeof userAnswer === 'string') {
      return userAnswer;
    }
    
    if (userAnswer.answer) {
      return userAnswer.answer;
    }
    
    return JSON.stringify(userAnswer);
  }

  getCorrectAnswerText(userAnswer: any): string {
    if (!userAnswer) return '無';
    
    if (userAnswer.feedback && userAnswer.feedback.reference_answer) {
      return userAnswer.feedback.reference_answer;
    }
    
    return '無參考答案';
  }

  private loadMockQuizResult(): void {
    // 從 localStorage 或生成模擬錯題數據
    const mockData = this.generateMockResultData();
    this.quizResult = mockData;
    this.applyFilter();
  }

  private generateMockResultData(): QuizResult {
    // 生成模擬的測驗結果，包含錯題
    const mockAnswers: QuizAnswer[] = [
      {
        question_id: 'q1',
        question_text: '下列何者是關聯式資料庫的特性？',
        user_answer: '選項 A：數據不一致性',
        correct_answer: '選項 B：數據一致性',
        is_correct: false,
        is_marked: true,
        topic: '資料庫',
        difficulty: 2
      },
      {
        question_id: 'q2', 
        question_text: 'SQL 中的 SELECT 語句用於什麼？',
        user_answer: '選項 C：查詢數據',
        correct_answer: '選項 C：查詢數據',
        is_correct: true,
        is_marked: false,
        topic: '資料庫',
        difficulty: 1
      },
      {
        question_id: 'q3',
        question_text: '在網路協定中，TCP 的主要特色是什麼？',
        user_answer: '選項 A：無連接',
        correct_answer: '選項 B：可靠的連接',
        is_correct: false,
        is_marked: false,
        topic: '網路',
        difficulty: 2
      },
      {
        question_id: 'q4',
        question_text: '下列哪個是排序演算法？',
        user_answer: '選項 D：快速排序',
        correct_answer: '選項 D：快速排序',
        is_correct: true,
        is_marked: true,
        topic: '演算法',
        difficulty: 2
      },
      {
        question_id: 'q5',
        question_text: '什麼是資訊安全的三大要素？',
        user_answer: '選項 A：機密性、速度、成本',
        correct_answer: '選項 C：機密性、完整性、可用性',
        is_correct: false,
        is_marked: true,
        topic: '資訊安全',
        difficulty: 3
      }
    ];

    const correctCount = mockAnswers.filter(a => a.is_correct).length;
    const wrongCount = mockAnswers.filter(a => !a.is_correct).length;
    const markedCount = mockAnswers.filter(a => a.is_marked).length;

    return {
      user_id: 'test_user',
      quiz_id: this.resultId,
      answers: mockAnswers,
      submit_time: new Date().toISOString(),
      total_time: 1200, // 20 分鐘
      score: Math.round((correctCount / mockAnswers.length) * 100),
      total_questions: mockAnswers.length,
      answered_questions: mockAnswers.length,  // 添加已作答題數
      correct_count: correctCount,
      wrong_count: wrongCount,
      marked_count: markedCount,
      unanswered_count: 0
    };
  }
}
