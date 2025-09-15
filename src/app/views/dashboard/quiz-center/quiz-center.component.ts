import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { QuizAutomationService } from '../../../service/quiz-automation.service';

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
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private automationService: QuizAutomationService
  ) {}

  ngOnInit(): void {
    this.loadRealData();
    
    // 檢查是否有自動化測驗數據
    setTimeout(() => {
      this.checkForAutomationData();
    }, 1000);
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
      const subject = exam.key_points || exam['主要學科'] || '其他';
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

    this.quizService.createQuiz(quizParams).subscribe({
      next: (response: any) => {
        if (response.quiz_id) {
          // 存储测验数据到服务中
          this.quizService.setCurrentQuizData(response);
          
          // 等待数据存储完成后再跳转
          setTimeout(() => {
            // 直接跳轉到測驗頁面，只传递必要的基本信息
            this.router.navigate(['/dashboard/quiz-taking', response.quiz_id], {
              queryParams: {
                type: 'knowledge',
                topic: this.selectedTopic,
                difficulty: this.selectedDifficulty,
                count: this.questionCount,
                template_id: response.template_id  // 只传递模板ID
              }
            });
          }, 100); // 延迟100ms确保数据存储完成
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

    this.quizService.createQuiz(quizParams).subscribe({
      next: (response: any) => {
        if (response && response.quiz_id) {
          // 存储测验数据到服务中
          this.quizService.setCurrentQuizData(response);
          
          // 等待数据存储完成后再跳转
          setTimeout(() => {
            // 直接跳轉到測驗頁面，只传递必要的基本信息
            const quizUrl = `/dashboard/quiz-taking/${response.quiz_id}`;
            const queryParams = {
              type: 'pastexam',
              school: this.selectedSchool,
              year: this.selectedYear,
              department: this.selectedDepartment,
              template_id: response.template_id  // 只传递模板ID
            };
            
            this.router.navigate([quizUrl], { queryParams });
          }, 100); // 延迟100ms确保数据存储完成
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

  private checkForAutomationData(): void {
    const automationData = localStorage.getItem('quiz_automation_data');
    if (automationData) {
      try {
        const data = JSON.parse(automationData);
        if (data.type === 'university_quiz') {
          this.executeUniversityQuizAutomation(data);
        } else if (data.type === 'knowledge_quiz') {
          this.executeKnowledgeQuizAutomation(data);
        }
        
        // 清除數據，避免重複執行
        localStorage.removeItem('quiz_automation_data');
      } catch (error) {
        console.error('❌ 解析自動化數據失敗:', error);
        localStorage.removeItem('quiz_automation_data');
      }
    }
  }

  private executeUniversityQuizAutomation(data: any): void {
    const { university, department, year } = data;
    
    // 1. 切換到考古題測驗 tab
    const pastexamTab = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('學校考古題測驗'));
    if (pastexamTab) {
      pastexamTab.click();
    } else {
      return;
    }

    // 等待一下讓頁面載入
    setTimeout(() => {
      // 2. 選擇大學
      const schoolSelect = this.automationService.findSelectElement('school');
      if (schoolSelect) {
        const options = Array.from(schoolSelect.options);
        let universityOption = options.find(option => option.value === university);
        if (!universityOption) {
          universityOption = this.automationService.findBestMatch(options, university, 'text') || undefined;
        }
        if (universityOption) {
          this.selectedSchool = universityOption.value;
          this.automationService.selectOption(schoolSelect, universityOption.value, universityOption.text, this.cdr, 'selectedSchool', this);
        } else {
          alert('查無 ' + university + ' 的考題');
          return;
        }
      } else {
        console.log('❌ 找不到大學選擇框');
        return;
      }
      
      // 3. 等待年份選項載入，然後選擇年份 - 使用相似度匹配
      setTimeout(() => {
        // 等待年份選項載入，最多等待5秒
        this.waitForYearOptions(year, department, 0);
      }, 2000);
    }, 1000);
  }

  private executeKnowledgeQuizAutomation(data: any): void {
    const { knowledge_point, difficulty, questionCount } = data;
    
    // 1. 切換到知識點測驗 tab
    const knowledgeTab = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('知識點測驗'));
    if (knowledgeTab) {
      knowledgeTab.click();
    } else {
      return;
    }

    // 等待一下讓頁面載入
    setTimeout(() => {
      // 2. 選擇知識點 - 使用按鈕而不是 select
      const topicButtons = Array.from(document.querySelectorAll('button.btn-outline-primary'));
      const topicButton = topicButtons.find(btn => {
        const text = btn.textContent || '';
        return this.calculateSimilarity(text.toLowerCase(), knowledge_point.toLowerCase()) > 0.3;
      });
      
      if (topicButton) {
        // 設置組件變數並點擊按鈕
        this.selectedTopic = topicButton.textContent || '';
        (topicButton as HTMLButtonElement).click();
      } else {
        return;
      }
      
      // 3. 選擇難度 - 使用 radio button
      const difficultyMap: { [key: string]: string } = {
        'easy': '簡單',
        'medium': '中等', 
        'hard': '困難'
      };
      
      const difficultyText = difficultyMap[difficulty] || difficulty;
      const difficultyRadio = document.querySelector(`input[value="${difficulty}"]`) as HTMLInputElement;
      if (difficultyRadio) {
        // 設置組件變數並點擊 radio button
        this.selectedDifficulty = difficulty;
        difficultyRadio.checked = true;
        difficultyRadio.click();
        difficultyRadio.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        return;
      }
      
      // 4. 選擇題目數量 - 使用 radio button
      const questionCountRadio = document.querySelector(`input[value="${questionCount}"]`) as HTMLInputElement;
      if (questionCountRadio) {
        // 設置組件變數並點擊 radio button
        this.questionCount = questionCount;
        questionCountRadio.checked = true;
        questionCountRadio.click();
        questionCountRadio.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        return;
      }
      
      // 5. 點擊開始測驗
      setTimeout(() => {
        const startButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('開始測驗'));
        if (startButton && !startButton.disabled) {
          startButton.click();
        }
      }, 1000);
    }, 1000);
  }

  private waitForYearOptions(year: number, department: string, attempt: number): void {
    const maxAttempts = 10;
    
    if (attempt >= maxAttempts) {
      return;
    }
    
    const yearSelect = this.automationService.findSelectElement('year');
    
    if (yearSelect && yearSelect.options.length > 1) {
      const options = Array.from(yearSelect.options);
      
      // 調試：顯示前幾個選項
      options.slice(0, 5).forEach((option, index) => {
        console.log(`  [${index}] value: "${option.value}", text: "${option.textContent}"`);
      });
      
      // 首先嘗試直接匹配 value
      let yearOption = options.find(option => option.value === year.toString());
      if (yearOption) {
      } else {
        // 如果 value 不匹配，嘗試匹配 textContent
        yearOption = this.automationService.findBestMatch(options, year.toString(), 'text') || undefined;
        if (yearOption) {
          console.log(`🎯 通過 textContent 匹配: "${yearOption.textContent}"`);
        }
      }
      
      if (yearOption) {
        this.selectedYear = yearOption.value;
        this.automationService.selectOption(yearSelect, yearOption.value, yearOption.text, this.cdr, 'selectedYear', this);
        
        // 等待系所選項載入 - 增加等待時間
        
        // 手動觸發年份選擇的 change 事件，確保後端載入系所選項
        setTimeout(() => {
          const changeEvent = new Event('change', { bubbles: true });
          yearSelect.dispatchEvent(changeEvent);
          
          // 再等待一下讓系所選項載入
          setTimeout(() => {
            this.waitForDepartmentOptions(department, 0);
          }, 1000);
        }, 3000);
      } else {
        alert('查無 ' + year + ' 年的考題');
      }
    } else {
      setTimeout(() => {
        this.waitForYearOptions(year, department, attempt + 1);
      }, 500);
    }
  }

  private waitForDepartmentOptions(department: string, attempt: number): void {
    const maxAttempts = 20; // 最多嘗試20次，每次1秒，總共20秒
    
    if (attempt >= maxAttempts) {
      return;
    }
    
    const deptSelect = this.automationService.findSelectElement('department');
    
    if (deptSelect) {
      console.log(`🔍 找到系所選擇器，選項數量: ${deptSelect.options.length}`);
    } else {
      console.log('❌ 找不到系所選擇器');
    }
    
    if (deptSelect && deptSelect.options.length > 1) { // 有選項（除了預設的"請選擇系所"）
      const options = Array.from(deptSelect.options);
      // 首先嘗試直接匹配 value，然後嘗試 textContent
      let deptOption = options.find(option => option.value === department);
      if (!deptOption) {
        deptOption = this.automationService.findBestMatch(options, department, 'text') || undefined;
      }
      if (deptOption) {
        this.selectedDepartment = deptOption.value;
        this.automationService.selectOption(deptSelect, deptOption.value, deptOption.text, this.cdr, 'selectedDepartment', this);
        
        // 選擇系所後，等待題目數量載入，然後點擊開始測驗
        setTimeout(() => {
          const startButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('開始測驗'));
          if (startButton && !startButton.disabled) {
            startButton.click();
          } else {
            console.log('❌ 找不到開始測驗按鈕或按鈕被禁用');
          }
        }, 2000);
      } else {
        alert('查無 ' + department + ' 的考題，請選擇相近的系所');
        return;
      }
    } else {
      setTimeout(() => {
        this.waitForDepartmentOptions(department, attempt + 1);
      }, 1000);
    }
  }

  private findBestMatch(options: HTMLOptionElement[], target: string, property: string): HTMLOptionElement | null {
    if (!options || options.length === 0) return null;
    
    let bestMatch: HTMLOptionElement | null = null;
    let bestScore = 0;
    
    
    for (const option of options) {
      const text = (option as any)[property] || option.textContent || '';
      if (!text) continue;
      
      // 計算相似度分數
      const score = this.calculateSimilarity(text.toLowerCase(), target.toLowerCase());
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = option;
      }
    }
    
    // 如果相似度太低，返回 null（降低閾值以支持年份匹配）
    if (bestScore < 0.2) {
      return null;
    }
    
    return bestMatch;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // 完全匹配
    if (str1 === str2) return 1.0;
    
    // 包含匹配
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;
    
    // 特殊處理年份：提取數字部分進行比較
    const extractNumbers = (str: string) => str.replace(/\D/g, '');
    const num1 = extractNumbers(str1);
    const num2 = extractNumbers(str2);
    
    if (num1 && num2 && num1 === num2) {
      return 0.9; // 數字部分相同，高相似度
    }
    
    // 計算編輯距離相似度
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    
    if (maxLength === 0) return 0;
    
    return 1 - (distance / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

}
