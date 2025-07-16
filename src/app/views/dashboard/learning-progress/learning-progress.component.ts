import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardModule,
  ButtonModule,
  GridModule,
  ProgressModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { RagAssistantService } from '../../../service/rag-assistant.service';

@Component({
  selector: 'app-learning-progress',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    GridModule,
    ProgressModule,
    BadgeModule,
    IconModule
  ],
  templateUrl: './learning-progress.component.html',
  styleUrls: ['./learning-progress.component.scss']
})
export class LearningProgressComponent implements OnInit {
  loading: boolean = true;
  
  // 整體進度
  overallProgress: number = 68;
  completedTopics: number = 15;
  totalTopics: number = 25;
  totalQuizCount: number = 42;
  correctRate: number = 76;
  totalTime: string = '28.5h';
  weeklyTime: number = 5.2;
  
  // 知識點進度
  topicProgressList = [
    {
      name: '資料庫',
      progress: 85,
      completedSubtopics: 17,
      totalSubtopics: 20,
      lastStudied: '2天前'
    },
    {
      name: '網路',
      progress: 65,
      completedSubtopics: 13,
      totalSubtopics: 20,
      lastStudied: '1週前'
    },
    {
      name: '演算法',
      progress: 50,
      completedSubtopics: 10,
      totalSubtopics: 20,
      lastStudied: '3天前'
    },
    {
      name: '資訊安全',
      progress: 40,
      completedSubtopics: 8,
      totalSubtopics: 20,
      lastStudied: '2週前'
    },
    {
      name: '軟體工程',
      progress: 70,
      completedSubtopics: 14,
      totalSubtopics: 20,
      lastStudied: '昨天'
    }
  ];
  
  // 建議學習計劃
  recommendations = [
    {
      title: '鞏固網路基礎知識',
      description: '根據您最近的測驗結果，建議複習網路協議相關內容',
      topic: '網路',
      estimatedTime: '2 小時'
    },
    {
      title: '演算法進階學習',
      description: '您已完成基礎演算法學習，現在可以進入更高級的圖算法主題',
      topic: '演算法',
      estimatedTime: '3 小時'
    },
    {
      title: '資訊安全漏洞分析',
      description: '這是您最薄弱的領域之一，建議加強學習',
      topic: '資訊安全',
      estimatedTime: '2.5 小時'
    }
  ];
  
  constructor(private ragService: RagAssistantService) {}
  
  ngOnInit(): void {
    // 模擬 API 加載
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  
  getProgressColor(progress: number): string {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'danger';
  }
}
