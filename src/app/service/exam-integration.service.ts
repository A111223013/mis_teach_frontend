import { Injectable } from '@angular/core';
import { RagAssistantService } from './rag-assistant.service';
import { Observable } from 'rxjs';

export interface ExamQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: ExamWrongAnswer[];
  completionTime: number;
  accuracy: number;
}

export interface ExamWrongAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  topic: string;
  explanation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamIntegrationService {

  constructor(private ragService: RagAssistantService) {}

  /**
   * 考試完成後處理錯題並獲取AI指導
   */
  processExamResults(examResult: ExamResult): Observable<any> {
    return new Observable(observer => {
      if (examResult.wrongAnswers.length === 0) {
        // 沒有錯題，給予鼓勵
        observer.next({
          success: true,
          message: '🎉 恭喜！您這次考試表現完美，沒有錯題！',
          hasGuidance: false
        });
        observer.complete();
        return;
      }

      // 有錯題，請求AI指導
      this.ragService.getExamGuidance(examResult.wrongAnswers, {
        examId: examResult.examId,
        examTitle: examResult.examTitle,
        accuracy: examResult.accuracy,
        totalQuestions: examResult.totalQuestions
      }).subscribe({
        next: (response) => {
          observer.next({
            success: response.success,
            guidance: response.guidance,
            wrongCount: response.wrong_count,
            hasGuidance: true,
            examResult: examResult
          });
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  /**
   * 分析用戶在特定主題的表現
   */
  analyzeTopicPerformance(topic: string, recentResults: ExamResult[]): {
    topic: string;
    totalAttempts: number;
    averageAccuracy: number;
    commonMistakes: string[];
    recommendation: string;
  } {
    const topicResults = recentResults.filter(result => 
      result.wrongAnswers.some(wrong => wrong.topic === topic)
    );

    if (topicResults.length === 0) {
      return {
        topic,
        totalAttempts: 0,
        averageAccuracy: 100,
        commonMistakes: [],
        recommendation: `您在${topic}方面表現很好！`
      };
    }

    const totalQuestions = topicResults.reduce((sum, result) => sum + result.totalQuestions, 0);
    const totalCorrect = topicResults.reduce((sum, result) => sum + result.correctAnswers, 0);
    const averageAccuracy = Math.round((totalCorrect / totalQuestions) * 100);

    // 分析常見錯誤
    const mistakes = topicResults.flatMap(result => 
      result.wrongAnswers
        .filter(wrong => wrong.topic === topic)
        .map(wrong => wrong.question)
    );

    const commonMistakes = [...new Set(mistakes)].slice(0, 3); // 取前3個不重複的錯誤

    // 生成建議
    let recommendation = '';
    if (averageAccuracy >= 80) {
      recommendation = `您在${topic}方面表現良好，繼續保持！`;
    } else if (averageAccuracy >= 60) {
      recommendation = `您在${topic}方面有進步空間，建議多練習相關題目。`;
    } else {
      recommendation = `${topic}是您的薄弱環節，建議重新學習基礎概念並多加練習。`;
    }

    return {
      topic,
      totalAttempts: topicResults.length,
      averageAccuracy,
      commonMistakes,
      recommendation
    };
  }

  /**
   * 生成學習建議
   */
  generateStudyRecommendations(examResults: ExamResult[]): {
    weakTopics: string[];
    strongTopics: string[];
    overallRecommendation: string;
    nextSteps: string[];
  } {
    if (examResults.length === 0) {
      return {
        weakTopics: [],
        strongTopics: [],
        overallRecommendation: '開始練習考古題來了解您的學習狀況！',
        nextSteps: ['選擇一個主題開始練習', '定期檢視學習進度']
      };
    }

    // 分析各主題表現
    const topicPerformance = new Map<string, { correct: number; total: number }>();
    
    examResults.forEach(result => {
      result.wrongAnswers.forEach(wrong => {
        const current = topicPerformance.get(wrong.topic) || { correct: 0, total: 0 };
        current.total += 1;
        topicPerformance.set(wrong.topic, current);
      });
      
      // 假設每個主題都有一些正確答案（簡化計算）
      const topicsInExam = [...new Set(result.wrongAnswers.map(w => w.topic))];
      topicsInExam.forEach(topic => {
        const current = topicPerformance.get(topic) || { correct: 0, total: 0 };
        current.correct += Math.floor(result.correctAnswers / topicsInExam.length);
        topicPerformance.set(topic, current);
      });
    });

    // 計算各主題正確率
    const topicAccuracies = Array.from(topicPerformance.entries()).map(([topic, perf]) => ({
      topic,
      accuracy: perf.total > 0 ? (perf.correct / (perf.correct + perf.total)) * 100 : 100
    }));

    const weakTopics = topicAccuracies
      .filter(t => t.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map(t => t.topic);

    const strongTopics = topicAccuracies
      .filter(t => t.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .map(t => t.topic);

    // 生成整體建議
    const overallAccuracy = examResults.reduce((sum, result) => sum + result.accuracy, 0) / examResults.length;
    
    let overallRecommendation = '';
    if (overallAccuracy >= 80) {
      overallRecommendation = '您的整體表現很好！繼續保持並挑戰更難的題目。';
    } else if (overallAccuracy >= 60) {
      overallRecommendation = '您的基礎不錯，但還有提升空間。專注於薄弱環節的練習。';
    } else {
      overallRecommendation = '建議重新學習基礎概念，並從簡單題目開始練習。';
    }

    // 生成下一步建議
    const nextSteps = [];
    if (weakTopics.length > 0) {
      nextSteps.push(`重點加強：${weakTopics.slice(0, 2).join('、')}`);
    }
    if (strongTopics.length > 0) {
      nextSteps.push(`保持優勢：${strongTopics.slice(0, 2).join('、')}`);
    }
    nextSteps.push('定期練習並檢視進度');
    nextSteps.push('使用AI助理解答疑問');

    return {
      weakTopics,
      strongTopics,
      overallRecommendation,
      nextSteps
    };
  }

  /**
   * 觸發AI學習分析
   */
  triggerLearningAnalysis(): Observable<any> {
    return this.ragService.getLearningAnalysis();
  }

  /**
   * 開始AI引導教學
   */
  startGuidedTutoring(topic: string): Observable<any> {
    const question = `請用引導式教學方法教我${topic}的概念`;
    return this.ragService.sendMessage(question, 'tutoring', 'gemini');
  }
}
