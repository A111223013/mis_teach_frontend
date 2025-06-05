import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CardModule, ButtonModule, FormModule, SpinnerModule, BadgeModule, DropdownModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

import { RagAssistantService, ChatMessage } from '../../../service/rag-assistant.service';
import { MarkdownPipe } from '../../../service/markdown.pipe';
import { iconSubset } from '../../../icons/icon-subset';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    FormModule,
    SpinnerModule,
    BadgeModule,
    DropdownModule,
    IconModule,
    MarkdownPipe
  ],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  isExpanded = false;
  currentAiModel: 'gemini' = 'gemini';;  // 固定使用Gemini
  conversationType: 'general' = 'general';  // 固定為一般模式，由後端判斷

  private subscriptions: Subscription[] = [];
  private shouldScrollToBottom = false;

  constructor(
    private ragService: RagAssistantService,
    private iconSetService: IconSetService
  ) {
    // 配置圖標
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    // 訂閱聊天訊息
    this.subscriptions.push(
      this.ragService.messages$.subscribe(messages => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
      })
    );

    // 訂閱打字狀態
    this.subscriptions.push(
      this.ragService.isTyping$.subscribe(isTyping => {
        this.isTyping = isTyping;
        if (isTyping) {
          this.shouldScrollToBottom = true;
        }
      })
    );

    // 訂閱當前AI模型
    this.subscriptions.push(
      this.ragService.currentAiModel$.subscribe(model => {
        this.currentAiModel = model as 'gemini';
      })
    );

    // 如果是新用戶，顯示歡迎訊息
    this.initializeChat();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  /**
   * 初始化聊天
   */
  private initializeChat(): void {
    if (this.messages.length === 0) {
      // 獲取系統指南
      this.ragService.getSystemGuide('new').subscribe({
        next: (response) => {
          if (response.success) {
            // 手動添加歡迎訊息
            const welcomeMessage: ChatMessage = {
              id: this.generateId(),
              type: 'assistant',
              content: response.guide,
              timestamp: new Date(),
              aiModel: 'gemini'
            };
            this.messages = [welcomeMessage];
            this.shouldScrollToBottom = true;
          }
        },
        error: (error) => {
          console.error('Failed to get system guide:', error);
        }
      });
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

    this.ragService.sendMessage(message, this.conversationType, this.currentAiModel).subscribe({
      next: (response) => {
        if (!response.success) {
          console.error('Chat error:', response.error);
        }
      },
      error: (error) => {
        console.error('Failed to send message:', error);
      }
    });

    this.currentMessage = '';
    this.focusInput();
  }

  /**
   * 處理Enter鍵
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * 切換聊天窗口展開狀態
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
   * 重置對話
   */
  resetConversation(): void {
    this.ragService.resetConversation().subscribe({
      next: (response) => {
        if (response.success) {
          // 對話已重置，可以開始新主題
        }
      },
      error: (error) => {
        console.error('Failed to reset conversation:', error);
      }
    });
  }

  /**
   * 清除聊天記錄
   */
  clearMessages(): void {
    this.ragService.clearMessages();
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
      console.warn('Could not scroll to bottom:', err);
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
      console.warn('Could not focus input:', err);
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
   * 獲取對話類型標籤
   */
  getConversationTypeLabel(type?: string): string {
    return 'Gemini AI教學助理';  // 固定標籤
  }

  /**
   * 獲取AI模型標籤
   */
  getAiModelLabel(model?: string): string {
    return 'Gemini (雲端)';  // 固定為Gemini
  }

  /**
   * TrackBy函數用於優化ngFor性能
   */
  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }
}
