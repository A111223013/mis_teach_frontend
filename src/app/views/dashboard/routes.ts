import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TestAiComponent } from './test-ai/test-ai.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
    },
    {
        path: 'overview',
        component: OverviewComponent
    },
    {
        path: 'test_ai',
        component: TestAiComponent
    }
];
