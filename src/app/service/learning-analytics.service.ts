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
  // 學習效率指標
  learning_velocity?: number;
  retention_rate?: number;
  avg_time_per_concept?: number;
  focus_score?: number;
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
  concept_name?: string;
  mastery?: number;
  diagnosis: string;
  conclusion?: string;
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
  private baseUrl = 'http://localhost:5000/api/learning-analytics';
  
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
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<{success: boolean, data?: OverviewData, error?: string}>(`${this.baseUrl}/overview`, {}, { headers })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            this.overviewSubject.next(response.data);
            this.domainsSubject.next(response.data.domains);
            return response.data;
          } else {
            throw new Error(response.error || '載入總覽失敗');
          }
        }),
        catchError((error: any) => {
          console.error('載入總覽失敗:', error);
          // 返回空數據結構
          const emptyData = this.generateMockOverview();
          this.overviewSubject.next(emptyData);
          this.domainsSubject.next(emptyData.domains);
          return of(emptyData);
        })
      );
  }

  // 載入領域知識塊
  loadBlocks(userId: string, domainId: string): Observable<BlockData[]> {
    return this.http.get<{success: boolean, data?: BlockData[], error?: string}>(`${this.baseUrl}/blocks/${userId}/${domainId}`)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            this.blocksSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.error || '載入知識塊失敗');
          }
        }),
        catchError((error: any) => {
          console.error('載入知識塊失敗:', error);
          const emptyData = this.generateMockBlocks(domainId);
          this.blocksSubject.next(emptyData);
          return of(emptyData);
        })
      );
  }

  // 載入微知識點
  loadMicroConcepts(userId: string, blockId: string): Observable<MicroConceptData[]> {
    return this.http.get<{success: boolean, data?: MicroConceptData[], error?: string}>(`${this.baseUrl}/concepts/${userId}/${blockId}`)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            this.microConceptsSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.error || '載入微知識點失敗');
          }
        }),
        catchError((error: any) => {
          console.error('載入微知識點失敗:', error);
          const emptyData = this.generateMockMicroConcepts(blockId);
          this.microConceptsSubject.next(emptyData);
          return of(emptyData);
        })
      );
  }

  // 載入微知識點詳情
  loadMicroDetail(userId: string, microId: string): Observable<MicroConceptData> {
    return this.http.get<{success: boolean, data?: MicroConceptData, error?: string}>(`${this.baseUrl}/micro-detail/${userId}/${microId}`)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            this.selectedMicroSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.error || '載入微知識點詳情失敗');
          }
        }),
        catchError((error: any) => {
          console.error('載入微知識點詳情失敗:', error);
          const emptyData = this.generateMockMicroDetail(microId);
          this.selectedMicroSubject.next(emptyData);
          return of(emptyData);
        })
      );
  }

  // AI診斷
  getAIDiagnosis(userId: string, microId: string): Observable<AIDiagnosis> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<{success: boolean, data?: AIDiagnosis, error?: string}>(`${this.baseUrl}/ai-diagnosis`, {
      micro_id: microId
    }, { headers })
    .pipe(
      map((response: any) => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.error || 'AI診斷失敗');
        }
      }),
      catchError((error: any) => {
        console.error('AI診斷失敗:', error);
        return of(this.generateMockAIDiagnosis());
      })
    );
  }

  // 加入學習計劃
  addToLearningPlan(event: any): Observable<any> {
    return this.http.post<{success: boolean, data?: any, error?: string}>(`${this.baseUrl}/learning-plan`, event)
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.error || '加入學習計劃失敗');
          }
        }),
        catchError((error: any) => {
          console.error('加入學習計劃失敗:', error);
          return of({ success: false, message: '加入學習計劃失敗' });
        })
      );
  }

  // 生成練習題
  generatePractice(userId: string, microId: string, type: string = 'standard'): Observable<any> {
    return this.http.post<{success: boolean, data?: any, error?: string}>(`${this.baseUrl}/practice/generate`, {
      user_id: userId,
      micro_id: microId,
      type: type
    })
    .pipe(
      map((response: any) => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.error || '生成練習題失敗');
        }
      }),
      catchError((error: any) => {
        console.error('生成練習題失敗:', error);
        return of({ success: false, message: '生成練習題失敗' });
      })
    );
  }

  // 獲取學習趨勢
  getTrends(userId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<{success: boolean, data?: any[], error?: string}>(`${this.baseUrl}/trends`, {}, { headers })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.error || '獲取學習趨勢失敗');
          }
        }),
        catchError((error: any) => {
          console.error('獲取學習趨勢失敗:', error);
          return of([]);
        })
      );
  }

  // 獲取同儕比較
  getPeerComparison(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<{success: boolean, data?: any, error?: string}>(`${this.baseUrl}/peer-comparison`, {}, { headers })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.error || '獲取同儕比較失敗');
          }
        }),
        catchError((error: any) => {
          console.error('獲取同儕比較失敗:', error);
          return of({});
        })
      );
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
  // TODO: 移除mock數據，改為從後端API獲取
  private generateMockOverview(): OverviewData {
    // 返回空數據結構，等待後端API串接
    return {
      overall_mastery: 0,
      class_ranking: 0,
      domains: [],
      top_weak_points: [],
      recent_improvements: [],
      needs_attention: [],
      ai_suggestions: [],
      ai_summary: {
        title: '載入中...',
        content: '正在載入您的學習數據...',
        confidence: 0,
        last_updated: new Date().toISOString()
      },
      recent_trend: [],
      total_attempts: 0,
      weak_points_count: 0,
      recent_activity: 0,
      learning_velocity: 0,
      retention_rate: 0,
      avg_time_per_concept: 0,
      focus_score: 0
    };
  }

  // TODO: 移除mock數據，改為從後端API獲取
  private generateMockBlocks(domainId: string): BlockData[] {
    // 返回空數據結構，等待後端API串接
    return [];
  }

  // 生成模擬微知識點數據
  // TODO: 移除mock數據，改為從後端API獲取
  private generateMockMicroConcepts(blockId: string): MicroConceptData[] {
    // 返回空數據結構，等待後端API串接
    return [];
  }

  // TODO: 移除mock數據，改為從後端API獲取
  private generateMockMicroDetail(microId: string): MicroConceptData {
    // 返回空數據結構，等待後端API串接
    return { micro_id: microId, name: '載入中...', mastery: 0, attempts: 0, correct: 0, wrong_count: 0, difficulty: 'medium', confidence: 0 };
  }

  // TODO: 移除mock數據，改為從後端API獲取
  private generateMockAIDiagnosis(): AIDiagnosis {
    // 返回空數據結構，等待後端API串接
    return {
      concept_name: '載入中...',
      diagnosis: '正在分析您的學習數據...',
      root_cause: '請稍候，AI正在進行深度分析...',
      learning_path: [],
      practice_questions: [],
      evidence: [],
      confidence: 0,
      confidence_score: {
        history: 0,
        pattern: 0,
        knowledge: 0
      },
      error_analysis: [],
      knowledge_relations: [],
      practice_progress: {
        completed: 0,
        total: 0
      }
    };
  }
}