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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    private mathJaxService: MathJaxService,
    private domSanitizer: DomSanitizer
  ) {}

  searchParams = {
    school: '',
    year: '',
    subject: '',
    department: ''
  };

  examData: any[] = [];
  
  // 當前選擇的題目
  currentQuestion: any = null;
  currentIndex: number = 0;
  
  // 使用者答案
  userAnswers: { [key: string]: any } = {};
  
  // 標記的題目
  flaggedQuestions: { [key: string]: boolean } = {};
  
  // 選擇題選項
  choiceOptions = ['a', 'b', 'c', 'd'];
  
  // 圖片展開相關屬性
  expandedImageIndex: number = -1; // 當前展開的圖片索引，-1 表示沒有展開的圖片
  
  // 圖片縮放相關屬性
  imageZoomLevel: number = 1;
  isImageZoomed: boolean = false;

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

    // 監聽答案變更（用於 debug）
    this.onAnswerChange = this.onAnswerChange.bind(this);
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
        
        // 按照題號排序所有題目
        exams.sort((a: any, b: any) => {
          const numA = parseInt(a.question_number) || 0;
          const numB = parseInt(b.question_number) || 0;
          return numA - numB;
        });
        
        // 為每個題目確保有唯一的 ID
        exams.forEach((exam: any, index: number) => {
          // 總是創建一個基於索引的唯一 ID，這樣可以確保每個題目都有不同的 ID
          const originalId = exam.id || exam._id;
          exam.id = `question_${index}_${exam.school || 'unknown'}_${exam.year || 'unknown'}_${exam.question_number || index}`;
          
          console.log(`題目 ${index + 1} - 原始ID: ${originalId}, 新ID: ${exam.id}`);
          console.log(`題目內容:`, {
            question_number: exam.question_number,
            school: exam.school,
            department: exam.department,
            type: exam.type,
            question_text: exam.question_text?.substring(0, 50) + '...'
          });
        });
        
        this.examData = exams;
        
        // 處理圖片資料
        this.processImageData();
        
        // 如果有題目，顯示第一題
        if (this.examData.length > 0) {
          this.currentIndex = 0;
          this.showQuestion(0);
        } else {
          this.currentQuestion = null;
        }
        
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
  
  // 顯示指定索引的題目
  showQuestion(index: number): void {
    if (index >= 0 && index < this.examData.length) {
      this.currentIndex = index;
      this.currentQuestion = this.examData[index];
      
      // 如果還沒有該題的答案，初始化
      const questionId = this.currentQuestion.id;
      
      console.log(`🔍 顯示題目 ${index + 1}, ID: ${questionId}, 題型: ${this.currentQuestion.type}`);
      console.log(`📝 目前所有答案:`, this.userAnswers);
      
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
        console.log(`✨ 初始化題目 ${questionId} 的答案:`, this.userAnswers[questionId]);
      } else {
        console.log(`📋 題目 ${questionId} 已有答案:`, this.userAnswers[questionId]);
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
    if (this.currentIndex < this.examData.length - 1) {
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
    console.log(`🔘 多選題切換選項 - 題目ID: ${questionId}, 選項索引: ${optionIndex}`);
    
    if (!this.userAnswers[questionId]) {
      this.userAnswers[questionId] = [];
    }
    
    const option = this.choiceOptions[optionIndex];
    const index = this.userAnswers[questionId].indexOf(option);
    
    if (index === -1) {
      this.userAnswers[questionId].push(option);
      console.log(`✅ 新增選項 ${option} 到題目 ${questionId}`);
    } else {
      this.userAnswers[questionId].splice(index, 1);
      console.log(`❌ 移除選項 ${option} 從題目 ${questionId}`);
    }
    
    console.log(`📝 題目 ${questionId} 目前答案:`, this.userAnswers[questionId]);
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

  // 獲取題型顯示名稱
  getTypeDisplayName(type: string): string {
    const typeNames: { [key: string]: string } = {
      'single-choice': '單選題',
      'multiple-choice': '多選題',
      'true-false': '是非題',
      'short-answer': '簡答題',
      'long-answer': '長答題',
      'coding-answer': '程式設計題'
    };
    return typeNames[type] || type;
  }

  // 獲取已作答題目數量
  getAnsweredCount(): number {
    return this.examData.filter(exam => this.isQuestionAnswered(exam.id)).length;
  }

  // 獲取已標記題目數量
  getFlaggedCount(): number {
    return Object.values(this.flaggedQuestions).filter(flag => flag).length;
  }

  // 檢查題目是否已作答
  isQuestionAnswered(questionId: string): boolean {
    const answer = this.userAnswers[questionId];
    if (answer === null || answer === undefined || answer === '') {
      return false;
    }
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    if (typeof answer === 'object') {
      return Object.values(answer).some(value => value === true);
    }
    return true;
  }

  // 切換標記狀態
  toggleFlag(questionId: string): void {
    this.flaggedQuestions[questionId] = !this.flaggedQuestions[questionId];
  }

  // 跳轉到指定題目
  goToQuestion(index: number): void {
    if (index >= 0 && index < this.examData.length) {
      this.showQuestion(index);
    }
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
    return this.domSanitizer.bypassSecurityTrustUrl(imageUrl);
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

  /**
   * 監聽答案變更（用於 debug）
   */
  onAnswerChange(questionId: string, newValue: any): void {
    console.log(`📝 答案變更 - 題目ID: ${questionId}, 新值:`, newValue);
    console.log(`🗂️ 所有答案狀態:`, this.userAnswers);
  }
}