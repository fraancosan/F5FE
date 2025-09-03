import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing directo
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing').then((m) => m.default),
  },

  // Grupo con layout principal (header + footer)
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-layout/home-layout').then((m) => m.HomeLayout),
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/home/home').then((m) => m.default),
      },
      {
        path: 'iniciar-sesion',
        loadComponent: () =>
          import('./pages/sign-in/sign-in').then((m) => m.default),
      },
      {
        path: 'registrarse',
        loadComponent: () =>
          import('./pages/sign-up/sign-up').then((m) => m.default),
      },
      {
        path: 'reserva',
        loadComponent: () =>
          import('./pages/reserva/reserva').then((m) => m.default),
      },
    ],
  },

  { path: 'sign-in', redirectTo: 'iniciar-sesion', pathMatch: 'full' },
  { path: 'sign-up', redirectTo: 'registrarse', pathMatch: 'full' },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
