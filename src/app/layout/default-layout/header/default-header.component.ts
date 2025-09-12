import { Component, Input, ViewChild } from '@angular/core';
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
import { AuthService } from '../../../service/auth.service';
import { SettingsComponent } from '../../../views/settings/settings.component';
import { 
  cilAccountLogout, 
  cilSpeedometer, cilBook, cilSchool, cilChartPie,
  cilBrush, cilCog, cilSettings, cilSpeech, cilNewspaper,
  cilQrCode, cilTag, cilImage
} from '@coreui/icons';

@Component({
    selector: 'app-default-header',
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
        IconDirective,
        SettingsComponent
    ],
    standalone: true,
    templateUrl: './default-header.component.html',
    styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent {
  @ViewChild(SettingsComponent) settingsComponent!: SettingsComponent;
  public navItems = navItems;

  constructor(
    private iconSetService: IconSetService,
    private authService: AuthService
  ) {
    iconSetService.icons = { 
      cilAccountLogout, 
      cilSpeedometer, cilBook, cilSchool, cilChartPie, 
      cilBrush, cilCog, cilSettings, cilSpeech, cilNewspaper,
      cilQrCode, cilTag, cilImage
    };
  }

  openSettingsModal(): void {
    if (this.settingsComponent) {
      this.settingsComponent.openModal();
    }
  }

  logout(): void {
    this.authService.logout();
  }
} 