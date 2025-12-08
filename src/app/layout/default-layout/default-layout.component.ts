import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { DefaultHeaderComponent } from './header/default-header.component';
import { DefaultFooterComponent } from './footer/default-footer.component';
import { WebAiAssistantComponent } from '../../views/dashboard/web-ai-assistant/web-ai-assistant.component';
import { SidebarService } from '../../service/sidebar.service';


@Component({
    selector: 'app-default-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ContainerComponent,
        DefaultHeaderComponent,
        DefaultFooterComponent,
        WebAiAssistantComponent
    ],
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  sidebarWidth = 380;
  private sidebarSubscription?: Subscription;
  private widthSubscription?: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // 先同步初始狀態
    this.isSidebarOpen = this.sidebarService.getIsOpen();
    this.sidebarWidth = this.sidebarService.getWidth();
    
    // 訂閱狀態變化
    this.sidebarSubscription = this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    // 訂閱寬度變化
    this.widthSubscription = this.sidebarService.width$.subscribe(width => {
      this.sidebarWidth = width;
    });
  }

  ngOnDestroy(): void {
    this.sidebarSubscription?.unsubscribe();
    this.widthSubscription?.unsubscribe();
  }
}
