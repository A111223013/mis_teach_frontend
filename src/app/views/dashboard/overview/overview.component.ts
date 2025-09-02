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
import { FlatpickrDirective } from 'angularx-flatpickr';


interface MyCalendarEvent extends CalendarEvent {
  meta: {
    id?: number;
    notify?: boolean;
    notifyTime?: Date | null;
  };
}

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
        FlatpickrDirective,
    ]
})
export class OverviewComponent implements OnInit {
  userName: string = "";
  currentDate: Date = new Date();
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  

  modalOpen : boolean= false;
  selectedDate: Date | null = new Date();
  eventTitle: string = '';
  notify: boolean = false;
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

  openEditModal(event: CalendarEvent<any>) {
  const myEvent: MyCalendarEvent = {
    ...event,
    meta: {
      id: event.meta?.id,
      notify: event.meta?.notify ?? false,
      notifyTime: event.meta?.notifyTime ?? event.start
    }
  };

  this.modalOpen = true;
  this.selectedDate = myEvent.start;
  this.eventTitle = myEvent.title!;
  this.notify = !!myEvent.meta.notify;
  this.notifyTime = myEvent.meta.notifyTime ?? null;
  this.editingEvent = myEvent;
}
  saveEvent() {
  if (!this.selectedDate) return;

  // 準備事件資料
  const newEvent: MyCalendarEvent = {
      start: startOfDay(this.selectedDate),
      title: this.eventTitle,
      meta: {
        id: this.editingEvent?.meta?.id,
        notify: this.notify,
        notifyTime: this.notifyTime,
      },
    };

    if (this.editingEvent) {
      Object.assign(this.editingEvent, newEvent);
    } else {
      this.events.push(newEvent);
    }

    // 發送到後端
    this.http.post('/date/events', newEvent).subscribe((res: any) => {
      // 如果是新增事件，後端會回傳 id
      if (!this.editingEvent && res.id) {
        newEvent.meta.id = res.id;
      }
    });

    this.closeModal();
  }

  deleteEvent() {
    if (!this.editingEvent) return;

    const eventId = this.editingEvent.meta?.id;
    this.events = this.events.filter(e => e !== this.editingEvent);

    if (eventId) {
      this.http.delete(`/date/events/${eventId}`).subscribe();
    }

    this.closeModal();
  }

  closeModal() {
    this.modalOpen = false;
  }
}
