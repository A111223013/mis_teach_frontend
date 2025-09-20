import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface OverviewData {
  overall_mastery: number;
  domains: DomainData[];
  top_weak_points: WeakPoint[];
  recent_trend: TrendData[];
  total_attempts: number;
  weak_points_count: number;
  recent_activity: number;
  class_ranking?: number;
  recent_improvements?: ImprovementData[];
  needs_attention?: AttentionData[];
  ai_suggestions?: AISuggestion[];
  ai_summary?: {
    title: string;
    content: string;
    confidence: number;
    last_updated: string;
  };
}

export interface DomainData {
  domain_id: string;
  name: string;
  mastery: number;
  concept_count: number;
  weak_count: number;
}

export interface BlockData {
  block_id: string;
  name: string;
  mastery: number;
  micro_count: number;
  weak_count: number;
}

export interface MicroConceptData {
  micro_id: string;
  name: string;
  mastery: number;
  attempts: number;
  correct: number;
  wrong_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence: number;
}

export interface WeakPoint {
  micro_id: string;
  name: string;
  mastery: number;
  attempts: number;
  wrong_count: number;
  reason: string;
  priority: number;
  expanded?: boolean;
  sub_concepts?: SubConcept[];
  error_types?: ErrorType[];
}

export interface TrendData {
  date: string;
  accuracy: number;
  attempts: number;
}

export interface SubConcept {
  name: string;
  mastery: number;
  attempts: number;
  wrong_count: number;
}

export interface ErrorType {
  type: string;
  percentage: number;
  count: number;
}

export interface ImprovementData {
  name: string;
  improvement: number;
  mastery: number;
  priority: 'urgent' | 'maintain' | 'enhance';
  ai_strategy?: string;
}

export interface AttentionData {
  name: string;
  decline: number;
  mastery: number;
  priority: 'urgent' | 'maintain' | 'enhance';
  ai_strategy?: string;
}

export interface AISuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action_text: string;
  type: string;
  target: string;
  basis: string;
}

export interface AIDiagnosis {
  diagnosis: string;
  root_cause: string;
  learning_path: string[];
  practice_questions: PracticeQuestion[];
  evidence: string[];
  confidence: number;
  confidence_score?: {
    history: number;
    pattern: number;
    knowledge: number;
  };
  error_analysis?: ErrorAnalysis[];
  knowledge_relations?: KnowledgeRelation[];
  practice_progress?: {
    completed: number;
    total: number;
  };
}

export interface PracticeQuestion {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  accuracy: number;
  completed: boolean;
}

export interface ErrorAnalysis {
  type: string;
  count: number;
  percentage: number;
}

export interface KnowledgeRelation {
  name: string;
  type: 'weakness' | 'prerequisite' | 'mastered';
  mastery: number;
}

@Injectable({
  providedIn: 'root'
})
export class LearningAnalyticsService {
  private baseUrl = '/analytics/api';
  
  // RxJS Subjects for real-time updates
  private overviewSubject = new BehaviorSubject<OverviewData | null>(null);
  private domainsSubject = new BehaviorSubject<DomainData[]>([]);
  private blocksSubject = new BehaviorSubject<BlockData[]>([]);
  private microConceptsSubject = new BehaviorSubject<MicroConceptData[]>([]);
  private selectedDomainSubject = new BehaviorSubject<DomainData | null>(null);
  private selectedBlockSubject = new BehaviorSubject<BlockData | null>(null);
  private selectedMicroSubject = new BehaviorSubject<MicroConceptData | null>(null);

  // Observables for components to subscribe
  overview$ = this.overviewSubject.asObservable();
  domains$ = this.domainsSubject.asObservable();
  blocks$ = this.blocksSubject.asObservable();
  microConcepts$ = this.microConceptsSubject.asObservable();
  selectedDomain$ = this.selectedDomainSubject.asObservable();
  selectedBlock$ = this.selectedBlockSubject.asObservable();
  selectedMicro$ = this.selectedMicroSubject.asObservable();

  constructor(private http: HttpClient) {}

  // 載入總覽數據
  loadOverview(userId: string): Observable<OverviewData> {
    // 暫時直接使用模擬數據，避免API問題
    console.log('使用模擬數據載入總覽');
    const mockData = this.generateMockOverview();
    this.overviewSubject.next(mockData);
    this.domainsSubject.next(mockData.domains);
    return of(mockData);
    
    // 原始API調用代碼（暫時註釋）
    /*
    return this.http.get<{success: boolean, data?: OverviewData, error?: string}>(`${this.baseUrl}/overview/${userId}`)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            this.overviewSubject.next(response.data);
            this.domainsSubject.next(response.data.domains);
            return response.data;
          } else {
            // 返回模擬數據
            const mockData = this.generateMockOverview();
            this.overviewSubject.next(mockData);
            this.domainsSubject.next(mockData.domains);
            return mockData;
          }
        }),
        catchError((error: any) => {
          console.error('載入總覽失敗:', error);
          const mockData = this.generateMockOverview();
          this.overviewSubject.next(mockData);
          this.domainsSubject.next(mockData.domains);
          return of(mockData);
        })
      );
    */
  }

  // 載入領域知識塊
  loadBlocks(userId: string, domainId: string): Observable<BlockData[]> {
    // 暫時直接使用模擬數據
    console.log('使用模擬數據載入知識塊:', domainId);
    const mockBlocks = this.generateMockBlocks(domainId);
    this.blocksSubject.next(mockBlocks);
    return of(mockBlocks);
  }

  // 載入微知識點
  loadMicroConcepts(userId: string, blockId: string): Observable<MicroConceptData[]> {
    // 暫時直接使用模擬數據
    console.log('使用模擬數據載入微知識點:', blockId);
    const mockConcepts = this.generateMockMicroConcepts(blockId);
    this.microConceptsSubject.next(mockConcepts);
    return of(mockConcepts);
  }

  // 載入微知識點詳情
  loadMicroDetail(userId: string, microId: string): Observable<MicroConceptData> {
    // 暫時直接使用模擬數據
    console.log('使用模擬數據載入微知識點詳情:', microId);
    const mockDetail = this.generateMockMicroDetail(microId);
    this.selectedMicroSubject.next(mockDetail);
    return of(mockDetail);
  }

  // AI診斷
  getAIDiagnosis(userId: string, microId: string): Observable<AIDiagnosis> {
    // 暫時直接使用模擬數據
    console.log('使用模擬數據載入AI診斷:', microId);
    return of(this.generateMockAIDiagnosis());
  }

  // 加入學習計劃
  addToLearningPlan(event: any): Observable<any> {
    // 暫時使用模擬數據
    console.log('模擬加入學習計劃:', event);
    return of({ success: true, message: '已加入學習計劃' });
  }

  // 選擇領域
  selectDomain(domain: DomainData): void {
    this.selectedDomainSubject.next(domain);
    this.selectedBlockSubject.next(null);
    this.selectedMicroSubject.next(null);
    this.blocksSubject.next([]);
    this.microConceptsSubject.next([]);
  }

  // 選擇知識塊
  selectBlock(block: BlockData): void {
    this.selectedBlockSubject.next(block);
    this.selectedMicroSubject.next(null);
    this.microConceptsSubject.next([]);
  }

  // 選擇微知識點
  selectMicro(micro: MicroConceptData): void {
    this.selectedMicroSubject.next(micro);
  }

