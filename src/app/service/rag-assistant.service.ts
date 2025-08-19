import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RagAssistantService {
  private apiUrl = `${environment.apiUrl}/ai_teacher`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  /**
   * 獲取測驗結果
   */
  getQuizResult(resultId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${this.apiUrl}/get-quiz-result/${resultId}`, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 開始錯題學習
   */
  startErrorLearning(resultId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post<any>(`${this.apiUrl}/start-error-learning`, { result_id: resultId }, { headers })
    ).pipe(catchError(this.handleError));
  }
}
