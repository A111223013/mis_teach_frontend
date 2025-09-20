import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { LearningAnalyticsService, OverviewData, AIDiagnosis, DomainData, MicroConceptData, WeakPoint, SubConcept, ErrorType, PracticeQuestion, ErrorAnalysis, KnowledgeRelation } from '../../../service/learning-analytics.service';

// CoreUI 組件導入
import { CardComponent } from '@coreui/angular';
import { CardBodyComponent } from '@coreui/angular';
import { CardHeaderComponent } from '@coreui/angular';
import { ModalComponent } from '@coreui/angular';
import { ModalHeaderComponent } from '@coreui/angular';
import { ModalBodyComponent } from '@coreui/angular';
import { ModalFooterComponent } from '@coreui/angular';

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
  color: 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'secondary';
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
  
  // 知識診斷Tab狀態
  activeKnowledgeTab: 'hierarchy' | 'network' = 'hierarchy';
  
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
  learningPlanModalVisible: boolean = false;
  
  // 選中的數據
  selectedMicro: MicroConceptData | null = null;
  selectedWeakPoint: WeakPoint | null = null;
  selectedLearningPlan: AIDiagnosis | null = null;

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
    
    // 從後端API載入數據
    this.loadOverviewData();
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
    // 使用空數據初始化，等待API數據載入
    this.metricCards = [
      {
        title: '整體掌握度',
        value: '載入中...',
        icon: 'cil-chart-pie',
        color: 'secondary',
        trend: '',
        description: '正在載入數據',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '近7天作答次數',
        value: '載入中...',
        icon: 'cil-calendar',
        color: 'secondary',
        trend: '',
        description: '正在載入數據',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '弱點數量',
        value: '載入中...',
        icon: 'cil-warning',
        color: 'secondary',
        trend: '',
        description: '正在載入數據',
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '學習階段',
        value: '載入中...',
        icon: 'cil-education',
        color: 'secondary',
        trend: '',
        description: '正在載入數據',
        onClick: () => this.openAIDiagnosisModal()
      }
    ];
  }

  // 更新指標卡片數據
  private updateMetricCards(): void {
    if (!this.overview) return;

    this.metricCards = [
      {
        title: '整體掌握度',
        value: `${(this.overview.overall_mastery * 100).toFixed(1)}%`,
        icon: 'cil-chart-pie',
        color: this.overview.overall_mastery > 0.7 ? 'success' : this.overview.overall_mastery > 0.5 ? 'warning' : 'danger',
        trend: this.calculateMasteryTrend(),
        description: this.getMasteryTrendDescription(),
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '近7天作答次數',
        value: this.overview.recent_activity?.toString() || '0',
        icon: 'cil-calendar',
        color: 'info',
        trend: this.calculateActivityTrend(),
        description: this.getActivityTrendDescription(),
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '弱點數量',
        value: this.overview.weak_points_count?.toString() || '0',
        icon: 'cil-warning',
        color: this.overview.weak_points_count > 5 ? 'danger' : this.overview.weak_points_count > 2 ? 'warning' : 'success',
        trend: this.calculateWeakPointsTrend(),
        description: this.getWeakPointsTrendDescription(),
        onClick: () => this.openAIDiagnosisModal()
      },
      {
        title: '學習階段',
        value: this.getLearningStage(),
        icon: 'cil-education',
        color: 'primary',
        trend: '穩定',
        description: '持續進步中',
        onClick: () => this.openAIDiagnosisModal()
      }
    ];
  }

  // 根據掌握度判斷學習階段
  private getLearningStage(): string {
    if (!this.overview) return '載入中...';
    
    const mastery = this.overview.overall_mastery;
    if (mastery >= 0.8) return '進階';
    if (mastery >= 0.6) return '中級';
    if (mastery >= 0.4) return '初級';
    return '入門';
  }

  // 計算掌握度趨勢
  private calculateMasteryTrend(): string {
    if (!this.overview?.recent_trend || this.overview.recent_trend.length < 2) {
      return '--';
    }
    
    const recent = this.overview.recent_trend.slice(-7); // 最近7天
    const older = this.overview.recent_trend.slice(-14, -7); // 前7天
    
    const recentAvg = recent.reduce((sum, day) => sum + day.accuracy, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, day) => sum + day.accuracy, 0) / older.length : recentAvg;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  }

  // 獲取掌握度趨勢描述
  private getMasteryTrendDescription(): string {
    const trend = this.calculateMasteryTrend();
    if (trend === '--') return '數據不足';
    if (trend.startsWith('+')) return '較前期提升';
    if (trend.startsWith('-')) return '較前期下降';
    return '保持穩定';
  }

  // 計算活動趨勢
  private calculateActivityTrend(): string {
    if (!this.overview?.recent_trend || this.overview.recent_trend.length < 2) {
      return '--';
    }
    
    const recent = this.overview.recent_trend.slice(-7); // 最近7天
    const older = this.overview.recent_trend.slice(-14, -7); // 前7天
    
    const recentTotal = recent.reduce((sum, day) => sum + day.attempts, 0);
    const olderTotal = older.length > 0 ? older.reduce((sum, day) => sum + day.attempts, 0) : recentTotal;
    
    const change = recentTotal - olderTotal;
    return change > 0 ? `+${change}` : change.toString();
  }

  // 獲取活動趨勢描述
  private getActivityTrendDescription(): string {
    const trend = this.calculateActivityTrend();
    if (trend === '--') return '數據不足';
    if (trend.startsWith('+')) return '較前期增加';
    if (trend.startsWith('-')) return '較前期減少';
    return '保持穩定';
  }

  // 計算弱點趨勢
  private calculateWeakPointsTrend(): string {
    if (!this.overview) return '--';
    
    // 這裡可以根據歷史數據計算弱點數量變化
    // 暫時使用模擬數據
    const currentWeakPoints = this.overview.weak_points_count || 0;
    const previousWeakPoints = currentWeakPoints + Math.floor(Math.random() * 3) - 1; // 模擬變化
    
    const change = currentWeakPoints - previousWeakPoints;
    return change > 0 ? `+${change}` : change.toString();
  }

  // 獲取弱點趨勢描述
  private getWeakPointsTrendDescription(): string {
    const trend = this.calculateWeakPointsTrend();
    if (trend === '--') return '數據不足';
    if (trend.startsWith('+')) return '較前期增加';
    if (trend.startsWith('-')) return '較前期減少';
    return '保持穩定';
  }

  // 初始化知識點列表數據
  private initializeKnowledgePointLists(): void {
    console.log('初始化知識點列表，overview數據:', this.overview);
    
    // 如果overview數據不存在，使用空數據
    if (!this.overview) {
      this.improvementItems = [];
      this.attentionItems = [];
      console.log('沒有overview數據，使用空列表');
      return;
    }

    // 使用overview數據
    this.improvementItems = (this.overview.recent_improvements || []).map((item, index) => ({
      id: `improvement_${index + 1}`,
      name: item.name,
      mastery: item.mastery / 100, // 轉換為0-1範圍
      improvement: item.improvement / 100,
      type: 'improvement' as const,
      expanded: false,
      showButtons: true,
      priority: item.priority,
      ai_strategy: item.ai_strategy
    }));

    this.attentionItems = (this.overview.needs_attention || []).map((item, index) => ({
      id: `attention_${index + 1}`,
      name: item.name,
      mastery: item.mastery / 100, // 轉換為0-1範圍
      decline: item.decline / 100,
      type: 'attention' as const,
      expanded: false,
      showButtons: true,
      priority: item.priority,
      ai_strategy: item.ai_strategy
    }));
    
    console.log('知識點列表初始化完成:', {
      improvementItems: this.improvementItems.length,
      attentionItems: this.attentionItems.length,
      overview: this.overview
    });
  }

  // 初始化知識圖譜專用領域數據
  private initializeKnowledgeGraphDomains(): void {
    // 根據overview數據生成知識圖譜領域數據
    if (this.overview && this.overview.domains) {
      this.knowledgeGraphDomains = this.overview.domains.map(domain => ({
        id: domain.name.toLowerCase().replace(/\s+/g, '-'),
        name: domain.name,
        mastery: domain.mastery,
        questionCount: domain.concept_count || 0,
        wrongCount: Math.round((domain.concept_count || 0) * (1 - domain.mastery)),
        isExpanded: false
      }));
    } else {
      // 如果沒有數據，顯示空領域數據
      this.knowledgeGraphDomains = [];
    }
    
    console.log('知識圖譜領域數據初始化完成:', this.knowledgeGraphDomains);
  }

  // 任務管理
  toggleTask(task: TaskItem): void {
    task.completed = !task.completed;
    console.log('任務狀態更新:', task);
  }

  // 打開AI診斷Modal
  openAIDiagnosisModal(microId?: string): void {
    if (microId) {
      // 調用後端API獲取AI診斷
      this.analyticsService.getAIDiagnosis('', microId).subscribe({
        next: (diagnosis) => {
          this.aiDiagnosis = diagnosis;
          this.selectedAIDiagnosis = diagnosis;
          this.aiDiagnosisModalVisible = true;
        },
        error: (error) => {
          console.error('獲取AI診斷失敗:', error);
          // 使用空數據
          this.aiDiagnosis = {
            concept_name: '未知知識點',
            mastery: 0,
            confidence: 0,
            conclusion: '無法獲取診斷數據',
            diagnosis: '無法獲取診斷數據',
            root_cause: 'API調用失敗',
            evidence: ['數據載入失敗'],
            learning_path: [],
            practice_questions: [],
            error_analysis: [],
            knowledge_relations: []
          };
          this.selectedAIDiagnosis = this.aiDiagnosis;
          this.aiDiagnosisModalVisible = true;
        }
      });
    } else {
      // 使用現有的診斷數據
      this.selectedAIDiagnosis = this.aiDiagnosis;
      this.aiDiagnosisModalVisible = true;
    }
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
    // 調用後端API獲取AI診斷
    const microId = item.id || item.name; // 使用ID或名稱作為知識點標識
    this.openAIDiagnosisModal(microId);
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
    console.log('加入學習計劃:', target);
    
    // 設置選中的學習計劃數據
    this.selectedLearningPlan = this.aiDiagnosis || {
      concept_name: target.name || '知識點',
      diagnosis: 'AI推薦的個人化學習路徑',
      root_cause: '基於您的學習狀況分析',
      learning_path: [
        '1. 複習基礎概念',
        '2. 練習相關題目',
        '3. 強化薄弱環節',
        '4. 進行綜合測試'
      ],
            practice_questions: [],
            evidence: [],
      confidence: 0.8
    };
    
    // 打開學習計劃Modal
    this.learningPlanModalVisible = true;
  }

  // 關閉學習計劃Modal
  closeLearningPlanModal(): void {
    this.learningPlanModalVisible = false;
    this.selectedLearningPlan = null;
  }

  // 確認加入學習計劃
  confirmLearningPlan(): void {
    console.log('確認加入學習計劃');
    
    // 創建學習事件
    const learningEvent = {
      id: Date.now().toString(),
      title: `學習 ${this.selectedLearningPlan?.concept_name || '知識點'}`,
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
        alert('已成功加入學習計劃！');
        this.closeLearningPlanModal();
      },
      error: (error: any) => {
        console.error('加入學習計劃失敗:', error);
        alert('加入學習計劃失敗，請稍後再試。');
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

  // 獲取優先級標籤
  getPriorityLabel(priority: 'urgent' | 'maintain' | 'enhance'): string {
    switch (priority) {
      case 'urgent': return '🔥急迫';
      case 'maintain': return '✅維持';
      case 'enhance': return '💡可提升';
      default: return '';
    }
  }

  // 獲取優先級樣式類
  getPriorityClass(priority: 'urgent' | 'maintain' | 'enhance'): string {
    switch (priority) {
      case 'urgent': return 'badge bg-danger';
      case 'maintain': return 'badge bg-success';
      case 'enhance': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  // AI診斷並複習 - 統一的入口點
  openAIDiagnosisAndPractice(item: any): void {
    console.log('開始AI診斷並複習流程:', item);
    
    // 先進行AI診斷
    this.openKnowledgePointAIDiagnosisModal(item);
    
    // 診斷完成後自動進入練習模式
    // 這個邏輯會在AI診斷Modal的"開始練習"按鈕中實現
  }

  // 從診斷結果開始練習
  startPracticeFromDiagnosis(): void {
    console.log('從AI診斷結果開始練習');
    
    // 關閉診斷Modal
    this.aiDiagnosisModalVisible = false;
    
    // 根據AI診斷結果生成練習內容
    if (this.aiDiagnosis) {
      // 創建基於診斷結果的練習項目
      const practiceItem: MicroConceptData = {
        micro_id: 'ai-diagnosis-practice',
        name: '基於AI診斷的練習',
        mastery: 0.5, // 根據診斷結果調整
        attempts: this.aiDiagnosis.practice_questions.length,
        correct: Math.floor(this.aiDiagnosis.practice_questions.length * 0.6), // 假設60%正確率
        wrong_count: Math.floor(this.aiDiagnosis.practice_questions.length * 0.4),
        difficulty: 'medium',
        confidence: this.aiDiagnosis.confidence
      };
      
      // 設置選中的微概念並打開練習Modal
      this.selectedMicro = practiceItem;
      this.practiceModalVisible = true;
      
      console.log('練習Modal已打開，基於AI診斷結果:', practiceItem);
    }
  }

  // 切換知識診斷Tab
  switchKnowledgeTab(tab: 'hierarchy' | 'network'): void {
    this.activeKnowledgeTab = tab;
    console.log('切換到知識診斷Tab:', tab);
    
    // 如果切換到關聯圖譜，確保圖譜已初始化
    if (tab === 'network') {
      setTimeout(() => {
        this.initializeKnowledgeGraph();
      }, 100);
    }
  }

  // 開始快速練習（5題基礎）
  startQuickPractice(): void {
    console.log('開始快速練習');
    this.closeAIDiagnosisModal();
    
    if (this.aiDiagnosis) {
      // 選擇前5題作為快速練習
      const quickQuestions = this.aiDiagnosis.practice_questions.slice(0, 5);
      this.startPracticeWithQuestions(quickQuestions, '快速練習');
    }
  }

  // 開始完整練習（全部題目）
  startFullPractice(): void {
    console.log('開始完整練習');
    this.closeAIDiagnosisModal();
    
    if (this.aiDiagnosis) {
      // 使用所有題目
      this.startPracticeWithQuestions(this.aiDiagnosis.practice_questions, '完整練習');
    }
  }

  // 根據題目列表開始練習
  private startPracticeWithQuestions(questions: any[], practiceType: string): void {
    if (this.aiDiagnosis) {
      // 創建基於診斷結果的練習項目
      const practiceItem: MicroConceptData = {
        micro_id: `ai-diagnosis-${practiceType.toLowerCase()}`,
        name: `基於AI診斷的${practiceType}`,
        mastery: 0.5,
        attempts: questions.length,
        correct: Math.floor(questions.length * 0.6),
        wrong_count: Math.floor(questions.length * 0.4),
        difficulty: 'medium',
        confidence: this.aiDiagnosis.confidence
      };
      
      // 設置選中的微概念並打開練習Modal
      this.selectedMicro = practiceItem;
      this.practiceModalVisible = true;
      
      console.log(`${practiceType}Modal已打開，基於AI診斷結果:`, practiceItem);
    }
  }

  // 獲取建議圖標
  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'practice': return 'cil-play';
      case 'path': return 'cil-route';
      case 'review': return 'cil-magnifying-glass';
      default: return 'cil-lightbulb';
    }
  }

  // 獲取建議顏色
  getSuggestionColor(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'primary';
    }
  }

  // 獲取學習活躍度百分比
  getActivityPercentage(): number {
    if (!this.overview?.recent_activity) return 0;
    // 假設最大活躍度為20，可以根據實際需求調整
    return Math.min((this.overview.recent_activity / 20) * 100, 100);
  }

  // 獲取學習活躍度樣式類
  getActivityClass(): string {
    const percentage = this.getActivityPercentage();
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    if (percentage >= 40) return 'bg-info';
    return 'bg-danger';
  }

  // 獲取學習活躍度文字描述
  getActivityText(): string {
    const percentage = this.getActivityPercentage();
    if (percentage >= 80) return '非常活躍 🔥';
    if (percentage >= 60) return '活躍 📈';
    if (percentage >= 40) return '一般 📊';
    return '需要加強 💪';
  }

  // 學習效率指標 - 從後端API獲取
  getLearningVelocity(): number {
    // TODO: 從後端API獲取學習速度數據
    return this.overview?.learning_velocity || 0;
  }

  getRetentionRate(): number {
    // TODO: 從後端API獲取保持率數據
    return this.overview?.retention_rate || 0;
  }

  getAvgTimePerConcept(): number {
    // TODO: 從後端API獲取平均掌握時間數據
    return this.overview?.avg_time_per_concept || 0;
  }

  getFocusScore(): number {
    // TODO: 從後端API獲取專注度數據
    return this.overview?.focus_score || 0;
  }

  // 新增練習方法
  startDeepPractice(): void {
    console.log('開始深度練習');
    this.closeAIDiagnosisModal();
    if (this.aiDiagnosis) {
      const allQuestions = this.aiDiagnosis.practice_questions;
      this.startPracticeWithQuestions(allQuestions, '深度練習');
    }
  }


  // 初始化任務清單
  private initializeTaskList(): void {
    // 根據overview數據生成任務清單
    if (this.overview) {
      this.taskList = [];
      
      // 根據弱點生成任務
      this.overview.top_weak_points.forEach((weakPoint, index) => {
        this.taskList.push({
          id: `weakness-task-${index}`,
          title: `加強${weakPoint.name}練習`,
          description: `完成${weakPoint.name}相關練習題`,
          priority: 'high',
          completed: false
        });
      });
      
      // 根據AI建議生成任務
      if (this.overview.ai_suggestions) {
        this.overview.ai_suggestions.forEach((suggestion, index) => {
          this.taskList.push({
            id: `suggestion-task-${index}`,
            title: suggestion.title,
            description: suggestion.description,
            priority: suggestion.priority === 'high' ? 'high' : suggestion.priority === 'medium' ? 'medium' : 'low',
            completed: false
          });
        });
      }
    } else {
      // 如果沒有數據，顯示空任務清單
      this.taskList = [];
    }
  }

  // 初始化進度追蹤
  private initializeProgressTracking(): void {
    // 根據overview數據生成進度追蹤
    if (this.overview && this.overview.domains) {
      this.progressTracking = this.overview.domains.map(domain => {
        const percentage = Math.round(domain.mastery * 100);
        const total = domain.concept_count || 0;
        const completed = Math.round(total * domain.mastery);
        const remaining = total - completed;
        
        return {
          title: domain.name,
          percentage: percentage,
          completed: completed,
          total: total,
          remaining: remaining
        };
      });
    } else {
      // 如果沒有數據，顯示空進度追蹤
      this.progressTracking = [];
    }
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

  // 載入總覽數據
  loadOverviewData(): void {
    console.log('載入總覽數據');
    
    this.analyticsService.loadOverview('').subscribe({
        next: (data) => {
          console.log('總覽數據載入成功:', data);
          this.overview = data;
          this.updateMetricCards(); // 更新指標卡片
          this.initializeKnowledgePointLists();
          // 在overview數據載入後初始化依賴的方法
          this.initializeKnowledgeGraphDomains();
          this.initializeTaskList();
          this.initializeProgressTracking();
        },
      error: (error) => {
        console.error('載入總覽數據失敗:', error);
        // 使用空數據
        // 使用空數據結構
        this.overview = {
          overall_mastery: 0,
          domains: [],
          top_weak_points: [],
          recent_trend: [],
          total_attempts: 0,
          weak_points_count: 0,
          recent_activity: 0,
          class_ranking: 0,
          recent_improvements: [],
          needs_attention: [],
          ai_suggestions: [],
          ai_summary: {
            title: '載入中...',
            content: '正在載入您的學習數據...',
            confidence: 0,
            last_updated: new Date().toISOString()
          },
          learning_velocity: 0,
          retention_rate: 0,
          avg_time_per_concept: 0,
          focus_score: 0
        };
        this.initializeKnowledgePointLists();
      }
    });
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
    // 調用後端API獲取同儕比較數據
    this.analyticsService.getPeerComparison('').subscribe({
      next: (data) => {
        this.peerData = data;
        console.log('同儕比較數據載入成功:', data);
      },
      error: (error) => {
        console.error('載入同儕比較數據失敗:', error);
        // 使用空數據
        this.peerData = {
          class_average: 0,
          percentile: 0,
          improvement: 0,
          distribution: []
        };
      }
    });
  }

  // 載入趨勢數據
  private loadTrendData(): void {
    // 調用後端API獲取趨勢數據
    this.analyticsService.getTrends('').subscribe({
      next: (data) => {
        this.trendData = data;
        console.log('趨勢數據載入成功:', data);
        // 重新創建趨勢圖表
        setTimeout(() => {
          this.createTrendLineChart();
        }, 100);
      },
      error: (error) => {
        console.error('載入趨勢數據失敗:', error);
        // 使用空數據
        this.trendData = [];
      }
    });
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