import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule, CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, addDays, subDays } from 'date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-date',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    NgbModalModule,
    HttpClientModule,
    FlatpickrModule,
  ],
})
export class DemoComponent {
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  

  modalOpen = false;
  selectedDate: Date | null = new Date();
  eventTitle = '';
  notify = false;
  notifyTime: Date | null = new Date();
  editingEvent: CalendarEvent | null = null;

  constructor(private http: HttpClient) {}

  // 控制列功能
  goToday() { this.viewDate = new Date(); }
  prev() { this.viewDate = subDays(this.viewDate, 1); }
  next() { this.viewDate = addDays(this.viewDate, 1); }
  
goTodayDate(): Date {
  return new Date();
}


  // Modal 新增/編輯
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
    this.eventTitle = event.title ?? '';
    this.notify = !!(event.meta?.notify);
    this.notifyTime = event.meta?.notifyTime ?? event.start;
    this.editingEvent = event;
  }

  saveEvent() {
    if (!this.selectedDate) return;

    const newEvent: CalendarEvent = {
      start: startOfDay(this.selectedDate),
      title: this.eventTitle,
      meta: { notify: this.notify, notifyTime: this.notifyTime },
    };

    if (this.editingEvent) Object.assign(this.editingEvent, newEvent);
    else this.events.push(newEvent);

    this.http.post('/api/events', newEvent).subscribe();
    this.closeModal();
  }

  deleteEvent() {
    if (!this.editingEvent) return;

    this.events = this.events.filter(e => e !== this.editingEvent);
    this.http.delete(`/api/events/${this.editingEvent.meta?.id}`).subscribe();
    this.closeModal();
  }

  closeModal() { this.modalOpen = false; }
}
