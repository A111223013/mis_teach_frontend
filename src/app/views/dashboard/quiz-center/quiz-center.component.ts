import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  ButtonModule,
  GridModule,
  UtilitiesModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { DashboardService } from '../../../service/dashboard.service';

@Component({
  selector: 'app-quiz-center',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    GridModule,
    UtilitiesModule,
    BadgeModule,
    IconModule
  ],
  template: `
    <div class="quiz-center-container p-4">
      <c-card>
        <c-card-header class="bg-primary text-white">
          <h3 class="mb-0">
            <c-icon name="cilNotes" class="me-2"></c-icon>
            測驗中心
          </h3>
        </c-card-header>
        <c-card-body>
          <div class="mb-4">
            <div class="btn-group w-100 mb-4">
              <button 
                class="btn"
                [class.btn-primary]="activeTab === 'knowledge'"
                [class.btn-outline-primary]="activeTab !== 'knowledge'"
                (click)="activeTab = 'knowledge'">
                知識點測驗
              </button>
              <button 
                class="btn"
                [class.btn-primary]="activeTab === 'pastexam'"
                [class.btn-outline-primary]="activeTab !== 'pastexam'"
                (click)="activeTab = 'pastexam'">
                學校考古題測驗
              </button>
            </div>
            
            <!-- 知識點測驗 -->
            <div *ngIf="activeTab === 'knowledge'">
              <div class="p-3">
                <h5 class="mb-3">知識點測驗</h5>
                <p class="text-muted mb-4">
                  根據特定知識點進行測驗，鞏固理解並查找知識漏洞
                </p>
                
                <c-card class="mb-4 border-info">
                  <c-card-body>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">選擇知識點</h6>
                    </div>
                    
                    <div class="d-flex flex-wrap gap-2 mb-3">
                      <button 
                        *ngFor="let subject of availableSubjects" 
                        class="btn btn-outline-primary" 
                        [class.active]="selectedTopic === subject"
                        (click)="selectedTopic = subject">
                        {{ subject }} 
                        <c-badge *ngIf="selectedTopic === subject" color="primary" shape="rounded-pill" class="ms-2">
                          已選 ({{ getSubjectCount(subject) }}題)
                        </c-badge>
                      </button>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">選擇難度</h6>
                    </div>
                    
                    <div class="d-flex align-items-center gap-2 mb-4">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="difficulty" id="easy" value="easy" [(ngModel)]="selectedDifficulty">
                        <label class="form-check-label" for="easy">簡單</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="difficulty" id="medium" value="medium" [(ngModel)]="selectedDifficulty">
                        <label class="form-check-label" for="medium">中等</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="difficulty" id="hard" value="hard" [(ngModel)]="selectedDifficulty">
                        <label class="form-check-label" for="hard">困難</label>
                      </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">題目數量</h6>
                    </div>
                    
                    <div class="d-flex align-items-center gap-2 mb-4">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="questionCount" id="ten" value="10" [(ngModel)]="questionCount">
                        <label class="form-check-label" for="ten">10題</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="questionCount" id="twenty" value="20" [(ngModel)]="questionCount">
                        <label class="form-check-label" for="twenty">20題</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="questionCount" id="thirty" value="30" [(ngModel)]="questionCount">
                        <label class="form-check-label" for="thirty">30題</label>
                      </div>
                    </div>
                    
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" (click)="startKnowledgeQuiz()" [disabled]="!selectedTopic || !selectedDifficulty || !questionCount">
                        <c-icon name="cilMediaPlay" class="me-2"></c-icon>
                        開始測驗
                      </button>
                    </div>
                  </c-card-body>
                </c-card>
              </div>
            </div>
            
            <!-- 學校考古題測驗 -->
            <div *ngIf="activeTab === 'pastexam'">
              <div class="p-3">
                <h5 class="mb-3">學校考古題測驗</h5>
                <p class="text-muted mb-4">
                  選擇特定學校、年度和系所的考古題進行測驗
                </p>
                
                <c-card class="mb-4 border-info">
                  <c-card-body>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">選擇學校</h6>
                    </div>
                    
                    <div class="mb-3">
                      <select class="form-select" [(ngModel)]="selectedSchool" (ngModelChange)="onSchoolChange()">
                        <option value="">請選擇學校</option>
                        <option *ngFor="let school of availableSchools" [value]="school">{{ school }}</option>
                      </select>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">選擇年度</h6>
                    </div>
                    
                    <div class="mb-3">
                      <select class="form-select" [(ngModel)]="selectedYear" (ngModelChange)="onYearChange()">
                        <option value="">請選擇年度</option>
                        <option *ngFor="let year of availableYears" [value]="year">{{ year }}年</option>
                      </select>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6 class="mb-0">選擇系所</h6>
                    </div>
                    
                    <div class="mb-4">
                      <select class="form-select" [(ngModel)]="selectedDepartment" (ngModelChange)="onDepartmentChange()">
                        <option value="">請選擇系所</option>
                        <option *ngFor="let dept of availableDepartments" [value]="dept">{{ dept }}</option>
                      </select>
                    </div>
                    
                    <div *ngIf="selectedSchool && selectedYear && selectedDepartment && actualQuestionCount > 0" class="alert alert-info mb-4">
                      <div class="d-flex align-items-center">
                        <c-icon name="cilInfo" class="me-2"></c-icon>
                        <span>找到 {{ actualQuestionCount }} 道題目</span>
                      </div>
                    </div>
                    
                    <div *ngIf="selectedSchool && selectedYear && selectedDepartment && actualQuestionCount === 0" class="alert alert-warning mb-4">
                      <div class="d-flex align-items-center">
                        <c-icon name="cilWarning" class="me-2"></c-icon>
                        <span>該條件下沒有找到考題</span>
                      </div>
                    </div>
                    
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" (click)="startPastExamQuiz()" [disabled]="!selectedSchool || !selectedYear || !selectedDepartment || actualQuestionCount === 0">
                        <c-icon name="cilMediaPlay" class="me-2"></c-icon>
                        開始測驗
                      </button>
                    </div>
                  </c-card-body>
                </c-card>
              </div>
            </div>
          </div>
        </c-card-body>
      </c-card>
    </div>
  `,
  styles: [`
    .quiz-center-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .btn.active {
      background-color: #321fdb;
      color: white;
    }
    
    .form-select {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
    
    .alert {
      border-radius: 0.25rem;
    }
  `]
})
export class QuizCenterComponent implements OnInit {
  // 真實資料變數
  availableSubjects: string[] = [];
  availableSchools: string[] = [];
  availableYears: string[] = [];
  availableDepartments: string[] = [];
  examData: any[] = [];
  subjectCountMap: Map<string, number> = new Map();
  
