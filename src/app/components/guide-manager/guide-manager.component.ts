import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DetailedGuideService } from '../../service/detailed-guide.service';
import { UserGuideStatusService } from '../../service/user-guide-status.service';

@Component({
  selector: 'app-guide-manager',
  template: `
    <!-- 導覽管理器 - 無可見內容，純邏輯組件 -->
    <div *ngIf="showDebugInfo" class="guide-debug-info">
      <p>用戶狀態: {{ userStatus?.new_user ? '新用戶' : '老用戶' }}</p>
      <p>導覽完成: {{ userStatus?.guide_completed ? '是' : '否' }}</p>
      <p>當前頁面: {{ currentPage }}</p>
    </div>
  `,
  styles: [`
    .guide-debug-info {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
    }
  `]
})
export class GuideManagerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  userStatus: any = null;
  currentPage: string = '';
  showDebugInfo: boolean = false; // 設為 true 可顯示調試信息

  constructor(
    private router: Router,
    private detailedGuideService: DetailedGuideService,
    private userGuideStatusService: UserGuideStatusService
  ) {}

  ngOnInit(): void {
    // 監聽路由變化
    const routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPage = event.url;
        this.handlePageChange(event.url);
      });

    this.subscriptions.push(routerSub);

    // 監聽用戶狀態變化
    const statusSub = this.userGuideStatusService.guideStatus$
      .subscribe(status => {
        this.userStatus = status;
        if (status && this.shouldTriggerGuide(status)) {
          this.triggerAutoGuide();
        }
      });

    this.subscriptions.push(statusSub);

    // 初始檢查用戶狀態
    this.checkInitialUserStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * 檢查初始用戶狀態
   */
  private checkInitialUserStatus(): void {
    this.userGuideStatusService.checkUserGuideStatus().subscribe({
      next: (status) => {
        this.userGuideStatusService.updateLocalStatus(status);
      },
      error: (error) => {
        // 如果 API 失敗，假設是新用戶
        const defaultStatus = {
          user_id: 'unknown',
          new_user: true,
          guide_completed: false,
          last_login: new Date().toISOString()
        };
        this.userGuideStatusService.updateLocalStatus(defaultStatus);
      }
    });
  }

  /**
   * 處理頁面變化
   */
  private handlePageChange(url: string): void {
    // 如果用戶正在導覽中，不要因為頁面變化而重新觸發
    if (this.detailedGuideService.isGuiding()) {
      return;
    }

    // 檢查是否需要觸發導覽
    if (this.userStatus && this.shouldTriggerGuide(this.userStatus)) {
      // 延遲觸發，等待頁面完全載入
      setTimeout(() => {
        this.triggerAutoGuide();
      }, 2000);
    }
  }

  /**
   * 判斷是否應該觸發導覽
   */
  private shouldTriggerGuide(status: any): boolean {
    // 只有新用戶且未完成導覽才自動觸發
    return status.new_user === true && status.guide_completed === false;
  }

  /**
   * 觸發自動導覽
   */
  private triggerAutoGuide(): void {
    // 顯示歡迎訊息
    this.showWelcomeMessage();
    
    // 延遲開始詳細導覽
    setTimeout(() => {
      this.detailedGuideService.startDetailedGuide();
    }, 3000);
  }

  /**
   * 顯示歡迎訊息
   */
  private showWelcomeMessage(): void {
    const welcomeElement = document.createElement('div');
    welcomeElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 30px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10004;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: welcomeFadeIn 0.5s ease-out;
      max-width: 400px;
    `;

    welcomeElement.innerHTML = `
      <div style="font-size: 24px; font-weight: 600; margin-bottom: 12px;">
        🎉 歡迎來到 MIS 教學系統！
      </div>
      <div style="font-size: 16px; opacity: 0.9; margin-bottom: 20px;">
        我是您的專屬導覽助手，將為您介紹系統的各項功能
      </div>
      <div style="font-size: 14px; opacity: 0.8;">
        導覽將在 3 秒後自動開始...
      </div>
    `;

    // 添加動畫樣式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes welcomeFadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(welcomeElement);

    // 3 秒後移除歡迎訊息
    setTimeout(() => {
      welcomeElement.remove();
      style.remove();
    }, 3000);
  }

  /**
   * 手動觸發導覽（供 Web AI 助手調用）
   */
  public manualTriggerGuide(): void {
    this.detailedGuideService.startDetailedGuide();
  }

  /**
   * 重置用戶狀態（用於測試）
   */
  public resetUserStatus(): void {
    this.userGuideStatusService.resetUserGuideStatus().subscribe({
      next: (response) => {
        this.checkInitialUserStatus();
      },
      error: (error) => {
        console.error('重置用戶狀態失敗:', error);
      }
    });
  }
}
