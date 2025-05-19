import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../service/dashboard.service';
@Component({
  selector: 'app-past-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-exam.component.html',
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

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService) {}

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
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }
}
