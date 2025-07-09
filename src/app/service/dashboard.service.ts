import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {

   }

   getUserInfo(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/get-user-name`, {}, { headers });
   }

   ask(question: string): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<string>(`${environment.apiBaseUrl}/ai_agent/ask`, { question }, { headers });
   }

   get_exam(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/get-exam`, {}, { headers });
   }
   
   get_exam_to_object(school: string, year: string, subject: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/get-exam-to-object`, {school, year, subject}, { headers });
   }

   // 獲取測驗詳情
   getQuiz(quizId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/get-quiz`, { quiz_id: quizId }, { headers });
   }

   // 提交測驗答案
   submitQuiz(submissionData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/submit-quiz`, submissionData, { headers });
   }

   submitAnswers(answers: any[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/submit-answers`, { answers }, { headers });
   }

   getUserSubmissions(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/getUserSubmissions`, {}, { headers });
   }

   getSubmissionDetail(submissionId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${environment.apiBaseUrl}/dashboard/getSubmissionDetail`, { submission_id: submissionId }, { headers });
   }

   // 獲取基礎API URL
   getBaseUrl(): string {
    return environment.apiBaseUrl;
   }
}
