import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '@coreui/angular';
import { RouterModule, Router  } from '@angular/router';
import { MaterialService } from '../../../service/material.service';


interface CourseItem {
  id: string;        // 路由使用的識別碼，例如 'cs-intro'
  name: string;      // 顯示名稱，例如 '計算機概論'
  description: string; // 簡短描述
  icon?: string;     // emoji 或未來可替換成圖片
}
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    CardModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  keyPoints: string[] = [];

  constructor(private router: Router, private materialService: MaterialService) {
    this.loadKeyPoints();
  }

  loadKeyPoints() {
    this.materialService.getKeyPoints().subscribe({
      next: (res) => {
        console.log('API 回傳資料:', res); // 新增這行
        this.keyPoints = res.key_points;
      },
      error: (err) => {
        console.error('載入知識點失敗', err);
      }
    });
  }

  goToMaterial(kp: string) {
    this.router.navigate(['/dashboard/material'], { queryParams: { keypoint: kp } });
  }

}
