import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialService } from '../../../service/material.service';

@Component({
  selector: 'app-material',
  standalone: true,   // ✅ Standalone component
  imports: [CommonModule, MarkdownModule],  // ✅ 匯入 markdown
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss']  // ✅ 改成複數
})
export class MaterialComponent {
  filename: string = 'intro.md';
  content: string = '# 第一章：計算機概論這一章介紹計算機的基本概念。## 1.1 計算機發展史- 第一代：真空管- 第二代：電晶體- 第三代：積體電路- 第四代：微處理器## 1.2 計算機應用領域1. 資料處理2. 自動化控制3. 通訊';

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    // 這裡可以從 API 載入教材內容
    this.materialService.getMaterial(this.filename).subscribe({
      next: (res) => {
        this.content = res.content; // 假設 API 回傳有 content 欄位
      },
      error: (err) => {
        console.error('讀取教材失敗:', err);
      }
    });
  }
}