  // 生成模擬總覽數據
  private generateMockOverview(): OverviewData {
    return {
      overall_mastery: 0.68,
      class_ranking: 5,
      domains: [
        { domain_id: 'D1', name: '演算法基礎', mastery: 0.72, concept_count: 15, weak_count: 3 },
        { domain_id: 'D2', name: '資料結構', mastery: 0.65, concept_count: 12, weak_count: 4 },
        { domain_id: 'D3', name: '程式設計', mastery: 0.58, concept_count: 18, weak_count: 6 },
        { domain_id: 'D4', name: '系統分析', mastery: 0.75, concept_count: 10, weak_count: 2 }
      ],
      top_weak_points: [
        { 
          micro_id: 'M1', 
          name: '二分搜尋法', 
          mastery: 0.25, 
          attempts: 8, 
          wrong_count: 6, 
          reason: '邊界條件理解不足', 
          priority: 0.9,
          expanded: false,
          sub_concepts: [
            { name: '邊界條件處理', mastery: 0.2, attempts: 3, wrong_count: 2 },
            { name: 'mid計算方式', mastery: 0.4, attempts: 2, wrong_count: 1 },
            { name: '終止條件判斷', mastery: 0.3, attempts: 4, wrong_count: 3 }
          ],
          error_types: [
            { type: '邊界錯誤', percentage: 45, count: 3 },
            { type: '邏輯錯誤', percentage: 30, count: 2 },
            { type: '粗心錯誤', percentage: 25, count: 1 }
          ]
        },
        { 
          micro_id: 'M2', 
          name: '動態規劃', 
          mastery: 0.35, 
          attempts: 6, 
          wrong_count: 4, 
          reason: '狀態轉移方程不熟練', 
          priority: 0.8,
          expanded: false,
          sub_concepts: [
            { name: '狀態定義', mastery: 0.3, attempts: 2, wrong_count: 1 },
            { name: '轉移方程', mastery: 0.25, attempts: 3, wrong_count: 2 },
            { name: '初始化', mastery: 0.6, attempts: 1, wrong_count: 1 }
          ],
          error_types: [
            { type: '概念錯誤', percentage: 50, count: 2 },
            { type: '實現錯誤', percentage: 30, count: 1 },
            { type: '優化錯誤', percentage: 20, count: 1 }
          ]
        },
        { 
          micro_id: 'M3', 
          name: '圖的遍歷', 
          mastery: 0.40, 
          attempts: 5, 
          wrong_count: 3, 
          reason: '遞迴概念模糊', 
          priority: 0.7,
          expanded: false,
          sub_concepts: [
            { name: 'DFS遍歷', mastery: 0.2, attempts: 2, wrong_count: 1 },
            { name: 'BFS遍歷', mastery: 0.3, attempts: 2, wrong_count: 1 },
            { name: '圖的表示', mastery: 0.4, attempts: 1, wrong_count: 1 }
          ],
          error_types: [
            { type: '算法理解', percentage: 60, count: 2 },
            { type: '實現細節', percentage: 25, count: 1 },
            { type: '邊界情況', percentage: 15, count: 0 }
          ]
        }
      ],
      recent_improvements: [
        { 
          name: '陣列操作', 
          improvement: 15, 
          mastery: 85, 
          priority: 'maintain',
          ai_strategy: '保持當前練習節奏，每週2-3次複習即可維持水準'
        },
        { 
          name: '迴圈控制', 
          improvement: 12, 
          mastery: 78, 
          priority: 'enhance',
          ai_strategy: '可嘗試更複雜的巢狀迴圈練習，提升程式設計能力'
        },
        { 
          name: '條件判斷', 
          improvement: 8, 
          mastery: 92, 
          priority: 'maintain',
          ai_strategy: '已達高水準，建議偶爾複習保持手感'
        }
      ],
      needs_attention: [
        { 
          name: '遞迴概念', 
          decline: 5, 
          mastery: 45, 
          priority: 'urgent',
          ai_strategy: '立即進行基礎遞迴練習，從簡單的階乘開始建立概念'
        },
        { 
          name: '複雜度分析', 
          decline: 3, 
          mastery: 38, 
          priority: 'urgent',
          ai_strategy: '優先學習時間複雜度分析，這是演算法的核心基礎'
        }
      ],
      ai_suggestions: [
        {
          title: '今日重點練習',
          description: '針對二分搜尋法進行專項練習',
          priority: 'high',
          action_text: '開始練習',
          type: 'practice',
          target: 'M1',
          basis: '基於您的錯誤模式分析'
        },
        {
          title: '學習路徑規劃',
          description: 'AI為您規劃最優學習順序',
          priority: 'medium',
          action_text: '查看路徑',
          type: 'path',
          target: 'learning_path',
          basis: '基於知識點依賴關係'
        },
        {
          title: '知識圖譜分析',
          description: '探索知識點之間的關聯關係',
          priority: 'low',
          action_text: '探索圖譜',
          type: 'review',
          target: 'knowledge_graph',
          basis: '基於您的學習進度'
        }
      ],
      ai_summary: {
        title: 'AI教練分析',
        content: '根據您的學習數據分析，您在演算法基礎方面表現良好，但在二分搜尋和動態規劃方面需要加強。建議優先練習二分搜尋的邊界條件處理，這將為後續學習打下堅實基礎。',
        confidence: 0.85,
        last_updated: '2024-01-21 14:30'
      },
      recent_trend: [
        { date: '2024-01-15', accuracy: 0.65, attempts: 12 },
        { date: '2024-01-16', accuracy: 0.68, attempts: 15 },
        { date: '2024-01-17', accuracy: 0.62, attempts: 10 },
        { date: '2024-01-18', accuracy: 0.70, attempts: 18 },
        { date: '2024-01-19', accuracy: 0.72, attempts: 14 },
        { date: '2024-01-20', accuracy: 0.75, attempts: 16 },
        { date: '2024-01-21', accuracy: 0.68, attempts: 13 }
      ],
      total_attempts: 98,
      weak_points_count: 15,
      recent_activity: 45  // 近7天作答次數
    };
  }

