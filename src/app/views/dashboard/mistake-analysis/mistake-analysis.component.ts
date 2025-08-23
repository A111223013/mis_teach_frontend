import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardModule,
  ButtonModule,
  GridModule,
  BadgeModule,
  UtilitiesModule,
  TooltipModule,
  DropdownModule,
  ModalModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DashboardService } from '../../../service/dashboard.service';

interface MistakeQuestion {
  id: string;
  question_text: string;
  student_answer: string;
  correct_answer: string;
  topic: string;
  chapter: string;
  timestamp: Date;
  exam_id?: string;
  exam_type?: string;
  score: number;
  is_correct: boolean;
  question_number?: string;
  type?: string;
  feedback?: string;
  status: 'correct' | 'wrong' | 'unanswered'; // 新增狀態分類
}

@Component({
  selector: 'app-mistake-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    GridModule,
    BadgeModule,
    UtilitiesModule,
    TooltipModule,
    DropdownModule,
    ModalModule,
    IconModule
  ],
  templateUrl: './mistake-analysis.component.html',
  styleUrls: ['./mistake-analysis.component.scss']
})
export class MistakeAnalysisComponent implements OnInit {
  // 篩選選項
  filters = {
    topic: '',
    chapter: '',
    timeRange: '',
    examType: '',
    status: '' // 新增狀態篩選
  };
  
  // 可選選項 - 動態從 API 數據生成
  topicOptions: string[] = [];
  chapterOptions: string[] = [];
  statusOptions: string[] = ['correct', 'wrong', 'unanswered'];
  
  // 題目數據
  allQuestions: MistakeQuestion[] = [];
  filteredQuestions: MistakeQuestion[] = [];
  
  // 分類統計
  correctQuestions: MistakeQuestion[] = [];
  wrongQuestions: MistakeQuestion[] = [];
  unansweredQuestions: MistakeQuestion[] = [];
  
  // 統計數據
  weakestTopic: string = '載入中...';
  recentMistakes: number = 0;
  reviewedCount: number = 0;
  
  // 詳情模態框
  selectedQuestion: MistakeQuestion | null = null;
  showDetailModal: boolean = false;
  aiExplanation: string = '';
  loadingExplanation: boolean = false;
  
