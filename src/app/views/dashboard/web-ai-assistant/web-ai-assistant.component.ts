import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
import { MessageBridgeService } from '../../../service/message-bridge.service';
import { QuizService } from '../../../service/quiz.service';

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
  isAiTakingOver = false;
  shouldScrollToBottom = false;
  currentMessage = '';
  
  // 聊天數據
  messages: WebChatMessage[] = [];
  
  // 考卷相關屬性
  currentQuizData: any = null;
  showStartQuizButton: boolean = false;
  
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
    private messageBridgeService: MessageBridgeService,
    private quizService: QuizService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeWelcomeMessage();
    this.subscribeToMessageBridge();
  }

  ngOnDestroy(): void {
    // 清理資源
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
      
      // 檢查是否包含測驗操作指令
      this.checkForQuizAction(content);
    } catch (error) {
      console.warn('解析考卷 ID 失敗:', error);
      this.showStartQuizButton = false;
    }
  }

  /**
   * 檢查並執行 JavaScript 代碼
   */
  private checkForQuizAction(content: string): void {
    try {
      console.log('🔍 開始檢查測驗操作指令...');
      
      // 檢查是否為 JSON 格式的測驗指令
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        try {
          const quizData = JSON.parse(content);
          console.log('🔍 找到測驗操作指令:', quizData);
          
          if (quizData.type === 'university_quiz') {
            this.handleUniversityQuiz(quizData);
          } else if (quizData.type === 'knowledge_quiz') {
            this.handleKnowledgeQuiz(quizData);
          }
        } catch (e) {
          console.log('🔍 JSON 解析失敗，不是測驗指令');
        }
      }
    } catch (error) {
      console.warn('檢查測驗操作失敗:', error);
    }
  }

  private handleUniversityQuiz(data: any): void {
    console.log('🎯 處理大學考古題測驗:', data);
    const { university, department } = data.argument;
    const year = data.number;
    
    // 將數據存儲到 localStorage，供目標頁面使用
    localStorage.setItem('quiz_automation_data', JSON.stringify({
      type: 'university_quiz',
      university,
      department,
      year
    }));
    
    // 導航到測驗中心
    window.location.href = '/dashboard/quiz-center';
  }

  private handleKnowledgeQuiz(data: any): void {
    console.log('🎯 處理知識點測驗:', data);
    const { knowledge_point, difficulty } = data.argument;
    const questionCount = data.number;
    
    // 將數據存儲到 localStorage，供目標頁面使用
    localStorage.setItem('quiz_automation_data', JSON.stringify({
      type: 'knowledge_quiz',
      knowledge_point,
      difficulty,
      questionCount
    }));
    
    // 導航到測驗中心
    window.location.href = '/dashboard/quiz-center';
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
