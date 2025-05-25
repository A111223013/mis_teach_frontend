import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from '@coreui/angular';
import { DefaultHeaderComponent } from './header/default-header.component';
import { DefaultFooterComponent } from './footer/default-footer.component';

@Component({
    selector: 'app-default-layout',
    imports: [
        CommonModule,
        RouterOutlet,
        ContainerComponent,
        DefaultHeaderComponent,
        DefaultFooterComponent,
    ],
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent { }
