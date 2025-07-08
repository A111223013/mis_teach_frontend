import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { 
  ButtonModule, 
  CardModule, 
  TableModule,
  DropdownModule,
  ModalModule,
  ToastModule,
  BadgeModule,
  AlertModule,
  ProgressModule,
  GridModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilBook, cilReload, cilInstitution, cilOptions, cilLightbulb, cilLoop, cilChart, cilX, cilCheckCircle, cilXCircle, cilWarning, cilInfo } from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';

// 更新介面以匹配實際數據結構
interface Answer {
  question_number: string;
  type: string;
  question_text: string;
  student_answer: string;
  correct_answer: string;
  score: number;
  is_correct: boolean;
  feedback: string;
  grading_type: string;
  options?: string[];
  ai_analysis?: {
    accuracy_percentage: number;
    key_elements_coverage: number;
    key_elements_in_standard: string[];
    key_elements_covered: string[];
    missing_key_elements: string[];
    accuracy_issues: string[];
  };
}

interface AnswerAnalysis {
  total_questions: number;
  by_type: {
    [key: string]: {
      count: number;
      correct: number;
      avg_score: number;
      total_score: number;
    };
  };
  by_grading_result: {
    [key: string]: number;
  };
  by_score_range: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
    failed: number;
  };
}

interface GradingResults {
  total_score: number;
  average_score: number;
  correct_count: number;
  accuracy_rate: number;
  processed_count: number;
  skipped_count: number;
  error_count: number;
  graded_at: string;
  grading_method: string;
}

interface BasicInfo {
  school: string;
  department: string;
  year: string;
  subject: string;
}

interface SubmissionRecord {
  _id: string;
  submission_id: string;
  user_name: string;
  user_email: string;
  submit_time: string;
  basic_info: BasicInfo;
  answer_analysis: AnswerAnalysis;
  answer_summary: any;
  grading_results: GradingResults;
  answers: Answer[];
  status: string;
}

interface ErrorQuestion {
  answer: Answer;
  errorType: 'wrong' | 'incomplete' | 'failed';
  improvement_suggestion: string;
}

@Component({
  selector: 'app-error-retrieval',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    DropdownModule,
    ModalModule,
    ToastModule,
    BadgeModule,
    AlertModule,
    ProgressModule,
    IconModule,
    GridModule
  ],
  templateUrl: './error-retrieval.component.html',
  styleUrl: './error-retrieval.component.scss'
})
export class ErrorRetrievalComponent implements OnInit {
  
