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
}
