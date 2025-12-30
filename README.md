# MIS_Teach 前端系統

## 專案簡介

MIS_Teach 前端是一個基於 Angular 19 開發的現代化智慧學習平台前端應用，提供完整的學習管理、測驗系統、AI 輔助教學等功能。採用 CoreUI 框架構建響應式使用者介面，支援多種題型、即時預覽、學習分析等進階功能。

## 技術架構

### 核心技術棧

- **框架**: Angular 19.2.14
- **UI 框架**: CoreUI 5.4.13
- **構建工具**: Angular CLI + Vite
- **語言**: TypeScript 5.8.3
- **樣式**: SCSS + Bootstrap 5.3.3
- **狀態管理**: RxJS 7.8.1
- **HTTP 客戶端**: Angular HttpClient

### 主要依賴套件

- **圖表視覺化**: Chart.js 4.4.9, ng2-charts 7.0.0
- **數學公式渲染**: KaTeX 0.16.22, MathJax 3.2.2
- **Markdown 渲染**: ngx-markdown 19.1.1, marked 15.0.11
- **日期處理**: date-fns 4.1.0, luxon 3.7.1
- **圖形視覺化**: D3.js 7.9.0, Cytoscape 3.33.1, vis-network 10.0.1
- **日曆組件**: angular-calendar 0.31.1
- **其他工具**: ngx-clipboard 16.0.0, ngx-scrollbar 13.0.3

