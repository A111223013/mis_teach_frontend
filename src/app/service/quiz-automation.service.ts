import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuizAutomationService {

  constructor() { }

  /**
   * 找到選擇器元素
   */
  findSelectElement(type: 'school' | 'year' | 'department'): HTMLSelectElement | null {
    // 直接使用明確的 class 選擇器
    const classSelectors = {
      school: 'select.school-select',
      year: 'select.year-select', 
      department: 'select.dept-select'
    };
    
    const select = document.querySelector(classSelectors[type]) as HTMLSelectElement;
    if (select) {
      return select;
    }

    return null;
  }

  /**
   * 選擇選項
   */
  selectOption(select: HTMLSelectElement, value: string, text: string, cdr: any, componentProperty?: string, component?: any): boolean {
    try {
      // 1. 先更新組件變量（如果提供）
      if (component && componentProperty) {
        (component as any)[componentProperty] = value;
      }
      // 2. 設置 DOM 值
      select.value = value;
      // 3. 觸發多種事件確保 Angular 檢測到變更
      const changeEvent = new Event('change', { bubbles: true });
      const inputEvent = new Event('input', { bubbles: true });
      const ngModelChangeEvent = new Event('ngModelChange', { bubbles: true });
      
      select.dispatchEvent(changeEvent);
      select.dispatchEvent(inputEvent);
      select.dispatchEvent(ngModelChangeEvent);
      
      // 4. 額外觸發 focus 和 blur 事件
      select.focus();
      select.blur();
      
      // 5. 強制觸發變更檢測
      if (cdr) {
        cdr.detectChanges();
      }
      
      // 6. 等待一下再檢查值是否正確設置
      setTimeout(() => {
        if (select.value !== value) {
          console.warn(`⚠️ 值設置可能失敗，重新嘗試`);
          // 重新設置組件變量
          if (component && componentProperty) {
            (component as any)[componentProperty] = value;
          }
          // 重新設置 DOM 值
          select.value = value;
          select.dispatchEvent(changeEvent);
          if (cdr) {
            cdr.detectChanges();
          }
        }
      }, 100);
      
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * 模糊匹配選項
   */
  findBestMatch(options: HTMLOptionElement[], target: string, property: string = 'textContent'): HTMLOptionElement | null {
    if (!options || options.length === 0) return null;
    
    let bestMatch: HTMLOptionElement | null = null;
    let bestScore = 0;
    
    for (const option of options) {
      const text = (option as any)[property] || option.textContent || '';
      if (!text) continue;
      
      const score = this.calculateSimilarity(text.toLowerCase(), target.toLowerCase());
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = option;
      }
    }
    
    if (bestScore < 0.2) {
      return null;
    }
    
    return bestMatch;
  }

  /**
   * 計算字符串相似度
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    
    // 特殊處理年份：提取數字部分進行比較
    const extractNumbers = (str: string) => str.replace(/\D/g, '');
    const num1 = extractNumbers(str1);
    const num2 = extractNumbers(str2);
    
    if (num1 && num2 && num1 === num2) {
      return 0.9;
    }
    
    // 計算編輯距離
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    
    if (maxLength === 0) return 1.0;
    
    return 1 - (distance / maxLength);
  }

  /**
   * 計算編輯距離
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}
