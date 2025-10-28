import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface UserProfile {
  name: string;
  email: string;
  birthday: string;
  school: string;
  lineId: string;
  avatar: string;
  learningGoals: string[];
}

export interface LineQRResponse {
  qrCodeUrl: string;
  bindingToken: string;
}

export interface LineBindingResponse {
  bound: boolean;
  lineId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserProfile(): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<any>(`${this.baseUrl}/dashboard/get-user-info`, {}, {
        headers: this.getHeaders()
      })
    );
  }

  updateUserProfile(profileData: Partial<UserProfile>): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<any>(`${this.baseUrl}/dashboard/update-user-info`, profileData, {
        headers: this.getHeaders()
      })
    );
  }

  generateLineQR(bindingToken: string): Observable<LineQRResponse> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<LineQRResponse>(`${this.baseUrl}/linebot/generate-qr`, { bindingToken }, {
        headers: this.getHeaders()
      })
    );
  }

  checkLineBinding(bindingToken: string): Observable<LineBindingResponse> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<LineBindingResponse>(`${this.baseUrl}/linebot/check-binding`, { bindingToken }, {
        headers: this.getHeaders()
      })
    );
  }
}