## 專案結構

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # 根組件
│   │   ├── app.routes.ts              # 路由配置
│   │   ├── app.config.ts              # 應用配置
│   │   ├── interceptor/               # HTTP 攔截器
│   │   │   └── ngrok.interceptor.ts   # ngrok 請求攔截器
│   │   ├── layout/                    # 佈局組件
│   │   │   └── default-layout/        # 預設佈局（側邊欄、標題、頁腳）
│   │   ├── service/                   # 服務層
│   │   │   ├── auth.service.ts        # 身份驗證服務
│   │   │   ├── quiz.service.ts        # 測驗服務
│   │   │   ├── ai-quiz.service.ts      # AI 測驗服務
│   │   │   ├── ai-tutoring.service.ts # AI 教學服務
│   │   │   ├── learning-analytics.service.ts # 學習分析服務
│   │   │   ├── material.service.ts    # 教材服務
│   │   │   ├── news.service.ts        # 新聞服務
│   │   │   └── ...                    # 其他服務
│   │   └── views/                     # 視圖組件
│   │       ├── login/                  # 登入頁面
│   │       ├── settings/               # 設定頁面
│   │       └── dashboard/             # 儀表板頁面
│   │           ├── overview/          # 總覽頁面
│   │           ├── quiz-center/        # 測驗中心
│   │           ├── quiz-taking/        # 測驗作答頁面
│   │           ├── quiz-result/        # 測驗結果頁面
│   │           ├── ai-tutoring/        # AI 教學頁面
│   │           ├── ai-chat/           # AI 聊天頁面
│   │           ├── learning-analytics/ # 學習分析頁面
│   │           ├── material/          # 教材瀏覽頁面
│   │           ├── news/             # 新聞頁面
│   │           ├── courses/          # 課程頁面
│   │           ├── mistake-analysis/ # 錯題分析頁面
│   │           └── web-ai-assistant/  # 網頁 AI 助手
│   ├── assets/                        # 靜態資源
│   ├── environments/                  # 環境配置
│   │   ├── environment.ts            # 生產環境配置
│   │   └── environment.dev.ts        # 開發環境配置
│   ├── scss/                          # 全局樣式
│   └── index.html                     # HTML 入口
├── angular.json                       # Angular 配置
├── vite.config.ts                    # Vite 配置
├── tsconfig.json                      # TypeScript 配置
└── package.json                      # 依賴管理
```

## 核心功能模組

### 1. 身份驗證系統 (`auth.service.ts`)

- JWT Token 管理
- 自動 Token 刷新
- 登入/登出功能
- Token 驗證與清理

### 2. 測驗系統

#### 測驗中心 (`quiz-center.component.ts`)
- 測驗模板選擇
- 測驗參數設定（題數、難度、領域）
- 歷史測驗記錄
- AI 生成測驗

#### 測驗作答 (`quiz-taking.component.ts`)
- 多種題型支援：
  - 單選題 (single-choice)
  - 多選題 (multiple-choice)
  - 填空題 (fill-in-the-blank)
  - 是非題 (true-false)
  - 簡答題 (short-answer)
  - 長答題 (long-answer)
  - 選擇題 (choice-answer)
  - 畫圖題 (draw-answer)
  - 程式題 (coding-answer)
  - 群組題 (group)
- 即時 LaTeX 數學公式編輯與預覽
- Canvas 繪圖功能
- 作答時間追蹤
- 題目標記功能
- 自動儲存作答進度

#### 測驗結果 (`quiz-result.component.ts`)
- 成績統計與分析
- 錯題檢視
- 詳細解答顯示
- 學習建議

### 3. AI 教學系統

#### AI 教學 (`ai-tutoring.component.ts`)
- 五階段學習流程：
  1. 核心概念確認 (Core Concept Confirmation)
  2. 相關概念引導 (Related Concept Guidance)
  3. 應用理解 (Application Understanding)
  4. 理解驗證/反向教學 (Understanding Verification/Reverse Teaching)
  5. 完成 (Completed)
- 即時對話互動
- 學習進度追蹤
- 筆記功能
- 繪圖輔助說明
- 學習路徑建議

#### AI 聊天 (`ai-chat.component.ts`)
- 通用 AI 對話介面
- 上下文記憶管理
- 多輪對話支援

### 4. 學習分析系統 (`learning-analytics.component.ts`)

- 學習趨勢分析
- 弱點識別與診斷
- AI 學習路徑推薦
- 能力雷達圖
- 進步追蹤
- 領域掌握度分析
- 難度分析
- 行事曆整合

### 5. 教材管理系統 (`material.component.ts`)

- Markdown 教材瀏覽
- LaTeX 數學公式渲染
- 目錄導航
- 搜尋功能
- 進度追蹤

### 6. 新聞系統 (`news.component.ts`)

- IT 新聞聚合
- 分類瀏覽
- 關鍵字搜尋
- 新聞詳情檢視

### 7. 網頁 AI 助手 (`web-ai-assistant.component.ts`)

- 網頁內容分析
- 自動化操作輔助
- 知識庫查詢
- 多平台支援

## 環境配置

### 開發環境配置 (`environment.dev.ts`)

```typescript
export const environment = {
  production: false,
  // 自動根據訪問位置選擇後端 URL
  // - localhost:4200 -> http://localhost:5000
  // - ngrok 域名 -> https://0bb00f45e925.ngrok-free.app
  apiUrl: getApiUrl(),
  apiBaseUrl: getApiUrl()
};
```

### 生產環境配置 (`environment.ts`)

根據實際部署環境設定 API URL。

## 安裝與執行

### 前置需求

- Node.js >= 18.19.0 或 >= 20.9.0
- npm >= 9

### 安裝步驟

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm start
# 或
ng serve -o

# 構建生產版本
npm run build
```

### 開發模式

```bash
# 啟動開發伺服器（自動開啟瀏覽器）
npm start

# 監聽模式構建
npm run watch
```

### 生產構建

```bash
# 構建生產版本
npm run build

# 構建輸出目錄：dist/fronted/browser/
```

## 主要功能說明

### LaTeX 數學公式編輯

- 使用 KaTeX 進行即時渲染
- 支援複雜數學公式（積分、分數、矩陣等）
- 自動判斷 display mode
- 使用 `DomSanitizer` 處理 HTML 安全

### Canvas 繪圖功能

- 支援畫圖題作答
- 繪圖工具（筆刷、橡皮擦、清除）
- 自動儲存繪圖內容
- Canvas 背景處理

### 響應式設計

- 支援桌面與行動裝置
- 自適應佈局
- 觸控操作優化

### 狀態管理

- 使用 RxJS Subject 進行狀態管理
- 服務層集中管理資料
- 組件間通訊

## API 整合

### HTTP 攔截器

- `ngrok.interceptor.ts`: 自動處理 ngrok 請求頭
- JWT Token 自動附加
- 錯誤處理與重試機制

