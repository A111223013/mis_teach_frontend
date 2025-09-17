import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ProgressComponent, ProgressBarComponent,
  BadgeComponent,
  TableModule,
  ModalModule, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent
} from '@coreui/angular';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../../service/analytics.service';
import * as d3 from 'd3';

// 註冊 Chart.js 的所有組件
Chart.register(...registerables);

interface LearningAnalysisData {
  student_email: string;
  generated_at: string;
  overview: {
    total_domains: number;
    total_blocks: number;
    total_concepts: number;
    total_practice_count: number;
    overall_mastery: number;
  };
  knowledge_hierarchy: KnowledgeDomain[];
  learning_path: any[];
}

interface KnowledgeDomain {
  id: string;
  name: string;
  type: string;
  description: string;
  mastery_level: number;
  practice_count: number;
  status: string;
  blocks: KnowledgeBlock[];
}

interface KnowledgeBlock {
  id: string;
  name: string;
  type: string;
  description: string;
  mastery_level: number;
  practice_count: number;
  status: string;
  concepts: KnowledgeConcept[];
}

interface KnowledgeConcept {
  id: string;
  name: string;
  type: string;
  description: string;
  mastery_level: number;
  practice_count: number;
  status: string;
  confidence: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    CardComponent, 
    CardBodyComponent, 
    CardHeaderComponent,
    ProgressComponent, 
    ProgressBarComponent,
    BadgeComponent,
    TableModule,
    ModalModule, 
    ModalComponent, 
    ModalHeaderComponent, 
    ModalBodyComponent, 
    ModalFooterComponent,
    BaseChartDirective
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('knowledgeGraphContainer', { static: false }) knowledgeGraphContainer!: ElementRef;
  @ViewChild('progressChart', { static: false }) progressChart!: ElementRef;

  // 數據屬性
  analysisData: LearningAnalysisData | null = null;
  loading = false;
  error: string | null = null;
  
  // 控制屬性
  selectedDomain = 'all';
  focusWeaknesses = true;
  graphViewType = 'hierarchical';
  
  // 展開狀態控制
  expandedDomains: { [key: string]: boolean } = {};
  expandedBlocks: { [key: string]: boolean } = {};
  
  // 視圖模式
  viewMode: 'overview' | 'hierarchical' | 'detailed' = 'hierarchical';

  // Modal 控制
  showConceptModal = false;
  showCalendarModal = false;
  conceptAnalysisLoading = false;
  conceptBasicInfoLoading = false;
  conceptAnalysisData: any = null;
  selectedConcept: any = null;
  conceptAnalysis: any = null;
  aiAnalysisResult: any = null;

  // 表單
  calendarForm: FormGroup;

  // D3 相關
  private svg: any;
  private width = 800;
  private height = 600;

  constructor(
    private analyticsService: AnalyticsService,
    private fb: FormBuilder
  ) {
    this.calendarForm = this.fb.group({
      title: ['學習計劃', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: [''],
      learningGoals: [''],
      beforeReminder: [false],
      breakReminder: [false],
      completionReminder: [false]
    });
  }

  ngOnInit(): void {
    this.loadLearningAnalysis();
  }

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  loadLearningAnalysis(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getLearningAnalysis().subscribe({
      next: (response) => {
        if (response.success) {
          this.analysisData = response.data;
          this.initializeCharts();
        } else {
          this.error = response.error || '載入學習分析失敗';
        }
          this.loading = false;
      },
      error: (error) => {
        console.error('載入學習分析失敗:', error);
        this.error = '無法連接到伺服器，請稍後再試';
        this.loading = false;
      }
    });
  }

  initializeCharts(): void {
    if (!this.analysisData) return;

    // 初始化知識圖譜
    this.initializeKnowledgeGraph();
  }

  initializeKnowledgeGraph(): void {
    if (!this.knowledgeGraphContainer || !this.analysisData) return;

    console.log('初始化知識圖譜，數據:', this.analysisData.knowledge_hierarchy);

    // 清除之前的圖表
    d3.select(this.knowledgeGraphContainer.nativeElement).selectAll("*").remove();

    // 檢查是否有層級數據
    if (!this.analysisData.knowledge_hierarchy || this.analysisData.knowledge_hierarchy.length === 0) {
      this.knowledgeGraphContainer.nativeElement.innerHTML = `
        <div class="text-center p-5">
          <i class="cil-brain" style="font-size: 3rem; color: #6c757d;"></i>
          <h5 class="mt-3">暫無知識圖譜數據</h5>
          <p class="text-muted">請先完成一些練習題目以生成知識圖譜</p>
        </div>
      `;
      return;
    }

    // 顯示層級式知識結構
    this.knowledgeGraphContainer.nativeElement.innerHTML = `
      <div class="text-center p-5">
        <i class="cil-brain" style="font-size: 3rem; color: #6c757d;"></i>
        <h5 class="mt-3">知識結構已載入</h5>
        <p class="text-muted">共 ${this.analysisData.knowledge_hierarchy.length} 個領域，${this.analysisData.overview.total_concepts} 個概念</p>
        <p class="text-muted">請使用上方的層級式視圖瀏覽知識點</p>
      </div>
    `;
  }

  initializeProgressChart(): void {
    if (!this.progressChart || !this.analysisData) return;

    // 這裡應該使用 Chart.js 或其他圖表庫
    // 暫時顯示簡單的文本信息
    const canvas = this.progressChart.nativeElement;
    const ctx = canvas.getContext('2d');
    
    // 簡單的進度條
    const progress = this.analysisData.overview.overall_mastery;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#007bff';
    ctx.fillRect(0, 0, width * progress, height);
    
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `學習進度: ${(this.analysisData.overview.overall_mastery * 100).toFixed(1)}%`,
      width / 2,
      height / 2 + 5
    );
  }

