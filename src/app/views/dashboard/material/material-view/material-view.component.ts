import { Component, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../../service/material.service';

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

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private location: Location,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const file = params.get('filename');
      if (file) {
        this.filename = file;
        this.loadMaterial(file);
      }
    });
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
}
