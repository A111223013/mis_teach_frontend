import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';
import { SettingsComponent } from './views/settings/settings.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingsComponent },
    {
        path: 'dashboard',
        component: DefaultLayoutComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            {
                path: '',
                loadChildren: () => import('./views/dashboard/routes').then(m => m.routes)
            }
        ]
    },
];