  onDomainChange(): void {
    this.loadLearningAnalysis();
  }

  onFocusWeaknessesChange(): void {
    this.loadLearningAnalysis();
  }

  toggleGraphView(viewType: string): void {
    this.graphViewType = viewType;
    this.initializeKnowledgeGraph();
  }

  filterByMastery(): void {
    // 實現按掌握度篩選
    console.log('按掌握度篩選');
  }

  startLearning(step: any): void {
    console.log('開始學習:', step);
    // 實現開始學習邏輯
  }

  viewDetails(step: any): void {
    console.log('查看詳情:', step);
    // 實現查看詳情邏輯
  }

  exportReport(): void {
    if (!this.analysisData) return;

    // 生成報告數據
    const reportData = {
      student_email: this.analysisData.student_email,
      generated_at: this.analysisData.generated_at,
      overview: this.analysisData.overview,
      knowledge_hierarchy: this.analysisData.knowledge_hierarchy,
      learning_path: this.analysisData.learning_path
    };

    // 下載報告
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning_analysis_${this.analysisData.student_email}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }


  getTotalConcepts(domain: KnowledgeDomain): number {
    return domain.blocks.reduce((total, block) => total + block.concepts.length, 0);
  }

  getMasteryClass(masteryLevel: number): string {
    if (masteryLevel >= 0.8) return 'mastered';
    if (masteryLevel >= 0.4) return 'learning';
    return 'struggling';
  }

  getProgressBarClass(masteryLevel: number): string {
    if (masteryLevel >= 0.8) return 'bg-success';
    if (masteryLevel >= 0.4) return 'bg-warning';
    return 'bg-danger';
  }

  // 概念點擊處理
  onConceptClick(concept: any): void {
    console.log('點擊知識點:', concept);
    this.selectedConcept = concept;
    this.conceptAnalysisData = concept;
    this.conceptAnalysis = concept;
    this.showConceptModal = true;
  }

  // 領域展開/收縮
  toggleDomain(domainId: string): void {
    this.expandedDomains[domainId] = !this.expandedDomains[domainId];
    // 如果收縮領域，也收縮其下的所有章節
    if (!this.expandedDomains[domainId]) {
      this.analysisData?.knowledge_hierarchy.forEach(domain => {
        if (domain.id === domainId) {
          domain.blocks.forEach(block => {
            this.expandedBlocks[block.id] = false;
          });
        }
      });
    }
  }

  // 章節展開/收縮
  toggleBlock(blockId: string): void {
    this.expandedBlocks[blockId] = !this.expandedBlocks[blockId];
  }

