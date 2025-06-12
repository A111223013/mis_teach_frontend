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
      content: `🎮 **開始網站導覽！**\n\n歡迎 ${statusText}！我將為您詳細介紹網站的各項功能：\n\n• 📊 **儀表板** - 學習控制中心和統計概覽\n• 👥 **學生功能** - 考古題練習和學習記錄\n• 📝 **測驗系統** - 考古題練習和測驗功能\n• 🤖 **AI 導師** - 智能學習指導和問答\n• 🔧 **系統功能** - 各種實用工具\n\n請注意螢幕上的頭像指引和詳細說明！導覽將在 2 秒後開始...`,
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
   * 處理一般請求 - 簡化版本
   */
  private async handleGeneralRequest(message: string): Promise<{content: string, category: string}> {
    // 檢查是否為資管相關問題
    const isMISRelated = this.isMISRelatedQuestion(message);

    if (isMISRelated) {
      // 資管相關問題，建議使用 AI 導師
      return {
        content: `🤖 **資管相關問題檢測**\n\n您的問題似乎與資訊管理相關！為了獲得更專業和深入的解答，建議您：\n\n• 🎯 **使用 AI 導師** - 點擊左側選單的「AI 導師」\n• 📚 **專業解答** - AI 導師專門針對 MIS 課程設計\n• 💡 **深度學習** - 提供概念解釋和實例分析\n\n**快速前往**：左側選單 → AI 導師 → 輸入您的問題\n\n當然，如果您有網站使用上的問題，我也很樂意為您解答！`,
        category: 'mis_redirect'
      };
    } else {
      // 網站功能相關問題，提供預設回答
      return this.getWebsiteHelpResponse(message);
    }
  }

  /**
   * 判斷是否為資管相關問題
   */
  private isMISRelatedQuestion(message: string): boolean {
    const misKeywords = [
      '資訊管理', '資管', 'MIS', '管理資訊系統', '資訊系統',
      '資料庫', '系統分析', '系統設計', '企業資源規劃', 'ERP',
      '決策支援系統', 'DSS', '專家系統', '知識管理',
      '電子商務', '供應鏈管理', 'SCM', '客戶關係管理', 'CRM',
      '商業智慧', 'BI', '資料探勘', '大數據', '雲端運算',
      '資訊安全', '網路管理', '專案管理', '流程管理'
    ];

    return misKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * 獲取網站幫助回應
   */
  private getWebsiteHelpResponse(message: string): {content: string, category: string} {
    // 根據關鍵詞提供不同的回應
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('導覽') || lowerMessage.includes('介紹') || lowerMessage.includes('功能')) {
      return {
        content: `🗺️ **網站功能介紹**\n\n我們的 MIS 教學系統包含以下主要功能：\n\n• 📊 **概覽頁面** - 學習統計和系統總覽\n• 👥 **學生功能** - 考古題練習、錯題複習\n• 🤖 **AI 導師** - 專業的 MIS 課程指導\n• 📝 **測驗系統** - 各種題型的練習和測驗\n• 📋 **學習分析** - 成績統計和學習建議\n\n點擊「網站導覽」按鈕可以獲得詳細的功能介紹！`,
        category: 'website_guide'
      };
    } else if (lowerMessage.includes('怎麼用') || lowerMessage.includes('如何') || lowerMessage.includes('操作')) {
      return {
        content: `🔧 **使用指導**\n\n關於「${message}」的操作方法：\n\n• 🎯 **新用戶** - 建議先點擊「網站導覽」了解系統\n• 📚 **學習** - 使用左側選單的「學生」功能練習考古題\n• 🤖 **問答** - 有 MIS 問題可以使用「AI 導師」\n• 📊 **查看進度** - 在概覽頁面查看學習統計\n\n需要更詳細的操作指導嗎？`,
        category: 'usage_help'
      };
    } else if (lowerMessage.includes('問題') || lowerMessage.includes('錯誤') || lowerMessage.includes('bug')) {
      return {
        content: `🛠️ **問題排解**\n\n遇到問題了嗎？讓我幫您：\n\n• 🔄 **重新整理** - 嘗試重新載入頁面\n• 🧭 **重新導覽** - 點擊「網站導覽」重新了解功能\n• 📱 **瀏覽器** - 建議使用 Chrome 或 Edge 瀏覽器\n• 🤖 **AI 協助** - 如果是學習問題，可以詢問 AI 導師\n\n具體遇到什麼問題呢？請詳細描述一下。`,
        category: 'troubleshooting'
      };
    } else {
      return {
        content: `🤖 **網站助手**\n\n您好！我是您的網站助手，可以幫助您：\n\n• 🗺️ **了解網站功能** - 各模組的使用方法\n• 📊 **查看學習進度** - 成績統計和分析\n• 📅 **制定學習計畫** - 個人化學習建議\n• ❓ **解答使用疑問** - 操作相關問題\n\n如果您有 MIS 專業問題，建議使用「AI 導師」功能獲得更專業的指導！\n\n還有什麼我可以幫助您的嗎？`,
        category: 'general_help'
      };
    }
  }

  /**
   * 獲取操作描述
   */
  getActionDescription(action: string): string {
    switch (action) {
      case 'guide':
        return '了解系統功能和使用方法';
      case 'progress':
        return '查看學習統計和成績分析';
      case 'plan':
        return '制定個人化學習計畫';
      case 'faq':
        return '常見問題和使用技巧';
      default:
        return '點擊開始';
    }
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
