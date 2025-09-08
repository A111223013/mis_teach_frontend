import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
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
                path: 'material/:keypoint',
                loadComponent: () => import('./views/dashboard/material/material.component').then(m => m.MaterialComponent),
                data: { title: '教材' }
            }
        ]
    },
];
