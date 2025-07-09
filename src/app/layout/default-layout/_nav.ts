import { INavData } from '@coreui/angular';
import { cilBrush } from '@coreui/icons';

export const navItems: INavData[] = [
  {
    name: '概覽',
    url: '/dashboard/overview',
    iconComponent: { name: 'cilSpeedometer' },
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
        name: '測驗中心',
        url: '/dashboard/quiz-center'
      },
      {
        name: '錯題分析',
        url: '/dashboard/mistake-analysis'
      }
    ]
  },
  {
    name: '錯誤分析',
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
    iconComponent: { name: 'cilCog' },
    children: [
      {
        name: 'AI 導師',
        url: '/dashboard/ai-chat',
        iconComponent: { name: 'cilSpeech' }
      }
    ]
  }
]; 