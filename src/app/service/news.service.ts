import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  href: string;
  image: string;
  date: string;
  tags: Array<{ text: string; href: string }>;
  created_at?: string;
}

export interface NewsResponse {
  data: NewsItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private http: HttpClient) {}

  /**
   * 獲取新聞列表（支援分頁和搜尋）
   */
  getNews(page: number = 1, perPage: number = 12, search?: string): Observable<NewsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    return this.http.get<NewsResponse>(`${environment.apiBaseUrl}/api/news`, { params });
  }

  /**
   * 獲取單條新聞詳情
   */
  getNewsDetail(newsId: number): Observable<NewsItem> {
    return this.http.get<NewsItem>(`${environment.apiBaseUrl}/api/news/${newsId}`);
  }

  /**
   * 獲取新聞統計信息
   */
  getNewsStats(): Observable<{ total: number; latest_date: string }> {
    return this.http.get<{ total: number; latest_date: string }>(`${environment.apiBaseUrl}/api/news/stats`);
  }
}