  // 獲取領域統計
  getDomainStats(domain: any): any {
    const totalConcepts = domain.blocks.reduce((sum: number, block: any) => sum + block.concepts.length, 0);
    const masteredConcepts = domain.blocks.reduce((sum: number, block: any) => 
      sum + block.concepts.filter((c: any) => c.mastery_level >= 0.8).length, 0);
    const learningConcepts = domain.blocks.reduce((sum: number, block: any) => 
      sum + block.concepts.filter((c: any) => c.mastery_level >= 0.4 && c.mastery_level < 0.8).length, 0);
    const strugglingConcepts = domain.blocks.reduce((sum: number, block: any) => 
      sum + block.concepts.filter((c: any) => c.mastery_level < 0.4).length, 0);
    
    return {
      totalConcepts,
      masteredConcepts,
      learningConcepts,
      strugglingConcepts,
      masteryPercentage: totalConcepts > 0 ? (masteredConcepts / totalConcepts) * 100 : 0
    };
  }

  // 獲取章節統計
  getBlockStats(block: any): any {
    const totalConcepts = block.concepts.length;
    const masteredConcepts = block.concepts.filter((c: any) => c.mastery_level >= 0.8).length;
    const learningConcepts = block.concepts.filter((c: any) => c.mastery_level >= 0.4 && c.mastery_level < 0.8).length;
    const strugglingConcepts = block.concepts.filter((c: any) => c.mastery_level < 0.4).length;
    
    return {
      totalConcepts,
      masteredConcepts,
      learningConcepts,
      strugglingConcepts,
      masteryPercentage: totalConcepts > 0 ? (masteredConcepts / totalConcepts) * 100 : 0
    };
  }

  // 獲取整體統計
  getOverallStats(): any {
    if (!this.analysisData?.knowledge_hierarchy) {
      return {
        totalConcepts: 0,
        masteredConcepts: 0,
        learningConcepts: 0,
        strugglingConcepts: 0,
        overallMastery: 0
      };
    }

    let totalConcepts = 0;
    let masteredConcepts = 0;
    let learningConcepts = 0;
    let strugglingConcepts = 0;

    this.analysisData.knowledge_hierarchy.forEach(domain => {
      domain.blocks.forEach(block => {
        block.concepts.forEach(concept => {
          totalConcepts++;
          if (concept.mastery_level >= 0.8) {
            masteredConcepts++;
          } else if (concept.mastery_level >= 0.4) {
            learningConcepts++;
          } else {
            strugglingConcepts++;
          }
        });
      });
    });

    return {
      totalConcepts,
      masteredConcepts,
      learningConcepts,
      strugglingConcepts,
      overallMastery: totalConcepts > 0 ? (masteredConcepts / totalConcepts) * 100 : 0
    };
  }

  // 獲取學習狀況摘要訊息
  getSummaryMessage(): string {
    const stats = this.getOverallStats();
    const mastery = stats.overallMastery;
    const weaknesses = stats.strugglingConcepts;
    
    if (mastery >= 80) {
      return `你的整體掌握度 ${mastery.toFixed(0)}%，表現優秀！`;
    } else if (mastery >= 60) {
      return `你的整體掌握度 ${mastery.toFixed(0)}%，還有 ${weaknesses} 個知識點需要加強。`;
    } else {
      return `你的整體掌握度 ${mastery.toFixed(0)}%，建議優先加強 ${weaknesses} 個弱點知識點。`;
    }
  }

