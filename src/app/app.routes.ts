import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing'),
  },

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
    path: 'reserva',
    loadComponent: () => import('./pages/reserva/reserva'),
  },

  {
    path: 'sign-in',
    redirectTo: 'iniciar-sesion',
  },

  {
    path: 'sign-up',
    redirectTo: 'registrarse',
  },

  { path: '**', redirectTo: 'landing' },
];
