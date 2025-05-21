import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces ---
interface BaseQuestion {
  id: number;
  type: 'single-choice' | 'multiple-choice' | 'short-answer' | 'true-false';
  text: string;
}

interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single-choice';
  options: string[];
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
}

type Question = SingleChoiceQuestion | MultipleChoiceQuestion | ShortAnswerQuestion | TrueFalseQuestion;

@Component({
    selector: 'app-past-exam-review',
    imports: [
        CommonModule,
        FormsModule
    ],
    standalone: true,
    templateUrl: './past-exam-review.component.html',
    styleUrls: ['./past-exam-review.component.scss']
})
export class PastExamReviewComponent implements OnInit, OnDestroy {

  examQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  userAnswers: { [questionId: number]: any } = {};
  currentAnswer: any = null;

  startTime: number = 0;
  elapsedTime: number = 0;
  timerInterval: any;
  questionStartTime: number = 0;
  timeSpentPerQuestion: { [questionId: number]: number } = {};
  flaggedQuestions: { [questionId: number]: boolean } = {};

  ngOnInit(): void {
    this.loadMockExam();
    this.startTimer();
    this.resetQuestionTimer();
    this.loadCurrentAnswer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  loadMockExam(): void {
    this.examQuestions = [
      {
        id: 1,
        type: 'single-choice',
        text: 'Angular 主要由哪個組織開發和維護？',
        options: ['Microsoft', 'Google', 'Facebook', 'Oracle']
      },
      {
        id: 2,
        type: 'true-false',
        text: 'Standalone Components 是 Angular 14 引入的功能。'
      },
      {
        id: 3,
        type: 'multiple-choice',
        text: '以下哪些是 Angular 的核心概念？ (可複選)',
        options: ['Components', 'Modules', 'Services', 'Virtual DOM']
      },
      {
        id: 4,
        type: 'short-answer',
        text: '請簡述 Dependency Injection (依賴注入) 的主要目的。'
      }
    ];
    this.examQuestions.forEach(q => {
      if (!(q.id in this.userAnswers)) {
        if (q.type === 'multiple-choice') {
          this.userAnswers[q.id] = {};
        } else {
          this.userAnswers[q.id] = null;
        }
      }
      if (!(q.id in this.timeSpentPerQuestion)) {
        this.timeSpentPerQuestion[q.id] = 0;
      }
      if (!(q.id in this.flaggedQuestions)) {
        this.flaggedQuestions[q.id] = false;
      }
    });
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    }, 1000);
  }

  get currentQuestion(): Question {
    return this.examQuestions[this.currentQuestionIndex];
  }

  // Getter for single choice options (returns undefined if not applicable)
  get singleChoiceOptions(): string[] | undefined {
    const q = this.currentQuestion;
    return q?.type === 'single-choice' ? q.options : undefined;
  }

  // Getter for multiple choice options (returns undefined if not applicable)
  get multipleChoiceOptions(): string[] | undefined {
    const q = this.currentQuestion;
    return q?.type === 'multiple-choice' ? q.options : undefined;
  }

  updateTimeSpent(): void {
    if (this.currentQuestion && this.questionStartTime) {
      const timeSpent = Math.floor((Date.now() - this.questionStartTime) / 1000);
      this.timeSpentPerQuestion[this.currentQuestion.id] += timeSpent;
      console.log(`Time spent on Q${this.currentQuestion.id}: ${timeSpent}s. Total: ${this.timeSpentPerQuestion[this.currentQuestion.id]}s`);
    }
  }

  resetQuestionTimer(): void {
    this.questionStartTime = Date.now();
  }

  saveCurrentAnswer(): void {
    this.updateTimeSpent();
    if (this.currentQuestion) {
      if (this.currentQuestion.type === 'multiple-choice') {
        this.userAnswers[this.currentQuestion.id] = { ...this.currentAnswer };
      } else {
        this.userAnswers[this.currentQuestion.id] = this.currentAnswer;
      }
    }
    console.log("Answers saved:", this.userAnswers);
  }

  loadCurrentAnswer(): void {
    if (this.currentQuestion) {
       if (this.currentQuestion.type === 'multiple-choice') {
         this.currentAnswer = { ...this.userAnswers[this.currentQuestion.id] };
       } else {
        this.currentAnswer = this.userAnswers[this.currentQuestion.id];
       }
    }
  }

  nextQuestion(): void {
    this.updateTimeSpent();
    this.saveCurrentAnswer();
    if (this.currentQuestionIndex < this.examQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentAnswer();
      this.resetQuestionTimer();
    }
  }

  previousQuestion(): void {
    this.updateTimeSpent();
    this.saveCurrentAnswer();
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadCurrentAnswer();
      this.resetQuestionTimer();
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.examQuestions.length && index !== this.currentQuestionIndex) {
        this.updateTimeSpent();
        this.saveCurrentAnswer();
        this.currentQuestionIndex = index;
        this.loadCurrentAnswer();
        this.resetQuestionTimer();
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  submitExam(): void {
    this.updateTimeSpent();
    this.saveCurrentAnswer();
    console.log("Exam Submitted!");
    console.log("Final Answers:", this.userAnswers);
    console.log("Total Time:", this.formatTime(this.elapsedTime));
    console.log("Time Per Question:", this.timeSpentPerQuestion);
    clearInterval(this.timerInterval);
  }

  toggleFlag(questionId: number): void {
    if (questionId in this.flaggedQuestions) {
        this.flaggedQuestions[questionId] = !this.flaggedQuestions[questionId];
    }
    console.log("Flagged questions:", this.flaggedQuestions);
  }

  isQuestionAnswered(questionId: number): boolean {
    const answer = this.userAnswers[questionId];
    if (answer === null || answer === undefined) {
      return false;
    }
    if (typeof answer === 'object' && Object.keys(answer).length > 0) {
        return Object.values(answer).some(value => value === true);
    }
    return true; 
  }
}
