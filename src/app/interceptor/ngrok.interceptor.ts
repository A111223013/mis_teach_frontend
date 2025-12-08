import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  // 檢查是否為 ngrok 網址
  const url = req.url;
  if (url.includes('ngrok-free.app') || url.includes('ngrok.io')) {
    // 添加 header 來跳過 ngrok 警告頁面
    const clonedReq = req.clone({
      setHeaders: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return next(clonedReq);
  }
  return next(req);
};

