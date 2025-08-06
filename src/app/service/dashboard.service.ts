import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  // 獲取用戶信息
  getUserInfo(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/dashboard/get-user-name`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // AI問答
  ask(question: string): Observable<string> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post<string>(`${environment.apiBaseUrl}/ai_agent/ask`, { question }, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取用戶提交歷史
  getUserSubmissions(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/dashboard/get-user-submissions`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 從 MongoDB error_questions 集合獲取用戶錯題
  getUserErrorsMongo(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-user-errors-mongo`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 從 MongoDB submissions 集合獲取完整測驗數據進行分析
  getUserSubmissionsAnalysis(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-user-submissions-analysis`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取提交詳情
  getSubmissionDetail(submissionId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/dashboard/getSubmissionDetail`, { submission_id: submissionId }, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 提交答案（舊版本，保留兼容性）
  submitAnswers(answers: any[]): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/dashboard/submit-answers`, { answers }, { headers })
    ).pipe(catchError(this.handleError));
  }
}
