import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: '課程',
    url: '/dashboard/courses',
    iconComponent: { name: 'cilBook' }
  },
  {
    name: '學習中心',
    iconComponent: { name: 'cilSchool' },
    children: [
      {
        name: '測驗中心',
        url: '/dashboard/quiz-center'
      },
      {
        name: '錯題統整',
        url: '/dashboard/mistake-analysis'
      }
    ]
  },
  {
    name: '學習分析',
    url: '/dashboard/learning-analytics',
    iconComponent: { name: 'cilChartPie' }
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
  },
  {
    name: '科技趨勢',
    url: '/dashboard/news',
    iconComponent: { name: 'cilNewspaper' }
  },
]; 