import { Component } from '@angular/core';
import { RagAssistantService } from '../../../service/rag-assistant.service';

@Component({
  selector: 'app-quiz-analyze',
  imports: [],
  templateUrl: './quiz-analyze.component.html',
  styleUrl: './quiz-analyze.component.scss'
})
export class QuizAnalyzeComponent {
  constructor(
    private ragService: RagAssistantService
  ) {}
    
  ngOnInit(): void {
    console.log('現在是測試網頁');

    this.ragService.get_user_answer_object().subscribe(
      (data: any) => {
        console.log('獲取的學生作答資料:', data);
      },
      (error: any) => {
        console.error('Error fetching exam data:', error);
      }
    );
  }

}
