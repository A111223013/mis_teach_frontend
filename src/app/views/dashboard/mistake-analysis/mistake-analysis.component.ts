import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardModule,
  ButtonModule,
  GridModule,
  BadgeModule,
  UtilitiesModule,
  TooltipModule,
  DropdownModule,
  ModalModule
} from '@coreui/angular';
import { IconModule, IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilLockLocked, cilLockUnlocked, cilListRich, cilCheckCircle, cilBook, cilLightbulb } from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { SidebarService } from '../../../service/sidebar.service';

interface MistakeQuestion {
  id: string;
  uniqueId: string; // 唯一標識（用於合併相同題目）
  question_text: string;
  student_answer: string;
  correct_answer: string;
  topic: string;
  chapter: string;
  micro_concepts?: string[]; // 微概念數組
  timestamp: Date;
  exam_id?: string;
  exam_type?: string;
  score: number;
  is_correct: boolean;
  question_number?: string;
  type?: string;
  feedback?: string | object | null; // 可能是 JSON 字符串、對象或 null
  status: 'correct' | 'wrong' | 'unanswered';
  errorCount: number; // 錯誤次數
}

@Component({
  selector: 'app-mistake-analysis',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    GridModule,
    BadgeModule,
    UtilitiesModule,
    TooltipModule,
    DropdownModule,
    ModalModule,
    IconModule,
    IconDirective
  ],
  templateUrl: './mistake-analysis.component.html',
  styleUrls: ['./mistake-analysis.component.scss']
})
export class MistakeAnalysisComponent implements OnInit {
  // 題目數據 - 只保留錯題（已合併相同題目並統計錯誤次數）
  wrongQuestions: MistakeQuestion[] = [];
  
  // 答案顯示狀態（只用於正確答案）
  visibleCorrectAnswers: Set<string> = new Set();
  
  // 詳情模態框
  selectedQuestion: MistakeQuestion | null = null;
  showDetailModal: boolean = false;
  aiExplanation: string = '';
  loadingExplanation: boolean = false;
  
  // 狀態控制
  loading: boolean = true;
  
  constructor(
    private dashboardService: DashboardService,
    private sidebarService: SidebarService,
    private iconSetService: IconSetService
  ) {
    // 註冊圖標
    const existingIcons = iconSetService.icons || {};
    iconSetService.icons = {
      ...existingIcons,
      ...{ cilLockLocked, cilLockUnlocked, cilListRich, cilCheckCircle, cilBook, cilLightbulb }
    };
  }
  
  ngOnInit(): void {
    console.log('🚀 錯題統整組件初始化');
    this.loadSubmissionsAnalysis();
  }
  
