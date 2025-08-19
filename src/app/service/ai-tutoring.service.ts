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
  question_type: string;
}

export interface LearningProgress {
  total_questions: number;
  completed_questions: number;
  current_question_index: number;
  progress_percentage: number;
  remaining_questions: number;
  session_status: string;
}

export interface TutoringResponse {
  success: boolean;
  response?: string;
  error?: string;
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
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    return `learning_user_${timestamp}_${resultId}`;
  }

  /**
   * 從會話ID提取測驗結果ID
   */
  extractResultIdFromSession(sessionId: string): string {
    const parts = sessionId.split('_');
    return parts.slice(3).join('_');
  }

  /**
   * 獲取測驗結果數據
   */
  getQuizResult(resultId: string): Observable<any> {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    
    if (!token) {
      return throwError(() => new Error('用戶未登入，請先登入'));
    }

    // 添加認證頭 - 後端要求 Bearer <token> 格式
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log('🔍 嘗試獲取測驗結果:', resultId);

    return this.http.get(`${this.API_BASE_URL}/get-quiz-result/${resultId}`, { headers }).pipe(
      catchError(error => {
        console.error('❌ 獲取測驗結果失敗:', error);
        
        if (error.status === 401) {
          console.error('🔒 認證失敗，清除本地認證信息');
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
  sendTutoringMessage(message: string, sessionId: string): Observable<TutoringResponse> {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      session_id: sessionId,
      user_input: message,
      conversation_type: 'tutoring'
    };

    console.log('💬 發送教學訊息:', message);

    return this.http.post<TutoringResponse>(`${this.API_BASE_URL}/ai-tutoring`, payload, { headers }).pipe(
      catchError(error => {
        console.error('❌ 發送教學訊息失敗:', error);
        
        if (error.status === 401) {
          console.error('🔒 認證失敗，清除本地認證信息');
          localStorage.removeItem('token');
          return throwError(() => new Error('認證失敗，請重新登入'));
        } else {
          return throwError(() => new Error(`發送訊息失敗 (${error.status})`));
        }
      })
    );
  }

  /**
   * 格式化題目數據
   */
  formatQuestionData(rawData: any): QuestionData {
    return {
      question_id: rawData.question_id || rawData.question_index || '',
      question_text: rawData.question_text || '',
      user_answer: rawData.user_answer || '',
      correct_answer: rawData.correct_answer || '',
      is_correct: false,
      is_marked: false,
      topic: rawData.topic || '計算機概論',
      difficulty: rawData.difficulty || 2,
      options: rawData.options || [],
      image_file: rawData.image_file || '',
      question_type: rawData.question_type || 'short-answer'
    };
  }

  /**
   * 提取錯題數據
   */
  extractWrongQuestions(quizData: any): QuestionData[] {
    // 從 questions 陣列中提取錯題（is_correct = false 且有 user_answer 的題目）
    const questions = quizData.questions || [];
    const wrongQuestions = questions.filter((question: any) => 
      !question.is_correct && question.user_answer && question.user_answer !== ''
    );
    
    console.log('🔍 提取錯題數據:');
    console.log('  - 總題數:', questions.length);
    console.log('  - 錯題數:', wrongQuestions.length);
    console.log('  - 錯題詳情:', wrongQuestions.map((q: any) => ({
      question_id: q.question_id,
      question_text: q.question_text?.substring(0, 50) + '...',
      user_answer: q.user_answer,
      is_correct: q.is_correct
    })));
    
    return wrongQuestions.map((question: any) => this.formatQuestionData({
      question_id: question.question_id,
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      user_answer: question.user_answer,
      topic: question.topic,
      difficulty: question.difficulty,
      options: question.options,
      image_file: question.image_file,
      question_type: question.question_type
    }));
  }

  /**
   * 創建學習進度
   */
  createLearningProgress(totalQuestions: number): LearningProgress {
    return {
      total_questions: totalQuestions,
      completed_questions: 0,
      current_question_index: 0,
      progress_percentage: 0,
      remaining_questions: totalQuestions,
      session_status: 'active'
    };
  }

  /**
   * 初始化學習會話
   */
  initializeLearningSession(resultId: string): Observable<{
    learningPath: QuestionData[];
    learningProgress: LearningProgress;
  }> {
    return this.getQuizResult(resultId).pipe(
      map(response => {
        const quizData = response.data;
        const wrongQuestions = this.extractWrongQuestions(quizData);
        const learningPath = wrongQuestions;
        const learningProgress = this.createLearningProgress(learningPath.length);
        
        return { learningPath, learningProgress };
      }),
      catchError(error => throwError(() => new Error('初始化學習會話失敗')))
    );
  }
}
