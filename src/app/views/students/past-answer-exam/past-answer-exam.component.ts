import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../service/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective,
  FormModule,
  GridModule,
  NavModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { MathJaxService } from '../../../service/mathjax.service';

@Component({
  selector: 'app-past-answer-exam',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CardComponent, 
    CardBodyComponent, 
    CardTitleDirective, 
    CardTextDirective, 
    CardImgDirective, 
    ButtonDirective,
    FormModule,
    GridModule,
    TabsModule,
    NavModule,
    IconModule
  ],
  templateUrl: './past-answer-exam.component.html',
  styleUrl: './past-answer-exam.component.scss'
})
export class PastAnswerExamComponent {

  constructor(
    private route: ActivatedRoute, 
    private dashboardService: DashboardService,
    private router: Router,
    private mathJaxService: MathJaxService
  ) {}

  searchParams = {
    school: '',
    year: '',
    subject: '',
    department: ''
  };

  examData: any[] = [];
  filteredExams: any[] = [];
  
  // 題目類型統計
  examStats = {
    'single-choice': 0,
    'multiple-choice': 0,
    'true-false': 0,
    'short-answer': 0,
    'long-answer': 0,
    'coding-answer': 0
  };

  // 獲取題型統計數量的安全方法
  getExamStatCount(type: string): number {
    return (this.examStats as any)[type] || 0;
  }

  // 檢查題型是否有題目
  hasExamsOfType(type: string): boolean {
    return this.getExamStatCount(type) > 0;
  }

  // 當前選擇的題型和題目
  currentType: string = 'single-choice';
  currentQuestion: any = null;
  currentIndex: number = 0;
  
  // 使用者答案
  userAnswers: { [key: string]: any } = {};
  
  // 選擇題選項
  choiceOptions = ['a', 'b', 'c', 'd'];

  ngOnInit(): void {
    // 訂閱路由參數的變化
    this.route.queryParams.subscribe(params => {
      this.searchParams.school = params['school'] || '';
      this.searchParams.year = params['year'] || '';
      this.searchParams.subject = params['subject'] || '';
      this.searchParams.department = params['department'] || '';

      // 輸出收到的參數
      console.log('過去考題收到的搜尋條件：', this.searchParams);
      
      // 獲取考題資料
      this.get_exam_to_object();
    });
  }

