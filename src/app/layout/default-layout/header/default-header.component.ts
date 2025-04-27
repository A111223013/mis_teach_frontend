import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ContainerComponent, HeaderComponent, HeaderNavComponent, NavItemComponent, 
  NavLinkDirective, 
  HeaderModule, NavModule,
  DropdownModule,
  DropdownToggleDirective,
  DropdownItemDirective,
  DropdownMenuDirective
} from '@coreui/angular';
import { IconDirective, IconModule, IconSetService } from '@coreui/icons-angular';
import { navItems } from '../_nav';
import { 
  cilAccountLogout, 
  cilSpeedometer, cilBook, cilPeople, cilChartPie,
  cilBrush
} from '@coreui/icons';

@Component({
  selector: 'app-default-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContainerComponent, 
    HeaderModule, 
    NavModule,
    DropdownModule,
    DropdownToggleDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    IconModule,
    IconDirective 
  ],
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent {
  public navItems = navItems;

  constructor(private iconSetService: IconSetService) {
    iconSetService.icons = { 
      cilAccountLogout, 
      cilSpeedometer, cilBook, cilPeople, cilChartPie, 
      cilBrush
    };
  }
} 