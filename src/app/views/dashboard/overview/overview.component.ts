import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CardComponent, CardBodyComponent,
  ContainerComponent, 
  ListGroupModule,
  TableModule,
  ModalModule,
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { 
  cilUser, cilPlus, cilChevronLeft, cilChevronRight, cilCalendar, 
  cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash,
  cilChart, cilTask, cilWarning, cilNewspaper, cilSpeedometer, cilSchool
} from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { OverviewService } from '../../../service/overview.service';
import { Chart, registerables } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';
import { FormsModule } from '@angular/forms';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarView,
  CalendarModule,
  DateAdapter,
  CalendarA11y,
  CalendarEventTitleFormatter,
  CalendarUtils,
  CalendarDateFormatter,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#28a745',
    secondary: '#D4EDDA',
  },
};

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        FormsModule,
    CalendarModule,
  ],
  providers: [
    provideFlatpickrDefaults(),
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    CalendarA11y,
    CalendarEventTitleFormatter,
    CalendarUtils,
    CalendarDateFormatter,
    ]
})
export class OverviewComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  userName: string = "";
  currentDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>();

  // 頭條新聞
  topNews: any[] = [];

  // 簽到狀態
  checkinStatus = {
    checked_today: false,
    checkin_streak: 0,
    total_checkin_days: 0,
    last_checkin_date: ''
  };


  // 統一的 modal 相關屬性
  showEventModal: boolean = false;
  modalMode: 'list' | 'add' | 'edit' = 'list';
  selectedEvent: CalendarEvent | null = null;
  selectedDate: Date = new Date();
  selectedDateEvents: CalendarEvent[] = [];
  
  // 新增事件表單
  newEventForm = {
    title: '',
    content: '',
    eventDate: '',
    notifyEnabled: false,
    notifyTime: new Date()
  };

  // 表單驗證狀態
  formErrors = {
    title: false,
    content: false,
    eventDate: false,
    notifyTime: false
  };

  // 讓 colors 在模板中可用
  colors = colors;


  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService,
    private overviewService: OverviewService,
    private cdr: ChangeDetectorRef
  ) { 
    const existingIcons = iconSetService.icons || {};
    iconSetService.icons = {
      ...existingIcons,
      ...{ cilUser, cilPlus, cilChevronLeft, cilChevronRight, cilCalendar, 
      cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash,
      cilChart, cilTask, cilWarning, cilNewspaper, cilSpeedometer, cilSchool }
    };
    Chart.register(...registerables);
  }
    
  ngOnInit(): void {
    this.getUserInfo();
    this.loadEvents();
    this.loadTopNews();
    this.loadCheckinStatus();
    // 自動執行簽到
    this.autoCheckin();
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
    this.overviewService.getCalendarEvents().subscribe({
      next: (response: any) => {
        console.log('✅ 成功載入行事曆事件:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        this.events = response.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          content: event.content || '',
          start: new Date(event.start),
          end: new Date(event.start),
          allDay: true,
          color: this.getEventColor({
            id: event.id,
            title: event.title,
            start: new Date(event.start),
            notifyEnabled: event.notifyEnabled,
            notifyTime: event.notifyTime ? new Date(event.notifyTime) : null
          } as CalendarEvent),
          notifyEnabled: event.notifyEnabled,
          notifyTime: event.notifyTime ? new Date(event.notifyTime) : null
        }));
        this.updateAllEventColors();
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ 載入行事曆事件失敗:', error);
        // 如果 API 失敗，使用空陣列
    this.events = [];
        this.cdr.detectChanges();
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      
      // 點擊日期時打開事件清單 modal
      this.openEventListModal(date);
    }
  }


  handleEvent(action: string, event: CalendarEvent): void {
    this.selectedEvent = event;
    this.modalMode = 'list';
    this.showEventModal = true;
    console.log('Event action:', action, event);
  }

  // 點擊日期開啟事件清單 modal
  openEventListModal(date: Date): void {
    this.selectedDate = date;
    this.selectedDateEvents = this.getEventsForDate(date);
    this.modalMode = 'list';
    this.showEventModal = true;
  }

  addEvent(): void {
    this.modalMode = 'add';
    this.selectedEvent = null;
    this.resetNewEventForm();
  }

  // 行事曆區塊的新增事件按鈕
  openAddEventFromCalendar(): void {
    this.selectedDate = new Date();
    this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
    this.modalMode = 'add';
    this.selectedEvent = null;
    this.resetNewEventForm();
    this.showEventModal = true;
  }

  // 編輯事件按鈕點擊
  editEvent(event: CalendarEvent): void {
    this.modalMode = 'edit';
    this.selectedEvent = event;
    this.newEventForm = {
      title: event.title,
      content: (event as any).content || '',
      eventDate: event.start.toISOString().split('T')[0],
      notifyEnabled: (event as any).notifyEnabled || false,
      notifyTime: (event as any).notifyTime ? new Date((event as any).notifyTime) : new Date()
    };
  }

  resetNewEventForm(): void {
    // 使用本地時間格式化選中的日期，避免時區轉換
    const year = this.selectedDate.getFullYear();
    const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(this.selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    this.newEventForm = {
      title: '',
      content: '',
      eventDate: dateStr,
      notifyEnabled: false,
      notifyTime: new Date()
    };
    this.resetFormErrors();
  }

  // 獲取特定日期的事件
  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => 
      isSameDay(event.start, date)
    );
  }

  // 根據通知狀態決定事件顏色
  getEventColor(event: CalendarEvent): EventColor {
    const today = new Date();
    const eventDate = event.start;
    
    // 如果有設置通知時間
    if ((event as any).notifyEnabled && (event as any).notifyTime) {
      // 如果事件日期是今天，使用紅色（緊急）
      if (isSameDay(eventDate, today)) {
        return colors['red'];
      }
      return colors['yellow'];
    }
    
    return colors['green'];
  }

  // 更新所有事件的顏色
  updateAllEventColors(): void {
    this.events = this.events.map(event => ({
      ...event,
      color: this.getEventColor(event)
    }));
  }

  // 驗證表單
  validateForm(): boolean {
    this.formErrors = {
      title: !this.newEventForm.title || this.newEventForm.title.trim() === '',
      content: !this.newEventForm.content || this.newEventForm.content.trim() === '',
      eventDate: !this.newEventForm.eventDate,
      notifyTime: this.newEventForm.notifyEnabled && (!this.newEventForm.notifyTime)
    };

    return !Object.values(this.formErrors).some(error => error);
  }

  // 重置表單驗證狀態
  resetFormErrors(): void {
    this.formErrors = {
      title: false,
      content: false,
      eventDate: false,
      notifyTime: false
    };
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.modalMode = 'list';
    this.selectedEvent = null;
    this.resetNewEventForm();
  }

  updateEventDate(dateString: string): void {
    // 直接使用字符串格式，避免 Date 對象的時區問題
    this.newEventForm.eventDate = dateString as any;
  }

  updateNotifyTime(timeString: string): void {
    // 使用本地時間構造 Date 對象，避免時區轉換
    const [hours, minutes] = timeString.split(':').map(Number);
    const eventDate = new Date(this.newEventForm.eventDate + 'T00:00:00');
    this.newEventForm.notifyTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      hours,
      minutes
    );
  }

  // 格式化本地時間為字符串，避免時區轉換
  formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  saveEvent(): void {
    // 驗證表單
    if (!this.validateForm()) {
      return;
    }

    const eventData = {
      title: this.newEventForm.title.trim(),
      content: this.newEventForm.content.trim(),
      start: this.newEventForm.eventDate + 'T00:00:00', // 本地時間格式
      notifyEnabled: this.newEventForm.notifyEnabled,
      notifyTime: this.newEventForm.notifyEnabled ? this.formatLocalDateTime(this.newEventForm.notifyTime) : null
    };

    if (this.modalMode === 'add') {
      // 新增事件
      this.overviewService.createCalendarEvent(eventData).subscribe({
        next: (response: any) => {
          console.log('✅ 事件新增成功:', response);
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // 重新載入事件列表
          this.loadEvents();
          this.modalMode = 'list';
          this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
          this.resetNewEventForm();
          
          // 關閉 modal
          this.showEventModal = false;
        },
        error: (error: any) => {
          console.error('❌ 新增事件失敗:', error);
          alert('新增事件失敗，請稍後再試');
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedEvent) {
      // 更新事件
      this.overviewService.updateCalendarEvent(Number(this.selectedEvent.id!), eventData).subscribe({
        next: (response: any) => {
          console.log('✅ 事件更新成功:', response);
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // 重新載入事件列表
          this.loadEvents();
          this.modalMode = 'list';
          this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
          this.resetNewEventForm();
          
          // 關閉 modal
          this.showEventModal = false;
        },
        error: (error: any) => {
          console.error('❌ 更新事件失敗:', error);
          alert('更新事件失敗，請稍後再試');
        }
      });
    }
  }
  

  deleteSelectedEvent(): void {
    if (!this.selectedEvent) {
      return;
    }

    if (confirm('確定要刪除這個事件嗎？')) {
      this.overviewService.deleteCalendarEvent(Number(this.selectedEvent.id!)).subscribe({
        next: (response: any) => {
          console.log('✅ 事件刪除成功:', response);
          
          // 更新 token
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // 重新載入事件列表
          this.loadEvents();
          this.closeEventModal();
        },
        error: (error: any) => {
          console.error('❌ 刪除事件失敗:', error);
          alert('刪除事件失敗，請稍後再試');
        }
      });
    }
  }





  // 控制列功能
  goToday() { 
    this.viewDate = new Date(); 
  }
  
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

  deleteEvent(eventId: number): void {
    this.overviewService.deleteCalendarEvent(eventId).subscribe({
      next: (response) => {
        console.log('✅ 事件刪除成功:', response);
        this.loadEvents();
        this.closeModal();
      },
      error: (error) => {
        console.error('❌ 刪除事件失敗:', error);
      }
    });
  }

  closeModal(): void {
    this.showEventModal = false;
  }

  loadTopNews(): void {
    this.overviewService.getTopNews().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.topNews = response.data.slice(0, 6);
        }
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('載入新聞失敗:', error);
        this.topNews = [];
      }
    });
  }

  getNewsUrl(href: string): string {
    if (!href) return '#';
    if (href.startsWith('http')) return href;
    return `https://www.ithome.com.tw${href}`;
  }

  getTags(tags: any): any[] {
    if (!tags) return [];
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return [];
      }
    }
    return Array.isArray(tags) ? tags : [];
  }

  formatNewsDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  loadCheckinStatus(): void {
    this.overviewService.getCheckinStatus().subscribe({
      next: (response: any) => {
        if (response) {
          this.checkinStatus = {
            checked_today: response.checked_today || false,
            checkin_streak: response.checkin_streak || 0,
            total_checkin_days: response.total_checkin_days || 0,
            last_checkin_date: response.last_checkin_date || ''
          };
        }
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('載入簽到狀態失敗:', error);
      }
    });
  }

  autoCheckin(): void {
    // 頁面載入時自動嘗試簽到
    this.overviewService.dailyCheckin().subscribe({
      next: (response: any) => {
        if (response && !response.already_checked) {
          // 簽到成功
          this.checkinStatus.checked_today = true;
          this.checkinStatus.checkin_streak = response.checkin_streak || 0;
          console.log('✅ 自動簽到成功');
        } else if (response && response.already_checked) {
          // 已經簽到了
          this.checkinStatus.checked_today = true;
          console.log('✅ 今日已簽到');
        }
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('自動簽到失敗:', error);
      }
    });
  }

  performCheckin(): void {
    if (this.checkinStatus.checked_today) {
      return; // 已經簽到了
    }

    this.overviewService.dailyCheckin().subscribe({
      next: (response: any) => {
        if (response) {
          this.checkinStatus.checked_today = true;
          this.checkinStatus.checkin_streak = response.checkin_streak || 0;
          console.log('✅ 簽到成功');
        }
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('簽到失敗:', error);
      }
    });
  }

}