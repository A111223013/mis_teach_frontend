import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Highlight {
  _id?: string;
  filename: string;
  highlight_id: string;
  text: string;
  color: string;
  user?: string;
  type: 'highlight';
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  _id?: string;
  filename: string;
  text: string;
  title: string;
  highlight_id?: string;
  user?: string;
  type: 'note';
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly baseUrl = `${environment.apiBaseUrl}/note`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getCurrentUser(): string {
    try {
      const token = this.authService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user || 'default';
      }
    } catch (error) {
      console.warn('無法解析JWT token，使用默認用戶ID');
    }
    return 'default';
  }

  // ========== 劃記相關 API ==========

  /**
   * 獲取指定教材的所有劃記
   */
  getHighlights(filename: string): Observable<{ highlights: Highlight[] }> {
    const user = this.getCurrentUser();
    return this.http.get<{ highlights: Highlight[] }>(
      `${this.baseUrl}/highlights?filename=${encodeURIComponent(filename)}&user=${encodeURIComponent(user)}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * 儲存劃記
   */
  saveHighlight(highlight: Omit<Highlight, '_id' | 'user' | 'type' | 'created_at' | 'updated_at'>): Observable<{ success: boolean; highlight: Highlight }> {
    const user = this.getCurrentUser();
    return this.http.post<{ success: boolean; highlight: Highlight }>(
      `${this.baseUrl}/highlights`,
      { ...highlight, user },
      { headers: this.getHeaders() }
    );
  }

  /**
   * 刪除劃記
   */
  deleteHighlight(filename: string, highlightId: string): Observable<{ success: boolean; message: string }> {
    const user = this.getCurrentUser();
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/highlights/${highlightId}?filename=${encodeURIComponent(filename)}&user=${encodeURIComponent(user)}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * 清除所有劃記
   */
  clearAllHighlights(filename: string): Observable<{ success: boolean; message: string }> {
    const user = this.getCurrentUser();
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/highlights/clear`,
      { filename, user },
      { headers: this.getHeaders() }
    );
  }

  // ========== 筆記相關 API ==========

  /**
   * 獲取指定教材的所有筆記
   */
  getNotes(filename: string): Observable<{ notes: Note[] }> {
    const user = this.getCurrentUser();
    return this.http.get<{ notes: Note[] }>(
      `${this.baseUrl}/notes?filename=${encodeURIComponent(filename)}&user=${encodeURIComponent(user)}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * 建立新筆記
   */
  createNote(note: Omit<Note, '_id' | 'user' | 'type' | 'created_at' | 'updated_at'>): Observable<{ success: boolean; note: Note }> {
    const user = this.getCurrentUser();
    return this.http.post<{ success: boolean; note: Note }>(
      `${this.baseUrl}/notes`,
      { ...note, user },
      { headers: this.getHeaders() }
    );
  }

  /**
   * 更新筆記
   */
  updateNote(noteId: string, updates: { text?: string; title?: string }): Observable<{ success: boolean; note: Note }> {
    return this.http.put<{ success: boolean; note: Note }>(
      `${this.baseUrl}/notes/${noteId}`,
      updates,
      { headers: this.getHeaders() }
    );
  }

  /**
   * 刪除筆記
   */
  deleteNote(noteId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/notes/${noteId}`,
      { headers: this.getHeaders() }
    );
  }
}