  get_exam_to_object(): void {
    this.dashboardService.get_exam_to_object(this.searchParams.school, this.searchParams.year, this.searchParams.subject).subscribe(
      (data: any) => {
        console.log('獲取的考題資料:', data);
        let exams = data.exams || [];
        
        // 如果有選擇系所，進行前端過濾
        if (this.searchParams.department) {
          exams = exams.filter((exam: any) => exam.department === this.searchParams.department);
          console.log('根據系所過濾後的考題資料:', exams);
        }
        
        this.examData = exams;
        
        // 統計各類型題目數量
        this.countExamsByType();
        
        // 預設顯示第一種有題目的類型
        this.selectFirstAvailableType();
        
        // 等待 DOM 更新後渲染數學公式
        setTimeout(() => {
          this.mathJaxService.renderMath('');
        }, 100);
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }
  
  // 統計各類型題目數量
  countExamsByType(): void {
    // 重置計數
    for (const key in this.examStats) {
      this.examStats[key as keyof typeof this.examStats] = 0;
    }
    
    // 計算各類型題目數量
    this.examData.forEach(exam => {
      if (this.examStats.hasOwnProperty(exam.type)) {
        this.examStats[exam.type as keyof typeof this.examStats]++;
      }
    });
    
    console.log('題目類型統計:', this.examStats);
  }
  
  // 選擇第一個有題目的類型
  selectFirstAvailableType(): void {
    for (const type in this.examStats) {
      if (this.examStats[type as keyof typeof this.examStats] > 0) {
        this.filterExamsByType(type);
        break;
      }
    }
  }
  
  // 根據類型篩選題目
  filterExamsByType(type: string): void {
    this.currentType = type;
    this.filteredExams = this.examData.filter(exam => exam.type === type);
    
    // 按照題號排序
    this.filteredExams.sort((a, b) => {
      // 將題號轉換為數字進行排序
      const numA = parseInt(a.question_number);
      const numB = parseInt(b.question_number);
      return numA - numB;
    });
    
    // 顯示第一題
    if (this.filteredExams.length > 0) {
      this.currentIndex = 0;
      this.showQuestion(0);
    } else {
      this.currentQuestion = null;
    }
  }
  
  // 顯示指定索引的題目
  showQuestion(index: number): void {
    if (index >= 0 && index < this.filteredExams.length) {
      this.currentIndex = index;
      this.currentQuestion = this.filteredExams[index];
      
      // 如果還沒有該題的答案，初始化
      const questionId = this.currentQuestion.id;
      if (!this.userAnswers[questionId]) {
        // 根據題型初始化不同的答案格式
        switch (this.currentQuestion.type) {
          case 'multiple-choice':
            this.userAnswers[questionId] = [];
            break;
          case 'true-false':
            this.userAnswers[questionId] = null;
            break;
          case 'single-choice':
            this.userAnswers[questionId] = '';
            break;
          default:
            this.userAnswers[questionId] = '';
            break;
        }
      }
      
      // 渲染數學公式
      setTimeout(() => {
        this.mathJaxService.renderMath('');
      }, 100);
    }
  }
  
  // 提交答案
  submitAnswers(): void {
    // 創建格式化的答案物件
    const formattedAnswers = [];
    
    // 遍歷所有答案
    for (const questionId in this.userAnswers) {
      if (this.userAnswers.hasOwnProperty(questionId)) {
        // 查找對應的題目以獲取完整資訊
        const question = this.examData.find(exam => exam.id === questionId);
        if (question) {
          formattedAnswers.push({
            question_number: question.question_number,
            type: question.type,
            answer: this.userAnswers[questionId],
            school: question.school,
            subject: question.predicted_category,
            year: question.year,
            question_text: question.question_text,
            options: question.options
          });
        }
      }
    }
    
    console.log('提交的格式化答案:', formattedAnswers);
    
    // 調用 API 提交答案
    this.dashboardService.submitAnswers(formattedAnswers).subscribe(
      (response: any) => {
        console.log('答案提交成功:', response);

        // 提交後返回選擇頁面
        this.router.navigate(['/dashboard/students/past-choice']);
      },
      (error: any) => {
        console.error('答案提交失敗:', error);
    
      }
    );
  }
  
  // 切換到下一題
  nextQuestion(): void {
    if (this.currentIndex < this.filteredExams.length - 1) {
      this.showQuestion(this.currentIndex + 1);
    }
  }
  
  // 切換到上一題
  prevQuestion(): void {
    if (this.currentIndex > 0) {
      this.showQuestion(this.currentIndex - 1);
    }
  }
  
  // 多選題切換選項
  toggleMultipleChoice(optionIndex: number): void {
    const questionId = this.currentQuestion.id;
    if (!this.userAnswers[questionId]) {
      this.userAnswers[questionId] = [];
    }
    
    const option = this.choiceOptions[optionIndex];
    const index = this.userAnswers[questionId].indexOf(option);
    
    if (index === -1) {
      this.userAnswers[questionId].push(option);
    } else {
      this.userAnswers[questionId].splice(index, 1);
    }
  }
  
  // 檢查多選題選項是否已選
  isMultipleChoiceSelected(optionIndex: number): boolean {
    const questionId = this.currentQuestion?.id;
    if (!questionId || !this.userAnswers[questionId]) {
      return false;
    }
    
    const option = this.choiceOptions[optionIndex];
    return this.userAnswers[questionId].includes(option);
  }
}