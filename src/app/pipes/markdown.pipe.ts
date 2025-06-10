import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
    // 配置 marked 選項
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
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
}
