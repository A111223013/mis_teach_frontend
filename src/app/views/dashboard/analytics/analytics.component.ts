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
import { cilChart, cilInfo, cilBook, cilCog } from '@coreui/icons';
import { 
  LearningAnalyticsService, 
  StudentMasteryData, 
  KnowledgeGraph
} from '../../../service/learning-analytics.service';
import { Subscription } from 'rxjs';
import { Network, DataSet } from 'vis-network/standalone';

// 知識圖譜節點介面
interface KnowledgeNode {
  id: string;
  label: string;
  mastery_score: number;
  type: 'domain' | 'block' | 'micro_concept';
  color: string;
  size: number;
  weakness_level: 'none' | 'low' | 'medium' | 'high';
  block_id?: string;
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
    ModalModule,
    IconModule
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy, AfterViewInit {
  // vis-network 容器引用
  @ViewChild('knowledgeGraphContainer') knowledgeGraphContainer!: ElementRef<HTMLDivElement>;

  // 數據
  analyticsData: StudentMasteryData | null = null;
  knowledgeGraph: KnowledgeGraph | null = null;

  // 狀態
  loading = false;
  error: string | null = null;
  showNodeDetail = false;
  selectedNode: KnowledgeNode | null = null;

  // 知識圖譜數據
  knowledgeNodes: KnowledgeNode[] = [];

  // vis-network 實例
  private network: Network | null = null;

  // 訂閱管理
  private subscriptions: Subscription[] = [];

  // 預設學生郵箱
  private studentEmail = 'student@example.com';

  constructor(
    private analyticsService: LearningAnalyticsService,
    private iconSetService: IconSetService
  ) {
    // 設置圖標
    this.iconSetService.icons = {
      cilChart,
      cilInfo,
      cilBook,
      cilCog
    };
  }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  ngAfterViewInit(): void {
    // 如果數據已經載入，直接渲染
    if (this.knowledgeGraph && this.knowledgeNodes.length > 0) {
      this.renderKnowledgeGraph();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // 銷毀 vis-network 實例
    if (this.network) {
      this.network.destroy();
      this.network = null;
    }
  }

  /**
   * 載入學習分析數據
   */
  loadAnalyticsData(): void {
    console.log('開始載入學習分析數據...');
    this.loading = true;
    this.error = null;

    const sub = this.analyticsService.getStudentMastery(this.studentEmail).subscribe({
      next: (response) => {
        console.log('API響應成功:', response);
        if (response.success) {
          this.analyticsData = response.data;
          this.knowledgeGraph = response.data.knowledge_graph;
          
          console.log('數據載入成功:', this.analyticsData);
          
          // 生成知識圖譜數據
          this.generateKnowledgeGraphData();
          
          // 設置loading為false
          this.loading = false;
          
          // 等待DOM更新後渲染
          setTimeout(() => {
            this.renderKnowledgeGraph();
          }, 100);
          
        } else {
          console.error('API響應失敗:', response);
          this.error = '數據載入失敗';
          this.loading = false;
        }
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
   * 生成知識圖譜數據
   */
  private generateKnowledgeGraphData(): void {
    console.log('開始生成知識圖譜數據...');
    
    if (!this.knowledgeGraph) {
      console.error('knowledgeGraph為空，無法生成數據');
      return;
    }

    if (!this.knowledgeGraph.nodes || this.knowledgeGraph.nodes.length === 0) {
      console.error('knowledgeGraph.nodes為空，無法生成數據');
      return;
    }

    console.log('節點數量:', this.knowledgeGraph.nodes.length);

    // 轉換節點數據
    this.knowledgeNodes = this.knowledgeGraph.nodes.map((node, index) => {
      // 檢查節點是否有掌握度數據
      if (typeof node.mastery_score !== 'number') {
        console.warn(`節點 ${node.id} 缺少掌握度數據:`, node.mastery_score);
        node.mastery_score = 50; // 預設中等掌握度
      }
      
      // 根據掌握度判定弱點等級
      let weaknessLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
      if (node.mastery_score < 30) weaknessLevel = 'high';
      else if (node.mastery_score < 45) weaknessLevel = 'medium';
      else if (node.mastery_score < 60) weaknessLevel = 'low';

      return {
        id: node.id,
        label: node.label,
        mastery_score: node.mastery_score,
        type: node.type as 'domain' | 'block' | 'micro_concept',
        color: this.getColorByMastery(node.mastery_score),
        size: node.type === 'domain' ? 50 : node.type === 'block' ? 35 : 25,
        weakness_level: weaknessLevel,
        block_id: (node as any).block_id
      };
    });

    console.log('生成的知識節點:', this.knowledgeNodes);
    console.log('知識圖譜數據生成完成');
  }

  /**
   * 渲染知識圖譜
   */
  private renderKnowledgeGraph(): void {
    console.log('開始渲染知識圖譜...');
    
    // 檢查容器是否準備好
    if (!this.knowledgeGraphContainer?.nativeElement) {
      console.error('知識圖譜容器未準備好');
      return;
    }

    if (!this.knowledgeNodes || this.knowledgeNodes.length === 0) {
      console.error('沒有知識節點數據，無法渲染知識圖譜');
      return;
    }

    try {
      // 使用 vis-network 渲染
      this.renderVisNetwork();
    } catch (error) {
      console.error('vis-network 渲染失敗，使用備用方法:', error);
      this.renderSimpleGraph();
    }
  }

  /**
   * 使用 vis-network 渲染知識圖譜
   */
  private renderVisNetwork(): void {
    console.log('使用 vis-network 渲染知識圖譜...');
    
    const container = this.knowledgeGraphContainer.nativeElement;
    container.innerHTML = ''; // 清空容器

    // 準備 vis-network 節點數據
    const nodes = new DataSet([
      ...this.knowledgeNodes.map(node => ({
        id: node.id,
        label: node.label,
        title: `${node.label}\n掌握度: ${node.mastery_score}%\n類型: ${this.getNodeTypeText(node.type)}`,
        size: node.size,
        color: {
          background: node.color,
          border: this.getBorderColor(node.weakness_level),
          highlight: {
            background: node.color,
            border: '#007bff'
          }
        },
        font: {
          size: 12,
          color: '#ffffff',
          face: 'Arial'
        },
        shape: 'circle',
        borderWidth: node.weakness_level !== 'none' ? 4 : 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 10,
          x: 2,
          y: 2
        }
      }))
    ]);

    // 準備 vis-network 邊（連線）數據
    const edges = new DataSet([
      ...this.knowledgeGraph!.edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        from: edge.source,
        to: edge.target,
        color: {
          color: '#dee2e6',
          highlight: '#007bff',
          hover: '#007bff'
        },
        width: 2,
        smooth: {
          enabled: true,
          type: 'curvedCW',
          roundness: 0.2
        },
        arrows: {
          to: {
            enabled: false
          }
        }
      }))
    ]);

    // 配置選項
    const options = {
      nodes: {
        shape: 'circle',
        font: {
          size: 12,
          face: 'Arial'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        color: '#dee2e6',
        width: 2,
        smooth: {
          enabled: true,
          type: 'curvedCW',
          roundness: 0.2
        }
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4,
          avoidOverlap: 0.5
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: false
        }
      }
    };

    // 創建網路實例
    this.network = new Network(container, { nodes, edges }, options);

    // 添加事件監聽器
    this.network.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const clickedNode = this.knowledgeNodes.find(n => n.id === nodeId);
        if (clickedNode) {
          this.handleNodeClick(clickedNode);
        }
      }
    });

