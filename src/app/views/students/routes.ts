import { Routes } from '@angular/router';
import { ErrorRetrievalComponent } from './error-retrieval/error-retrieval.component';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'error-retrieval',
        pathMatch: 'full'
    },
    {
        path: 'error-retrieval',
        component: ErrorRetrievalComponent,
        data: { title: '錯誤檢索' }
    }
];
