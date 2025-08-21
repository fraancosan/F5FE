import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./pages/home/home'),
  },

  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/sign-in/sign-in'),
  },

  {
    path: 'registrarse',
    loadComponent: () => import('./pages/sign-up/sign-up'),
  },

  {
    path: 'sign-in',
    redirectTo: 'iniciar-sesion',
  },

  {
    path: 'sign-up',
    redirectTo: 'registrarse',
  },

  { path: '**', redirectTo: 'inicio' },
];
