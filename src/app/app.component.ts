import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    standalone: true,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MIS_Teach';

  constructor(private titleService: Title) {}

  ngOnInit() {
    // 設定瀏覽器標題
    this.titleService.setTitle('MIS_Teach - 智慧學習系統');
  }
}
