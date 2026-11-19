import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login').then((m) => m.Login) },
  { path: 'registro', loadComponent: () => import('./features/auth/register').then((m) => m.Register) },
  {
    path: 'solicitudes',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/credit-requests/credit-request-list').then((m) => m.CreditRequestList) },
      { path: 'nueva', loadComponent: () => import('./features/credit-requests/credit-request-form').then((m) => m.CreditRequestForm) },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'solicitudes' },
  { path: '**', redirectTo: 'solicitudes' },
];
