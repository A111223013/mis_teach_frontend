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
    examType: ''
  };
  
  // 可選選項 - 動態從 API 數據生成
  topicOptions: string[] = [];
  chapterOptions: string[] = [];
  
  // 錯題數據
  allMistakes: MistakeQuestion[] = [];
  filteredMistakes: MistakeQuestion[] = [];
  
  // 統計數據
  weakestTopic: string = '載入中...';
  recentMistakes: number = 0;
  reviewedCount: number = 0;
  
  // 詳情模態框
  selectedMistake: MistakeQuestion | null = null;
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
    this.loadMistakes();
  }
  
  loadMistakes(): void {
    this.loading = true;
    
    // 調用真實的 API 獲取用戶提交歷史
    this.dashboardService.getUserSubmissions().subscribe({
      next: (response: any) => {
        console.log('API 響應:', response);
        if (response?.success !== false && response?.submissions) {
          this.processSubmissionsData(response.submissions);
        } else {
          console.warn('載入用戶提交失敗:', response?.message);
          // 使用空數據而不是模擬數據
          this.allMistakes = [];
          this.topicOptions = [];
          this.chapterOptions = [];
          this.calculateStatistics();
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('載入錯題數據錯誤:', error);
        // 檢查是否是授權問題
        if (error.status === 401) {
          console.error('授權失敗，可能需要重新登入');
        } else if (error.status === 500) {
          console.error('服務器錯誤，請稍後再試');
        }
        // 使用空數據
        this.allMistakes = [];
        this.topicOptions = [];
        this.chapterOptions = [];
        this.calculateStatistics();
        this.applyFilters();
        this.loading = false;
      }
    });
  }

  private processSubmissionsData(submissions: any[]): void {
    this.allMistakes = [];
    const topicSet = new Set<string>();
    const chapterSet = new Set<string>();
    let wrongCount = 0;
    
    // 遍歷所有提交記錄
    submissions.forEach(submission => {
      const answers = submission.answers || [];
      const submitTime = new Date(submission.submit_time || Date.now());
      
      // 提取錯題
      const wrongAnswers = answers.filter((answer: any) => !answer.is_correct);
      wrongCount += wrongAnswers.length;
      
      wrongAnswers.forEach((answer: any) => {
        const mistake: MistakeQuestion = {
          id: `${submission.submission_id}_${answer.question_number}`,
          question_text: answer.question_text || '題目內容未提供',
          student_answer: answer.student_answer || answer.answer || '',
          correct_answer: answer.correct_answer || '',
          topic: this.extractTopic(answer) || '未分類',
          chapter: this.extractChapter(answer) || '未分類',
          timestamp: submitTime,
          exam_id: submission.submission_id,
          exam_type: this.determineExamType(submission),
          score: answer.score || 0,
          is_correct: answer.is_correct || false,
          question_number: answer.question_number,
          type: answer.type,
          feedback: answer.feedback
        };
        
        this.allMistakes.push(mistake);
        topicSet.add(mistake.topic);
        chapterSet.add(mistake.chapter);
      });
    });
    
    // 更新選項列表
    this.topicOptions = Array.from(topicSet).sort();
    this.chapterOptions = Array.from(chapterSet).sort();
    
    // 計算統計數據
    this.calculateStatistics();
    
    // 應用篩選
    this.applyFilters();
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
    if (this.allMistakes.length === 0) {
      this.weakestTopic = '無錯題資料';
      this.recentMistakes = 0;
      this.reviewedCount = 0;
      return;
    }
    
    // 計算最弱知識點
    const topicCounts: { [key: string]: number } = {};
    this.allMistakes.forEach(mistake => {
      topicCounts[mistake.topic] = (topicCounts[mistake.topic] || 0) + 1;
    });
    
    this.weakestTopic = Object.keys(topicCounts).reduce((a, b) => 
      topicCounts[a] > topicCounts[b] ? a : b
    );
    
    // 計算本週新增錯題
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    this.recentMistakes = this.allMistakes.filter(mistake => 
      mistake.timestamp > weekAgo
    ).length;
    
    // 模擬複習次數（實際應用中可從後端獲取）
    this.reviewedCount = Math.floor(this.allMistakes.length * 0.3);
  }
  
  applyFilters(): void {
    this.filteredMistakes = this.allMistakes.filter(mistake => {
      // 知識點篩選
      if (this.filters.topic && mistake.topic !== this.filters.topic) {
        return false;
      }
      
      // 章節篩選
      if (this.filters.chapter && mistake.chapter !== this.filters.chapter) {
        return false;
      }
      
      // 時間範圍篩選
      if (this.filters.timeRange) {
        const now = new Date();
        const mistakeDate = new Date(mistake.timestamp);
        
        if (this.filters.timeRange === 'day') {
          // 今天
          if (mistakeDate.getDate() !== now.getDate() ||
              mistakeDate.getMonth() !== now.getMonth() ||
              mistakeDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (this.filters.timeRange === 'week') {
          // 本週（過去7天）
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (mistakeDate < sevenDaysAgo) {
            return false;
          }
        } else if (this.filters.timeRange === 'month') {
          // 本月
          if (mistakeDate.getMonth() !== now.getMonth() ||
              mistakeDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        } else if (this.filters.timeRange === 'year') {
          // 今年
          if (mistakeDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }
      
      // 測驗類型篩選
      if (this.filters.examType && mistake.exam_type !== this.filters.examType) {
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
      examType: ''
    };
    
    this.filteredMistakes = [...this.allMistakes];
  }
  
  reviewMistake(mistake: MistakeQuestion): void {
    this.selectedMistake = mistake;
    this.showDetailModal = true;
    this.aiExplanation = ''; // 重置解析
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  
  getAIExplanation(): void {
    if (!this.selectedMistake) return;
    
    this.loadingExplanation = true;
    
    // 使用真實的 feedback 或生成模擬解析
    setTimeout(() => {
      if (this.selectedMistake?.feedback) {
        this.aiExplanation = this.selectedMistake.feedback;
      } else {
        this.aiExplanation = `此題考察的是${this.selectedMistake?.topic}領域中的基本概念。
正確答案應該選擇「${this.selectedMistake?.correct_answer}」，因為根據${this.selectedMistake?.chapter}的內容，這是最準確的描述。

錯誤選擇「${this.selectedMistake?.student_answer}」的常見原因是混淆了相關概念。這是一個常見的誤區，需要注意區分。

學習建議：
1. 重新複習${this.selectedMistake?.chapter}的相關內容
2. 特別關注概念之間的區別
3. 練習相關類型的題目鞏固理解

希望這個解析對您有所幫助！`;
      }
      
      this.loadingExplanation = false;
    }, 1500);
  }
  
  startSingleReview(): void {
    if (!this.selectedMistake) return;
    this.showDetailModal = false;
    
    // 導航到 AI 輔導頁面，攜帶錯題資訊
    this.router.navigate(['/dashboard/ai-tutoring'], {
      queryParams: { 
        questionId: this.selectedMistake.id,
        mode: 'mistake_review'
      }
    });
  }
  
  startReviewSession(): void {
    if (this.filteredMistakes.length === 0) return;
    
    // 導航到 AI 輔導頁面，攜帶所有篩選錯題的 ID
    const mistakeIds = this.filteredMistakes.map(m => m.id).join(',');
    this.router.navigate(['/dashboard/ai-tutoring'], {
      queryParams: { 
        mistakeIds: mistakeIds,
        mode: 'batch_review'
      }
    });
  }
}
