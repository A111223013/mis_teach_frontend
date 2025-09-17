import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModule } from '@coreui/angular';
import { AnalyticsService } from '../../../service/analytics.service';
import * as d3 from 'd3';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule],
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
  
  // 層級式顯示控制
  expandedDomains: { [key: string]: boolean } = {};
  expandedBlocks: { [key: string]: boolean } = {};

  // 控制屬性
  selectedDomain = 'all';
  focusWeaknesses = true;
  graphViewType = 'hierarchical';

  // Modal 控制
  showConceptModal = false;
  showCalendarModal = false;
  conceptAnalysisLoading = false;
  conceptAnalysisData: any = null;

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

  // 層級式顯示方法
  toggleDomain(domainId: string): void {
    this.expandedDomains[domainId] = !this.expandedDomains[domainId];
  }

  toggleBlock(blockId: string): void {
    this.expandedBlocks[blockId] = !this.expandedBlocks[blockId];
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
    this.conceptAnalysisData = concept;
    this.showConceptModal = true;
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
      reminder: {
        enabled: formData.completionReminder,
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
}
