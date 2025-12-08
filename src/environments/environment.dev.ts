// 根據當前訪問位置自動選擇後端 URL
function getApiUrl(): string {
  // 檢查是否在瀏覽器環境
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // 如果是 localhost，使用本地後端
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    
    // 如果是 ngrok 域名，使用對應的 ngrok 後端
    if (hostname.includes('.ngrok-free.app') || hostname.includes('.ngrok.io')) {
      // Docker Desktop instant endpoint 後端
      return 'https://0bb00f45e925.ngrok-free.app';
    }
  }
  
  // 預設使用本地後端（用於 SSR 或其他環境）
  return 'http://localhost:5000';
}

export const environment = {
  production: false,
  // 自動根據訪問位置選擇後端 URL
  // - localhost:4200 -> http://localhost:5000
  // - ngrok 域名 -> https://0bb00f45e925.ngrok-free.app
  apiUrl: getApiUrl(),
  apiBaseUrl: getApiUrl()
};
