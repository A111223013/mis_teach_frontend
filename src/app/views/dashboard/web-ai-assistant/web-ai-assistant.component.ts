import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  CardModule,
  ButtonModule,
  BadgeModule,
  FormModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';
import { WebAiAssistantService, WebChatMessage, ChatResponse } from '../../../service/web-ai-assistant.service';
import { DetailedGuideService } from '../../../service/detailed-guide.service';
import { UserGuideStatusService } from '../../../service/user-guide-status.service';

@Component({
  selector: 'app-web-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    FormModule,
    IconDirective,
    MarkdownPipe
  ],
  templateUrl: './web-ai-assistant.component.html',
  styleUrls: ['./web-ai-assistant.component.scss']
})
export class WebAiAssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // 組件狀態
  isExpanded = false;
  isTyping = false;
  shouldScrollToBottom = false;
  currentMessage = '';
  
  // 聊天數據
  messages: WebChatMessage[] = [];
  
  // 快速操作選項
  quickActions = [
    { label: '網站導覽', action: 'guide', icon: 'cilMap' },
    { label: '學習進度', action: 'progress', icon: 'cilChart' },
    { label: '學習計畫', action: 'plan', icon: 'cilCalendar' },
    { label: '常見問題', action: 'faq', icon: 'cilHelp' }
  ];

  constructor(
    private webAiService: WebAiAssistantService,
    private detailedGuideService: DetailedGuideService,
    private userGuideStatusService: UserGuideStatusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeWelcomeMessage();
  }

  ngOnDestroy(): void {
    // 清理資源
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * 初始化歡迎訊息
   */
  private initializeWelcomeMessage(): void {
    if (this.messages.length === 0) {
      const welcomeMessage = '您好！我是您的網站助手。我可以幫您：\n\n• 🗺️ 網站導覽和功能介紹\n• 📊 查看學習進度和統計\n• 📅 制定個人學習計畫\n• ❓ 解答網站使用問題\n\n有什麼可以幫助您的嗎？';
      this.addMessage('assistant', welcomeMessage);
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
    }
  }


  /**
   * 切換展開狀態
   */
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    
    if (this.isExpanded) {
      setTimeout(() => {
        this.focusInput();
        this.scrollToBottom();
      }, 100);
    }
  }

  /**
   * 發送訊息
   */
  sendMessage(): void {
    const message = this.currentMessage.trim();
    
    if (!message || this.isTyping) {
      return;
    }

    // 添加用戶訊息
    this.addMessage('user', message);
    this.currentMessage = '';
    this.isTyping = true;

    this.webAiService.sendMessage(message).subscribe({
      next: (response: ChatResponse) => {
        if (response.success) {
          this.addMessage('assistant', response.content);
        } else {
          this.addMessage('assistant', '抱歉，處理您的請求時發生錯誤。請稍後再試。');
        }
        this.isTyping = false;
        this.focusInput();
      },
      error: (error) => {
        this.addMessage('assistant', '抱歉，目前無法連接到AI助手。請稍後再試或聯繫管理員。');
        this.isTyping = false;
        this.focusInput();
      }
    });
  }

  /**
   * 快速操作
   */
  quickAction(action: string): void {
    let message = '';
    
    switch (action) {
      case 'guide':
        message = '請為我介紹網站的主要功能';
        break;
      case 'progress':
        message = '我想查看我的學習進度';
        break;
      case 'plan':
        message = '請為我制定學習計畫';
        break;
      case 'faq':
        message = '有什麼常見問題嗎？';
        break;
    }
    
    if (message) {
      this.currentMessage = message;
      this.sendMessage();
    }
  }

  /**
   * 處理 Enter 鍵
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * 添加訊息
   */
  private addMessage(type: 'user' | 'assistant', content: string): void {
    const message: WebChatMessage = {
      id: this.webAiService.generateId(),
      type,
      content,
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.shouldScrollToBottom = true;
    
    // 強制變更檢測
    this.cdr.detectChanges();
  }

  /**
   * 滾動到底部
   */
  private scrollToBottom(): void {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
  }

  /**
   * 聚焦輸入框
   */
  private focusInput(): void {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
  }

  /**
   * TrackBy 函數
   */
  trackByMessageId(_index: number, message: WebChatMessage): string {
    return message.id;
  }

  /**
   * 格式化時間
   */
  formatTime(date: Date): string {
    return this.webAiService.formatTime(date);
  }
}
