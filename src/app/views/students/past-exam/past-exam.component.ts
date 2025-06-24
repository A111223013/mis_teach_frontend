import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../service/dashboard.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-past-exam',
    imports: [CommonModule],
    templateUrl: './past-exam.component.html',
    standalone: true,
    styleUrl: './past-exam.component.scss'
})
export class PastExamComponent implements OnInit {
  // 儲存從 URL 參數獲得的搜尋條件
  searchParams = {
    school: '',
    year: '',
    subject: ''
  };
  
  // 儲存從 API 獲取的考題資料
  examData: any[] = [];
  
  // 圖片展開相關屬性
  expandedImageIndex: number = -1; // 當前展開的圖片索引，-1 表示沒有展開的圖片
  
  // 圖片縮放相關屬性
  imageZoomLevel: number = 1;
  isImageZoomed: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // 訂閱路由參數的變化
    this.route.queryParams.subscribe(params => {
      this.searchParams.school = params['school'] || '';
      this.searchParams.year = params['year'] || '';
      this.searchParams.subject = params['subject'] || '';
      
      // 輸出收到的參數
      console.log('過去考題收到的搜尋條件：', this.searchParams);
    });
    this.get_exam_to_object();
  }

  
  get_exam_to_object(): void {
    this.dashboardService.get_exam_to_object(this.searchParams.school, this.searchParams.year, this.searchParams.subject).subscribe(
      (data: any) => {
       console.log(data);
       this.examData = data.exams || [];
       // 處理圖片資料
       this.processImageData();
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }

  /**
   * 處理考題中的圖片資料，將 base64 轉換為可用的 URL
   */
  processImageData(): void {
    this.examData.forEach(exam => {
      if (exam.images && exam.images.length > 0) {
        exam.processedImages = exam.images.map((img: any) => ({
          filename: img.filename,
          safeUrl: this.createImageUrl(img.data)
        }));
      }
    });
  }

  /**
   * 將 base64 圖片資料轉換為安全的 URL
   */
  createImageUrl(base64Data: string): SafeUrl {
    const imageUrl = `data:image/png;base64,${base64Data}`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  /**
   * 取得圖片的全域索引（因為有多個考題，每個考題可能有多張圖片）
   */
  getImageIndex(exam: any, imageIndex: number): number {
    // 找到考題在 examData 中的索引
    const examIndex = this.examData.findIndex(e => e === exam);
    // 返回一個唯一的圖片索引
    return examIndex * 1000 + imageIndex;
  }

  /**
   * 切換圖片展開狀態
   */
  toggleImageExpansion(imageIndex: number): void {
    console.log('🖼️ Toggling image expansion for index:', imageIndex);
    
    if (this.expandedImageIndex === imageIndex) {
      // 如果當前圖片已展開，則收起
      this.expandedImageIndex = -1;
      this.imageZoomLevel = 1;
      this.isImageZoomed = false;
      console.log('📦 Image collapsed');
    } else {
      // 展開指定圖片
      this.expandedImageIndex = imageIndex;
      this.imageZoomLevel = 1.5; // 預設放大到 150%
      this.isImageZoomed = true;
      console.log('🔍 Image expanded to 150%');
    }
  }

  /**
   * 縮放圖片
   */
  zoomImage(direction: 'in' | 'out', event?: Event): void {
    if (event) {
      event.stopPropagation(); // 防止觸發圖片點擊事件
    }
    
    const oldLevel = this.imageZoomLevel;
    
    if (direction === 'in') {
      this.imageZoomLevel = Math.min(this.imageZoomLevel + 0.25, 3);
    } else {
      this.imageZoomLevel = Math.max(this.imageZoomLevel - 0.25, 0.5);
    }
    
    this.isImageZoomed = this.imageZoomLevel !== 1;
    
    console.log(`🔍 Zoom ${direction}: ${oldLevel.toFixed(2)} → ${this.imageZoomLevel.toFixed(2)} (${(this.imageZoomLevel * 100).toFixed(0)}%)`);
  }

  /**
   * 重置圖片縮放
   */
  resetImageZoom(event?: Event): void {
    if (event) {
      event.stopPropagation(); // 防止觸發圖片點擊事件
    }
    
    console.log('🔄 Reset image zoom');
    const oldLevel = this.imageZoomLevel;
    this.imageZoomLevel = 1;
    this.isImageZoomed = false;
    
    console.log(`🔄 Reset: ${oldLevel.toFixed(2)} → ${this.imageZoomLevel.toFixed(2)}`);
  }

  /**
   * 開啟原圖在新視窗
   */
  openImageInNewTab(image: any, event?: Event): void {
    if (event) {
      event.stopPropagation(); // 防止觸發圖片點擊事件
    }
    
    if (image && image.safeUrl) {
      // 將 SafeUrl 轉換為字串
      const imageUrl = image.safeUrl.changingThisBreaksApplicationSecurity || image.safeUrl;
      window.open(imageUrl, '_blank');
      console.log('🗗 Opened image in new tab');
    }
  }
}
