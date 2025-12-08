import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  CardModule,
  ButtonModule,
  BadgeModule,
  FormModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarkdownService } from '../../../service/markdown.service';
import { WebAiAssistantService, WebChatMessage, ChatResponse } from '../../../service/web-ai-assistant.service';
import { DetailedGuideService } from '../../../service/detailed-guide.service';
import { MessageBridgeService } from '../../../service/message-bridge.service';
import { QuizService } from '../../../service/quiz.service';
import { SidebarService } from '../../../service/sidebar.service';

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
    IconDirective
  ],
  templateUrl: './web-ai-assistant.component.html',
  styleUrls: ['./web-ai-assistant.component.scss']
})
export class WebAiAssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  // 組件狀態
  isExpanded = true; // 側邊欄預設收合
  isTyping = false;
  isAiTakingOver = false;
  shouldScrollToBottom = false;
  currentMessage = '';
  
  // 側邊欄寬度
  sidebarWidth = 380;
  isResizing = false;
  
  // 聊天數據
  messages: WebChatMessage[] = [];
  
  // 考卷相關屬性
  currentQuizData: any = null;
  showStartQuizButton: boolean = false;
  
  private subscriptions: Subscription[] = [];
  private resizeStartX = 0;
  private resizeStartWidth = 0;

  constructor(
    private webAiService: WebAiAssistantService,
    private detailedGuideService: DetailedGuideService,
    private messageBridgeService: MessageBridgeService,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private markdownService: MarkdownService
  ) {}

  ngOnInit(): void {
    // 先同步SidebarService的狀態
    this.isExpanded = this.sidebarService.getIsOpen();
    
    this.initializeWelcomeMessage();
    this.subscribeToMessageBridge();
    this.subscribeToSidebarService();
    this.checkRouteParams();
    
    // 確保側邊欄在初始化時打開（如果服務狀態為true）
    if (this.isExpanded) {
      setTimeout(() => {
        this.focusInput();
        this.scrollToBottom();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // 清理資源
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * 訂閱側邊欄服務
   */
  private subscribeToSidebarService(): void {
    // 訂閱側邊欄展開/收合狀態
    const sidebarSub = this.sidebarService.isOpen$.subscribe(isOpen => {
      if (isOpen !== this.isExpanded) {
        this.isExpanded = isOpen;
        if (isOpen) {
          setTimeout(() => {
            this.focusInput();
            this.scrollToBottom();
          }, 100);
        }
      }
    });
    this.subscriptions.push(sidebarSub);

    // 訂閱側邊欄寬度
    const widthSub = this.sidebarService.width$.subscribe(width => {
      this.sidebarWidth = width;
    });
    this.subscriptions.push(widthSub);

    // 初始化寬度
    this.sidebarWidth = this.sidebarService.getWidth();

    // 訂閱待發送的問題
    const questionSub = this.sidebarService.pendingQuestion$.subscribe(question => {
      if (question) {
        this.currentMessage = question;
        // 自動發送問題
        setTimeout(() => {
          this.sendMessage();
          this.sidebarService.clearPendingQuestion();
        }, 300);
      }
    });
    this.subscriptions.push(questionSub);
  }

  /**
   * 檢查路由參數（如果有問題參數，自動發送）
   */
  private checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      const question = params['question'];
      if (question) {
        // 打開側邊欄
        this.sidebarService.openSidebar(question);
        // 清除路由參數（避免重複發送）
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });
  }

  /**
   * 訂閱訊息橋接服務
   */
  private subscribeToMessageBridge(): void {
    this.messageBridgeService.message$.subscribe(message => {
      if (message) {
        this.handleExternalMessage(message);
        // 清除訊息以避免重複處理
        this.messageBridgeService.clearMessage();
      }
    });
  }

  /**
   * 處理來自其他組件的訊息
   */
  private handleExternalMessage(message: any): void {
    // 自動展開助手
    if (!this.isExpanded) {
      this.toggleExpanded();
    }

    // 設置訊息內容並發送
    this.currentMessage = message.content;
    
    // 根據消息類型顯示不同的提示
    let actionType = '';
    switch (message.type) {
      case 'question':
        actionType = '📝 詢問關於選中的文字：';
        break;
      case 'quiz_generation':
        actionType = '📝 生成題目關於選中的文字：';
        break;
      case 'selected_text_quiz_generation':
        actionType = '📝 基於選中文字生成題目：';
        break;
      default:
        actionType = '📝 選中的文字：';
    }
    
    const selectedTextInfo = `${actionType}${message.selectedText}`;
    this.addMessage('system', selectedTextInfo);
    
    // 發送實際的詢問或生成題目請求
    setTimeout(() => {
      this.sendMessage();
    }, 500); // 稍微延遲以確保界面更新
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
  toggleExpanded(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // 直接切換SidebarService的狀態
    this.sidebarService.toggleSidebar();
  }

  /**
   * 開始調整側邊欄大小
   */
  startResize(event: MouseEvent): void {
    if (!this.isExpanded) return;
    
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.sidebarWidth;
    
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  /**
   * 鼠標移動時調整大小
   */
  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;
    
    const deltaX = this.resizeStartX - event.clientX; // 向右拖拽時 deltaX 為正
    const newWidth = this.resizeStartWidth + deltaX;
    
    this.sidebarService.setWidth(newWidth);
  };

  /**
   * 結束調整大小
   */
  private onMouseUp = (): void => {
    if (!this.isResizing) return;
    
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

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

    // 啟動AI接管狀態（只顯示提示，不禁用操作）
    this.isAiTakingOver = true;

    this.webAiService.sendMessage(message).subscribe({
      next: (response: ChatResponse) => {
        if (response.success) {
          this.addMessage('assistant', response.content);
          
          // 檢查是否包含考卷數據
          this.checkForQuizData(response.content);
        } else {
          this.addMessage('assistant', '抱歉，處理您的請求時發生錯誤。請稍後再試。');
        }
        this.isTyping = false;
        this.focusInput();
        
        // 結束AI接管狀態
        this.isAiTakingOver = false;
      },
      error: (error) => {
        this.addMessage('assistant', '抱歉，目前無法連接到AI助手。請稍後再試或聯繫管理員。');
        this.isTyping = false;
        this.focusInput();
        
        // 結束AI接管狀態
        this.isAiTakingOver = false;
      }
    });
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
  private addMessage(type: 'user' | 'assistant' | 'system', content: string): void {
    const message: WebChatMessage = {
      id: this.webAiService.generateId(),
      type: type === 'system' ? 'assistant' : type, // system 訊息顯示為 assistant 類型
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

  /**
   * 檢查回應中是否包含考卷 ID 或 JavaScript 代碼
   */
  private checkForQuizData(content: string): void {
    try {
      // 查找考卷 ID (格式: 📋 考卷ID: `id`)
      const quizIdMatch = content.match(/📋 考卷ID: `([^`]+)`/);
      if (quizIdMatch) {
        const quizId = quizIdMatch[1];
        
        // 從回應中提取考卷信息
        const titleMatch = content.match(/📝 \*\*([^*]+)\*\*/);
        const topicMatch = content.match(/📚 主題: ([^\n]+)/);
        const countMatch = content.match(/🔢 題目數量: (\d+) 題/);
        const timeMatch = content.match(/⏱️ 時間限制: (\d+) 分鐘/);
        
        this.currentQuizData = {
          quiz_id: quizId,
          quiz_info: {
            title: titleMatch ? titleMatch[1] : 'AI 生成考卷',
            topic: topicMatch ? topicMatch[1] : '未知主題',
            question_count: countMatch ? parseInt(countMatch[1]) : 1,
            time_limit: timeMatch ? parseInt(timeMatch[1]) : 60
          }
        };
        
        this.showStartQuizButton = true;
      }
      
      // 檢查是否包含操作指令
      this.checkForAction(content);
    } catch (error) {
      console.warn('解析考卷 ID 失敗:', error);
      this.showStartQuizButton = false;
    }
  }

  /**
   * 檢查並執行 JavaScript 代碼
   */
  /**
   * 檢查 AI 回應中是否包含操作指令
   * AI 會返回標準格式：{ "action": "action_id", "params": {...}, "message": "..." }
   */
  private checkForAction(content: string): void {
    try {
      console.log('🔍 檢查 AI 回應中的操作指令...');
      
      // 從內容中提取 JSON 對象
      let actionData: any = null;
      
      // 嘗試解析純 JSON
      const trimmedContent = content.trim();
      if (trimmedContent.startsWith('{') && trimmedContent.endsWith('}')) {
        try {
          actionData = JSON.parse(trimmedContent);
        } catch (e) {
          // 忽略解析錯誤
        }
      }
      
      // 如果沒有找到，嘗試從混合文本中提取
      if (!actionData || !actionData.action) {
        const jsonMatch = content.match(/\{[^{}]*"action"[^{}]*"params"[^{}]*\}/);
        if (jsonMatch) {
          try {
            const startIndex = content.indexOf('{');
            if (startIndex !== -1) {
              let braceCount = 0;
              let endIndex = -1;
              for (let i = startIndex; i < content.length; i++) {
                if (content[i] === '{') braceCount++;
                if (content[i] === '}') braceCount--;
                if (braceCount === 0) {
                  endIndex = i;
                  break;
                }
              }
              if (endIndex !== -1) {
                actionData = JSON.parse(content.substring(startIndex, endIndex + 1));
              }
          }
        } catch (e) {
            console.log('🔍 JSON 提取失敗:', e);
        }
        }
      }
      
      // 如果找到操作指令，執行它
      if (actionData && actionData.action) {
        console.log('✅ 找到操作指令:', actionData);
        this.executeAction(actionData.action, actionData.params || {});
      }
    } catch (error) {
      console.warn('檢查操作指令失敗:', error);
    }
  }

  /**
   * 執行操作
   */
  /**
   * 轉換 Markdown 為安全的 HTML
   */
  transformMarkdown(content: string): any {
    return this.markdownService.transform(content);
  }

  private executeAction(actionId: string, params: any): void {
    this.detailedGuideService.executeAction(actionId, params).then((result: any) => {
      if (result.success) {
        // 如果是創建測驗，創建成功後自動導航
        if ((actionId === 'create_university_quiz' || actionId === 'create_knowledge_quiz') && result.data?.quiz_id) {
          this.detailedGuideService.executeAction('navigate_to_quiz_taking', {
            quiz_id: result.data.quiz_id,
            quiz_type: actionId === 'create_university_quiz' ? 'pastexam' : 'knowledge',
            template_id: result.data.template_id,
            ...params
          });
        }
      } else {
        alert(result.error || '操作執行失敗');
  }
    });
  }


  
  

  /**
   * 開始測驗
   */
  startQuiz(): void {
    if (this.currentQuizData && this.currentQuizData.quiz_id) {
      // 直接獲取考卷數據並創建測驗
      this.loadAndStartQuiz(this.currentQuizData.quiz_id);
    }
  }

  /**
   * 加載考卷並開始測驗
   */
  private loadAndStartQuiz(quizId: string): void {
    // 使用 get-quiz-from-database API 來獲取考卷數據
    const quizData = {
      quiz_ids: [quizId]
    };

    this.quizService.getQuizFromDatabase(quizData).subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.success) {
          // 獲取考卷數據成功，創建測驗
          const quizInfo = response.data.data;
          console.log('🔍 從數據庫獲取的考卷數據:', quizInfo);
          
          // 直接使用AI生成的考卷數據，不需要創建新的測驗
          const quizDataForStorage = {
            quiz_id: quizId, // 使用原始的quizId
            template_id: quizId, // AI生成的考卷，template_id就是quizId
            questions: quizInfo.questions,
            time_limit: quizInfo.time_limit || 60,
            quiz_info: quizInfo.quiz_info
          };
          
          console.log('🔍 準備存儲的測驗數據:', quizDataForStorage);
          
          // 存儲到 QuizService
          this.quizService.setCurrentQuizData(quizDataForStorage);
          
          // 直接跳轉到測驗頁面
          this.router.navigate(['/dashboard/quiz-taking', quizId]);
        } else {
          alert('無法加載考卷數據，請重新生成考卷');
        }
      },
      error: (error: any) => {
        console.error('❌ 加載考卷失敗:', error);
        alert('無法加載考卷數據，請重新生成考卷');
      }
    });
  }

  /**
   * 隱藏開始測驗按鈕
   */
  hideStartQuizButton(): void {
    this.showStartQuizButton = false;
    this.currentQuizData = null;
  }

  /**
   * 控制AI接管畫面狀態
   */
  public setAiTakeoverState(takingOver: boolean): void {
    this.isAiTakingOver = takingOver;
    
    if (takingOver) {
      // 禁用所有互動元素
      this.disableAllInteractions();
    } else {
      // 重新啟用互動元素
      this.enableAllInteractions();
    }
  }

  /**
   * 禁用所有互動元素
   */
  private disableAllInteractions(): void {
    // 禁用輸入框
    if (this.messageInput) {
      this.messageInput.nativeElement.disabled = true;
    }
    
    // 禁用所有按鈕
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = true;
    });
  }

  /**
   * 重新啟用互動元素
   */
  private enableAllInteractions(): void {
    // 重新啟用輸入框
    if (this.messageInput) {
      this.messageInput.nativeElement.disabled = false;
    }
    
    // 重新啟用所有按鈕
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.disabled = false;
    });
  }
}
