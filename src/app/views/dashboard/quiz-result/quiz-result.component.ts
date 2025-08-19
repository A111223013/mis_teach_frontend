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
  questions: QuizAnswer[]; // 所有題目的詳細資訊
  errors: QuizAnswer[]; // 錯題列表
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
    console.log('QuizResultComponent initialized');
    
    this.route.params.subscribe(params => {
      this.resultId = params['resultId'];
      console.log('Result ID from route:', this.resultId);
      
      if (this.resultId) {
        this.loadQuizResult();
      } else {
        console.log('No result ID provided');
        this.error = '缺少測驗結果ID';
        this.loading = false;
      }
    });
  }

  async loadQuizResult(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      
      console.log('Loading quiz result for exam ID:', this.resultId);
      
      const response = await this.ragService.getQuizResult(this.resultId).toPromise();
      console.log('API response:', response);
      
      if (response?.success) {
        this.quizResult = response.data;
        console.log('Quiz result loaded:', this.quizResult);
        console.log('Questions count:', this.quizResult?.questions?.length);
        console.log('Has questions field:', 'questions' in (this.quizResult || {}));
        console.log('All quizResult keys:', this.quizResult ? Object.keys(this.quizResult) : []);
        
        // 檢查是否有題目資料
        if (!this.quizResult?.questions || this.quizResult.questions.length === 0) {
          console.warn('⚠️ 後端沒有回傳題目資料，嘗試從其他欄位構建');
          
          // 嘗試從 errors 欄位構建題目資料
          if (this.quizResult?.errors && this.quizResult.errors.length > 0) {
            console.log('Found errors array:', this.quizResult.errors);
            if (this.quizResult) {
              this.quizResult.questions = this.quizResult.errors;
            }
          } else {
            // 如果都沒有，創建空的題目陣列
            console.warn('⚠️ 沒有題目資料，創建空陣列');
            if (this.quizResult) {
              this.quizResult.questions = [];
            }
          }
        }
        
        // 初始化篩選
        this.filterType = 'all';
        this.applyFilter();
      } else {
        console.log('No exam data in response');
        this.error = '無法載入測驗結果';
      }
    } catch (error) {
      console.error('Error loading quiz result:', error);
      this.error = '載入測驗結果時發生錯誤';
    } finally {
      this.loading = false;
    }
  }

  // 合併篩選邏輯
  setFilter(type: 'all' | 'wrong' | 'marked' | 'correct' | 'unanswered'): void {
    console.log('setFilter called with type:', type);
    this.filterType = type;
    this.applyFilter();
  }

  // 簡化的篩選邏輯
  applyFilter(): void {
    console.log('applyFilter called, filterType:', this.filterType);
    console.log('quizResult:', this.quizResult);
    
    if (!this.quizResult) {
      console.log('No quizResult, returning');
      return;
    }
    
    // 直接使用後端回傳的完整題目資料
    const allQuestions = this.quizResult.questions || [];
    console.log('All questions:', allQuestions);
    
    switch (this.filterType) {
      case 'wrong':
        this.filteredQuestions = allQuestions.filter(q => !q.is_correct);
        console.log('Filtered wrong questions:', this.filteredQuestions);
        break;
      case 'correct':
        this.filteredQuestions = allQuestions.filter(q => q.is_correct);
        console.log('Filtered correct questions:', this.filteredQuestions);
        break;
      case 'unanswered':
        this.filteredQuestions = allQuestions.filter(q => !q.user_answer || q.user_answer === '');
        console.log('Filtered unanswered questions:', this.filteredQuestions);
        break;
      default:
        this.filteredQuestions = allQuestions;
        console.log('Filtered all questions:', this.filteredQuestions);
    }
    
    console.log('Final filteredQuestions:', this.filteredQuestions);
  }

  // 合併所有統計方法為一個通用方法
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

  // 合併題目狀態判斷
  getQuestionStatus(question: QuizAnswer, type: 'icon' | 'color'): string {
    if (question.is_correct) {
      return type === 'icon' ? 'cilCheckCircle' : 'success';
    }
    if (!question.user_answer || question.user_answer === '') {
      return type === 'icon' ? 'cilCircle' : 'secondary';
    }
    // 有答案但答錯的情況
    if (question.user_answer && question.user_answer !== '正確作答') {
      return type === 'icon' ? 'cilXCircle' : 'danger';
    }
    // 其他情況（如未作答）
    return type === 'icon' ? 'cilCircle' : 'secondary';
  }

  // 合併答案文字處理
  getAnswerDisplay(answer: string, isCorrect: boolean = false): string {
    if (!answer || answer === '') return '未作答';
    return answer;
  }

  // 簡化的分數顏色
  getScoreColor(): string {
    const percentage = this.getStatValue('percentage');
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  showQuestionDetail(question: QuizAnswer): void {
    this.selectedQuestion = question;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedQuestion = null;
  }

  getFilterButtonClass(type: string): string {
    return this.filterType === type ? 'btn-primary' : 'btn-outline-primary';
  }

  async startErrorLearning(): Promise<void> {
    try {
      console.log('開始錯題學習，resultId:', this.resultId);
      this.quizResultService.startErrorLearning(this.resultId);
    } catch (error) {
      console.error('開始錯題學習錯誤:', error);
      this.quizResultService.startErrorLearning(this.resultId);
    }
  }



  generateAnalysisReport(): void {
    alert('分析報告功能尚未實現');
  }

  goBackToQuiz(): void {
    this.router.navigate(['/dashboard/quiz-center']);
  }
}
