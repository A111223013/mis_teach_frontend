import { Routes } from '@angular/router';
import { PastExamReviewComponent } from './past-exam-review/past-exam-review.component';
import {PastChoiceComponent} from './past-choice/past-choice.component'
import {PastExamComponent} from './past-exam/past-exam.component'

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
    },
    {
        path: 'past-choice',
        component: PastChoiceComponent,
        data: { title: '考古題選擇' }

    },
    {
        path: 'past-exam',
        component: PastExamComponent,
        data: { title: '考古題複習' }
    }
];
