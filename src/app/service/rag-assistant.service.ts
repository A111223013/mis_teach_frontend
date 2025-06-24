import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  conversationType?: 'general' | 'tutoring' | 'analysis' | 'exam_guidance';
  aiModel: 'gemini';
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  conversation_type?: string;
  ai_model?: string;
  conversation_count?: number;
  error?: string;
  message?: string;
}

export interface LearningAnalysis {
  learning_summary: {
    total_conversations: number;
    recent_activity: number;
    most_discussed_topics: string[];
    preferred_question_types: string[];
    learning_frequency: string;
  };
  learning_recommendations: string[];
  weak_areas: string[];
  learning_progress: {
    level: string;
    percentage: number;
    total_interactions: number;
    estimated_study_time: string;
  };
}

export interface SystemGuide {
  success: boolean;
  guide: string;
  user_type: string;
}

export interface ExamGuidance {
  success: boolean;
  guidance: string;
  wrong_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RagAssistantService {
  private apiUrl = `${environment.apiUrl}/ai_teacher`;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private isTypingSubject = new BehaviorSubject<boolean>(false);
  private currentAiModelSubject = new BehaviorSubject<'gemini'>('gemini');

  public messages$ = this.messagesSubject.asObservable();
  public isTyping$ = this.isTypingSubject.asObservable();
  public currentAiModel$ = this.currentAiModelSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.loadChatHistory();
  }

  /**
   * 發送聊天訊息
   */
  sendMessage(
    question: string,
    conversationType: 'general' | 'tutoring' | 'analysis' = 'general',
    aiModel: 'gemini' = 'gemini'
  ): Observable<ChatResponse> {
    // 添加用戶訊息到聊天記錄
    this.addMessage({
      id: this.generateId(),
      type: 'user',
      content: question,
      timestamp: new Date(),
      conversationType,
      aiModel
    });

    this.isTypingSubject.next(true);

    const payload = {
      question,
      type: conversationType,
      ai_model: aiModel
    };

    return new Observable<ChatResponse>(observer => {
      this.http.post<ChatResponse>(`${this.apiUrl}/chat`, payload, this.httpOptions)
        .subscribe({
          next: (response) => {
            this.isTypingSubject.next(false);
            
            if (response.success && response.response) {
              // 添加AI回應到聊天記錄
              this.addMessage({
                id: this.generateId(),
                type: 'assistant',
                content: response.response,
                timestamp: new Date(),
                conversationType: response.conversation_type as any,
                aiModel: response.ai_model as any
              });
            }
            
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            this.isTypingSubject.next(false);
            console.error('Chat error:', error);
            
            // 添加錯誤訊息
            this.addMessage({
              id: this.generateId(),
              type: 'assistant',
              content: '抱歉，發生了錯誤。請稍後再試。',
              timestamp: new Date(),
              aiModel: 'gemini'
            });
            
            observer.error(error);
          }
        });
    });
  }

