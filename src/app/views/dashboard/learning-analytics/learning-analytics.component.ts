import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

// CoreUI 組件導入
import { 
  CardComponent, 
  CardBodyComponent, 
  CardHeaderComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent
} from '@coreui/angular';

// 服務導入
import { LearningAnalyticsService, AIDiagnosisData } from '../../../service/learning-analytics.service';
// 暫時註釋掉不存在的模型
// import { AIDiagnosis } from '../../../models/ai-diagnosis.model';
// import { PracticeQuestion } from '../../../models/practice-question.model';

interface LearningAnalyticsData {
  overview: any;
  trends: any[];
  progress_tracking?: any[];
  improvement_items?: any[];
  attention_items?: any[];
  radar_data?: any;
}

@Component({
  selector: 'app-learning-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ],
  templateUrl: './learning-analytics.component.html',
  styleUrls: ['./learning-analytics.component.scss']
})
export class LearningAnalyticsComponent implements OnInit, AfterViewInit {
  // 數據屬性
  analyticsData: LearningAnalyticsData | null = null;
  overview: any = null;
  isLoading = false;

  // 模態框相關
  aiDiagnosisModalVisible = false;
  currentAIDiagnosis: AIDiagnosisData | null = null;
  isDiagnosisLoading = false;
  isAIPracticeLoading = false;  // 新增：AI出題載入狀態
  showAILearningPath = false;  // 是否顯示AI學習路徑
  currentConceptData: any = null;  // 當前概念詳細數據
  showFullDiagnosis = false;  // 是否展開詳細診斷
  learningPathModalVisible = false;
  practiceModalVisible = false;
  aiDiagnosis: any = null;
  practiceQuestions: any[] = [];
  
  selectedWeakPoint: any = null;
  selectedLearningPlan: any = null;
  selectedMicro: any = null;
  
  // 其他屬性
  isLoadingAI = false;
  trendData: any[] = [];
  selectedTrendPeriod = 7;
  topWeakPoints: any[] = [];
  improvementItems: any[] = [];
  attentionItems: any[] = [];
  progressTracking: any[] = [];
  radarData: any = null;
  currentTime: string = '';
  
  // 指標卡片數據
  metricCards: any[] = [];
  

  // 圖表相關
  @ViewChild('radarChart', { static: false }) radarChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendLineChart', { static: false }) trendLineChart?: ElementRef<HTMLCanvasElement>;

  private dataSubscription?: Subscription;

  constructor(
    private learningAnalyticsService: LearningAnalyticsService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadAllData();
    this.handleQueryParams();
  }

