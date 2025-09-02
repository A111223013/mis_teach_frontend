import { Component, OnInit, } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  CardComponent, CardBodyComponent,
  ContainerComponent, 
  ListGroupModule,
  TableModule
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilUser } from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';
import { FormsModule } from '@angular/forms';
import { CalendarModule, CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, addDays, subDays } from 'date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        DatePipe,
        CardComponent,
        CardBodyComponent,
        ContainerComponent,
        IconDirective,
        ListGroupModule,
        TableModule,
        FormsModule,
        CalendarModule,
        NgbModalModule,
        HttpClientModule,
        FlatpickrModule,
    ]
})
export class OverviewComponent implements OnInit {
  userName: string = "";
  currentDate: Date = new Date();
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
  

  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService,
    private http: HttpClient
  ) { 
    iconSetService.icons = { cilUser };
    Chart.register(...registerables);
  }

  // 控制列功能
  goToday() { this.viewDate = new Date(); }
  prev() { this.viewDate = subDays(this.viewDate, 1); }
  next() { this.viewDate = addDays(this.viewDate, 1); }
  // demo.component.ts
  goTodayDate(): Date {
  return new Date();
}
  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.dashboardService.getUserInfo().subscribe(
      (data: any) => {
        this.userName = data.name;
      },
      (error: any) => {
        console.error('Error fetching user info:', error);
      }
    );
  }
  // Modal 新增/編輯日曆
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