  submissionRecords: SubmissionRecord[] = [];
  selectedSubmission: SubmissionRecord | null = null;
  errorQuestions: ErrorQuestion[] = [];
  loading = false;
  error = '';
  showDetailModal = false;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public iconSet: IconSetService
  ) {
    // 註入需要的圖示
    iconSet.icons = {
      cilBook,
      cilReload,
      cilInstitution,
      cilOptions,
      cilLightbulb,
      cilLoop,
      cilChart,
      cilX,
      cilCheckCircle,
      cilXCircle,
      cilWarning,
      cilInfo
    };
  }

  ngOnInit(): void {
    this.loadSubmissionRecords();
  }

  loadSubmissionRecords(): void {
    this.loading = true;
    this.error = '';
    
    this.dashboardService.getUserSubmissions().subscribe({
      next: (response: any) => {
        console.log('提交記錄回應:', response);
        this.submissionRecords = response.submissions || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('載入答題記錄失敗:', error);
        this.error = '載入答題記錄失敗，請重新整理頁面';
        this.loading = false;
      }
    });
  }

  /**
   * 查看詳細錯題分析
   */
  viewErrorAnalysis(record: SubmissionRecord): void {
    this.selectedSubmission = record;
    this.analyzeErrors(record);
    this.showDetailModal = true;
  }

  /**
   * 分析錯題
   */
  analyzeErrors(record: SubmissionRecord): void {
    this.errorQuestions = [];
    
    if (!record.answers) return;

    record.answers.forEach(answer => {
      if (!answer.is_correct || answer.score < 70) {
        let errorType: 'wrong' | 'incomplete' | 'failed' = 'wrong';
        let suggestion = '';

        // 根據分數和評分類型判斷錯誤類型
        if (answer.score === 0) {
          errorType = 'failed';
          if (answer.grading_type === 'invalid_answer') {
            suggestion = '建議仔細思考後再作答，避免回答「不知道」等無效答案。';
          } else {
            suggestion = '答案完全錯誤，建議重新學習相關概念。';
          }
        } else if (answer.score < 50) {
          errorType = 'wrong';
          suggestion = '答案部分正確，但仍有重要概念需要加強。';
        } else {
          errorType = 'incomplete';
          suggestion = '答案基本正確，但還可以更完整詳細。';
        }

        // 根據 AI 分析提供更具體的建議
        if (answer.ai_analysis) {
          const ai = answer.ai_analysis;
          if (ai.missing_key_elements.length > 0) {
            suggestion += ` 缺少關鍵要素：${ai.missing_key_elements.join('、')}。`;
          }
          if (ai.accuracy_issues.length > 0) {
            suggestion += ` 準確度問題：${ai.accuracy_issues.join('、')}。`;
          }
        }

        this.errorQuestions.push({
          answer,
          errorType,
          improvement_suggestion: suggestion
        });
      }
    });

    // 按題目編號排序
    this.errorQuestions.sort((a, b) => 
      parseInt(a.answer.question_number) - parseInt(b.answer.question_number)
    );
  }



  /**
   * 獲取錯誤類型顯示文字
   */
  getErrorTypeText(errorType: string): string {
    switch (errorType) {
      case 'wrong': return '答案錯誤';
      case 'incomplete': return '答案不完整';
      case 'failed': return '未作答/無效';
      default: return '需要改進';
    }
  }

  /**
   * 獲取錯誤類型顏色
   */
  getErrorTypeColor(errorType: string): string {
    switch (errorType) {
      case 'wrong': return 'danger';
      case 'incomplete': return 'warning';
      case 'failed': return 'secondary';
      default: return 'light';
    }
  }

  /**
   * 獲取分數顏色
   */
  getScoreColor(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'danger';
  }

  /**
   * 獲取題型顯示文字
   */
  getQuestionTypeText(type: string): string {
    switch (type) {
      case 'single-choice': return '單選題';
      case 'multiple-choice': return '多選題';
      case 'true-false': return '是非題';
      case 'short-answer': return '簡答題';
      case 'long-answer': return '問答題';
      default: return type;
    }
  }

  /**
   * 關閉詳細模態框
   */
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSubmission = null;
    this.errorQuestions = [];
  }

  /**
   * 進入學習模式 - 查看詳細的答題結果和解析
   */
  enterLearningMode(record: SubmissionRecord): void {
    this.viewErrorAnalysis(record);
  }

  /**
   * 重新複習 - 重新做這份考試
   */
  retakeExam(record: SubmissionRecord): void {
    console.log('重新複習:', record.basic_info);
    this.router.navigate(['/students/exam'], { 
      queryParams: {
        school: record.basic_info.school,
        year: record.basic_info.year,
        subject: record.basic_info.subject,
        department: record.basic_info.department,
        mode: 'retake'
      } 
    });
  }

  /**
   * 格式化時間顯示
   */
  formatSubmitTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * 獲取完成率的顏色樣式
   */
  getCompletionRateColor(rate: number): string {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }

  /**
   * 計算完成率
   */
  getCompletionRate(record: SubmissionRecord): number {
    if (!record.grading_results) return 0;
    const total = record.grading_results.processed_count + record.grading_results.skipped_count;
    if (total === 0) return 0;
    return Math.round((record.grading_results.processed_count / total) * 100);
  }

  /**
   * 獲取狀態徽章樣式
   */
  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'graded':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'draft':
        return 'secondary';
      default:
        return 'light';
    }
  }

  /**
   * 獲取狀態顯示文字
   */
  getStatusText(status: string): string {
    switch (status) {
      case 'graded':
        return '已評分';
      case 'in_progress':
        return '進行中';
      case 'draft':
        return '草稿';
      default:
        return '未知';
    }
  }

  /**
   * 計算錯題數量
   */
  getErrorCount(record: SubmissionRecord): number {
    if (!record.answers) return 0;
    return record.answers.filter(answer => !answer.is_correct || answer.score < 70).length;
  }

  /**
   * TrackBy 函數用於 ngFor 優化
   */
  trackBySubmissionId(index: number, record: SubmissionRecord): string {
    return record.submission_id;
  }

  /**
   * 獲取已完成的數量
   */
  getCompletedCount(): number {
    return this.submissionRecords.filter(record => record.status === 'graded').length;
  }

  /**
   * 獲取平均完成率
   */
  getAverageCompletionRate(): number {
    if (this.submissionRecords.length === 0) return 0;
    
    const totalRate = this.submissionRecords.reduce((sum, record) => 
      sum + this.getCompletionRate(record), 0);
    
    return Math.round(totalRate / this.submissionRecords.length);
  }

  /**
   * 獲取平均分數
   */
  getAverageScore(): number {
    if (this.submissionRecords.length === 0) return 0;
    
    const totalScore = this.submissionRecords.reduce((sum, record) => 
      sum + (record.grading_results?.average_score || 0), 0);
    
    return Math.round(totalScore / this.submissionRecords.length);
  }

  /**
   * 獲取總錯題數
   */
  getTotalErrorCount(): number {
    return this.submissionRecords.reduce((sum, record) => 
      sum + this.getErrorCount(record), 0);
  }

  /**
   * 重新整理資料
   */
  refresh(): void {
    this.loadSubmissionRecords();
  }

  /**
   * 獲取特定錯誤類型的數量
   */
  getErrorTypeCount(errorType: string): number {
    return this.errorQuestions.filter(eq => eq.errorType === errorType).length;
  }
}
