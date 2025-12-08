import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface QuestionData {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  is_marked: boolean;
  topic: string;
  difficulty: number;
  options: string[];
  image_file: string;
  type: string;
  subject?: string;
  score?: number;
  feedback?: {
    explanation: string;
    strengths: string;
    weaknesses: string;
    suggestions: string;
  };
}

export interface TutoringResponse {
  success: boolean;
  response?: string | TutoringResponseData;  // 可能是字符串或完整數據對象
  error?: string;
}

export interface TutoringResponseData {
  response: string;              // AI 回應文字（已清理評分）
  raw_score?: number;            // AI 原始評分（可能為 null）
  smart_score: number;           // 智能評分後的結果
  learning_stage: string;         // 學習階段
  concept_progress: any[];        // 概念進度
  conversation_count?: number;     // 對話次數
  is_initial?: boolean;           // 是否為初始化
}

@Injectable({
  providedIn: 'root'
})
export class AiTutoringService {
  private readonly API_BASE_URL = `${environment.apiUrl}/ai_teacher`;

  constructor(private http: HttpClient) {}

  /**
   * 創建學習會話ID
   */
  createLearningSessionId(resultId: string): string {
    // 簡化會話ID，只使用簡短的時間戳
    const timestamp = Date.now().toString(36);
    return `learning_${timestamp}_${resultId}`;
  }

  /**
   * 從會話ID提取測驗結果ID
   */
  extractResultIdFromSession(sessionId: string): string {
    const parts = sessionId.split('_');
    // 新格式: learning_{timestamp}_{resultId}
    // 所以 resultId 是最後一個部分
    return parts[parts.length - 1];
  }

  /**
   * 獲取測驗結果數據
   */
  getQuizResult(resultId: string): Observable<any> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return throwError(() => new Error('用戶未登入，請先登入'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.API_BASE_URL}/get-quiz-result/${resultId}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else if (error.status === 404) {
          return throwError(() => new Error('測驗結果不存在'));
        } else {
          return throwError(() => new Error(`無法獲取測驗結果 (${error.status})`));
        }
      })
    );
  }

  /**
   * 發送教學對話訊息
   */
  sendTutoringMessage(message: string, sessionId: string, questionData?: any): Observable<TutoringResponse> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      session_id: sessionId,
      user_input: message,
      conversation_type: 'tutoring',
      correct_answer: questionData?.correct_answer || '',
      user_answer: questionData?.user_answer || '',
      // 新增：傳遞AI批改的評分反饋
      grading_feedback: questionData?.feedback || {}
    };

    return this.http.post<TutoringResponse>(`${this.API_BASE_URL}/ai-tutoring`, payload, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`發送訊息失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 提取錯題數據
   */
  extractWrongQuestions(quizData: any): QuestionData[] {
    // 後端返回的數據結構是 { success: true, data: { questions: [...] } }
    const questions = quizData.data?.questions || quizData.questions || [];
    const wrongQuestions = questions.filter((question: any) => {
      // 檢查是否為錯題：is_correct 為 false 的題目
      const isWrong = question.is_correct === false;
      return isWrong;
    });
    
    return wrongQuestions.map((question: any) => ({
      question_id: question.question_id,
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      user_answer: question.user_answer,
      topic: question.topic,
      difficulty: question.difficulty,
      options: question.options,
      image_file: question.image_file,
      question_type: question.question_type,
      is_correct: false,
      is_marked: false,
      subject: question.subject || question.topic || '計算機概論',
      score: question.score || 0,
      feedback: question.feedback || {
        explanation: '',
        strengths: '',
        weaknesses: '',
        suggestions: ''
      }
    }));
  }

  /**
   * 開始錯題學習
   */
  startErrorLearning(resultId: string): Observable<any> {
    return this.getQuizResult(resultId).pipe(
      map(quizData => {
        const wrongQuestions = this.extractWrongQuestions(quizData);
        return {
          success: true,
          wrongQuestions,
          wrongCount: wrongQuestions.length
        };
      })
    );
  }
}
