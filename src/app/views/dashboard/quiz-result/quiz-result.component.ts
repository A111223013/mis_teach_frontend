import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
  type?: string;  // 題目類型
  topic?: string;
  difficulty?: number;
  answer_time?: string;
  time_taken?: number;
  options?: string[];
  image_file?: string;
  key_points?: string;
  feedback?: {
    explanation?: string;
    strengths?: string;
    suggestions?: string;
    weaknesses?: string;
  };
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
export class QuizResultComponent implements OnInit, AfterViewChecked {
  
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
    private quizResultService: QuizResultService,
    private cdr: ChangeDetectorRef
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

  ngAfterViewChecked(): void {
    // 頁面載入完成後自動觸發 LaTeX 渲染
    this.renderMathInElement();
  }

  loadQuizResult(): void {
    this.loading = true;
    this.error = '';
    
    this.ragService.getQuizResult(this.resultId).subscribe({
      next: (response) => {
        if (response?.success) {
          this.quizResult = response.data;
          console.log('🔍 測驗結果數據:', this.quizResult);
          
          // 調試：檢查畫圖答案
          if (this.quizResult?.questions) {
            this.quizResult.questions.forEach((question, index) => {
              console.log(`🔍 題目 ${index + 1}:`, {
                type: question.type,
                user_answer: question.user_answer,
                answer_length: question.user_answer?.length,
                is_base64: question.user_answer?.startsWith('data:image/'),
                is_long_answer: question.user_answer?.startsWith('LONG_ANSWER_')
              });
              
              if (question.type === 'draw-answer') {
                console.log(`🎨 畫圖題 ${index + 1} 詳細信息:`, {
                  user_answer: question.user_answer,
                  answer_length: question.user_answer?.length,
                  is_base64: question.user_answer?.startsWith('data:image/'),
                  is_long_answer: question.user_answer?.startsWith('LONG_ANSWER_'),
                  isDrawingAnswer_result: this.isDrawingAnswer(question.user_answer, question.type)
                });
              }
            });
          }
          
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
          
          // 數據載入完成後觸發 LaTeX 渲染
          setTimeout(() => {
            this.renderMathInElement();
          }, 200);
        } else {
          this.error = '無法載入測驗結果';
        }
      },
      error: (error) => {
        console.error('❌ 載入測驗結果失敗:', error);
        this.error = '載入測驗結果時發生錯誤';
      },
      complete: () => {
        this.loading = false;
      }
    });
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
        // 錯誤：有答案但答案不正確
        this.filteredQuestions = allQuestions.filter(q => 
          q.user_answer && 
          q.user_answer !== '' && 
          q.user_answer !== '未作答' && 
          !q.is_correct
        );
        break;
      case 'correct':
        // 正確：有答案且答案正確
        this.filteredQuestions = allQuestions.filter(q => 
          q.user_answer && 
          q.user_answer !== '' && 
          q.user_answer !== '未作答' && 
          q.is_correct
        );
        break;
      case 'unanswered':
        // 未答：沒有答案或答案為空或為"未作答"
        this.filteredQuestions = allQuestions.filter(q => 
          !q.user_answer || 
          q.user_answer === '' || 
          q.user_answer === '未作答'
        );
        break;
      case 'marked':
        // 標記：已標記的題目
        this.filteredQuestions = allQuestions.filter(q => q.is_marked);
        break;
      default:
        // 全部：顯示所有題目
        this.filteredQuestions = allQuestions;
    }
  }

  // 統一的統計值獲取方法
  getStatValue(type: 'correct' | 'wrong' | 'marked' | 'unanswered' | 'total' | 'percentage' | 'time'): any {
    if (!this.quizResult) return type === 'time' ? '0:00' : 0;
    
    const allQuestions = this.quizResult.questions || [];
    
    switch (type) {
      case 'correct':
        // 正確：有答案且答案正確
        return allQuestions.filter(q => 
          q.user_answer && 
          q.user_answer !== '' && 
          q.user_answer !== '未作答' && 
          q.is_correct
        ).length;
      case 'wrong':
        // 錯誤：有答案但答案不正確
        return allQuestions.filter(q => 
          q.user_answer && 
          q.user_answer !== '' && 
          q.user_answer !== '未作答' && 
          !q.is_correct
        ).length;
      case 'unanswered':
        // 未答：沒有答案或答案為空或為"未作答"
        return allQuestions.filter(q => 
          !q.user_answer || 
          q.user_answer === '' || 
          q.user_answer === '未作答'
        ).length;
      case 'marked':
        // 標記：已標記的題目
        return allQuestions.filter(q => q.is_marked).length;
      case 'total':
        return this.quizResult.total_questions || 0;
      case 'percentage':
        const totalForPercentage = this.quizResult.total_questions || 0;
        const correct = this.getStatValue('correct');
        return totalForPercentage > 0 ? Math.round((correct / totalForPercentage) * 100) : 0;
      case 'time':
        const totalTime = this.quizResult.total_time_taken || 0;
        if (totalTime === 0) return '0:00';
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
  getAnswerDisplay(answer: string, questionType?: string): string {
    if (!answer || answer === '') {
      return '未作答';
    }
    
    // 如果是畫圖題且答案看起來像 base64 圖片數據
    if (questionType === 'draw-answer' && answer.startsWith('data:image/')) {
      return '[畫圖答案]';
    }
    
    // 如果是長答案引用錯誤
    if (answer.includes('[長答案載入失敗') || answer.includes('[長答案解析錯誤')) {
      return '答案載入失敗';
    }
    
    return answer;
  }

  // 檢查是否為畫圖答案
  isDrawingAnswer(answer: string, questionType?: string): boolean {
    return questionType === 'draw-answer' && !!answer && answer.startsWith('data:image/');
  }

  // 渲染題目文本中的 LaTeX 數學公式
  renderQuestionText(questionText: string): string {
    if (!questionText) {
      return '';
    }

    console.log('🔍 原始題目文本:', questionText);

    // 將 LaTeX 語法轉換為 HTML 格式供 KaTeX 渲染
    const rendered = questionText
      .replace(/\$\$(.*?)\$\$/g, '<div class="math-display">$$$1$$</div>')
      .replace(/\$(.*?)\$/g, '<span class="math-inline">$$$1$$</span>')
      .replace(/\\\((.*?)\\\)/g, '<span class="math-inline">$$$1$$</span>')
      .replace(/\\\[(.*?)\\\]/g, '<div class="math-display">$$$1$$</div>');
    
    console.log('🔍 渲染後的 HTML:', rendered);
    return rendered;
  }

  // 渲染數學公式
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

  // 渲染元素中的數學公式
  renderMathInElement(): void {
    console.log('🔍 開始渲染 LaTeX 數學公式');
    
    // 檢查 KaTeX 是否載入
    if (!(window as any).renderMathInElement) {
      console.warn('⚠️ renderMathInElement 函數未載入');
      return;
    }
    
    console.log('✅ KaTeX 已載入，開始渲染');
    
    // 使用 KaTeX 的 auto-render 功能，與作答頁面保持一致
    setTimeout(() => {
      try {
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
        console.log('✅ LaTeX 渲染完成');
      } catch (error) {
        console.error('❌ LaTeX 渲染失敗:', error);
      }
    }, 100);
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
    
    console.log('🔍 顯示題目詳情:', question);
    
    // 模態框打開後觸發 LaTeX 渲染
    setTimeout(() => {
      console.log('🔍 模態框打開，開始渲染 LaTeX');
      this.renderMathInElement();
    }, 300);
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
