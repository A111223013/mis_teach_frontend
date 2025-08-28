import { Component, OnInit, } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  CardComponent, CardBodyComponent,
  ContainerComponent, 
  ListGroupModule,
  TableModule
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilUser } from '@coreui/icons';
import { DashboardService } from '../../../service/dashboard.service';
import { Chart } from 'chart.js';
import { MathJaxService } from '../../../service/mathjax.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        DatePipe,
        CardComponent,
        CardBodyComponent,
        ContainerComponent,
        IconDirective,
        ListGroupModule,
        TableModule
    ]
})
export class OverviewComponent implements OnInit {
  userName: string = "";
  currentDate: Date = new Date();
  

  constructor(
    private iconSetService: IconSetService, 
    private dashboardService: DashboardService,
    private mathJaxService: MathJaxService
  ) { 
    iconSetService.icons = { cilUser };
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.dashboardService.getUserInfo().subscribe(
      (data: any) => {
        this.userName = data.name;
      },
      (error: any) => {
        console.error('Error fetching user info:', error);
      }
    );
  }
}
