import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = 'http://localhost:5000/materials'; // 後端 Flask API

  constructor(private http: HttpClient) {}

  // 取得教材列表
  getMaterials(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  // 取得單一教材
  getMaterial(filename: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${filename}`);
  }

  // 取得知識點列表
  getKeyPoints(): Observable<{ key_points: string[] }> {
    return this.http.get<{ key_points: string[] }>(`${environment.apiBaseUrl}/materials/key_points`);
  }
}
