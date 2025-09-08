import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../../service/material.service';
import { AiChatService } from '../../../../service/ai-chat.service';
import { AiQuizService } from '../../../../service/ai-quiz.service';
import { MessageBridgeService } from '../../../../service/message-bridge.service';

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './material-view.component.html',
  styleUrls: ['./material-view.component.scss']
})
export class MaterialViewComponent implements AfterViewChecked {
  filename: string = '';
  content: string = '';
  private rendered = false;
  
  // 文字選擇相關屬性
  selectedText: string = '';
  showButtons: boolean = false;
  buttonPosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private location: Location,
    private elRef: ElementRef,
    private aiChatService: AiChatService,
    private aiQuizService: AiQuizService,
    private messageBridgeService: MessageBridgeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const file = params.get('filename');
      if (file) {
        this.filename = file;
        this.loadMaterial(file);
      }
    });
    
    // 添加文字選擇事件監聽器
    this.setupTextSelection();
  }

  loadMaterial(filename: string) {
    this.materialService.getMaterial(filename).subscribe({
      next: (res) => {
        this.content = res.content;
      },
      error: (err) => {
        console.error('讀取教材失敗:', err);
        this.content = '❌ 無法讀取教材';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  // Markdown 載入完成後
  onMarkdownReady(): void {
    this.generateTOC();
    this.renderKaTeX();
    this.highlightCode();
    this.rendered = true;
  }

  ngAfterViewChecked(): void {
    if (!this.rendered && this.content) {
      this.generateTOC();
      this.renderKaTeX();
      this.highlightCode();
      this.rendered = true;
    }
  }

  private generateTOC(): void {
    const content = this.elRef.nativeElement.querySelector('#content');
    const tocList = this.elRef.nativeElement.querySelector('#toc-list');
    if (!content || !tocList) return;

    const headers = content.querySelectorAll('h1,h2,h3,h4,h5,h6');
    tocList.innerHTML = '';
    headers.forEach((h: HTMLElement) => {
      const text = h.textContent?.trim();
      if (!text) return;

      if (!h.id) {
        h.id = text.replace(/\s+/g, '_');
      }

      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = text;
      a.classList.add('d-block', 'mb-1', 'toc-link');
      tocList.appendChild(a);
    });
  }

  private renderKaTeX(): void {
    if ((window as any).renderMathInElement) {
      (window as any).renderMathInElement(this.elRef.nativeElement.querySelector('#content'), {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }
  }

  private highlightCode(): void {
    if ((window as any).hljs) {
      (window as any).hljs.highlightAll();
    }
  }

  // 設置文字選擇功能
  private setupTextSelection(): void {
    document.addEventListener('mouseup', (event) => {
      this.handleTextSelection(event);
    });
    
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt') {
        this.handleTextSelection(event);
      }
    });
  }

  // 處理文字選擇
  private handleTextSelection(event: Event): void {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    
    if (selectedText.length >= 5) {
      this.selectedText = selectedText;
      this.showButtons = true;
      
      // 獲取選擇範圍的位置
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // 設置按鈕位置 - 放在選擇文字的下方
      let buttonY = rect.bottom + 10;
      
      // 檢查是否會超出視窗底部，如果會則放在上方
      if (buttonY + 60 > window.innerHeight) {
        buttonY = rect.top - 60;
      }
      
      this.buttonPosition = {
        x: rect.left + rect.width / 2,
        y: buttonY
      };
      
      // 在 console 顯示選中的文字
      console.log('選中的文字:', selectedText);
    } else {
      this.hideButtons();
    }
  }

  // 隱藏按鈕
  private hideButtons(): void {
    this.showButtons = false;
    this.selectedText = '';
  }

  // 詢問功能
  askQuestion(): void {
    console.log('詢問關於:', this.selectedText);
    
    // 將選中的文字發送到網站助手
    this.messageBridgeService.sendQuestion(this.selectedText);
    
    // 顯示提示訊息
    this.showNotification('已將選中文字發送到網站助手，請查看助手回答');
    
    this.hideButtons();
  }

  // 生成題目功能
  generateQuiz(): void {
    console.log('生成題目關於:', this.selectedText);
    
    // 將選中的文字發送到網站助手
    this.messageBridgeService.sendQuizGeneration(this.selectedText);
    
    // 顯示提示訊息
    this.showNotification('已將選中文字發送到網站助手，請查看生成的題目');
    
    this.hideButtons();
  }


  // 顯示通知訊息
  private showNotification(message: string): void {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-size: 14px;
      max-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒後自動移除
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}
