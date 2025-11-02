import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { SidebarService } from './sidebar.service';
import { QuizService } from './quiz.service';

export interface UserGuideStatus {
  user_id: string;
  new_user: boolean;
  guide_completed: boolean;
  last_login: string;
  guide_completion_date?: string;
}

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

// DetailedGuideResponse 已移除，不再需要從後端獲取步驟

export interface ActionExecutionResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DetailedGuideService {
  private avatarElement: HTMLElement | null = null;
  private currentStepIndex = 0;
  private guideSteps: DetailedGuideStep[] = [];
  private isActive = false;
  private autoSkipTimer: any = null; // 防止重複觸發自動跳過

  // 用戶導覽狀態管理
  private readonly guideStatusApiUrl = `${environment.apiBaseUrl}/api/user-guide`;
  private guideStatusSubject = new BehaviorSubject<UserGuideStatus | null>(null);
  public guideStatus$ = this.guideStatusSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private quizService: QuizService
  ) {
    // 暴露服務到全局，讓按鈕可以調用
    (window as any).detailedGuideService = this;
  }

  /**
   * 完整的導覽步驟配置
   * 按照用戶要求的順序：overview（含行事曆）→ 考古題 → 學習成效 → 其他功能 → 設定
   */
  private readonly COMPLETE_GUIDE_STEPS: DetailedGuideStep[] = [
    // ============ Overview 頁面 ============
    {
      id: "system-header",
      page: "/dashboard/overview",
      target: "c-header, app-default-header",
      title: "MIS 教學系統主導航",
      content: "歡迎來到 MIS 教學系統！這是系統的主導航欄，包含 Logo「學無止盡 Ever Learning」、功能選單和右側的設定按鈕。",
      buttonFunction: "點擊 Logo 返回首頁，中間是主要功能選單，右側是設定和登出功能",
      blockPurpose: "系統的核心導航工具，提供全站功能訪問和用戶身份管理",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "overview-main-content",
      page: "/dashboard/overview",
      target: ".dashboard-container, c-container[fluid]",
      title: "概覽頁面內容區",
      content: "這裡是概覽頁面的主要內容區域。上方有每日簽到功能，下方左側是學習行事曆，右側是今日頭條新聞。",
      buttonFunction: "查看整體學習進度、行事曆事件和最新新聞資訊",
      blockPurpose: "提供學習進度概覽、系統統計和重要通知資訊的集中展示",
      position: "bottom",
      avatarPosition: "bottom-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "calendar-section",
      page: "/dashboard/overview",
      target: ".col-lg-8.mb-4 c-card, .calendar-view, mwl-calendar-month-view",
      title: "學習行事曆",
      content: "這裡是學習行事曆功能區塊，顯示月曆視圖和所有已建立的學習事件。您可以點擊日期查看當日事件，或點擊事件查看詳情。",
      buttonFunction: "點擊日期：查看該日期的所有事件；點擊事件：查看事件詳情並可進行編輯或刪除",
      blockPurpose: "管理個人學習行程，設定學習目標和提醒，追蹤學習計畫",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "add-calendar-button",
      page: "/dashboard/overview",
      target: "c-card-body .d-flex.justify-content-between button.btn.btn-sm.btn-primary",
      title: "新增行事曆事件",
      content: "點擊這個「新增事件」按鈕可以新增學習事件。在彈出的視窗中，您可以設定事件標題、內容、日期，並選擇是否啟用通知提醒。",
      buttonFunction: "新增事件：點擊後會開啟彈窗，設定學習計畫的標題、內容、日期和通知時間",
      blockPurpose: "創建新的學習事件，管理學習行程和提醒",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "calendar-event-list",
      page: "/dashboard/overview",
      target: "c-modal .list-group .list-group-item, c-modal-body .list-group-item",
      title: "行事曆事件列表",
      content: "在事件清單中，這裡顯示您已建立的所有學習事件。您可以點擊事件查看詳情，使用編輯按鈕修改內容，或使用刪除按鈕移除不需要的事件。",
      buttonFunction: "查看事件：點擊事件查看詳情；編輯：修改事件內容和時間；刪除：移除不需要的事件",
      blockPurpose: "管理和追蹤所有學習事件，提供完整的 CRUD 功能",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1000
    },
    // ============ 考古題功能（通過測驗中心） ============
    {
      id: "click-learning-center-dropdown",
      page: "/dashboard/overview",
      target: "c-header-nav c-dropdown[variant='nav-item'] a[cDropdownToggle]",
      title: "點擊學習中心下拉選單",
      content: "請點擊頂部導航欄的「學習中心」按鈕，這會展開學習中心功能的下拉選單，包含「測驗中心」和「錯題統整」兩個選項。",
      buttonFunction: "點擊學習中心按鈕展開下拉選單",
      blockPurpose: "展開學習中心功能選單，提供測驗和錯題相關功能",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "select-quiz-center",
      page: "/dashboard/overview",
      target: "ul[cDropdownMenu] a[cDropdownItem], a[cDropdownItem][routerLink*='quiz-center'], .dropdown-menu a[routerLink*='quiz-center']",
      title: "選擇測驗中心",
      content: "在展開的下拉選單中，請點擊「測驗中心」選項進入測驗中心頁面。這裡可以選擇知識點測驗或學校考古題測驗。",
      buttonFunction: "點擊測驗中心選項，導航到測驗中心頁面",
      blockPurpose: "進入測驗中心，開始選擇測驗類型",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "quiz-center-tabs",
      page: "/dashboard/quiz-center",
      target: ".btn-group.w-100 .btn, button.btn[class*='btn-primary'], button.btn[class*='btn-outline-primary']",
      title: "測驗類型切換",
      content: "測驗中心提供兩種測驗類型：知識點測驗和學校考古題測驗。上方有兩個標籤按鈕可以切換測驗類型。",
      buttonFunction: "切換測驗類型：點擊標籤切換不同的測驗類型",
      blockPurpose: "選擇要進行的測驗類型",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "knowledge-point-selection",
      page: "/dashboard/quiz-center",
      target: "c-card-body .d-flex.flex-wrap.gap-2 button.btn.btn-outline-primary",
      title: "知識點測驗 - 選擇知識點",
      content: "這是知識點測驗功能。您可以從上方按鈕中選擇要練習的知識點，每個知識點會顯示可用的題目數量。",
      buttonFunction: "選擇知識點：點擊知識點按鈕選擇要練習的主題",
      blockPurpose: "選擇知識點進行測驗",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "knowledge-difficulty-selection",
      page: "/dashboard/quiz-center",
      target: "input[type='radio'][name='difficulty'], .form-check input[type='radio'][name='difficulty']",
      title: "知識點測驗 - 選擇難度",
      content: "選擇知識點後，可以選擇測驗難度：簡單、中等或困難。難度會影響題目的複雜程度。",
      buttonFunction: "選擇難度：點擊單選按鈕選擇測驗難度",
      blockPurpose: "設定測驗難度等級",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "knowledge-question-count",
      page: "/dashboard/quiz-center",
      target: "input[type='radio'][name='questionCount'], .form-check input[type='radio'][name='questionCount']",
      title: "知識點測驗 - 選擇題數",
      content: "最後選擇題目數量：10題、20題或30題。選擇完成後，點擊「開始測驗」按鈕即可開始。",
      buttonFunction: "選擇題數：點擊單選按鈕選擇題目數量，然後點擊開始測驗",
      blockPurpose: "設定測驗題目數量",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "switch-to-past-exam-tab",
      page: "/dashboard/quiz-center",
      target: ".btn-group.w-100 button.btn, button.btn[class*='btn-outline-primary']",
      title: "切換到學校考古題測驗",
      content: "點擊「學校考古題測驗」標籤（第二個按鈕），切換到學校考古題測驗功能。這裡可以根據特定學校、年度和系所進行測驗。",
      buttonFunction: "切換測驗類型：點擊「學校考古題測驗」標籤",
      blockPurpose: "切換到學校考古題測驗功能",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "select-school",
      page: "/dashboard/quiz-center",
      target: ".option-grid .option-card",
      title: "選擇學校",
      content: "在學校選擇區塊中，點擊您想要練習的學校卡片。系統會根據您選擇的學校載入對應的年度選項。",
      buttonFunction: "選擇學校：點擊學校卡片選擇目標學校",
      blockPurpose: "選擇考古題的目標學校",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "select-year",
      page: "/dashboard/quiz-center",
      target: "c-card-body .option-grid .option-card",
      title: "選擇年度",
      content: "選擇學校後，這裡會顯示該學校可用的考試年度。點擊您想要練習的年度卡片，系統會載入對應的系所選項。",
      buttonFunction: "選擇年度：點擊年度卡片選擇考試年份",
      blockPurpose: "選擇考古題的考試年度",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "select-department",
      page: "/dashboard/quiz-center",
      target: "c-card-body .option-grid .option-card",
      title: "選擇系所",
      content: "選擇學校和年度後，這裡會顯示該年度可用的系所。點擊您想要練習的系所卡片，系統會顯示找到的題目數量。",
      buttonFunction: "選擇系所：點擊系所卡片選擇目標系所，系統會顯示題目數量",
      blockPurpose: "選擇考古題的目標系所，完成測驗條件設定",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "start-past-exam-quiz",
      page: "/dashboard/quiz-center",
      target: "button.btn.btn-primary.btn-lg[disabled='false'], .d-grid button",
      title: "開始考古題測驗",
      content: "選擇完學校、年度和系所後，確認題目數量大於 0，然後點擊「開始測驗」按鈕進入答題頁面。",
      buttonFunction: "開始測驗：點擊按鈕後系統會創建測驗並導航到答題頁面",
      blockPurpose: "啟動考古題測驗，進入答題模式",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "exam-page-header",
      page: "/dashboard/quiz-taking",
      target: ".exam-container, .exam-header, .exam-container .exam-header, .exam-page-layout",
      title: "測驗作答頁面",
      content: "這裡是測驗作答頁面。上方顯示測驗標題，右上角顯示當前題目進度、計時器和提交答案按鈕。",
      buttonFunction: "查看考試資訊：標題顯示考試資訊；進度顯示當前題目位置；計時器顯示答題時間；提交答案按鈕用於完成測驗",
      blockPurpose: "測驗作答的主要介面，提供完整的答題環境和進度追蹤",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    },
    {
      id: "question-nav-panel",
      page: "/dashboard/quiz-taking",
      target: ".question-nav-panel, .col-md-3.col-lg-2.question-nav-panel, .question-grid, .question-nav-btn",
      title: "題目導覽面板",
      content: "左側是題目導覽面板，顯示所有題目的編號和狀態。您可以點擊任意題號快速跳轉到該題目。題目狀態包括：已作答、未作答、已標記、當前題目。",
      buttonFunction: "題目導覽：點擊題號快速跳轉；查看狀態：不同顏色和標記顯示題目狀態",
      blockPurpose: "題目導覽和狀態管理，提供快速題目切換功能",
      position: "right",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "question-area",
      page: "/dashboard/quiz-taking",
      target: ".question-area, .question-header, .question-text, .question-title, .exam-container .question-area",
      title: "題目內容區",
      content: "這裡顯示當前的題目內容。題目上方有標籤顯示題目類型（單選、多選、簡答等）。您可以在下方的答案區域作答。",
      buttonFunction: "閱讀題目：查看完整題目內容；選擇答案：在答案區域選擇或輸入答案",
      blockPurpose: "顯示題目內容和提供作答介面",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "answer-section",
      page: "/dashboard/quiz-taking",
      target: ".answer-section, .options-list, .form-check, .sub-question-answer, .answer-section .form-check",
      title: "答案選項區域",
      content: "這裡是答案選項區域。根據題目類型，可能是選項按鈕（單選、多選）、文字輸入框（簡答、填空）或長文字區域（長答題）。",
      buttonFunction: "作答題目：點擊選項或輸入答案；標記題目：使用標記按鈕標記需要複習的題目",
      blockPurpose: "提供題目作答介面，支援多種題型",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "submit-button",
      page: "/dashboard/quiz-taking",
      target: ".exam-header button.btn.btn-success, button.btn.btn-success, .exam-header .btn-success",
      title: "提交答案",
      content: "右上角的「提交答案」按鈕用於完成測驗並提交所有答案。點擊後系統會確認並顯示測驗結果。",
      buttonFunction: "提交答案：完成測驗並查看結果和詳細解析",
      blockPurpose: "完成測驗並獲取評分結果",
      position: "top",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    // ============ 學習成效分析 ============
    {
      id: "click-learning-analytics-menu",
      page: "/dashboard/overview",
      target: "c-header-nav c-nav-item a[cNavLink][routerLink*='learning-analytics']",
      title: "進入學習成效分析",
      content: "點擊頂部導航欄的「學習分析」選單項，進入學習成效分析頁面，查看您的學習進度和統計數據。",
      buttonFunction: "導航到學習成效分析頁面",
      blockPurpose: "查看學習統計和分析",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "learning-analytics-header",
      page: "/dashboard/learning-analytics",
      target: ".page-header, .page-title",
      title: "學習成效分析頁面",
      content: "這是學習成效分析頁面。上方顯示 AI 教練分析總結，下方有核心指標卡片（掌握度、答對率、學習時長等）。",
      buttonFunction: "查看整體學習成效和詳細分析",
      blockPurpose: "提供學習進度追蹤和成效分析的完整介面",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    {
      id: "ai-coach-summary",
      page: "/dashboard/learning-analytics",
      target: ".ai-coach-summary, c-card.ai-coach-summary",
      title: "AI 教練分析",
      content: "這裡是 AI 教練的智能分析總結，會自動分析您的學習狀況，指出需要關注的領域和表現良好的領域，並提供個人化建議。",
      buttonFunction: "查看 AI 分析：了解學習強項和弱項，獲取改進建議",
      blockPurpose: "提供 AI 驅動的學習分析和平建議",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1500
    },
    // ============ 課程中心 ============
    {
      id: "navigate-to-courses",
      page: "/dashboard/overview",
      target: "c-header-nav c-nav-item a[cNavLink][routerLink*='courses']",
      title: "課程中心",
      content: "點擊頂部導航欄的「課程」選單項，進入課程中心，這裡可以瀏覽所有可用的課程和教材。",
      buttonFunction: "導航到課程列表頁面",
      blockPurpose: "瀏覽和學習課程內容",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "courses-grid",
      page: "/dashboard/courses",
      target: ".course-bookshelf-container, .courses-grid, .course-card",
      title: "課程書架",
      content: "這裡是課程書架，以網格方式展示所有可用的課程。每個課程卡片顯示課程封面、名稱和簡介。點擊課程卡片可以查看詳細內容和教材。",
      buttonFunction: "選擇課程：點擊課程卡片進入該課程的詳細頁面",
      blockPurpose: "展示所有可用的課程資源，提供課程瀏覽和選擇功能",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    // ============ 科技趨勢（新聞） ============
    {
      id: "navigate-to-news",
      page: "/dashboard/overview",
      target: "c-header-nav c-nav-item a[cNavLink][routerLink*='news']",
      title: "科技趨勢",
      content: "點擊頂部導航欄的「科技趨勢」選單項，進入科技新聞頁面，瀏覽最新的科技新聞和趨勢資訊。",
      buttonFunction: "導航到科技新聞頁面",
      blockPurpose: "瀏覽最新科技資訊，掌握行業動態",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "news-search",
      page: "/dashboard/news",
      target: ".search-container, .search-wrapper, .search-input",
      title: "新聞搜尋功能",
      content: "這裡是新聞搜尋欄，您可以輸入關鍵字搜尋特定的新聞標題、內容或標籤。點擊搜尋按鈕或按 Enter 鍵執行搜尋。",
      buttonFunction: "搜尋新聞：輸入關鍵字搜尋相關新聞；清除：清空搜尋條件",
      blockPurpose: "提供新聞搜尋功能，快速找到感興趣的內容",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "news-grid",
      page: "/dashboard/news",
      target: ".news-grid, .news-card, .news-card-link",
      title: "新聞卡片列表",
      content: "這裡以卡片網格方式展示所有新聞。每個新聞卡片包含標題、摘要、日期和標籤。點擊卡片可以開啟新聞連結查看完整內容。",
      buttonFunction: "瀏覽新聞：點擊卡片開啟新聞連結；查看詳情：閱讀完整新聞內容",
      blockPurpose: "展示科技新聞內容，提供新聞瀏覽和閱讀功能",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    // ============ 錯題統整 ============
    {
      id: "navigate-to-mistake-analysis",
      page: "/dashboard/overview",
      target: "c-dropdown-menu a[cDropdownItem][routerLink*='mistake-analysis']",
      title: "錯題統整",
      content: "在「學習中心」下拉選單中，點擊「錯題統整」選項，進入錯題分析頁面，查看和複習您曾經答錯的題目。",
      buttonFunction: "導航到錯題統整頁面",
      blockPurpose: "查看和複習錯題，鞏固薄弱知識點",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "mistake-filters",
      page: "/dashboard/mistake-analysis",
      target: ".filters, .form-select, c-row .filters",
      title: "錯題篩選選項",
      content: "這裡提供多種篩選選項：可以根據狀態（正確、錯誤、未答）、知識點、時間範圍等條件篩選題目，幫助您針對性地複習。",
      buttonFunction: "篩選錯題：選擇篩選條件查看特定範圍的錯題",
      blockPurpose: "提供多維度的錯題篩選功能，幫助精準複習",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1000
    },
    // ============ AI 導師 ============
    {
      id: "navigate-to-ai-tutoring",
      page: "/dashboard/overview",
      target: "c-header-nav a[routerLink*='ai-tutoring'], a[cNavLink][routerLink*='ai-tutoring']",
      title: "AI 引導教學",
      content: "如果您剛完成測驗並有錯題，可以進入 AI 引導教學頁面。AI 會使用蘇格拉底式提問方式，幫助您理解錯題並補充相關知識。",
      buttonFunction: "進入 AI 引導教學頁面",
      blockPurpose: "AI 輔助學習和理解，提供個人化的教學引導",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "ai-tutoring-chat",
      page: "/dashboard/ai-tutoring",
      target: ".chat-card, .main-chat-area, .chat-messages",
      title: "AI 教學對話區",
      content: "這裡是 AI 智能教學對話區域。AI 會根據您的錯題進行引導式提問，幫助您理解概念。您可以在下方輸入框回覆 AI，或使用「提示」和「解釋」按鈕獲取幫助。",
      buttonFunction: "對話學習：與 AI 互動學習；提示：獲取學習提示；解釋：獲取詳細解釋",
      blockPurpose: "提供 AI 引導式教學互動，幫助深入理解知識",
      position: "bottom",
      avatarPosition: "bottom-right",
      waitForElement: true,
      delay: 1200
    },
    // ============ 設定 ============
    {
      id: "settings-menu",
      page: "/dashboard/overview",
      target: "c-header-nav.ms-auto c-dropdown a[cDropdownToggle]",
      title: "系統設定選單",
      content: "點擊右上角的「設定」按鈕，展開設定選單。這裡可以進入個人設定頁面，或執行登出操作。",
      buttonFunction: "展開設定選單：查看設定和登出選項",
      blockPurpose: "提供系統設定和帳號管理功能",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "open-settings-modal",
      page: "/dashboard/overview",
      target: "c-dropdown-menu a[cDropdownItem]",
      title: "開啟設定視窗",
      content: "在設定下拉選單中，點擊「編輯設定」選項，會開啟個人設定模態框。",
      buttonFunction: "開啟設定視窗：進入個人資料和設定管理",
      blockPurpose: "開啟個人設定介面",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    {
      id: "settings-profile",
      page: "/dashboard/overview",
      target: "c-modal#settingsModal c-card, .settings-container",
      title: "個人設定頁面",
      content: "這是個人設定模態框，左側可以編輯個人資訊（姓名、生日、目標學校），右側可以進行 LINE Bot 綁定。",
      buttonFunction: "編輯個人資料：修改姓名、生日、目標學校；LINE 綁定：掃描 QR Code 綁定 LINE Bot",
      blockPurpose: "個人資料和系統設定管理，包含 LINE Bot 整合",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 1000
    },
    // ============ 完成 ============
    {
      id: "guide-complete",
      page: "/dashboard/overview",
      target: "body",
      title: "導覽完成！",
      content: "恭喜您完成系統導覽！您現在已經了解系統的主要功能：概覽和行事曆、測驗中心、學習成效分析、課程中心、科技趨勢、AI 引導教學和系統設定。可以開始使用各項功能進行學習了。祝您學習愉快！",
      buttonFunction: "",
      blockPurpose: "導覽結束提示",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    }
  ];

  /**
   * 開始詳細導覽（動態生成步驟）
   * [已註解] 網站導覽功能暫時停用
   */
  async startDetailedGuide(): Promise<void> {
    // [已註解] 網站導覽功能暫時停用
    console.log('網站導覽功能已停用');
    return;
    
    /* 原始邏輯已註解
    try {
      this.isActive = true;
      this.currentStepIndex = 0;
      
      // 自動關閉 AI 側邊欄
      this.sidebarService.closeSidebar();
      
      // 如果不在概覽頁面，先導航到概覽頁面
      if (window.location.pathname !== '/dashboard/overview') {
        await this.router.navigate(['/dashboard/overview']);
        // 等待頁面載入完成
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 創建頭像
      this.createAvatar();
      
      // 動態生成導覽步驟（根據頁面實際狀態）
      this.guideSteps = this.generateDynamicSteps();
      
      // 開始執行第一步
      this.executeStep(0);
    } catch (error) {
      console.error('啟動導覽失敗:', error);
      this.endGuide();
    }
    */
  }

  /**
   * 動態生成導覽步驟（簡化為區塊介紹模式）
   */
  private generateDynamicSteps(): DetailedGuideStep[] {
    const steps: DetailedGuideStep[] = [];

    // ============ Overview 頁面 ============
    steps.push({
      id: "system-header",
      page: "/dashboard/overview",
      target: "c-header, app-default-header",
      title: "系統主導航",
      content: "歡迎來到 MIS 教學系統！\n\n這是系統的主導航欄，包含：\n• Logo「學無止盡 Ever Learning」：點擊可返回首頁\n• 主要功能選單：包含學習中心、課程、科技趨勢、AI 引導教學等功能\n• 右側設定按鈕：可以進入個人設定或登出系統",
      buttonFunction: "",
      blockPurpose: "系統的核心導航工具，提供全站功能訪問",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    });

    steps.push({
      id: "overview-main-content",
      page: "/dashboard/overview",
      target: ".dashboard-container, c-container[fluid]",
      title: "概覽頁面",
      content: "這裡是系統的概覽頁面，主要功能包括：\n\n• 每日簽到：上方有每日簽到功能，幫助您養成學習習慣\n• 學習行事曆：左側顯示月曆和學習事件，可管理學習計畫\n• 今日頭條：右側顯示最新的科技新聞和資訊\n\n您可以在這裡快速了解學習進度和重要通知。",
      buttonFunction: "",
      blockPurpose: "提供學習進度概覽和重要資訊集中展示",
      position: "bottom",
      avatarPosition: "bottom-right",
      waitForElement: true,
      delay: 2000
    });

    steps.push({
      id: "calendar-section",
      page: "/dashboard/overview",
      target: ".col-lg-8.mb-4 c-card, .calendar-view, mwl-calendar-month-view",
      title: "學習行事曆",
      content: "這是學習行事曆功能區塊。\n\n主要功能：\n• 查看月曆視圖：顯示當月的日期和已建立的事件\n• 新增事件：點擊「新增事件」按鈕可以建立學習計畫\n• 查看事件：點擊日期可查看該日的所有事件\n• 管理事件：可以編輯或刪除已建立的事件\n\n使用行事曆可以幫助您規劃學習時間，設定目標和提醒。",
      buttonFunction: "",
      blockPurpose: "管理個人學習行程，追蹤學習計畫",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 2000
    });

    // ============ 測驗中心 ============
    steps.push({
      id: "navigate-to-quiz-center",
      page: "/dashboard/overview",
      target: "c-header-nav",
      title: "前往測驗中心",
      content: "接下來我們要介紹測驗中心功能。\n\n操作方式：\n1. 點擊頂部導航欄的「學習中心」按鈕\n2. 在下拉選單中選擇「測驗中心」\n3. 系統會帶您進入測驗中心頁面\n\n請按照上述步驟操作，然後點擊「下一步」繼續。",
      buttonFunction: "",
      blockPurpose: "導航到測驗中心頁面",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    });

    // 測驗中心功能介紹
    steps.push(...this.generateQuizCenterSteps());

    // ============ 測驗作答頁面 ============
    steps.push(...this.generateQuizTakingSteps());

    // ============ 其他功能 ============
    steps.push(...this.generateOtherFeaturesSteps());

    // ============ 完成導覽 ============
    steps.push({
      id: "guide-complete",
      page: "/dashboard/overview",
      target: "body",
      title: "導覽完成！",
      content: "恭喜您完成系統導覽！\n\n您現在已經了解系統的主要功能：\n• 概覽頁面和行事曆\n• 測驗中心（知識點測驗、學校考古題測驗）\n• 測驗作答功能\n• 其他學習功能\n\n可以開始使用各項功能進行學習了。祝您學習愉快！",
      buttonFunction: "",
      blockPurpose: "導覽結束提示",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    });

    return steps;
  }

  /**
   * 檢測行事曆是否有事件
   */
  private checkCalendarHasEvents(): boolean {
    try {
      // 嘗試從 DOM 中檢測事件
      // 方法1: 檢查月曆視圖中的事件標記
      const eventElements = document.querySelectorAll('mwl-calendar-month-view .cal-event, .cal-event, [cal-event]');
      if (eventElements.length > 0) {
        return true;
      }
      // 方法2: 檢查是否有事件列表 modal 或事件項目
      const eventListItems = document.querySelectorAll('.list-group-item, [data-event-id]');
      if (eventListItems.length > 0) {
        return true;
      }
      // 如果都找不到，假設沒有事件（會介紹如何新增）
      return false;
    } catch (e) {
      return false;
    }
  }

  /**
   * 生成測驗中心步驟（簡化為功能介紹）
   */
  private generateQuizCenterSteps(): DetailedGuideStep[] {
    const steps: DetailedGuideStep[] = [];

    steps.push({
      id: "quiz-center-overview",
      page: "/dashboard/quiz-center",
      target: ".quiz-center-container, c-card",
      title: "測驗中心",
      content: "歡迎來到測驗中心！這裡提供兩種測驗類型：\n\n• 知識點測驗：根據特定知識點進行測驗，可選擇難度和題數\n• 學校考古題測驗：根據特定學校、年度和系所進行考古題測驗\n\n上方有兩個標籤可以切換不同的測驗類型。",
      buttonFunction: "",
      blockPurpose: "測驗功能的主要入口",
      position: "bottom",
      avatarPosition: "top-right",
      waitForElement: true,
      delay: 2000
    });

    steps.push({
      id: "knowledge-quiz-intro",
      page: "/dashboard/quiz-center",
      target: ".quiz-center-container c-card-body",
      title: "知識點測驗",
      content: "知識點測驗功能介紹：\n\n• 選擇知識點：從可用的知識點按鈕中選擇要練習的主題（如 AI、MIS、作業系統等）\n• 選擇難度：可選擇簡單、中等或困難\n• 選擇題數：可選擇 10 題、20 題或 30 題\n• 開始測驗：完成選擇後，點擊「開始測驗」按鈕即可開始\n\n您可以試試選擇一個知識點進行測驗。",
      buttonFunction: "",
      blockPurpose: "介紹知識點測驗功能",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 2000
    });

    steps.push({
      id: "past-exam-quiz-intro",
      page: "/dashboard/quiz-center",
      target: ".quiz-center-container c-card-body",
      title: "學校考古題測驗",
      content: "學校考古題測驗功能介紹：\n\n• 選擇學校：從學校卡片中選擇目標學校\n• 選擇年度：選擇該學校的考試年度\n• 選擇系所：選擇目標系所\n• 開始測驗：完成所有選擇後，系統會顯示題目數量，點擊「開始測驗」即可開始\n\n請您自行操作：選擇想要的學校、年度和系所，然後點擊「開始測驗」。完成後點擊「下一步」繼續導覽。",
      buttonFunction: "",
      blockPurpose: "介紹學校考古題測驗功能",
      position: "bottom",
      avatarPosition: "top-left",
      waitForElement: true,
      delay: 3000
    });

    return steps;
  }


  /**
   * 獲取測驗中心的當前標籤狀態
   */
  private getQuizCenterTab(): 'knowledge' | 'pastexam' | null {
    try {
      // 檢查當前頁面
      if (window.location.pathname !== '/dashboard/quiz-center') {
        return null;
      }
      
      // 方法1: 查找被選中的按鈕（有 btn-primary 類且沒有 btn-outline-primary）
      const buttons = Array.from(document.querySelectorAll('.btn-group button.btn')) as HTMLElement[];
      for (const btn of buttons) {
        // 檢查是否為激活狀態（有 btn-primary 且沒有 btn-outline-primary，或相反）
        const isActive = btn.classList.contains('btn-primary') && !btn.classList.contains('btn-outline-primary');
        if (isActive) {
          const text = btn.textContent?.trim() || '';
          if (text.includes('知識點測驗') || text.includes('知識點')) {
            return 'knowledge';
          }
          if (text.includes('學校考古題測驗') || text.includes('考古題')) {
            return 'pastexam';
          }
        }
      }
      
      // 方法2: 通過檢查內容區域來判斷（知識點測驗有知識點按鈕，考古題有學校選擇）
      const hasKnowledgeButtons = document.querySelector('.d-flex.flex-wrap.gap-2 button.btn.btn-outline-primary');
      const hasSchoolSection = Array.from(document.querySelectorAll('h6')).some(h => 
        h.textContent?.includes('選擇學校') || h.textContent?.includes('🏫')
      );
      
      if (hasKnowledgeButtons && !hasSchoolSection) {
        return 'knowledge';
      }
      if (hasSchoolSection && !hasKnowledgeButtons) {
        return 'pastexam';
      }
      
      // 默認返回知識點測驗（第一個標籤通常是默認的）
      return 'knowledge';
    } catch (e) {
      return null;
    }
  }

  /**
   * 獲取測驗中心的當前選擇狀態
   */
  private getQuizCenterState(): {
    selectedSchool: string | null;
    selectedYear: string | null;
    selectedDepartment: string | null;
    questionCount: number;
  } {
    try {
      if (window.location.pathname !== '/dashboard/quiz-center') {
        return { selectedSchool: null, selectedYear: null, selectedDepartment: null, questionCount: 0 };
      }

      // 檢測選中的學校、年度、系所（通過檢查 DOM 結構）
      // 查找所有帶有 selected 類的 option-card
      const allOptionCards = Array.from(document.querySelectorAll('.option-card')) as HTMLElement[];
      
      let selectedSchool: string | null = null;
      let selectedYear: string | null = null;
      let selectedDepartment: string | null = null;
      
      // 通過查找每個選擇區塊的標題來判斷選中的是什麼
      const allH6 = Array.from(document.querySelectorAll('h6')) as HTMLElement[];
      
      for (const h6 of allH6) {
        const text = h6.textContent?.trim() || '';
        const parentCard = h6.closest('c-card-body');
        
        if (parentCard) {
          if (text.includes('選擇學校') || text.includes('🏫')) {
            // 學校區塊
            const selectedCard = parentCard.querySelector('.option-card.selected');
            if (selectedCard) {
              const optionText = selectedCard.querySelector('.option-text')?.textContent?.trim();
              if (optionText) {
                selectedSchool = optionText;
              }
            }
          } else if (text.includes('選擇年度') || text.includes('📅')) {
            // 年度區塊
            const selectedCard = parentCard.querySelector('.option-card.selected');
            if (selectedCard) {
              const optionText = selectedCard.querySelector('.option-text')?.textContent?.trim();
              if (optionText && optionText.includes('年')) {
                selectedYear = optionText;
              }
            }
          } else if (text.includes('選擇系所') || text.includes('🎓')) {
            // 系所區塊
            const selectedCard = parentCard.querySelector('.option-card.selected');
            if (selectedCard) {
              const optionText = selectedCard.querySelector('.option-text')?.textContent?.trim();
              if (optionText && !optionText.includes('年')) {
                selectedDepartment = optionText;
              }
            }
          }
        }
      }

      // 檢測題目數量
      const countText = document.querySelector('.alert-info span')?.textContent || '';
      const countMatch = countText.match(/(\d+)/);
      const questionCount = countMatch ? parseInt(countMatch[1]) : 0;

      return { selectedSchool, selectedYear, selectedDepartment, questionCount };
    } catch (e) {
      return { selectedSchool: null, selectedYear: null, selectedDepartment: null, questionCount: 0 };
    }
  }

  /**
   * 重新生成測驗中心步驟（在執行過程中動態更新）
   */
  private regenerateQuizCenterSteps(): void {
    // 找到測驗中心相關步驟的索引範圍
    const quizCenterStartIndex = this.guideSteps.findIndex(s => s.id === 'quiz-center-tabs');
    if (quizCenterStartIndex === -1) return;

    // 找到測驗中心步驟結束的位置（下一個主要區塊開始前）
    let quizCenterEndIndex = this.guideSteps.findIndex((s, idx) => 
      idx > quizCenterStartIndex && 
      ['click-learning-analytics-menu', 'navigate-to-courses', 'navigate-to-news'].includes(s.id)
    );
    if (quizCenterEndIndex === -1) {
      quizCenterEndIndex = this.guideSteps.length;
    }

    // 重新生成測驗中心步驟
    const newQuizSteps = this.generateQuizCenterSteps();
    
    // 替換原有步驟
    const stepsBefore = this.guideSteps.slice(0, quizCenterStartIndex);
    const stepsAfter = this.guideSteps.slice(quizCenterEndIndex);
    this.guideSteps = [...stepsBefore, ...newQuizSteps, ...stepsAfter];

    // 如果當前步驟索引超出範圍，調整它
    if (this.currentStepIndex >= quizCenterStartIndex && this.currentStepIndex < quizCenterEndIndex) {
      // 保持在測驗中心範圍內的第一個步驟
      this.currentStepIndex = quizCenterStartIndex;
    }
  }

  /**
   * 生成剩餘的固定步驟
   */
  private generateRemainingSteps(): DetailedGuideStep[] {
    // 這裡包含所有其他不變的步驟（學習成效、課程、新聞等）
    // 從原來的 COMPLETE_GUIDE_STEPS 中提取剩餘部分
    const remainingSteps = this.COMPLETE_GUIDE_STEPS.filter(step => {
      const id = step.id;
      // 排除已經動態生成的步驟
      return ![
        'system-header', 'overview-main-content', 'calendar-section', 
        'add-calendar-button', 'calendar-event-list', 'calendar-view-events',
        'click-learning-center-dropdown', 'select-quiz-center',
        'quiz-center-tabs', 'knowledge-point-selection', 'knowledge-difficulty-selection',
        'knowledge-question-count', 'switch-to-past-exam-tab',
        'select-school', 'select-year', 'select-department', 'start-past-exam-quiz',
        'exam-page-header', 'question-nav-panel', 'question-area', 'answer-section', 'submit-button'
      ].includes(id);
    });

    return remainingSteps;
  }

  /**
   * 生成作答頁面步驟（簡化為功能介紹）
   */
  private generateQuizTakingSteps(): DetailedGuideStep[] {
    return [
      {
        id: "navigate-to-quiz-taking",
        page: "/dashboard/quiz-center",
        target: "body",
        title: "前往測驗作答頁面",
        content: "當您完成測驗選擇並點擊「開始測驗」後，系統會帶您進入測驗作答頁面。\n\n如果您還沒有開始測驗，請先完成測驗選擇並點擊「開始測驗」按鈕。\n\n完成後點擊「下一步」繼續導覽測驗作答頁面的功能。",
        buttonFunction: "",
        blockPurpose: "導航到測驗作答頁面",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2000
      },
      {
        id: "exam-page-overview",
        page: "/dashboard/quiz-taking",
        target: ".exam-container, .exam-page-layout, .quiz-taking-container, body",
        title: "測驗作答頁面",
        content: "這是測驗作答頁面的整體介紹：\n\n• 頁面頂部：顯示測驗標題和基本資訊（學校、年度、系所）\n• 右上角：顯示當前題目進度（如：第 1 題 / 共 23 題）、計時器、提交答案按鈕\n• 左側面板：題目導覽區，顯示所有題目的編號和狀態\n• 中間區域：題目內容和答案選項\n\n這些功能幫助您順利完成測驗。",
        buttonFunction: "",
        blockPurpose: "介紹測驗作答頁面的整體結構",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "question-navigation",
        page: "/dashboard/quiz-taking",
        target: ".question-nav-panel, .question-grid, .question-nav, body",
        title: "題目導覽功能",
        content: "左側的題目導覽面板提供以下功能：\n\n• 統計資訊：顯示總題數、已作答、未作答、已標記的數量\n• 題目編號：以網格方式顯示所有題目的編號，方便快速定位\n• 狀態顯示：不同顏色和標記顯示題目狀態\n  - 綠色：已作答\n  - 白色：未作答\n  - 黃色星號：已標記\n  - 藍色：當前題目\n• 快速跳轉：點擊任意題號可以快速跳轉到該題目\n\n使用題目導覽可以幫助您更好地管理答題進度。",
        buttonFunction: "",
        blockPurpose: "介紹題目導覽功能",
        position: "right",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "question-and-answer",
        page: "/dashboard/quiz-taking",
        target: ".question-area, .answer-section, .question-content, body",
        title: "題目與作答",
        content: "中間區域顯示題目內容和答案選項：\n\n• 題目標題：顯示測驗標題（學校、年度、系所）\n• 題目進度：右上角顯示「第 X / 共 Y 題」和計時器\n• 題目類型標籤：顯示題目類型（單選、多選、簡答、選填題等）\n• 題目內容：顯示完整的題目文字和相關資訊\n• 答案選項：根據題目類型提供不同的作答方式\n  - 單選/多選：提供選項按鈕（A、B、C、D 等）供您選擇\n  - 簡答/填空/選填：提供文字輸入框供您輸入答案\n  - 長答題：提供較大的文字區域供您輸入詳細答案\n• 標記功能：可以使用「標記此題★」按鈕標記需要複習的題目\n\n請仔細閱讀題目，選擇或輸入正確答案。",
        buttonFunction: "",
        blockPurpose: "介紹題目和作答功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "submit-exam",
        page: "/dashboard/quiz-taking",
        target: ".exam-header, button.btn-success, body",
        title: "提交測驗",
        content: "完成所有題目後，您可以提交測驗：\n\n• 提交按鈕：位於右上角的綠色「提交答案」按鈕\n• 提交確認：點擊後系統會確認是否要提交\n• 測驗結果：提交後會顯示測驗結果，包括：\n  - 總分和答對題數\n  - 每題的正確答案和您的答案\n  - 詳細解析（如有）\n• 標記功能：可以使用「標記此題★」按鈕標記需要複習的題目\n\n請確認完成所有題目後再提交。",
        buttonFunction: "",
        blockPurpose: "介紹提交測驗功能",
        position: "top",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      }
    ];
  }

  /**
   * 生成其他功能步驟
   */
  private generateOtherFeaturesSteps(): DetailedGuideStep[] {
    return [
      {
        id: "navigate-to-learning-analytics",
        page: "/dashboard/overview",
        target: "c-header-nav",
        title: "前往學習成效分析",
        content: "接下來我們要介紹學習成效分析功能。\n\n操作方式：\n1. 點擊頂部導航欄的「學習分析」選單項\n2. 系統會帶您進入學習成效分析頁面\n\n請按照上述步驟操作，然後點擊「下一步」繼續。",
        buttonFunction: "",
        blockPurpose: "導航到學習成效分析頁面",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2000
      },
      {
        id: "learning-analytics-overview",
        page: "/dashboard/learning-analytics",
        target: ".learning-analytics-container, .page-header, body",
        title: "學習成效分析頁面",
        content: "歡迎來到學習成效分析頁面！這裡提供全面的學習數據分析：\n\n• 頁面標題：顯示「學習成效分析」和說明\n• AI 教練總結：提供 AI 驅動的個人化學習分析和建議\n• 核心指標卡片：顯示掌握度、答對率、學習時長等關鍵數據\n• 知識診斷中心：深入分析知識掌握狀況，發現學習盲點\n• 趨勢分析：查看學習進度趨勢圖表\n\n這是了解自己學習狀況的重要工具。",
        buttonFunction: "",
        blockPurpose: "介紹學習成效分析頁面整體功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "learning-analytics-features",
        page: "/dashboard/learning-analytics",
        target: ".learning-analytics-container c-card, body",
        title: "學習分析功能詳情",
        content: "學習成效分析頁面提供以下詳細功能：\n\n• AI 教練分析：自動分析學習狀況，指出需要關注的領域和表現良好的領域\n• 核心指標：\n  - 掌握度：各知識點的掌握程度\n  - 答對率：測驗答題的正確率\n  - 學習時長：總學習時間統計\n  - 練習次數：完成的測驗和練習次數\n• 知識診斷：深入分析知識點掌握狀況，發現薄弱環節\n• 趨勢圖表：以視覺化方式展示學習進度變化\n• 個人化建議：根據分析結果提供改進建議\n\n您可以透過這些功能全面了解自己的學習狀況。",
        buttonFunction: "",
        blockPurpose: "詳細介紹學習分析功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "navigate-to-news",
        page: "/dashboard/overview",
        target: "c-header-nav",
        title: "前往科技趨勢",
        content: "接下來我們要介紹科技趨勢（新聞）功能。\n\n操作方式：\n1. 點擊頂部導航欄的「科技趨勢」選單項\n2. 系統會帶您進入科技新聞頁面\n\n請按照上述步驟操作，然後點擊「下一步」繼續。",
        buttonFunction: "",
        blockPurpose: "導航到科技趨勢頁面",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2000
      },
      {
        id: "news-overview",
        page: "/dashboard/news",
        target: ".news-container, .news-grid, body",
        title: "科技趨勢頁面",
        content: "歡迎來到科技趨勢頁面！這裡提供最新的科技新聞和資訊：\n\n• 新聞搜尋：上方有搜尋欄，可以輸入關鍵字搜尋特定的新聞\n• 新聞卡片：以網格方式展示所有新聞\n• 新聞內容：每個新聞卡片包含：\n  - 標題：新聞標題\n  - 摘要：新聞內容摘要\n  - 日期：發布日期\n  - 標籤：相關主題標籤\n• 查看詳情：點擊新聞卡片可以開啟新聞連結查看完整內容\n\n可以在這裡了解最新的科技發展和趨勢。",
        buttonFunction: "",
        blockPurpose: "介紹科技趨勢頁面功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "navigate-to-settings",
        page: "/dashboard/overview",
        target: "c-header-nav",
        title: "前往系統設定",
        content: "最後我們要介紹系統設定功能。\n\n操作方式：\n1. 點擊右上角的「設定」按鈕（齒輪圖標）\n2. 在下拉選單中選擇「編輯設定」\n3. 系統會開啟個人設定模態框\n\n請按照上述步驟操作，然後點擊「下一步」繼續。",
        buttonFunction: "",
        blockPurpose: "導航到系統設定",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2000
      },
      {
        id: "settings-overview",
        page: "/dashboard/overview",
        target: "c-modal#settingsModal, .settings-container, body",
        title: "系統設定功能",
        content: "這是系統設定模態框，提供以下功能：\n\n• 個人資料編輯：\n  - 姓名：可以修改顯示名稱\n  - 生日：設定出生日期\n  - 目標學校：選擇目標報考的學校\n• LINE Bot 綁定：\n  - 顯示 QR Code 供掃描\n  - 綁定後可以接收學習提醒和通知\n  - 可以在 LINE 上與系統互動\n• 登出功能：在設定選單中可以登出系統\n\n記得定期更新個人資料，並可以選擇綁定 LINE Bot 以獲得更好的學習體驗。",
        buttonFunction: "",
        blockPurpose: "詳細介紹系統設定功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2500
      },
      {
        id: "courses-intro",
        page: "/dashboard/overview",
        target: "c-header-nav",
        title: "課程中心",
        content: "課程中心提供豐富的學習資源：\n\n• 位置：頂部導航欄的「課程」選單\n• 功能：瀏覽所有可用的課程和教材\n• 內容：以書架方式展示，每個課程卡片顯示封面、名稱和簡介\n• 學習：點擊課程卡片可以查看詳細內容和教材\n\n可以在這裡找到適合的學習資源。",
        buttonFunction: "",
        blockPurpose: "介紹課程中心功能",
        position: "bottom",
        avatarPosition: "top-right",
        waitForElement: true,
        delay: 2000
      }
    ];
  }

  /**
   * 執行指定步驟（支持動態調整）
   * [已註解] 網站導覽功能暫時停用
   */
  private async executeStep(stepIndex: number): Promise<void> {
    // [已註解] 網站導覽功能暫時停用
    return;
    
    /* 原始邏輯已註解
    if (stepIndex >= this.guideSteps.length) {
      this.completeGuide();
      return;
    }

    // 在執行步驟前，動態檢測並可能重新生成步驟（特別是在測驗中心）
    // 但只在需要時重新生成（避免頻繁重新生成導致步驟跳躍）
    if (window.location.pathname === '/dashboard/quiz-center') {
      const currentStep = this.guideSteps[stepIndex];
      // 如果是測驗中心相關的步驟，且當前步驟ID在需要動態更新的步驟列表中
      if (currentStep && [
        'quiz-center-tabs', 'switch-to-past-exam-tab', 
        'select-school', 'select-year', 'select-department', 'start-past-exam-quiz',
        'knowledge-point-selection', 'knowledge-difficulty-selection', 'knowledge-question-count'
      ].includes(currentStep.id)) {
        this.regenerateQuizCenterSteps();
        // 重新獲取步驟（因為可能已經更新）
        if (stepIndex >= this.guideSteps.length) {
          this.completeGuide();
          return;
        }
      }
    }

    this.currentStepIndex = stepIndex;
    const step = this.guideSteps[stepIndex];

    // console.log(`🎯 執行步驟 ${stepIndex + 1}/${this.guideSteps.length}: ${step.title}`);

    // 檢查是否需要導航到其他頁面（改為純介紹模式，即使不在目標頁面也顯示介紹）
    if (step.page && step.page !== window.location.pathname) {
      // 純介紹模式：即使不在目標頁面，也顯示介紹說明
      // 只是提示用戶如何導航，但不強制等待
      this.showNavigationHint(step);
      return;
    }

    // 等待頁面載入和元素出現
    await this.waitForPageLoad();

    // 查找目標元素（改為寬鬆模式，找不到也繼續）
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
      }, step.delay || 1000);
    } else {
      // 找不到目標元素時，改為在頁面中央顯示介紹（純介紹模式）
      this.showDescriptionWithoutTarget(step, stepIndex);
    }
    */
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
    // 過濾掉不支援的選擇器（如 :contains）
    const validSelectors = target.split(',').map(s => s.trim()).filter(sel => {
      // 移除 jQuery 特定的選擇器
      if (sel.includes(':contains(') || sel.includes(':has(')) {
        return false; // 完全移除這些選擇器
      }
      return sel.length > 0;
    });

    // 立即嘗試查找
    for (const selector of validSelectors) {
      try {
      const element = document.querySelector(selector) as HTMLElement;
        if (element && this.isElementVisible(element)) {
        return element;
        }
      } catch (e) {
        // 忽略無效選擇器的錯誤
        continue;
      }
    }

    // 嘗試查找測驗中心標籤切換按鈕
    if (target.includes('switch-to-past-exam') || (target.includes('.btn-group') && target.includes('button'))) {
      const btnGroups = Array.from(document.querySelectorAll('.btn-group.w-100, .btn-group')) as HTMLElement[];
      for (const group of btnGroups) {
        const buttons = Array.from(group.querySelectorAll('button.btn')) as HTMLElement[];
        // 查找包含「學校考古題測驗」文字的按鈕（通常是第二個）
        for (let i = 0; i < buttons.length; i++) {
          const btn = buttons[i];
          const text = btn.textContent?.trim() || '';
          if (text.includes('學校考古題測驗')) {
            return btn;
          }
          // 如果只有兩個按鈕且是第二個，也返回它
          if (buttons.length === 2 && i === 1) {
            return btn;
          }
        }
      }
    }

    // 嘗試查找下拉選單項（dropdown items）
    if (target.includes('dropdown') || target.includes('quiz-center') || target.includes('測驗中心') || target.includes('錯題統整')) {
      // 先嘗試找到下拉選單容器
      const dropdownMenus = Array.from(document.querySelectorAll('ul[cDropdownMenu], [cDropdownMenu], .dropdown-menu')) as HTMLElement[];
      for (const menu of dropdownMenus) {
        // 檢查是否可見（下拉選單展開）
        if (this.isElementVisible(menu)) {
          // 查找包含特定文字的下拉選單項
          const items = Array.from(menu.querySelectorAll('a[cDropdownItem], a.dropdown-item, li > a')) as HTMLElement[];
          for (const item of items) {
            const text = item.textContent?.trim() || '';
            // 查找「測驗中心」或包含 quiz-center 的連結
            if (target.includes('quiz-center') || target.includes('測驗中心')) {
              if (text.includes('測驗中心') || item.getAttribute('routerLink')?.includes('quiz-center')) {
                return item;
              }
            }
            // 查找「錯題統整」
            if (target.includes('錯題統整') || target.includes('mistake-analysis')) {
              if (text.includes('錯題統整') || item.getAttribute('routerLink')?.includes('mistake-analysis')) {
                return item;
              }
            }
          }
        }
      }
      
      // 如果下拉選單未展開，嘗試先展開
      const dropdownToggles = Array.from(document.querySelectorAll('a[cDropdownToggle], .dropdown-toggle')) as HTMLElement[];
      for (const toggle of dropdownToggles) {
        const text = toggle.textContent?.trim() || '';
        if (text.includes('學習中心') || text.includes('Learning Center')) {
          // 如果下拉選單未展開，點擊展開
          const parent = toggle.closest('c-dropdown, .dropdown');
          if (parent) {
            const menu = parent.querySelector('ul[cDropdownMenu], [cDropdownMenu], .dropdown-menu') as HTMLElement;
            if (menu && !this.isElementVisible(menu)) {
              // 觸發點擊以展開下拉選單
              toggle.click();
              // 等待下拉選單展開
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // 再次查找下拉選單項
              if (menu && this.isElementVisible(menu)) {
                const items = Array.from(menu.querySelectorAll('a[cDropdownItem], a.dropdown-item, li > a')) as HTMLElement[];
                for (const item of items) {
                  const itemText = item.textContent?.trim() || '';
                  if (target.includes('quiz-center') || target.includes('測驗中心')) {
                    if (itemText.includes('測驗中心') || item.getAttribute('routerLink')?.includes('quiz-center')) {
                      return item;
                    }
                  }
                  if (target.includes('錯題統整') || target.includes('mistake-analysis')) {
                    if (itemText.includes('錯題統整') || item.getAttribute('routerLink')?.includes('mistake-analysis')) {
                      return item;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // 嘗試查找包含特定文字的按鈕（針對 :contains('新增') 的情況）
    if (target.includes('新增') || target.includes('新增事件')) {
      const buttons = Array.from(document.querySelectorAll('button, .btn')) as HTMLElement[];
      for (const btn of buttons) {
        if (btn.textContent?.includes('新增') || btn.textContent?.includes('新增事件')) {
          // 優先選擇主要按鈕（btn-primary）
          if (btn.classList.contains('btn-primary')) {
            return btn;
          }
        }
      }
      // 如果沒有 primary 按鈕，返回第一個包含「新增」的按鈕
      for (const btn of buttons) {
        if (btn.textContent?.includes('新增') || btn.textContent?.includes('新增事件')) {
          return btn;
        }
      }
    }

    // 如果找不到，嘗試智能選擇器
    const smartSelectors = this.generateSmartSelectors(target);
    for (const selector of smartSelectors) {
      try {
      const element = document.querySelector(selector) as HTMLElement;
        if (element && this.isElementVisible(element)) {
        return element;
        }
      } catch (e) {
        continue;
      }
    }

    // 如果需要等待元素出現
    if (waitForElement) {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 6; // 減少等待時間

        const checkElement = () => {
          attempts++;

          // 先檢查有效選擇器
          for (const selector of validSelectors) {
            try {
            const element = document.querySelector(selector) as HTMLElement;
              if (element && this.isElementVisible(element)) {
              resolve(element);
              return;
              }
            } catch (e) {
              continue;
            }
          }

          // 檢查下拉選單項
          if (target.includes('dropdown') || target.includes('quiz-center') || target.includes('測驗中心') || target.includes('錯題統整')) {
            const dropdownMenus = Array.from(document.querySelectorAll('ul[cDropdownMenu], [cDropdownMenu], .dropdown-menu')) as HTMLElement[];
            for (const menu of dropdownMenus) {
              if (this.isElementVisible(menu)) {
                const items = Array.from(menu.querySelectorAll('a[cDropdownItem], a.dropdown-item, li > a')) as HTMLElement[];
                for (const item of items) {
                  const text = item.textContent?.trim() || '';
                  if (target.includes('quiz-center') || target.includes('測驗中心')) {
                    if (text.includes('測驗中心') || item.getAttribute('routerLink')?.includes('quiz-center')) {
                      resolve(item);
                      return;
                    }
                  }
                  if (target.includes('錯題統整') || target.includes('mistake-analysis')) {
                    if (text.includes('錯題統整') || item.getAttribute('routerLink')?.includes('mistake-analysis')) {
                      resolve(item);
                      return;
                    }
                  }
                }
              }
            }
          }

          // 檢查 Modal 中的列表項（如行事曆事件列表）
          if (target.includes('list-group') || target.includes('list-group-item')) {
            // 先查找可見的 Modal
            const modals = Array.from(document.querySelectorAll('c-modal, .modal, [role="dialog"]')) as HTMLElement[];
            for (const modal of modals) {
              if (this.isElementVisible(modal)) {
                const listItems = Array.from(modal.querySelectorAll('.list-group-item, [class*="list-group-item"]')) as HTMLElement[];
                if (listItems.length > 0) {
                  // 返回第一個可見的列表項
                  for (const item of listItems) {
                    if (this.isElementVisible(item)) {
                      resolve(item);
                      return;
                    }
                  }
                  // 如果沒有可見項，返回第一個（可能是 Modal 未完全展開）
                  if (listItems.length > 0) {
                    resolve(listItems[0]);
                    return;
                  }
                }
              }
            }
          }

          // 再檢查文字匹配
          if (target.includes('新增') || target.includes('新增事件')) {
            const buttons = Array.from(document.querySelectorAll('button, .btn')) as HTMLElement[];
            for (const btn of buttons) {
              if (btn.textContent?.includes('新增') || btn.textContent?.includes('新增事件')) {
                if (btn.classList.contains('btn-primary')) {
                  resolve(btn);
                  return;
                }
              }
            }
          }

          // 再檢查智能選擇器
          for (const selector of smartSelectors) {
            try {
            const element = document.querySelector(selector) as HTMLElement;
              if (element && this.isElementVisible(element)) {
              resolve(element);
              return;
              }
            } catch (e) {
              continue;
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
      smartSelectors.push('c-card', '.card', 'h2', '.mb-0', '.card-header', '.p-4', '.page-header', '.page-title');
    }

    if (target.includes('form') || target.includes('filter')) {
      smartSelectors.push('form', '.row', '.form-select', '.form-group', '.col-md-3', '.filters');
    }

    if (target.includes('button') || target.includes('btn')) {
      smartSelectors.push('button', '.btn', '[type="submit"]', 'c-button', '.btn-primary', '.btn-sm.btn-primary');
    }

    if (target.includes('exam-tabs') || target.includes('tab') || target.includes('quiz-center')) {
      smartSelectors.push('.btn-group', '.exam-tabs', '.exam-tab-btn', '.nav-tabs', '.tab-content');
    }

    if (target.includes('question') || target.includes('content')) {
      smartSelectors.push('.question-text', '.question-content', '.exam-container', '.card-body', '.question-area');
    }

    if (target.includes('chat') || target.includes('ai') || target.includes('tutoring')) {
      smartSelectors.push('.chat-container', '.message-input', '.ai-chat-content', '.input-group', '.chat-card', '.chat-messages');
    }

    if (target.includes('calendar') || target.includes('event')) {
      smartSelectors.push('.calendar-view', 'mwl-calendar-month-view', '.list-group', '.list-group-item');
    }

    if (target.includes('course') || target.includes('bookshelf')) {
      smartSelectors.push('.course-bookshelf-container', '.courses-grid', '.course-card', '.course-cover');
    }

    if (target.includes('news') || target.includes('科技趨勢')) {
      smartSelectors.push('.news-container', '.news-grid', '.news-card', '.search-container');
    }

    if (target.includes('option-card') || target.includes('選擇')) {
      smartSelectors.push('.option-grid', '.option-card', '.option-text');
    }

    return smartSelectors;
  }

  /**
   * 創建導覽頭像
   * [已註解] 網站導覽功能暫時停用
   */
  private createAvatar(): void {
    // [已註解] 網站導覽功能暫時停用
    return;
    
    /* 原始邏輯已註解
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
    */
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

  }

  /**
   * 智能定位頭像 - 跟隨 AI 助手側邊欄或目標元素
   */
  private positionAvatar(target: HTMLElement, position: string): void {
    if (!this.avatarElement) return;

    // 首先嘗試定位在 AI 助手側邊欄附近
    const sidebar = document.querySelector('.web-ai-sidebar') as HTMLElement;
    if (sidebar && window.getComputedStyle(sidebar).display !== 'none') {
      const sidebarRect = sidebar.getBoundingClientRect();
      const avatarSize = 60;
      
      // 如果側邊欄展開，將頭像放在側邊欄左側
      if (sidebar.classList.contains('expanded')) {
        this.avatarElement.style.top = `${sidebarRect.top + 80}px`;
        this.avatarElement.style.left = `${sidebarRect.left - avatarSize - 20}px`;
        return;
      } else {
        // 如果側邊欄收合，放在側邊欄按鈕上方
        const toggleButton = document.querySelector('.sidebar-toggle-button') as HTMLElement;
        if (toggleButton) {
          const buttonRect = toggleButton.getBoundingClientRect();
          this.avatarElement.style.top = `${buttonRect.top - avatarSize - 10}px`;
          this.avatarElement.style.left = `${buttonRect.left - avatarSize - 10}px`;
          return;
        }
      }
    }

    // 如果找不到側邊欄，使用原來的邏輯定位在目標元素附近
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
   * 顯示詳細說明 - 跟隨頭像位置，優先放在 AI 助手側邊欄附近
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

    // 優先考慮 AI 助手側邊欄的位置
    const sidebar = document.querySelector('.web-ai-sidebar') as HTMLElement;
    let top = avatarRect.top;
    let left = avatarRect.right + 15;

    // 如果側邊欄展開，對話框放在頭像左側（側邊欄和頭像之間）
    if (sidebar && sidebar.classList.contains('expanded')) {
      const sidebarRect = sidebar.getBoundingClientRect();
      // 對話框放在頭像左側，靠近側邊欄
      left = Math.max(20, avatarRect.left - dialogWidth - 15);
      top = avatarRect.top;
      
      // 如果左側空間不夠，放在頭像下方
      if (left < 20 || left + dialogWidth > sidebarRect.left - 20) {
        left = Math.max(20, avatarRect.left - dialogWidth / 2);
        top = avatarRect.bottom + 15;
      }
    } else {
      // 如果側邊欄收合，使用原來的邏輯
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
   * [已註解] 網站導覽功能暫時停用
   */
  nextStep(): void {
    // [已註解] 網站導覽功能暫時停用
    console.log('網站導覽功能已停用');
    return;
    
    /* 原始邏輯已註解
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
    */
  }

  /**
   * 上一步
   * [已註解] 網站導覽功能暫時停用
   */
  previousStep(): void {
    // [已註解] 網站導覽功能暫時停用
    console.log('網站導覽功能已停用');
    return;
    
    /* 原始邏輯已註解
    if (this.currentStepIndex > 0) {
      this.executeStep(this.currentStepIndex - 1);
    }
    */
  }

  /**
   * 跳過導覽
   * [已註解] 網站導覽功能暫時停用
   */
  skipGuide(): void {
    // [已註解] 網站導覽功能暫時停用
    console.log('網站導覽功能已停用');
    return;
    
    /* 原始邏輯已註解
    this.endGuide();
    this.markUserAsGuided();
    */
  }

  /**
   * 完成導覽
   * [已註解] 網站導覽功能暫時停用
   */
  private completeGuide(): void {
    // [已註解] 網站導覽功能暫時停用
    this.endGuide();
    /* 原始邏輯已註解
    this.endGuide();
    this.markUserAsGuided();
    this.showCompletionMessage();
    */
  }

  /**
   * 標記用戶已完成導覽
   */
  private markUserAsGuided(): void {
    this.http.post(`${this.guideStatusApiUrl}/mark-guided`, {}, this.httpOptions).subscribe({
      next: (response: any) => {
        console.log('用戶導覽狀態已更新:', response);
        // 更新本地狀態
        const currentStatus = this.guideStatusSubject.value;
        if (currentStatus) {
          this.guideStatusSubject.next({
            ...currentStatus,
            guide_completed: true,
            guide_completion_date: new Date().toISOString()
          });
        }
      },
      error: (error) => {
        console.error('更新用戶導覽狀態失敗:', error);
      }
    });
  }

  // ============ 用戶導覽狀態管理方法 ============

  /**
   * 檢查用戶導覽狀態
   */
  checkUserGuideStatus(): Observable<UserGuideStatus> {
    return this.http.get<UserGuideStatus>(`${this.guideStatusApiUrl}/status`, this.httpOptions).pipe(
      tap((status) => {
        this.guideStatusSubject.next(status);
      })
    );
  }

  /**
   * 標記用戶已完成導覽（公開方法）
   */
  markUserAsGuidedPublic(): Observable<any> {
    return this.http.post(`${this.guideStatusApiUrl}/mark-guided`, {}, this.httpOptions).pipe(
      tap((response: any) => {
        const currentStatus = this.guideStatusSubject.value;
        if (currentStatus) {
          this.guideStatusSubject.next({
            ...currentStatus,
            guide_completed: true,
            guide_completion_date: new Date().toISOString()
          });
        }
      })
    );
  }

  /**
   * 重置用戶導覽狀態（用於測試）
   */
  resetUserGuideStatus(): Observable<any> {
    return this.http.post(`${this.guideStatusApiUrl}/reset`, {}, this.httpOptions).pipe(
      tap((response: any) => {
        // 重置本地狀態
        this.guideStatusSubject.next(null);
      })
    );
  }

  /**
   * 更新本地狀態
   */
  updateLocalStatus(status: UserGuideStatus): void {
    this.guideStatusSubject.next(status);
  }

  /**
   * 獲取當前狀態
   */
  getCurrentStatus(): UserGuideStatus | null {
    return this.guideStatusSubject.value;
  }

  /**
   * 檢查是否需要顯示導覽
   */
  shouldShowGuide(): boolean {
    const status = this.getCurrentStatus();
    return status ? status.new_user && !status.guide_completed : false;
  }

  // ============ AI 操作執行方法（整合自 AiActionExecutorService） ============

  /**
   * 執行操作（根據後端配置）
   */
  executeAction(actionId: string, params: Record<string, any> = {}): Promise<ActionExecutionResult> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<{success: boolean, data?: any, error?: string}>(
      `${environment.apiBaseUrl}/web-ai/execute-action`,
      { action_id: actionId, params },
      { headers }
    ).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          const result = this.handleActionExecution(response.data, params);
          // 如果是 Promise，直接返回；否則包裝成 Promise
          return result instanceof Promise ? result : Promise.resolve(result);
        } else {
          return Promise.resolve({
            success: false,
            error: response.error || '操作執行失敗'
          });
        }
      }),
      catchError((error: any) => {
        return Promise.resolve({
          success: false,
          error: error.error?.message || error.message || '操作執行失敗'
        });
      })
    ).toPromise().then((promise: any) => promise instanceof Promise ? promise : Promise.resolve(promise)) as Promise<ActionExecutionResult>;
  }

  /**
   * 處理操作執行結果
   */
  private handleActionExecution(result: any, params: Record<string, any>): ActionExecutionResult | Promise<ActionExecutionResult> {
    const actionType = result.action_type;
    const actionId = result.action;

    switch (actionType) {
      case 'navigate':
        if (result.route) {
          this.router.navigate([result.route]);
        }
        return {
          success: true,
          message: '導航成功',
          data: result
        };

      case 'navigate_with_params':
        if (result.route) {
          // 替換路由參數
          let route = result.route;
          const queryParams: Record<string, any> = {};
          
          // 替換路徑參數
          for (const [key, value] of Object.entries(params)) {
            route = route.replace(`:${key}`, String(value));
            queryParams[key] = value;
          }
          
          // 移除已替換的參數
          Object.keys(params).forEach(key => {
            if (!route.includes(`:${key}`)) {
              delete queryParams[key];
            }
          });
          
          const routeSegments = route.split('/').filter((s: string) => s);
          this.router.navigate(routeSegments, { queryParams });
        }
        return {
          success: true,
          message: '導航成功',
          data: result
        };

      case 'api_call':
      case 'create_quiz':
        // 如果是創建測驗，調用 quizService（異步處理）
        if (actionId === 'create_university_quiz' || actionId === 'create_knowledge_quiz') {
          return this.executeCreateQuiz(result, params).then(quizResult => quizResult);
        }
        // 其他 API 調用
        return Promise.resolve({
          success: true,
          message: 'API 調用成功',
          data: result
        });

      default:
        return {
          success: false,
          error: `不支援的操作類型: ${actionType}`
        };
    }
  }

  /**
   * 執行創建測驗操作
   */
  private executeCreateQuiz(result: any, params: Record<string, any>): Promise<ActionExecutionResult> {
    const apiBody = result.api_body || {};
    
    return new Promise((resolve) => {
      this.quizService.createQuiz(apiBody).subscribe({
        next: (response: any) => {
          if (response && response.quiz_id) {
            // 存儲測驗數據
            this.quizService.setCurrentQuizData(response);
            
            resolve({
              success: true,
              message: '測驗創建成功',
              data: {
                quiz_id: response.quiz_id,
                template_id: response.template_id,
                ...response
              }
            });
          } else {
            resolve({
              success: false,
              error: '測驗創建失敗：無效的回應格式'
            });
          }
        },
        error: (error: any) => {
          resolve({
            success: false,
            error: error.error?.message || error.message || '創建測驗失敗，請稍後再試'
          });
        }
      });
    });
  }

  /**
   * 獲取操作配置
   */
  getActionsConfig(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${environment.apiBaseUrl}/guide/actions-config`, { headers }).pipe(
      map((response: any) => response.data || {})
    );
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
   * 顯示導航提示（純介紹模式）
   */
  private showNavigationHint(step: DetailedGuideStep): void {
    // 清除所有效果
    this.clearEffects();
    
    // 顯示介紹說明（即使不在目標頁面）
    this.showDescriptionWithoutTarget(step, this.currentStepIndex);
    
    // 設置監聽路由變化，如果用戶導航到目標頁面，自動更新顯示
    const checkNavigation = () => {
      if (window.location.pathname === step.page) {
        // 已經在目標頁面，重新執行步驟以顯示正確的高亮
        setTimeout(() => {
          this.executeStep(this.currentStepIndex);
        }, 500);
        return true;
      }
      return false;
    };
    
    // 立即檢查一次
    if (!checkNavigation()) {
      // 定期檢查（最多等待 30 秒）
      let attempts = 0;
      const maxAttempts = 60; // 30秒 = 60 * 500ms
      const checkInterval = setInterval(() => {
        attempts++;
        if (checkNavigation() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
        }
      }, 500);
    }
  }

  /**
   * 顯示說明但不需要目標元素（純介紹模式）
   */
  private showDescriptionWithoutTarget(step: DetailedGuideStep, stepIndex: number): void {
    this.clearEffects();
    
    // 查找一個通用容器作為定位參考（優先找 body）
    let container = document.body;
    
    // 嘗試找一個合適的容器
    const possibleContainers = [
      '.dashboard-container',
      'c-container',
      '.main-content',
      'body'
    ];
    
    for (const selector of possibleContainers) {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        container = el;
        break;
      }
    }
    
    // 滾動到容器位置
    container.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    });
    
    // 等待滾動完成
    setTimeout(() => {
      // 高亮容器（如果是可見的）
      if (container && container !== document.body) {
        this.highlightElement(container);
      }
      
      // 定位頭像到容器
      this.positionAvatar(container, step.avatarPosition || 'top-right');
      
      // 顯示詳細說明
      this.showDetailedDescription(step, stepIndex);
    }, 500);
  }

  /**
   * 等待用戶導航（已廢棄，改用 showNavigationHint）
   */
  private waitForNavigation(step: DetailedGuideStep): void {
    // 使用新的方法
    this.showNavigationHint(step);
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

    navButton.addEventListener('click', () => {

      // 等待下拉選單展開
      setTimeout(() => {
        // 尋找子選單項目
        const dropdownItems = document.querySelectorAll('c-dropdown-item a, .dropdown-item, [cDropdownItem]');

        // 高亮相關的子選單項目並設置點擊監聽
        dropdownItems.forEach((item: Element) => {
          const href = (item as HTMLElement).getAttribute('routerLink') ||
                      (item as HTMLElement).getAttribute('href') || '';

          if (href.includes(step.page.split('/').pop() || '')) {
            this.highlightElement(item as HTMLElement);

            // 設置點擊監聽器，點擊後自動進入下一步
            (item as HTMLElement).addEventListener('click', () => {

              // 等待導航完成後自動進入下一步
              setTimeout(() => {
                if (window.location.pathname === step.page) {
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
   * 判斷是否為可點擊步驟（改為純介紹模式，不需要點擊監聽）
   */
  private isClickableStep(step: DetailedGuideStep): boolean {
    // 改為純介紹模式，所有步驟都不需要點擊監聽
    // 用戶通過「下一步」按鈕手動推進
    return false;
  }

  /**
   * 設置點擊監聽器（點擊後自動進入下一步）
   */
  private setupClickListener(target: HTMLElement, step: DetailedGuideStep): void {
    if (!target) return;
    
    // 查找所有匹配的元素（可能有多個，例如選項卡片）
    const elements = document.querySelectorAll(step.target);
    const targetElements = elements.length > 0 ? Array.from(elements) as HTMLElement[] : [target];
    
    targetElements.forEach(element => {
      const clickHandler = (event: Event) => {
        // 清除點擊監聽器，避免重複觸發
        element.removeEventListener('click', clickHandler);
        
      // 檢查是否為導航步驟（點擊後會跳轉到其他頁面）
      const isNavigationStep = step.target.includes('routerLink') || 
                             step.target.includes('cDropdownItem') ||
                             step.content.includes('導航') ||
                             step.content.includes('進入') ||
                             (step.buttonFunction && step.buttonFunction.includes('導航'));
      
      // 檢查是否為標籤切換步驟（點擊後會切換標籤，但仍在同一頁面）
      const isTabSwitchStep = step.id === 'switch-to-past-exam-tab' || 
                              step.id === 'quiz-center-tabs' ||
                              step.content.includes('切換') && step.content.includes('標籤');
      
      // 檢查是否為選擇步驟（選擇學校、年度、系所、知識點等）
      const isSelectionStep = step.id === 'select-school' || 
                             step.id === 'select-year' || 
                             step.id === 'select-department' ||
                             step.id === 'knowledge-point-selection' ||
                             (step.content.includes('選擇') && step.content.includes('卡片'));
      
      // 檢查下一步是否需要不同的頁面
      const nextStep = this.guideSteps[this.currentStepIndex + 1];
      const needsPageChange = nextStep && nextStep.page && nextStep.page !== window.location.pathname;
      
      // 如果是標籤切換步驟，需要重新生成步驟並繼續
      if (isTabSwitchStep) {
        // 等待標籤切換完成（內容區域變化）
        setTimeout(() => {
          // 重新生成測驗中心步驟
          if (window.location.pathname === '/dashboard/quiz-center') {
            this.regenerateQuizCenterSteps();
            
            // 找到當前步驟在重新生成後的索引
            const currentStepId = step.id;
            let newIndex = this.guideSteps.findIndex(s => s.id === currentStepId);
            
            // 如果找不到，嘗試找到下一個考古題相關步驟
            if (newIndex === -1 || currentStepId === 'switch-to-past-exam-tab') {
              // 找到第一個考古題相關步驟（選擇學校）
              newIndex = this.guideSteps.findIndex(s => s.id === 'select-school');
              if (newIndex === -1) {
                // 如果還是找不到，找下一個步驟
                newIndex = this.currentStepIndex + 1;
              }
            }
            
            // 更新當前步驟索引並執行
            if (newIndex >= 0 && newIndex < this.guideSteps.length) {
              // 等待一下讓 DOM 更新完成
              setTimeout(() => {
                this.executeStep(newIndex);
              }, 800);
            } else {
              // 如果找不到下一步，繼續下一個
              setTimeout(() => {
                this.nextStep();
              }, 500);
            }
          } else {
            this.nextStep();
          }
        }, 500);
      } else if (isSelectionStep) {
        // 如果是選擇步驟（選擇學校、年度、系所等），需要重新生成步驟
        // 等待 DOM 更新完成（選擇後可能會顯示新的選項）
        setTimeout(() => {
          if (window.location.pathname === '/dashboard/quiz-center') {
            // 重新生成測驗中心步驟
            this.regenerateQuizCenterSteps();
            
            // 找到下一個相關步驟
            let nextIndex = this.currentStepIndex + 1;
            
            // 根據當前步驟，找到應該執行的下一步
            if (step.id === 'select-school') {
              // 選擇學校後，應該是選擇年度
              nextIndex = this.guideSteps.findIndex(s => s.id === 'select-year');
              if (nextIndex === -1) {
                // 如果年度已經選了，找系所或開始測驗
                nextIndex = this.guideSteps.findIndex(s => s.id === 'select-department' || s.id === 'start-past-exam-quiz');
              }
              if (nextIndex === -1) {
                nextIndex = this.currentStepIndex + 1;
              }
            } else if (step.id === 'select-year') {
              // 選擇年度後，應該是選擇系所
              nextIndex = this.guideSteps.findIndex(s => s.id === 'select-department');
              if (nextIndex === -1) {
                // 如果系所已經選了，找開始測驗
                nextIndex = this.guideSteps.findIndex(s => s.id === 'start-past-exam-quiz');
              }
              if (nextIndex === -1) {
                nextIndex = this.currentStepIndex + 1;
              }
            } else if (step.id === 'select-department') {
              // 選擇系所後，應該是開始測驗
              nextIndex = this.guideSteps.findIndex(s => s.id === 'start-past-exam-quiz');
              if (nextIndex === -1) {
                nextIndex = this.currentStepIndex + 1;
              }
            }
            
            // 確保索引有效
            if (nextIndex >= 0 && nextIndex < this.guideSteps.length) {
              // 等待一下讓 DOM 更新完成
              setTimeout(() => {
                this.executeStep(nextIndex);
              }, 600);
            } else {
              // 如果找不到下一步，繼續下一個
              setTimeout(() => {
                this.nextStep();
              }, 300);
            }
          } else {
            // 不在測驗中心頁面，直接下一步
            setTimeout(() => {
              this.nextStep();
            }, 300);
          }
        }, 500);
      } else if (isNavigationStep || needsPageChange) {
          // 如果是導航步驟，監聽路由變化
          const targetPath = nextStep?.page || step.page;
          const startPath = window.location.pathname;
          
          // 設置路由檢查
          const checkRoute = () => {
            const currentPath = window.location.pathname;
            
            // 如果已經到達目標頁面
            if (targetPath && currentPath === targetPath) {
              // 等待頁面元素載入
              setTimeout(() => {
                this.nextStep();
              }, 1000);
              return true;
            }
            
            // 如果還在原頁面，繼續等待
            if (currentPath === startPath) {
              return false;
            }
            
            // 如果已經離開了原頁面（即使還沒到目標頁面），也繼續下一步
            setTimeout(() => {
              this.nextStep();
            }, 1000);
            return true;
          };
          
          // 立即檢查一次（導航可能很快）
          if (!checkRoute()) {
            // 持續檢查路由變化（最多等待 5 秒）
            let attempts = 0;
            const maxAttempts = 25; // 5秒 = 25 * 200ms
            
            const routeCheckInterval = setInterval(() => {
              attempts++;
              
              if (checkRoute() || attempts >= maxAttempts) {
                clearInterval(routeCheckInterval);
                if (attempts >= maxAttempts) {
                  // 超時後強制繼續
                  setTimeout(() => {
                    this.nextStep();
                  }, 500);
                }
              }
            }, 200);
          }
        } else {
          // 非導航步驟，短暫延遲後進入下一步（讓用戶看到點擊效果）
          setTimeout(() => {
            this.nextStep();
          }, 300);
        }
      };
      
      // 添加點擊監聽器（使用 once 確保只觸發一次）
      element.addEventListener('click', clickHandler, { once: true });
      
      // 添加視覺提示（滑鼠懸停時顯示指針）
      element.style.cursor = 'pointer';
      if (!element.title) {
        element.title = '點擊這裡繼續導覽';
      }
    });
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

  }

  /**
   * 檢查是否正在導覽
   */
  isGuiding(): boolean {
    return this.isActive;
  }

  /**
   * 檢查元素是否可見
   */
  private isElementVisible(element: HTMLElement): boolean {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // 檢查是否顯示
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    
    // 檢查是否在視窗內
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }
    
    // 對於下拉選單，檢查父元素是否有 show 或 open 類別
    const parent = element.closest('c-dropdown, .dropdown');
    if (parent) {
      const hasShow = parent.classList.contains('show') || 
                      parent.classList.contains('open') ||
                      parent.getAttribute('aria-expanded') === 'true';
      
      // 如果是下拉選單本身（ul[cDropdownMenu]）
      if (element.tagName === 'UL' && (element.hasAttribute('cDropdownMenu') || element.classList.contains('dropdown-menu'))) {
        const menuStyle = window.getComputedStyle(element);
        const menuRect = element.getBoundingClientRect();
        // 檢查下拉選單是否可見（有 show 類別且尺寸大於 0）
        return hasShow && menuStyle.display !== 'none' && menuRect.height > 0;
      }
      
      // 如果是下拉選單項，檢查父選單是否可見
      if (hasShow) {
        const menu = parent.querySelector('ul[cDropdownMenu], [cDropdownMenu], .dropdown-menu') as HTMLElement;
        if (menu) {
          const menuStyle = window.getComputedStyle(menu);
          const menuRect = menu.getBoundingClientRect();
          return menuStyle.display !== 'none' && menuRect.height > 0;
        }
      }
      
      // 如果下拉選單未展開，元素不可見
      return false;
    }
    
    return true;
  }
}