  /**
   * 發送帶有會話ID的訊息（用於教學對話）
   */
  sendMessageWithSession(
    message: string,
    conversationType: 'general' | 'tutoring' = 'tutoring',
    sessionId: string
  ): Observable<ChatResponse> {
    // 添加用戶訊息到聊天記錄
    this.addMessage({
      id: this.generateId(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      conversationType: conversationType as any,
      aiModel: 'gemini'
    });

    this.isTypingSubject.next(true);

    const payload = {
      question: message,
      type: conversationType,
      session_id: sessionId
    };

    return new Observable<ChatResponse>(observer => {
      this.http.post<ChatResponse>(`${this.apiUrl}/chat`, payload, this.httpOptions)
        .subscribe({
          next: (response) => {
            this.isTypingSubject.next(false);

            if (response.success && response.response) {
              // 添加AI回應到聊天記錄
              this.addMessage({
                id: this.generateId(),
                type: 'assistant',
                content: response.response,
                timestamp: new Date(),
                conversationType: response.conversation_type as any,
                aiModel: response.ai_model as any
              });
            }

            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            this.isTypingSubject.next(false);
            console.error('Chat error:', error);

            // 添加錯誤訊息
            this.addMessage({
              id: this.generateId(),
              type: 'assistant',
              content: '抱歉，發生了錯誤。請稍後再試。',
              timestamp: new Date(),
              aiModel: 'gemini'
            });

            observer.error(error);
          }
        });
    });
  }

  /**
   * 獲取系統使用指南
   */
  getSystemGuide(userType: 'new' | 'returning' = 'new'): Observable<SystemGuide> {
    const payload = { user_type: userType };
    return this.http.post<SystemGuide>(`${this.apiUrl}/system-guide`, payload, this.httpOptions);
  }

  /**
   * 獲取學習分析報告
   */
  getLearningAnalysis(): Observable<{success: boolean, analysis: LearningAnalysis}> {
    return this.http.get<{success: boolean, analysis: LearningAnalysis}>(`${this.apiUrl}/learning-analysis`, this.httpOptions);
  }

  /**
   * 提供考題指導
   */
  getExamGuidance(wrongAnswers: any[], examResults: any = {}): Observable<ExamGuidance> {
    const payload = {
      wrong_answers: wrongAnswers,
      exam_results: examResults
    };
    return this.http.post<ExamGuidance>(`${this.apiUrl}/exam-guidance`, payload, this.httpOptions);
  }


  /**
   * 重置對話
   */
  resetConversation(): Observable<{success: boolean, message: string}> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/reset-conversation`, {}, this.httpOptions)
        .subscribe({
          next: (response) => {
            if (response.success) {
              // 添加系統訊息
              this.addMessage({
                id: this.generateId(),
                type: 'assistant',
                content: `🔄 ${response.message}`,
                timestamp: new Date(),
                aiModel: 'gemini'
              });
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
    });
  }

  /**
   * 清除聊天記錄
   */
  clearMessages(): void {
    this.messagesSubject.next([]);
    this.saveChatHistory();
  }

  
  /**
   * 添加訊息到聊天記錄
   */
  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    this.saveChatHistory();
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 保存聊天記錄到本地存儲
   */
  private saveChatHistory(): void {
    try {
      const messages = this.messagesSubject.value;
      // 只保存最近50條訊息
      const recentMessages = messages.slice(-100);
      localStorage.setItem('rag_chat_history', JSON.stringify(recentMessages));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }

  /**
   * 從本地存儲載入聊天記錄
   */
  private loadChatHistory(): void {
    try {
      const saved = localStorage.getItem('rag_chat_history');
      if (saved) {
        const messages = JSON.parse(saved);
        // 轉換時間戳
        const convertedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.messagesSubject.next(convertedMessages);
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
  }

  // ==================== 學習系統 API ====================

  /**
   * 提交測驗結果
   */
  submitQuizResults(quizData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-quiz-results`, quizData, this.httpOptions);
  }

  /**
   * 獲取測驗結果
   */
  getQuizResult(resultId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-quiz-result/${resultId}`, this.httpOptions);
  }

  /**
   * 開始錯題學習
   */
  startErrorLearning(resultId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/start-error-learning`, { result_id: resultId }, this.httpOptions);
  }

  /**
   * AI 智能教學
   */
  aiTutoring(data: {
    session_id: string;
    question_data: any;
    user_input: string;
    action: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ai-tutoring`, data, this.httpOptions);
  }

  /**
   * 獲取學習進度
   */
  getLearningProgress(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/learning-progress/${sessionId}`, this.httpOptions);
  }

  /**
   * 完成題目學習
   */
  completeQuestionLearning(data: {
    session_id: string;
    question_id: string;
    understanding_level: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/complete-question-learning`, data, this.httpOptions);
  }

  /**
   * 獲取對話歷史
   */
  getConversationHistory(limit: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversation-history?limit=${limit}`, this.httpOptions);
  }

  get_user_answer_object(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_user_answer_object`, this.httpOptions);
  }


}
