import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiModel?: string;
}

export interface ChatRequest {
  message: string;
  user_id: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  timestamp: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiUrl = `${environment.apiUrl}/web-ai`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // 統一錯誤處理
  private handleError = (error: any) => {
    if (error.status === 401) {
      this.authService.handleAuthError(error);
    }
    return throwError(() => error);
  }

  /**
   * 發送聊天訊息到後端
   */
  sendMessage(message: string, userId: string = 'default'): Observable<ChatResponse> {
    const request: ChatRequest = {
      message: message,
      user_id: userId
    };

    return this.authService.authenticatedRequest((headers) =>
      this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 執行快速動作
   */
  quickAction(action: string, userId: string = 'default'): Observable<ChatResponse> {
    const request = {
      action: action,
      user_id: userId
    };

    return this.authService.authenticatedRequest((headers) =>
      this.http.post<ChatResponse>(`${this.apiUrl}/quick-action`, request, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 檢查系統狀態
   */
  checkStatus(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${this.apiUrl}/status`, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 健康檢查
   */
  healthCheck(): Observable<any> {
    return this.authService.authenticatedRequest((headers) =>
      this.http.get<any>(`${this.apiUrl}/health`, { headers })
    ).pipe(catchError(this.handleError));
  }

  /**
   * 獲取用戶ID（從JWT token中解析用戶email）
   */
  getCurrentUserId(): string {
    try {
      const token = this.authService.getToken();
      if (token) {
        // 解析JWT token獲取用戶email
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user || 'default';
      }
    } catch (error) {
      console.warn('無法解析JWT token，使用默認用戶ID');
    }
    return 'default';
  }
}
