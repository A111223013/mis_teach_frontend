import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // 添加测验数据存储
  private currentQuizData = new BehaviorSubject<any>(null);
  private readonly QUIZ_DATA_KEY = 'current_quiz_data';

  constructor(private http: HttpClient, private authService: AuthService) {
    // 在構造函數中嘗試從localStorage恢復數據
    this.loadQuizDataFromStorage();
  }

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  // 從localStorage載入測驗數據
  private loadQuizDataFromStorage(): void {
    try {
      const storedData = localStorage.getItem(this.QUIZ_DATA_KEY);
      if (storedData) {
        const quizData = JSON.parse(storedData);
        this.currentQuizData.next(quizData);
      }
    } catch (error) {
      console.error('❌ 從localStorage載入測驗數據失敗:', error);
      this.clearQuizDataFromStorage();
    }
  }

  // 將測驗數據保存到localStorage
  private saveQuizDataToStorage(quizData: any): void {
    try {
      if (quizData) {
        localStorage.setItem(this.QUIZ_DATA_KEY, JSON.stringify(quizData));
      } else {
        this.clearQuizDataFromStorage();
      }
    } catch (error) {
      console.error('❌ 保存測驗數據到localStorage失敗:', error);
    }
  }

  // 從localStorage清除測驗數據
  private clearQuizDataFromStorage(): void {
    try {
      localStorage.removeItem(this.QUIZ_DATA_KEY);
    } catch (error) {
      console.error('❌ 從localStorage清除測驗數據失敗:', error);
    }
  }

  // 存储当前测验数据
  setCurrentQuizData(quizData: any): void {
    this.currentQuizData.next(quizData);
    this.saveQuizDataToStorage(quizData);
  }

  // 获取当前测验数据
  getCurrentQuizData(): Observable<any> {
    return this.currentQuizData.asObservable();
  }

  // 清除当前测验数据
  clearCurrentQuizData(): void {
    this.currentQuizData.next(null);
    this.clearQuizDataFromStorage();
  }

  // 獲取所有考題（完整資料，包含題目內容和圖片）
  getExams(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-exam`, {}, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 獲取考題篩選選項（輕量級，只包含學校、年度、系所、知識點列表）
  getExamFilters(): Observable<any> {
    // 檢查快取（5分鐘有效）
    const cacheKey = 'exam_filters_cache';
    const cacheTimestampKey = 'exam_filters_cache_timestamp';
    const cacheExpiry = 5 * 60 * 1000; // 5分鐘
    
    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < cacheExpiry) {
          // 快取有效，直接返回
          return new Observable(observer => {
            observer.next(JSON.parse(cachedData));
            observer.complete();
          });
        }
      }
    } catch (error) {
      console.warn('讀取快取失敗:', error);
    }
    
    // 快取無效或不存在，從 API 獲取
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-exam-filters`, {}, { headers })
    ).pipe(
      // 成功時保存到快取
      tap((response: any) => {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(response));
          localStorage.setItem(cacheTimestampKey, Date.now().toString());
        } catch (error) {
          console.warn('保存快取失敗:', error);
        }
      }),
      // 錯誤處理：如果 API 失敗，嘗試使用快取（即使過期）
      catchError((error) => {
        try {
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            console.warn('API 請求失敗，使用過期快取');
            return new Observable(observer => {
              observer.next(JSON.parse(cachedData));
              observer.complete();
            });
          }
        } catch (e) {
          // 忽略快取錯誤
        }
        return throwError(() => error);
      })
    );
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
  getQuiz(templateId: string): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get(`${environment.apiBaseUrl}/quiz/get-quiz/${templateId}`, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 提交測驗答案
  submitQuiz(submissionData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/submit-quiz`, submissionData, { headers })
    ).pipe(catchError(this.handleError));
  }

  // 提交 AI 生成的測驗答案
  submitAiQuiz(submissionData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiUrl}/ai_quiz/submit-ai-quiz`, submissionData, { headers })
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

  // 從數據庫獲取考卷數據
  getQuizFromDatabase(quizData: any): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.post(`${environment.apiBaseUrl}/quiz/get-quiz-from-database`, quizData, { headers })
    ).pipe(catchError(this.handleError));
  }
} 