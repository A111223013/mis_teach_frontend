import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { startOfDay } from 'date-fns';
import { FlatpickrDirective } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule,} from 'angular-calendar';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,   // 必須匯入
    FlatpickrDirective,
    NgbModalModule
  ],
  templateUrl: './component.html',
  styleUrls: ['./component.css']
  
})
export class DemoComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  modalOpen = false;
  selectedDate: Date = new Date();
  eventTitle = '';
  notify = false;
  notifyTime: Date = new Date();
  editingEvent: CalendarEvent | null = null;

  // 控制顯示模式
  showList = false;

  constructor(private http: HttpClient) {
    this.loadEvents();
  }
  getToday(): Date {
  return new Date();
  }

  // 讀取所有事件
  loadEvents() {
    this.http.get<CalendarEvent[]>('/api/events').subscribe(res => {
      this.events = res.map(e => ({
        start: startOfDay(new Date(e.start)),
        title: e.title,
        meta: { id: e.id, notify: e.notify, notifyTime: new Date(e.notify_time) }
      }));
    });
  }

  toggleView() {
    this.showList = !this.showList;
  }

  openAddModal(date: Date) {
    this.modalOpen = true;
    this.selectedDate = date;
    this.eventTitle = '';
    this.notify = false;
    this.notifyTime = date;
    this.editingEvent = null;
  }

  openEditModal(event: CalendarEvent) {
    this.modalOpen = true;
    this.selectedDate = event.start;
    this.eventTitle = event.title!;
    this.notify = !!(event.meta?.notify);
    this.notifyTime = event.meta?.notifyTime || event.start;
    this.editingEvent = event;
  }

  saveEvent() {
    const payload = {
      title: this.eventTitle,
      start: this.selectedDate.toISOString(),
      notify: this.notify,
      notify_time: this.notifyTime.toISOString(),
      user_id: ''
    };

    if (this.editingEvent) {
      this.http.post(`/api/events/${this.editingEvent.meta?.id}`, payload).subscribe(() => this.loadEvents());
    } else {
      this.http.post('/api/events', payload).subscribe(() => this.loadEvents());
    }
    this.modalOpen = false;
  }

  deleteEvent(eventId?: number) {
    if (!eventId && this.editingEvent) eventId = this.editingEvent.meta?.id;
    if (eventId) {
      this.http.delete(`/api/events/${eventId}`).subscribe(() => this.loadEvents());
      this.modalOpen = false;
    }
  }
}
