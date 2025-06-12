import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface UserGuideStatus {
  user_id: string;
  new_user: boolean;
  guide_completed: boolean;
  last_login: string;
  guide_completion_date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserGuideStatusService {
  private apiUrl = 'http://localhost:5000/api/user-guide';
  private guideStatusSubject = new BehaviorSubject<UserGuideStatus | null>(null);
  public guideStatus$ = this.guideStatusSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * 檢查用戶導覽狀態
   */
  checkUserGuideStatus(): Observable<UserGuideStatus> {
    return this.http.get<UserGuideStatus>(`${this.apiUrl}/status`, this.httpOptions);
  }

  /**
   * 標記用戶已完成導覽
   */
  markUserAsGuided(): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-guided`, {}, this.httpOptions);
  }

  /**
   * 重置用戶導覽狀態（用於測試）
   */
  resetUserGuideStatus(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {}, this.httpOptions);
  }

  /**
   * 更新本地狀態
   */
  updateLocalStatus(status: UserGuideStatus): void {
    this.guideStatusSubject.next(status);
  }

  /**
   * 獲取當前狀態
   */
  getCurrentStatus(): UserGuideStatus | null {
    return this.guideStatusSubject.value;
  }

  /**
   * 檢查是否需要顯示導覽
   */
  shouldShowGuide(): boolean {
    const status = this.getCurrentStatus();
    return status ? status.new_user && !status.guide_completed : false;
  }
}
