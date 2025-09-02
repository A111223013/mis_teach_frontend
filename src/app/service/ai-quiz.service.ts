import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface QuestionAnalysis {
  difficulty_score: number;
  difficulty_level: string;
  focus_areas: string[];
  question_complexity: number;
  answer_complexity: number;
}

export interface LearningSuggestion {
  suggestions: string[];
}

export interface LearningPath {
  stages: Array<{
    stage: string;
    description: string;
    estimated_time: number;
    activities: string[];
  }>;
  total_estimated_time: number;
  difficulty_adjustment: string;
  focus_areas: string[];
}

export interface LearningSession {
  session_id: string;
  user_email: string;
  question_id: string;
  mode: string;
  created_at: string;
  status: string;
  current_stage: string;
  understanding_level: number;
  learning_progress: Array<{
    timestamp: string;
    stage: string;
    understanding_level: number;
    learning_time: number;
  }>;
}

export interface LearningProgress {
  session_id: string;
  question_id: string;
  understanding_level: number;
  learning_stage: string;
  learning_time: number;
}

export interface LearningRecommendation {
  topic?: string;
  chapter?: string;
  current_level: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiQuizService {
  private API_BASE_URL = environment.apiUrl + '/ai_quiz';

  constructor(private http: HttpClient, private authService: AuthService) {}
  /**
   * 獲取用戶提交分析數據
   */
  getUserSubmissionsAnalysis(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.API_BASE_URL}/get-user-submissions-analysis`, {}, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`獲取提交分析失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 從MongoDB獲取用戶錯題
   */
  getUserErrorsMongo(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.API_BASE_URL}/get-user-errors-mongo`, {}, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`獲取錯題失敗 (${error.status})`));
        }
      })
    );
  }
   private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  /**
   * 分析題目
   */
  analyzeQuestion(questionData: {
    question_id: string;
    user_answer?: string;
    correct_answer?: string;
    question_text?: string;
    topic?: string;
    chapter?: string;
  }): Observable<{
    success: boolean;
    analysis: QuestionAnalysis;
    suggestions: string[];
    learning_path: LearningPath;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.API_BASE_URL}/analyze-question`, questionData, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`題目分析失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 生成引導學習會話
   */
  generateGuidedLearningSession(questionId: string, mode: 'guided_learning' | 'mistake_review' | 'batch_review'): Observable<{
    success: boolean;
    session_data: LearningSession;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      question_id: questionId,
      mode: mode
    };

    return this.http.post<any>(`${this.API_BASE_URL}/generate-guided-learning-session`, payload, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`生成學習會話失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 追蹤學習進度
   */
  trackLearningProgress(progressData: LearningProgress): Observable<{
    success: boolean;
    progress_updated: boolean;
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.API_BASE_URL}/track-learning-progress`, progressData, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`追蹤學習進度失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 獲取學習建議
   */
  getLearningRecommendations(recommendationData: LearningRecommendation): Observable<{
    success: boolean;
    recommendations: string[];
  }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.API_BASE_URL}/get-learning-recommendations`, recommendationData, { headers }).pipe(
      catchError((error: any) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`獲取學習建議失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 開始引導學習流程
   */
  startGuidedLearning(questionData: any): Observable<{
    success: boolean;
    session_data: LearningSession;
    analysis: QuestionAnalysis;
    suggestions: string[];
    learning_path: LearningPath;
  }> {
    return new Observable(observer => {
      // 1. 首先生成學習會話
      this.generateGuidedLearningSession(questionData.question_id, 'guided_learning').subscribe({
        next: (sessionResponse) => {
          if (sessionResponse.success) {
            // 2. 分析題目
            this.analyzeQuestion({
              question_id: questionData.question_id,
              user_answer: questionData.user_answer,
              correct_answer: questionData.correct_answer,
              question_text: questionData.question_text,
              topic: questionData.topic,
              chapter: questionData.chapter
            }).subscribe({
              next: (analysisResponse) => {
                if (analysisResponse.success) {
                  // 3. 返回完整的學習數據
                  observer.next({
                    success: true,
                    session_data: sessionResponse.session_data,
                    analysis: analysisResponse.analysis,
                    suggestions: analysisResponse.suggestions,
                    learning_path: analysisResponse.learning_path
                  });
                  observer.complete();
                } else {
                  observer.error(new Error('題目分析失敗'));
                }
              },
              error: (error) => observer.error(error)
            });
          } else {
            observer.error(new Error('生成學習會話失敗'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * 開始錯題複習流程
   */
  startMistakeReview(questionData: any): Observable<{
    success: boolean;
    session_data: LearningSession;
    analysis: QuestionAnalysis;
    suggestions: string[];
    learning_path: LearningPath;
  }> {
    return new Observable(observer => {
      // 1. 首先生成錯題複習會話
      this.generateGuidedLearningSession(questionData.question_id, 'mistake_review').subscribe({
        next: (sessionResponse) => {
          if (sessionResponse.success) {
            // 2. 分析題目
            this.analyzeQuestion({
              question_id: questionData.question_id,
              user_answer: questionData.user_answer,
              correct_answer: questionData.correct_answer,
              question_text: questionData.question_text,
              topic: questionData.topic,
              chapter: questionData.chapter
            }).subscribe({
              next: (analysisResponse) => {
                if (analysisResponse.success) {
                  // 3. 返回完整的學習數據
                  observer.next({
                    success: true,
                    session_data: sessionResponse.session_data,
                    analysis: analysisResponse.analysis,
                    suggestions: analysisResponse.suggestions,
                    learning_path: analysisResponse.learning_path
                  });
                  observer.complete();
                } else {
                  observer.error(new Error('題目分析失敗'));
                }
              },
              error: (error) => observer.error(error)
            });
          } else {
            observer.error(new Error('生成錯題複習會話失敗'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }
  submitQuiz(submissionData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/ai_quiz/submit-quiz`, submissionData, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 更新學習進度
   */
  updateProgress(sessionId: string, questionId: string, understandingLevel: number, learningStage: string, learningTime: number): Observable<boolean> {
    return this.trackLearningProgress({
      session_id: sessionId,
      question_id: questionId,
      understanding_level: understandingLevel,
      learning_stage: learningStage,
      learning_time: learningTime
    }).pipe(
      map(response => response.progress_updated)
    );
  }

  /**
   * 獲取個性化學習建議
   */
  getPersonalizedRecommendations(topic: string, chapter: string, currentLevel: number): Observable<string[]> {
    return this.getLearningRecommendations({
      topic: topic,
      chapter: chapter,
      current_level: currentLevel
    }).pipe(
      map(response => response.recommendations)
    );
  }
 
}
