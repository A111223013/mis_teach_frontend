import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AiTutoringService } from './ai-tutoring.service';

export interface QuizResultData {
  resultId: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizResultService {
  constructor(
    private router: Router,
    private aiTutoringService: AiTutoringService
  ) {}

  /**
   * 開始錯題學習
   */
  startErrorLearning(resultId: string): void {
    // 保存result_id到localStorage，供AI tutoring組件使用
    localStorage.setItem('current_result_id', resultId);
    
    // 使用Service創建學習會話ID
    const sessionId = this.aiTutoringService.createLearningSessionId(resultId);
    
    // 導航到 AI 智能教學頁面
    this.router.navigate(['/dashboard/ai-tutoring', sessionId], {
      queryParams: { 
        source: 'quiz_result',
        result_id: resultId 
      }
    });
  }

  /**
   * 獲取測驗結果統計
   */
  getQuizStatistics(answers: any[]): QuizResultData {
    const totalQuestions = answers.length;
    const correctCount = answers.filter(answer => answer.is_correct).length;
    const wrongCount = totalQuestions - correctCount;
    const score = Math.round((correctCount / totalQuestions) * 100);

    return {
      resultId: `result_${Date.now()}`,
      totalQuestions,
      correctCount,
      wrongCount,
      score,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 格式化答案顯示
   */
  formatAnswer(answer: any): string {
    if (!answer || answer === '') return '未作答';
    if (answer === 'null' || answer === 'undefined') return '未作答';
    return answer;
  }

  /**
   * 獲取答案狀態樣式
   */
  getAnswerStatusClass(answer: any): string {
    if (!answer || answer === '') return 'text-muted';
    if (answer === 'null' || answer === 'undefined') return 'text-muted';
    return 'text-dark';
  }

  /**
   * 獲取題目難度標籤
   */
  getDifficultyBadge(difficulty: number): { text: string; class: string } {
    switch (difficulty) {
      case 1:
        return { text: '簡單', class: 'success' };
      case 2:
        return { text: '中等', class: 'warning' };
      case 3:
        return { text: '困難', class: 'danger' };
      default:
        return { text: '未知', class: 'secondary' };
    }
  }

  /**
   * 獲取題目類型標籤
   */
  getQuestionTypeBadge(questionType: string): { text: string; class: string } {
    switch (questionType) {
      case 'multiple-choice':
        return { text: '選擇題', class: 'primary' };
      case 'short-answer':
        return { text: '簡答題', class: 'info' };
      case 'true-false':
        return { text: '是非題', class: 'secondary' };
      default:
        return { text: '未知', class: 'secondary' };
    }
  }

  /**
   * 計算學習建議
   */
  getLearningAdvice(score: number): { title: string; message: string; type: string } {
    if (score >= 90) {
      return {
        title: '優秀表現！',
        message: '您的表現非常出色！建議繼續保持，可以挑戰更高難度的題目。',
        type: 'success'
      };
    } else if (score >= 70) {
      return {
        title: '良好表現！',
        message: '您的表現不錯！建議重點複習錯題，鞏固薄弱環節。',
        type: 'info'
      };
    } else if (score >= 50) {
      return {
        title: '需要改進',
        message: '您的表現有待提升。建議系統性複習相關概念，多做練習題。',
        type: 'warning'
      };
    } else {
      return {
        title: '需要加強學習',
        message: '建議從基礎概念開始，逐步建立知識體系，多與AI導師互動學習。',
        type: 'danger'
      };
    }
  }
}
