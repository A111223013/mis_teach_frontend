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
import { QuizService } from '../../../service/quiz.service';
import { AuthService } from '../../../service/auth.service';

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
  templateUrl: './quiz-center.component.html',
  styleUrls: ['./quiz-center.component.css']
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
    private quizService: QuizService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
  }

  loadRealData(): void {
    this.quizService.getExams().subscribe({
      next: (response: any) => {
        if (response && response.exams) {
          this.examData = response.exams;
          this.processExamData();
        }
      },
      error: (error: any) => {
        console.error('載入考題資料失敗:', error);
        // AuthService會自動處理401錯誤
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
    const quizParams = {
      type: 'knowledge',
      topic: this.selectedTopic,
      difficulty: this.selectedDifficulty,
      count: this.questionCount
    };

    console.log('🎯 創建知識點測驗:', quizParams);

    this.quizService.createQuiz(quizParams).subscribe({
      next: (response: any) => {
        console.log('✅ 測驗創建成功:', response);
        if (response.quiz_id) {
          // 直接跳轉到測驗頁面
          this.router.navigate(['/dashboard/quiz-taking', response.quiz_id], {
            queryParams: {
              type: 'knowledge',
              topic: this.selectedTopic,
              difficulty: this.selectedDifficulty,
              count: this.questionCount
            }
          });
        } else {
          alert('測驗創建失敗：未獲得測驗ID');
        }
      },
      error: (error: any) => {
        console.error('❌ 創建測驗失敗:', error);
        if (error.status === 404) {
          alert('找不到符合條件的題目，請嘗試其他選擇');
        } else {
          alert(error.error?.message || '創建測驗失敗，請稍後再試');
        }
      }
    });
  }

  // 開始考古題測驗
  startPastExamQuiz(): void {
    if (!this.selectedSchool || !this.selectedYear || !this.selectedDepartment) {
      alert('請選擇學校、年度和系所');
      return;
    }

    const quizParams = {
      type: 'pastexam',
      school: this.selectedSchool,
      year: this.selectedYear,
      department: this.selectedDepartment
    };

    console.log('🎯 創建考古題測驗:', quizParams);

    this.quizService.createQuiz(quizParams).subscribe({
      next: (response: any) => {
        console.log('✅ 考古題測驗創建成功:', response);
        
        if (response && response.quiz_id) {
          // 直接跳轉到測驗頁面
          const quizUrl = `/dashboard/quiz-taking/${response.quiz_id}`;
          const queryParams = {
            type: 'pastexam',
            school: this.selectedSchool,
            year: this.selectedYear,
            department: this.selectedDepartment
          };
          
          console.log('🔄 導覽到測驗頁面:', quizUrl);
          this.router.navigate([quizUrl], { queryParams });
        } else {
          alert('測驗創建失敗：無效的回應格式');
        }
      },
      error: (error: any) => {
        console.error('❌ 創建考古題測驗失敗:', error);
        if (error.status === 404) {
          alert('找不到符合條件的考題，請嘗試其他選擇');
        } else {
          alert(error.error?.message || '創建測驗失敗，請稍後再試');
        }
      }
    });
  }
}
