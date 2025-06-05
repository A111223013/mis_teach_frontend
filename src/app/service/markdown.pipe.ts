import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // 簡單的Markdown轉換
    let html = value
      // 處理換行
      .replace(/\n/g, '<br>')
      
      // 處理粗體 **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // 處理斜體 *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // 處理代碼 `code`
      .replace(/`(.*?)`/g, '<code>$1</code>')
      
      // 處理標題 # ## ###
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // 處理列表項 •
      .replace(/^• (.*$)/gim, '<li>$1</li>')
      
      // 處理連結 [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 處理分隔線
      .replace(/^---$/gim, '<hr>')
      
      // 處理引用 > text
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // 包裝連續的列表項
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // 清理多餘的換行
    html = html.replace(/<br><br>/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
