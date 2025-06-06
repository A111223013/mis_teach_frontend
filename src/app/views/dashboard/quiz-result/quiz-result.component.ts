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
  filterType: 'all' | 'wrong' | 'marked' | 'correct' = 'all';
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
      const response = await this.ragService.getQuizResult(this.resultId).toPromise();
      
      if (response?.success) {
        this.quizResult = response.result;
        this.applyFilter();
      } else {
        this.error = response?.error || '載入測驗結果失敗';
      }
    } catch (error) {
      console.error('載入測驗結果錯誤:', error);
      this.error = '載入測驗結果時發生錯誤';
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
      default:
        this.filteredQuestions = this.quizResult.answers;
    }
  }

  setFilter(type: 'all' | 'wrong' | 'marked' | 'correct'): void {
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

  getQuestionStatusIcon(question: QuizAnswer): string {
    if (question.is_correct) return 'cilCheckCircle';
    return 'cilXCircle';
  }

  getQuestionStatusColor(question: QuizAnswer): string {
    if (question.is_correct) return 'success';
    return 'danger';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  async startErrorLearning(): Promise<void> {
    try {
      const response = await this.ragService.startErrorLearning(this.resultId).toPromise();
      
      if (response?.success) {
        // 導航到 AI 智能教學頁面
        this.router.navigate(['/dashboard/ai-tutoring', response.session_id]);
      } else {
        console.error('開始錯題學習失敗:', response?.error);
      }
    } catch (error) {
      console.error('開始錯題學習錯誤:', error);
    }
  }

  viewAllQuestions(): void {
    // 可以導航到完整的題目檢視頁面
    console.log('查看所有題目');
  }

  generateAnalysisReport(): void {
    // 可以導航到詳細分析報告頁面
    console.log('生成分析報告');
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
}