### 服務層架構

所有 API 呼叫透過服務層進行：
- 統一的錯誤處理
- 請求/回應轉換
- 快取機制
- 載入狀態管理

## 樣式系統

### SCSS 結構

```
scss/
├── _variables.scss      # 變數定義
├── _theme.scss          # 主題配置
├── _charts.scss         # 圖表樣式
├── _custom.scss         # 自定義樣式
└── main.scss           # 主樣式文件
```

### CoreUI 整合

- 使用 CoreUI 組件庫
- 自定義主題色彩
- 響應式網格系統

## 測試

```bash
# 執行單元測試
npm test
```

## 部署

### 構建生產版本

```bash
npm run build
```

### 部署到靜態伺服器

將 `dist/fronted/browser/` 目錄內容部署到：
- Nginx
- Apache
- 任何靜態文件伺服器

### 環境變數

確保生產環境的 `environment.ts` 配置正確的 API URL。

## 瀏覽器支援

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 開發規範

### 代碼風格

- 使用 TypeScript 嚴格模式
- 遵循 Angular 風格指南
- 組件使用 Standalone 模式
- 服務使用依賴注入

### 組件結構

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  // 組件邏輯
}
```

## 路由配置

### 主要路由

```typescript
/                    → 重定向到 /login
/login               → 登入頁面
/settings            → 設定頁面
/dashboard           → 儀表板（需要認證）
  ├── /overview      → 總覽頁面
  ├── /quiz-center   → 測驗中心
  ├── /quiz-taking    → 測驗作答
  ├── /quiz-result   → 測驗結果
  ├── /ai-tutoring   → AI 教學
  ├── /ai-chat        → AI 聊天
  ├── /learning-analytics → 學習分析
  ├── /material       → 教材瀏覽
  ├── /news           → 新聞
  ├── /courses        → 課程
  ├── /mistake-analysis → 錯題分析
  └── /web-ai-assistant → 網頁 AI 助手
```

### 路由守衛

- 登入頁面：未登入使用者可訪問
- 儀表板頁面：需要 JWT Token 認證
- Token 過期自動跳轉到登入頁面

## 服務層詳細說明

### AuthService (`auth.service.ts`)

**主要方法**:
```typescript
login(email: string, password: string): Observable<any>
logout(): void
getToken(): string | null
setToken(token: string): void
clearToken(): void
isAuthenticated(): boolean
refreshToken(): Observable<string>
```

**使用範例**:
```typescript
constructor(private authService: AuthService) {}

login() {
  this.authService.login(email, password).subscribe({
    next: (response) => {
      // 登入成功，Token 已自動儲存
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      // 處理錯誤
    }
  });
}
```

### QuizService (`quiz.service.ts`)

**主要方法**:
```typescript
generateQuiz(params: QuizParams): Observable<QuizResponse>
submitQuiz(quizId: string, answers: any): Observable<any>
getQuizResult(resultId: string): Observable<QuizResult>
getQuizHistory(): Observable<QuizHistory[]>
```

**使用範例**:
```typescript
constructor(private quizService: QuizService) {}

generateQuiz() {
  const params = {
    template_id: '123',
    count: 20,
    difficulty: 'medium'
  };
  
  this.quizService.generateQuiz(params).subscribe({
    next: (quiz) => {
      this.router.navigate(['/dashboard/quiz-taking'], {
        queryParams: { quizId: quiz.quiz_id }
      });
    }
  });
}
```

### AiTutoringService (`ai-tutoring.service.ts`)

**主要方法**:
```typescript
startSession(concept: string): Observable<SessionResponse>
sendMessage(sessionId: string, message: string): Observable<MessageResponse>
getSession(sessionId: string): Observable<SessionData>
getLearningPath(sessionId: string): Observable<QuestionData[]>
```

## 組件使用範例

### 測驗作答組件

```typescript
// quiz-taking.component.ts
export class QuizTakingComponent {
  currentQuestion: QuizQuestion | null = null;
  userAnswers: { [key: number]: any } = {};
  
  selectAnswer(questionId: number, answer: any) {
    this.userAnswers[questionId] = answer;
    this.saveProgress();
  }
  
