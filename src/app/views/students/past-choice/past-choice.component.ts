import { Component, OnInit } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { IconSetService } from '@coreui/icons-angular';
import { DashboardService } from '../../../service/dashboard.service';
import { MathJaxService } from '../../../service/mathjax.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-past-choice',
    imports: [CardComponent, CardImgDirective, CardBodyComponent, CardTitleDirective, CardTextDirective, ButtonDirective, FormsModule, CommonModule],
    templateUrl: './past-choice.component.html',
    styleUrl: './past-choice.component.scss'
})
export class PastChoiceComponent implements OnInit {
  userName: string = '';
  // 下拉選單選

  constructor(
    private iconSetService: IconSetService,
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService,
    private router: Router
  ) {}

  options = [
    { value: 'option1', label: '選項一' },
    { value: 'option2', label: '選項二' },
    { value: 'option3', label: '選項三' }
  ];

  // 當前選擇的值
  selectedOption = this.options[0].value;

  // 處理選擇變更
  onOptionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedOption = selectElement.value;
  }

  // 學校、年度、科目選項
  schools = ['台大', '清大', '交大', '成大'];
  years = ['2022', '2023', '2024'];
  subjects = ['數學', '英文', '物理'];

  // 表單資料
  formData = {
    school: '',
    year: '',
    subject: ''
  };

  ngOnInit(): void {
    // 初始化時呼叫 get_exam
    this.get_exam();
  }

  get_exam(): void {
    this.dashboardService.get_exam().subscribe(
      (data: any) => {
        // 使用 Set 來儲存不重複的值
        const uniqueSchools = new Set<string>();
        const uniqueYears = new Set<string>();
        const uniqueSubjects = new Set<string>();

        // 遍歷所有考試資料
        data.exams.forEach((exam: any) => {
          uniqueSchools.add(exam.school);
          uniqueYears.add(exam.year);
          // 假設 predicted_category 作為科目
          uniqueSubjects.add(exam.predicted_category);
        });

        // 將 Set 轉換為陣列並排序
        this.schools = Array.from(uniqueSchools).sort();
        this.years = Array.from(uniqueYears).sort();
        this.subjects = Array.from(uniqueSubjects).sort();

        console.log('學校列表:', this.schools);
        console.log('年度列表:', this.years);
        console.log('科目列表:', this.subjects);
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }
  // 搜尋按鈕事件
  onSearch() {
    // 這裡可以根據 formData 做查詢
    console.log('搜尋條件：', this.formData);
    this.router.navigate(['/dashboard/students/past-exam'], {
      queryParams: {
        school: this.formData.school,
        year: this.formData.year,
        subject: this.formData.subject
      }
    });
  }
}
