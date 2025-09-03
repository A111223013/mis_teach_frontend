import { Component, OnInit, } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CardComponent, CardBodyComponent,
  ContainerComponent, 
  ListGroupModule,
  TableModule,
  ModalModule,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { 
  cilUser, cilPlus, cilChevronLeft, cilChevronRight, cilCalendar, 
  cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash 
} from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';
import { FormsModule } from '@angular/forms';
// 移除 angular-calendar 和 date-fns 依賴，使用原生 JavaScript
import { HttpClientModule, HttpClient } from '@angular/common/http';


interface CalendarEvent {
  start: Date;
  title: string;
  meta?: {
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
        ModalModule,
        BadgeComponent,
        FormsModule,
        HttpClientModule,
    ]
})
export class OverviewComponent implements OnInit {
  userName: string = "";
  currentDate: Date = new Date();
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  
  modalOpen: boolean = false;
  dayEventsModalOpen: boolean = false;
  selectedDate: Date = new Date();
  selectedDateString: string = '';
  eventTitle: string = '';
  notify: boolean = false;
  notifyTime: Date | null = new Date();
  notifyTimeString: string = '';
  editingEvent: CalendarEvent | null = null;
  weekDays: string[] = ['日', '一', '二', '三', '四', '五', '六'];

  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService,
    private http: HttpClient
  ) { 
    iconSetService.icons = { 
      cilUser, cilPlus, cilChevronLeft, cilChevronRight, cilCalendar, 
      cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash 
    };
    Chart.register(...registerables);
  }
    
  // 控制列功能
  goToday() { this.viewDate = new Date(); }
  
  prevMonth() { 
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.viewDate = newDate;
  }
  
  nextMonth() { 
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.viewDate = newDate;
  }
  // demo.component.ts
  goTodayDate(): Date {
  return new Date();
}
  ngOnInit(): void {
    this.getUserInfo();
    this.loadEvents();
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

  loadEvents(): void {
    // 載入用戶的行事曆事件
    this.http.get('/dashboard/calendar/events').subscribe(
      (data: any) => {
        this.events = data.events || [];
      },
      (error: any) => {
        console.error('Error loading events:', error);
        // 載入模擬數據
        this.loadMockEvents();
      }
    );
  }

  loadMockEvents(): void {
    // 移除模擬數據，使用空陣列
    this.events = [];
  }
  // Modal 新增/編輯日曆
  openAddModal(date: Date) {
    this.modalOpen = true;
    this.selectedDate = date;
    this.selectedDateString = this.formatDateForInput(date);
    this.eventTitle = '';
    this.notify = false;
    this.notifyTime = date;
    this.notifyTimeString = this.formatDateTimeForInput(date);
    this.editingEvent = null;
  }

  openEditModal(event: CalendarEvent) {
    this.modalOpen = true;
    this.selectedDate = event.start;
    this.selectedDateString = this.formatDateForInput(event.start);
    this.eventTitle = event.title || '';
    this.notify = !!(event.meta as any)?.notify;
    this.notifyTime = (event.meta as any)?.notifyTime ?? null;
    this.notifyTimeString = this.formatDateTimeForInput((event.meta as any)?.notifyTime ?? event.start);
    this.editingEvent = event;
  }
  saveEvent() {
    if (!this.selectedDateString || !this.eventTitle.trim()) {
      alert('請填寫完整的備忘錄資訊');
      return;
    }

    // 轉換字串為日期
    const eventDate = new Date(this.selectedDateString);
    const notifyDateTime = this.notifyTimeString ? new Date(this.notifyTimeString) : null;

    // 準備事件資料
    const newEvent: CalendarEvent = {
      start: eventDate,
      title: this.eventTitle,
      meta: {
        id: (this.editingEvent?.meta as any)?.id,
        notify: this.notify,
        notifyTime: notifyDateTime,
      },
    };

    if (this.editingEvent) {
      // 編輯現有事件
      const index = this.events.findIndex(e => e === this.editingEvent);
      if (index !== -1) {
        this.events[index] = newEvent;
      }
      
      // 發送到後端更新
      this.http.put(`/dashboard/calendar/events/${(this.editingEvent.meta as any)?.id}`, newEvent).subscribe(
        (res: any) => {
          console.log('Event updated successfully');
        },
        (error: any) => {
          console.error('Error updating event:', error);
        }
      );
    } else {
      // 新增事件
      this.events.push(newEvent);
      
      // 發送到後端新增
      this.http.post('/dashboard/calendar/events', newEvent).subscribe(
        (res: any) => {
          // 後端回傳 id
          if (res.id) {
            (newEvent.meta as any).id = res.id;
          }
          console.log('Event created successfully');
        },
        (error: any) => {
          console.error('Error creating event:', error);
        }
      );
    }

    this.closeModal();
  }

  deleteEvent() {
    if (!this.editingEvent) return;

    if (confirm('確定要刪除此事件嗎？')) {
      const eventId = (this.editingEvent.meta as any)?.id;
      
      // 從本地陣列移除
      this.events = this.events.filter(e => e !== this.editingEvent);

      // 發送到後端刪除
      if (eventId) {
        this.http.delete(`/dashboard/calendar/events/${eventId}`).subscribe(
          (res: any) => {
            console.log('Event deleted successfully');
          },
          (error: any) => {
            console.error('Error deleting event:', error);
          }
        );
      }
      
      this.closeModal();
    }
  }

  closeModal() {
    this.modalOpen = false;
  }

  // 日期格式化方法
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // 行事曆相關方法
  getCalendarDays(): any[] {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    
    // 取得當月第一天和最後一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 取得第一天是星期幾（0=星期日）
    const firstDayOfWeek = firstDay.getDay();
    
    // 建立行事曆陣列
    const days = [];
    
    // 添加上個月的天數
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i - 1);
      days.push({
        date: date,
        dayNumber: date.getDate(),
        isCurrentMonth: false
      });
    }
    
    // 添加當月的天數
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date: date,
        dayNumber: day,
        isCurrentMonth: true
      });
    }
    
    // 添加下個月的天數，填滿6週
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date: date,
        dayNumber: day,
        isCurrentMonth: false
      });
    }
    
    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate.getMonth() && 
           date.getFullYear() === this.viewDate.getFullYear();
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  // 新的事件 Modal 方法
  openEventModal(date: Date, event?: any): void {
    this.selectedDate = date;
    this.dayEventsModalOpen = true;
  }

  closeDayEventsModal(): void {
    this.dayEventsModalOpen = false;
  }

  deleteEventDirect(event: CalendarEvent): void {
    if (confirm('確定要刪除此事件嗎？')) {
      const eventId = (event.meta as any)?.id;
      
      // 從本地陣列移除
      this.events = this.events.filter(e => e !== event);

      // 發送到後端刪除
      if (eventId) {
        this.http.delete(`/dashboard/calendar/events/${eventId}`).subscribe(
          (res: any) => {
            console.log('Event deleted successfully');
          },
          (error: any) => {
            console.error('Error deleting event:', error);
          }
        );
      }
    }
  }

  // 輔助方法：取得今天的日期
  getTodayDate(): Date {
    return new Date();
  }
}