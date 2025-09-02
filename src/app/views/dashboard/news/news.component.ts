import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 針對卡片資料定義一個介面，確保資料格式一致
interface CardData {
  headerType: 'image' | 'text'; // 標頭可以是圖片或文字
  headerContent: string; // 根據 headerType，這會是圖片網址或文字內容
  tags: string[];
  headline: string;
  subheadline: string;
  date: string;
  url: string;
}

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  // 存放三張卡片資料的陣列
  cards: CardData[] = [
    {
      headerType: 'image',
      headerContent: 'https://s4.itho.me/sites/default/files/styles/picture_size_large/public/field/image/jie_tu_2025-09-02_xia_wu_5.22.09.png?itok=GlwOcuUO', // 請替換為您自己的圖片網址
      tags: ['新聞', 'AI', '智慧國家', '數位政府高峰會'],
      headline: '數位政府高峰會：發部揭智慧國家發展新願景，從算力、資料、人才3大基礎加速智慧國家發展',
      subheadline: '我國數位政府發展，過去以應個人服務為主，歷經線上服務，讓民眾可不需跑櫃，使用電腦或手機辦理線上服務，...',
      date: '2025-09-02',
      url: 'https://www.ithome.com.tw/news/170953',
    },
    {
      headerType: 'image',
      headerContent: 'https://s4.itho.me/sites/default/files/styles/picture_size_small/public/field/image/shadowsilk-1-4-156.jpg?itok=cor-zrHn', // 請替換為您自己的圖片網址
      tags: ['新聞', '中國駭客', '俄羅斯駭客', 'ShadowSilk'],
      headline: '俄羅斯、中國駭客組成網路犯罪集團ShadowSilk，利用滲透測試工具和已知漏洞，入侵中亞、亞太地區政府機關',
      subheadline: '...',
      date: '2025-09-02',
      url: 'https://www.ithome.com.tw/news/170955',
    },
    {
      headerType: 'image',
      headerContent: 'https://s4.itho.me/sites/default/files/styles/picture_size_large/public/field/image/zi_an_yue_bao_2025nian_8yue_.jpg?itok=fNjvjHAX',
      tags: ['新聞', '資安月報', '資安週一'],
      headline: '【資安月報】2025年8月，駭客鎖定Salesforce用戶，語音釣餌和第三方應用程式主要破口',
      subheadline: '在2025年8月資安新聞中，攻擊者鎖定Salesforce用戶竊取資料的資安事故，...',
      date: '2025-09-02',
      url: 'https://www.ithome.com.tw/news/170940',
    },
  ];

}
