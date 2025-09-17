import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * 獲取學習分析數據
   */
  getLearningAnalysis(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${environment.apiUrl}/personalized_learning/learning-analysis/current`, { headers })
    );
  }

  /**
   * 獲取知識點基本資料（不包含 AI 分析）
   */
  getConceptBasicInfo(conceptName: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${environment.apiUrl}/personalized_learning/concept-basic-info/${conceptName}`, { headers })
    );
  }

  /**
   * 獲取知識點 AI 分析
   */
  getConceptAnalysis(conceptName: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${environment.apiUrl}/personalized_learning/concept-analysis/${conceptName}`, { headers })
    );
  }

  /**
   * 加入學習計劃
   */
  addToCalendar(calendarData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post<any>(`${environment.apiUrl}/personalized_learning/add-to-calendar`, calendarData, { headers })
    );
  }
}
