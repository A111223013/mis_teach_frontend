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
          // 修正：後端回傳的是 content 欄位，不是 message
          const responseContent = response.content || response.message || '';
          
          if (!responseContent || responseContent.trim() === '') {
            const errorMessage: ChatMessage = {
              id: this.generateId(),
              type: 'assistant',
              content: '❌ 抱歉，AI 回應為空，請稍後再試或聯繫管理員。',
              timestamp: new Date(),
              aiModel: 'gemini'
            };
            this.addMessage(errorMessage);
          } else {
            const aiMessage: ChatMessage = {
              id: this.generateId(),
              type: 'assistant',
              content: responseContent,
              timestamp: new Date(),
              aiModel: 'gemini'
            };
            this.addMessage(aiMessage);
            
            // 檢查是否為考卷生成回應
            this.checkAndHandleQuizGeneration(responseContent);
          }
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
    if (!response || typeof response !== 'string') {
      return;
    }

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
        
      } catch (error) {
        // 解析考卷數據失敗
      }
    }
  }

  /**
   * 檢查是否為考卷生成訊息
   */
  isQuizGenerationMessage(content: string): boolean {
    if (!content || typeof content !== 'string') {
      return false;
    }

    return content.includes('考卷生成成功') || 
           content.includes('開始測驗') || 
           content.includes('```json');
  }

  /**
   * 從訊息中開始測驗
   */
  startQuizFromMessage(content: string): void {
    try {
      if (!content || typeof content !== 'string') {
        throw new Error('訊息內容無效');
      }
      
      // 嘗試從訊息中提取考卷 ID
      const quizIds = this.extractQuizIdsFromMessage(content);
      
      if (quizIds && quizIds.length > 0) {
        // 直接使用提取到的考卷 ID 跳轉到測驗頁面
        this.navigateToQuiz(quizIds[0]);
      } else {
        // 如果無法提取 ID，嘗試從 MongoDB 讀取最新的考卷
        this.loadLatestQuizFromDatabase();
      }
      
    } catch (error) {
      
      // 顯示詳細的錯誤訊息
      let errorMsg = '開始測驗失敗';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        type: 'assistant',
        content: `❌ ${errorMsg}\n\n💡 請嘗試重新生成考卷或聯繫管理員。`,
        timestamp: new Date(),
        aiModel: 'gemini'
      };
      this.addMessage(errorMessage);
    }
  }

  /**
   * 從訊息中提取 MongoDB 考卷 ID
   */
  private extractQuizIdsFromMessage(content: string): string[] {
    try {
      if (!content || typeof content !== 'string') {
        return [];
      }
      
      // 方法1: 從 AI 回應中提取考卷 ID（支援多種格式）
      // 1.1 提取時間戳格式的考卷 ID (ai_generated_1234567890)
      const timestampIdPattern = /ai_generated_\d+/g;
      const timestampIds = content.match(timestampIdPattern);
      if (timestampIds && timestampIds.length > 0) {
        return timestampIds;
      }

      // 1.2 提取 MongoDB ObjectId 格式的字符串
      const objectIdPattern = /[a-f0-9]{24}/g;
      const objectIds = content.match(objectIdPattern);
      if (objectIds && objectIds.length > 0) {
        // 過濾掉明顯不是 ObjectId 的字符串
        const validObjectIds = objectIds.filter(id => 
          id.length === 24 && 
          /^[a-f0-9]{24}$/.test(id) &&
          !id.includes('\n') &&
          !id.includes(' ') &&
          !id.includes('"') &&
          !id.includes('\\') &&
          !id.includes('\\n')
        );
        if (validObjectIds.length > 0) {
          return validObjectIds;
        }
      }
      
      // 方法2: 從 JSON 中的 database_ids 提取
      if (content.includes('```json')) {
        const jsonStart = content.indexOf('```json') + 7;
        const jsonEnd = content.indexOf('```', jsonStart);
        
        if (jsonEnd > jsonStart) {
          const jsonData = content.substring(jsonStart, jsonEnd).trim();
          try {
            const parsed = JSON.parse(jsonData);
            if (parsed.database_ids && Array.isArray(parsed.database_ids) && parsed.database_ids.length > 0) {
              return parsed.database_ids;
            }
          } catch (parseError) {
            // JSON解析失敗
          }
        }
      }
      
      return [];
      
    } catch (error) {
      return [];
    }
  }

  /**
   * 從資料庫載入考卷數據
   */
  private loadQuizFromDatabase(quizIds: string[]): void {
    
    // 調用後端API獲取考卷數據
    this.aiChatService.getQuizFromDatabase(quizIds).subscribe({
      next: (response: any) => {
        // 檢查回應結構：response.data.success 或 response.success
        const isSuccess = (response.data && response.data.success) || response.success;
        const quizData = response.data?.data || response.data;
        
        if (isSuccess && quizData) {
          
          // 將考卷數據存儲到QuizService
          this.quizService.setCurrentQuizData(quizData);
          
          // 跳轉到測驗頁面
          
          // 構建查詢參數
          const queryParams = {
            template_id: quizData.template_id
          };
          
          this.router.navigate(['/dashboard/quiz-taking', quizData.quiz_id], { queryParams });
          
        } else {
          console.error('❌ API 回應失敗:', response);
          const errorMessage = response.data?.message || response.message || response.error || '載入考卷數據失敗';
          console.error('❌ 錯誤訊息:', errorMessage);
          
          // 顯示錯誤訊息給用戶
          const errorChatMessage: ChatMessage = {
            id: this.generateId(),
            type: 'assistant',
            content: `❌ 載入考卷失敗：${errorMessage}`,
            timestamp: new Date(),
            aiModel: 'gemini'
          };
          this.addMessage(errorChatMessage);
        }
      },
      error: (error: any) => {
        console.error('❌ 載入考卷數據失敗:', error);
        console.error('❌ 錯誤詳情:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        // 顯示錯誤訊息給用戶
        const errorChatMessage: ChatMessage = {
          id: this.generateId(),
          type: 'assistant',
          content: `❌ 載入考卷失敗：${error.message || '網路錯誤'}`,
          timestamp: new Date(),
          aiModel: 'gemini'
        };
        this.addMessage(errorChatMessage);
      }
    });
  }

  /**
   * 載入考卷數據並跳轉到測驗頁面
   */
  private navigateToQuiz(quizId: string): void {
    console.log('🚀 載入考卷數據並跳轉到測驗頁面，考卷ID:', quizId);
    
    // 先從 MongoDB 載入考卷數據
    this.loadQuizFromDatabase([quizId]);
  }

  /**
   * 從 MongoDB 載入最新的考卷數據
   */
  private loadLatestQuizFromDatabase(): void {
    console.log('🔄 從 MongoDB 載入最新考卷數據...');
    
    // 調用後端API獲取最新考卷數據
    this.aiChatService.getLatestQuizFromDatabase().subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('✅ 成功載入最新考卷數據:', response.data);
          
          const quizData = response.data;
          
          // 將考卷數據存儲到QuizService
          this.quizService.setCurrentQuizData(quizData);
          
          // 跳轉到測驗頁面
          
          // 構建查詢參數
          const queryParams = {
            template_id: quizData.template_id
          };
          
          this.router.navigate(['/dashboard/quiz-taking', quizData.quiz_id], { queryParams });
          
        } else {
          throw new Error(response.message || '載入最新考卷數據失敗');
        }
      },
      error: (error: any) => {
        console.error('載入最新考卷數據失敗:', error);
        throw new Error('載入最新考卷數據失敗');
      }
    });
  }

  /**
   * 查看考卷詳情
   */
  viewQuizDetails(content: string): void {
    try {
      // 防禦性檢查：確保 content 不為 undefined 或 null
      if (!content || typeof content !== 'string') {
        console.error('viewQuizDetails: content 參數無效', content);
        return;
      }

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
   * 安全的字串檢查工具函數
   * @param str 要檢查的字串
   * @param methodName 調用此函數的方法名稱（用於日誌）
   * @returns 如果字串有效返回 true，否則返回 false
   */
  private isValidString(str: any, methodName: string = 'unknown'): str is string {
    if (!str || typeof str !== 'string') {
      console.warn(`${methodName}: 無效的字串參數`, str);
      return false;
    }
    return true;
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
   * 從訊息中提取JSON數據
   */
  extractJsonFromMessage(content: string): string | null {
    try {
      // 防禦性檢查：確保 content 不為 undefined 或 null
      if (!content || typeof content !== 'string') {
        console.warn('extractJsonFromMessage: content 參數無效', content);
        return null;
      }

      console.log('開始提取JSON，內容長度:', content.length);
      
      // 方法1: 尋找 ```json ... ``` 格式（後端現在使用這種格式）
      if (content.includes('```json')) {
        console.log('找到```json標記');
        const jsonStart = content.indexOf('```json') + 7;
        const jsonEnd = content.indexOf('```', jsonStart);
        
        if (jsonEnd > jsonStart) {
          let jsonData = content.substring(jsonStart, jsonEnd).trim();
          console.log('提取的JSON數據長度:', jsonData.length);
          console.log('JSON數據預覽:', jsonData.substring(0, 200) + '...');
          
          // 驗證是否為有效JSON
          try {
            const parsed = JSON.parse(jsonData);
            console.log('✅ JSON驗證成功');
            
            // 檢查是否包含必要字段
            if (parsed.quiz_id) {
              console.log('✅ 包含quiz_id字段');
              return jsonData;
            } else {
              console.log('⚠️ 缺少quiz_id字段，嘗試修復...');
              // 嘗試添加quiz_id
              parsed.quiz_id = `quiz_${Date.now()}_${parsed.quiz_info?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'generated'}`;
              return JSON.stringify(parsed, null, 2);
            }
          } catch (parseError) {
            console.warn('JSON驗證失敗，嘗試修復:', parseError);
            // 嘗試修復不完整的JSON
            jsonData = this.fixIncompleteJson(jsonData);
            
            try {
              const parsed = JSON.parse(jsonData);
              console.log('✅ 修復後JSON驗證成功');
              
              // 檢查並添加必要字段
              if (!parsed.quiz_id) {
                parsed.quiz_id = `quiz_${Date.now()}_${parsed.quiz_info?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'generated'}`;
              }
              if (!parsed.template_id) {
                parsed.template_id = `template_${Date.now()}`;
              }
              
              return JSON.stringify(parsed, null, 2);
            } catch (finalError) {
              console.warn('最終JSON驗證失敗:', finalError);
            }
          }
        } else {
          console.warn('無法找到```json結束標記');
        }
      }
      
      // 方法2: 尋找 { ... } 格式，優先尋找包含quiz_id的結構
      const braceStart = content.indexOf('{');
      if (braceStart !== -1) {
        console.log('找到{標記，位置:', braceStart);
        
        // 尋找所有可能的JSON結構
        const jsonStructures = [];
        let braceCount = 0;
        let start = braceStart;
        
        for (let i = braceStart; i < content.length; i++) {
          if (content[i] === '{') {
            if (braceCount === 0) start = i;
            braceCount++;
          }
          if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              const jsonData = content.substring(start, i + 1).trim();
              jsonStructures.push(jsonData);
            }
          }
        }
        
        console.log(`找到 ${jsonStructures.length} 個JSON結構`);
        
        // 優先返回包含quiz_id的結構
        for (const jsonData of jsonStructures) {
          try {
            const parsed = JSON.parse(jsonData);
            if (parsed.quiz_id) {
              console.log('✅ 找到包含quiz_id的JSON結構');
              return jsonData;
            }
          } catch (parseError) {
            console.warn('JSON結構驗證失敗:', parseError);
          }
        }
        
        // 如果沒有找到包含quiz_id的結構，使用第一個有效的JSON並添加必要字段
        for (const jsonData of jsonStructures) {
          try {
            const parsed = JSON.parse(jsonData);
            console.log('✅ 找到有效的JSON結構，添加必要字段');
            
            // 添加必要字段
            if (!parsed.quiz_id) {
              parsed.quiz_id = `quiz_${Date.now()}_${parsed.quiz_info?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'generated'}`;
            }
            if (!parsed.template_id) {
              parsed.template_id = `template_${Date.now()}`;
            }
            
            return JSON.stringify(parsed, null, 2);
          } catch (parseError) {
            console.warn('JSON結構驗證失敗:', parseError);
          }
        }
      }
      
      console.log('❌ 所有方法都失敗，無法提取JSON');
      return null;
      
    } catch (error) {
      console.error('JSON提取過程中發生錯誤:', error);
      return null;
    }
  }

  /**
   * 嘗試修復不完整的JSON
   */
  private fixIncompleteJson(jsonStr: string): string {
    try {
      // 基本清理
      let cleaned = jsonStr.trim();
      
      // 處理常見的轉義字符問題
      cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      
      // 處理多餘的反斜線
      while (cleaned.includes('\\\\')) {
        cleaned = cleaned.replace(/\\\\/g, '\\');
      }
      
      // 處理結尾的反斜線
      if (cleaned.endsWith('\\')) {
        cleaned = cleaned.slice(0, -1);
      }
      
      // 嘗試找到最後一個完整的對象
      let braceCount = 0;
      let endPos = -1;
      
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === '{') {
          braceCount++;
        } else if (cleaned[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endPos = i + 1;
            break;
          }
        }
      }
      
      if (endPos > 0) {
        // 提取完整的JSON部分
        cleaned = cleaned.substring(0, endPos);
        console.log('修復JSON，提取完整部分:', cleaned.substring(0, 100) + '...');
      }
      
      return cleaned;
    } catch (error) {
      console.warn('JSON修復失敗:', error);
      return jsonStr;
    }
  }

  /**
   * 高級JSON修復
   */
  private advancedJsonFix(jsonStr: string): string {
    try {
      let cleaned = jsonStr;
      
      // 修復常見的JSON問題
      
      // 1. 修復不完整的字符串
      const stringRegex = /"([^"]*?)(?:\n|$)/g;
      cleaned = cleaned.replace(stringRegex, (match, content) => {
        if (content.endsWith('\\')) {
          return `"${content.slice(0, -1)}"`;
        }
        return `"${content}"`;
      });
      
      // 2. 修復不完整的數組
      const arrayRegex = /\[([^\]]*?)(?:\n|$)/g;
      cleaned = cleaned.replace(arrayRegex, (match, content) => {
        if (content.trim() && !content.endsWith(',')) {
          return `[${content},]`;
        }
        return `[${content}]`;
      });
      
      // 3. 修復不完整的對象
      const objectRegex = /\{([^}]*?)(?:\n|$)/g;
      cleaned = cleaned.replace(objectRegex, (match, content) => {
        if (content.trim() && !content.endsWith(',')) {
          return `{${content},}`;
        }
        return `{${content}}`;
      });
      
      // 4. 移除尾隨的逗號
      cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
      
      // 5. 修復控制字符
      cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
      
      console.log('高級JSON修復完成，長度:', cleaned.length);
      return cleaned;
      
    } catch (error) {
      console.warn('高級JSON修復失敗:', error);
      return jsonStr;
    }
  }
}
