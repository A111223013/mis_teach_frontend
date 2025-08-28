import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { 
  CardModule, 
  GridModule, 
  ProgressModule, 
  BadgeModule,
  ButtonModule,
  AlertModule,
  SpinnerModule,
  ModalModule
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilChart, cilSpeedometer, cilTag, cilWarning, cilInfo } from '@coreui/icons';
import { LearningAnalyticsService, LearningAnalyticsData, LearningOverview, ConceptMastery, TopicMastery, KnowledgeGraph, WeaknessAnalysis } from '../../../service/learning-analytics.service';
import { Subscription } from 'rxjs';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// 註冊Chart.js控制器
Chart.register(...registerables);

// 弱點診斷介面
interface WeaknessDiagnosis {
  concept: string;
  mastery_rate: number;
  weakness_score: number;
  priority: 'high' | 'medium' | 'low';
  error_count: number;
  total_count: number;
  difficulty_weight: number;
  suggestions: string[];
  related_questions: number[];
}

// 知識圖譜節點介面
interface KnowledgeNode {
  id: string;
  label: string;
  mastery_rate: number;
  type: 'topic' | 'concept';
  color: string;
  size: number;
  weakness_level: 'none' | 'low' | 'medium' | 'high';
  x?: number;
  y?: number;
}

// 知識圖譜連線介面
interface KnowledgeLink {
  source: string;
  target: string;
  type: string;
  strength: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CardModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    ButtonModule,
    AlertModule,
    SpinnerModule,
    IconModule,
    ModalModule
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  // 圖表引用
  @ViewChild('weaknessRadarChart') weaknessRadarChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('knowledgeGraphCanvas') knowledgeGraphCanvas!: ElementRef<HTMLCanvasElement>;

  // 數據
  analyticsData: LearningAnalyticsData | null = null;
  overview: LearningOverview | null = null;
  conceptMastery: ConceptMastery | null = null;
  topicMastery: TopicMastery | null = null;
  knowledgeGraph: KnowledgeGraph | null = null;
  weaknessesAnalysis: WeaknessAnalysis | null = null;

  // 弱點診斷數據
  weaknessDiagnoses: WeaknessDiagnosis[] = [];
  highPriorityWeaknesses: WeaknessDiagnosis[] = [];
  mediumPriorityWeaknesses: WeaknessDiagnosis[] = [];
  lowPriorityWeaknesses: WeaknessDiagnosis[] = [];

  // 狀態
  loading = false;
  error: string | null = null;
  showNodeDetail = false;
  selectedNode: KnowledgeNode | null = null;

  // 圖表實例
  charts: { [key: string]: Chart } = {};

  // 知識圖譜數據
  knowledgeNodes: KnowledgeNode[] = [];
  knowledgeLinks: KnowledgeLink[] = [];
  graphContext: CanvasRenderingContext2D | null = null;

  // 訂閱管理
  private subscriptions: Subscription[] = [];

  constructor(
    private analyticsService: LearningAnalyticsService,
    private iconSetService: IconSetService
  ) {
    // 設置圖標
    this.iconSetService.icons = {
      cilChart,
      cilSpeedometer,
      cilTag,
      cilWarning,
      cilInfo
    };
  }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  ngAfterViewInit(): void {
    // 初始化知識圖譜畫布
    this.initKnowledgeGraph();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // 銷毀圖表
    Object.values(this.charts).forEach(chart => chart.destroy());
  }

