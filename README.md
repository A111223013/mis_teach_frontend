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

## 常見問題

### 1. LaTeX 渲染問題

- 確保 KaTeX CSS 已正確載入
- 檢查 `DomSanitizer` 配置
- 清除瀏覽器快取

### 2. CORS 錯誤

- 檢查後端 CORS 配置
- 確認 API URL 設定正確
- 檢查 ngrok 攔截器配置

### 3. Token 刷新失敗

- 檢查 Token 格式
- 確認後端 Token 驗證邏輯
- 清除 localStorage 重新登入

## 未來規劃

- [ ] PWA 支援
- [ ] 離線功能
- [ ] 多語言支援
- [ ] 深色模式
- [ ] 效能優化
- [ ] 單元測試覆蓋率提升

## 授權

MIT License

## 聯絡資訊

如有問題或建議，請聯繫開發團隊。
