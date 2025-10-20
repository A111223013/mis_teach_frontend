import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, HttpClientModule], // ✅ 加上 HttpClientModule
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  cards: CardData[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<CardData[]>('http://localhost:5000/api/news').subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: (err) => {
        console.error('載入新聞失敗：', err);
      }
    });
  }
}
