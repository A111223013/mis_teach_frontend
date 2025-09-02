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
        size: node.type === 'domain' ? 80 : node.type === 'block' ? 50 : 30,
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
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.05,
          damping: 0.8,
          avoidOverlap: 0.9
        },
        stabilization: {
          enabled: true,
          iterations: 2000,
          updateInterval: 50,
          fit: true
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

    // 找到計算機概論節點（domain類型）
    const centerNode = this.knowledgeNodes.find(n => n.type === 'domain');
    const otherNodes = this.knowledgeNodes.filter(n => n.type !== 'domain');
    
    // 容器尺寸
    const containerWidth = container.offsetWidth || 800;
    const containerHeight = container.offsetHeight || 600;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // 先渲染中心節點（計算機概論）
    if (centerNode) {
      const centerElement = document.createElement('div');
      centerElement.className = 'knowledge-node center-node';
      centerElement.id = `node-${centerNode.id}`;
      
      centerElement.style.cssText = `
        position: absolute;
        width: ${centerNode.size * 2}px;
        height: ${centerNode.size * 2}px;
        border-radius: 50%;
        background-color: ${centerNode.color};
        border: 4px solid #ff8c00;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: white;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        z-index: 20;
        left: ${centerX - centerNode.size}px;
        top: ${centerY - centerNode.size}px;
      `;
      
      centerElement.textContent = centerNode.label;
      centerElement.title = centerNode.label;
      
      centerElement.addEventListener('click', () => {
        this.handleNodeClick(centerNode);
      });
      
      centerElement.addEventListener('mouseenter', () => {
        centerElement.style.transform = 'scale(1.15)';
        centerElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
      });
      
      centerElement.addEventListener('mouseleave', () => {
        centerElement.style.transform = 'scale(1)';
        centerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      });
      
      container.appendChild(centerElement);
    }

    // 渲染其他節點，圍繞中心節點形成發散網狀佈局
    otherNodes.forEach((node, index) => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'knowledge-node';
      nodeElement.id = `node-${node.id}`;
      
      // 計算發散佈局位置 - 使用極座標系統
      const angle = (index / otherNodes.length) * 2 * Math.PI;
      const radius = 250; // 發散半徑
      const x = centerX + Math.cos(angle) * radius - node.size;
      const y = centerY + Math.sin(angle) * radius - node.size;
      
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
        font-size: ${node.type === 'block' ? 12 : 10}px;
        font-weight: bold;
        color: white;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 10;
        left: ${x}px;
        top: ${y}px;
      `;
      
      // 節點標籤
      nodeElement.textContent = node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label;
      nodeElement.title = node.label;
      
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
    if (masteryScore >= 80) return '#28a745'; // 綠色 - 優秀
    if (masteryScore >= 60) return '#ffc107'; // 黃色 - 良好
    return '#dc3545'; // 紅色 - 需加強
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
}
