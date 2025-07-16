import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
    },
    {
        path: 'overview',
        component: OverviewComponent
    },
    {
        path: 'ai-chat',
        loadComponent: () => import('./ai-chat/ai-chat.component').then(m => m.AiChatComponent),
        data: {
          title: 'AI 導師'
        }
    },
    {
        path: 'quiz-result/:resultId',
        loadComponent: () => import('./quiz-result/quiz-result.component').then(m => m.QuizResultComponent),
        data: {
          title: '測驗結果'
        }
    },
    {
        path: 'ai-tutoring/:sessionId',
        loadComponent: () => import('./ai-tutoring/ai-tutoring.component').then(m => m.AiTutoringComponent),
        data: {
          title: 'AI 智能教學'
        }
    },
    {
        path: 'ai-tutoring',
        loadComponent: () => import('./ai-tutoring/ai-tutoring.component').then(m => m.AiTutoringComponent),
        data: {
          title: 'AI 錯題復習'
        }
    },
    {
        path: 'quiz-center',
        loadComponent: () => import('./quiz-center/quiz-center.component').then(m => m.QuizCenterComponent),
        data: {
          title: '測驗中心'
        }
    },
    {
        path: 'mistake-analysis',
        loadComponent: () => import('./mistake-analysis/mistake-analysis.component').then(m => m.MistakeAnalysisComponent),
        data: {
          title: '錯題分析'
        }
    },
    {
        path: 'quiz-taking/:quizId',
        loadComponent: () => import('./quiz-taking/quiz-taking.component').then(m => m.QuizTakingComponent),
        data: {
          title: '測驗進行中'
        }
    },
    {
        path: 'quiz-taking',
        loadComponent: () => import('./quiz-taking/quiz-taking.component').then(m => m.QuizTakingComponent),
        data: {
          title: '測驗進行中'
        }
    },
    {
        path: 'web-ai-assistant',
        loadComponent: () => import('./web-ai-assistant/web-ai-assistant.component').then(m => m.WebAiAssistantComponent),
        data: {
          title: '網頁 AI 助理'
        }
    },
    {
        path: 'analytics',
        redirectTo: 'overview',
        pathMatch: 'full'
    }
];
