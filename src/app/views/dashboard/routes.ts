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
        path: 'quiz-demo',
        loadComponent: () => import('./quiz-demo/quiz-demo.component').then(m => m.QuizDemoComponent),
        data: {
          title: '測驗演示'
        }
    },
    {
        path: 'web-ai-assistant',
        loadComponent: () => import('./web-ai-assistant/web-ai-assistant.component').then(m => m.WebAiAssistantComponent),
        data: {
          title: '網頁 AI 助理'
        }
    }
];
