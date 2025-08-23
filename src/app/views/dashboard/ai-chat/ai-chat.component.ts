import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CardModule, ButtonModule, FormModule, SpinnerModule, BadgeModule, DropdownModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { AiChatService, ChatMessage } from '../../../service/ai-chat.service';
import { MarkdownPipe } from '../../../service/markdown.pipe';
import { QuizService } from '../../../service/quiz.service';

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
  public shouldScrollToBottom = false;

  constructor(
    private aiChatService: AiChatService,
    private quizService: QuizService,
    private router: Router
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
        content: '🎓 歡迎來到 AI 智能教學系統！\n\n我是您的專屬 MIS 教學助理，可以幫助您：\n\n📚 **學習輔導**：\n• 回答 MIS 相關問題\n• 解釋複雜概念\n• 提供學習建議\n\n💡 **考卷生成**：\n• 創建知識點測驗\n• 生成考古題練習\n• 自定義題型和難度\n\n現在就開始提問吧！我很樂意幫助您學習。',
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

    const messageToSend = this.currentMessage;
    this.currentMessage = '';

    // 調用後端API
    const subscription = this.aiChatService.sendMessage(
      messageToSend, 
      this.aiChatService.getCurrentUserId()
    ).subscribe({
      next: (response) => {
        if (response.success) {
          const aiMessage: ChatMessage = {
            id: this.generateId(),
            type: 'assistant',
            content: response.message,
            timestamp: new Date(),
            aiModel: 'gemini'
          };
          this.addMessage(aiMessage);
          
          // 檢查是否為考卷生成回應
          this.checkAndHandleQuizGeneration(response.message);
        } else {
          // 處理錯誤回應
          const errorMessage: ChatMessage = {
            id: this.generateId(),
            type: 'assistant',
            content: `❌ 抱歉，處理您的訊息時發生錯誤：${response.error || '未知錯誤'}`,
            timestamp: new Date(),
            aiModel: 'gemini'
          };
          this.addMessage(errorMessage);
        }
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('聊天API錯誤:', error);
        const errorMessage: ChatMessage = {
          id: this.generateId(),
          type: 'assistant',
          content: '❌ 抱歉，連接後端服務時發生錯誤，請稍後再試。',
          timestamp: new Date(),
          aiModel: 'gemini'
        };
        this.addMessage(errorMessage);
        this.isTyping = false;
        this.shouldScrollToBottom = true;
      }
    });

    this.subscriptions.push(subscription);
  }

  /**
   * 檢查並處理考卷生成回應
   */
  private checkAndHandleQuizGeneration(response: string): void {
    // 檢查是否包含考卷生成的JSON數據
    if (response.includes('```json') && response.includes('quiz_id')) {
      try {
        // 提取JSON數據
        const jsonStart = response.indexOf('```json') + 7;
        const jsonEnd = response.indexOf('```', jsonStart);
        const jsonData = response.substring(jsonStart, jsonEnd).trim();
        
        const quizData = JSON.parse(jsonData);
        
        // 將考卷數據存儲到QuizService
        this.quizService.setCurrentQuizData(quizData);
        
        // 不再自動跳轉，讓用戶點擊按鈕
        console.log('考卷數據已準備就緒，等待用戶點擊開始測驗按鈕');
        
      } catch (error) {
        console.error('解析考卷數據失敗:', error);
      }
    }
  }

  /**
   * 檢查是否為考卷生成訊息
   */
  isQuizGenerationMessage(content: string): boolean {
    return content.includes('考卷生成成功') || 
           content.includes('開始測驗') || 
           content.includes('```json');
  }

  /**
   * 從訊息中開始測驗
   */
  startQuizFromMessage(content: string): void {
    try {
      // 更安全的JSON提取
      const jsonData = this.extractJsonFromMessage(content);
      
      if (!jsonData) {
        throw new Error('無法找到有效的JSON數據');
      }
      
      const quizData = JSON.parse(jsonData);
      
      // 將考卷數據存儲到QuizService
      this.quizService.setCurrentQuizData(quizData);
      
      // 跳轉到測驗頁面
      this.router.navigate(['/dashboard/quiz-taking', quizData.quiz_id]);
      
    } catch (error) {
      console.error('開始測驗失敗:', error);
      // 顯示錯誤訊息
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: '❌ 開始測驗失敗，請稍後再試。',
        timestamp: new Date(),
        aiModel: 'gemini'
      };
      this.addMessage(errorMessage);
    }
  }

  /**
   * 查看考卷詳情
   */
  viewQuizDetails(content: string): void {
    try {
      // 更安全的JSON提取
      const jsonData = this.extractJsonFromMessage(content);
      
      if (!jsonData) {
        throw new Error('無法找到有效的JSON數據');
      }
      
      const quizData = JSON.parse(jsonData);
      
      // 顯示考卷詳情
      const detailsMessage: ChatMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: this.formatQuizDetails(quizData),
        timestamp: new Date(),
        aiModel: 'gemini'
      };
      this.addMessage(detailsMessage);
      
    } catch (error) {
      console.error('查看考卷詳情失敗:', error);
    }
  }

  /**
   * 格式化考卷詳情
   */
  private formatQuizDetails(quizData: any): string {
    let details = '📋 **考卷詳情**\n\n';
    
    if (quizData.quiz_info) {
      const info = quizData.quiz_info;
      details += `📝 **標題**: ${info.title}\n`;
      details += `📚 **主題**: ${info.topic}\n`;
      details += `📊 **難度**: ${info.difficulty}\n`;
      details += `🔢 **題目數量**: ${info.question_count}\n`;
      details += `⏱️ **時間限制**: ${info.time_limit}分鐘\n`;
      details += `💯 **總分**: ${info.total_score}分\n\n`;
    }
    
    if (quizData.questions && quizData.questions.length > 0) {
      details += '📝 **題目列表**:\n';
      quizData.questions.forEach((q: any, index: number) => {
        details += `${index + 1}. ${q.question_text.substring(0, 80)}...\n`;
      });
    }
    
    details += '\n🚀 點擊「開始測驗」按鈕即可開始答題！';
    
    return details;
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

  /**
   * 安全地從訊息中提取JSON數據
   */
  private extractJsonFromMessage(content: string): string | null {
    try {
      // 方法1: 尋找 ```json ... ``` 格式
      const jsonStart = content.indexOf('```json');
      if (jsonStart !== -1) {
        const start = jsonStart + 7;
        const end = content.indexOf('```', start);
        if (end !== -1) {
          const jsonData = content.substring(start, end).trim();
          // 驗證是否為有效JSON
          JSON.parse(jsonData);
          return jsonData;
        }
      }
      
      // 方法2: 尋找 { ... } 格式
      const braceStart = content.indexOf('{');
      if (braceStart !== -1) {
        let braceCount = 0;
        let end = braceStart;
        
        for (let i = braceStart; i < content.length; i++) {
          if (content[i] === '{') braceCount++;
          if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              end = i + 1;
              break;
            }
          }
        }
        
        if (end > braceStart) {
          const jsonData = content.substring(braceStart, end).trim();
          // 驗證是否為有效JSON
          JSON.parse(jsonData);
          return jsonData;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('JSON提取失敗:', error);
      return null;
    }
  }
}
