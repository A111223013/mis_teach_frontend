import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, Location, ViewportScroller  } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../../service/material.service';
import { AiChatService } from '../../../../service/ai-chat.service';
import { AiQuizService } from '../../../../service/ai-quiz.service';
import { MessageBridgeService } from '../../../../service/message-bridge.service';
import { 
  CardComponent,
  CardModule   
} from '@coreui/angular';

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [
    CommonModule, 
    MarkdownModule,
    CardModule,
    CardComponent,
  ],
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
  
  // 螢光筆相關屬性
  highlighterMode: boolean = false;
  sidebarVisible: boolean = false;
  selectedColor: string = '#ffff00'; // 預設黃色
  highlightColors = [
    { name: '黃色', value: '#ffff00' },
    { name: '綠色', value: '#90EE90' },
    { name: '藍色', value: '#87CEEB' },
    { name: '粉色', value: '#FFB6C1' },
    { name: '橙色', value: '#FFA500' },
    { name: '紫色', value: '#DDA0DD' }
  ];
  private highlights: any[] = []; // 儲存劃記資料

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private location: Location,
    private elRef: ElementRef,
    private aiChatService: AiChatService,
    private aiQuizService: AiQuizService,
    private messageBridgeService: MessageBridgeService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const file = params.get('filename');
      if (file) {
        this.filename = file;
        this.loadMaterial(file);
        // 載入已儲存的劃記
        this.loadHighlights();
      }
    });
    
    // 添加文字選擇事件監聽器
    this.setupTextSelection();
    
    // 添加螢光筆事件監聽器
    this.setupHighlighter();
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

  tocCollapsed = false;

  toggleTOC() {
    this.tocCollapsed = !this.tocCollapsed;
  }

  // Markdown 載入完成後
  onMarkdownReady(): void {
    // 延遲執行以確保 DOM 完全渲染
    setTimeout(() => {
      this.generateTOC();
      this.renderKaTeX();
      this.highlightCode();
      this.rendered = true;
    }, 100);
  }

  ngAfterViewChecked(): void {
    if (!this.rendered && this.content) {
      // 延遲執行以確保 DOM 完全渲染
      setTimeout(() => {
        this.generateTOC();
        this.renderKaTeX();
        this.highlightCode();
        this.rendered = true;
      }, 100);
    }
  }

  private generateTOC(): void {
    const content = this.elRef.nativeElement.querySelector('#content');
    const tocList = this.elRef.nativeElement.querySelector('#toc-list');
    if (!content || !tocList) return;

    const headers = content.querySelectorAll('h1,h2,h3,h4,h5,h6');
    tocList.innerHTML = '';
    
    if (headers.length === 0) {
      const noContent = document.createElement('div');
      noContent.textContent = '此文件沒有標題';
      noContent.style.color = '#6c757d';
      noContent.style.fontStyle = 'italic';
      noContent.style.padding = '1rem';
      noContent.style.textAlign = 'center';
      tocList.appendChild(noContent);
      return;
    }

    headers.forEach((h: HTMLElement) => {
      const text = h.textContent?.trim();
      if (!text) return;

      if (!h.id) {
        h.id = text.replace(/\s+/g, '_').replace(/[^\w\u4e00-\u9fff]/g, '');
      }

      const a = document.createElement('a');
      a.textContent = text;
      a.classList.add('toc-link');
      a.style.cursor = 'pointer';
      a.style.display = 'block';
      a.style.padding = '0.5rem 0';
      a.style.color = '#6c757d';
      a.style.textDecoration = 'none';
      a.style.fontSize = '0.9rem';
      a.style.lineHeight = '1.4';
      a.style.transition = 'all 0.2s ease';
      a.style.borderLeft = '3px solid transparent';
      a.style.paddingLeft = '1rem';
      a.style.marginLeft = '0.5rem';
      
      // 根據標題層級調整縮排
      const level = parseInt(h.tagName.charAt(1));
      a.style.paddingLeft = `${1 + (level - 1) * 0.5}rem`;
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        this.viewportScroller.scrollToAnchor(h.id);
        // 添加視覺反饋
        a.style.color = '#007bff';
        a.style.background = 'rgba(0, 123, 255, 0.05)';
        a.style.borderLeftColor = '#007bff';
        setTimeout(() => {
          a.style.color = '#6c757d';
          a.style.background = 'transparent';
          a.style.borderLeftColor = 'transparent';
        }, 1000);
      });

      // 懸停效果
      a.addEventListener('mouseenter', () => {
        if (a.style.color !== '#007bff') {
          a.style.color = '#007bff';
          a.style.background = 'rgba(0, 123, 255, 0.05)';
          a.style.borderLeftColor = '#007bff';
          a.style.transform = 'translateX(4px)';
        }
      });

      a.addEventListener('mouseleave', () => {
        if (a.style.color !== '#007bff') {
          a.style.color = '#6c757d';
          a.style.background = 'transparent';
          a.style.borderLeftColor = 'transparent';
          a.style.transform = 'translateX(0)';
        }
      });

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
    if (!this.selectedText || this.selectedText.trim().length < 2) {
      this.showNotification('請先選擇要生成題目的文字');
      return;
    }
    this.messageBridgeService.sendQuizGeneration(this.selectedText);
    this.showNotification('已將選中文字發送到網站助手，請查看生成的題目');
    this.hideButtons();
  }

  // 從工具列觸發生成題目
  generateQuizFromToolbar(): void {
    const selection = window.getSelection();
    const selected = selection?.toString().trim() || this.selectedText;
    if (!selected || selected.length < 2) {
      this.showNotification('請先選擇要生成題目的文字');
      return;
    }
    this.selectedText = selected;
    this.generateQuiz();
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

  // ========== 螢光筆功能 ==========
  
  // 設置螢光筆事件監聽器
  private setupHighlighter(): void {
    document.addEventListener('mouseup', (event) => {
      if (this.highlighterMode) {
        this.handleHighlightSelection(event);
      }
    });
  }

  // 切換螢光筆模式
  toggleHighlighterMode(): void {
    this.highlighterMode = !this.highlighterMode;
    
    if (this.highlighterMode) {
      // 啟用螢光筆模式
      document.body.style.cursor = 'crosshair';
      this.showNotification('螢光筆模式已開啟，請選擇要劃記的文字');
    } else {
      // 關閉螢光筆模式
      document.body.style.cursor = 'default';
      this.showNotification('螢光筆模式已關閉');
    }
  }

  // 抽屜側欄開關
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // 選擇顏色
  selectColor(color: string): void {
    this.selectedColor = color;
    console.log('選擇的顏色:', color);
  }

  // 處理螢光筆選擇
  private handleHighlightSelection(event: Event): void {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 2) return;

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    
    // 創建劃記元素
    this.createHighlight(range, selectedText);
    
    // 清除選擇
    selection.removeAllRanges();
  }

  // 創建劃記
  private createHighlight(range: Range, text: string): void {
    const highlightId = 'highlight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // 創建劃記元素
    const highlightElement = document.createElement('mark');
    highlightElement.className = 'text-highlight';
    highlightElement.style.backgroundColor = this.selectedColor;
    highlightElement.style.padding = '2px 4px';
    highlightElement.style.borderRadius = '3px';
    highlightElement.style.cursor = 'pointer';
    highlightElement.setAttribute('data-highlight-id', highlightId);
    highlightElement.setAttribute('data-highlight-color', this.selectedColor);
    highlightElement.setAttribute('data-highlight-text', text);
    
    // 添加右鍵選單功能
    highlightElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showHighlightContextMenu(e, highlightId);
    });
    
    try {
      // 將選擇的內容包裝在劃記元素中
      range.surroundContents(highlightElement);
      
      // 儲存劃記資料
      const highlightData = {
        id: highlightId,
        text: text,
        color: this.selectedColor,
        timestamp: new Date().toISOString(),
        filename: this.filename
      };
      
      this.highlights.push(highlightData);
      this.saveHighlights();
      
      this.showNotification(`已劃記: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);
      
    } catch (error) {
      console.error('創建劃記失敗:', error);
      this.showNotification('劃記失敗，請重新選擇文字');
    }
  }

  // 劃記選中的文字（從浮動按鈕觸發）
  highlightSelectedText(): void {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 2) {
      this.showNotification('請先選擇要劃記的文字');
      return;
    }

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    
    this.createHighlight(range, selectedText);
    this.hideButtons();
  }

  // 顯示劃記右鍵選單
  private showHighlightContextMenu(event: MouseEvent, highlightId: string): void {
    // 移除現有的選單
    const existingMenu = document.querySelector('.highlight-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 創建選單
    const menu = document.createElement('div');
    menu.className = 'highlight-context-menu';
    menu.style.cssText = `
      position: fixed;
      left: ${event.clientX}px;
      top: ${event.clientY}px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 10000;
      padding: 4px 0;
    `;

    // 添加選單項目
    const items = [
      { text: '更改顏色', action: () => this.changeHighlightColor(highlightId) },
      { text: '移除劃記', action: () => this.removeHighlight(highlightId) }
    ];

    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
      `;
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#f0f0f0';
      });
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'white';
      });
      menuItem.addEventListener('click', () => {
        item.action();
        menu.remove();
      });
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 點擊其他地方關閉選單
    const closeMenu = (e: Event) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  // 更改劃記顏色
  private changeHighlightColor(highlightId: string): void {
    const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`) as HTMLElement;
    if (highlightElement) {
      highlightElement.style.backgroundColor = this.selectedColor;
      highlightElement.setAttribute('data-highlight-color', this.selectedColor);
      
      // 更新儲存的資料
      const highlightData = this.highlights.find(h => h.id === highlightId);
      if (highlightData) {
        highlightData.color = this.selectedColor;
        this.saveHighlights();
      }
      
      this.showNotification('劃記顏色已更改');
    }
  }

  // 移除劃記
  private removeHighlight(highlightId: string): void {
    const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`) as HTMLElement;
    if (highlightElement) {
      // 移除劃記樣式，保留文字
      const parent = highlightElement.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlightElement.textContent || ''), highlightElement);
        parent.normalize(); // 合併相鄰的文字節點
      }
      
      // 從儲存中移除
      this.highlights = this.highlights.filter(h => h.id !== highlightId);
      this.saveHighlights();
      
      this.showNotification('劃記已移除');
    }
  }

  // 清除所有劃記
  clearAllHighlights(): void {
    if (confirm('確定要清除所有劃記嗎？此操作無法復原。')) {
      const highlightElements = document.querySelectorAll('.text-highlight');
      highlightElements.forEach(element => {
        const parent = element.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(element.textContent || ''), element);
          parent.normalize();
        }
      });
      
      this.highlights = [];
      this.saveHighlights();
      this.showNotification('所有劃記已清除');
    }
  }

  // 匯出劃記
  exportHighlights(): void {
    if (this.highlights.length === 0) {
      this.showNotification('沒有劃記內容可匯出');
      return;
    }

    const exportData = {
      filename: this.filename,
      exportDate: new Date().toISOString(),
      highlights: this.highlights
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.filename}_highlights_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification('劃記內容已匯出');
  }

  // 儲存劃記到本地儲存
  private saveHighlights(): void {
    const key = `highlights_${this.filename}`;
    localStorage.setItem(key, JSON.stringify(this.highlights));
  }

  // 從本地儲存載入劃記
  private loadHighlights(): void {
    const key = `highlights_${this.filename}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.highlights = JSON.parse(saved);
        // 在內容載入後恢復劃記
        setTimeout(() => this.restoreHighlights(), 1000);
      } catch (error) {
        console.error('載入劃記失敗:', error);
        this.highlights = [];
      }
    }
  }

  // 恢復劃記顯示
  private restoreHighlights(): void {
    if (this.highlights.length === 0) return;

    const contentElement = this.elRef.nativeElement.querySelector('#content');
    if (!contentElement) return;

    // 這裡需要實現更複雜的文字匹配邏輯
    // 由於DOM結構可能已改變，我們使用文字內容匹配
    this.highlights.forEach(highlight => {
      this.restoreSingleHighlight(highlight, contentElement);
    });
  }

  // 恢復單個劃記
  private restoreSingleHighlight(highlight: any, container: HTMLElement): void {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent || '';
      if (text.includes(highlight.text)) {
        // 找到包含劃記文字的節點，進行劃記
        const regex = new RegExp(highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const newHTML = text.replace(regex, `<mark class="text-highlight" data-highlight-id="${highlight.id}" data-highlight-color="${highlight.color}" data-highlight-text="${highlight.text}" style="background-color: ${highlight.color}; padding: 2px 4px; border-radius: 3px; cursor: pointer;">$&</mark>`);
        
        if (newHTML !== text) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newHTML;
          
          const parent = node.parentNode;
          if (parent) {
            while (tempDiv.firstChild) {
              parent.insertBefore(tempDiv.firstChild, node);
            }
            parent.removeChild(node);
          }
          break;
        }
      }
    }
  }
}
