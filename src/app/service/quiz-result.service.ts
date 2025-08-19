import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AiTutoringService } from './ai-tutoring.service';

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
    localStorage.setItem('current_result_id', resultId);
    
    const sessionId = this.aiTutoringService.createLearningSessionId(resultId);
    
    this.router.navigate(['/dashboard/ai-tutoring', sessionId], {
      queryParams: { 
        source: 'quiz_result',
        result_id: resultId 
      }
    });
  }
}