  submitQuiz() {
    this.quizService.submitQuiz(this.quizId, this.userAnswers)
      .subscribe(result => {
        this.router.navigate(['/dashboard/quiz-result'], {
          queryParams: { resultId: result.result_id }
        });
      });
  }
}
```

### LaTeX 公式編輯

```typescript
// 在組件中使用
mathFormula: string = '';

renderMathFormula(formula: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(
    katex.renderToString(formula, { displayMode: true })
  );
}

// 在模板中使用
<div [innerHTML]="renderMathFormula(mathFormula)"></div>
```

### Canvas 繪圖

```typescript
@ViewChild('drawingCanvas') canvas!: ElementRef<HTMLCanvasElement>;

startDrawing(event: MouseEvent) {
  const rect = this.canvas.nativeElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ctx = this.canvas.nativeElement.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(x, y);
  this.isDrawing = true;
}

draw(event: MouseEvent) {
  if (!this.isDrawing) return;
  // 繪圖邏輯
}

saveDrawing() {
  const dataURL = this.canvas.nativeElement.toDataURL();
  // 儲存到答案
}
```

## 狀態管理

### RxJS Subject 使用

```typescript
// 在服務中
private tokenSubject = new BehaviorSubject<string | null>(null);
token$ = this.tokenSubject.asObservable();

setToken(token: string) {
  localStorage.setItem('token', token);
  this.tokenSubject.next(token);
}

// 在組件中訂閱
constructor(private authService: AuthService) {
  this.authService.token$.subscribe(token => {
    if (!token) {
      this.router.navigate(['/login']);
    }
  });
}
```

## 錯誤處理

### 全局錯誤處理

```typescript
// HTTP 攔截器
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token 過期，重新登入
        this.authService.clearToken();
        this.router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
```

## 效能優化技巧

### 1. OnPush 變更檢測

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 2. 懶加載模組

```typescript
{
  path: 'dashboard',
  loadChildren: () => import('./views/dashboard/routes').then(m => m.routes)
}
```

### 3. 虛擬滾動

```typescript
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let item of items">
    {{item}}
  </div>
</cdk-virtual-scroll-viewport>
```

## 測試範例

### 組件測試

```typescript
describe('QuizTakingComponent', () => {
  let component: QuizTakingComponent;
  let fixture: ComponentFixture<QuizTakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuizTakingComponent]
    });
    fixture = TestBed.createComponent(QuizTakingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select answer', () => {
    component.selectAnswer(1, 'A');
    expect(component.userAnswers[1]).toBe('A');
  });
});
```

## 開發最佳實踐

### 1. 組件設計原則

- **單一職責**: 每個組件只負責一個功能
- **可重用性**: 將通用邏輯提取到服務或共用組件
- **可測試性**: 使用依賴注入，避免直接實例化

### 2. 服務設計原則

- **無狀態**: 服務應該是無狀態的
- **單例**: 使用 `providedIn: 'root'`
- **錯誤處理**: 統一處理錯誤並提供友好的錯誤訊息

### 3. 樣式管理

- **BEM 命名**: 使用 BEM（Block Element Modifier）命名規範
- **SCSS 變數**: 使用變數管理顏色、間距等
- **組件樣式**: 將樣式與組件放在同一目錄

### 4. 效能優化

- **懶加載**: 路由和功能模組使用懶加載
- **變更檢測**: 使用 OnPush 策略減少不必要的檢測
- **虛擬滾動**: 長列表使用虛擬滾動
- **圖片優化**: 使用適當的圖片格式和大小

## 相關資源

### 官方文檔

- [Angular 官方文檔](https://angular.dev)
- [CoreUI Angular 文檔](https://coreui.io/angular/docs/)
- [RxJS 文檔](https://rxjs.dev)
- [TypeScript 文檔](https://www.typescriptlang.org/docs/)

### 學習資源

- [Angular 風格指南](https://angular.dev/style-guide)
- [RxJS 操作符指南](https://rxjs.dev/guide/operators)
- [Angular 效能最佳實踐](https://angular.dev/guide/performance)

## 授權

MIT License

## 聯絡資訊

如有問題或建議，請聯繫開發團隊或提交 Issue。
