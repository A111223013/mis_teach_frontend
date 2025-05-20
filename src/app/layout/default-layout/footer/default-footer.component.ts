import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-default-footer',
    imports: [CommonModule],
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent {
  public year = new Date().getFullYear();
} 