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
  files: string[] = [];         // 存放教材檔案清單
  content: string = '';         // 顯示的教材內容
  selectedFile: string = '';    // 目前選中的檔案

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    // 初始化時讀取教材清單
    this.materialService.getMaterials().subscribe({
      next: (res) => {
        this.files = res.files || [];
      },
      error: (err) => {
        console.error('讀取教材列表失敗:', err);
      }
    });
  }

  loadFile(filename: string): void {
    this.selectedFile = filename;
    this.materialService.getMaterial(filename).subscribe({
      next: (res) => {
        this.content = res.content;
      },
      error: (err) => {
        console.error(`讀取教材 ${filename} 失敗:`, err);
      }
    });
  }

  

}

