import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // 獲取當前token
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // 設置token
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  // 清除token
  clearToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  // 檢查token是否有效
  isTokenValid(): boolean {
    const token = this.getToken();
    
    if (!token || token === 'null' || token.trim() === '') {
      return false;
    }
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }

  // 統一的認證請求包裝器
  authenticatedRequest<T>(requestFn: (headers: HttpHeaders) => Observable<T>): Observable<T> {
    const token = this.getToken();
    
    if (!this.isTokenValid()) {
      this.clearToken();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token無效，請重新登錄'));
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return requestFn(headers).pipe(
      map((response: any) => {
        // 檢查返回的響應是否包含新的 token
        if (response && response.token) {
          this.setToken(response.token);
        }
        return response;
      }),
      catchError(error => {
        if (error.status === 401) {
          this.clearToken();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // 處理認證錯誤的統一方法
  handleAuthError(error: any): void {
    if (error.status === 401) {
      this.clearToken();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }

  // 登出
  logout(): void {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  // 檢查是否已登錄
  isLoggedIn(): boolean {
    return this.isTokenValid();
  }

  // ===== AuthGuard 需要的驗證方法 (簡化版) =====

  // 驗證路由存取權限 - 簡化版，只檢查token有效性
  verifyAccess(currentRoute: string): Observable<boolean> {
    const token = this.getToken();
    if (!token || !this.isTokenValid()) {
      return of(false);
    }
    
    // 簡化版：只要有有效token就允許存取
    return of(true);
  }

  // 驗證企業存取權限 - 簡化版
  verifyEnterpriseAccess(taxId: string, currentRoute: string): Observable<boolean> {
    const token = this.getToken();
    if (!token || !this.isTokenValid()) {
      return of(false);
    }
    
    // 簡化版：只要有有效token就允許存取
    return of(true);
  }

  // 驗證團隊存取權限 - 簡化版
  verifyTeamAccess(teamCode: string, currentRoute: string): Observable<boolean> {
    const token = this.getToken();
    if (!token || !this.isTokenValid()) {
      return of(false);
    }
    
    // 簡化版：只要有有效token就允許存取
    return of(true);
  }

  // 驗證團隊應用存取權限 - 簡化版
  verifyTeamApplicationAccess(teamCode: string, appId: number): Observable<boolean> {
    const token = this.getToken();
    if (!token || !this.isTokenValid()) {
      return of(false);
    }
    
    // 簡化版：只要有有效token就允許存取
    return of(true);
  }

  // 驗證應用存取權限 - 簡化版
  verifyApplicationAccess(appId: number): Observable<boolean> {
    const token = this.getToken();
    if (!token || !this.isTokenValid()) {
      return of(false);
    }
    
    // 簡化版：只要有有效token就允許存取
    return of(true);
  }
} 