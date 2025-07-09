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
  template: `
    <div class="mistake-analysis-container p-4">
      <c-card>
        <c-card-header class="bg-danger text-white">
          <h3 class="mb-0">
            <c-icon name="cilListRich" class="me-2"></c-icon>
            錯題分析
          </h3>
        </c-card-header>
        <c-card-body>
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p class="mt-3">載入錯題數據中...</p>
          </div>

          <div *ngIf="!loading">
            <div class="filters mb-4">
              <h5 class="mb-3">篩選選項</h5>
              <c-row>
                <c-col xs="12" md="6" xl="3">
                  <div class="mb-3">
                    <label class="form-label">知識點</label>
                    <select class="form-select" [(ngModel)]="filters.topic" (change)="applyFilters()">
                      <option value="">全部知識點</option>
                      <option *ngFor="let topic of topicOptions" [value]="topic">{{ topic }}</option>
                    </select>
                  </div>
                </c-col>
                <c-col xs="12" md="6" xl="3">
                  <div class="mb-3">
                    <label class="form-label">章節</label>
                    <select class="form-select" [(ngModel)]="filters.chapter" (change)="applyFilters()">
                      <option value="">全部章節</option>
                      <option *ngFor="let chapter of chapterOptions" [value]="chapter">{{ chapter }}</option>
                    </select>
                  </div>
                </c-col>
                <c-col xs="12" md="6" xl="3">
                  <div class="mb-3">
                    <label class="form-label">時間範圍</label>
                    <select class="form-select" [(ngModel)]="filters.timeRange" (change)="applyFilters()">
                      <option value="">全部時間</option>
                      <option value="day">今天</option>
                      <option value="week">本週</option>
                      <option value="month">本月</option>
                      <option value="year">今年</option>
                    </select>
                  </div>
                </c-col>
                <c-col xs="12" md="6" xl="3">
                  <div class="mb-3">
                    <label class="form-label">測驗類型</label>
                    <select class="form-select" [(ngModel)]="filters.examType" (change)="applyFilters()">
                      <option value="">全部類型</option>
                      <option value="knowledge">知識點測驗</option>
                      <option value="pastexam">考古題測驗</option>
                    </select>
                  </div>
                </c-col>
              </c-row>
              
              <div class="d-flex justify-content-end mb-3">
                <button class="btn btn-outline-secondary me-2" (click)="resetFilters()">
                  <c-icon name="cilFilterX" class="me-1"></c-icon>
                  重置篩選
                </button>
                <button class="btn btn-primary" (click)="startReviewSession()">
                  <c-icon name="cilBook" class="me-1"></c-icon>
                  開始複習選中錯題
                </button>
              </div>
            </div>

            <div class="stats-row mb-4">
              <c-row>
                <c-col xs="6" md="3">
                  <div class="stat-card bg-light p-3 rounded text-center">
                    <h2 class="text-danger">{{ filteredMistakes.length }}</h2>
                    <p class="text-muted mb-0">篩選錯題數</p>
                  </div>
                </c-col>
                <c-col xs="6" md="3">
                  <div class="stat-card bg-light p-3 rounded text-center">
                    <h2 class="text-primary">{{ weakestTopic }}</h2>
                    <p class="text-muted mb-0">最弱知識點</p>
                  </div>
                </c-col>
                <c-col xs="6" md="3">
                  <div class="stat-card bg-light p-3 rounded text-center">
                    <h2 class="text-warning">{{ recentMistakes }}</h2>
                    <p class="text-muted mb-0">本週新增錯題</p>
                  </div>
                </c-col>
                <c-col xs="6" md="3">
                  <div class="stat-card bg-light p-3 rounded text-center">
                    <h2 class="text-success">{{ reviewedCount }}</h2>
                    <p class="text-muted mb-0">已複習次數</p>
                  </div>
                </c-col>
              </c-row>
            </div>

            <h5 class="mb-3">錯題列表</h5>

            <div *ngIf="filteredMistakes.length === 0" class="text-center py-5">
              <c-icon name="cilCheckCircle" size="3xl" class="text-success mb-3"></c-icon>
              <h5>沒有符合條件的錯題</h5>
              <p class="text-muted">嘗試調整篩選條件或清除篩選</p>
            </div>

            <div *ngIf="filteredMistakes.length > 0">
              <c-row class="g-3">
                <c-col xs="12" md="6" xl="4" *ngFor="let mistake of filteredMistakes">
                  <c-card class="h-100 mistake-card">
                    <c-card-header class="d-flex justify-content-between align-items-center py-2">
                      <div>
                        <c-badge color="danger" class="me-2">錯題</c-badge>
                        <c-badge color="info">{{ mistake.topic }}</c-badge>
                      </div>
                      <small class="text-muted">{{ formatDate(mistake.timestamp) }}</small>
                    </c-card-header>
                    <c-card-body>
                      <p class="question-text mb-3">{{ mistake.question_text }}</p>
                      
                      <div class="answers mb-3">
                        <div class="mb-2">
                          <small class="text-muted d-block">您的答案：</small>
                          <div class="p-2 bg-danger-subtle rounded">
                            <span class="text-danger">{{ mistake.student_answer }}</span>
                          </div>
                        </div>
                        <div>
                          <small class="text-muted d-block">正確答案：</small>
                          <div class="p-2 bg-success-subtle rounded">
                            <span class="text-success">{{ mistake.correct_answer }}</span>
                          </div>
                        </div>
                      </div>
                    </c-card-body>
                    <c-card-footer class="bg-light d-flex justify-content-between">
                      <small class="text-muted">章節：{{ mistake.chapter }}</small>
                      <button class="btn btn-sm btn-primary" (click)="reviewMistake(mistake)">
                        <c-icon name="cilBook" class="me-1"></c-icon> 立即複習
                      </button>
                    </c-card-footer>
                  </c-card>
                </c-col>
              </c-row>
            </div>
          </div>
        </c-card-body>
      </c-card>
    </div>

    <!-- 錯題詳情模態框 -->
    <c-modal [visible]="showDetailModal" (visibleChange)="showDetailModal = $event" size="lg">
      <c-modal-header>
        <h5 cModalTitle>錯題詳情</h5>
      </c-modal-header>
      <c-modal-body *ngIf="selectedMistake">
        <div class="mistake-detail">
          <div class="mb-4">
            <h6 class="text-muted">題目內容</h6>
            <div class="p-3 bg-light rounded">
              {{ selectedMistake.question_text }}
            </div>
          </div>

          <c-row>
            <c-col xs="12" md="6">
              <h6 class="text-muted">您的答案</h6>
              <div class="p-3 bg-danger-subtle rounded">
                <span class="text-danger">{{ selectedMistake.student_answer }}</span>
              </div>
            </c-col>

            <c-col xs="12" md="6">
              <h6 class="text-muted">正確答案</h6>
              <div class="p-3 bg-success-subtle rounded">
                <span class="text-success">{{ selectedMistake.correct_answer }}</span>
              </div>
            </c-col>
          </c-row>

          <div class="mt-4">
            <h6 class="text-muted">知識點和章節</h6>
            <div class="d-flex flex-wrap gap-2">
              <c-badge color="info">知識點: {{ selectedMistake.topic }}</c-badge>
              <c-badge color="secondary">章節: {{ selectedMistake.chapter }}</c-badge>
              <c-badge color="primary" *ngIf="selectedMistake.exam_type">
                {{ selectedMistake.exam_type === 'knowledge' ? '知識點測驗' : '考古題測驗' }}
              </c-badge>
            </div>
          </div>

          <div class="mt-4">
            <h6 class="text-muted">AI 解析</h6>
            <div class="p-3 bg-light rounded" *ngIf="aiExplanation">
              {{ aiExplanation }}
            </div>
            <div class="p-3 bg-light rounded text-muted" *ngIf="!aiExplanation">
              <div class="text-center">
                <div *ngIf="loadingExplanation" class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span *ngIf="loadingExplanation">正在生成解析...</span>
                <span *ngIf="!loadingExplanation">點擊下方按鈕獲取 AI 解析</span>
              </div>
            </div>
          </div>
        </div>
      </c-modal-body>
      <c-modal-footer>
        <button cButton color="secondary" (click)="showDetailModal = false">
          關閉
        </button>
        <button 
          cButton 
          color="info" 
          *ngIf="!aiExplanation && !loadingExplanation"
          (click)="getAIExplanation()">
          <c-icon name="cilLightbulb" class="me-1"></c-icon> 獲取 AI 解析
        </button>
        <button cButton color="primary" (click)="startSingleReview()">
          <c-icon name="cilBook" class="me-1"></c-icon> 開始複習此題
        </button>
      </c-modal-footer>
    </c-modal>
  `,
  styles: [`
    .mistake-analysis-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .stat-card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .question-text {
      font-weight: 500;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .mistake-card {
      transition: transform 0.2s;
      border: 1px solid #f1f1f1;
    }
    
    .mistake-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
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
