import { Component } from '@angular/core';
import { RagAssistantService } from '../../../service/rag-assistant.service';

@Component({
  selector: 'app-quiz-analyze',
  imports: [],
  templateUrl: './quiz-analyze.component.html',
  standalone:true,
  styleUrl: './quiz-analyze.component.scss'
})
export class QuizAnalyzeComponent {
  constructor(
    private ragService: RagAssistantService
  ) {}
    
  ngOnInit(): void {
    this.ragService.get_user_answer_object().subscribe(
      (data: any) => {
        // 處理學生作答資料
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }

}
