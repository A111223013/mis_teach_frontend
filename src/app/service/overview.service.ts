import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { AuthService } from './auth.service';

export interface CalendarEventResponse {
  events: any[];
}

export interface CreateEventRequest {
  title: string;
  content: string;
  start: string;
  notifyEnabled: boolean;
  notifyTime: string | null;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: number;
}

export interface EventResponse {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCalendarEvents(): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<CalendarEventResponse>(`${this.baseUrl}/dashboard/events`, {}, {
        headers: this.getHeaders()
      })
    );
  }

  createCalendarEvent(eventData: CreateEventRequest): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<EventResponse>(`${this.baseUrl}/dashboard/events/create`, eventData, {
        headers: this.getHeaders()
      })
    );
  }

  updateCalendarEvent(eventId: number, eventData: CreateEventRequest): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<EventResponse>(`${this.baseUrl}/dashboard/events/update`, { ...eventData, event_id: eventId }, {
        headers: this.getHeaders()
      })
    );
  }

  deleteCalendarEvent(eventId: number): Observable<any> {
    return this.authService.authenticatedRequest(() => 
      this.http.post<EventResponse>(`${this.baseUrl}/dashboard/events/delete`, { event_id: eventId }, {
        headers: this.getHeaders()
      })
    );
  }
}
