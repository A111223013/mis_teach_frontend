import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../service/dashboard.service';
import { MathJaxService } from '../../../service/mathjax.service';

@Component({
    selector: 'app-test-ai',
    imports: [
        CommonModule, FormsModule
    ],
    templateUrl: './test-ai.component.html',
    standalone: true,
    styleUrl: './test-ai.component.scss'
})
export class TestAiComponent implements AfterViewChecked {

  constructor(
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService
  ) { }
  
  messages = [
    { role: 'ai', text: '您好！有什麼我可以幫忙的嗎？' }
  ];
  inputMessage = '';
  @ViewChild('chatBody') private chatBodyRef!: ElementRef;
  private shouldScroll = false;
  private shouldRenderMath = false;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
    
    if (this.shouldRenderMath) {
      this.renderMathInChat();
      this.shouldRenderMath = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
    } catch (err) {
      console.error('無法捲動到底部', err);
    }
  }
  
  renderMathInChat(): void {
    if (this.chatBodyRef) {
      this.mathJaxService.renderMathInElement(this.chatBodyRef.nativeElement);
    }
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;
    
    this.messages.push({ role: 'user', text: this.inputMessage });
    const userMsg = this.inputMessage;
    this.inputMessage = '';
    this.shouldScroll = true;
    
    this.dashboardService.ask(userMsg).subscribe(
      (response: any) => {
        console.log(response);
        let formattedAnswer = response.answer;
        // 將原始文本轉換為可使用MathJax渲染的格式
     
        this.messages.push({ role: 'ai', text: formattedAnswer });
        this.shouldScroll = true;
        this.shouldRenderMath = true;
      },
      (error: Error) => {
        console.error('回答失敗', error);
        this.messages.push({ role: 'ai', text: '回答失敗，請稍後再試' });
        this.shouldScroll = true;
      }
    );
  }
}
