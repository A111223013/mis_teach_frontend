import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface WebChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  content: string;
  category?: string;
  user_id?: string;
  timestamp?: string;
  memory_info?: {
    has_memory: boolean;
    memory_count: number;
  };
}

export interface MemoryAction {
  action: 'view' | 'clear' | 'stats';
  user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebAiAssistantService {
  private readonly API_BASE_URL = `${environment.apiUrl}/web-ai`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * 發送聊天訊息到後端
   */
  sendMessage(message: string): Observable<ChatResponse> {
    return this.authService.authenticatedRequest((headers) => {
      const payload = { message };
      return this.http.post<ChatResponse>(`${this.API_BASE_URL}/chat`, payload, { headers });
    });
  }

  /**
   * 執行快速操作
   */
  quickAction(action: string): Observable<ChatResponse> {
    return this.authService.authenticatedRequest((headers) => {
      const payload = { action };
      return this.http.post<ChatResponse>(`${this.API_BASE_URL}/quick-action`, payload, { headers });
    });
  }

  /**
   * 獲取助手狀態
   */
  getStatus(): Observable<any> {
    return this.authService.authenticatedRequest((headers) => 
      this.http.get(`${this.API_BASE_URL}/status`, { headers })
    );
  }

  /**
   * 健康檢查
   */
  healthCheck(): Observable<any> {
    return this.authService.authenticatedRequest((headers) => 
      this.http.get(`${this.API_BASE_URL}/health`, { headers })
    );
  }

  /**
   * 記憶管理
   */
  manageMemory(action: MemoryAction): Observable<ChatResponse> {
    return this.authService.authenticatedRequest((headers) => 
      this.http.post<ChatResponse>(`${this.API_BASE_URL}/memory`, action, { headers })
    );
  }

  /**
   * 獲取記憶統計
   */
  getMemoryStats(): Observable<any> {
    return this.authService.authenticatedRequest((headers) => 
      this.http.get(`${this.API_BASE_URL}/memory/stats`, { headers })
    );
  }

  /**
   * 生成唯一ID
   */
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 格式化時間
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
