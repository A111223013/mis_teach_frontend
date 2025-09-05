import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, inject } from '@angular/core';
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
  cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash 
} from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { Chart, registerables } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';
import { FormsModule } from '@angular/forms';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
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
    JsonPipe,
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

  modalData: {
    action: string;
    event: CalendarEvent;
  } = {
    action: '',
    event: {} as CalendarEvent
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
    eventDate: new Date(),
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

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService
  ) { 
    iconSetService.icons = { 
      cilUser, cilPlus, cilChevronLeft, cilChevronRight, cilCalendar, 
      cilClock, cilNotes, cilBell, cilCheck, cilX, cilPencil, cilTrash 
    };
    Chart.register(...registerables);
  }
    
  ngOnInit(): void {
    this.getUserInfo();
    this.loadEvents();
    // 更新所有事件的顏色
    this.updateAllEventColors();
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
    // 初始化為空的事件列表
    this.events = [];
    
    // 未來可以從後端 API 載入真實數據
    // this.dashboardService.getEvents().subscribe(events => {
    //   this.events = events;
    //   this.updateAllEventColors();
    // });
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
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
      content: event.meta?.content || '',
      eventDate: event.start,
      notifyEnabled: event.meta?.notifyEnabled || false,
      notifyTime: event.meta?.notifyTime ? new Date(event.meta.notifyTime) : new Date()
    };
  }

  resetNewEventForm(): void {
    this.newEventForm = {
      title: '',
      content: '',
      eventDate: this.selectedDate,
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
    if (event.meta?.notifyEnabled && event.meta?.notifyTime) {
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
    this.newEventForm.eventDate = new Date(dateString);
  }

  updateNotifyTime(timeString: string): void {
    const [hours, minutes] = timeString.split(':');
    const notifyTime = new Date(this.newEventForm.eventDate);
    notifyTime.setHours(parseInt(hours), parseInt(minutes));
    this.newEventForm.notifyTime = notifyTime;
  }

  saveEvent(): void {
    // 驗證表單
    if (!this.validateForm()) {
      return;
    }
    
    if (this.modalMode === 'add') {
        // 新增事件
        const newEvent: CalendarEvent = {
          title: this.newEventForm.title.trim(),
          start: startOfDay(this.newEventForm.eventDate),
          end: endOfDay(this.newEventForm.eventDate),
          color: colors['green'], // 初始顏色，會在下面更新
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          meta: {
            content: this.newEventForm.content,
            notifyEnabled: this.newEventForm.notifyEnabled,
            notifyTime: this.newEventForm.notifyTime
          }
        };
        
        // 根據通知狀態設置正確的顏色
        newEvent.color = this.getEventColor(newEvent);
        this.events = [...this.events, newEvent];
        this.modalMode = 'list';
        this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
      } else if (this.modalMode === 'edit' && this.selectedEvent) {
        // 更新事件
        const updatedEvent: CalendarEvent = {
          ...this.selectedEvent,
          title: this.newEventForm.title.trim(),
          start: startOfDay(this.newEventForm.eventDate),
          end: endOfDay(this.newEventForm.eventDate),
          color: colors['green'], // 初始顏色，會在下面更新
          meta: {
            content: this.newEventForm.content,
            notifyEnabled: this.newEventForm.notifyEnabled,
            notifyTime: this.newEventForm.notifyTime
          }
        };
        
        // 根據通知狀態設置正確的顏色
        updatedEvent.color = this.getEventColor(updatedEvent);
        this.events = this.events.map(event => 
          event === this.selectedEvent ? updatedEvent : event
        );
        this.modalMode = 'list';
        this.selectedDateEvents = this.getEventsForDate(this.selectedDate);
      }
    }
  

  deleteSelectedEvent(): void {
    if (this.selectedEvent) {
      this.events = this.events.filter((event) => event !== this.selectedEvent);
      this.closeEventModal();
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }



  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
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

  goTodayDate(): Date {
    return new Date();
  }
}