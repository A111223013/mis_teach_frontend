import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { LearningAnalyticsService, OverviewData, AIDiagnosis, DomainData, MicroConceptData, WeakPoint, SubConcept, ErrorType, PracticeQuestion, ErrorAnalysis, KnowledgeRelation } from '../../../service/learning-analytics.service';

// 本地接口定義
export interface KnowledgePointItem {
  id: string;
  name: string;
  mastery: number;
  improvement?: number;
  decline?: number;
  type: 'improvement' | 'attention';
  sub_concepts?: SubConcept[];
  error_types?: ErrorType[];
  expanded?: boolean;
  showButtons?: boolean;
}

export interface MetricCardData {
  title: string;
  value: string;
  icon: string;
  color: 'success' | 'warning' | 'danger' | 'primary' | 'info';
  trend: string;
  description: string;
  onClick: () => void;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface ProgressItem {
  title: string;
  percentage: number;
  completed: number;
  total: number;
  remaining: number;
}
import { CardComponent, CardBodyComponent, CardHeaderComponent, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import cytoscape from 'cytoscape';

// 圖表節點和邊的接口
interface GraphNode {
  data: {
    id: string;
    label: string;
    type: 'domain' | 'micro';
    mastery: number;
    questionCount: number;
    wrongCount: number;
    parentId?: string;
  };
}

interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    type: 'cross-domain' | 'parent-child';
    strength?: number;
  };
}

Chart.register(...registerables);

