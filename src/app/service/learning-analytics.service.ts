import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// 統一的數據接口
export interface LearningAnalyticsData {
  overview: OverviewData;
  knowledgeGraph: KnowledgeGraphData;
  trends: TrendData[];
}

export interface OverviewData {
  total_mastery: number;
  learning_velocity: number;
  retention_rate: number;
  avg_time_per_concept: number;
  focus_score: number;
  domains: DomainData[];
  top_weak_points: WeakPoint[];
  recent_activity: any[];
}

export interface DomainData {
  id: string;
  name: string;
  mastery: number;
  questionCount: number;
  wrongCount: number;
  concepts: MicroConceptData[];
}

export interface MicroConceptData {
  id: string;
  name: string;
  mastery: number;
  questionCount: number;
  wrongCount: number;
}

export interface AIDiagnosisData {
  summary: string;
  metrics: {
    domain: string;
    concept: string;
    mastery: number;
    attempts: number;
    recent_accuracy: number;
  };
  root_causes: string[];
  top_actions: {
    action: string;
    detail: string;
    est_min: number;
  }[];
  practice_examples: {
    q_id: string;
    difficulty: string;
    text: string;
  }[];
  evidence: string[];
  confidence: 'high' | 'medium' | 'low';
  learning_path: LearningPathItem[];  // 新增學習路徑
  difficulty_breakdown?: { [key: string]: number };  // 難度掌握度分析
  forgetting_analysis?: {  // 遺忘分析
    base_mastery: number;
    current_mastery: number;
    days_since_practice: number;
    review_urgency: 'high' | 'medium' | 'low';
    forgetting_curve_data: number[];
  };
  full_text: string;
}

export interface LearningPathItem {
  concept_id: string;
  concept_name: string;
  readiness: number;
  reason: string;
  estimated_difficulty: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeakPoint {
  id: string;
  name: string;
  mastery: number;
  error_count: number;
  improvement_potential: number;
}

export interface KnowledgeGraphData {
  domains: KnowledgeDomain[];
  relationships: KnowledgeRelationship[];
}

export interface KnowledgeDomain {
  id: string;
  name: string;
  mastery: number;
  questionCount: number;
  wrongCount: number;
  concepts: MicroConceptData[];
}

export interface KnowledgeRelationship {
  source: string;
  target: string;
  type: 'prerequisite' | 'similar' | 'misconception' | 'cross_domain';
}

export interface TrendData {
  date: string;
  mastery: number;
  questions: number;
  accuracy: number;
}

export interface AIDiagnosis {
  concept_name?: string;
  mastery?: number;
  conclusion?: string;
  diagnosis: string;
  root_cause: string;
  evidence: string;
  learning_path: string[];
  practice_recommendations: string[];
  confidence: number;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({
  providedIn: 'root'
})
export class LearningAnalyticsService {
  private baseUrl = 'http://localhost:5000/api/learning-analytics';

  constructor(private http: HttpClient) {}

  // 主要初始化 API - 獲取所有數據
  loadAllData(trendDays: number = 7): Observable<LearningAnalyticsData> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<{success: boolean, data?: LearningAnalyticsData, error?: string}>(`${this.baseUrl}/init-data`, { trendDays }, { headers })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.error || '獲取學習分析數據失敗');
          }
        }),
        catchError((error: any) => {
          console.error('載入學習分析數據失敗:', error);
          return of({
            overview: this.getEmptyOverview(),
            knowledgeGraph: { domains: [], relationships: [] },
            trends: []
          });
        })
      );
  }


  // 生成練習題目
  generatePractice(microId: string, difficulty: string = 'medium'): Observable<PracticeQuestion[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<{success: boolean, data?: PracticeQuestion[], error?: string}>(`${this.baseUrl}/practice/generate`, 
      { micro_id: microId, difficulty }, { headers })
      .pipe(
        map((response: any) => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.error || '生成練習題目失敗');
          }
        }),
        catchError((error: any) => {
          console.error('生成練習題目失敗:', error);
          return of([]);
        })
      );
  }

  // 加入學習計劃
  addToLearningPlan(conceptId: string, conceptName: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<{success: boolean, error?: string}>(`${this.baseUrl}/learning-plan`, 
      { concept_id: conceptId, concept_name: conceptName }, { headers })
      .pipe(
        map((response: any) => {
          if (response.success) {
            return true;
          } else {
            throw new Error(response.error || '加入學習計劃失敗');
          }
        }),
        catchError((error: any) => {
          console.error('加入學習計劃失敗:', error);
          return of(false);
        })
      );
  }

  // AI診斷特定知識點
  getAIDiagnosis(conceptId: string, conceptName: string, domainName: string): Observable<AIDiagnosisData | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<AIDiagnosisData>(`${this.baseUrl}/ai-diagnosis`, 
      { 
        concept_id: conceptId, 
        concept_name: conceptName,
        domain_name: domainName
      }, 
      { headers }
    ).pipe(
      catchError((error: any) => {
        console.error('AI診斷失敗:', error);
        return of(null);
      })
    );
  }

  // 獲取難度分析數據
  getDifficultyAnalysis(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${this.baseUrl}/difficulty-analysis`, {}, { headers })
      .pipe(
        map((response: any) => response.data || {}),
        catchError((error: any) => {
          console.error('獲取難度分析失敗:', error);
          return of({});
        })
      );
  }


  // AI並行出題練習
  generateAIPracticeParallel(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${this.baseUrl}/ai-practice-parallel`, params, { headers });
  }

  // 獲取空數據結構
  private getEmptyOverview(): OverviewData {
    return {
      total_mastery: 0,
      learning_velocity: 0,
      retention_rate: 0,
      avg_time_per_concept: 0,
      focus_score: 0,
      domains: [],
      top_weak_points: [],
      recent_activity: []
    };
  }
}