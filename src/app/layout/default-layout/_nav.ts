import { INavData } from '@coreui/angular';
import { cilBrush } from '@coreui/icons';

export const navItems: INavData[] = [
  {
    name: '概覽',
    url: '/dashboard/overview',
    iconComponent: { name: 'cilSpeedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: '課程',
    url: '/dashboard/courses',
    iconComponent: { name: 'cilBook' }
  },
  {
    name: '學生',
    iconComponent: { name: 'cilPeople' },
    children: [
      {
        name: '考古題複習',
        url: '/dashboard/students/past-exam-review'
      },
      {
        name: '錯題複習',
        url: '/dashboard/students/mistake-review'
      },
      {
        name: 'AI出題',
        url: '/dashboard/students/ai-quiz'
      },
      {
         name: '選擇考古題',
        url: '/dashboard/students/past-choice'

      },
      {
        name: '考古題複習',
        url: '/dashboard/students/past-exam'
      },
      {
        name: '作答考古題',
        url: '/dashboard/students/past-answer-exam'
      }
    ]
  },
  {
    name: '分析',
    url: '/dashboard/analytics',
    iconComponent: { name: 'cilChartPie' }
  },
  {
    name: '繪圖板',
    url: '/dashboard/whiteboard',
    iconComponent: { name: 'cilBrush' }
  },
  {
    name: '智能學習系統',
    iconComponent: { name: 'cilBook' },
    children: [
      {
        name: '測驗演示',
        url: '/dashboard/quiz-demo'
      },
      {
        name: 'AI 助理',
        url: '/dashboard/ai-chat'
      }
    ]
  }
  // Add other navigation items here
]; 