  // 知識點測驗
  selectedTopic: string = '';
  selectedDifficulty: string = 'medium';
  questionCount: string = '20';
  
  // 考古題測驗
  selectedSchool: string = '';
  selectedYear: string = '';
  selectedDepartment: string = '';
  actualQuestionCount: number = 0;
  
  // 控制選項卡
  activeTab: string = 'knowledge';

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
  }

  loadRealData(): void {
    // 使用現有的 DashboardService API 獲取考題資料
    this.dashboardService.get_exam().subscribe({
      next: (response: any) => {
        if (response && response.exams) {
          this.examData = response.exams;
          this.processExamData();
        }
      },
      error: (error: any) => {
        console.error('載入考題資料失敗:', error);
      }
    });
  }

  processExamData(): void {
    // 重置資料
    const subjects = new Set<string>();
    const schools = new Set<string>();
    const years = new Set<string>();
    const departments = new Set<string>();
    this.subjectCountMap.clear();

    // 處理考題資料
    this.examData.forEach(exam => {
      // 收集知識點/科目
      const subject = exam.subject || exam['主要學科'] || '其他';
      if (subject && subject !== '其他') {
        subjects.add(subject);
        this.subjectCountMap.set(subject, (this.subjectCountMap.get(subject) || 0) + 1);
      }

      // 收集學校、年度、系所
      if (exam.school) schools.add(exam.school);
      if (exam.year) years.add(exam.year);
      if (exam.department) departments.add(exam.department);
    });

    // 轉換為陣列並排序
    this.availableSubjects = Array.from(subjects).sort();
    this.availableSchools = Array.from(schools).sort();
    this.availableYears = Array.from(years).sort();
    this.availableDepartments = Array.from(departments).sort();
  }

  getSubjectCount(subject: string): number {
    return this.subjectCountMap.get(subject) || 0;
  }

  onSchoolChange(): void {
    // 清空下拉選項
    this.selectedYear = '';
    this.selectedDepartment = '';
    this.actualQuestionCount = 0;
    
    // 根據選擇的學校篩選年度
    if (this.selectedSchool) {
      const schoolExams = this.examData.filter(exam => exam.school === this.selectedSchool);
      const years = new Set<string>();
      schoolExams.forEach(exam => {
        if (exam.year) years.add(exam.year);
      });
      this.availableYears = Array.from(years).sort();
    } else {
      // 重置為所有年度
      const years = new Set<string>();
      this.examData.forEach(exam => {
        if (exam.year) years.add(exam.year);
      });
      this.availableYears = Array.from(years).sort();
    }
  }

  onYearChange(): void {
    // 清空系所選項
    this.selectedDepartment = '';
    this.actualQuestionCount = 0;
    
    // 根據選擇的學校和年度篩選系所
    if (this.selectedSchool && this.selectedYear) {
      const filteredExams = this.examData.filter(exam => 
        exam.school === this.selectedSchool && exam.year === this.selectedYear
      );
      const departments = new Set<string>();
      filteredExams.forEach(exam => {
        if (exam.department) departments.add(exam.department);
      });
      this.availableDepartments = Array.from(departments).sort();
    }
  }

  onDepartmentChange(): void {
    // 計算實際題目數量
    if (this.selectedSchool && this.selectedYear && this.selectedDepartment) {
      this.actualQuestionCount = this.examData.filter(exam => 
        exam.school === this.selectedSchool && 
        exam.year === this.selectedYear && 
        exam.department === this.selectedDepartment
      ).length;
    } else {
      this.actualQuestionCount = 0;
    }
  }

  // 開始知識點測驗
  startKnowledgeQuiz(): void {
    // 生成一個測驗ID（實際應用中應該從後端獲取）
    const quizId = Math.floor(Math.random() * 1000) + 1;
    
    // 跳轉到測驗頁面
    this.router.navigate(['/dashboard/quiz-taking', quizId], {
      queryParams: {
        type: 'knowledge',
        topic: this.selectedTopic,
        difficulty: this.selectedDifficulty,
        count: this.questionCount
      }
    });
  }

  // 開始考古題測驗
  startPastExamQuiz(): void {
    // 生成一個測驗ID（實際應用中應該從後端獲取）
    const quizId = Math.floor(Math.random() * 1000) + 1;
    
    // 跳轉到測驗頁面
    this.router.navigate(['/dashboard/quiz-taking', quizId], {
      queryParams: {
        type: 'pastexam',
        school: this.selectedSchool,
        year: this.selectedYear,
        department: this.selectedDepartment
      }
    });
  }
}
