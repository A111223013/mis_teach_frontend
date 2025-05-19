import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ContainerComponent, 
  ProgressBarComponent, ProgressComponent,
  RowComponent, ColComponent,
  ListGroupModule,
  TableModule
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilSpeedometer, cilBook, cilPeople, cilChartPie, cilExitToApp, cilUser } from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    CardComponent, 
    CardBodyComponent,
    CardHeaderComponent,
    ContainerComponent, 
    IconDirective,
    BaseChartDirective,
    ProgressBarComponent,
    ProgressComponent,
    RowComponent,
    ColComponent,
    ListGroupModule,
    TableModule
  ]
})
export class OverviewComponent implements OnInit, AfterViewInit {
  userName: string = "";
  currentDate: Date = new Date();
  
  overallCompletionPercentage = 75;
  completedQuestions = 1500;
  totalAvailableQuestions = 2000;

  subjectAccuracyChartData: ChartData<'bar'> = {
    labels: [ '資料庫', '網路', '系統分析', '資料結構', 'MIS導論', '統計學' ],
    datasets: [
      { 
        data: [ 65, 59, 80, 81, 56, 90 ], 
        label: '正確率 (%)', 
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + '%';
            }
            return label;
          }
        }
      }
    }
  };

  weakestSubjects = [
    { name: '系統分析', accuracy: 56 },
    { name: '計算機網路', accuracy: 59 },
  ];

  recentAttempts = [
    { title: '112年 台大資管 網路', date: new Date(Date.now() - 86400000), accuracy: 70 },
    { title: '111年 清大資工 資料庫', date: new Date(Date.now() - 2 * 86400000), accuracy: 85 },
    { title: '110年 政大資管 MIS導論', date: new Date(Date.now() - 5 * 86400000), accuracy: 60 }
  ];

  // --- Demo Data (Focused on Computer Science) --- 
  
  // CS Overall Progress
  csProgressPercentage = 60; 
  csCompletedQuestions = 900;
  csTotalQuestions = 1500;

  // CS Sub-Topic Accuracy (Replaces general subject accuracy)
  csSubTopicAccuracyData: ChartData<'bar'> = {
    labels: [ '作業系統', '資料結構', '網路基礎', '計算機組織', '數位邏輯', '演算法' ],
    datasets: [
      { 
        data: [ 70, 55, 65, 75, 85, 50 ], 
        label: '正確率 (%)', 
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // CS Accuracy Trend
  csAccuracyTrendData: ChartData<'line'> = {
    labels: ['5日前', '4日前', '3日前', '2日前', '昨日', '今日'], // Example time labels
    datasets: [
      {
        label: '計概正確率趨勢 (%)',
        data: [58, 62, 60, 65, 63, 68],
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // Red
        tension: 0.1
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false, // Trend might not start at 0
        suggestedMin: 40,
        suggestedMax: 100,
        ticks: { callback: value => value + '%' }
      }
    },
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: { callbacks: { label: context => `${context.dataset.label}: ${context.parsed.y}%` } }
    }
  };

  // CS Common Mistakes (Derived from weakest sub-topics)
  csCommonMistakes = [
    { name: '演算法 (時間複雜度)', accuracy: 50 },
    { name: '資料結構 (樹)', accuracy: 55 },
    { name: '網路基礎 (TCP/IP)', accuracy: 65 },
  ];

  // --- NEW Demo Data ---

  // Performance by School/Year (Grouped Bar Chart)
  schoolYearAccuracyData: ChartData<'bar'> = {
    labels: ['112年', '111年', '110年'], // Example Years
    datasets: [
      { 
        label: '台大', 
        data: [75, 70, 65], 
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1 
      },
      { 
        label: '清大', 
        data: [68, 72, 70], 
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1 
      },
      { 
        label: '交大', 
        data: [60, 65, 75], 
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Teal
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1 
      }
    ]
  };

  // Answering Time Analysis (Table Data)
  answeringTimeData = [
    { subject: '作業系統', avgTime: '1m 30s', targetTime: '1m 15s', status: 'warning' },
    { subject: '資料結構', avgTime: '2m 05s', targetTime: '1m 45s', status: 'danger' },
    { subject: '網路基礎', avgTime: '1m 10s', targetTime: '1m 20s', status: 'success' },
    { subject: '計算機組織', avgTime: '1m 50s', targetTime: '1m 40s', status: 'warning' },
    { subject: '數位邏輯', avgTime: '0m 55s', targetTime: '1m 00s', status: 'success' },
    { subject: '演算法', avgTime: '2m 30s', targetTime: '2m 15s', status: 'danger' },
  ];

  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService
  ) { 
    iconSetService.icons = { cilUser };
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderMathSymbols();
    }, 500);
  }

  getUserInfo(): void {
    this.dashboardService.getUserInfo().subscribe(
      (data: any) => {
        this.userName = data.name;
      },
      (error: any) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  private renderMathSymbols(): void {
    const mathContainer = document.querySelector('.math-container');
    if (mathContainer) {
      this.mathJaxService.renderMathInElement(mathContainer as HTMLElement);
    }
  }
}
