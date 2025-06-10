import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import {
  CardModule,
  ButtonModule,
  BadgeModule,
  FormModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarkdownPipe } from '../../../pipes/markdown.pipe';
import { DetailedGuideService } from '../../../service/detailed-guide.service';
import { UserGuideStatusService } from '../../../service/user-guide-status.service';

export interface WebChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'guide' | 'progress' | 'plan' | 'general';
}

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
    private detailedGuideService: DetailedGuideService,
    private userGuideStatusService: UserGuideStatusService
  ) {}

  ngOnInit(): void {
    // 初始化歡迎訊息
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
      this.addMessage('assistant', '您好！我是您的網站助手。我可以幫您：\n\n• 🗺️ 網站導覽和功能介紹\n• 📊 查看學習進度和統計\n• 📅 制定個人學習計畫\n• ❓ 解答網站使用問題\n\n有什麼可以幫助您的嗎？', 'general');
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
  async sendMessage(): Promise<void> {
    const message = this.currentMessage.trim();
    if (!message || this.isTyping) {
      return;
    }

    // 添加用戶訊息
    this.addMessage('user', message);
    this.currentMessage = '';
    this.isTyping = true;

    try {
      // 根據訊息內容判斷類型並處理
      const response = await this.processMessage(message);
      this.addMessage('assistant', response.content, response.category);
    } catch (error) {
      console.error('發送訊息失敗:', error);
      this.addMessage('assistant', '抱歉，處理您的請求時發生錯誤。請稍後再試。', 'general');
    } finally {
      this.isTyping = false;
      this.focusInput();
    }
  }

  /**
   * 處理訊息
   */
  private async processMessage(message: string): Promise<{content: string, category: string}> {
    const lowerMessage = message.toLowerCase();

    // 網站導覽相關
    if (lowerMessage.includes('導覽') || lowerMessage.includes('介紹') || lowerMessage.includes('功能')) {
      return await this.handleGuideRequest(message);
    }

    // 學習進度相關
    if (lowerMessage.includes('進度') || lowerMessage.includes('統計') || lowerMessage.includes('成績')) {
      return await this.handleProgressRequest(message);
    }

    // 學習計畫相關
    if (lowerMessage.includes('計畫') || lowerMessage.includes('規劃') || lowerMessage.includes('建議')) {
      return await this.handlePlanRequest(message);
    }

    // 一般問題
    return await this.handleGeneralRequest(message);
  }

  /**
   * 處理導覽請求
   */
  private async handleGuideRequest(_message: string): Promise<{content: string, category: string}> {
    // 檢查用戶狀態
    const userStatus = this.userGuideStatusService.getCurrentStatus();

    // 延遲關閉聊天視窗，讓用戶看到回應
    setTimeout(() => {
      this.isExpanded = false;
    }, 2000);

    // 延遲開始詳細導覽，讓聊天視窗先關閉
    setTimeout(() => {
      this.detailedGuideService.startDetailedGuide();
    }, 2500);

    const statusText = userStatus?.new_user ? '新用戶' : '返回用戶';

    return {
      content: `🎮 **開始網站導覽！**\n\n歡迎 ${statusText}！我將為您詳細介紹網站的各項功能：\n\n• 📊 **儀表板** - 學習控制中心和統計概覽\n• 👥 **學生管理** - 學生資訊和學習記錄\n• 📝 **測驗系統** - 考古題練習和測驗功能\n• 🤖 **AI 導師** - 智能學習指導和問答\n• 🔧 **系統功能** - 各種實用工具\n\n請注意螢幕上的頭像指引和詳細說明！導覽將在 2 秒後開始...`,
      category: 'guide'
    };
  }

  /**
   * 處理進度請求
   */
  private async handleProgressRequest(_message: string): Promise<{content: string, category: string}> {
    // 這裡可以調用後端 API 獲取真實的學習進度
    return {
      content: '📊 **您的學習進度概覽**\n\n• 已完成測驗：5 次\n• 平均分數：85 分\n• 學習時間：12 小時\n• 強項科目：資料庫管理\n• 需要加強：系統分析\n\n💡 建議您多練習系統分析相關的題目，可以提升整體表現！',
      category: 'progress'
    };
  }

  /**
   * 處理計畫請求
   */
  private async handlePlanRequest(_message: string): Promise<{content: string, category: string}> {
    return {
      content: '📅 **個人化學習計畫建議**\n\n**本週目標：**\n• 完成 3 次測驗練習\n• 複習系統分析章節\n• 與 AI 導師討論疑難問題\n\n**學習路徑：**\n1. 基礎概念複習 (2天)\n2. 實作練習 (3天)\n3. 綜合測驗 (2天)\n\n需要我為您制定更詳細的計畫嗎？',
      category: 'plan'
    };
  }

  /**
   * 處理一般請求
   */
  private async handleGeneralRequest(_message: string): Promise<{content: string, category: string}> {
    return {
      content: '我理解您的問題。作為您的網站助手，我可以幫助您：\n\n• 🗺️ 了解網站功能和使用方法\n• 📊 查看學習進度和成績分析\n• 📅 制定個人學習計畫\n• ❓ 解答使用上的疑問\n\n請告訴我您具體需要什麼幫助？',
      category: 'general'
    };
  }

  /**
   * 快速操作
   */
  quickAction(action: string): void {
    switch (action) {
      case 'guide':
        this.currentMessage = '請為我介紹網站的主要功能';
        break;
      case 'progress':
        this.currentMessage = '我想查看我的學習進度';
        break;
      case 'plan':
        this.currentMessage = '請為我制定學習計畫';
        break;
      case 'faq':
        this.currentMessage = '有什麼常見問題嗎？';
        break;
    }
    this.sendMessage();
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
  private addMessage(type: 'user' | 'assistant', content: string, category: string = 'general'): void {
    const message: WebChatMessage = {
      id: this.generateId(),
      type,
      content,
      timestamp: new Date(),
      category: category as any
    };
    
    this.messages.push(message);
    this.shouldScrollToBottom = true;
  }

  /**
   * 滾動到底部
   */
  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.warn('無法滾動到底部:', err);
    }
  }

  /**
   * 聚焦輸入框
   */
  private focusInput(): void {
    try {
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    } catch (err) {
      console.warn('無法聚焦輸入框:', err);
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  /**
   * 格式化時間
   */
  formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * 獲取類別圖標
   */
  getCategoryIcon(category?: string): string {
    switch (category) {
      case 'guide': return 'cilMap';
      case 'progress': return 'cilChart';
      case 'plan': return 'cilCalendar';
      default: return 'cilSpeech';
    }
  }

  /**
   * TrackBy 函數
   */
  trackByMessageId(_index: number, message: WebChatMessage): string {
    return message.id;
  }
}
