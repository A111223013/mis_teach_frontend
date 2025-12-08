import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router  } from '@angular/router';
import { MaterialService } from '../../../service/material.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


interface CourseData {
  keypoint: string;     // keypoint 名稱
  name: string;         // domain name
  description: string;  // domain description
  image: string;        // 圖片路徑（可以是 URL 或 Blob URL）
  imageUrl?: string;    // 原始圖片 URL（用於載入）
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

export class CoursesComponent implements OnInit, OnDestroy {
  keyPoints: string[] = [];
  courses: CourseData[] = [];
  imageLoadStates: Map<string, boolean> = new Map(); // 追蹤圖片載入狀態

  constructor(
    private router: Router, 
    private materialService: MaterialService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCourses();
    this.loadKeyPoints();
  }

  loadCourses() {
    this.materialService.getDomains().subscribe(domains => {
      // 標準知識點列表（11個，對應 MongoDB domain 集合）
      const keypoints = [
        "AI與機器學習",
        "管理資訊系統",
        "作業系統",
        "數學與統計",
        "數位邏輯",
        "電腦網路",
        "資料庫",
        "資料結構",
        "資訊安全",
        "軟體工程與系統開發",
        "雲端與虛擬化"
      ];

      // 知識點名稱映射（前端顯示名稱 -> 資料庫 domain 名稱）
      const keypointMapping: { [k: string]: string } = {
        "管理資訊系統": "管理資訊系統（MIS）",
        "電腦網路": "電腦網路（Computer Network）"
      };

      const imageMap: { [k: string]: string } = {
        "AI與機器學習": "AI_and_ML.jpg",
        "管理資訊系統": "MIS.jpg",
        "作業系統": "OS.jpg",
        "數學與統計": "Math.jpg",
        "數位邏輯": "Digital_logic.jpg",
        "電腦網路": "Computer_Science.jpg",
        "資料庫": "Database.jpg",
        "資料結構": "Computer_Science.jpg",
        "資訊安全": "Information_Security.jpg",
        "軟體工程與系統開發": "Software_Engineering.jpg",
        "雲端與虛擬化": "Cloud_and_Virtualization.jpg"
      };

      this.courses = keypoints.map(kp => {
        // 使用映射表查找對應的 domain 名稱，如果沒有則使用原始名稱
        const searchName = keypointMapping[kp] || kp;
        
        // 查找對應的 domain
        const domain = domains.find((d: any) => {
          const domainName = d.name || '';
          return domainName.includes(searchName) ||
                 searchName.includes(domainName) ||
                 domainName.toLowerCase().includes(searchName.toLowerCase()) ||
                 searchName.toLowerCase().includes(domainName.toLowerCase());
        });

        // 構建圖片 URL
        const imageFileName = imageMap[kp];
        const imageUrl = `${environment.apiBaseUrl}/static/${imageFileName}`;
        
        // 調試信息
        if (!imageFileName) {
          console.warn(`⚠️ 知識點 "${kp}" 沒有對應的圖片文件名`);
        } else {
          console.log(`📷 知識點 "${kp}": ${imageUrl}`);
        }

        return {
          keypoint: kp,
          name: domain ? domain.name : kp,
          description: domain ? domain.description : "尚無描述",
          image: '', // 先設為空，稍後載入
          imageUrl: imageUrl // 保存原始 URL
        };
      });
      
      console.log('✅ 課程列表載入完成，共', this.courses.length, '個課程');
      
      // 載入所有圖片
      this.loadAllImages();
    });
  }

  loadAllImages() {
    this.courses.forEach(course => {
      if (course.imageUrl) {
        this.loadImageAsBlob(course);
      }
    });
  }

  loadImageAsBlob(course: CourseData) {
    if (!course.imageUrl) return;
    
    // 檢查是否已經載入
    if (this.imageLoadStates.get(course.imageUrl)) {
      return;
    }
    
    this.imageLoadStates.set(course.imageUrl, false);
    
    // 使用 HttpClient 載入圖片（會經過 ngrok 攔截器）
    this.http.get(course.imageUrl, { 
      responseType: 'blob',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    }).subscribe({
      next: (blob) => {
        // 檢查 Blob 類型
        if (!blob || blob.size === 0) {
          console.warn(`⚠️ 圖片 Blob 為空: ${course.name}`, course.imageUrl);
          course.image = course.imageUrl || '';
          this.imageLoadStates.set(course.imageUrl!, false);
          this.cdr.detectChanges();
          return;
        }
        
        // 檢查是否為圖片類型
        if (blob.type && !blob.type.startsWith('image/')) {
          console.warn(`⚠️ 非圖片類型: ${course.name}`, {
            type: blob.type,
            size: blob.size,
            url: course.imageUrl
          });
        } else if (!blob.type) {
          console.warn(`⚠️ Blob 類型未設定: ${course.name}`, {
            size: blob.size,
            url: course.imageUrl
          });
        }
        
        // 創建 Blob URL
        const blobUrl = URL.createObjectURL(blob);
        course.image = blobUrl;
        this.imageLoadStates.set(course.imageUrl!, true);
        console.log(`✅ 圖片載入成功: ${course.name}`, {
          imageUrl: course.imageUrl,
          blobType: blob.type,
          blobSize: blob.size,
          blobUrl: blobUrl
        });
        // 手動觸發變更偵測
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`❌ 圖片載入失敗: ${course.name}`, {
          imageUrl: course.imageUrl,
          error: err,
          status: err.status,
          statusText: err.statusText,
          message: err.message
        });
        // 載入失敗時，嘗試直接使用原始 URL（作為備用）
        course.image = course.imageUrl || '';
        this.imageLoadStates.set(course.imageUrl!, false);
        // 手動觸發變更偵測
        this.cdr.detectChanges();
      }
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

  onImageError(event: any, course: CourseData) {
    console.error(`❌ 圖片顯示失敗: ${course.name}`, {
      imageUrl: course.image,
      originalUrl: course.imageUrl,
      error: event
    });
    // 如果 Blob URL 失敗，嘗試使用原始 URL
    if (course.imageUrl && course.image.startsWith('blob:')) {
      course.image = course.imageUrl;
    } else {
      event.target.style.display = 'none';
    }
  }

  onImageLoad(event: any, course: CourseData) {
    console.log(`✅ 圖片顯示成功: ${course.name}`, course.image);
  }

  ngOnDestroy() {
    // 清理 Blob URL 以釋放記憶體
    this.courses.forEach(course => {
      if (course.image && course.image.startsWith('blob:')) {
        URL.revokeObjectURL(course.image);
      }
    });
  }

}