  // 生成模擬知識塊數據
  private generateMockBlocks(domainId: string): BlockData[] {
    const blockMap: { [key: string]: BlockData[] } = {
      'D1': [
        { block_id: 'B1', name: '排序演算法', mastery: 0.80, micro_count: 5, weak_count: 1 },
        { block_id: 'B2', name: '搜尋演算法', mastery: 0.45, micro_count: 4, weak_count: 3 },
        { block_id: 'B3', name: '動態規劃', mastery: 0.35, micro_count: 6, weak_count: 4 }
      ],
      'D2': [
        { block_id: 'B4', name: '線性資料結構', mastery: 0.70, micro_count: 6, weak_count: 2 },
        { block_id: 'B5', name: '樹狀結構', mastery: 0.60, micro_count: 5, weak_count: 3 },
        { block_id: 'B6', name: '圖論', mastery: 0.40, micro_count: 4, weak_count: 3 }
      ],
      'D3': [
        { block_id: 'B7', name: '控制結構', mastery: 0.85, micro_count: 8, weak_count: 1 },
        { block_id: 'B8', name: '函數設計', mastery: 0.55, micro_count: 6, weak_count: 4 },
        { block_id: 'B9', name: '物件導向', mastery: 0.50, micro_count: 4, weak_count: 3 }
      ],
      'D4': [
        { block_id: 'B10', name: '需求分析', mastery: 0.80, micro_count: 5, weak_count: 1 },
        { block_id: 'B11', name: '系統設計', mastery: 0.70, micro_count: 5, weak_count: 2 }
      ]
    };
    return blockMap[domainId] || [];
  }

  // 生成模擬微知識點數據
  private generateMockMicroConcepts(blockId: string): MicroConceptData[] {
    const conceptMap: { [key: string]: MicroConceptData[] } = {
      'B1': [
        { micro_id: 'M1', name: '氣泡排序', mastery: 0.90, attempts: 10, correct: 9, wrong_count: 1, difficulty: 'easy', confidence: 0.85 },
        { micro_id: 'M2', name: '快速排序', mastery: 0.75, attempts: 8, correct: 6, wrong_count: 2, difficulty: 'medium', confidence: 0.85 },
        { micro_id: 'M3', name: '合併排序', mastery: 0.60, attempts: 6, correct: 4, wrong_count: 2, difficulty: 'hard', confidence: 0.6 }
      ],
      'B2': [
        { micro_id: 'M4', name: '線性搜尋', mastery: 0.85, attempts: 8, correct: 7, wrong_count: 1, difficulty: 'easy', confidence: 0.85 },
        { micro_id: 'M5', name: '二分搜尋', mastery: 0.25, attempts: 8, correct: 2, wrong_count: 6, difficulty: 'hard', confidence: 0.3 },
        { micro_id: 'M6', name: '雜湊搜尋', mastery: 0.45, attempts: 6, correct: 3, wrong_count: 3, difficulty: 'hard', confidence: 0.6 }
      ],
      'B3': [
        { micro_id: 'M7', name: '費波那契數列', mastery: 0.30, attempts: 5, correct: 2, wrong_count: 3, difficulty: 'medium', confidence: 0.3 },
        { micro_id: 'M8', name: '背包問題', mastery: 0.20, attempts: 4, correct: 1, wrong_count: 3, difficulty: 'hard', confidence: 0.3 },
        { micro_id: 'M9', name: '最長公共子序列', mastery: 0.35, attempts: 6, correct: 2, wrong_count: 4, difficulty: 'hard', confidence: 0.3 }
      ]
    };
    return conceptMap[blockId] || [];
  }

