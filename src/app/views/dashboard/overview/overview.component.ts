import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ContainerComponent, HeaderComponent, HeaderNavComponent, 
  NavItemComponent, NavLinkDirective, ButtonDirective, ButtonGroupComponent
} from '@coreui/angular';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilSpeedometer, cilBook, cilPeople, cilChartPie, cilExitToApp, cilUser } from '@coreui/icons';
import { LoginService } from '../../../service/login.service';

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
    CardHeaderComponent,
    ContainerComponent, 
    HeaderComponent, 
    HeaderNavComponent,
    NavItemComponent,
    NavLinkDirective,
    IconDirective,
    ButtonDirective,
    ButtonGroupComponent,
  ]
})
export class OverviewComponent implements OnInit {
  userName: string = "";
  currentDate: Date = new Date();
  
  constructor(private iconSetService: IconSetService, private loginService: LoginService) { 
    iconSetService.icons = { 
      cilSpeedometer, cilBook, cilPeople, cilChartPie, cilUser, cilExitToApp
    };
  }

  ngOnInit(): void {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      console.log('Current user email:', userEmail);
      this.loginService.getUserInfo().subscribe(
        (response: any) => {
          console.log('Successfully retrieved user info', response);
          if (response && response.data) {
            this.userName = response.data.name; 
          } else {
            console.error('Unexpected response structure:', response);
            this.userName = '用戶';
          }
        },
        (error: any) => {
          console.error('Error fetching user info:', error);
          this.userName = '用戶';
        }
      );
    } else {
       this.userName = '訪客';
    }
  }
}
