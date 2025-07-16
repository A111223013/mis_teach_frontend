import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
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
    console.log('🎯 創建測驗:', quizParams);
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/create-quiz`, quizParams, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取測驗詳情
  getQuiz(quizId: string): Observable<any> {
    console.log('🔍 獲取測驗詳情，ID:', quizId);
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-quiz`, { quiz_id: quizId }, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 提交測驗答案
  submitQuiz(submissionData: any): Observable<any> {
    console.log('📤 提交測驗答案:', submissionData);
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/submit-quiz`, submissionData, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取基礎URL（用於圖片等靜態資源）
  getBaseUrl(): string {
    return environment.apiBaseUrl;
  }
} 