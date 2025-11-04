import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, Location, ViewportScroller  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../../service/material.service';
import { AiChatService } from '../../../../service/ai-chat.service';
import { AiQuizService } from '../../../../service/ai-quiz.service';
import { MessageBridgeService } from '../../../../service/message-bridge.service';
import { NoteService, Highlight, Note } from '../../../../service/note.service';
import { 
  CardComponent,
  CardModule   
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { 
  cilArrowLeft, 
  cilPen,
  cilNotes, 
  cilTrash, 
  cilX, 
  cilPencil, 
  cilSpeech 
} from '@coreui/icons';

@Component({
  selector: 'app-material-view',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MarkdownModule,
    CardModule,
    IconDirective,
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
  
  // 顏色選擇相關屬性
  showColorPicker: boolean = false;
  colorPickerPosition: { x: number, y: number } = { x: 0, y: 0 };
  selectedRange: Range | null = null;
  
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
  private highlights: Highlight[] = []; // 儲存劃記資料

  // 筆記相關屬性
  notes: Note[] = [];
  showNotePanel: boolean = false;
  editingNote: Note | null = null;
  noteTitle: string = '';
  noteText: string = '';
  selectedHighlightId: string | null = null; // 當前選中的劃記ID，用於建立關聯筆記
  activeHighlightId: string | null = null; // 當前高亮的劃記ID
  highlightedNoteId: string | null = null; // 當前高亮的筆記ID

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private location: Location,
    private elRef: ElementRef,
    private aiChatService: AiChatService,
    private aiQuizService: AiQuizService,
    private messageBridgeService: MessageBridgeService,
    private viewportScroller: ViewportScroller,
    private noteService: NoteService,
    private iconSetService: IconSetService
  ) {
    // 註冊圖標到 IconSetService
    const existingIcons = iconSetService.icons || {};
    iconSetService.icons = {
      ...existingIcons,
      ...{
        cilArrowLeft,
        cilPen,
        cilNotes,
        cilTrash,
        cilX,
        cilPencil,
        cilSpeech
      }
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const file = params.get('filename');
      if (file) {
        this.filename = file;
        this.loadMaterial(file);
        // 載入已儲存的劃記和筆記
        this.loadHighlights();
        this.loadNotes();
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
      // 重要：立即保存 Range（clone），避免點擊工具列時選取被清除
      if (selection.rangeCount > 0) {
        this.selectedRange = selection.getRangeAt(0).cloneRange();
      }
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
      console.log('[DEBUG] 已保存 selectedRange:', !!this.selectedRange);
    } else {
      this.hideButtons();
    }
  }

  // 隱藏按鈕
  private hideButtons(): void {
    this.showButtons = false;
    this.showColorPicker = false;
    this.selectedText = '';
    this.selectedRange = null;
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
  private createHighlight(range: Range, text: string): string | null {
    const highlightId = 'highlight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    console.log('[DEBUG] createHighlight 開始, highlightId:', highlightId);
    console.log('[DEBUG] 選擇的文字:', text);
    console.log('[DEBUG] Range 資訊:', {
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      startOffset: range.startOffset,
      endOffset: range.endOffset
    });
    
    try {
      // 檢查 Range 是否有效
      if (!range || range.collapsed) {
        console.warn('[DEBUG] Range 無效或已折疊');
        this.showNotification('選擇範圍無效，請重新選擇');
        return null;
      }
    
    // 創建劃記元素
    const highlightElement = document.createElement('mark');
    highlightElement.className = 'text-highlight';
    highlightElement.style.backgroundColor = this.selectedColor;
    highlightElement.style.padding = '2px 4px';
    highlightElement.style.borderRadius = '3px';
    highlightElement.style.cursor = 'pointer';
      highlightElement.style.position = 'relative';
    highlightElement.style.display = 'inline-block';
    highlightElement.setAttribute('data-highlight-id', highlightId);
    highlightElement.setAttribute('data-highlight-color', this.selectedColor);
    highlightElement.setAttribute('data-highlight-text', text);
    
      // 使用更安全的方法處理跨節點的選擇
      let success = false;
      
      try {
        // 嘗試使用 surroundContents（適用於單一文字節點）
      range.surroundContents(highlightElement);
        success = true;
        console.log('[DEBUG] 使用 surroundContents 成功');
      } catch (error) {
        console.log('[DEBUG] surroundContents 失敗，改用 extractContents 方法:', error);
        // 如果 surroundContents 失敗，使用 extractContents 和 insertNode
        try {
          const contents = range.extractContents();
          highlightElement.appendChild(contents);
          range.insertNode(highlightElement);
          success = true;
          console.log('[DEBUG] 使用 extractContents 方法成功');
        } catch (error2) {
          console.error('[DEBUG] extractContents 也失敗:', error2);
          // 最後的備選方案：使用文字替換
          const commonAncestor = range.commonAncestorContainer;
          if (commonAncestor.nodeType === Node.TEXT_NODE) {
            // 單一文字節點
            const textNode = commonAncestor as Text;
            const parent = textNode.parentNode;
            if (parent) {
              const beforeText = textNode.textContent!.substring(0, range.startOffset);
              const selectedText = textNode.textContent!.substring(range.startOffset, range.endOffset);
              const afterText = textNode.textContent!.substring(range.endOffset);
              
              highlightElement.textContent = selectedText;
              
              parent.insertBefore(document.createTextNode(beforeText), textNode);
              parent.insertBefore(highlightElement, textNode);
              parent.insertBefore(document.createTextNode(afterText), textNode);
              parent.removeChild(textNode);
              success = true;
              console.log('[DEBUG] 使用文字替換方法成功');
            }
          } else {
            // 跨節點情況：使用更複雜的處理
            console.log('[DEBUG] 處理跨節點選擇');
            success = this.highlightCrossNodes(range, highlightElement, text);
          }
        }
      }
      
      if (!success) {
        console.error('[DEBUG] 所有劃記方法都失敗');
        this.showNotification('劃記失敗，請選擇連續的文字');
        return null;
      }
      
      // 確保劃記元素已經添加到 DOM
      const actualHighlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`) as HTMLElement;
      if (!actualHighlightElement) {
        console.error('[DEBUG] 警告: 劃記元素未成功添加到 DOM');
        // 嘗試再次查找
        setTimeout(() => {
          const retryElement = document.querySelector(`[data-highlight-id="${highlightId}"]`) as HTMLElement;
          if (retryElement) {
            console.log('[DEBUG] 延遲找到劃記元素，添加事件監聽器');
            this.attachHighlightEvents(retryElement, highlightId);
          }
        }, 100);
      } else {
        // 使用統一的函數添加事件監聽器
        this.attachHighlightEvents(actualHighlightElement, highlightId);
      }
      
      // 儲存劃記資料到 MongoDB
      const highlightData: Omit<Highlight, '_id' | 'user' | 'type' | 'created_at' | 'updated_at'> = {
        filename: this.filename,
        highlight_id: highlightId,
        text: text,
        color: this.selectedColor
      };
      
      console.log('[DEBUG] 準備儲存劃記到 MongoDB:', highlightData);
      this.noteService.saveHighlight(highlightData).subscribe({
        next: (res) => {
          console.log('[DEBUG] 劃記儲存成功:', res);
          if (res.success && res.highlight) {
            // 更新本地劃記列表
            const existingIndex = this.highlights.findIndex(h => h.highlight_id === highlightId);
            if (existingIndex >= 0) {
              this.highlights[existingIndex] = res.highlight;
              console.log('[DEBUG] 更新現有劃記, index:', existingIndex);
            } else {
              this.highlights.push(res.highlight);
              console.log('[DEBUG] 添加新劃記到列表, 總數:', this.highlights.length);
            }
            // 劃記建立後，重新載入筆記以更新標記
            console.log('[DEBUG] 劃記建立後，重新載入筆記以更新標記');
            // 延遲一下確保 DOM 已更新
            setTimeout(() => {
              this.loadNotes();
              // 再次更新標記，確保劃記元素已存在
              setTimeout(() => {
                this.updateHighlightNoteMarkers();
              }, 200);
            }, 100);
          }
        },
        error: (err) => {
          console.error('儲存劃記失敗:', err);
          this.showNotification('儲存劃記失敗，請重試');
        }
      });
      
      this.showNotification(`已劃記: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`);
      return highlightId;
      
    } catch (error) {
      console.error('[DEBUG] 創建劃記失敗:', error);
      this.showNotification('劃記失敗，請重新選擇文字');
      return null;
    }
  }

  // 處理跨節點的劃記
  private highlightCrossNodes(range: Range, highlightElement: HTMLElement, text: string): boolean {
    console.log('[DEBUG] highlightCrossNodes 開始處理跨節點選擇');
    
    try {
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;
      
      // 如果起始和結束在同一個文字節點
      if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = startContainer as Text;
        const parent = textNode.parentNode;
        if (!parent) return false;
        
        const beforeText = text.substring(0, range.startOffset);
        const selectedText = text.substring(range.startOffset, range.endOffset);
        const afterText = text.substring(range.endOffset);
        
        // 分割文字節點
        if (range.startOffset > 0) {
          const beforeNode = textNode.splitText(range.startOffset);
          textNode.textContent = beforeText;
        }
        
        const selectedNode = range.startContainer as Text;
        if (range.endOffset < selectedNode.textContent!.length) {
          selectedNode.splitText(range.endOffset - range.startOffset);
        }
        
        highlightElement.textContent = selectedText;
        parent.replaceChild(highlightElement, selectedNode);
        return true;
      }
      
      // 跨多個節點的情況：使用更簡單的方法
      // 找到包含選擇範圍的最小容器
      const commonAncestor = range.commonAncestorContainer;
      let container: Node = commonAncestor;
      
      // 向上查找，找到合適的容器
      while (container && container.nodeType !== Node.ELEMENT_NODE) {
        container = container.parentNode!;
      }
      
      if (!container) return false;
      
      // 使用文字匹配的方式
      const containerElement = container as HTMLElement;
      const allText = containerElement.textContent || '';
      const startIndex = allText.indexOf(text);
      
      if (startIndex === -1) {
        console.warn('[DEBUG] 無法在容器中找到匹配的文字');
        return false;
      }
      
      // 使用 TreeWalker 找到文字節點並替換
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let currentIndex = 0;
      let node;
      let foundStart = false;
      let startNode: Text | null = null;
      let startOffset = 0;
      
      while (node = walker.nextNode()) {
        const nodeText = node.textContent || '';
        const nodeLength = nodeText.length;
        
        if (!foundStart && currentIndex + nodeLength > startIndex) {
          foundStart = true;
          startNode = node as Text;
          startOffset = startIndex - currentIndex;
        }
        
        if (foundStart && currentIndex + nodeLength >= startIndex + text.length) {
          // 找到結束位置
          const endOffset = startIndex + text.length - currentIndex;
          
          // 分割節點並創建劃記
          if (startNode) {
            if (startNode === node) {
              // 在同一個節點內
              const beforeText = nodeText.substring(0, startOffset);
              const selectedText = nodeText.substring(startOffset, endOffset);
              const afterText = nodeText.substring(endOffset);
              
              highlightElement.textContent = selectedText;
              
              const parent = startNode.parentNode;
              if (parent) {
                if (beforeText) {
                  parent.insertBefore(document.createTextNode(beforeText), startNode);
                }
                parent.insertBefore(highlightElement, startNode);
                if (afterText) {
                  parent.insertBefore(document.createTextNode(afterText), startNode);
                }
                parent.removeChild(startNode);
                return true;
              }
            }
          }
          break;
        }
        
        currentIndex += nodeLength;
      }
      
      return false;
    } catch (error) {
      console.error('[DEBUG] highlightCrossNodes 錯誤:', error);
      return false;
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
    
    console.log('[DEBUG] highlightSelectedText 被調用');
    console.log('[DEBUG] 選中的文字:', selectedText);
    console.log('[DEBUG] Range 資訊:', {
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      collapsed: range.collapsed
    });
    
    // 顯示顏色選擇器
    this.showColorPicker = true;
    this.colorPickerPosition = {
      x: this.buttonPosition.x + 100,
      y: this.buttonPosition.y
    };
    
    // 儲存選中的範圍和文字
    // 重要：需要克隆 Range，因為當選擇被清除時 Range 會失效
    this.selectedText = selectedText;
    this.selectedRange = range.cloneRange();
    console.log('[DEBUG] 已儲存選中的範圍和文字，等待用戶選擇顏色');
  }

  // 選擇顏色並劃記
  selectColorAndHighlight(color: string): void {
    console.log('[DEBUG] selectColorAndHighlight 被調用, 顏色:', color);
    console.log('[DEBUG] selectedRange:', this.selectedRange ? '存在' : '不存在');
    console.log('[DEBUG] selectedText:', this.selectedText);
    
    if (this.selectedRange && this.selectedText) {
      // 檢查 Range 是否仍然有效
      try {
        const testRange = this.selectedRange.cloneRange();
        const testText = testRange.toString();
        console.log('[DEBUG] Range 測試文字:', testText);
        
        if (testText.trim().length < 2) {
          console.warn('[DEBUG] Range 已失效，嘗試重新獲取選擇');
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            this.selectedRange = selection.getRangeAt(0).cloneRange();
            this.selectedText = selection.toString().trim();
            console.log('[DEBUG] 重新獲取選擇成功:', this.selectedText);
          } else {
            this.showNotification('選擇已失效，請重新選擇文字');
            this.hideButtons();
            this.showColorPicker = false;
            return;
          }
        }
      } catch (error) {
        console.error('[DEBUG] Range 測試失敗:', error);
        this.showNotification('選擇已失效，請重新選擇文字');
        this.hideButtons();
        this.showColorPicker = false;
        return;
      }
      
      this.selectedColor = color;
      console.log('[DEBUG] 開始建立劃記');
      this.createHighlight(this.selectedRange, this.selectedText);
      this.hideButtons();
      this.showColorPicker = false;
    } else {
      console.warn('[DEBUG] selectedRange 或 selectedText 不存在');
      this.showNotification('請先選擇要劃記的文字');
    }
  }

  // 直接用目前選擇建立筆記：劃記文字作為標題
  createNoteFromSelection(): void {
    // 若先前保存的 Range/文字不存在，嘗試從目前選取恢復一次
    if (!this.selectedRange || !this.selectedText) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && sel.toString().trim().length > 0) {
        this.selectedRange = sel.getRangeAt(0).cloneRange();
        this.selectedText = sel.toString().trim();
      }
    }
    if (!this.selectedRange || !this.selectedText) {
      this.showNotification('請先選擇要劃記與筆記的文字');
      return;
    }
    // 使用目前顏色建立劃記
    const id = this.createHighlight(this.selectedRange, this.selectedText);
    if (id) {
      this.selectedHighlightId = id;
      this.noteTitle = this.selectedText.length > 50 ? this.selectedText.substring(0, 50) + '…' : this.selectedText;
      this.noteText = '';
      this.showNotePanel = true;
    }
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
      { text: '建立筆記', action: () => this.createNoteForHighlight(highlightId) },
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
      // 顯示顏色選擇器
      this.showColorPicker = true;
      const rect = highlightElement.getBoundingClientRect();
      this.colorPickerPosition = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      };
      this.selectedHighlightId = highlightId;
      
      // 監聽顏色選擇
      setTimeout(() => {
        const colorSelectHandler = (color: string) => {
          this.selectedColor = color;
          highlightElement.style.backgroundColor = color;
          highlightElement.setAttribute('data-highlight-color', color);
          
          // 更新儲存的資料到 MongoDB
          const highlightData = this.highlights.find(h => h.highlight_id === highlightId);
      if (highlightData) {
            const updateData: Omit<Highlight, '_id' | 'user' | 'type' | 'created_at' | 'updated_at'> = {
              filename: this.filename,
              highlight_id: highlightId,
              text: highlightData.text,
              color: color
            };
            this.noteService.saveHighlight(updateData).subscribe({
              next: (res) => {
                if (res.success && res.highlight) {
                  const index = this.highlights.findIndex(h => h.highlight_id === highlightId);
                  if (index >= 0) {
                    this.highlights[index] = res.highlight;
                  }
                }
              },
              error: (err) => {
                console.error('更新劃記顏色失敗:', err);
              }
            });
          }
          
          this.showColorPicker = false;
          this.selectedHighlightId = null;
      this.showNotification('劃記顏色已更改');
        };
        
        // 臨時綁定顏色選擇事件
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach((btn, index) => {
          btn.addEventListener('click', () => {
            colorSelectHandler(this.highlightColors[index].value);
          }, { once: true });
        });
      }, 100);
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
      
      // 從 MongoDB 和本地列表中移除
      this.noteService.deleteHighlight(this.filename, highlightId).subscribe({
        next: (res) => {
          if (res.success) {
            this.highlights = this.highlights.filter(h => h.highlight_id !== highlightId);
          }
        },
        error: (err) => {
          console.error('刪除劃記失敗:', err);
          this.showNotification('刪除劃記失敗，請重試');
        }
      });
      
      this.showNotification('劃記已移除');
    }
  }

  // 清除所有劃記
  clearAllHighlights(): void {
    if (confirm('確定要清除所有劃記嗎？此操作無法復原。')) {
      this.noteService.clearAllHighlights(this.filename).subscribe({
        next: (res) => {
          if (res.success) {
      const highlightElements = document.querySelectorAll('.text-highlight');
      highlightElements.forEach(element => {
        const parent = element.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(element.textContent || ''), element);
          parent.normalize();
        }
      });
      
      this.highlights = [];
            this.showNotification(res.message || '所有劃記已清除');
          }
        },
        error: (err) => {
          console.error('清除劃記失敗:', err);
          this.showNotification('清除劃記失敗，請重試');
        }
      });
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

  // 儲存劃記到 MongoDB
  private saveHighlights(): void {
    // 只儲存最後一個劃記（避免重複儲存）
    // 實際的儲存操作在 createHighlight 中進行
  }

  // 從 MongoDB 載入劃記
  private loadHighlights(): void {
    console.log('[DEBUG] 開始載入劃記, filename:', this.filename);
    this.noteService.getHighlights(this.filename).subscribe({
      next: (res) => {
        console.log('[DEBUG] 劃記載入成功:', res);
        console.log('[DEBUG] 劃記數量:', res.highlights?.length || 0);
        console.log('[DEBUG] 劃記列表:', res.highlights);
        this.highlights = res.highlights;
        // 在內容載入後恢復劃記
        console.log('[DEBUG] 等待 1 秒後恢復劃記顯示');
        setTimeout(() => {
          console.log('[DEBUG] 開始恢復劃記顯示');
          this.restoreHighlights();
          // 載入筆記並更新標記
          console.log('[DEBUG] 恢復劃記後，載入筆記');
          this.loadNotes();
        }, 1000);
      },
      error: (err) => {
        console.error('[DEBUG] 載入劃記失敗:', err);
        this.highlights = [];
      }
    });
  }

  // 載入筆記
  private loadNotes(): void {
    console.log('[DEBUG] 開始載入筆記, filename:', this.filename);
    this.noteService.getNotes(this.filename).subscribe({
      next: (res) => {
        console.log('[DEBUG] 筆記載入成功:', res);
        console.log('[DEBUG] 筆記數量:', res.notes?.length || 0);
        console.log('[DEBUG] 筆記列表:', res.notes);
        this.notes = res.notes;
        // 更新劃記上的筆記標記
        console.log('[DEBUG] 開始更新劃記標記, 當前劃記數量:', this.highlights.length);
        this.updateHighlightNoteMarkers();
      },
      error: (err) => {
        console.error('[DEBUG] 載入筆記失敗:', err);
        this.notes = [];
      }
    });
  }

  // 更新劃記上的筆記標記
  private updateHighlightNoteMarkers(): void {
    console.log('[DEBUG] updateHighlightNoteMarkers 開始執行');
    console.log('[DEBUG] 當前筆記數量:', this.notes.length);
    console.log('[DEBUG] 當前劃記數量:', this.highlights.length);
    
    // 清除所有現有標記
    const existingMarkers = document.querySelectorAll('.note-marker');
    console.log('[DEBUG] 清除現有標記數量:', existingMarkers.length);
    existingMarkers.forEach(marker => marker.remove());
    
    // 為有關聯筆記的劃記添加標記
    let markerCount = 0;
    this.notes.forEach((note, index) => {
      console.log(`[DEBUG] 處理筆記 ${index + 1}:`, {
        note_id: note._id,
        highlight_id: note.highlight_id,
        title: note.title
      });
      
      if (note.highlight_id) {
        console.log(`[DEBUG] 筆記 ${index + 1} 有關聯劃記, highlight_id:`, note.highlight_id);
        const highlightElement = document.querySelector(`[data-highlight-id="${note.highlight_id}"]`) as HTMLElement;
        console.log(`[DEBUG] 查找劃記元素結果:`, highlightElement ? '找到' : '未找到');
        
        if (highlightElement) {
          const existingMarker = highlightElement.querySelector('.note-marker');
          console.log(`[DEBUG] 劃記元素上已有標記:`, existingMarker ? '是' : '否');
          
          if (!existingMarker) {
            console.log(`[DEBUG] 為劃記 ${note.highlight_id} 添加標記`);
            const marker = document.createElement('span');
            marker.className = 'note-marker';
            // 使用 SVG 圖標（簡化版本，直接使用 Unicode 或 CSS）
            marker.innerHTML = '📝';
            marker.title = '此劃記有筆記';
            marker.style.cssText = `
              position: absolute;
              top: calc(100% + 4px); /* 在框的下方 */
              left: 50%;
              transform: translateX(-50%);
              width: 18px;
              height: 18px;
              background: #3b82f6;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              z-index: 1000;
            `;
            marker.addEventListener('click', (e) => {
              e.stopPropagation();
              console.log('[DEBUG] 點擊筆記標記, highlight_id:', note.highlight_id);
              this.showNoteForHighlight(note.highlight_id!);
            });
            
            // 確保劃記元素是相對定位
            if (highlightElement.style.position !== 'relative') {
              highlightElement.style.position = 'relative';
            }
            highlightElement.appendChild(marker);
            markerCount++;
            console.log(`[DEBUG] 標記已添加到劃記 ${note.highlight_id}`);
          }
        } else {
          console.warn(`[DEBUG] 警告: 找不到對應的劃記元素, highlight_id:`, note.highlight_id);
          // 列出所有現有的劃記 ID
          const allHighlights = document.querySelectorAll('[data-highlight-id]');
          const highlightIds: string[] = [];
          allHighlights.forEach(el => {
            const id = el.getAttribute('data-highlight-id');
            if (id) highlightIds.push(id);
          });
          console.log('[DEBUG] 頁面上現有的劃記 ID:', highlightIds);
        }
      } else {
        console.log(`[DEBUG] 筆記 ${index + 1} 沒有關聯劃記`);
      }
    });
    
    console.log(`[DEBUG] updateHighlightNoteMarkers 完成, 共添加 ${markerCount} 個標記`);
  }

  // 恢復劃記顯示
  private restoreHighlights(): void {
    console.log('[DEBUG] restoreHighlights 開始執行');
    console.log('[DEBUG] 需要恢復的劃記數量:', this.highlights.length);
    
    if (this.highlights.length === 0) {
      console.log('[DEBUG] 沒有劃記需要恢復');
      return;
    }

    const contentElement = this.elRef.nativeElement.querySelector('#content');
    if (!contentElement) {
      console.warn('[DEBUG] 找不到內容元素 #content');
      return;
    }

    console.log('[DEBUG] 找到內容元素，開始恢復劃記');
    let restoredCount = 0;
    // 這裡需要實現更複雜的文字匹配邏輯
    // 由於DOM結構可能已改變，我們使用文字內容匹配
    this.highlights.forEach((highlight, index) => {
      console.log(`[DEBUG] 恢復劃記 ${index + 1}/${this.highlights.length}:`, {
        highlight_id: highlight.highlight_id,
        text: highlight.text.substring(0, 30) + '...',
        color: highlight.color
      });
      const restored = this.restoreSingleHighlight(highlight, contentElement);
      if (restored) restoredCount++;
    });
    
    console.log(`[DEBUG] 劃記恢復完成, 成功恢復 ${restoredCount}/${this.highlights.length} 個`);
  }

  // ========== 筆記功能 ==========

  // 切換筆記面板
  toggleNotePanel(): void {
    this.showNotePanel = !this.showNotePanel;
    if (this.showNotePanel) {
      this.loadNotes();
    }
  }

  // 為選中的劃記建立筆記
  createNoteForHighlight(highlightId: string): void {
    this.selectedHighlightId = highlightId;
    this.editingNote = null;
    this.noteTitle = this.getHighlightText(highlightId) || '';
    this.noteText = '';
    this.showNotePanel = true;
  }

  // 建立新筆記
  createNote(): void {
    if (!this.noteText.trim()) {
      this.showNotification('請輸入筆記內容');
      return;
    }

    const fallbackTitle = this.selectedHighlightId ? (this.getHighlightText(this.selectedHighlightId) || '') : '';
    const noteData: Omit<Note, '_id' | 'user' | 'type' | 'created_at' | 'updated_at'> = {
      filename: this.filename,
      text: this.noteText,
      title: this.noteTitle || fallbackTitle || `筆記 ${new Date().toLocaleString('zh-TW')}`,
      highlight_id: this.selectedHighlightId || undefined
    };

      console.log('[DEBUG] 建立筆記, 資料:', noteData);
      this.noteService.createNote(noteData).subscribe({
        next: (res) => {
          console.log('[DEBUG] 筆記建立成功:', res);
          if (res.success && res.note) {
            console.log('[DEBUG] 新增的筆記:', res.note);
            console.log('[DEBUG] 筆記關聯的劃記 ID:', res.note.highlight_id);
            this.notes.unshift(res.note);
            console.log('[DEBUG] 筆記列表更新後數量:', this.notes.length);
            this.noteTitle = '';
            this.noteText = '';
            this.selectedHighlightId = null;
            // 更新劃記標記
            console.log('[DEBUG] 筆記建立後，更新劃記標記');
            this.updateHighlightNoteMarkers();
            // 高亮相關劃記
            if (res.note.highlight_id) {
              console.log('[DEBUG] 高亮相關劃記:', res.note.highlight_id);
              this.highlightRelatedHighlight(res.note.highlight_id);
            }
            this.showNotification('筆記已建立');
          }
        },
      error: (err) => {
        console.error('建立筆記失敗:', err);
        this.showNotification('建立筆記失敗，請重試');
      }
    });
  }

  // 編輯筆記
  editNote(note: Note): void {
    this.editingNote = note;
    this.noteTitle = note.title;
    this.noteText = note.text;
    this.selectedHighlightId = note.highlight_id || null;
    this.showNotePanel = true;
  }

  // 更新筆記
  updateNote(): void {
    if (!this.editingNote || !this.noteText.trim()) {
      this.showNotification('請輸入筆記內容');
      return;
    }

    this.noteService.updateNote(this.editingNote._id!, {
      text: this.noteText,
      title: this.noteTitle || this.editingNote.title
    }).subscribe({
      next: (res) => {
        if (res.success && res.note) {
          const index = this.notes.findIndex(n => n._id === this.editingNote!._id);
          if (index >= 0) {
            this.notes[index] = res.note;
          }
          // 更新劃記標記
          this.updateHighlightNoteMarkers();
          this.cancelEditNote();
          this.showNotification('筆記已更新');
        }
      },
      error: (err) => {
        console.error('更新筆記失敗:', err);
        this.showNotification('更新筆記失敗，請重試');
      }
    });
  }

  // 取消編輯筆記
  cancelEditNote(): void {
    this.editingNote = null;
    this.noteTitle = '';
    this.noteText = '';
    this.selectedHighlightId = null;
  }

  // 刪除筆記
  deleteNote(note: Note): void {
    if (!confirm('確定要刪除這則筆記嗎？')) {
      return;
    }

    if (!note._id) {
      this.showNotification('筆記ID不存在');
      return;
    }

    this.noteService.deleteNote(note._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.notes = this.notes.filter(n => n._id !== note._id);
          // 更新劃記標記
          this.updateHighlightNoteMarkers();
          this.showNotification('筆記已刪除');
        }
      },
      error: (err) => {
        console.error('刪除筆記失敗:', err);
        this.showNotification('刪除筆記失敗，請重試');
      }
    });
  }

  // 顯示劃記的相關筆記
  showNoteForHighlight(highlightId: string): void {
    console.log('[DEBUG] showNoteForHighlight, highlightId:', highlightId);
    console.log('[DEBUG] 當前筆記列表:', this.notes);
    const relatedNote = this.notes.find(n => n.highlight_id === highlightId);
    console.log('[DEBUG] 找到相關筆記:', relatedNote ? '是' : '否');
    
    if (relatedNote) {
      console.log('[DEBUG] 相關筆記詳情:', relatedNote);
      // 開啟筆記面板
      this.showNotePanel = true;
      // 高亮相關筆記
      this.highlightedNoteId = relatedNote._id || null;
      console.log('[DEBUG] 設定高亮筆記 ID:', this.highlightedNoteId);
      // 高亮相關劃記
      this.highlightRelatedHighlight(highlightId);
      // 滾動到筆記位置
      setTimeout(() => {
        const noteElement = document.querySelector(`[data-note-id="${relatedNote._id}"]`);
        console.log('[DEBUG] 查找筆記元素:', noteElement ? '找到' : '未找到');
        if (noteElement) {
          noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加閃爍效果
          (noteElement as HTMLElement).classList.add('note-flash');
          setTimeout(() => {
            (noteElement as HTMLElement).classList.remove('note-flash');
          }, 1000);
        }
      }, 100);
    } else {
      console.warn('[DEBUG] 警告: 找不到關聯的筆記, highlightId:', highlightId);
    }
  }

  // 高亮相關劃記
  highlightRelatedHighlight(highlightId: string): void {
    // 清除之前的高亮
    document.querySelectorAll('.text-highlight.active').forEach(el => {
      el.classList.remove('active');
    });
    
    const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`) as HTMLElement;
    if (highlightElement) {
      highlightElement.classList.add('active');
      this.activeHighlightId = highlightId;
      
      // 滾動到劃記位置
      highlightElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 3秒後移除高亮
      setTimeout(() => {
        highlightElement.classList.remove('active');
        this.activeHighlightId = null;
      }, 3000);
    }
  }

  // 顯示快速動作提示
  private showQuickActionHint(element: HTMLElement, highlightId: string): void {
    // 移除現有提示
    const existingHint = document.querySelector('.quick-action-hint');
    if (existingHint) {
      existingHint.remove();
    }

    const hint = document.createElement('div');
    hint.className = 'quick-action-hint';
    hint.innerHTML = `
      <div class="hint-content">
        <p>雙擊建立筆記</p>
        <p class="hint-subtitle">右鍵查看更多選項</p>
      </div>
    `;
    hint.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
      animation: fadeInOut 2s ease-in-out;
    `;

    const rect = element.getBoundingClientRect();
    hint.style.left = `${rect.left + rect.width / 2}px`;
    hint.style.top = `${rect.top - 50}px`;
    hint.style.transform = 'translateX(-50%)';

    document.body.appendChild(hint);

    setTimeout(() => {
      hint.remove();
    }, 2000);
  }

  // 從筆記跳轉到劃記
  scrollToHighlight(note: Note): void {
    if (note.highlight_id) {
      this.highlightRelatedHighlight(note.highlight_id);
      this.highlightedNoteId = note._id || null;
    }
  }

  // 獲取劃記文字
  getHighlightText(highlightId: string): string {
    const highlight = this.highlights.find(h => h.highlight_id === highlightId);
    if (highlight) {
      const text = highlight.text;
      return text.length > 30 ? text.substring(0, 30) + '...' : text;
    }
    return '';
  }

  // 恢復單個劃記
  private restoreSingleHighlight(highlight: Highlight, container: HTMLElement): boolean {
    console.log(`[DEBUG] restoreSingleHighlight 開始, highlight_id: ${highlight.highlight_id}`);
    
    // 先檢查是否已經存在
    const existing = document.querySelector(`[data-highlight-id="${highlight.highlight_id}"]`);
    if (existing) {
      console.log(`[DEBUG] 劃記 ${highlight.highlight_id} 已存在，跳過恢復`);
      return true;
    }
    
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    let found = false;
    while (node = walker.nextNode()) {
      const text = node.textContent || '';
      if (text.includes(highlight.text)) {
        console.log(`[DEBUG] 找到包含劃記文字的節點, 文字長度: ${text.length}`);
        // 找到包含劃記文字的節點，進行劃記
        const regex = new RegExp(highlight.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const newHTML = text.replace(
          regex,
          `<mark class="text-highlight" data-highlight-id="${highlight.highlight_id}" data-highlight-color="${highlight.color}" data-highlight-text="${highlight.text}" style="background-color: ${highlight.color}; padding: 2px 4px; border-radius: 3px; cursor: pointer; position: relative; display: inline-block;">$&</mark>`
        );
        
        if (newHTML !== text) {
          console.log(`[DEBUG] 成功替換文字，建立劃記元素`);
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = newHTML;
          
          const parent = node.parentNode;
          if (parent) {
            while (tempDiv.firstChild) {
              parent.insertBefore(tempDiv.firstChild, node);
            }
            parent.removeChild(node);
          }
          
          // 為恢復的劃記添加事件監聽器
          const highlightElement = document.querySelector(`[data-highlight-id="${highlight.highlight_id}"]`) as HTMLElement;
          if (highlightElement) {
            console.log(`[DEBUG] 為恢復的劃記添加事件監聽器`);
            this.attachHighlightEvents(highlightElement, highlight.highlight_id);
          }
          
          // 恢復後更新標記
          setTimeout(() => {
            this.updateHighlightNoteMarkers();
          }, 100);
          
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      console.warn(`[DEBUG] 警告: 無法找到劃記文字 "${highlight.text.substring(0, 30)}..." 在頁面中`);
    }
    
    return found;
  }

  // 為劃記添加事件監聽器
  private attachHighlightEvents(highlightElement: HTMLElement, highlightId: string): void {
    console.log(`[DEBUG] attachHighlightEvents 為劃記 ${highlightId} 添加事件`);
    
    // 添加右鍵選單功能
    highlightElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showHighlightContextMenu(e, highlightId);
    });
    
    // 添加點擊事件
    highlightElement.addEventListener('click', (e) => {
      if (e.detail === 2) { // 雙擊：建立筆記
        console.log(`[DEBUG] 雙擊劃記 ${highlightId}，建立筆記`);
        this.createNoteForHighlight(highlightId);
      } else if (e.detail === 1) { // 單擊：顯示相關筆記或快速預覽
        const relatedNote = this.notes.find(n => n.highlight_id === highlightId);
        if (relatedNote) {
          console.log(`[DEBUG] 單擊劃記 ${highlightId}，找到相關筆記`);
          this.showNoteForHighlight(highlightId);
        } else {
          console.log(`[DEBUG] 單擊劃記 ${highlightId}，沒有相關筆記，顯示提示`);
          // 顯示快速動作提示
          this.showQuickActionHint(highlightElement, highlightId);
        }
      }
    });
    
    // 添加懸停效果
    highlightElement.addEventListener('mouseenter', () => {
      highlightElement.style.transform = 'scale(1.02)';
      highlightElement.style.transition = 'all 0.2s ease';
    });
    highlightElement.addEventListener('mouseleave', () => {
      highlightElement.style.transform = 'scale(1)';
    });
  }
}
