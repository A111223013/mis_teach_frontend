import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // 添加测验数据存储
  private currentQuizData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  // 存储当前测验数据
  setCurrentQuizData(quizData: any): void {
    console.log('💾 存储测验数据到服务:', quizData);
    this.currentQuizData.next(quizData);
  }

  // 获取当前测验数据
  getCurrentQuizData(): Observable<any> {
    return this.currentQuizData.asObservable();
  }

  // 清除当前测验数据
  clearCurrentQuizData(): void {
    this.currentQuizData.next(null);
  }

  // 獲取所有考題
  getExams(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-exam`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 條件查詢考題
  getExamsByCondition(school: string, year: string, subject: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-exam-to-object`, { school, year, subject }, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 創建測驗
  createQuiz(quizParams: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/create-quiz`, quizParams, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取測驗詳情（保留作为备选方案）
  getQuiz(quizId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-quiz`, { quiz_id: quizId }, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 提交測驗答案
  submitQuiz(submissionData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/submit-quiz`, submissionData, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 檢視測驗結果 - 從submissions載入數據並統計
   */
  viewQuizResult(submissionId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post<any>(`${environment.apiBaseUrl}/quiz/view-quiz-result`, { submission_id: submissionId }, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 鞏固錯題 - 支持兩種方式載入錯題
   */
  consolidateErrors(source: 'error_questions' | 'redis' = 'error_questions', submissionId?: string): Observable<any> {
    const payload: any = { source };
    if (submissionId) {
      payload.submission_id = submissionId;
    }
    
    return this.authService.authenticatedRequest((headers) =>
      this.http.post<any>(`${environment.apiBaseUrl}/quiz/consolidate-errors`, payload, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取基礎URL（用於圖片等靜態資源）
  getBaseUrl(): string {
    return environment.apiBaseUrl;
  }

  // 從 MongoDB error_questions 集合獲取用戶錯題
  getUserErrorsMongo(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-user-errors-mongo`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }
} 