  // 生成模擬微知識點詳情
  private generateMockMicroDetail(microId: string): MicroConceptData {
    const details: { [key: string]: MicroConceptData } = {
      'M1': { micro_id: 'M1', name: '氣泡排序', mastery: 0.90, attempts: 10, correct: 9, wrong_count: 1, difficulty: 'easy', confidence: 0.85 },
      'M2': { micro_id: 'M2', name: '快速排序', mastery: 0.75, attempts: 8, correct: 6, wrong_count: 2, difficulty: 'medium', confidence: 0.85 },
      'M5': { micro_id: 'M5', name: '二分搜尋', mastery: 0.25, attempts: 8, correct: 2, wrong_count: 6, difficulty: 'hard', confidence: 0.3 }
    };
    return details[microId] || { micro_id: microId, name: '未知知識點', mastery: 0.5, attempts: 0, correct: 0, wrong_count: 0, difficulty: 'medium', confidence: 0.3 };
  }

  // 生成模擬AI診斷
  private generateMockAIDiagnosis(): AIDiagnosis {
    return {
      diagnosis: '您在二分搜尋法方面存在明顯的弱點，主要問題在於邊界條件的處理和遞迴終止條件的判斷。',
      root_cause: '對陣列索引的邊界處理不夠熟練，容易出現off-by-one錯誤。同時對遞迴的終止條件理解不夠深入。',
      learning_path: [
        '1. 複習陣列索引和邊界概念',
        '2. 練習簡單的線性搜尋題目',
        '3. 學習二分搜尋的基本原理',
        '4. 練習邊界條件處理',
        '5. 挑戰複雜的二分搜尋變形題'
      ],
      practice_questions: [
        { 
          id: 'Q1', 
          title: '二分搜尋基礎練習', 
          difficulty: 'easy',
          estimated_time: 10,
          accuracy: 0.85,
          completed: false
        },
        { 
          id: 'Q2', 
          title: '邊界條件處理', 
          difficulty: 'medium',
          estimated_time: 15,
          accuracy: 0.65,
          completed: false
        },
        { 
          id: 'Q3', 
          title: '二分搜尋變形', 
          difficulty: 'hard',
          estimated_time: 25,
          accuracy: 0.45,
          completed: false
        }
      ],
      evidence: [
        '8次練習中6次錯誤',
        '錯誤主要集中在邊界條件',
        '平均答題時間過長'
      ],
      confidence: 0.85,
      confidence_score: {
        history: 85,
        pattern: 78,
        knowledge: 92
      },
      error_analysis: [
        { type: '邊界錯誤', count: 3, percentage: 50 },
        { type: '邏輯錯誤', count: 2, percentage: 33 },
        { type: '粗心錯誤', count: 1, percentage: 17 }
      ],
      knowledge_relations: [
        { name: '陣列索引', type: 'prerequisite', mastery: 0.6 },
        { name: '線性搜尋', type: 'prerequisite', mastery: 0.8 },
        { name: '遞迴概念', type: 'weakness', mastery: 0.3 },
        { name: '動態規劃', type: 'mastered', mastery: 0.9 }
      ],
      practice_progress: {
        completed: 0,
        total: 3
      }
    };
  }
}