  // 獲取學習時間
  getStudyTime(): string {
    // 從後端數據中獲取學習時間，如果沒有則使用默認值
    const totalTime = 0; // 暫時使用默認值，等後端提供 total_time 字段
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} 小時 ${minutes} 分鐘`;
    } else {
      return `${minutes} 分鐘`;
    }
  }

  // 獲取 Top 3 弱點知識點（顯示大知識點：領域或章節）
  getTopWeaknesses(): any[] {
    if (!this.analysisData?.knowledge_hierarchy) return [];
    
    const weakAreas: any[] = [];
    
    // 收集所有領域和章節的弱點
    this.analysisData.knowledge_hierarchy.forEach(domain => {
      const domainStats = this.getDomainStats(domain);
      
      // 如果領域整體掌握度低於 80%，加入弱點列表
      if (domainStats.masteryPercentage < 80) {
        weakAreas.push({
          id: domain.id,
          name: domain.name,
          description: domain.description,
          mastery_level: domainStats.masteryPercentage / 100, // 轉換為 0-1 範圍
          practice_count: domainStats.totalConcepts, // 使用概念總數作為練習次數
          type: 'domain',
          domain_name: domain.name,
          block_name: null
        });
      }
      
      // 檢查該領域下的章節
      domain.blocks.forEach(block => {
        const blockStats = this.getBlockStats(block);
        
        // 如果章節掌握度低於 80%，加入弱點列表
        if (blockStats.masteryPercentage < 80) {
          weakAreas.push({
            id: block.id,
            name: block.name,
            description: block.description,
            mastery_level: blockStats.masteryPercentage / 100, // 轉換為 0-1 範圍
            practice_count: blockStats.totalConcepts, // 使用概念總數作為練習次數
            type: 'block',
            domain_name: domain.name,
            block_name: block.name
          });
        }
      });
    });
    
    // 按掌握度排序，取最弱的 3 個大知識點
    return weakAreas
      .sort((a, b) => a.mastery_level - b.mastery_level)
      .slice(0, 3);
  }

  // 獲取學習路徑（基於大知識點）
  getLearningPath(): any[] {
    const weaknesses = this.getTopWeaknesses();
    
    return [
      {
        title: `複習 ${weaknesses[0]?.name || '最弱領域'}`,
        description: `先掌握 ${weaknesses[0]?.type === 'domain' ? '該領域' : '該章節'}的基礎概念，掌握度目標 80%`,
        questions: ['Q12', 'Q15', 'Q20'],
        completed: false,
        current: true,
        type: weaknesses[0]?.type || 'domain'
      },
      {
        title: `練習 ${weaknesses[1]?.name || '次弱領域'}`,
        description: `鞏固理解，建立知識連結`,
        questions: ['Q25', 'Q30', 'Q35'],
        completed: false,
        current: false,
        type: weaknesses[1]?.type || 'domain'
      },
      {
        title: `挑戰 ${weaknesses[2]?.name || '第三弱領域'}`,
        description: `綜合應用，提升熟練度`,
        questions: ['Q40', 'Q45', 'Q50'],
        completed: false,
        current: false,
        type: weaknesses[2]?.type || 'domain'
      }
    ];
  }

  // 開始練習
  startPractice(step: any): void {
    console.log('開始練習:', step);
    // 這裡可以導航到練習頁面或打開練習 Modal
    alert(`開始練習 ${step.title}，推薦題目：${step.questions.join(', ')}`);
  }

  // 獲取錯題數量
  getWrongAnswerCount(concept: any): number {
    if (!concept.practice_count || !concept.mastery_level) {
      return 0;
    }
    const correctCount = Math.round(concept.mastery_level * concept.practice_count);
    return concept.practice_count - correctCount;
  }

  // 獲取學習階段
  getLearningStage(): string {
    const stats = this.getOverallStats();
    const mastery = stats.overallMastery;
    
    if (mastery >= 80) return '進階提升';
    if (mastery >= 60) return '鞏固加強';
    if (mastery >= 40) return '基礎補強';
    return '基礎補強';
  }

  // 獲取進度條變體
  getProgressVariant(value: number): string {
    if (value >= 80) return 'success';
    if (value >= 60) return 'warning';
    return 'danger';
  }

  // 獲取掌握度徽章顏色
  getMasteryBadgeColor(masteryLevel: number): string {
    if (masteryLevel >= 0.8) return 'success';
    if (masteryLevel >= 0.4) return 'warning';
    return 'danger';
  }

  // 獲取弱點圖表數據
  getWeaknessChartData(): any {
    const weaknesses = this.getTopWeaknesses();
    
    return {
      labels: weaknesses.map(w => w.name),
      datasets: [{
        label: '掌握度 (%)',
        data: weaknesses.map(w => w.mastery_level * 100),
        backgroundColor: weaknesses.map(w => {
          const level = w.mastery_level * 100;
          if (level >= 75) return '#28a745';
          if (level >= 50) return '#ffc107';
          return '#dc3545';
        }),
        borderColor: weaknesses.map(w => {
          const level = w.mastery_level * 100;
          if (level >= 75) return '#1e7e34';
          if (level >= 50) return '#e0a800';
          return '#bd2130';
        }),
        borderWidth: 1
      }]
    };
  }

  // 圖表選項
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category'
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // 獲取推薦題目
  getRecommendedQuestions(): any[] {
    const weaknesses = this.getTopWeaknesses();
    
    return [
      {
        category: '基礎練習',
        questions: ['Q12', 'Q15', 'Q20', 'Q25']
      },
      {
        category: '進階挑戰',
        questions: ['Q30', 'Q35', 'Q40', 'Q45']
      },
      {
        category: '綜合應用',
        questions: ['Q50', 'Q55', 'Q60']
      }
    ];
  }

  // 打開概念詳情 Modal
  openConceptDetailModal(concept: any): void {
    this.selectedConcept = concept;
    this.conceptAnalysis = concept;
    this.showConceptModal = true;
    this.conceptBasicInfoLoading = false;
  }

  // 關閉概念詳情 Modal
  closeConceptModal(): void {
    this.showConceptModal = false;
    this.selectedConcept = null;
    this.conceptAnalysis = null;
    this.aiAnalysisResult = null;
  }

  // 關閉行事曆 Modal
  closeCalendarModal(): void {
    this.showCalendarModal = false;
  }

  // 觸發 AI 分析
  triggerAIAnalysis(): void {
    if (!this.selectedConcept) return;
    
    this.conceptAnalysisLoading = true;
    
    // 模擬 AI 分析
    setTimeout(() => {
      this.aiAnalysisResult = {
        mastery_analysis: `根據您的練習記錄，${this.selectedConcept.name} 的掌握度為 ${(this.selectedConcept.mastery_level * 100).toFixed(1)}%。建議重點加強基礎概念的理解。`,
        weakness_diagnosis: `主要弱點在於概念應用和綜合分析能力。建議多做相關練習題目。`,
        learning_suggestions: `1. 先複習基礎理論\n2. 多做練習題\n3. 尋求老師指導\n4. 與同學討論`,
        recommended_resources: `推薦教材：相關章節、線上課程、練習題庫`
      };
      this.conceptAnalysisLoading = false;
    }, 2000);
  }

  // 其他方法...
  getErrorRateClass(errorRate: number): string {
    if (errorRate >= 0.5) return 'text-danger';
    if (errorRate >= 0.2) return 'text-warning';
    return 'text-success';
  }

  // 獲取練習題數進度條寬度
  getPracticeProgressWidth(): number {
    if (!this.analysisData?.overview?.total_practice_count) {
      return 0;
    }
    const practiceCount = this.analysisData.overview.total_practice_count;
    return Math.min((practiceCount / 100) * 100, 100);
  }

  // 打開加入學習計劃 Modal
  openAddToCalendarModal(): void {
    // 設置預設時間（明天上午9點開始）
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    const endTime = new Date(tomorrow);
    endTime.setHours(11, 0, 0, 0);

    this.calendarForm.patchValue({
      startTime: tomorrow.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16)
    });

    this.showCalendarModal = true;
  }

  // 加入學習計劃
  addToCalendar(): void {
    if (this.calendarForm.invalid) return;

    const formData = this.calendarForm.value;
    const calendarData = {
      title: formData.title,
      start_time: formData.startTime,
      end_time: formData.endTime,
      description: formData.description,
      learning_goals: formData.learningGoals,
      reminder: {
        enabled: formData.completionReminder,
        before: formData.beforeReminder,
        break: formData.breakReminder,
        completion: formData.completionReminder
      }
    };
    
    this.analyticsService.addToCalendar(calendarData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('學習計劃已加入行事曆！');
          // 關閉 Modal
          this.showCalendarModal = false;
        } else {
          alert('加入學習計劃失敗: ' + response.error);
        }
      },
      error: (error) => {
        console.error('加入學習計劃失敗:', error);
        alert('加入學習計劃失敗，請稍後再試');
        }
      });
    }

  // 保存到行事曆（參考 dashboard 實現）
  saveToCalendar(): void {
    if (this.calendarForm.invalid) {
      alert('請填寫所有必填欄位');
      return;
    }

    const formData = this.calendarForm.value;
    
    // 構建行事曆數據
    const calendarEvent = {
      title: formData.title,
      start: new Date(formData.startTime),
      end: new Date(formData.endTime),
      description: formData.description,
      learning_goals: formData.learningGoals,
      reminders: {
        before: formData.beforeReminder,
        break: formData.breakReminder,
        completion: formData.completionReminder
      },
      concept_name: this.selectedConcept?.name || '學習計劃',
      type: 'learning_plan'
    };

    // 這裡可以調用你的行事曆服務
    console.log('保存到行事曆:', calendarEvent);
    
    // 模擬保存成功
    alert('學習計劃已保存到行事曆！');
    this.showCalendarModal = false;
    
    // 重置表單
    this.calendarForm.reset({
      title: '學習計劃',
      description: '',
      learningGoals: '',
      beforeReminder: false,
      breakReminder: false,
      completionReminder: false
    });
  }
}