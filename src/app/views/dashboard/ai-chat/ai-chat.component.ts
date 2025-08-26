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
      console.log('開始從訊息中提取考卷數據...');
      console.log('📄 原始內容長度:', content.length);
      console.log('📄 原始內容前200字符:', content.substring(0, 200));
      
      // 提取JSON數據
      const jsonData = this.extractJsonFromMessage(content);
      
      if (!jsonData) {
        throw new Error('無法從訊息中提取有效的考卷數據');
      }
      
      console.log('📄 提取的JSON數據長度:', jsonData.length);
      console.log('📄 提取的JSON數據前200字符:', jsonData.substring(0, 200));
      
      const quizData = JSON.parse(jsonData);
      console.log('✅ JSON解析成功');
      console.log('📊 解析的考卷數據結構:', {
        quiz_id: quizData.quiz_id,
        template_id: quizData.template_id,
        questions_count: quizData.questions ? quizData.questions.length : 'undefined',
        quiz_info: quizData.quiz_info ? 'exists' : 'undefined'
      });
      
      // 檢查並確保必要字段存在
      if (!quizData.quiz_id) {
        quizData.quiz_id = `quiz_${Date.now()}_${quizData.quiz_info?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'generated'}`;
        console.log('生成quiz_id:', quizData.quiz_id);
      }
      
      if (!quizData.template_id) {
        quizData.template_id = `template_${Date.now()}`;
        console.log('生成template_id:', quizData.template_id);
      }
      
      // 確保questions字段存在
      console.log('🔍 檢查questions字段:', quizData.questions);
      console.log('🔍 questions類型:', typeof quizData.questions);
      console.log('🔍 是否為數組:', Array.isArray(quizData.questions));
      
      if (!quizData.questions) {
        console.warn('⚠️ questions字段不存在，嘗試從其他字段獲取...');
        // 嘗試從quiz_info中獲取題目數量
        if (quizData.quiz_info && quizData.quiz_info.question_count) {
          console.log('✅ 從quiz_info中找到題目數量:', quizData.quiz_info.question_count);
          // 創建一個空的questions數組
          quizData.questions = [];
          for (let i = 0; i < quizData.quiz_info.question_count; i++) {
            quizData.questions.push({
              id: i + 1,
              question_text: `題目 ${i + 1}`,
              options: ['選項A', '選項B', '選項C', '選項D'],
              correct_answer: 'A',
              type: 'single-choice'
            });
          }
        } else {
          throw new Error('考卷數據缺少題目信息，且無法從quiz_info中獲取題目數量');
        }
      } else if (!Array.isArray(quizData.questions)) {
        console.warn('⚠️ questions不是數組，嘗試轉換...');
        if (typeof quizData.questions === 'object') {
          // 如果是對象，嘗試轉換為數組
          const questionsArray = Object.values(quizData.questions);
          if (questionsArray.length > 0) {
            quizData.questions = questionsArray;
            console.log('✅ 成功將questions轉換為數組');
          } else {
            throw new Error('考卷數據的questions字段格式不正確');
          }
        } else {
          throw new Error('考卷數據的questions字段格式不正確');
        }
      }
      
      // 確保quiz_info字段存在
      if (!quizData.quiz_info) {
        quizData.quiz_info = {
          title: 'AI生成的考卷',
          topic: '計算機概論',
          difficulty: 'medium',
          question_count: quizData.questions.length,
          time_limit: 30,
          total_score: quizData.questions.length * 10
        };
      }
      
      console.log('✅ 考卷數據驗證通過');
      console.log('📊 quiz_id:', quizData.quiz_id);
      console.log('📊 template_id:', quizData.template_id);
      console.log('📊 題目數量:', quizData.questions.length);
      
      // 將考卷數據存儲到QuizService
      this.quizService.setCurrentQuizData(quizData);
      
      // 跳轉到測驗頁面
      console.log('🚀 跳轉到測驗頁面...');
      
      // 構建查詢參數
      const queryParams = {
        template_id: quizData.template_id
      };
      
      this.router.navigate(['/dashboard/quiz-taking', quizData.quiz_id], { queryParams });
      
    } catch (error) {
      console.error('開始測驗失敗:', error);
      
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
   * 從訊息中提取JSON數據
   */
  extractJsonFromMessage(content: string): string | null {
    try {
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
