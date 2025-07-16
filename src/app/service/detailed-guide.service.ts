import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

export interface DetailedGuideStep {
  id: string;
  page: string;                    // 需要導航到的頁面
  target: string;                  // 目標元素選擇器
  title: string;                   // 步驟標題
  content: string;                 // 詳細說明內容
  buttonFunction?: string;         // 按鈕功能說明
  blockPurpose?: string;          // 區塊用途說明
  position: 'top' | 'bottom' | 'left' | 'right';
  avatarPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  waitForElement?: boolean;        // 是否等待元素載入
  delay?: number;                  // 延遲時間
}

export interface DetailedGuideResponse {
  success: boolean;
  steps: DetailedGuideStep[];
  message: string;
  guide_type: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class DetailedGuideService {
  private n8nWebhookUrl = 'http://localhost:5678/webhook/game-guide';
  private avatarElement: HTMLElement | null = null;
  private currentStepIndex = 0;
  private guideSteps: DetailedGuideStep[] = [];
  private isActive = false;
  private autoSkipTimer: any = null; // 防止重複觸發自動跳過

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // 暴露服務到全局，讓按鈕可以調用
    (window as any).detailedGuideService = this;
  }

  /**
   * 觸發詳細導覽工作流
   */
  triggerDetailedGuide(): Observable<DetailedGuideResponse> {
    const payload = {
      user_id: 'web_user',
      current_page: window.location.pathname,
      timestamp: new Date().toISOString(),
      screen_size: {
        width: window.screen.width,
        height: window.screen.height
      },
      user_agent: navigator.userAgent
    };

    return this.http.post<DetailedGuideResponse>(this.n8nWebhookUrl, payload, this.httpOptions);
  }

  /**
   * 開始詳細導覽
   */
  async startDetailedGuide(): Promise<void> {
    try {
      this.isActive = true;
      this.currentStepIndex = 0;
      
      // 創建頭像
      this.createAvatar();
      
      // 調用 n8n 獲取詳細導覽步驟
      const response = await firstValueFrom(this.triggerDetailedGuide());
      
      if (response?.success && response.steps) {
        this.guideSteps = response.steps;
        // console.log('獲取到詳細導覽步驟:', this.guideSteps);
        
        // 開始執行第一步
        this.executeStep(0);
      } else {
        // console.error('n8n 詳細導覽回應失敗:', response);
        this.endGuide();
      }
    } catch (error) {
      // console.error('觸發詳細導覽失敗:', error);
      this.endGuide();
    }
  }

  /**
   * 執行指定步驟
   */
  private async executeStep(stepIndex: number): Promise<void> {
    if (stepIndex >= this.guideSteps.length) {
      this.completeGuide();
      return;
    }

    this.currentStepIndex = stepIndex;
    const step = this.guideSteps[stepIndex];

    // console.log(`🎯 執行步驟 ${stepIndex + 1}/${this.guideSteps.length}: ${step.title}`);

    // 不自動跳轉頁面，而是指引用戶點擊導航
    if (step.page && step.page !== window.location.pathname) {
      // console.log(`📍 需要導航到: ${step.page}，等待用戶點擊導航`);
      // 等待用戶手動導航
      this.waitForNavigation(step);
      return;
    }

    // 等待頁面載入和元素出現
    await this.waitForPageLoad();

    // 查找目標元素
    const target = await this.findTargetElement(step.target, step.waitForElement);

    if (target) {
      // 立即清除之前的效果，避免重複顯示
      this.clearEffects();

      // 滾動到目標元素
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });

      // 等待滾動完成
      setTimeout(() => {
        // 再次清除效果，確保沒有重複元素
        this.clearEffects();

        // 高亮目標元素
        this.highlightElement(target);

        // 定位頭像
        this.positionAvatar(target, step.avatarPosition);

        // 顯示詳細說明
        this.showDetailedDescription(step, stepIndex);

        // 如果是導航相關步驟，等待用戶點擊
        if (this.isNavigationStep(step)) {
          this.setupNavigationListener(target, step);
        }
      }, step.delay || 1000);
    } else {
      // console.warn(`⚠️ 找不到目標元素: ${step.target}`);
      // 顯示找不到元素的提示，並設置自動跳過
      this.showElementNotFoundMessage(step);

      // 清除之前的計時器，避免重複觸發
      if (this.autoSkipTimer) {
        clearTimeout(this.autoSkipTimer);
      }

      // 10秒後自動跳過到下一步，避免卡住
      this.autoSkipTimer = setTimeout(() => {
        if (this.isActive && this.currentStepIndex < this.guideSteps.length) {
          // console.log(`🔄 自動跳過步驟: ${step.title}`);
          this.nextStep();
        }
      }, 10000);
    }
  }

  /**
   * 導航到指定頁面
   */
  private async navigateToPage(page: string): Promise<void> {
    return new Promise((resolve) => {
      this.router.navigate([page]).then(() => {
        // 等待頁面載入
        setTimeout(resolve, 2000);
      });
    });
  }

  /**
   * 等待頁面載入完成
   */
  private async waitForPageLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve(), { once: true });
      }
    });
  }

  /**
   * 查找目標元素
   */
  private async findTargetElement(target: string, waitForElement = true): Promise<HTMLElement | null> {
    const selectors = target.split(',').map(s => s.trim());

    // 立即嘗試查找
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        console.log(`✅ 找到目標元素: ${selector}`);
        return element;
      }
    }

    // 如果找不到，嘗試智能選擇器
    const smartSelectors = this.generateSmartSelectors(target);
    for (const selector of smartSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        console.log(`✅ 智能選擇器找到元素: ${selector}`);
        return element;
      }
    }

    // 如果需要等待元素出現
    if (waitForElement) {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 6; // 減少等待時間

        const checkElement = () => {
          attempts++;

          // 先檢查原始選擇器
          for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              console.log(`✅ 等待後找到目標元素: ${selector} (嘗試 ${attempts})`);
              resolve(element);
              return;
            }
          }

          // 再檢查智能選擇器
          for (const selector of smartSelectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              console.log(`✅ 智能選擇器等待後找到: ${selector} (嘗試 ${attempts})`);
              resolve(element);
              return;
            }
          }

          if (attempts < maxAttempts) {
            setTimeout(checkElement, 400);
          } else {
            console.warn(`⏰ 等待超時，找不到目標元素: ${target}`);
            resolve(null);
          }
        };

        setTimeout(checkElement, 300);
      });
    }

    console.warn(`❌ 找不到目標元素: ${target}`);
    return null;
  }

  /**
   * 生成智能選擇器
   */
  private generateSmartSelectors(target: string): string[] {
    const smartSelectors: string[] = [];

    // 根據目標生成智能選擇器
    if (target.includes('page-header') || target.includes('breadcrumb') || target.includes('choice-header')) {
      smartSelectors.push('c-card', '.card', 'h2', '.mb-0', '.card-header', '.p-4');
    }

    if (target.includes('form') || target.includes('filter')) {
      smartSelectors.push('form', '.row', '.form-select', '.form-group', '.col-md-3');
    }

    if (target.includes('button') || target.includes('btn')) {
      smartSelectors.push('button', '.btn', '[type="submit"]', 'c-button', '.btn-primary');
    }

    if (target.includes('exam-tabs') || target.includes('tab')) {
      smartSelectors.push('.exam-tabs', '.exam-tab-btn', '.nav-tabs', '.tab-content');
    }

    if (target.includes('question') || target.includes('content')) {
      smartSelectors.push('.question-text', '.question-content', '.exam-container', '.card-body');
    }

    if (target.includes('chat') || target.includes('ai')) {
      smartSelectors.push('.chat-container', '.message-input', '.ai-chat-content', '.input-group');
    }

    return smartSelectors;
  }

  /**
   * 創建頭像
   */
  private createAvatar(): void {
    this.avatarElement = document.createElement('div');
    this.avatarElement.className = 'detailed-guide-avatar';
    this.avatarElement.style.cssText = `
      position: fixed;
      width: 80px;
      height: 80px;
      background-image: url('/assets/misHelper.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 3px solid #28a745;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
      z-index: 10001;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: avatarBounce 2s infinite ease-in-out;
    `;

    // 添加點擊事件
    this.avatarElement.addEventListener('click', () => {
      this.nextStep();
    });

    document.body.appendChild(this.avatarElement);
  }

  /**
   * 高亮元素（綠色邊框）- 確保可以被清除
   */
  private highlightElement(element: HTMLElement): void {
    // 先移除之前的高亮效果
    element.classList.remove('detailed-guide-highlight');

    // 添加新的高亮效果
    element.classList.add('detailed-guide-highlight');
    element.style.border = '3px solid #28a745';
    element.style.borderRadius = '8px';
    element.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
    element.style.transition = 'all 0.3s ease';

    console.log(`🎯 高亮元素: ${element.tagName}.${element.className}`);
  }

  /**
   * 智能定位頭像 - 避免擋住目標元素和操作區域
   */
  private positionAvatar(target: HTMLElement, position: string): void {
    if (!this.avatarElement) return;

    const rect = target.getBoundingClientRect();
    const avatarSize = 60;
    const offset = 60; // 增加偏移量，避免擋住操作
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // 特殊處理：如果是導航選單，放在左上角避免擋住下拉選單
    if (target.closest('c-header-nav') || target.classList.contains('header-nav')) {
      left = 20;
      top = rect.bottom + 20;
    } else {
      // 智能選擇位置，優先避免擋住目標元素
      if (rect.right + avatarSize + offset < viewportWidth) {
        // 右側有足夠空間
        left = rect.right + offset;
        top = rect.top;
      } else if (rect.left - avatarSize - offset > 0) {
        // 左側有足夠空間
        left = rect.left - avatarSize - offset;
        top = rect.top;
      } else if (rect.bottom + avatarSize + offset < viewportHeight) {
        // 下方有足夠空間
        left = Math.max(rect.left, offset);
        top = rect.bottom + offset;
      } else {
        // 上方放置
        left = Math.max(rect.left, offset);
        top = Math.max(rect.top - avatarSize - offset, 20);
      }
    }

    // 確保頭像完全在視窗範圍內
    top = Math.max(20, Math.min(top, viewportHeight - avatarSize - 20));
    left = Math.max(20, Math.min(left, viewportWidth - avatarSize - 20));

    this.avatarElement.style.top = `${top}px`;
    this.avatarElement.style.left = `${left}px`;
  }

  /**
   * 顯示詳細說明 - 智能定位避免擋住操作區域
   */
  private showDetailedDescription(step: DetailedGuideStep, stepIndex: number): void {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'detailed-guide-description';

    // 獲取頭像位置
    const avatarRect = this.avatarElement?.getBoundingClientRect();
    if (!avatarRect) return;

    const dialogWidth = 320;
    const dialogHeight = 250; // 增加預估高度
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = avatarRect.top;
    let left = avatarRect.right + 15;

    // 特殊處理：如果是導航步驟，對話框放在下方避免擋住下拉選單
    if (step.target.includes('c-header-nav') || step.target.includes('c-dropdown')) {
      top = avatarRect.bottom + 15;
      left = Math.max(20, avatarRect.left - dialogWidth / 2);
    } else {
      // 智能選擇對話框位置，避免擋住目標元素和超出視窗
      if (left + dialogWidth > viewportWidth) {
        // 右側空間不夠，嘗試左側
        left = avatarRect.left - dialogWidth - 15;
        if (left < 0) {
          // 左側也不夠，放在上方或下方
          left = Math.max(20, Math.min(avatarRect.left, viewportWidth - dialogWidth - 20));
          if (top + dialogHeight > viewportHeight) {
            // 下方空間不夠，放在上方
            top = Math.max(20, avatarRect.top - dialogHeight - 15);
          } else {
            // 放在下方
            top = avatarRect.bottom + 15;
          }
        }
      }
    }

    // 確保對話框完全在視窗範圍內
    top = Math.max(20, Math.min(top, viewportHeight - dialogHeight - 20));
    left = Math.max(20, Math.min(left, viewportWidth - dialogWidth - 20));

    descriptionElement.style.cssText = `
      position: fixed;
      top: ${top}px;
      left: ${left}px;
      max-width: 320px;
      background: rgba(40, 167, 69, 0.95);
      color: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      z-index: 10002;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: descriptionFadeIn 0.3s ease-out;
    `;

    let contentHtml = `
      <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #fff;">
        ${step.title} (${stepIndex + 1}/${this.guideSteps.length})
      </div>
      <div style="font-size: 12px; line-height: 1.4; margin-bottom: 8px; color: rgba(255,255,255,0.9);">
        ${step.content}
      </div>
    `;

    // 添加按鈕功能說明
    if (step.buttonFunction) {
      contentHtml += `
        <div style="font-size: 11px; margin-bottom: 6px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
          <strong>🔘 按鈕功能：</strong>${step.buttonFunction}
        </div>
      `;
    }

    // 添加區塊用途說明
    if (step.blockPurpose) {
      contentHtml += `
        <div style="font-size: 11px; margin-bottom: 8px; padding: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;">
          <strong>📦 區塊用途：</strong>${step.blockPurpose}
        </div>
      `;
    }

    contentHtml += `
      <div style="display: flex; gap: 8px; justify-content: space-between; margin-top: 12px;">
        <button onclick="detailedGuideService.previousStep()" 
                style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; transition: all 0.2s;"
                ${stepIndex === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
          上一步
        </button>
        <button onclick="detailedGuideService.skipGuide()" 
                style="background: rgba(220,53,69,0.8); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; transition: all 0.2s;">
          跳過導覽
        </button>
        <button onclick="detailedGuideService.nextStep()" 
                style="background: rgba(255,255,255,0.9); color: #28a745; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s;">
          ${stepIndex === this.guideSteps.length - 1 ? '完成導覽' : '下一步'}
        </button>
      </div>
    `;

    descriptionElement.innerHTML = contentHtml;
    document.body.appendChild(descriptionElement);
  }

  /**
   * 下一步 - 強化版本，確保清理乾淨
   */
  nextStep(): void {
    // 立即清除所有效果，避免重複顯示
    this.clearEffects();

    // 清除自動跳過計時器
    if (this.autoSkipTimer) {
      clearTimeout(this.autoSkipTimer);
      this.autoSkipTimer = null;
    }

    if (this.currentStepIndex < this.guideSteps.length - 1) {
      this.executeStep(this.currentStepIndex + 1);
    } else {
      this.completeGuide();
    }
  }

  /**
   * 上一步
   */
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.executeStep(this.currentStepIndex - 1);
    }
  }

  /**
   * 跳過導覽
   */
  skipGuide(): void {
    this.endGuide();
    this.markUserAsGuided();
  }

  /**
   * 完成導覽
   */
  private completeGuide(): void {
    this.endGuide();
    this.markUserAsGuided();
    this.showCompletionMessage();
  }

  /**
   * 標記用戶已完成導覽
   */
  private markUserAsGuided(): void {
    const markGuidedUrl = 'http://localhost:5000/api/user-guide/mark-guided';
    
    this.http.post(markGuidedUrl, {}, this.httpOptions).subscribe({
      next: (response) => {
        console.log('用戶導覽狀態已更新:', response);
      },
      error: (error) => {
        console.error('更新用戶導覽狀態失敗:', error);
      }
    });
  }

  /**
   * 顯示完成訊息
   */
  private showCompletionMessage(): void {
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(40, 167, 69, 0.95);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      z-index: 10003;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: descriptionFadeIn 0.3s ease-out;
    `;

    messageElement.innerHTML = `
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">🎉 詳細導覽完成！</div>
      <div style="font-size: 14px; opacity: 0.9;">您已經完成了所有頁面的詳細功能介紹，現在可以熟練使用系統了！</div>
    `;

    document.body.appendChild(messageElement);

    // 3 秒後自動移除
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }

  /**
   * 等待用戶導航 - 修正版本，避免重複觸發
   */
  private waitForNavigation(step: DetailedGuideStep): void {
    console.log(`🧭 等待用戶導航到: ${step.page}`);

    // 先清除所有效果，避免重複顯示
    this.clearEffects();

    // 高亮導航按鈕
    this.highlightNavigationButton(step);

    // 設置路由監聽器
    const routeCheckInterval = setInterval(() => {
      if (window.location.pathname === step.page) {
        console.log(`✅ 用戶成功導航到: ${step.page}`);
        clearInterval(routeCheckInterval);

        // 清除導航相關的效果
        this.clearEffects();

        // 等待頁面載入後繼續當前步驟
        setTimeout(() => {
          this.executeStep(this.currentStepIndex);
        }, 1500);
      }
    }, 500);

    // 30秒後自動超時
    setTimeout(() => {
      clearInterval(routeCheckInterval);
      if (window.location.pathname !== step.page) {
        console.warn(`⏰ 導航超時，自動跳過: ${step.page}`);
        this.clearEffects();
        this.nextStep();
      }
    }, 30000);
  }

  /**
   * 高亮導航按鈕 - 修正為頂部導航
   */
  private highlightNavigationButton(step: DetailedGuideStep): { navSelector: string, navText: string, isDropdown: boolean } | null {
    if (!step || !step.page) {
      return null;
    }

    let navSelector: string | null = null;
    let navText: string = '';
    let isDropdown: boolean = false;

    // Logic for top-level navigation items
    if (step.page.includes('/dashboard/overview')) {
      navSelector = 'c-nav-item[ng-reflect-router-link="/dashboard/overview"]';
      navText = '概覽';
    } else if (step.page.includes('/dashboard/quiz-center') || step.page.includes('/dashboard/mistake-analysis')) {
      // For learning center related pages, we assume it's under the '學習中心' dropdown
      navSelector = 'c-dropdown[variant="nav-item"] a[cDropdownToggle]'; // Selector for the '學習中心' dropdown trigger
      navText = '學習中心';
      isDropdown = true;
    } else if (step.page.includes('/dashboard/quiz-result')) { // NEW CONDITION FOR QUIZ RESULT
      navSelector = 'c-dropdown[variant="nav-item"] a[cDropdownToggle]'; // Assuming '學習中心' dropdown for Quiz Result
      navText = '學習中心';
      isDropdown = true;
    } else if (step.page.includes('/dashboard/quiz-demonstration') || step.page.includes('/dashboard/ai-tutoring')) {
      // For quiz demonstration and AI tutoring, they are under '智能學習系統'
      navSelector = 'c-dropdown[variant="nav-item"] a[cDropdownToggle]'; // Selector for the '智能學習系統' dropdown trigger
      navText = '智能學習系統';
      isDropdown = true;
    }
    // ... other conditions ...

    if (navSelector) {
      return { navSelector, navText, isDropdown };
    }
    return null;
  }

  /**
   * 顯示導航提示
   */
  private showNavigationPrompt(step: DetailedGuideStep, navButton: HTMLElement, navText?: string, isDropdown?: boolean): void {
    const promptElement = document.createElement('div');
    promptElement.className = 'detailed-guide-navigation-prompt';
    promptElement.style.cssText = `
      position: fixed;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
      z-index: 10002;
      max-width: 320px;
      font-size: 14px;
      line-height: 1.4;
      animation: fadeInScale 0.3s ease-out;
    `;

    const rect = navButton.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // 智能定位提示框
    let left = rect.right + 20;
    if (left + 320 > viewportWidth) {
      left = rect.left - 340;
      if (left < 20) {
        left = 20;
      }
    }

    promptElement.style.left = `${left}px`;
    promptElement.style.top = `${rect.bottom + 10}px`;

    const buttonText = navText || '導航按鈕';
    const dropdownHint = isDropdown ?
      '<div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11px; opacity: 0.8;">💡 這是下拉選單，請先點擊展開再選擇子項目</div>' :
      '';

    promptElement.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">
        🎯 ${step.title}
      </div>
      <div style="margin-bottom: 12px;">
        請點擊頂部導航選單中的「${buttonText}」來前往下一個頁面
      </div>
      <div style="font-size: 12px; opacity: 0.9;">
        點擊後我會繼續為您介紹該頁面的功能
      </div>
      ${dropdownHint}
    `;

    document.body.appendChild(promptElement);
  }

  /**
   * 設置下拉選單監聽器
   */
  private setupDropdownListener(navButton: HTMLElement, step: DetailedGuideStep): void {
    console.log(`🎯 設置下拉選單監聽器`);

    navButton.addEventListener('click', () => {
      console.log(`📋 用戶點擊了下拉選單`);

      // 等待下拉選單展開
      setTimeout(() => {
        // 尋找子選單項目
        const dropdownItems = document.querySelectorAll('c-dropdown-item a, .dropdown-item, [cDropdownItem]');
        console.log(`🔍 找到 ${dropdownItems.length} 個下拉選單項目`);

        // 高亮相關的子選單項目並設置點擊監聽
        dropdownItems.forEach((item: Element) => {
          const href = (item as HTMLElement).getAttribute('routerLink') ||
                      (item as HTMLElement).getAttribute('href') || '';

          if (href.includes(step.page.split('/').pop() || '')) {
            console.log(`✅ 高亮子選單項目: ${href}`);
            this.highlightElement(item as HTMLElement);

            // 設置點擊監聽器，點擊後自動進入下一步
            (item as HTMLElement).addEventListener('click', () => {
              console.log(`🔗 用戶點擊了子選單項目: ${href}`);

              // 等待導航完成後自動進入下一步
              setTimeout(() => {
                if (window.location.pathname === step.page) {
                  console.log(`✅ 導航成功，自動進入下一步`);
                  this.nextStep();
                }
              }, 1500);
            }, { once: true });
          }
        });
      }, 300);
    }, { once: true });
  }

  /**
   * 顯示找不到導航的訊息
   */
  private showNavigationNotFoundMessage(step: DetailedGuideStep): void {
    console.error(`❌ 找不到導航按鈕: ${step.page}`);

    const notFoundElement = document.createElement('div');
    notFoundElement.className = 'detailed-guide-nav-not-found';
    notFoundElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ffc107, #e0a800);
      color: #212529;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
      z-index: 10003;
      max-width: 400px;
      text-align: center;
      font-size: 14px;
      line-height: 1.5;
    `;

    notFoundElement.innerHTML = `
      <div style="font-size: 18px; margin-bottom: 12px;">🧭</div>
      <div style="font-weight: 600; margin-bottom: 8px;">找不到導航按鈕</div>
      <div style="margin-bottom: 16px;">
        無法找到前往「${step.page}」的導航按鈕，可能頁面結構已變更
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="detailedGuideService.nextStep()"
                style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
          跳過此步驟
        </button>
        <button onclick="detailedGuideService.skipGuide()"
                style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
          結束導覽
        </button>
      </div>
    `;

    document.body.appendChild(notFoundElement);

    // 10秒後自動移除
    setTimeout(() => {
      if (notFoundElement.parentNode) {
        notFoundElement.remove();
      }
    }, 10000);
  }

  /**
   * 判斷是否為導航步驟
   */
  private isNavigationStep(step: DetailedGuideStep): boolean {
    return step.target.includes('c-sidebar-nav-link') ||
           step.target.includes('nav-link') ||
           step.target.includes('sidebar');
  }

  /**
   * 設置導航監聽器
   */
  private setupNavigationListener(target: HTMLElement, step: DetailedGuideStep): void {
    if (target && step.page) {
      target.addEventListener('click', () => {
        console.log(`🔗 用戶點擊了導航: ${step.page}`);
        // 等待導航完成
        setTimeout(() => {
          this.nextStep();
        }, 1000);
      }, { once: true });
    }
  }

  /**
   * 顯示找不到元素的訊息
   */
  private showElementNotFoundMessage(step: DetailedGuideStep): void {
    console.warn(`❌ 找不到目標元素: ${step.target}`);

    // 創建提示元素
    const notFoundElement = document.createElement('div');
    notFoundElement.className = 'detailed-guide-not-found';
    notFoundElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #ffc107, #e0a800);
      color: #212529;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
      z-index: 10003;
      max-width: 400px;
      text-align: center;
      font-size: 14px;
      line-height: 1.5;
    `;

    notFoundElement.innerHTML = `
      <div style="font-size: 18px; margin-bottom: 12px;">⚠️</div>
      <div style="font-weight: 600; margin-bottom: 8px;">找不到目標元素</div>
      <div style="margin-bottom: 16px;">
        可能頁面還在載入中，或者頁面結構已變更
      </div>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="detailedGuideService.nextStep()"
                style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
          跳過此步驟
        </button>
        <button onclick="detailedGuideService.skipGuide()"
                style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px;">
          結束導覽
        </button>
      </div>
    `;

    document.body.appendChild(notFoundElement);

    // 5秒後自動移除
    setTimeout(() => {
      if (notFoundElement.parentNode) {
        notFoundElement.remove();
      }
    });
  }

  /**
   * 清除效果 - 強化版本，確保清除所有重複元素
   */
  private clearEffects(): void {
    console.log('🧹 開始清除所有導覽效果...');

    // 移除高亮效果
    document.querySelectorAll('.detailed-guide-highlight').forEach(el => {
      el.classList.remove('detailed-guide-highlight');
      (el as HTMLElement).style.border = '';
      (el as HTMLElement).style.borderRadius = '';
      (el as HTMLElement).style.backgroundColor = '';
      (el as HTMLElement).style.transition = '';
    });

    // 移除所有導覽相關元素（包括可能的重複元素）
    const elementsToRemove = [
      '.detailed-guide-description',
      '.detailed-guide-navigation-prompt',
      '.detailed-guide-not-found',
      '.detailed-guide-nav-not-found',
      '.simple-guide-description',
      '.simple-guide-navigation-prompt'
    ];

    let removedCount = 0;
    elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.remove();
        removedCount++;
      });
    });

    console.log(`🧹 清除完成，移除了 ${removedCount} 個導覽元素`);
  }

  /**
   * 結束導覽
   */
  endGuide(): void {
    this.isActive = false;
    this.currentStepIndex = 0;
    this.guideSteps = [];

    // 清除自動跳過計時器
    if (this.autoSkipTimer) {
      clearTimeout(this.autoSkipTimer);
      this.autoSkipTimer = null;
    }

    this.clearEffects();

    if (this.avatarElement) {
      this.avatarElement.remove();
      this.avatarElement = null;
    }

    console.log('詳細導覽結束');
  }

  /**
   * 檢查是否正在導覽
   */
  isGuiding(): boolean {
    return this.isActive;
  }
}