  /**
   * 載入學習分析數據
   */
  loadAnalyticsData(): void {
    this.loading = true;
    this.error = null;

    const sub = this.analyticsService.getLearningAnalytics().subscribe({
      next: (response) => {
        if (response.success) {
          this.analyticsData = response.data;
          this.overview = response.data.overview;
          this.conceptMastery = response.data.concept_mastery;
          this.topicMastery = response.data.topic_mastery;
          this.knowledgeGraph = response.data.knowledge_graph;
          this.weaknessesAnalysis = response.data.weaknesses_analysis;
          
          console.log('數據載入成功:', this.analyticsData);
          
          // 生成弱點診斷數據
          this.generateWeaknessDiagnoses();
          
          // 等待ViewChild準備好後再生成圖表
          this.waitForViewChildAndGenerateCharts();
        } else {
          this.error = '數據載入失敗';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('載入學習分析數據失敗:', err);
        this.error = '數據載入失敗，請稍後再試';
        this.loading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  /**
   * 生成弱點診斷數據
   */
  private generateWeaknessDiagnoses(): void {
    if (!this.conceptMastery) return;

    this.weaknessDiagnoses = Object.entries(this.conceptMastery).map(([concept, data]) => {
      const errorCount = data.total_questions - data.correct_answers;
      const errorRate = errorCount / data.total_questions;
      
      // 計算弱點分數 (錯誤率 × 難度權重)
      const difficultyWeight = this.getDifficultyWeight(concept);
      const weaknessScore = errorRate * (1 + difficultyWeight * 0.5);
      
      // 判斷優先級
      let priority: 'high' | 'medium' | 'low';
      if (weaknessScore > 0.6) priority = 'high';
      else if (weaknessScore > 0.4) priority = 'medium';
      else priority = 'low';

      // 生成建議
      const suggestions = this.generateSuggestions(concept, data.mastery_rate, priority);

      return {
        concept,
        mastery_rate: data.mastery_rate,
        weakness_score: Math.round(weaknessScore * 100),
        priority,
        error_count: errorCount,
        total_count: data.total_questions,
        difficulty_weight: difficultyWeight,
        suggestions,
        related_questions: this.getRelatedQuestions(concept)
      };
    });

    // 按優先級分類
    this.highPriorityWeaknesses = this.weaknessDiagnoses.filter(w => w.priority === 'high');
    this.mediumPriorityWeaknesses = this.weaknessDiagnoses.filter(w => w.priority === 'medium');
    this.lowPriorityWeaknesses = this.weaknessDiagnoses.filter(w => w.priority === 'low');

    console.log('弱點診斷數據生成完成:', this.weaknessDiagnoses);
  }

  /**
   * 獲取概念難度權重
   */
  private getDifficultyWeight(concept: string): number {
    // 根據概念名稱判斷難度權重
    const highDifficulty = ['資料庫設計', '資料正規化', '網路協定'];
    const mediumDifficulty = ['CPU架構', '指令執行', '暫存器'];
    
    if (highDifficulty.includes(concept)) return 0.8;
    if (mediumDifficulty.includes(concept)) return 0.5;
    return 0.3;
  }

  /**
   * 生成學習建議
   */
  private generateSuggestions(concept: string, masteryRate: number, priority: string): string[] {
    const suggestions: string[] = [];
    
    if (priority === 'high') {
      suggestions.push('重新學習基礎概念');
      suggestions.push('多做相關練習題');
      suggestions.push('尋求老師或同學協助');
    } else if (priority === 'medium') {
      suggestions.push('複習相關教材');
      suggestions.push('練習中等難度題目');
    } else {
      suggestions.push('保持現有水準');
      suggestions.push('可嘗試挑戰性題目');
    }
    
    return suggestions;
  }

  /**
   * 獲取相關題目ID
   */
  private getRelatedQuestions(concept: string): number[] {
    // 這裡可以根據概念返回相關的題目ID
    // 暫時返回隨機題目ID
    return [1, 2, 3, 4, 5].filter(() => Math.random() > 0.5);
  }

  /**
   * 等待ViewChild準備好後生成圖表
   */
  private waitForViewChildAndGenerateCharts(): void {
    const checkViewChild = () => {
      if (this.weaknessRadarChart && this.trendChart) {
        console.log('ViewChild準備完成，開始生成圖表');
        this.generateCharts();
        this.generateKnowledgeGraphData();
        this.renderKnowledgeGraph();
      } else {
        console.log('ViewChild尚未準備完成，等待100ms後重試');
        setTimeout(checkViewChild, 100);
      }
    };
    
    checkViewChild();
  }

  /**
   * 生成所有圖表
   */
  private generateCharts(): void {
    console.log('開始生成圖表...');
    
    // 檢查所有ViewChild是否準備好
    if (!this.weaknessRadarChart?.nativeElement || 
        !this.trendChart?.nativeElement) {
      console.log('ViewChild元素尚未準備好，跳過圖表生成');
      return;
    }
    
    this.createWeaknessRadarChart();
    this.createTrendChart();
    console.log('圖表生成完成');
  }

  /**
   * 創建弱點雷達圖
   */
  private createWeaknessRadarChart(): void {
    if (!this.topicMastery) {
      console.log('缺少主題掌握度數據，無法創建弱點雷達圖');
      return;
    }

    const topics = Object.keys(this.topicMastery);
    const masteryRates = topics.map(topic => this.topicMastery![topic].overall_mastery);

    console.log('創建弱點雷達圖:', topics, masteryRates);

    const ctx = this.weaknessRadarChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('無法獲取弱點雷達圖canvas context');
      return;
    }

    try {
      this.charts['weaknessRadar'] = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: topics,
          datasets: [{
            label: '掌握度 (%)',
            data: masteryRates,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      console.log('弱點雷達圖創建成功');
    } catch (error) {
      console.error('創建弱點雷達圖失敗:', error);
    }
  }

  /**
   * 創建趨勢圖
   */
  private createTrendChart(): void {
    if (!this.conceptMastery) {
      console.log('缺少概念掌握度數據，無法創建趨勢圖');
      return;
    }

    const concepts = Object.keys(this.conceptMastery);
    const masteryRates = concepts.map(concept => this.conceptMastery![concept].mastery_rate);

    console.log('創建趨勢圖:', concepts, masteryRates);

    const ctx = this.trendChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.log('無法獲取趨勢圖canvas context');
      return;
    }

    try {
      this.charts['trend'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: concepts,
          datasets: [{
            label: '掌握度趨勢',
            data: masteryRates,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 3,
            fill: true,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      console.log('趨勢圖創建成功');
    } catch (error) {
      console.error('創建趨勢圖失敗:', error);
    }
  }

  /**
   * 初始化知識圖譜畫布
   */
  private initKnowledgeGraph(): void {
    if (!this.knowledgeGraphCanvas?.nativeElement) {
      console.log('知識圖譜畫布尚未準備好');
      return;
    }
    
    const canvas = this.knowledgeGraphCanvas.nativeElement;
    this.graphContext = canvas.getContext('2d');
    
    if (this.graphContext) {
      // 設置畫布尺寸
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // 添加點擊事件
      canvas.addEventListener('click', (event) => this.handleCanvasClick(event));
    }
  }

  /**
   * 生成知識圖譜數據
   */
  private generateKnowledgeGraphData(): void {
    if (!this.knowledgeGraph) return;

    // 轉換節點數據，加入弱點等級
    this.knowledgeNodes = this.knowledgeGraph.nodes.map(node => {
      const weakness = this.weaknessDiagnoses.find(w => w.concept === node.label);
      let weaknessLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
      
      if (weakness) {
        if (weakness.priority === 'high') weaknessLevel = 'high';
        else if (weakness.priority === 'medium') weaknessLevel = 'medium';
        else if (weakness.priority === 'low') weaknessLevel = 'low';
      }

      return {
        id: node.id,
        label: node.label,
        mastery_rate: node.mastery_rate,
        type: node.type,
        color: node.color,
        size: node.type === 'topic' ? 40 : 25,
        weakness_level: weaknessLevel,
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50
      };
    });

    // 轉換連線數據
    this.knowledgeLinks = this.knowledgeGraph.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      strength: 1
    }));
  }

  /**
   * 渲染知識圖譜
   */
  private renderKnowledgeGraph(): void {
    if (!this.graphContext) return;

    const ctx = this.graphContext;
    const canvas = this.knowledgeGraphCanvas.nativeElement;

    // 清空畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 繪製連線
    this.knowledgeLinks.forEach(link => {
      const sourceNode = this.knowledgeNodes.find(n => n.id === link.source);
      const targetNode = this.knowledgeNodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x!, sourceNode.y!);
        ctx.lineTo(targetNode.x!, targetNode.y!);
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // 繪製節點
    this.knowledgeNodes.forEach(node => {
      // 根據弱點等級調整節點樣式
      let nodeColor = node.color;
      let borderColor = '#fff';
      let borderWidth = 3;
      
      if (node.weakness_level === 'high') {
        borderColor = '#dc3545';
        borderWidth = 5;
      } else if (node.weakness_level === 'medium') {
        borderColor = '#fd7e14';
        borderWidth = 4;
      }

      // 節點圓圈
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // 節點標籤
      ctx.fillStyle = '#495057';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${node.label}`, node.x!, node.y! + node.size + 20);
    });
  }

  /**
   * 處理畫布點擊事件
   */
  private handleCanvasClick(event: MouseEvent): void {
    const canvas = this.knowledgeGraphCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 檢查點擊的節點
    const clickedNode = this.knowledgeNodes.find(node => {
      const distance = Math.sqrt((x - node.x!) ** 2 + (y - node.y!) ** 2);
      return distance <= node.size;
    });

    if (clickedNode) {
      this.selectedNode = clickedNode;
      this.showNodeDetail = true;
    }
  }

  /**
   * 獲取弱點等級顏色
   */
  getWeaknessLevelColor(level: string): string {
    switch (level) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#ffc107';
      default: return '#28a745';
    }
  }

  /**
   * 獲取弱點等級文字
   */
  getWeaknessLevelText(level: string): string {
    switch (level) {
      case 'high': return '高優先級';
      case 'medium': return '中優先級';
      case 'low': return '低優先級';
      default: return '已掌握';
    }
  }

  /**
   * 獲取掌握率顏色
   */
  getMasteryColor(masteryRate: number): string {
    if (masteryRate >= 80) return '#28a745';  // 綠色
    if (masteryRate >= 60) return '#ffc107';  // 黃色
    if (masteryRate >= 40) return '#fd7e14';  // 橙色
    return '#dc3545';  // 紅色
  }

  /**
   * 獲取掌握率文字
   */
  getMasteryText(masteryRate: number): string {
    if (masteryRate >= 80) return '優秀';
    if (masteryRate >= 60) return '良好';
    if (masteryRate >= 40) return '一般';
    return '需加強';
  }

  /**
   * 重新載入數據
   */
  reloadData(): void {
    this.loadAnalyticsData();
  }

  /**
   * 關閉節點詳情
   */
  closeNodeDetail(): void {
    this.showNodeDetail = false;
    this.selectedNode = null;
  }
}
