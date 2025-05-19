import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { PastExamReviewComponent } from './views/students/past-exam-review/past-exam-review.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DefaultLayoutComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            {
                path: '',
                loadChildren: () => import('./views/dashboard/routes').then(m => m.routes)
            },
            {
                path: 'whiteboard',
                loadChildren: () => import('./views/whiteboard/routes').then(m => m.routes)
            },
            {
                path: 'students',
                loadChildren: () => import('./views/students/routes').then(m => m.routes)
            }
        ]
    },
];