  handleQueryParams() {
    // 檢查URL查詢參數，處理AI建議的行動
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'material') {
      const concept = urlParams.get('concept');
      const domain = urlParams.get('domain');
      const reviewAction = urlParams.get('reviewAction');
      const reviewDetail = urlParams.get('reviewDetail');
      const estMin = urlParams.get('estMin');
      
      if (concept && reviewAction) {
        alert(`AI建議：${reviewAction}\n\n描述：${reviewDetail}\n概念：${concept}\n領域：${domain}\n預計時間：${estMin}分鐘\n\n將為您打開相關教材內容...`);
        // 這裡可以實現打開教材的邏輯
      }
    } else if (action === 'practice') {
      const conceptId = urlParams.get('conceptId');
      const conceptName = urlParams.get('conceptName');
      const domain = urlParams.get('domain');
      const practiceAction = urlParams.get('practiceAction');
      const practiceDetail = urlParams.get('practiceDetail');
      const estMin = urlParams.get('estMin');
      
      if (conceptName && practiceAction) {
        alert(`AI建議：${practiceAction}\n\n描述：${practiceDetail}\n概念：${conceptName}\n領域：${domain}\n預計時間：${estMin}分鐘\n\n將為您準備相關練習題...`);
        // 這裡可以實現打開練習的邏輯
      }
    }
  }

  ngAfterViewInit() {
    // 視圖初始化後的邏輯
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // 載入所有數據
  loadAllData() {
    this.isLoading = true;

    this.dataSubscription = this.learningAnalyticsService.loadAllData(this.selectedTrendPeriod).subscribe({
      next: (data: any) => {
        this.analyticsData = data;
        this.processData();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('載入學習分析數據失敗:', error);
        this.isLoading = false;
      }
    });
  }

  // 處理數據
  private processData() {
    if (!this.analyticsData) return;

    this.overview = this.analyticsData.overview;
    this.trendData = this.analyticsData.trends || [];
    

    // 初始化其他數據
    this.initializeOtherData();
  }

  // 初始化其他數據
  private initializeOtherData() {
    this.topWeakPoints = this.overview?.top_weak_points || [];
    this.trendData = this.analyticsData?.trends || [];
    this.progressTracking = this.analyticsData?.progress_tracking || [];
    this.improvementItems = this.analyticsData?.improvement_items || [];
    this.attentionItems = this.analyticsData?.attention_items || [];
    this.radarData = this.analyticsData?.radar_data || null;
    
    // 數據加載完成
    this.isLoading = false;
    
    // 初始化指標卡片數據
    this.initializeMetricCards();
    
    // 初始化雷達圖
    if (this.radarData) {
      setTimeout(() => this.initRadarChart(), 100);
    }
    
    // 初始化趨勢圖表
    if (this.trendData && this.trendData.length > 0) {
      setTimeout(() => this.initTrendChart(), 100);
    }
  }
  
  // 初始化指標卡片
  private initializeMetricCards() {
    this.metricCards = [
      {
        title: '學習效率',
        value: this.getLearningVelocity().toFixed(1) + ' 概念/小時',
        description: '每小時學習的概念數量',
        icon: 'cil-speedometer',
        color: 'primary',
        trend: this.calculateTrend('learning_velocity')
      },
      {
        title: '記憶保持率',
        value: this.getRetentionRate().toFixed(1) + '%',
        description: '學習內容的記憶保持程度',
        icon: 'cil-memory',
        color: 'success',
        trend: this.calculateTrend('retention_rate')
      },
      {
        title: '平均學習時間',
        value: this.getAvgTimePerConcept().toFixed(0) + ' 分鐘',
        description: '掌握每個概念所需的平均時間',
        icon: 'cil-clock',
        color: 'info',
        trend: this.calculateTrend('avg_time_per_concept', true) // 時間越少越好，所以反轉
      },
      {
        title: '專注度評分',
        value: this.getFocusScore().toFixed(1) + '/10',
        description: '學習時的專注程度評分',
        icon: 'cil-target',
        color: 'warning',
        trend: this.calculateTrend('focus_score')
      }
    ];
  }

  // 計算趨勢百分比
  private calculateTrend(metric: string, reverse: boolean = false): string {
    const current = this.overview?.[metric] || 0;
    const previous = this.overview?.[`previous_${metric}`] || current * 0.9; // 模擬前一期數據
    
    if (current === 0 && previous === 0) return '0%';
    
    const change = ((current - previous) / previous) * 100;
    const adjustedChange = reverse ? -change : change;
    
    const sign = adjustedChange >= 0 ? '+' : '';
    return `${sign}${adjustedChange.toFixed(1)}%`;
  }

  // 學習效率相關方法
  getLearningVelocity(): number {
    return this.overview?.learning_velocity || 0;
  }

  getRetentionRate(): number {
    return (this.overview?.retention_rate || 0) * 100;
  }

  getAvgTimePerConcept(): number {
    return this.overview?.avg_time_per_concept || 0;
  }

  getFocusScore(): number {
    return this.overview?.focus_score || 0;
  }


  // 趨勢分析相關方法
  changeTrendPeriod(days: number): void {
    this.selectedTrendPeriod = days;
    console.log('切換趨勢分析期間:', days);
    // 重新載入數據以生成新的趨勢數據
    this.loadAllData();
  }

  // 初始化趨勢圖表
  private initTrendChart(): void {
    console.log('初始化趨勢圖表，trendData:', this.trendData);
    
    if (!this.trendLineChart || !this.trendData || this.trendData.length === 0) {
      console.log('趨勢圖表初始化失敗：缺少trendLineChart或trendData');
      return;
    }

    const ctx = this.trendLineChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('趨勢圖表初始化失敗：無法獲取canvas context');
      return;
    }

    // 銷毀現有圖表
    if ((this.trendLineChart.nativeElement as any).chart) {
      (this.trendLineChart.nativeElement as any).chart.destroy();
    }

    // 準備數據
    const labels = this.trendData.map(item => item.date);
    const masteryData = this.trendData.map(item => item.mastery * 100);
    const questionsData = this.trendData.map(item => item.questions);

    // 創建新圖表
    (this.trendLineChart.nativeElement as any).chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '掌握度 (%)',
            data: masteryData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: '答題數量',
            data: questionsData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: '日期'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: '掌握度 (%)'
            },
            min: 0,
            max: 100
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: '答題數量'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  // 掌握度顏色相關方法
  getMasteryColor(mastery: number): string {
    if (mastery >= 0.8) return 'success';
    if (mastery >= 0.6) return 'warning';
    if (mastery >= 0.4) return 'info';
    return 'danger';
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    if (percentage >= 40) return 'info';
    return 'danger';
  }

  // 優先級相關方法
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  }

  // 知識點展開/收縮方法
  toggleKnowledgeNode(weakness: any): void {
    weakness.expanded = !weakness.expanded;
  }

  // 活動狀態相關方法
  getActivityClass(activity?: any): string {
    if (activity) {
      switch (activity.level) {
      case 'high': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
    // 預設活動等級
    const percentage = this.getActivityPercentage();
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    if (percentage >= 40) return 'bg-info';
    return 'bg-danger';
  }

  getActivityPercentage(activity?: any): number {
    if (activity) {
      return activity.percentage || 0;
    }
    // 預設活動數據
    return this.overview?.activity_percentage || 75;
  }

  getActivityText(activity?: any): string {
    if (activity) {
      return activity.text || '無活動數據';
    }
    // 預設活動文本
    const percentage = this.getActivityPercentage();
    if (percentage >= 80) return '非常活躍';
    if (percentage >= 60) return '活躍';
    if (percentage >= 40) return '一般';
    return '需要加強';
  }

  // 知識節點相關方法（已在上方定義）

  // AI 診斷和練習相關方法
  openAIDiagnosisAndPractice(item: any): void {
    this.selectedMicro = item;
    this.openAIDiagnosisModal(item.id, item.name);
  }

  // 為小知識點進行AI診斷 - 先顯示詳細數據
  openMicroConceptAIDiagnosis(concept: any, domainName: string): void {
    console.log('AI診斷 - concept對象:', concept);
    console.log('AI診斷 - domainName:', domainName);
    
    // 檢查concept.id是否存在
    if (!concept.id) {
      console.error('concept.id為空或undefined:', concept);
      return;
    }
    
    this.currentConceptData = {
      id: concept.id,
      name: concept.name,
      domainName: domainName,
      mastery: concept.mastery,
      questionCount: concept.questionCount,
      wrongCount: concept.wrongCount
    };
    this.showAILearningPath = false;
    this.aiDiagnosisModalVisible = true;
  }

  // 練習相關方法
  startQuickPractice(): void {
    console.log('開始快速練習');
    this.openPracticeModal();
  }

  startFullPractice(): void {
    console.log('開始完整練習');
    this.openPracticeModal();
  }

  startDeepPractice(): void {
    console.log('開始深度練習');
    this.openPracticeModal();
  }


  // 學習計劃相關方法
  addToLearningPlan(item: any): void {
    console.log('添加到學習計劃:', item);
    this.closeAIDiagnosisModal();
  }

  confirmLearningPlan(): void {
    console.log('確認學習計劃');
    this.closeLearningPlanModal();
  }

  // 學習計劃模態框
  learningPlanModalVisible = false;

  closeLearningPlanModal(): void {
    this.learningPlanModalVisible = false;
  }

  // 初始化模擬數據
  private initializeMockData(): void {
    this.topWeakPoints = [
      {
        id: '1',
        name: '資料結構',
        mastery: 0.3,
        priority: 'high',
        isExpanded: false,
        subConcepts: [
          { name: '二元樹', mastery: 0.2 },
          { name: '圖論', mastery: 0.4 }
        ]
      },
      {
        id: '2',
        name: '演算法',
        mastery: 0.5,
        priority: 'medium',
        isExpanded: false,
        subConcepts: [
          { name: '排序演算法', mastery: 0.6 },
          { name: '搜尋演算法', mastery: 0.4 }
        ]
      }
    ];

    this.improvementItems = [
      {
        id: '1',
        name: '資料結構基礎',
        mastery: 0.3,
        priority: 'high',
        attempts: 15,
        wrongCount: 8
      },
      {
        id: '2',
        name: '演算法設計',
        mastery: 0.5,
        priority: 'medium',
        attempts: 12,
        wrongCount: 5
      }
    ];

    this.attentionItems = [
      {
        id: '1',
        name: '時間複雜度分析',
        mastery: 0.2,
        priority: 'high',
        attempts: 8,
        wrongCount: 6
      }
    ];

    this.progressTracking = [
      {
        name: '資料結構',
        percentage: 30,
        target: 80,
        trend: 'up'
      },
      {
        name: '演算法',
        percentage: 50,
        target: 70,
        trend: 'stable'
      }
    ];
  }


  // AI 診斷模態框
  openAIDiagnosisModal(conceptId: string, conceptName: string, domainName?: string) {
    this.isDiagnosisLoading = true;
    this.aiDiagnosisModalVisible = true;
    this.currentAIDiagnosis = null;
    
    // 調用 AI 診斷服務
    this.learningAnalyticsService.getAIDiagnosis(conceptId, conceptName, domainName || '未知領域').subscribe({
      next: (diagnosis) => {
        this.isDiagnosisLoading = false;
        if (diagnosis) {
          this.currentAIDiagnosis = diagnosis;
        }
      },
      error: (error) => {
        this.isDiagnosisLoading = false;
        console.error('AI診斷錯誤:', error);
      }
    });
  }

  closeAIDiagnosisModal() {
    this.aiDiagnosisModalVisible = false;
    this.currentAIDiagnosis = null;
    this.currentConceptData = null;
    this.isDiagnosisLoading = false;
    this.isAIPracticeLoading = false;  // 清除AI出題載入狀態
    this.showAILearningPath = false;
    this.showFullDiagnosis = false;
  }

  toggleFullDiagnosis() {
    this.showFullDiagnosis = !this.showFullDiagnosis;
  }

  getActionDisplayName(actionType: string): string {
    const actionMap: { [key: string]: string } = {
      'REVIEW_BASICS': 'AI基礎教學',
      'PRACTICE': 'AI出題練習',
      'SEEK_HELP': '教材觀看',
      'ADD_TO_CALENDAR': '加入行事曆'
    };
    return actionMap[actionType] || actionType;
  }

  startAction(action: any) {
    console.log('開始執行行動:', action);
    
    // 使用標準化的行動類型進行精確匹配
    switch (action.action) {
      case 'REVIEW_BASICS':
        this.startAITeaching(action);
        break;
      case 'PRACTICE':
        this.startAIPractice(action);
        break;
      case 'SEEK_HELP':
        this.startMaterialViewing(action);
        break;
      case 'ADD_TO_CALENDAR':
        this.addToCalendar(action);
        break;
    }
  }

  startAITeaching(action: any) {
    // 跳轉到AI導師頁面進行基礎教學
    console.log('開始AI基礎教學:', action);
    
    // 檢查action參數是否有效
    if (!action) {
      console.error('startAITeaching: action參數為空');
      alert('無法獲取行動信息，請重新選擇');
      return;
    }
    
    if (this.currentConceptData) {
      // 跳轉到AI導師頁面，預設問題
      const question = `請教我關於${this.currentConceptData.name}的基礎概念：${action.detail}`;
      this.router.navigate(['/dashboard/ai-chat'], { 
        queryParams: { 
          question: question,
          concept: this.currentConceptData.name,
          domain: this.currentConceptData.domainName,
          action: 'teaching',
          detail: action.detail,
          estMin: action.est_min || 15
        } 
      });
    } else {
      alert('無法獲取概念信息，請重新選擇');
    }
  }

  startAIPractice(action: any) {
    // 調用AI並行出題API生成練習題
    console.log('開始AI並行出題練習:', action);
    
    // 檢查action參數是否有效
    if (!action) {
      console.error('startAIPractice: action參數為空');
      alert('無法獲取行動信息，請重新選擇');
      return;
    }
    
    if (this.currentConceptData) {
      // 根據AI診斷建議確定難度
      const mastery = this.currentConceptData.mastery || 0;
      let difficulty = 'medium';
      
      if (mastery < 0.3) {
        difficulty = 'easy';
      } else if (mastery > 0.7) {
        difficulty = 'hard';
      }
      
      // 直接使用並行模式
      const params = {
        concept_name: this.currentConceptData.name,
        domain_name: this.currentConceptData.domainName,
        difficulty: difficulty,
        question_count: 20
      };
      
      this.generateAIPracticeParallel(params);
    } else {
      alert('無法獲取概念信息，請重新選擇');
    }
  }


  generateAIPracticeParallel(params: any) {
    // 顯示簡潔的等待提示
    const difficultyText = params.difficulty === 'easy' ? '簡單' : params.difficulty === 'medium' ? '中等' : '困難';
    const loadingMessage = `🤖 AI正在生成${params.question_count}題${difficultyText}難度的「${params.concept_name}」練習題...\n\n⏳ 預計需要15-30秒，請耐心等待`;
    
    // 使用confirm來顯示等待信息
    const userConfirm = confirm(loadingMessage);
    if (!userConfirm) {
      return; // 用戶取消
    }
    
    // 設置AI出題載入狀態
    this.isAIPracticeLoading = true;
    
    // 調用後端AI並行出題API
    this.learningAnalyticsService.generateAIPracticeParallel(params).subscribe({
      next: (response) => {
        this.isAIPracticeLoading = false; // 清除AI出題載入狀態
        
        if (response.success) {
          // 直接跳轉到quiz-taking頁面，只傳遞template_id
          this.router.navigate(['/dashboard/quiz-taking', response.template_id], {
            queryParams: {
              template_id: response.template_id
            }
          });
        } else {
          alert(`❌ AI出題失敗：${response.error}\n\n請稍後再試或聯繫技術支援`);
        }
      },
      error: (error) => {
        this.isAIPracticeLoading = false; // 清除AI出題載入狀態
        console.error('AI出題API調用失敗:', error);
        alert('❌ AI出題服務暫時不可用\n\n可能原因：\n• 網路連線問題\n• 伺服器忙碌\n• API配額不足\n\n請稍後再試');
      }
    });
  }

  startMaterialViewing(action: any) {
    // 跳轉到課程頁面觀看教材
    console.log('開始教材觀看:', action);
    
    // 檢查action參數是否有效
    if (!action) {
      console.error('startMaterialViewing: action參數為空');
      alert('無法獲取行動信息，請重新選擇');
      return;
    }
    
    if (this.currentConceptData) {
      this.router.navigate([`/dashboard/material-view/${this.currentConceptData.name}`], { 
        queryParams: { 
          concept: this.currentConceptData.name,
          domain: this.currentConceptData.domainName,
          action: 'viewing',
          detail: action.detail,
          estMin: action.est_min || 10,
          focus_concept: this.currentConceptData.id
        } 
      });
    } else {
      alert('無法獲取概念信息，請重新選擇');
    }
  }

  startPractice(action: any) {
    // 跳轉到練習頁面
    console.log('開始練習:', action);
    
    // 檢查action參數是否有效
    if (!action) {
      console.error('startPractice: action參數為空');
      alert('無法獲取行動信息，請重新選擇');
      return;
    }
    
    if (this.currentConceptData) {
      // 跳轉到練習頁面，傳遞概念信息
      const conceptId = this.currentConceptData.id;
      const conceptName = this.currentConceptData.name;
      const domainName = this.currentConceptData.domainName;
      
      // 使用現有的路由，跳轉到學習分析頁面並傳遞練習參數
      this.router.navigate(['/dashboard/learning-analytics'], { 
        queryParams: { 
          action: 'practice',
          conceptId: conceptId,
          conceptName: conceptName,
          domain: domainName,
          practiceAction: action.action || 'PRACTICE',
          practiceDetail: action.detail || '進行練習',
          estMin: action.est_min || 20
        } 
      });
    }
  }

  
  addToCalendar(action: any) {
    // 添加到行事曆
    console.log('添加到行事曆:', action);
    
    // 檢查action參數是否有效
    if (!action) {
      console.error('addToCalendar: action參數為空');
      alert('無法獲取行動信息，請重新選擇');
      return;
    }
    
    // 創建行事曆事件
    const calendarEvent = {
      title: action.action || '學習任務',
      description: action.detail || 'AI建議的學習任務',
      duration: action.est_min || 20,
      concept: this.currentConceptData?.name || '未知概念',
      domain: this.currentConceptData?.domainName || '未知領域',
      type: 'ai_suggestion',
      priority: 'medium',
      scheduledTime: new Date(Date.now() + 30 * 60 * 1000) // 30分鐘後
    };
    
    // 這裡可以調用行事曆服務
    // this.calendarService.addEvent(calendarEvent);
    
    alert(`已添加到行事曆：\n\n標題：${calendarEvent.title}\n描述：${calendarEvent.description}\n預計時間：${calendarEvent.duration}分鐘\n概念：${calendarEvent.concept}\n領域：${calendarEvent.domain}\n\n將在30分鐘後提醒您開始學習！`);
  }

  // 獲取AI學習路徑
  getAILearningPath(): void {
    if (!this.currentConceptData) {
      console.error('currentConceptData為空');
      return;
    }
    
    console.log('發送AI診斷請求:', {
      conceptId: this.currentConceptData.id,
      conceptName: this.currentConceptData.name,
      domainName: this.currentConceptData.domainName
    });
    
    this.isDiagnosisLoading = true;
    this.showAILearningPath = true;
    
    // 調用AI診斷服務
    this.learningAnalyticsService.getAIDiagnosis(
      this.currentConceptData.id, 
      this.currentConceptData.name, 
      this.currentConceptData.domainName
    ).subscribe({
      next: (diagnosis) => {
        this.isDiagnosisLoading = false;
        if (diagnosis) {
          this.currentAIDiagnosis = diagnosis;
        }
      },
      error: (error) => {
        this.isDiagnosisLoading = false;
        console.error('AI診斷錯誤:', error);
      }
    });
  }

  // 學習路徑模態框
  openLearningPathModal() {
    this.learningPathModalVisible = true;
  }

  closeLearningPathModal() {
    this.learningPathModalVisible = false;
  }

  // 練習模態框
  openPracticeModal() {
    this.practiceModalVisible = true;
  }

  closePracticeModal() {
    this.practiceModalVisible = false;
  }

  // 獲取當前時間
  getCurrentTime(): string {
    if (!this.currentTime) {
      const now = new Date();
      this.currentTime = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    return this.currentTime;
  }

  // 初始化雷達圖
  private initRadarChart(): void {
    console.log('初始化雷達圖，radarData:', this.radarData);
    console.log('radarData.labels:', this.radarData?.labels);
    console.log('radarData.data:', this.radarData?.data);
    
    if (!this.radarChart || !this.radarData) {
      console.log('雷達圖初始化失敗：缺少radarChart或radarData');
      return;
    }
    
    if (!this.radarData.labels || !this.radarData.data || this.radarData.labels.length === 0) {
      console.log('雷達圖數據為空');
      return;
    }

    const ctx = this.radarChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('雷達圖初始化失敗：無法獲取canvas context');
      return;
    }

    // 銷毀現有圖表
    if ((this.radarChart.nativeElement as any).chart) {
      (this.radarChart.nativeElement as any).chart.destroy();
    }

    // 創建新圖表
    (this.radarChart.nativeElement as any).chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.radarData.labels,
        datasets: [{
          label: '掌握度',
          data: this.radarData.data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
}
