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
import { QuizResultService } from '../../../service/quiz-result.service';

interface QuizAnswer {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  is_marked: boolean;
  topic?: string;
  difficulty?: number;
  answer_time?: string;
  time_taken?: number;
  options?: string[];
  image_file?: string;
  key_points?: string;
}

interface QuizResult {
  quiz_history_id?: number;
  quiz_template_id?: number;
  user_email?: string;
  quiz_type?: string;
  total_questions: number;
  answered_questions: number;
  correct_count: number;
  wrong_count: number;
  total_time_taken?: number;
  submit_time: string;
  status?: string;
  created_at?: string;
  questions: QuizAnswer[];
  errors: QuizAnswer[];
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
  
  filterType: 'all' | 'wrong' | 'marked' | 'correct' | 'unanswered' = 'all';
  filteredQuestions: QuizAnswer[] = [];
  
  selectedQuestion: QuizAnswer | null = null;
  showDetailModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ragService: RagAssistantService,
    private quizResultService: QuizResultService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resultId = params['resultId'];
      if (this.resultId) {
        this.loadQuizResult();
      } else {
        this.error = '缺少測驗結果ID';
        this.loading = false;
      }
    });
  }

  async loadQuizResult(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      
      const response = await this.ragService.getQuizResult(this.resultId).toPromise();
      
      if (response?.success) {
        this.quizResult = response.data;
        
        // 確保題目資料存在
        if (this.quizResult) {
          if (!this.quizResult.questions || this.quizResult.questions.length === 0) {
            if (this.quizResult.errors && this.quizResult.errors.length > 0) {
              this.quizResult.questions = this.quizResult.errors;
            } else {
              this.quizResult.questions = [];
            }
          }
        }
        
        this.filterType = 'all';
        this.applyFilter();
      } else {
        this.error = '無法載入測驗結果';
      }
    } catch (error) {
      this.error = '載入測驗結果時發生錯誤';
    } finally {
      this.loading = false;
    }
  }

  // 合併篩選邏輯
  setFilter(type: 'all' | 'wrong' | 'marked' | 'correct' | 'unanswered'): void {
    this.filterType = type;
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.quizResult) return;
    
    const allQuestions = this.quizResult.questions || [];
    
    switch (this.filterType) {
      case 'wrong':
        this.filteredQuestions = allQuestions.filter(q => !q.is_correct);
        break;
      case 'correct':
        this.filteredQuestions = allQuestions.filter(q => q.is_correct);
        break;
      case 'unanswered':
        this.filteredQuestions = allQuestions.filter(q => !q.user_answer || q.user_answer === '');
        break;
      default:
        this.filteredQuestions = allQuestions;
    }
  }

  // 統一的統計值獲取方法
  getStatValue(type: 'correct' | 'wrong' | 'marked' | 'unanswered' | 'total' | 'percentage' | 'time'): any {
    if (!this.quizResult) return type === 'time' ? '0:00' : 0;
    
    switch (type) {
      case 'correct':
        return this.quizResult.correct_count || 0;
      case 'wrong':
        return this.quizResult.wrong_count || 0;
      case 'total':
        return this.quizResult.total_questions || 0;
      case 'percentage':
        const total = this.quizResult.total_questions || 0;
        const correct = this.quizResult.correct_count || 0;
        return total > 0 ? Math.round((correct / total) * 100) : 0;
      case 'time':
        const totalTime = this.quizResult.total_time_taken || 0;
        if (totalTime === 0) return '0:00';
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      case 'marked':
        const questions = this.quizResult.questions || [];
        return questions.filter(q => q.is_marked).length;
      case 'unanswered':
        const allQuestions = this.quizResult.questions || [];
        return allQuestions.filter(q => !q.user_answer || q.user_answer === '').length;
      default:
        return 0;
    }
  }

  // 統一的題目狀態判斷
  getQuestionStatus(question: QuizAnswer, type: 'icon' | 'color'): string {
    if (question.is_correct) {
      return type === 'icon' ? 'cilCheckCircle' : 'success';
    }
    if (!question.user_answer || question.user_answer === '') {
      return type === 'icon' ? 'cilCircle' : 'secondary';
    }
    return type === 'icon' ? 'cilXCircle' : 'danger';
  }

  // 統一的答案顯示處理
  getAnswerDisplay(answer: string): string {
    return !answer || answer === '' ? '未作答' : answer;
  }

  // 分數顏色判斷
  getScoreColor(): string {
    const percentage = this.getStatValue('percentage');
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  // 題目詳情相關
  showQuestionDetail(question: QuizAnswer): void {
    this.selectedQuestion = question;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedQuestion = null;
  }

  // 篩選按鈕樣式
  getFilterButtonClass(type: string): string {
    return this.filterType === type ? 'btn-primary' : 'btn-outline-primary';
  }

  // 開始錯題學習
  startErrorLearning(): void {
    this.quizResultService.startErrorLearning(this.resultId);
  }



  generateAnalysisReport(): void {
    alert('分析報告功能尚未實現');
  }

  goBackToQuiz(): void {
    this.router.navigate(['/dashboard/quiz-center']);
  }
}
