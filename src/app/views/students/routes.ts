import { Routes } from '@angular/router';
import { PastExamReviewComponent } from './past-exam-review/past-exam-review.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'past-exam-review',
        pathMatch: 'full'
    },
    {
        path: 'past-exam-review',
        component: PastExamReviewComponent,
        data: { title: '考古題複習' }
    }
];
