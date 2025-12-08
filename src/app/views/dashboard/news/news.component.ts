import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconModule, IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilMagnifyingGlass, cilX, cilCalendar, cilArrowRight, cilNewspaper } from '@coreui/icons';
import { NewsService, NewsItem } from '../../../service/news.service';

interface Tag {
  text: string;
  href: string;
}

interface CardData {
  headerType: 'image' | 'text';
  headerContent: string;
  tags: Tag[];
  headline: string;
  subheadline: string;
  date: string;
  url: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, IconModule, IconDirective],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [];
  cards: CardData[] = [];
  
  // 分頁相關
  currentPage: number = 1;
  perPage: number = 12;
  totalPages: number = 1;
  totalItems: number = 0;
  hasNext: boolean = false;
  hasPrev: boolean = false;
  
  // 搜尋
  searchTerm: string = '';
  
  // 載入狀態
  loading: boolean = false;

  constructor(
    private newsService: NewsService,
    private iconSetService: IconSetService
  ) {
    // 註冊圖標
    const existingIcons = iconSetService.icons || {};
    iconSetService.icons = {
      ...existingIcons,
      ...{ cilMagnifyingGlass, cilX, cilCalendar, cilArrowRight, cilNewspaper }
    };
  }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;
    this.newsService.getNews(this.currentPage, this.perPage, this.searchTerm || undefined).subscribe({
      next: (response) => {
        this.newsItems = response.data;
        this.cards = this.newsItems.map(item => ({
          headerType: item.image ? 'image' : 'text',
          headerContent: item.image || '新聞',
          tags: item.tags || [],
          headline: item.title,
          subheadline: item.summary,
          date: item.date,
          url: item.href.startsWith('http') ? item.href : `https://www.ithome.com.tw${item.href}`
        }));
        
        this.currentPage = response.pagination.current_page;
        this.totalPages = response.pagination.total_pages;
        this.totalItems = response.pagination.total;
        this.hasNext = response.pagination.has_next;
        this.hasPrev = response.pagination.has_prev;
        this.loading = false;
      },
      error: (err) => {
        console.error('載入新聞失敗：', err);
        this.loading = false;
      }
    });
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadNews();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.loadNews();
  }

  clearSearch() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadNews();
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 7) {
      // 總頁數少於等於 7 頁，全部顯示
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // 總頁數超過 7 頁
      if (current <= 4) {
        // 當前頁在前 4 頁
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        // 當前頁在後 4 頁
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // 當前頁在中間
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  }
}