  // 狀態控制
  loading: boolean = true;
  
  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}
  
  ngOnInit(): void {
    this.loadSubmissionsAnalysis();
  }
  
  loadSubmissionsAnalysis(): void {
    this.loading = true;
    
    // 調用新的 submissions 分析 API
    this.dashboardService.getUserSubmissionsAnalysis().subscribe({
      next: (response: any) => {
        if (response?.success !== false && response?.submissions) {
          this.processSubmissionsData(response.submissions);
        } else {
          this.allQuestions = [];
          this.filteredQuestions = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ 獲取測驗數據失敗:', error);
        this.loading = false;
        this.allQuestions = [];
        this.filteredQuestions = [];
      }
    });
  }

  // 處理 submissions 數據，分類所有題目
  private processSubmissionsData(submissions: any[]): void {
    this.allQuestions = [];
    const topicSet = new Set<string>();
    const chapterSet = new Set<string>();
    
    // 遍歷所有提交記錄
    submissions.forEach(submission => {
      const answers = submission.answers || {};
      const submitTime = new Date(submission.submit_time || Date.now());
      const totalQuestions = submission.total_questions || 0;
      
      // 處理每道題目
      for (let i = 0; i < totalQuestions; i++) {
        const answerKey = i.toString();
        const answer = answers[answerKey];
        
        if (answer) {
          // 有答案的題目
          const question: MistakeQuestion = {
            id: `${submission.submission_id}_${i}`,
            question_text: answer.question_text || '題目內容未提供',
            student_answer: answer.user_answer || '',
            correct_answer: answer.correct_answer || '',
            topic: this.extractTopic(answer) || '未分類',
            chapter: this.extractChapter(answer) || '未分類',
            timestamp: submitTime,
            exam_id: submission.submission_id,
            exam_type: submission.quiz_type || 'unknown',
            score: answer.score || 0,
            is_correct: answer.is_correct || false,
            question_number: i.toString(),
            type: answer.question_type || 'unknown',
            feedback: `用戶回答：${answer.user_answer}，正確答案：${answer.correct_answer}`,
            status: answer.is_correct ? 'correct' : 'wrong'
          };
          
          this.allQuestions.push(question);
          topicSet.add(question.topic);
          chapterSet.add(question.chapter);
        } else {
          // 未作答的題目
          const question: MistakeQuestion = {
            id: `${submission.submission_id}_${i}_unanswered`,
            question_text: '題目內容未提供',
            student_answer: '',
            correct_answer: '',
            topic: '未分類',
            chapter: '未分類',
            timestamp: submitTime,
            exam_id: submission.submission_id,
            exam_type: submission.quiz_type || 'unknown',
            score: 0,
            is_correct: false,
            question_number: i.toString(),
            type: 'unknown',
            feedback: '此題未作答',
            status: 'unanswered'
          };
          
          this.allQuestions.push(question);
        }
      }
    });
    
    // 分類題目
    this.categorizeQuestions();
    
    // 更新選項列表
    this.topicOptions = Array.from(topicSet).sort();
    this.chapterOptions = Array.from(chapterSet).sort();
    
    // 計算統計數據
    this.calculateStatistics();
    
    // 應用篩選
    this.applyFilters();
  }

  // 分類題目
  private categorizeQuestions(): void {
    this.correctQuestions = this.allQuestions.filter(q => q.status === 'correct');
    this.wrongQuestions = this.allQuestions.filter(q => q.status === 'wrong');
    this.unansweredQuestions = this.allQuestions.filter(q => q.status === 'unanswered');
    
  }
  
  private extractTopic(answer: any): string {
    // 優先從 AI 分析中提取
    if (answer.ai_analysis?.key_elements_in_standard?.length > 0) {
      return answer.ai_analysis.key_elements_in_standard[0];
    }
    
    // 從題目類型推斷
    if (answer.type) {
      const typeMapping: { [key: string]: string } = {
        'single-choice': '選擇題',
        'multiple-choice': '多選題',
        'true-false': '是非題',
        'short-answer': '簡答題',
        'long-answer': '問答題',
        'coding-answer': '程式設計'
      };
      return typeMapping[answer.type] || answer.type;
    }
    
    return '未分類';
  }
  
  private extractChapter(answer: any): string {
    // 從題目編號或內容推斷章節
    if (answer.question_number) {
      const num = parseInt(answer.question_number);
      if (!isNaN(num)) {
        return `第${Math.ceil(num / 10)}章`;
      }
    }
    
    return '未分類';
  }
  
  private determineExamType(submission: any): string {
    // 根據提交資料判斷考試類型
    if (submission.basic_info?.school) {
      return 'pastexam';
    }
    return 'knowledge';
  }
  
  private calculateStatistics(): void {
    if (this.allQuestions.length === 0) {
      this.weakestTopic = '無錯題資料';
      this.recentMistakes = 0;
      this.reviewedCount = 0;
      return;
    }
    
    // 計算最弱知識點
    const topicCounts: { [key: string]: number } = {};
    this.allQuestions.forEach(question => {
      topicCounts[question.topic] = (topicCounts[question.topic] || 0) + 1;
    });
    
    this.weakestTopic = Object.keys(topicCounts).reduce((a, b) => 
      topicCounts[a] > topicCounts[b] ? a : b
    );
    
    // 計算本週新增錯題
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.recentMistakes = this.allQuestions.filter(question => 
      question.timestamp > weekAgo
    ).length;
    
    // 模擬複習次數（實際應用中可從後端獲取）
    this.reviewedCount = Math.floor(this.allQuestions.length * 0.3);
  }

  private extractFilterOptions(): void {
    const topicSet = new Set<string>();
    const chapterSet = new Set<string>();

    this.allQuestions.forEach(question => {
      topicSet.add(question.topic);
      chapterSet.add(question.chapter);
    });

    this.topicOptions = Array.from(topicSet).sort();
    this.chapterOptions = Array.from(chapterSet).sort();
  }
  
  applyFilters(): void {
    this.filteredQuestions = this.allQuestions.filter(question => {
      // 知識點篩選
      if (this.filters.topic && question.topic !== this.filters.topic) {
        return false;
      }
      
      // 章節篩選
      if (this.filters.chapter && question.chapter !== this.filters.chapter) {
        return false;
      }
      
      // 時間範圍篩選
      if (this.filters.timeRange) {
        const now = new Date();
        const questionDate = new Date(question.timestamp);
        
        if (this.filters.timeRange === 'day') {
          // 今天
          if (questionDate.getDate() !== now.getDate() ||
              questionDate.getMonth() !== now.getMonth() ||
              questionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (this.filters.timeRange === 'week') {
          // 本週（過去7天）
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (questionDate < sevenDaysAgo) {
            return false;
          }
        } else if (this.filters.timeRange === 'month') {
          // 本月
          if (questionDate.getMonth() !== now.getMonth() ||
              questionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (this.filters.timeRange === 'year') {
          // 今年
          if (questionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }
      
      // 測驗類型篩選
      if (this.filters.examType && question.exam_type !== this.filters.examType) {
        return false;
      }
      
      // 狀態篩選
      if (this.filters.status && question.status !== this.filters.status) {
        return false;
      }
      
      return true;
    });
  }
  
  resetFilters(): void {
    this.filters = {
      topic: '',
      chapter: '',
      timeRange: '',
      examType: '',
      status: ''
    };
    
    this.filteredQuestions = [...this.allQuestions];
  }
  
  reviewMistake(question: MistakeQuestion): void {
    this.selectedQuestion = question;
    this.showDetailModal = true;
    this.aiExplanation = ''; // 重置解析
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  
  getAIExplanation(): void {
    if (!this.selectedQuestion) return;
    
    this.loadingExplanation = true;
    
    // 使用真實的 feedback 或生成模擬解析
    setTimeout(() => {
      if (this.selectedQuestion?.feedback) {
        this.aiExplanation = this.selectedQuestion.feedback;
      } else {
        this.aiExplanation = `此題考察的是${this.selectedQuestion?.topic}領域中的基本概念。
正確答案應該選擇「${this.selectedQuestion?.correct_answer}」，因為根據${this.selectedQuestion?.chapter}的內容，這是最準確的描述。

錯誤選擇「${this.selectedQuestion?.student_answer}」的常見原因是混淆了相關概念。這是一個常見的誤區，需要注意區分。

學習建議：
1. 重新複習${this.selectedQuestion?.chapter}的相關內容
2. 特別關注概念之間的區別
3. 練習相關類型的題目鞏固理解

希望這個解析對您有所幫助！`;
      }
      
      this.loadingExplanation = false;
    }, 1500);
  }
  
  startSingleReview(): void {
    if (!this.selectedQuestion) return;
    this.showDetailModal = false;
    
    // 導航到 AI 輔導頁面，攜帶題目資訊
    this.router.navigate(['/dashboard/ai-tutoring'], {
      queryParams: { 
        questionId: this.selectedQuestion.id,
        mode: 'mistake_review'
      }
    });
  }
  
  startReviewSession(): void {
    if (this.filteredQuestions.length === 0) return;
    
    // 導航到 AI 輔導頁面，攜帶所有篩選題目的 ID
    const questionIds = this.filteredQuestions.map(q => q.id).join(',');
    this.router.navigate(['/dashboard/ai-tutoring'], {
      queryParams: { 
        questionIds: questionIds,
        mode: 'batch_review'
      }
    });
  }

  // 獲取各類題目數量
  getCorrectCount(): number {
    return this.correctQuestions.length;
  }

  getWrongCount(): number {
    return this.wrongQuestions.length;
  }

  getUnansweredCount(): number {
    return this.unansweredQuestions.length;
  }

  // 獲取篩選後的各類題目數量
  getFilteredCorrectCount(): number {
    return this.filteredQuestions.filter(q => q.status === 'correct').length;
  }

  getFilteredWrongCount(): number {
    return this.filteredQuestions.filter(q => q.status === 'wrong').length;
  }

  getFilteredUnansweredCount(): number {
    return this.filteredQuestions.filter(q => q.status === 'unanswered').length;
  }
}
