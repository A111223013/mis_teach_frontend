import { Routes } from '@angular/router';
import { WhiteboardComponent } from './whiteboard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'whiteboard',
        pathMatch: 'full'   
    },
    {
        path: 'whiteboard',
        component: WhiteboardComponent,
        data: {
            title: '繪圖板' // Optional: Page title
        }
    }
];
