import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  CardModule, 
  ButtonModule, 
  GridModule,
  UtilitiesModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { RagAssistantService } from '../../../service/rag-assistant.service';

@Component({
  selector: 'app-quiz-demo',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    GridModule,
    UtilitiesModule,
    IconModule
  ],
  template: `
    <div class="quiz-demo-container p-4">
      <c-row class="justify-content-center">
        <c-col xs="12" md="8" lg="6">
          <c-card>
            <c-card-header class="text-center">
              <h4>
                <c-icon name="cilClipboard" class="me-2"></c-icon>
                測驗系統演示
              </h4>
            </c-card-header>
            <c-card-body class="text-center">
              <p class="text-muted mb-4">
                點擊下方按鈕模擬提交測驗結果，體驗完整的學習系統流程
              </p>
              
              <div class="d-grid gap-3">
                <button 
                  type="button" 
                  class="btn btn-warning btn-lg"
                  (click)="submitMockQuizResult('average')"
                  [disabled]="isSubmitting">
                  <c-icon name="cilMinus" class="me-2"></c-icon>
                  模擬中等測驗 (40分)
                </button>
              </div>
              
              <div *ngIf="isSubmitting" class="mt-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">提交中...</span>
                </div>
                <p class="mt-2 text-muted">正在提交測驗結果...</p>
              </div>
            </c-card-body>
          </c-card>
        </c-col>
      </c-row>
    </div>
  `,
  styles: [`
    .quiz-demo-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
    }
    
    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }
    
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: none;
    }
  `]
})
export class QuizDemoComponent {
  
  isSubmitting = false;

  constructor(
    private router: Router,
    private ragService: RagAssistantService
  ) {}

  async submitMockQuizResult(type: 'good' | 'average' | 'poor'): Promise<void> {
    this.isSubmitting = true;
    
    try {
      const mockData = this.generateMockQuizData(type);
      const response = await this.ragService.submitQuizResults(mockData).toPromise();
      
      if (response?.success) {
        // 導航到結果頁面
        this.router.navigate(['/dashboard/quiz-result', response.result_id]);
      } else {
        console.error('提交失敗:', response?.error);
        alert('提交失敗，請重試');
      }
    } catch (error) {
      console.error('提交錯誤:', error);
      alert('提交時發生錯誤，請重試');
    } finally {
      this.isSubmitting = false;
    }
  }

  private generateMockQuizData(type: 'good' | 'average' | 'poor') {
    const baseQuestions = [
      {
        question_id: 'q1',
        question_text: '什麼是作業系統中的死鎖（Deadlock）？',
        user_answer: '程式停止運行',
        correct_answer: '兩個或多個程序互相等待對方釋放資源而無法繼續執行的狀態',
        is_correct: false,
        is_marked: true,
        topic: '作業系統',
        difficulty: 3,
        answer_time: 45
      },
      {
        question_id: 'q2',
        question_text: 'FIFO 排程演算法的特點是什麼？',
        user_answer: '先進先出，按照程序到達的順序執行',
        correct_answer: '先進先出，按照程序到達的順序執行',
        is_correct: true,
        is_marked: false,
        topic: '作業系統',
        difficulty: 2,
        answer_time: 30
      },
      {
        question_id: 'q3',
        question_text: '資料庫中的 ACID 特性包括哪些？',
        user_answer: '原子性、一致性',
        correct_answer: '原子性（Atomicity）、一致性（Consistency）、隔離性（Isolation）、持久性（Durability）',
        is_correct: false,
        is_marked: true,
        topic: '資料庫',
        difficulty: 4,
        answer_time: 60
      },
      {
        question_id: 'q4',
        question_text: 'TCP 和 UDP 的主要差異是什麼？',
        user_answer: 'TCP 可靠，UDP 不可靠',
        correct_answer: 'TCP 是面向連接的可靠傳輸協議，UDP 是無連接的不可靠傳輸協議',
        is_correct: true,
        is_marked: false,
        topic: '網路',
        difficulty: 3,
        answer_time: 40
      },
      {
        question_id: 'q5',
        question_text: '什麼是資料結構中的堆疊（Stack）？',
        user_answer: '一種資料結構',
        correct_answer: '後進先出（LIFO）的線性資料結構',
        is_correct: false,
        is_marked: false,
        topic: '資料結構',
        difficulty: 2,
        answer_time: 25
      }
    ];

    let answers = [...baseQuestions];
    let score = 0;
    
    // 根據類型調整答案正確性
    switch (type) {
      case 'good':
        // 85分：5題中4題對
        answers[0].is_correct = true;
        answers[0].user_answer = answers[0].correct_answer;
        answers[2].is_correct = true;
        answers[2].user_answer = answers[2].correct_answer;
        answers[4].is_correct = true;
        answers[4].user_answer = answers[4].correct_answer;
        score = 85;
        break;
        
      case 'average':
        // 65分：5題中3題對
        answers[0].is_correct = true;
        answers[0].user_answer = answers[0].correct_answer;
        answers[4].is_correct = true;
        answers[4].user_answer = answers[4].correct_answer;
        score = 65;
        break;
        
      case 'poor':
        // 45分：5題中2題對
        answers[4].is_correct = false;
        answers[4].user_answer = '不知道';
        score = 45;
        break;
    }

    const currentTime = new Date().toISOString();
    
    return {
      quiz_id: `quiz_${Date.now()}`,
      answers: answers,
      submit_time: currentTime,
      total_time: 300, // 5分鐘
      score: score
    };
  }
}
