import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./pages/home/home'),
  },

  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in'),
  },

  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up'),
  },

  { path: '**', redirectTo: 'inicio' },
];
