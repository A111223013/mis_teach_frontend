import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly baseUrl = `${environment.apiBaseUrl}/materials`;

  constructor(private http: HttpClient) {}

  // 取得單一教材
  getMaterial(filename: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${filename}`);
  }

  // 取得知識點列表
  getKeyPoints(): Observable<{ key_points: string[] }> {
    return this.http.get<{ key_points: string[] }>(`${this.baseUrl}/key_points`);
  }

  // 取得大知識點列表
  getDomains(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/domain`);
  }

  // 取得章節列表
  getBlocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/block`);
  }

  // 取得小知識點列表
  getMicroConcepts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/micro_concept`);
  }
}
