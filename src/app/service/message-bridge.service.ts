import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MessageToAssistant {
  type: 'question' | 'quiz_generation' | 'selected_text_quiz_generation';
  content: string;
  selectedText: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MessageBridgeService {
  private messageSubject = new BehaviorSubject<MessageToAssistant | null>(null);
  public message$ = this.messageSubject.asObservable();

  constructor() {}

  /**
   * 發送訊息到網站助手
   */
  sendMessageToAssistant(message: MessageToAssistant): void {
    this.messageSubject.next(message);
  }

  /**
   * 發送詢問訊息
   */
  sendQuestion(selectedText: string): void {
    const message: MessageToAssistant = {
      type: 'question',
      content: `請解釋以下內容：${selectedText}`,
      selectedText: selectedText,
      timestamp: new Date()
    };
    this.sendMessageToAssistant(message);
  }

  /**
   * 發送生成題目訊息（基於選中文字）
   */
  sendQuizGeneration(selectedText: string): void {
    const message: MessageToAssistant = {
      type: 'selected_text_quiz_generation',
      content: `請根據以下內容生成一道題目：${selectedText}`,
      selectedText: selectedText,
      timestamp: new Date()
    };
    this.sendMessageToAssistant(message);
  }


  /**
   * 清除當前訊息
   */
  clearMessage(): void {
    this.messageSubject.next(null);
  }
}
