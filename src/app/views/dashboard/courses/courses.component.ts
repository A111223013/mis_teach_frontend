import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router  } from '@angular/router';
import { MaterialService } from '../../../service/material.service';


interface CourseData {
  keypoint: string;     // keypoint 名稱
  name: string;         // domain name
  description: string;  // domain description
  image: string;        // 圖片路徑
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})

export class CoursesComponent implements OnInit {
  keyPoints: string[] = [];
  courses: CourseData[] = [];

  constructor(private router: Router, private materialService: MaterialService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadKeyPoints();
  }

  loadCourses() {
    this.materialService.getDomains().subscribe(domains => {
      const keypoints = [
        "AI與機器學習",
        "MIS",
        "作業系統",
        "基本計概",
        "數位邏輯",
        "程式語言",
        "網路",
        "資料庫",
        "資料結構",
        "資訊安全",
        "軟體工程與系統開發",
        "雲端與虛擬化"
      ];

      const imageMap: { [k: string]: string } = {
        "AI與機器學習": "AI_and_ML.jpg",
        "MIS": "MIS.jpg",
        "作業系統": "OS.jpg",
        "基本計概": "Computer_Science.jpg",
        "數位邏輯": "Digital_logic.jpg",
        "程式語言": "Programming_Language.jpg",
        "網路": "Computer_Science.jpg",
        "資料庫": "Database.jpg",
        "資料結構": "Computer_Science.jpg",
        "資訊安全": "Information_Security.jpg",
        "軟體工程與系統開發": "Software_Engineering.jpg",
        "雲端與虛擬化": "Cloud_and_Virtualization.jpg"
      };

      const API_BASE = 'http://localhost:5000';

      this.courses = keypoints.map(kp => {
        const domain = domains.find((d: any) =>
          d.name.includes(kp) ||
          kp.includes(d.name) ||
          d.name.toLowerCase().includes(kp.toLowerCase())
        );

        return {
          keypoint: kp,
          name: domain ? domain.name : kp,
          description: domain ? domain.description : "尚無描述",
          image: `${API_BASE}/static/${imageMap[kp]}`
        };
      });
    });
  }

  loadKeyPoints() {
    this.materialService.getKeyPoints().subscribe({
      next: (res) => {
        this.keyPoints = res.key_points;
      },
      error: (err) => {
        console.error('載入知識點失敗', err);
      }
    });
  }

  goToMaterial(course: CourseData) {
    this.router.navigate(['/dashboard/material', course.keypoint]);
  }

}
