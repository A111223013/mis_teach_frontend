import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: '課程',
    url: '/dashboard/courses',
    iconComponent: { name: 'cilBook' }
  },
  {
    name: '測驗中心',
    url: '/dashboard/quiz-center',
    iconComponent: { name: 'cilSchool' }
  },
  {
    name: '錯題統整',
    url: '/dashboard/mistake-analysis',
    iconComponent: { name: 'cilList' }
  },
  {
    name: '學習分析',
    url: '/dashboard/learning-analytics',
    iconComponent: { name: 'cilChartPie' }
  },
  {
    name: '科技趨勢',
    url: '/dashboard/news',
    iconComponent: { name: 'cilNewspaper' }
  },
]; 