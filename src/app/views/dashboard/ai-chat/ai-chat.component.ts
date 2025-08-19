import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CardModule, ButtonModule, FormModule, SpinnerModule, BadgeModule, DropdownModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { RagAssistantService } from '../../../service/rag-assistant.service';
import { MarkdownPipe } from '../../../service/markdown.pipe';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiModel?: string;
}

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

  currentAiModel: 'gemini' = 'gemini';
  conversationType: 'general' = 'general';

  private subscriptions: Subscription[] = [];
  private shouldScrollToBottom = false;

  constructor(
    private ragService: RagAssistantService
  ) {}

  ngOnInit(): void {
    // 初始化聊天
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
      // 添加歡迎訊息
      this.addMessage({
        id: this.generateId(),
        type: 'assistant',
        content: '🎓 歡迎來到 AI 智能教學系統！\n\n我是您的專屬 MIS 教學助理，可以幫助您：\n\n📚 **學習輔導**：\n• 回答 MIS 相關問題\n• 解釋複雜概念\n• 提供學習建議\n\n💡 **使用技巧**：\n• 直接提問任何 MIS 相關問題\n• 描述您的困惑和疑問\n• 我會根據您的程度調整解釋方式\n\n現在就開始提問吧！我很樂意幫助您學習。',
        timestamp: new Date(),
        aiModel: 'gemini'
      });
    }
  }

  /**
   * 發送訊息
   */
  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content: this.currentMessage,
      timestamp: new Date()
    };

    this.addMessage(userMessage);
    this.isTyping = true;
    this.shouldScrollToBottom = true;

    // 模擬AI回應（實際應該調用後端API）
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: `關於「${this.currentMessage}」，我很樂意為您解答。請使用AI導師功能獲得更專業的指導。`,
        timestamp: new Date(),
        aiModel: 'gemini'
      };

      this.addMessage(aiMessage);
      this.isTyping = false;
      this.shouldScrollToBottom = true;
    }, 1000);

    this.currentMessage = '';
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
   * 添加訊息到聊天記錄
   */
  private addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 滾動到底部
   */
  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  /**
   * 清除聊天記錄
   */
  clearMessages(): void {
    this.messages = [];
    this.initializeChat();
  }

  /**
   * 重置對話
   */
  resetConversation(): void {
    this.clearMessages();
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
