import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

/**
 * Markdown 處理服務
 * 提供 Markdown 轉換為安全 HTML 的功能
 */
@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) {
    // 配置 marked 選項
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  /**
   * 將 Markdown 文字轉換為安全的 HTML
   * @param value Markdown 文字
   * @returns 安全的 HTML
   */
  transform(value: string): SafeHtml {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    try {
      // 將 Markdown 轉換為 HTML
      const html = marked(value);
      
      // 返回安全的 HTML
      return this.sanitizer.bypassSecurityTrustHtml(html as string);
    } catch (error) {
      console.error('Markdown 轉換錯誤:', error);
      // 如果轉換失敗，返回原始文本（轉換換行符）
      return this.sanitizer.bypassSecurityTrustHtml(
        value.replace(/\n/g, '<br>')
      );
    }
  }

  /**
   * 將 Markdown 文字轉換為純 HTML 字串（不進行安全檢查）
   * 注意：此方法不進行安全檢查，僅在確定內容安全時使用
   */
  toHtml(value: string): string {
    if (!value) {
      return '';
    }

    try {
      return marked(value) as string;
    } catch (error) {
      console.error('Markdown 轉換錯誤:', error);
      return value.replace(/\n/g, '<br>');
    }
  }
}