    // 添加雙擊事件（重置視圖）
    this.network.on('doubleClick', () => {
      this.network!.fit();
    });

    console.log('vis-network 知識圖譜渲染完成');
  }

  /**
   * 簡單的備用渲染方法
   */
  private renderSimpleGraph(): void {
    const container = this.knowledgeGraphContainer.nativeElement;
    container.innerHTML = ''; // 清空容器

    // 創建節點元素
    this.knowledgeNodes.forEach((node, index) => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'knowledge-node';
      nodeElement.id = `node-${node.id}`;
      
      // 設置節點樣式
      nodeElement.style.cssText = `
        position: absolute;
        width: ${node.size * 2}px;
        height: ${node.size * 2}px;
        border-radius: 50%;
        background-color: ${node.color};
        border: 3px solid ${this.getBorderColor(node.weakness_level)};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        color: white;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 10;
      `;
      
      // 設置節點位置（簡單的網格佈局）
      const row = Math.floor(index / 4);
      const col = index % 4;
      const x = 100 + col * 200;
      const y = 100 + row * 150;
      
      nodeElement.style.left = `${x}px`;
      nodeElement.style.top = `${y}px`;
      
      // 節點標籤
      nodeElement.textContent = node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label;
      nodeElement.title = node.label; // 完整標籤作為提示
      
      // 添加點擊事件
      nodeElement.addEventListener('click', () => {
        this.handleNodeClick(node);
      });
      
      // 添加懸停效果
      nodeElement.addEventListener('mouseenter', () => {
        nodeElement.style.transform = 'scale(1.1)';
        nodeElement.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      });
      
      nodeElement.addEventListener('mouseleave', () => {
        nodeElement.style.transform = 'scale(1)';
        nodeElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      });
      
      container.appendChild(nodeElement);
    });

    console.log('簡單知識圖譜渲染完成');
  }

  /**
   * 處理節點點擊事件
   */
  private handleNodeClick(node: KnowledgeNode): void {
    console.log('點擊節點:', node);
    this.selectedNode = node;
    this.showNodeDetail = true;
  }

  /**
   * 獲取邊框顏色
   */
  private getBorderColor(weaknessLevel: string): string {
    switch (weaknessLevel) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#ffc107';
      default: return '#fff';
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
   * 獲取掌握率文字
   */
  getMasteryText(masteryRate: number): string {
    if (masteryRate >= 80) return '優秀';
    if (masteryRate >= 60) return '良好';
    if (masteryRate >= 40) return '一般';
    return '需加強';
  }

  /**
   * 根據掌握率獲取節點顏色
   */
  private getColorByMastery(masteryScore: number): string {
    if (masteryScore >= 80) return '#28a745'; // 綠色
    if (masteryScore >= 60) return '#ffc107'; // 黃色
    if (masteryScore >= 40) return '#fd7e14'; // 橙色
    return '#dc3545'; // 紅色
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

  /**
   * 獲取掌握度圓環圖背景
   */
  getMasteryCircleBackground(masteryScore: number): string {
    if (masteryScore >= 80) {
      return 'conic-gradient(#28a745 0deg, #28a745 ' + (masteryScore * 3.6) + 'deg, #e9ecef ' + (masteryScore * 3.6) + 'deg, #e9ecef 360deg)';
    } else if (masteryScore >= 60) {
      return 'conic-gradient(#ffc107 0deg, #ffc107 ' + (masteryScore * 3.6) + 'deg, #e9ecef ' + (masteryScore * 3.6) + 'deg, #e9ecef 360deg)';
    } else if (masteryScore >= 40) {
      return 'conic-gradient(#fd7e14 0deg, #fd7e14 ' + (masteryScore * 3.6) + 'deg, #e9ecef ' + (masteryScore * 3.6) + 'deg, #e9ecef 360deg)';
    } else {
      return 'conic-gradient(#dc3545 0deg, #dc3545 ' + (masteryScore * 3.6) + 'deg, #e9ecef ' + (masteryScore * 3.6) + 'deg, #e9ecef 360deg)';
    }
  }

  /**
   * 獲取節點類型顏色
   */
  getNodeTypeColor(type: string): string {
    switch (type) {
      case 'domain': return 'primary';
      case 'block': return 'info';
      case 'micro_concept': return 'success';
      default: return 'secondary';
    }
  }

  /**
   * 獲取節點類型文字
   */
  getNodeTypeText(type: string): string {
    switch (type) {
      case 'domain': return '大知識點';
      case 'block': return '章節';
      case 'micro_concept': return '小知識點';
      default: return '未知';
    }
  }

  /**
   * 獲取節點依存關係
   */
  getNodeDependencies(node: KnowledgeNode): Array<{type: string, name: string, mastery_score: number}> {
    if (!this.knowledgeGraph || !this.knowledgeGraph.nodes) return [];

    const dependencies: Array<{type: string, name: string, mastery_score: number}> = [];

    // 查找上游依存（依賴此節點的知識點）
    this.knowledgeGraph.nodes.forEach(n => {
      if (n.type === 'micro_concept' && (n as any).depends_on && (n as any).depends_on.includes(node.id)) {
        dependencies.push({
          type: '下游依存',
          name: n.label,
          mastery_score: n.mastery_score
        });
      }
    });

    // 查找下游依存（此節點依賴的知識點）
    if (node.type === 'micro_concept' && (node as any).depends_on) {
      (node as any).depends_on.forEach((depId: string) => {
        const depNode = this.knowledgeGraph!.nodes.find(n => n.id === depId);
        if (depNode) {
          dependencies.push({
            type: '上游依存',
            name: depNode.label,
            mastery_score: depNode.mastery_score
          });
        }
      });
    }

    return dependencies;
  }

  /**
   * 獲取學習建議
   */
  getLearningSuggestions(node: KnowledgeNode): string[] {
    const suggestions: string[] = [];

    if (node.mastery_score < 60) {
      suggestions.push(`建議加強「${node.label}」的基礎概念理解`);
      
      // 檢查依存關係
      const dependencies = this.getNodeDependencies(node);
      const upstreamDeps = dependencies.filter(d => d.type === '上游依存' && d.mastery_score < 60);
      
      if (upstreamDeps.length > 0) {
        suggestions.push(`建議先複習「${upstreamDeps[0].name}」，掌握度僅${upstreamDeps[0].mastery_score}%`);
      }
      
      suggestions.push(`建議多做相關練習題，目標掌握度80%以上`);
    } else if (node.mastery_score < 80) {
      suggestions.push(`「${node.label}」掌握度良好，建議通過實作加深理解`);
      suggestions.push(`可以嘗試更具挑戰性的題目`);
    } else {
      suggestions.push(`「${node.label}」掌握度優秀，可以幫助其他同學學習`);
      suggestions.push(`建議學習更高階的相關概念`);
    }

    return suggestions;
  }

  /**
   * 獲取相關題目
   */
  getRelatedQuestions(node: KnowledgeNode): Array<{text: string, isCorrect: boolean, difficulty: string, answerTime: number}> {
    // 模擬相關題目數據
    const mockQuestions = [
      {
        text: `關於「${node.label}」的基礎概念問題`,
        isCorrect: node.mastery_score > 70,
        difficulty: '中等',
        answerTime: Math.floor(Math.random() * 60) + 30
      },
      {
        text: `「${node.label}」的應用實例分析`,
        isCorrect: node.mastery_score > 60,
        difficulty: '困難',
        answerTime: Math.floor(Math.random() * 60) + 45
      },
      {
        text: `「${node.label}」與其他概念的關聯性`,
        isCorrect: node.mastery_score > 50,
        difficulty: '簡單',
        answerTime: Math.floor(Math.random() * 60) + 20
      }
    ];

    return mockQuestions;
  }

  /**
   * 獲取主要練習建議
   */
  getMainPracticeSuggestion(node: KnowledgeNode): string {
    if (node.mastery_score < 60) {
      return `您的「${node.label}」掌握度為${node.mastery_score}%，建議從基礎概念開始，逐步加強練習。建議每天練習15-20分鐘，重點關注基礎題型。`;
    } else if (node.mastery_score < 80) {
      return `您的「${node.label}」掌握度為${node.mastery_score}%，基礎紮實，建議多做應用題和綜合題，提升實戰能力。`;
    } else {
      return `您的「${node.label}」掌握度為${node.mastery_score}%，表現優秀！建議挑戰更高難度的題目，或幫助其他同學學習。`;
    }
  }
}
