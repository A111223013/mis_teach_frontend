import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LearningOverview {
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  avg_answer_time: number;
  overall_assessment: string;
}

export interface ConceptMastery {
  [key: string]: {
    mastery_rate: number;
    accuracy_rate: number;
    time_efficiency: number;
    total_questions: number;
    correct_answers: number;
    avg_time: number;
  };
}

export interface TopicMastery {
  [key: string]: {
    name: string;
    overall_mastery: number;
    concepts: Array<{
      name: string;
      mastery_rate: number;
      sub_topic: string;
    }>;
    concept_count: number;
    mastered_concepts: number;
  };
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'topic' | 'concept';
  mastery_rate: number;
  size: number;
  color: string;
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  type: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface WeaknessAnalysis {
  weaknesses: Array<{
    concept: string;
    mastery_rate: number;
    issues: string[];
  }>;
  recommendations: Array<{
    concept: string;
    priority: string;
    suggestions: string[];
  }>;
  overall_assessment: string;
}

export interface LearningAnalyticsData {
  overview: LearningOverview;
  concept_mastery: ConceptMastery;
  topic_mastery: TopicMastery;
  knowledge_graph: KnowledgeGraph;
  weaknesses_analysis: WeaknessAnalysis;
  questions_data: any[];
  student_answers: any[];
}

// 新增：知識關係圖介面
export interface KnowledgeRelationshipNode {
  id: string;
  name: string;
  type: 'concept' | 'topic';
  category: string;
}

export interface KnowledgeRelationshipEdge {
  source: string;
  target: string;
  type: 'hierarchy' | 'pre-requisite' | 'application';
}

export interface KnowledgeRelationshipGraph {
  knowledge_nodes: KnowledgeRelationshipNode[];
  knowledge_edges: KnowledgeRelationshipEdge[];
}

@Injectable({
  providedIn: 'root'
})
export class LearningAnalyticsService {
  private baseUrl = environment.apiUrl + '/analytics';

  constructor(private http: HttpClient) {}

  /**
   * 獲取完整的學習分析數據
   */
  getLearningAnalytics(): Observable<{ success: boolean; data: LearningAnalyticsData }> {
    return this.http.get<{ success: boolean; data: LearningAnalyticsData }>(`${this.baseUrl}/learning-analytics`);
  }

  /**
   * 獲取學習概覽
   */
  getOverview(): Observable<{ success: boolean; data: LearningOverview }> {
    return this.http.get<{ success: boolean; data: LearningOverview }>(`${this.baseUrl}/overview`);
  }

  /**
   * 獲取概念掌握率
   */
  getConceptMastery(): Observable<{ success: boolean; data: ConceptMastery }> {
    return this.http.get<{ success: boolean; data: ConceptMastery }>(`${this.baseUrl}/concept-mastery`);
  }

  /**
   * 獲取主題掌握率
   */
  getTopicMastery(): Observable<{ success: boolean; data: TopicMastery }> {
    return this.http.get<{ success: boolean; data: TopicMastery }>(`${this.baseUrl}/topic-mastery`);
  }

  /**
   * 獲取知識圖譜
   */
  getKnowledgeGraph(): Observable<{ success: boolean; data: KnowledgeGraph }> {
    return this.http.get<{ success: boolean; data: KnowledgeGraph }>(`${this.baseUrl}/knowledge-graph`);
  }

  /**
   * 獲取弱點分析
   */
  getWeaknessesAnalysis(): Observable<{ success: boolean; data: WeaknessAnalysis }> {
    return this.http.get<{ success: boolean; data: WeaknessAnalysis }>(`${this.baseUrl}/weaknesses-analysis`);
  }

  /**
   * 獲取知識關係圖
   */
  getKnowledgeRelationship(): Observable<{ success: boolean; data: KnowledgeRelationshipGraph }> {
    return this.http.get<{ success: boolean; data: KnowledgeRelationshipGraph }>(`${this.baseUrl}/knowledge-relationship`);
  }
}