@Component({
  selector: 'app-learning-analytics',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    FormsModule
  ],
  templateUrl: './learning-analytics.component.html',
  styleUrls: ['./learning-analytics.component.scss']
})
export class LearningAnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  // 基本屬性
  userId: string = 'test-user-001';

  // 數據屬性
  overview: OverviewData | null = null;
  domains: DomainData[] = [];
  microConcepts: MicroConceptData[] = [];
  topWeakPoints: WeakPoint[] = [];
  aiDiagnosis: AIDiagnosis | null = null;

  // 可重用元件數據
  metricCards: MetricCardData[] = [];
  improvementItems: KnowledgePointItem[] = [];
  attentionItems: KnowledgePointItem[] = [];
  
  // 新增功能數據
  taskList: TaskItem[] = [];
  progressTracking: ProgressItem[] = [];
  selectedAIDiagnosis: AIDiagnosis | null = null;
  
  // 數據驅動狀態
  isLoadingAI: boolean = false;
  trendData: any[] = [];
  peerData: any = null;
  knowledgeMapData: any = null;
  
  // 知識圖譜相關屬性
  private knowledgeGraphCy: any;
  private tooltipElement: HTMLElement | null = null;
  knowledgeGraphDomains: any[] = [];
  
  // 趨勢圖相關屬性
  selectedTrendPeriod: number = 30;
  
  // 圖表實例
  overviewPieChartInstance: Chart | null = null;
  domainRadarChartInstance: Chart | null = null;
  trendLineChartInstance: Chart | null = null;
  confidenceChartInstance: Chart | null = null;
  masteryTrendChartInstance: Chart | null = null;
  
  // Modal狀態
  aiDiagnosisModalVisible: boolean = false;
  practiceModalVisible: boolean = false;
  learningPathModalVisible: boolean = false;
  knowledgeGraphModalVisible: boolean = false;
  
  // 選中的數據
  selectedMicro: MicroConceptData | null = null;
  selectedWeakPoint: WeakPoint | null = null;

  // 訂閱管理
  private subscriptions: Subscription[] = [];

  // ViewChild引用
  @ViewChild('overviewPieChart') overviewPieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('domainRadarChart') domainRadarChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendLineChart') trendLineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('confidenceChart') confidenceChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('masteryTrendChart') masteryTrendChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('knowledgeGraphContainer') knowledgeGraphContainer!: ElementRef<HTMLDivElement>;

  constructor(private analyticsService: LearningAnalyticsService) {}

  ngOnInit(): void {
    console.log('ngOnInit 開始');
    this.setupSubscriptions();
    this.initializeMetricCards();
    this.initializeKnowledgeGraphDomains();
    this.initializeKnowledgePointLists();
    this.initializeTaskList();
    this.initializeProgressTracking();
    this.loadTrendData();
    this.loadRealTimeData();
    console.log('ngOnInit 完成，數據狀態:', {
      improvementItems: this.improvementItems.length,
      attentionItems: this.attentionItems.length,
      trendData: this.trendData.length
    });
  }

  ngAfterViewInit(): void {
    // 延遲初始化圖表，確保DOM已渲染
    setTimeout(() => {
      this.createOverviewPieChart();
      this.createDomainRadarChart();
      this.createRadarChart();
    }, 1000);
    
    // 延遲創建趨勢圖表，確保數據已載入
    setTimeout(() => {
      this.createTrendLineChart();
    }, 1200);
    
    // 延遲初始化知識圖譜，確保容器已渲染
    setTimeout(() => {
      this.initializeKnowledgeGraph();
    }, 1500);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroyAllCharts();
    
    // 清理知識圖譜
    if (this.knowledgeGraphCy) {
      this.knowledgeGraphCy.destroy();
    }
    this.hideTooltip();
  }

  // 設置RxJS訂閱
  private setupSubscriptions(): void {
    // 訂閱總覽數據變化
    this.subscriptions.push(
      this.analyticsService.overview$.subscribe((data: OverviewData | null) => {
        if (data) {
          this.overview = data;
          this.initializeKnowledgePointLists();
          console.log('總覽數據載入完成:', data);
        }
      })
    );

    // 訂閱領域數據變化
    this.subscriptions.push(
      this.analyticsService.domains$.subscribe({
        next: (data: DomainData[]) => {
          this.domains = data;
          console.log('領域數據載入完成:', data);
        },
        error: (error: any) => {
          console.error('載入領域數據失敗:', error);
        }
      })
    );

    // 訂閱微概念數據變化
    this.subscriptions.push(
      this.analyticsService.microConcepts$.subscribe({
        next: (data: MicroConceptData[]) => {
          this.microConcepts = data;
          console.log('微概念數據載入完成:', data);
        },
        error: (error: any) => {
          console.error('載入微概念數據失敗:', error);
        }
      })
    );

    // 訂閱弱點數據變化 - 使用模擬數據
    this.topWeakPoints = [
      {
        micro_id: '1',
        name: '資料結構與演算法',
        mastery: 0.45,
        priority: 1,
        attempts: 10,
        wrong_count: 6,
        reason: '概念理解不足',
        expanded: false,
        sub_concepts: [
          { name: '動態規劃', mastery: 0.3, attempts: 5, wrong_count: 3 },
          { name: '圖論演算法', mastery: 0.4, attempts: 3, wrong_count: 2 },
          { name: '排序算法', mastery: 0.6, attempts: 2, wrong_count: 1 }
        ],
        error_types: [
          { type: '概念錯誤', count: 4, percentage: 66.7 },
          { type: '粗心', count: 1, percentage: 16.7 },
          { type: '題型不熟', count: 1, percentage: 16.7 }
        ]
      },
      {
        micro_id: '2',
        name: '網路安全',
        mastery: 0.35,
        priority: 2,
        attempts: 8,
        wrong_count: 5,
        reason: '應用能力不足',
        expanded: false,
        sub_concepts: [
          { name: '加密算法', mastery: 0.2, attempts: 3, wrong_count: 2 },
          { name: '防火牆配置', mastery: 0.4, attempts: 3, wrong_count: 2 },
          { name: '入侵檢測', mastery: 0.3, attempts: 2, wrong_count: 1 }
        ],
        error_types: [
          { type: '概念錯誤', count: 3, percentage: 60 },
          { type: '粗心', count: 1, percentage: 20 },
          { type: '題型不熟', count: 1, percentage: 20 }
        ]
      },
      {
        micro_id: '3',
        name: '資料庫設計',
        mastery: 0.52,
        priority: 3,
        attempts: 12,
        wrong_count: 6,
        reason: '正規化理論掌握不深',
        expanded: false,
        sub_concepts: [
          { name: '第一正規化', mastery: 0.6, attempts: 4, wrong_count: 2 },
          { name: '第二正規化', mastery: 0.4, attempts: 4, wrong_count: 2 },
          { name: '第三正規化', mastery: 0.5, attempts: 4, wrong_count: 2 }
        ],
        error_types: [
          { type: '概念錯誤', count: 4, percentage: 66.7 },
          { type: '粗心', count: 1, percentage: 16.7 },
          { type: '題型不熟', count: 1, percentage: 16.7 }
        ]
      }
    ];
  }

  // 初始化核心指標卡片
  private initializeMetricCards(): void {
    this.metricCards = [
      {
        title: '整體掌握度',
        value: '78%',
        icon: 'cil-chart-pie',
        color: 'success',
        trend: '+5%',
        description: '較上月提升',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '近7天作答次數',
        value: '45',
        icon: 'cil-calendar',
        color: 'info',
        trend: '+12',
        description: '較上周增加',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '弱點數量',
        value: '3',
        icon: 'cil-warning',
        color: 'warning',
        trend: '-2',
        description: '較上周減少',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '學習階段',
        value: '進階',
        icon: 'cil-education',
        color: 'primary',
        trend: '穩定',
        description: '持續進步中',
        onClick: () => this.openAIDiagnosisModal()
      }
    ];
  }

  // 初始化知識點列表數據
  private initializeKnowledgePointLists(): void {
    // 如果overview數據不存在，使用默認數據
    if (!this.overview) {
      this.improvementItems = [
        {
          id: 'improvement_1',
          name: '二分搜尋法',
          mastery: 0.85,
          improvement: 0.15,
          type: 'improvement' as const,
          expanded: false,
          showButtons: true
        },
        {
          id: 'improvement_2',
          name: '快速排序',
          mastery: 0.78,
          improvement: 0.12,
          type: 'improvement' as const,
          expanded: false,
          showButtons: true
        },
        {
          id: 'improvement_3',
          name: '堆疊與佇列',
          mastery: 0.82,
          improvement: 0.08,
          type: 'improvement' as const,
          expanded: false,
          showButtons: true
        }
      ];

      this.attentionItems = [
        {
          id: 'attention_1',
          name: '動態規劃',
          mastery: 0.45,
          decline: 0.05,
          type: 'attention' as const,
          expanded: false,
          showButtons: true
        },
        {
          id: 'attention_2',
          name: '圖論演算法',
          mastery: 0.52,
          decline: 0.02,
          type: 'attention' as const,
          expanded: false,
          showButtons: true
        },
        {
          id: 'attention_3',
          name: '紅黑樹',
          mastery: 0.38,
          decline: 0.08,
          type: 'attention' as const,
          expanded: false,
          showButtons: true
        }
      ];
    } else {
      this.improvementItems = (this.overview.recent_improvements || []).map(item => ({
        id: `improvement_${item.name}`,
        name: item.name,
        mastery: item.mastery,
        improvement: item.improvement,
        type: 'improvement' as const,
        expanded: false,
        showButtons: true
      }));

      this.attentionItems = (this.overview.needs_attention || []).map(item => ({
        id: `attention_${item.name}`,
        name: item.name,
        mastery: item.mastery,
        decline: item.decline,
        type: 'attention' as const,
        expanded: false,
        showButtons: true
      }));
    }
    
    console.log('知識點列表初始化完成:', {
      improvements: this.improvementItems,
      attentions: this.attentionItems
    });
  }

  // 初始化知識圖譜專用領域數據
  private initializeKnowledgeGraphDomains(): void {
    this.knowledgeGraphDomains = [
      { id: 'info-management', name: '資訊管理', mastery: 0.80, questionCount: 20, wrongCount: 2, isExpanded: false },
      { id: 'algorithm', name: '演算法基礎', mastery: 0.72, questionCount: 15, wrongCount: 3, isExpanded: false },
      { id: 'data-structure', name: '資料結構', mastery: 0.65, questionCount: 12, wrongCount: 4, isExpanded: false },
      { id: 'system-analysis', name: '系統分析', mastery: 0.75, questionCount: 10, wrongCount: 2, isExpanded: false }
    ];
    
    console.log('知識圖譜領域數據初始化完成:', this.knowledgeGraphDomains);
  }

  // 任務管理
  toggleTask(task: TaskItem): void {
    task.completed = !task.completed;
    console.log('任務狀態更新:', task);
  }

  // 打開AI診斷Modal
  openAIDiagnosisModal(): void {
    this.selectedAIDiagnosis = this.aiDiagnosis;
    this.aiDiagnosisModalVisible = true;
  }

  // 載入總覽數據
  private loadOverviewData(): void {
    setTimeout(() => {
      this.createOverviewPieChart();
      this.createTrendLineChart();
    }, 300);
  }

  // 載入診斷數據
  private loadDiagnosisData(): void {
    setTimeout(() => {
      this.createDomainRadarChart();
    }, 300);
  }

  // 趨勢圖按鈕功能
  changeTrendPeriod(period: number): void {
    this.selectedTrendPeriod = period;
    console.log(`切換到 ${period} 天趨勢圖`);
    // 重新載入數據並創建趨勢圖
    this.loadTrendData();
    setTimeout(() => {
      this.createTrendLineChart();
    }, 100);
  }

  // 知識點列表事件處理
  onKnowledgePointClick(item: any): void {
    console.log('知識點被點擊:', item);
    item.expanded = !item.expanded;
  }

  onStartPractice(item: any): void {
    console.log('開始練習:', item);
    // 先觸發AI診斷，在診斷結果中提供練習建議
    this.openKnowledgePointAIDiagnosisModal(item);
  }

  onAIDiagnosis(item: any): void {
    console.log('AI診斷:', item);
    this.openKnowledgePointAIDiagnosisModal(item);
  }

  // 打開練習模態框
  openPracticeModal(item: any): void {
    this.selectedMicro = {
      micro_id: item.id,
      name: item.name,
      mastery: item.mastery,
      attempts: 10,
      correct: Math.round(item.mastery * 10),
      wrong_count: Math.round((1 - item.mastery) * 10),
      difficulty: 'medium',
      confidence: item.mastery
    };
    this.practiceModalVisible = true;
  }

  // 關閉練習模態框
  closePracticeModal(): void {
    this.practiceModalVisible = false;
    this.selectedMicro = null;
  }

  // 打開學習路徑模態框
  openLearningPathModal(item: any): void {
    this.selectedWeakPoint = {
      micro_id: item.id,
      name: item.name,
      mastery: item.mastery,
      priority: 1,
      attempts: 10,
      wrong_count: Math.round((1 - item.mastery) * 10),
      reason: '需要加強練習'
    };
    this.learningPathModalVisible = true;
  }

  // 關閉學習路徑模態框
  closeLearningPathModal(): void {
    this.learningPathModalVisible = false;
    this.selectedWeakPoint = null;
  }

  // 打開知識圖譜模態框
  openKnowledgeGraphModal(): void {
    this.knowledgeGraphModalVisible = true;
  }

  // 關閉知識圖譜模態框
  closeKnowledgeGraphModal(): void {
    this.knowledgeGraphModalVisible = false;
  }

  // 打開知識點AI診斷模態框
  openKnowledgePointAIDiagnosisModal(item: any): void {
    this.aiDiagnosis = {
      diagnosis: `你在「${item.name}」的掌握度為 ${(item.mastery * 100).toFixed(0)}%，主要錯誤集中在概念理解和應用上。`,
      root_cause: '基礎概念理解不夠深入，缺乏實際應用經驗',
      confidence: 0.85,
      evidence: ['答題準確率偏低', '概念理解不完整', '應用能力不足'],
      confidence_score: {
        history: 0.8,
        pattern: 0.7,
        knowledge: 0.9
      },
      learning_path: [
        '複習基礎概念定義',
        '完成5題基礎練習',
        '進行跨知識點綜合練習'
      ],
      practice_questions: [
        {
          id: '1',
          title: '請解釋什麼是正規化？',
          difficulty: 'easy',
          estimated_time: 5,
          accuracy: 0.6,
          completed: false
        },
        {
          id: '2',
          title: '設計一個符合第三正規化的資料表結構',
          difficulty: 'medium',
          estimated_time: 15,
          accuracy: 0.3,
          completed: false
        },
        {
          id: '3',
          title: '分析現有資料表結構的正規化程度',
          difficulty: 'hard',
          estimated_time: 20,
          accuracy: 0.2,
          completed: false
        }
      ],
      error_analysis: [
        { type: '概念錯誤', percentage: 60, count: 12 },
        { type: '應用錯誤', percentage: 30, count: 6 },
        { type: '粗心錯誤', percentage: 10, count: 2 }
      ],
      knowledge_relations: [
        { name: '資料庫基礎', mastery: 0.8, type: 'prerequisite' },
        { name: 'SQL語法', mastery: 0.6, type: 'mastered' }
      ],
      practice_progress: {
        completed: 0,
        total: 3
      }
    };
    this.aiDiagnosisModalVisible = true;
    console.log('AI診斷模態框已打開:', this.aiDiagnosis);
  }

  // 關閉AI診斷模態框
  closeAIDiagnosisModal(): void {
    this.aiDiagnosisModalVisible = false;
    this.aiDiagnosis = null;
  }

  // 開始練習
  startPractice(): void {
    console.log('開始練習:', this.selectedMicro);
    // 這裡可以導航到練習頁面
    this.closePracticeModal();
  }

  // 加入學習計劃
  addToLearningPlan(target: any): void {
    const learningEvent = {
      id: Date.now().toString(),
      title: `學習 ${target.name || '知識點'}`,
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000), // 1小時後
      type: 'study',
      priority: 'high'
    };
    
    console.log('加入學習計劃:', learningEvent);
    // 這裡可以調用服務將事件加入行事曆
    this.analyticsService.addToLearningPlan(learningEvent).subscribe({
      next: (response: any) => {
        console.log('學習事件已加入計劃:', response);
      },
      error: (error: any) => {
        console.error('加入學習計劃失敗:', error);
      }
    });
  }

  // 查看學習路徑
  viewLearningPath(item: any): void {
    console.log('查看學習路徑:', item);
    this.openLearningPathModal(item);
  }

  // 查看知識圖譜
  viewKnowledgeGraph(): void {
    console.log('查看知識圖譜');
    this.openKnowledgeGraphModal();
  }

  // 執行建議
  executeSuggestion(suggestion: any): void {
    console.log('執行建議:', suggestion);
    // 根據建議類型執行相應操作
    if (suggestion.action === 'practice') {
      this.startPractice();
    } else if (suggestion.action === 'learn') {
      this.viewLearningPath(suggestion);
    }
  }

  // 切換知識節點
  toggleKnowledgeNode(item: any): void {
    console.log('切換知識節點:', item);
    item.expanded = !item.expanded;
  }

  // 圖表創建方法
  createOverviewPieChart(): void {
    if (!this.overviewPieChart || !this.overview) return;

    // 銷毀現有圖表
    if (this.overviewPieChartInstance) {
      this.overviewPieChartInstance.destroy();
    }

    const ctx = this.overviewPieChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.overviewPieChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['已掌握', '部分掌握', '需加強'],
      datasets: [{
        data: [
          Math.round(this.overview.overall_mastery * 100),
            Math.round((1 - this.overview.overall_mastery) * 60),
            Math.round((1 - this.overview.overall_mastery) * 40)
          ],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
          borderWidth: 0
        }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createTrendLineChart(): void {
    if (!this.trendLineChart) {
      console.log('趨勢圖Canvas未找到');
      return;
    }

    console.log('創建趨勢圖表，數據:', this.trendData);

    // 銷毀現有圖表
    if (this.trendLineChartInstance) {
      this.trendLineChartInstance.destroy();
    }

    const ctx = this.trendLineChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // 使用真實的趨勢數據
    const labels = this.trendData.map(item => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const masteryData = this.trendData.map(item => item.mastery * 100);
    
    console.log('趨勢圖表數據:', { labels, masteryData });

    this.trendLineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
      datasets: [{
          label: '掌握度 (%)',
          data: masteryData,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
      }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
      scales: {
          y: {
          beginAtZero: true,
          max: 100,
            title: {
              display: true,
              text: '掌握度 (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: '日期'
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
                return `掌握度: ${context.parsed.y.toFixed(1)}%`;
              }
            }
          }
        }
      }
    });
  }

  createDomainRadarChart(): void {
    if (!this.domainRadarChart) return;

    // 銷毀現有圖表
    if (this.domainRadarChartInstance) {
      this.domainRadarChartInstance.destroy();
    }

    const ctx = this.domainRadarChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const domains = this.overview?.domains || this.domains;
    if (!domains || domains.length === 0) return;

    this.domainRadarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: domains.map((d: any) => d.name),
      datasets: [{
        label: '掌握度',
          data: domains.map((d: any) => d.mastery * 100),
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4CAF50'
        }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          r: {
          beginAtZero: true,
            max: 100
        }
      },
      plugins: {
        legend: {
          display: false
          }
        }
      }
    });
  }

  createConfidenceChart(): void {
    if (!this.confidenceChart || !this.aiDiagnosis?.confidence_score) return;

    const ctx = this.confidenceChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const confidence = this.aiDiagnosis.confidence_score;
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['歷史數據', '模式分析', '知識結構'],
        datasets: [{
          data: [
            confidence.history * 100,
            confidence.pattern * 100,
            confidence.knowledge * 100
          ],
          backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createMasteryTrendChart(): void {
    if (!this.masteryTrendChart) return;

    const ctx = this.masteryTrendChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = ['1週前', '2週前', '3週前', '4週前', '現在'];
    const data = [65, 68, 72, 75, 78];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
      datasets: [{
          label: '掌握度趨勢',
          data: data,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
            max: 100
        }
      },
      plugins: {
        legend: {
          display: false
          }
        }
      }
    });
  }

  // 知識圖譜相關方法
  initializeKnowledgeGraph(): void {
    if (!this.knowledgeGraphContainer) {
      console.error('Knowledge graph container not found');
      return;
    }
    
    console.log('開始初始化知識圖譜...');
    console.log('大知識點數據:', this.knowledgeGraphDomains);
    
    // 清空容器
    this.knowledgeGraphContainer.nativeElement.innerHTML = '';
    
    const elements = this.generateKnowledgeGraphElements();
    console.log('生成的圖譜元素:', elements);
    
    if (elements.length === 0) {
      console.warn('沒有圖譜元素生成');
      return;
    }
    
    try {
      // 確保容器有正確的尺寸
      const container = this.knowledgeGraphContainer.nativeElement;
      container.style.width = '100%';
      container.style.height = '500px';
      container.style.minHeight = '500px';
      
      // 創建 Cytoscape 實例
      this.knowledgeGraphCy = (cytoscape as any)({
        container: container,
        elements: elements,
        style: this.getKnowledgeGraphStyle(),
        layout: {
          name: 'preset',
          positions: (node: any) => {
            const data = node.data();
            if (data.type === 'domain') {
              const index = this.knowledgeGraphDomains.findIndex(d => d.id === data.id);
              const pos = this.calculateDomainPosition(index, this.knowledgeGraphDomains.length);
              console.log(`節點 ${data.label} 位置:`, pos);
              return pos;
            } else if (data.type === 'micro') {
              const parentId = data.parentId;
              const microConcepts = this.getMicroConceptsForDomain(parentId);
              const microIndex = microConcepts.findIndex(m => m.id === data.id);
              const pos = this.calculateMicroPosition(parentId, microIndex, microConcepts.length);
              console.log(`子節點 ${data.label} 位置:`, pos);
              return pos;
            }
            return { x: 0, y: 0 };
          }
        },
        minZoom: 0.1,
        maxZoom: 3,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        wheelSensitivity: 0.1
      });
      
      console.log('Cytoscape 實例創建完成');
      this.setupKnowledgeGraphEventListeners();
      
      // 強制重新渲染和居中顯示
      setTimeout(() => {
        if (this.knowledgeGraphCy) {
          this.knowledgeGraphCy.resize();
          this.knowledgeGraphCy.fit();
          this.knowledgeGraphCy.center();
          console.log('圖譜已重新渲染和居中');
          console.log('圖譜節點數量:', this.knowledgeGraphCy.nodes().length);
          console.log('圖譜邊數量:', this.knowledgeGraphCy.edges().length);
          console.log('容器尺寸:', {
            width: container.offsetWidth,
            height: container.offsetHeight
          });
        }
      }, 100);
      setTimeout(() => {
        if (this.knowledgeGraphCy) {
          this.knowledgeGraphCy.fit();
        }
      }, 100);
      
    } catch (error) {
      console.error('創建知識圖譜失敗:', error);
    }
  }

  private generateKnowledgeGraphElements(): any[] {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 生成大知識點節點
    this.knowledgeGraphDomains.forEach(domain => {
      nodes.push({
        data: {
          id: domain.id,
          label: domain.name,
          type: 'domain',
          mastery: domain.mastery,
          questionCount: domain.questionCount,
          wrongCount: domain.wrongCount
        }
      });
    });

    // 生成跨領域連線
    const crossDomainEdges = this.generateCrossDomainEdges(edges);
    edges.push(...crossDomainEdges);

    // 生成子知識點（如果已展開）
    const microNodes = this.generateMicroConcepts(nodes, edges);
    nodes.push(...microNodes);

    return [...nodes, ...edges];
  }

  private calculateDomainPosition(index: number, total: number): { x: number; y: number } {
    if (index === 0) {
      // 資訊管理放在中心
      return { x: 250, y: 250 };
    }
    
    const angle = (2 * Math.PI * (index - 1)) / (total - 1);
    const radius = 120;
    const centerX = 250;
    const centerY = 250;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  private generateCrossDomainEdges(edges: GraphEdge[]): GraphEdge[] {
    const newEdges: GraphEdge[] = [];
    const centerId = 'info-management';
    
    this.knowledgeGraphDomains.forEach(domain => {
      if (domain.id !== centerId) {
        newEdges.push({
          data: {
            id: `cross-${centerId}-${domain.id}`,
            source: centerId,
            target: domain.id,
            type: 'cross-domain',
            strength: 0.8
          }
        });
      }
    });
    
    return newEdges;
  }

  private generateMicroConcepts(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
    const microNodes: GraphNode[] = [];
    
    this.knowledgeGraphDomains.forEach(domain => {
      if (domain.isExpanded) {
        const microConcepts = this.getMicroConceptsForDomain(domain.id);
        microConcepts.forEach((micro, index) => {
          const microId = `${domain.id}-${micro.id}`;
          microNodes.push({
            data: {
              id: microId,
              label: micro.name,
              type: 'micro',
              mastery: micro.mastery,
              questionCount: micro.questionCount,
              wrongCount: micro.wrongCount,
              parentId: domain.id
            }
          });
          
          // 添加父子關係邊
          edges.push({
            data: {
              id: `parent-${domain.id}-${microId}`,
              source: domain.id,
              target: microId,
              type: 'parent-child'
            }
          });
        });
      }
    });
    
    return microNodes;
  }

  private getMicroConceptsForDomain(domainId: string): any[] {
    // 模擬子知識點數據
    const microConceptsMap: { [key: string]: any[] } = {
      'info-management': [
        { id: '1', name: '資料庫設計', mastery: 0.8, questionCount: 8, wrongCount: 1 },
        { id: '2', name: '系統分析', mastery: 0.7, questionCount: 6, wrongCount: 2 },
        { id: '3', name: '專案管理', mastery: 0.9, questionCount: 5, wrongCount: 0 }
      ],
      'algorithm': [
        { id: '4', name: '排序演算法', mastery: 0.6, questionCount: 7, wrongCount: 3 },
        { id: '5', name: '搜尋演算法', mastery: 0.8, questionCount: 5, wrongCount: 1 }
      ],
      'data-structure': [
        { id: '6', name: '陣列', mastery: 0.9, questionCount: 4, wrongCount: 0 },
        { id: '7', name: '樹狀結構', mastery: 0.5, questionCount: 8, wrongCount: 4 }
      ],
      'system-analysis': [
        { id: '8', name: '需求分析', mastery: 0.7, questionCount: 6, wrongCount: 2 },
        { id: '9', name: '系統設計', mastery: 0.8, questionCount: 5, wrongCount: 1 }
      ]
    };
    
    return microConceptsMap[domainId] || [];
  }

  private calculateMicroPosition(parentId: string, index: number, total: number): { x: number; y: number } {
    const parentIndex = this.knowledgeGraphDomains.findIndex(d => d.id === parentId);
    const parentPos = this.calculateDomainPosition(parentIndex, this.knowledgeGraphDomains.length);
    
    const spacing = 60;
    const startX = parentPos.x - (total - 1) * spacing / 2;
    
    return {
      x: startX + index * spacing,
      y: parentPos.y + 80
    };
  }

  private calculateNodeSize(questionCount: number): number {
    return Math.max(20, Math.min(60, questionCount * 2));
  }

  private getKnowledgeGraphStyle(): any[] {
    return [
      {
        selector: 'node',
        style: {
          'background-color': '#4CAF50',
          'label': 'data(label)',
          'text-valign': 'center',
          'text-halign': 'center',
          'color': '#fff',
          'font-size': '12px',
          'width': 'data(questionCount)',
          'height': 'data(questionCount)',
          'border-width': 2,
          'border-color': '#fff'
        }
      },
      {
        selector: 'node[type="domain"]',
        style: {
          'background-color': (ele: any) => {
            const mastery = ele.data('mastery');
            if (mastery >= 0.8) return '#4CAF50';
            if (mastery >= 0.6) return '#FFC107';
            return '#F44336';
          },
          'width': 80,
          'height': 40,
          'shape': 'ellipse'
        }
      },
      {
        selector: 'node[type="micro"]',
        style: {
          'background-color': (ele: any) => {
            const mastery = ele.data('mastery');
            if (mastery >= 0.8) return '#4CAF50';
            if (mastery >= 0.6) return '#FFC107';
            return '#F44336';
          },
          'width': 60,
          'height': 30,
          'shape': 'rectangle'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      },
      {
        selector: 'edge[type="cross-domain"]',
        style: {
          'line-color': '#2196F3',
          'width': 3
        }
      },
      {
        selector: 'edge[type="parent-child"]',
        style: {
          'line-color': '#666',
          'line-style': 'dashed',
          'width': 1
        }
      }
    ];
  }

  private setupKnowledgeGraphEventListeners(): void {
    if (!this.knowledgeGraphCy) return;

    // 節點點擊事件
    this.knowledgeGraphCy.on('tap', 'node', (evt: any) => {
      const node = evt.target;
      const data = node.data();
      
      if (data.type === 'domain') {
        this.toggleDomainExpansion(data.id);
      }
      
      console.log('節點被點擊:', data);
    });

    // 邊點擊事件
    this.knowledgeGraphCy.on('tap', 'edge', (evt: any) => {
      const edge = evt.target;
      const data = edge.data();
      console.log('邊被點擊:', data);
    });

    // 懸停事件
    this.knowledgeGraphCy.on('mouseover', 'node', (evt: any) => {
      const node = evt.target;
      const data = node.data();
      const tooltipText = this.generateTooltipText(data);
      this.showTooltip(evt.originalEvent, tooltipText);
    });

    this.knowledgeGraphCy.on('mouseover', 'edge', (evt: any) => {
      const edge = evt.target;
      const data = edge.data();
      const tooltipText = this.generateEdgeTooltipText(data);
      this.showTooltip(evt.originalEvent, tooltipText);
    });

    this.knowledgeGraphCy.on('mouseout', 'node, edge', () => {
      this.hideTooltip();
    });
  }

  private toggleDomainExpansion(domainId: string): void {
    const domain = this.knowledgeGraphDomains.find(d => d.id === domainId);
    if (domain) {
      domain.isExpanded = !domain.isExpanded;
      this.updateKnowledgeGraph();
    }
  }

  private updateKnowledgeGraph(): void {
    if (!this.knowledgeGraphCy) return;
    
    const elements = this.generateKnowledgeGraphElements();
    this.knowledgeGraphCy.elements().remove();
    this.knowledgeGraphCy.add(elements);
    this.knowledgeGraphCy.layout({
      name: 'preset',
      positions: (node: any) => {
        const data = node.data();
        if (data.type === 'domain') {
          const index = this.knowledgeGraphDomains.findIndex(d => d.id === data.id);
          return this.calculateDomainPosition(index, this.knowledgeGraphDomains.length);
        } else if (data.type === 'micro') {
          const parentId = data.parentId;
          const microConcepts = this.getMicroConceptsForDomain(parentId);
          const microIndex = microConcepts.findIndex(m => m.id === data.id);
          return this.calculateMicroPosition(parentId, microIndex, microConcepts.length);
        }
        return { x: 0, y: 0 };
      }
    }).run();
  }

  private generateTooltipText(data: any): string {
    return `
      <strong>${data.label}</strong><br>
      掌握度: ${(data.mastery * 100).toFixed(0)}%<br>
      題目數: ${data.questionCount}<br>
      錯誤數: ${data.wrongCount}
    `;
  }

  private generateEdgeTooltipText(data: any): string {
    return `
      <strong>${data.type === 'cross-domain' ? '跨領域關聯' : '子知識點關係'}</strong><br>
      關聯強度: ${data.strength ? (data.strength * 100).toFixed(0) + '%' : 'N/A'}
    `;
  }

  private showTooltip(event: MouseEvent, content: string): void {
    this.hideTooltip();
    
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'cytoscape-tooltip';
    this.tooltipElement.innerHTML = content;
    this.tooltipElement.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      max-width: 200px;
    `;
    
    document.body.appendChild(this.tooltipElement);
    
    const x = event.clientX + 10;
    const y = event.clientY - 10;
    this.tooltipElement.style.left = x + 'px';
    this.tooltipElement.style.top = y + 'px';
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      document.body.removeChild(this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  // 銷毀所有圖表
  private destroyAllCharts(): void {
    if (this.overviewPieChartInstance) {
      this.overviewPieChartInstance.destroy();
      this.overviewPieChartInstance = null;
    }
    if (this.domainRadarChartInstance) {
      this.domainRadarChartInstance.destroy();
      this.domainRadarChartInstance = null;
    }
    if (this.trendLineChartInstance) {
      this.trendLineChartInstance.destroy();
      this.trendLineChartInstance = null;
    }
    if (this.confidenceChartInstance) {
      this.confidenceChartInstance.destroy();
      this.confidenceChartInstance = null;
    }
    if (this.masteryTrendChartInstance) {
      this.masteryTrendChartInstance.destroy();
      this.masteryTrendChartInstance = null;
    }
  }

  // 獲取掌握度顏色
  getMasteryColor(mastery: number): 'success' | 'warning' | 'danger' {
    if (mastery >= 0.8) return 'success';
    if (mastery >= 0.6) return 'warning';
    return 'danger';
  }

  // 獲取優先級顏色
  getPriorityColor(priority: string): 'success' | 'warning' | 'danger' {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'success';
    }
  }

  // 獲取難度顏色
  getDifficultyColor(difficulty: string): 'success' | 'warning' | 'danger' {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'success';
    }
  }

  // 獲取當前時間
  getCurrentTime(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  }

  // 初始化任務清單
  private initializeTaskList(): void {
    this.taskList = [
      {
        id: 'task-1',
        title: '完成資料結構練習',
        description: '完成5題二元樹相關練習',
        priority: 'high',
        completed: false
      },
      {
        id: 'task-2',
        title: '複習演算法概念',
        description: '複習排序演算法相關知識點',
        priority: 'medium',
        completed: true
      },
      {
        id: 'task-3',
        title: '完成資料庫設計練習',
        description: '完成3題正規化練習',
        priority: 'low',
        completed: false
      }
    ];
  }

  // 初始化進度追蹤
  private initializeProgressTracking(): void {
    this.progressTracking = [
      {
        title: '資料結構與演算法',
        percentage: 75,
        completed: 15,
        total: 20,
        remaining: 5
      },
      {
        title: '資料庫系統',
        percentage: 60,
        completed: 12,
        total: 20,
        remaining: 8
      },
      {
        title: '軟體工程',
        percentage: 85,
        completed: 17,
        total: 20,
        remaining: 3
      },
      {
        title: '網路程式設計',
        percentage: 40,
        completed: 8,
        total: 20,
        remaining: 12
      }
    ];
  }

  // 獲取進度顏色
  getProgressColor(percentage: number): 'success' | 'warning' | 'danger' {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  // 獲取比較顏色類別
  getComparisonClass(myScore: number, classAverage: number): string {
    if (!myScore || !classAverage) return 'text-muted';
    if (myScore > classAverage) return 'text-success';
    if (myScore < classAverage) return 'text-danger';
    return 'text-warning';
  }

  // 獲取比較圖標
  getComparisonIcon(myScore: number, classAverage: number): string {
    if (!myScore || !classAverage) return 'cil-minus';
    if (myScore > classAverage) return 'cil-arrow-top';
    if (myScore < classAverage) return 'cil-arrow-bottom';
    return 'cil-minus';
  }

  // 獲取進步顏色類別
  getProgressClass(improvement: number): string {
    if (!improvement) return 'text-muted';
    if (improvement > 0) return 'text-success';
    if (improvement < 0) return 'text-danger';
    return 'text-warning';
  }

  // 載入實時數據
  private loadRealTimeData(): void {
    this.isLoadingAI = true;
    
    // 模擬AI分析過程
    setTimeout(() => {
      this.generateAIAnalysis();
      this.loadPeerComparisonData();
      // 移除重複的loadTrendData調用，因為已經在ngOnInit中調用過
      this.isLoadingAI = false;
    }, 2000);
  }

  // 生成AI分析
  private generateAIAnalysis(): void {
    if (this.overview) {
      const mastery = this.overview.overall_mastery;
      const weakCount = this.overview.weak_points_count;
      
      let analysis = '';
      if (mastery >= 0.8) {
        analysis = `恭喜！您的整體掌握度達到${(mastery * 100).toFixed(1)}%，表現優秀。建議繼續保持並挑戰更高難度的題目。`;
      } else if (mastery >= 0.6) {
        analysis = `您的掌握度為${(mastery * 100).toFixed(1)}%，仍有進步空間。建議專注於${weakCount}個弱點知識點的練習。`;
      } else {
        analysis = `目前掌握度為${(mastery * 100).toFixed(1)}%，需要加強學習。建議從基礎概念開始，逐步提升。`;
      }
      
      this.overview.ai_summary = {
        title: 'AI學習分析',
        content: analysis,
        confidence: mastery >= 0.7 ? 0.85 : mastery >= 0.5 ? 0.6 : 0.3,
        last_updated: new Date().toISOString()
      };
    }
  }

  // 載入同儕比較數據
  private loadPeerComparisonData(): void {
    this.peerData = {
      class_average: 0.72,
      percentile: 75,
      improvement: 5.2,
      distribution: [10, 20, 30, 25, 15] // 各分數段人數分布
    };
  }

  // 載入趨勢數據
  private loadTrendData(): void {
    const days = this.selectedTrendPeriod;
    this.trendData = [];
    
    console.log('載入趨勢數據，天數:', days);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      this.trendData.push({
        date: date.toISOString().split('T')[0],
        mastery: 0.6 + Math.random() * 0.3, // 模擬數據
        attempts: Math.floor(Math.random() * 10) + 1
      });
    }
    
    console.log('趨勢數據載入完成:', this.trendData);
  }

  // 創建雷達圖
  private createRadarChart(): void {
    const canvas = this.radarChart?.nativeElement;
    if (!canvas) {
      console.log('雷達圖Canvas未找到');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 銷毀現有圖表
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    // 使用真實的領域數據
    const labels = this.overview?.domains?.map(d => d.name) || ['資料結構', '演算法', '資料庫', '軟體工程'];
    const myData = this.overview?.domains?.map(d => d.mastery * 100) || [75, 60, 85, 70];
    const classData = this.overview?.domains?.map(d => (d.mastery * 100) - 5 + Math.random() * 10) || [70, 65, 75, 68];

    const data = {
      labels: labels,
      datasets: [{
        label: '你的能力',
        data: myData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }, {
        label: '班平均',
        data: classData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      }]
    };

    const config = {
      type: 'radar' as const,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: '能力分布對比'
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return `${context.dataset.label}: ${context.parsed.r.toFixed(1)}%`;
              }
            }
          }
        }
      }
    };

    new Chart(ctx, config);
  }
}