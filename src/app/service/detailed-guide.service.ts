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
        console.log('獲取到詳細導覽步驟:', this.guideSteps);
        
        // 開始執行第一步
        this.executeStep(0);
      } else {
        console.error('n8n 詳細導覽回應失敗:', response);
        this.endGuide();
      }
    } catch (error) {
      console.error('觸發詳細導覽失敗:', error);
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
    
    console.log(`執行步驟 ${stepIndex + 1}: ${step.title}`);

    // 如果需要導航到不同頁面
    if (step.page && step.page !== window.location.pathname) {
      console.log(`導航到頁面: ${step.page}`);
      await this.navigateToPage(step.page);
    }

    // 等待頁面載入和元素出現
    await this.waitForPageLoad();
    
    // 查找目標元素
    const target = await this.findTargetElement(step.target, step.waitForElement);
    
    if (target) {
      // 清除之前的效果
      this.clearEffects();
      
      // 滾動到目標元素
      target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

      // 等待滾動完成
      setTimeout(() => {
        // 高亮目標元素
        this.highlightElement(target);
        
        // 定位頭像
        this.positionAvatar(target, step.avatarPosition);
        
        // 顯示詳細說明
        this.showDetailedDescription(step, stepIndex);
      }, step.delay || 1000);
    } else {
      console.warn(`找不到目標元素: ${step.target}`);
      // 跳到下一步
      setTimeout(() => this.nextStep(), 2000);
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
        console.log(`找到目標元素: ${selector}`);
        return element;
      }
    }

    // 如果需要等待元素出現
    if (waitForElement) {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 20; // 最多等待 10 秒
        
        const checkElement = () => {
          attempts++;
          
          for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              console.log(`等待後找到目標元素: ${selector}`);
              resolve(element);
              return;
            }
          }
          
          if (attempts < maxAttempts) {
            setTimeout(checkElement, 500);
          } else {
            console.warn(`等待超時，找不到目標元素: ${target}`);
            resolve(null);
          }
        };
        
        setTimeout(checkElement, 500);
      });
    }

    return null;
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
   * 高亮元素（綠色邊框）
   */
  private highlightElement(element: HTMLElement): void {
    element.classList.add('detailed-guide-highlight');
    element.style.border = '3px solid #28a745';
    element.style.borderRadius = '8px';
    element.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
    element.style.transition = 'all 0.3s ease';
  }

  /**
   * 定位頭像
   */
  private positionAvatar(target: HTMLElement, position: string): void {
    if (!this.avatarElement) return;

    const rect = target.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top-left':
        top = rect.top - 100;
        left = rect.left - 50;
        break;
      case 'top-right':
        top = rect.top - 100;
        left = rect.right - 30;
        break;
      case 'bottom-left':
        top = rect.bottom + 20;
        left = rect.left - 50;
        break;
      case 'bottom-right':
        top = rect.bottom + 20;
        left = rect.right - 30;
        break;
    }

    this.avatarElement.style.top = `${Math.max(20, top)}px`;
    this.avatarElement.style.left = `${Math.max(20, Math.min(window.innerWidth - 100, left))}px`;
  }

  /**
   * 顯示詳細說明
   */
  private showDetailedDescription(step: DetailedGuideStep, stepIndex: number): void {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'detailed-guide-description';
    
    // 獲取頭像位置
    const avatarRect = this.avatarElement?.getBoundingClientRect();
    if (!avatarRect) return;

    let top = avatarRect.top;
    let left = avatarRect.right + 15;

    // 如果右側空間不夠，顯示在左側
    if (left + 320 > window.innerWidth) {
      left = avatarRect.left - 335;
    }

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
   * 下一步
   */
  nextStep(): void {
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
    const markGuidedUrl = 'http://localhost:3000/api/user-guide/mark-guided';
    
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
   * 清除效果
   */
  private clearEffects(): void {
    // 移除高亮效果
    document.querySelectorAll('.detailed-guide-highlight').forEach(el => {
      el.classList.remove('detailed-guide-highlight');
      (el as HTMLElement).style.border = '';
      (el as HTMLElement).style.borderRadius = '';
      (el as HTMLElement).style.backgroundColor = '';
      (el as HTMLElement).style.transition = '';
    });
    
    // 移除說明文字
    document.querySelectorAll('.detailed-guide-description').forEach(el => {
      el.remove();
    });
  }

  /**
   * 結束導覽
   */
  endGuide(): void {
    this.isActive = false;
    this.currentStepIndex = 0;
    this.guideSteps = [];
    
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
