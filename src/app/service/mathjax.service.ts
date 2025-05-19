import { Injectable } from '@angular/core';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MathJaxService {
  private initialized = false;

  constructor() {
    this.loadMathJaxScript();
  }

  private loadMathJaxScript(): void {
    if (typeof window.MathJax === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => this.configureMathJax();
      document.head.appendChild(script);
    } else {
      this.configureMathJax();
    }
  }

  private configureMathJax(): void {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      },
      svg: {
        fontCache: 'global'
      },
      options: {
        enableMenu: false
      }
    };
    this.initialized = true;
  }

  renderMathInElement(element: HTMLElement): void {
    if (!this.initialized) {
      setTimeout(() => this.renderMathInElement(element), 500);
      return;
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([element]).catch((err: any) => console.error('MathJax 錯誤:', err));
    }
  }

  renderMath(text: string): string {
    // 替換 LaTeX 語法中的特殊字符
    return text
      .replace(/\\{/g, '\\lbrace')
      .replace(/\\}/g, '\\rbrace');
  }
} 