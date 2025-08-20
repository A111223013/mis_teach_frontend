import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router  } from '@angular/router';

interface CourseItem {
  id: string;        // 路由使用的識別碼，例如 'cs-intro'
  name: string;      // 顯示名稱，例如 '計算機概論'
  description: string; // 簡短描述
  icon?: string;     // emoji 或未來可替換成圖片
}
@Component({
  selector: 'app-courses',
  imports: [CommonModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  // 先寫死幾個科目，之後可以從後端 API 取代
  courses: CourseItem[] = [
    { id: 'cs-intro', name: '計算機概論', description: '基礎概念、硬體/軟體、資料表示', icon: '💻' },
    { id: 'db', name: '資料庫', description: '關聯模型、SQL、交易、索引', icon: '🗄️' },
    { id: 'security', name: '資安', description: '資安觀念、攻防與實務', icon: '🛡️' },
    { id: 'network', name: '電腦網路', description: 'OSI/TCP-IP、協定與拓撲', icon: '🌐' },
  ];

  constructor(private router: Router) {}

  goToMaterial() {
    this.router.navigate(['/dashboard/material']);
  }

}
