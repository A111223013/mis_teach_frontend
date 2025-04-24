import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { 
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ContainerComponent, HeaderComponent, HeaderNavComponent, 
  NavItemComponent, NavLinkDirective, ButtonDirective, ButtonGroupComponent
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilSpeedometer, cilBook, cilPeople, cilChartPie, cilExitToApp, cilUser, cilTrash, cilSave } from '@coreui/icons';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    FormsModule,
    CardComponent, 
    CardBodyComponent,
    CardHeaderComponent,
    ContainerComponent, 
    HeaderComponent, 
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    IconDirective,
    ButtonDirective,
    ButtonGroupComponent
  ]
})
export class OverviewComponent implements OnInit, AfterViewInit {
  userName: string = "";
  currentDate: Date = new Date();
  
  // 白板相關屬性
  @ViewChild('whiteboardCanvas') whiteboardCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  currentColor: string = '#000';
  brushSize: number = 5;
  private lastX: number = 0;
  private lastY: number = 0;

  constructor(private iconSetService: IconSetService, private loginService: LoginService) { 
    // 註冊圖標
    iconSetService.icons = { 
      cilSpeedometer, cilBook, cilPeople, cilChartPie, cilUser, cilExitToApp, cilTrash, cilSave
    };
  }

  ngOnInit(): void {
    // 初始化
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      console.log('當前使用者email:', userEmail);
      // this.loginService.getUserInfo().subscribe(
      //   response => {
      //   console.log('取得使用者資訊成功', response);
      //   this.userName = response.data.name;
      // },
      // error => {
      //   console.error('傳入錯誤', error);
      // }
      // );
    }
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  // 初始化畫布
  private initCanvas(): void {
    const canvas = this.whiteboardCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // 設置畫布大小
    this.resizeCanvas();
    
    // 監聽視窗大小變化事件
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  // 調整畫布大小
  private resizeCanvas(): void {
    const canvas = this.whiteboardCanvas.nativeElement;
    const container = canvas.parentElement!;
    
    canvas.width = container.clientWidth;
    canvas.height = 400; // 固定高度或使用container.clientHeight
    
    // 設置畫布樣式
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize;
  }

  // 設置繪圖顏色
  setColor(color: string): void {
    this.currentColor = color;
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  }

  // 開始繪圖 (滑鼠事件)
  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    this.lastX = event.clientX - rect.left;
    this.lastY = event.clientY - rect.top;
  }

  // 繪圖 (滑鼠事件)
  draw(event: MouseEvent): void {
    if (!this.isDrawing) return;
    
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
  }

  // 開始繪圖 (觸控事件)
  startDrawingTouch(event: TouchEvent): void {
    event.preventDefault();
    this.isDrawing = true;
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    this.lastX = event.touches[0].clientX - rect.left;
    this.lastY = event.touches[0].clientY - rect.top;
  }

  // 繪圖 (觸控事件)
  drawTouch(event: TouchEvent): void {
    event.preventDefault();
    if (!this.isDrawing) return;
    
    const rect = this.whiteboardCanvas.nativeElement.getBoundingClientRect();
    const currentX = event.touches[0].clientX - rect.left;
    const currentY = event.touches[0].clientY - rect.top;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();
    
    this.lastX = currentX;
    this.lastY = currentY;
  }

  // 停止繪圖
  stopDrawing(): void {
    this.isDrawing = false;
  }

  // 清除畫布
  clearCanvas(): void {
    const canvas = this.whiteboardCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // 儲存圖片
  saveImage(): void {
    const canvas = this.whiteboardCanvas.nativeElement;
    
    // 創建暫時連結
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `白板圖片_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // 模擬點擊下載
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
