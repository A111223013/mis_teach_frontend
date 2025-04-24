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
    url: '/dashboard/students',
    iconComponent: { name: 'cilPeople' }
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
  }

  // Add other navigation items here
]; 