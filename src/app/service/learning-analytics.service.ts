import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// 新的數據結構介面
export interface MicroConceptMastery {
  micro_concept_id: string;
  mastery_score: number;
  accuracy: number;
  time_factor: number;
  total_questions: number;
  correct_answers: number;
  avg_time: number;
  name?: string;
  block_id?: string;
}

export interface BlockMastery {
  block_id: string;
  mastery_score: number;
  micro_concepts: MicroConceptMastery[];
  total_micro_concepts: number;
  mastered_concepts: number;
}

export interface DomainMastery {
  domain_id: string;
  mastery_score: number;
  blocks: BlockMastery[];
  total_blocks: number;
  mastered_blocks: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'subject' | 'domain' | 'block' | 'micro_concept';
  mastery_score: number;
  size: number;
  block_id?: string; // 添加block_id屬性
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  type: 'belongs_to' | 'depends_on';
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface DependencyIssue {
  prerequisite_id: string;
  prerequisite_name: string;
  prerequisite_mastery: number;
  current_mastery: number;
  gap: number;
}

export interface DependencyProblem {
  micro_concept_id: string;
  micro_concept_name: string;
  issues: DependencyIssue[];
  severity: 'high' | 'medium';
}

export interface WeaknessReport {
  student_email: string;
  summary: {
    total_concepts: number;
    critical_weaknesses: number;
    moderate_weaknesses: number;
    dependency_issues: number;
  };
  weaknesses: {
    critical: MicroConceptMastery[];
    moderate: MicroConceptMastery[];
  };
  dependency_issues: DependencyProblem[];
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    target: string;
    reason: string;
    estimated_time: string;
  }>;
}

export interface StudentMasteryData {
  student_email: string;
  domain_analyses: Array<{
    domain_id: string;
    domain_name: string;
    mastery_score: number;
    blocks: BlockMastery[];
  }>;
  weakness_report: WeaknessReport;
  knowledge_graph: KnowledgeGraph;
}

@Injectable({
  providedIn: 'root'
})
export class LearningAnalyticsService {
  private baseUrl = environment.apiUrl + '/analytics';

  constructor(private http: HttpClient) {}

  /**
   * 獲取學生整體掌握度分析
   */
  getStudentMastery(studentEmail: string): Observable<{ success: boolean; data: StudentMasteryData }> {
    return this.http.get<{ success: boolean; data: StudentMasteryData }>(`${this.baseUrl}/student-mastery/${studentEmail}`);
  }

  /**
   * 獲取學生弱點分析報告
   */
  getWeaknessReport(studentEmail: string): Observable<{ success: boolean; data: WeaknessReport }> {
    return this.http.get<{ success: boolean; data: WeaknessReport }>(`${this.baseUrl}/weakness-report/${studentEmail}`);
  }

  /**
   * 獲取學生知識圖譜數據
   */
  getKnowledgeGraph(studentEmail: string): Observable<{ success: boolean; data: KnowledgeGraph }> {
    return this.http.get<{ success: boolean; data: KnowledgeGraph }>(`${this.baseUrl}/knowledge-graph/${studentEmail}`);
  }

  /**
   * 獲取學生對特定小知識點的掌握度
   */
  getMicroConceptMastery(studentEmail: string, microConceptId: string): Observable<{ success: boolean; data: MicroConceptMastery }> {
    return this.http.get<{ success: boolean; data: MicroConceptMastery }>(`${this.baseUrl}/micro-concept-mastery/${studentEmail}/${microConceptId}`);
  }

  /**
   * 獲取學生知識依存關係問題
   */
  getDependencyIssues(studentEmail: string): Observable<{ success: boolean; data: { student_email: string; dependency_issues: DependencyProblem[]; total_issues: number } }> {
    return this.http.get<{ success: boolean; data: { student_email: string; dependency_issues: DependencyProblem[]; total_issues: number } }>(`${this.baseUrl}/dependency-issues/${studentEmail}`);
  }

  // 保留舊的API端點以向後兼容（可選）
  /**
   * 獲取完整的學習分析數據（已棄用，請使用 getStudentMastery）
   */
  getLearningAnalytics(): Observable<{ success: boolean; data: any }> {
    console.warn('getLearningAnalytics 已棄用，請使用 getStudentMastery');
    // 這裡可以返回一個預設的學生郵箱，或者拋出錯誤
    return this.getStudentMastery('default@example.com');
  }
}