  loadSubmissionsAnalysis(): void {
    this.loading = true;
    console.log('🔄 開始載入測驗數據...');
    
    // 調用新的 submissions 分析 API
    this.dashboardService.getUserSubmissionsAnalysis().subscribe({
      next: (response: any) => {
        console.log('✅ API 響應:', response);
        if (response?.success !== false && response?.submissions) {
          console.log('📊 找到提交數據:', response.submissions.length, '條記錄');
          this.processSubmissionsData(response.submissions);
        } else {
          console.log('⚠️ 沒有找到有效的提交數據');
          this.wrongQuestions = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ 獲取測驗數據失敗:', error);
        this.loading = false;
        this.wrongQuestions = [];
      }
    });
  }

  // 處理 submissions 數據，只保留錯題並統計錯誤次數
  private processSubmissionsData(submissions: any[]): void {
    console.log('🔄 開始處理提交數據...');
    console.log(`📊 收到 ${submissions.length} 個提交記錄`);
    
    let totalAnswers = 0;
    let wrongAnswers = 0;
    
    // 使用 Map 來統計每題的錯誤次數（以 question_id 或 question_text 作為唯一標識）
    const questionMap = new Map<string, {
      question: MistakeQuestion;
      count: number;
      latestTimestamp: Date;
    }>();
    
    // 遍歷所有提交記錄，只保留錯題
    submissions.forEach((submission, submissionIndex) => {
      console.log(`📝 處理第 ${submissionIndex + 1} 個提交:`, submission.submission_id);
      const answers = submission.answers || [];
      const submitTime = new Date(submission.submit_time || Date.now());
      
      console.log(`   - 該提交有 ${answers.length} 個答案`);
      
      // 處理已作答的題目（answers 是數組格式）
      if (Array.isArray(answers)) {
        answers.forEach((answer: any, index: number) => {
          totalAnswers++;
          
          if (answer && typeof answer === 'object') {
            // 更寬鬆的錯題判斷：支援 false、0、"false"、null、undefined
            const isWrong = this.isAnswerWrong(answer.is_correct);
            
            if (isWrong) {
              wrongAnswers++;
              
              // 格式化答案為字符串（處理數組類型）
              const formatAnswer = (ans: any): string => {
                if (!ans) return '';
                if (typeof ans === 'string') return ans;
                if (Array.isArray(ans)) return ans.join(', ');
                if (typeof ans === 'object') return JSON.stringify(ans);
                return String(ans);
              };
              
              const userAnswerStr = formatAnswer(answer.user_answer);
              const correctAnswerStr = formatAnswer(answer.correct_answer);
              
              // 使用 question_id 作為唯一標識，如果沒有則使用 question_text
              const uniqueKey = answer.question_id || answer.question_text || `${submission.submission_id}_${index}`;
              
              // 如果該題目已經存在，增加錯誤次數並更新最新時間戳
              if (questionMap.has(uniqueKey)) {
                const existing = questionMap.get(uniqueKey)!;
                existing.count++;
                // 更新為最新的時間戳
                if (submitTime > existing.latestTimestamp) {
                  existing.latestTimestamp = submitTime;
                  existing.question.timestamp = submitTime;
                  existing.question.student_answer = userAnswerStr;
                  existing.question.feedback = answer.feedback || null; // 更新 feedback
                  // 如果新的 micro_concepts 存在且不為空，則更新
                  if (answer.micro_concepts && Array.isArray(answer.micro_concepts) && answer.micro_concepts.length > 0) {
                    existing.question.micro_concepts = answer.micro_concepts;
                  }
                }
              } else {
                // 新建題目記錄
                const question: MistakeQuestion = {
                  id: `${submission.submission_id}_${index}`,
                  uniqueId: uniqueKey,
                  question_text: answer.question_text && answer.question_text.trim() ? answer.question_text.trim() : '題目內容未提供',
                  student_answer: userAnswerStr,
                  correct_answer: correctAnswerStr,
                  topic: (answer.topic && answer.topic !== 'unknown') ? answer.topic : '未分類',
                  chapter: (answer.chapter && answer.chapter !== 'unknown') ? answer.chapter : '未分類',
                  micro_concepts: Array.isArray(answer.micro_concepts) ? answer.micro_concepts.filter((mc: string) => mc && mc.trim()) : [], // 過濾空值
                  timestamp: submitTime,
                  exam_id: submission.submission_id,
                  exam_type: submission.quiz_type || 'unknown',
                  score: answer.score || 0,
                  is_correct: false,
                  question_number: answer.question_number || index.toString(),
                  type: answer.type || 'unknown',
                  feedback: answer.feedback || null,
                  status: 'wrong',
                  errorCount: 1
                };
                
                questionMap.set(uniqueKey, {
                  question,
                  count: 1,
                  latestTimestamp: submitTime
                });
              }
            }
          } else {
            console.warn(`   ⚠️ 答案格式異常 (索引 ${index}):`, typeof answer, answer);
          }
        });
      } else {
        console.warn(`   ⚠️ answers 不是數組格式:`, typeof answers);
      }
    });
    
    // 將 Map 轉換為數組，並設置錯誤次數
    this.wrongQuestions = Array.from(questionMap.values()).map(item => {
      item.question.errorCount = item.count;
      return item.question;
    });
    
    // 按錯誤次數排序（最多的在前），如果錯誤次數相同則按時間排序（最新的在前）
    this.wrongQuestions.sort((a, b) => {
      if (b.errorCount !== a.errorCount) {
        return b.errorCount - a.errorCount;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    
    console.log('✅ 數據處理完成:');
    console.log(`   - 總答案數: ${totalAnswers}`);
    console.log(`   - 錯題記錄數: ${wrongAnswers}`);
    console.log(`   - 唯一錯題數量: ${this.wrongQuestions.length}`);
    console.log(`   - 最多錯誤次數: ${this.wrongQuestions[0]?.errorCount || 0}`);
  }
  
  // 判斷答案是否錯誤（支援多種格式）
  private isAnswerWrong(isCorrect: any): boolean {
    // 明確為 true 或 1 的視為正確
    if (isCorrect === true || isCorrect === 1 || isCorrect === '1' || isCorrect === 'true') {
      return false;
    }
    
    // 其他情況都視為錯誤（包括 false、0、null、undefined、"false"、"0"）
    return true;
  }

  // 答案顯示/隱藏控制（只控制正確答案）
  toggleCorrectAnswer(uniqueId: string): void {
    if (this.visibleCorrectAnswers.has(uniqueId)) {
      this.visibleCorrectAnswers.delete(uniqueId);
    } else {
      this.visibleCorrectAnswers.add(uniqueId);
    }
  }

  isCorrectAnswerVisible(uniqueId: string): boolean {
    return this.visibleCorrectAnswers.has(uniqueId);
  }
  
  // 計算總錯誤次數
  getTotalErrorCount(): number {
    return this.wrongQuestions.reduce((sum, q) => sum + q.errorCount, 0);
  }
  
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }
  
  // 查看詳情 - 打開 modal
  reviewMistake(question: MistakeQuestion): void {
    this.selectedQuestion = question;
    this.showDetailModal = true;
    this.aiExplanation = ''; // 重置解析
  }
  
  // 獲取 AI 解析
  getAIExplanation(): void {
    if (!this.selectedQuestion) return;
    
    this.loadingExplanation = true;
    
    // 使用真實的 feedback 或生成模擬解析
    setTimeout(() => {
      if (this.selectedQuestion?.feedback) {
        // 嘗試解析 feedback（可能是 JSON 字符串或對象）
        let feedback: any;
        try {
          if (typeof this.selectedQuestion.feedback === 'string') {
            feedback = JSON.parse(this.selectedQuestion.feedback);
          } else {
            feedback = this.selectedQuestion.feedback;
          }
        } catch (e) {
          // 如果不是 JSON，將 feedback 轉換為字符串
          if (typeof this.selectedQuestion.feedback === 'string') {
            this.aiExplanation = this.selectedQuestion.feedback;
          } else if (typeof this.selectedQuestion.feedback === 'object' && this.selectedQuestion.feedback !== null) {
            // 如果是對象，轉換為字符串
            this.aiExplanation = JSON.stringify(this.selectedQuestion.feedback, null, 2);
          } else {
            this.aiExplanation = '暫無 AI 解析';
          }
          this.loadingExplanation = false;
          return;
        }
        
        // 格式化 feedback 為易讀的文本
        const parts: string[] = [];
        
        if (feedback.explanation) {
          parts.push(`📝 **評分說明**\n${feedback.explanation}`);
        }
        
        if (feedback.strengths && feedback.strengths !== '無' && feedback.strengths.trim()) {
          parts.push(`\n✅ **優點**\n${feedback.strengths}`);
        }
        
        if (feedback.weaknesses && feedback.weaknesses !== '無' && feedback.weaknesses.trim()) {
          parts.push(`\n⚠️ **需要改進**\n${feedback.weaknesses}`);
        }
        
        if (feedback.suggestions && feedback.suggestions !== '無' && feedback.suggestions.trim()) {
          parts.push(`\n💡 **學習建議**\n${feedback.suggestions}`);
        }
        
        this.aiExplanation = parts.length > 0 ? parts.join('\n\n') : '暫無 AI 解析';
      } else {
        this.aiExplanation = `此題考察的是${this.selectedQuestion?.topic}領域中的基本概念。\n\n正確答案應該選擇「${this.selectedQuestion?.correct_answer}」，因為根據${this.selectedQuestion?.chapter}的內容，這是最準確的描述。\n\n錯誤選擇「${this.selectedQuestion?.student_answer}」的常見原因是混淆了相關概念。這是一個常見的誤區，需要注意區分。\n\n**學習建議：**\n1. 重新複習${this.selectedQuestion?.chapter}的相關內容\n2. 特別關注概念之間的區別\n3. 練習相關類型的題目鞏固理解\n\n希望這個解析對您有所幫助！`;
      }
      
      this.loadingExplanation = false;
    }, 1500);
  }
  
  // 格式化解析內容為 HTML（支持換行和粗體）
  formatExplanation(text: string): string {
    if (!text) return '';
    
    // 先處理雙換行（段落分隔）
    let formatted = text.replace(/\n\n+/g, '||PARAGRAPH_BREAK||');
    
    // 將文本中的 **粗體** 轉換為 HTML
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 將段落分隔符替換為 </p><p>
    formatted = formatted.replace(/\|\|PARAGRAPH_BREAK\|\|/g, '</p><p>');
    
    // 將單換行轉換為 <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // 包裹在段落標籤中
    return `<p>${formatted}</p>`;
  }
  
  // AI 複習此題 - 使用側邊欄 AI（一般教學導師，不使用 RAG 引導教學）
  reviewQuestionWithAI(): void {
    if (!this.selectedQuestion) return;
    
    // 關閉 modal
    this.showDetailModal = false;
    
    // 構建問題文本（明確要求直接解答，不使用引導式教學）
    // 關鍵詞「直接分析」、「直接解答」會讓 AI 選擇 direct_answer_tool 而不是 ai_tutor_tool
    const questionText = `請直接解答並分析這道錯題（不需要引導式提問，直接給出答案和解釋）：

題目：${this.selectedQuestion.question_text}

我的答案：${this.selectedQuestion.student_answer || '未作答'}

正確答案：${this.selectedQuestion.correct_answer}

請直接分析我為什麼答錯，正確答案為什麼是正確的，並提供改進建議。`;

    // 打開側邊欄並發送問題（使用一般教學導師 - direct_answer_tool）
    this.sidebarService.openSidebar(questionText);
  }

}
