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
import { OverviewService, CreateEventRequest } from '../../../service/overview.service';
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
  
  // 趨勢圖表相關
  selectedTrendDomain: string = 'all';
  availableTrendDomains: string[] = [];

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
  
  // 行事曆modal相關
  calendarModalVisible = false;
  selectedLearningStep: any = null;
  calendarEvent = {
    title: '',
    content: '',
    eventDate: '',
    notifyEnabled: false,
    notifyTime: new Date()
  };
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
  
  // 深度分析相關屬性
  masterySummary: any[] = [];
  difficultyAnalysisData: any = null;
  selectedMajorConcept: string = 'all';  // 選中的大知識點
  availableMajorConcepts: string[] = [];  // 可用的大知識點列表
  
  // AI教練分析
  aiCoachAnalysis: any = null;
  

  // 圖表相關
  @ViewChild('radarChart', { static: false }) radarChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendLineChart', { static: false }) trendLineChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('integratedAnalysisChart', { static: false }) integratedAnalysisChart?: ElementRef<HTMLCanvasElement>;

  private dataSubscription?: Subscription;

  constructor(
    private learningAnalyticsService: LearningAnalyticsService,
    private overviewService: OverviewService,
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
    
    // 處理AI教練分析
    this.aiCoachAnalysis = (this.analyticsData as any).ai_coach_analysis || null;


    // 初始化其他數據
    this.initializeOtherData();
    
    // 初始化趨勢圖表知識點選項
    this.initializeTrendDomains();
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
    
    // 初始化所有圖表
    setTimeout(() => {
      this.initRadarChart();
      this.initTrendChart();
      this.initIntegratedAnalysisChart();
    }, 100);
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
        description: '知識記憶保持率',
        icon: 'cil-memory',
        color: 'success',
        trend: this.calculateTrend('retention_rate')
      },
      {
        title: '平均學習時間',
        value: this.getAvgTimePerConcept().toFixed(1) + ' 分鐘',
        description: '答對題目的平均答題時間',
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
    // 不重新載入數據，只更新圖表顯示
    this.updateTrendChart();
  }
  
  // 切換趨勢知識點
  onTrendDomainChange(): void {
    this.updateTrendChart();
  }
  
  // 更新趨勢圖表（不重新載入數據）
  private updateTrendChart(): void {
    if (this.trendLineChart) {
      this.initTrendChart();
    }
  }
  
  // 初始化趨勢圖表知識點選項
  private initializeTrendDomains(): void {
    if (this.overview && this.overview.domains) {
      // 檢查domain對象的結構
      const domainNames = this.overview.domains
        .filter((domain: any) => domain && domain.name) // 過濾掉無效的domain
        .map((domain: any) => domain.name);
      
      this.availableTrendDomains = ['all', ...domainNames];
    }
  }
  
  // 根據概念ID獲取對應的領域名稱
  private getConceptDomain(conceptId: string): string {
    if (!this.overview || !this.overview.domains) return '';
    
    for (const domain of this.overview.domains) {
      if (domain.concepts && domain.concepts.some((concept: any) => concept.id === conceptId)) {
        return domain.name;
      }
    }
    return '';
  }
  

  // 初始化趨勢圖表
  private initTrendChart(): void {
    
    if (!this.trendLineChart || !this.trendData || this.trendData.length === 0) {
      return;
    }

    const ctx = this.trendLineChart.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // 銷毀現有圖表
    if ((this.trendLineChart.nativeElement as any).chart) {
      (this.trendLineChart.nativeElement as any).chart.destroy();
    }

    // 準備數據
    const labels = this.trendData.map(item => item.date);
    
    // 根據選擇的知識點篩選數據
    let filteredTrendData = this.trendData;
    if (this.selectedTrendDomain && this.selectedTrendDomain !== 'all') {
      // 使用後端提供的領域趨勢數據
      const domainTrends = (this.analyticsData as any).domain_trends;
      if (domainTrends && domainTrends[this.selectedTrendDomain]) {
        filteredTrendData = domainTrends[this.selectedTrendDomain];
      } else {
        // 如果沒有該領域的數據，創建空數據
        filteredTrendData = this.trendData.map(item => ({
          ...item,
          accuracy: 0,
          questions: 0,
          forgetting_data: []
        }));
      }
    }
    
    const accuracyData = filteredTrendData.map(item => item.accuracy * 100);
    const questionsData = filteredTrendData.map(item => item.questions);
    
    // 準備遺忘曲線數據
    const forgettingData = filteredTrendData.map(item => {
      if (item.forgetting_data && item.forgetting_data.length > 0) {
        // 計算平均遺忘率
        const avgForgetting = item.forgetting_data.reduce((sum: number, concept: any) => 
          sum + concept.forgetting_rate, 0) / item.forgetting_data.length;
        return avgForgetting * 100;
      }
      return 0;
    });
    // 創建新圖表
    (this.trendLineChart.nativeElement as any).chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.selectedTrendDomain === 'all' ? '答題準確率 (%)' : `${this.selectedTrendDomain} - 答題準確率 (%)`,
            data: accuracyData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: this.selectedTrendDomain === 'all' ? '答題數量' : `${this.selectedTrendDomain} - 答題數量`,
            data: questionsData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            yAxisID: 'y1'
          },
          {
            label: this.selectedTrendDomain === 'all' ? '知識遺忘率 (%)' : `${this.selectedTrendDomain} - 知識遺忘率 (%)`,
            data: forgettingData,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.1,
            yAxisID: 'y',
            borderDash: [5, 5]
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
            min: 0,
            max: Math.max(...questionsData) > 0 ? Math.max(...questionsData) * 1.2 : 10,
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



  // 學習計劃相關方法
  addToLearningPlan(item: any): void {
    this.closeAIDiagnosisModal();
  }

  confirmLearningPlan(): void {
    this.closeLearningPlanModal();
  }

  // 學習計劃模態框
  learningPlanModalVisible = false;

  closeLearningPlanModal(): void {
    this.learningPlanModalVisible = false;
  }



  // AI 診斷模態框
  openAIDiagnosisModal(conceptId: string, conceptName: string, domainName?: string) {
    this.aiDiagnosisModalVisible = true;
    this.currentAIDiagnosis = null;
    this.showAILearningPath = true;  // 默認顯示學習路徑
    
    // 檢查session storage中是否有快取的AI診斷結果
    const cacheKey = `ai_diagnosis_${conceptId}`;
    console.log('檢查session快取，鍵值:', cacheKey);
    const cachedData = sessionStorage.getItem(cacheKey);
    console.log('快取數據:', cachedData);
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = parsedData.timestamp;
        const now = Date.now();
        const timeDiff = now - cacheTime;
        const minutesDiff = timeDiff / (1000 * 60);
        
        console.log('快取時間:', new Date(cacheTime));
        console.log('當前時間:', new Date(now));
        console.log('時間差(分鐘):', minutesDiff);
        
        // 檢查快取是否在30分鐘內
        if (timeDiff < 30 * 60 * 1000) {
          console.log('使用快取數據，不調用API');
          this.currentAIDiagnosis = parsedData.data;
          return; // 使用快取數據，不調用API
        } else {
          console.log('快取已過期，清除快取');
          // 快取過期，清除
          sessionStorage.removeItem(cacheKey);
        }
      } catch (e) {
        console.error('解析快取數據失敗:', e);
        sessionStorage.removeItem(cacheKey);
      }
    } else {
      console.log('沒有找到快取數據');
    }
    
    // 如果沒有快取或已過期，調用AI診斷服務
    this.isDiagnosisLoading = true;
    this.learningAnalyticsService.getAIDiagnosis(conceptId, conceptName, domainName || '未知領域').subscribe({
      next: (diagnosis) => {
        this.isDiagnosisLoading = false;
        if (diagnosis) {
          this.currentAIDiagnosis = diagnosis;
          
          // 儲存到session storage，30分鐘有效期
          const cacheKey = `ai_diagnosis_${conceptId}`;
          const cacheData = {
            timestamp: Date.now(),
            data: diagnosis
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
          console.log('AI診斷結果已儲存到session storage，鍵值:', cacheKey);
          console.log('儲存時間:', new Date(cacheData.timestamp));
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

  
  addToCalendar(step: any) {
    if (!step) {
      console.error('addToCalendar: step參數為空');
      alert('無法獲取學習步驟信息，請重新選擇');
      return;
    }
    
    // 保存選中的學習步驟
    this.selectedLearningStep = step;
    
    // 預填行事曆事件信息
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.calendarEvent = {
      title: step.step_info,
      content: step.step_info,
      eventDate: tomorrow.toISOString().split('T')[0], // 明天日期
      notifyEnabled: true,
      notifyTime: new Date(Date.now() + 30 * 60 * 1000) // 30分鐘後
    };
    
    // 打開行事曆modal
    this.calendarModalVisible = true;
  }
  
  // 確認加入行事曆
  confirmAddToCalendar() {
    // 驗證表單
    if (!this.validateCalendarForm()) {
      return;
    }

    const eventData = {
      title: this.calendarEvent.title.trim(),
      content: this.calendarEvent.content.trim(),
      start: this.calendarEvent.eventDate + 'T00:00:00', // 本地時間格式
      notifyEnabled: this.calendarEvent.notifyEnabled,
      notifyTime: this.calendarEvent.notifyEnabled ? this.formatLocalDateTime(this.calendarEvent.notifyTime) : null
    };

    // 新增事件
    this.overviewService.createCalendarEvent(eventData).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        // 關閉modal
        this.calendarModalVisible = false;
        this.selectedLearningStep = null;
        this.resetCalendarForm();
      },
      error: (error: any) => {
        console.error('新增事件失敗:', error);
      }
    });
  }
  
  // 取消加入行事曆
  cancelAddToCalendar() {
    this.calendarModalVisible = false;
    this.selectedLearningStep = null;
    this.resetCalendarForm();
  }
  
  // 處理事件日期變更
  updateEventDate(dateString: string) {
    this.calendarEvent.eventDate = dateString as any;
  }

  // 處理通知時間變更
  updateNotifyTime(timeString: string) {
    const eventDate = new Date(this.calendarEvent.eventDate + 'T00:00:00');
    this.calendarEvent.notifyTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      parseInt(timeString.split(':')[0]),
      parseInt(timeString.split(':')[1])
    );
  }

  // 格式化本地時間為字符串，避免時區轉換
  formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // 驗證行事曆表單
  validateCalendarForm(): boolean {
    if (!this.calendarEvent.title || this.calendarEvent.title.trim() === '') {
      alert('請輸入事件標題');
      return false;
    }
    if (!this.calendarEvent.content || this.calendarEvent.content.trim() === '') {
      alert('請輸入事件內容');
      return false;
    }
    if (!this.calendarEvent.eventDate) {
      alert('請選擇事件日期');
      return false;
    }
    if (this.calendarEvent.notifyEnabled && !this.calendarEvent.notifyTime) {
      alert('請選擇通知時間');
      return false;
    }
    return true;
  }

  // 重置行事曆表單
  resetCalendarForm() {
    this.calendarEvent = {
      title: '',
      content: '',
      eventDate: '',
      notifyEnabled: false,
      notifyTime: new Date()
    };
  }

  // 獲取AI學習路徑
  getAILearningPath(): void {
    if (!this.currentConceptData) {
      console.error('currentConceptData為空');
      return;
    }
    
    // 如果已經有AI診斷結果且正在顯示學習路徑，直接返回
    if (this.currentAIDiagnosis && this.showAILearningPath) {
      return;
    }
    
    // 檢查session storage中是否有快取的AI診斷結果
    const cacheKey = `ai_diagnosis_${this.currentConceptData.id}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = parsedData.timestamp;
        const now = Date.now();
        
        // 檢查快取是否在30分鐘內
        if (now - cacheTime < 30 * 60 * 1000) {
          this.currentAIDiagnosis = parsedData.data;
          this.showAILearningPath = true;
          return;
        } else {
          // 快取過期，清除
          sessionStorage.removeItem(cacheKey);
        }
      } catch (e) {
        console.error('解析快取數據失敗:', e);
        sessionStorage.removeItem(cacheKey);
      }
    }
    
    // 如果已經有AI診斷結果，直接顯示學習路徑
    if (this.currentAIDiagnosis) {
      this.showAILearningPath = true;
      return;
    }
    
    // 如果沒有診斷結果，先獲取診斷
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
          
          // 儲存到session storage，30分鐘有效期
          const cacheKey = `ai_diagnosis_${this.currentConceptData.id}`;
          const cacheData = {
            timestamp: Date.now(),
            data: diagnosis
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
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

  // 初始化整合分析圖表
  private initIntegratedAnalysisChart(): void {
    if (!this.integratedAnalysisChart) {
      console.log('整合圖表初始化失敗：缺少integratedAnalysisChart');
      return;
    }

    const ctx = this.integratedAnalysisChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('整合圖表初始化失敗：無法獲取canvas context');
      return;
    }

    // 銷毀現有圖表
    if ((this.integratedAnalysisChart.nativeElement as any).chart) {
      (this.integratedAnalysisChart.nativeElement as any).chart.destroy();
    }

  // 使用init-data中的數據，而不是單獨調用API
  this.useInitDataForAnalysis();
}

  // 使用init-data中的數據進行分析
  private useInitDataForAnalysis(): void {
    
    if (!this.analyticsData || !this.analyticsData.overview || !this.analyticsData.overview.domains) {
      console.log('沒有可用的init-data，使用fallback數據');
      return;
    }

    // 從init-data中提取領域數據
    const domains = this.analyticsData.overview.domains;

  // 轉換為深度分析所需的格式
  this.difficultyAnalysisData = {
    domain_difficulty_analysis: domains.map((domain: any) => ({
      domain_id: domain.id,
      domain_name: domain.name,
      overall_mastery: domain.mastery || 0,
      difficulty_breakdown: domain.difficulty_breakdown || { '簡單': 0, '中等': 0, '困難': 0 },
      difficulty_analysis: domain.difficulty_analysis || {
        easy_mastery: 0,
        medium_mastery: 0,
        hard_mastery: 0,
        bottleneck_level: 'none',
        recommended_difficulty: '簡單'
      },
      forgetting_analysis: domain.forgetting_analysis || {
        base_mastery: 0,
        current_mastery: 0,
        days_since_practice: 0,
        review_urgency: 'low',
        forgetting_factor: 1.0
      }
    }))
  };

  // 初始化可用的大知識點列表
  this.initializeAvailableMajorConcepts();
  
  // 更新圖表
  this.updateIntegratedChart();
}

// 載入難度分析數據
  private loadDifficultyAnalysisData(): void {
    this.learningAnalyticsService.getDifficultyAnalysis().subscribe({
      next: (data) => {
        this.difficultyAnalysisData = data;
        
        // 初始化可用的大知識點列表
        this.initializeAvailableMajorConcepts();
        
        // 更新圖表
        this.updateIntegratedChart();
      },
      error: (error) => {
        console.error('載入難度分析數據失敗:', error);
      }
    });
  }

  // 初始化可用的大知識點列表
  private initializeAvailableMajorConcepts(): void {
    if (this.difficultyAnalysisData && this.difficultyAnalysisData.domain_difficulty_analysis) {
      this.availableMajorConcepts = ['all', ...this.difficultyAnalysisData.domain_difficulty_analysis.map((domain: any) => domain.domain_name)];
    } else {
      this.availableMajorConcepts = ['all'];
    }
  }

  // 更新整合圖表
  private updateIntegratedChart(): void {
    if (!this.integratedAnalysisChart || !this.difficultyAnalysisData) {
      return;
    }

    const ctx = this.integratedAnalysisChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // 銷毀現有圖表
    if ((this.integratedAnalysisChart.nativeElement as any).chart) {
      (this.integratedAnalysisChart.nativeElement as any).chart.destroy();
    }

    // 根據選中的大知識點獲取數據
    let chartData;
    if (this.selectedMajorConcept === 'all') {
      // 顯示所有大知識點的數據
      chartData = this.prepareAllConceptsData();
    } else {
      // 顯示特定大知識點的數據
      chartData = this.prepareSpecificConceptData(this.selectedMajorConcept);
    }

    // 創建新圖表
    (this.integratedAnalysisChart.nativeElement as any).chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              callback: function(value: any) {
                return (value * 100).toFixed(0) + '%';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${(value * 100).toFixed(1)}%`;
              }
            }
          }
        }
      }
    });

    // 更新摘要
    this.updateMasterySummary();
  }

  // 準備所有概念的數據
  private prepareAllConceptsData(): any {
    if (!this.difficultyAnalysisData || !this.difficultyAnalysisData.domain_difficulty_analysis) {
      return this.getEmptyChartData();
    }

    const domains = this.difficultyAnalysisData.domain_difficulty_analysis;
    const labels = domains.map((domain: any) => domain.domain_name);
    
    return {
      labels: labels,
      datasets: [
        {
          label: '簡單掌握度',
          data: domains.map((domain: any) => domain.difficulty_breakdown['簡單'] || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        },
        {
          label: '中等掌握度',
          data: domains.map((domain: any) => domain.difficulty_breakdown['中等'] || 0),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2
        },
        {
          label: '困難掌握度',
          data: domains.map((domain: any) => domain.difficulty_breakdown['困難'] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  // 準備特定概念的數據
  private prepareSpecificConceptData(conceptName: string): any {
    if (!this.difficultyAnalysisData || !this.difficultyAnalysisData.domain_difficulty_analysis) {
      return this.getEmptyChartData();
    }

    const domain = this.difficultyAnalysisData.domain_difficulty_analysis.find((d: any) => d.domain_name === conceptName);
    if (!domain) {
      return this.getEmptyChartData();
    }

    return {
      labels: [conceptName],
      datasets: [
        {
          label: '簡單掌握度',
          data: [domain.difficulty_breakdown['簡單'] || 0],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        },
        {
          label: '中等掌握度',
          data: [domain.difficulty_breakdown['中等'] || 0],
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2
        },
        {
          label: '困難掌握度',
          data: [domain.difficulty_breakdown['困難'] || 0],
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  // 獲取空圖表數據
  private getEmptyChartData(): any {
    return {
      labels: ['暫無數據'],
      datasets: [
        {
          label: '簡單掌握度',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
          borderColor: 'rgba(200, 200, 200, 1)',
          borderWidth: 2
        },
        {
          label: '中等掌握度',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
          borderColor: 'rgba(200, 200, 200, 1)',
          borderWidth: 2
        },
        {
          label: '困難掌握度',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
          borderColor: 'rgba(200, 200, 200, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  // 大知識點選擇變更
  onMajorConceptChange(): void {
    this.updateIntegratedChart();
  }

  // 更新掌握度摘要
  private updateMasterySummary(): void {
    if (!this.difficultyAnalysisData || !this.difficultyAnalysisData.domain_difficulty_analysis) {
      return;
    }

    const domains = this.difficultyAnalysisData.domain_difficulty_analysis;
    
    // 找出困難掌握率最低的
    let lowestHard = { domain: '無', value: 1 };
    let lowestEasy = { domain: '無', value: 1 };
    let highestMedium = { domain: '無', value: 0 };

    domains.forEach((domain: any) => {
      const hard = domain.difficulty_breakdown['困難'] || 0;
      const easy = domain.difficulty_breakdown['簡單'] || 0;
      const medium = domain.difficulty_breakdown['中等'] || 0;

      if (hard < lowestHard.value) {
        lowestHard = { domain: domain.domain_name, value: hard };
      }
      if (easy < lowestEasy.value) {
        lowestEasy = { domain: domain.domain_name, value: easy };
      }
      if (medium > highestMedium.value) {
        highestMedium = { domain: domain.domain_name, value: medium };
      }
    });

    this.masterySummary = [
      {
        title: '困難掌握率最低',
        value: (lowestHard.value * 100).toFixed(0) + '%',
        concept: lowestHard.domain,
        color: 'danger'
      },
      {
        title: '簡單掌握率最低',
        value: (lowestEasy.value * 100).toFixed(0) + '%',
        concept: lowestEasy.domain,
        color: 'warning'
      },
      {
        title: '中等掌握率最高',
        value: (highestMedium.value * 100).toFixed(0) + '%',
        concept: highestMedium.domain,
        color: 'success'
      }
    ];
  }



  // 更新圖表數據（當選擇特定知識點時）
  updateChartsForConcept(conceptData: any): void {
    // 更新整合圖表
    if (this.integratedAnalysisChart && (this.integratedAnalysisChart.nativeElement as any).chart) {
      const chart = (this.integratedAnalysisChart.nativeElement as any).chart;
      // 這裡可以根據conceptData更新圖表數據
      // chart.data.datasets[0].data = [conceptData.easy_mastery, conceptData.medium_mastery, conceptData.hard_mastery];
      // chart.update();
    }
  }

  // 開始學習路徑中的某個步驟
  startLearning(step: any): void {
    if (step.readiness < 0.6) {
      alert('此步驟尚未準備好，請先完成前置步驟');
      return;
    }
    
    // 根據步驟類型執行不同的學習動作
    if (step.concept_name) {
      // 跳轉到相關的學習頁面
      this.router.navigate(['/dashboard/learning-analytics'], {
        queryParams: {
          action: 'learn',
          concept: step.concept_name,
          step: step.reason,
          difficulty: step.estimated_difficulty
        }
      });
    }
  }

}
