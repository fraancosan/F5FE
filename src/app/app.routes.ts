import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing directo
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing'),
  },

  // Grupo con layout principal (header + footer)
  {
    path: '',
    loadComponent: () => import('./pages/home-layout/home-layout'),
    children: [
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
        loadComponent: () => import('./pages/home-sections/reserva/reserva'),
      },
      {
        path: 'buscar-partido',
        loadComponent: () =>
          import('./pages/home-sections/buscar-partido/buscar-partido'),
      },
      {
        path: 'torneo',
        loadComponent: () => import('./pages/home-sections/torneo/torneo'),
      },
      {
        path: 'crear-equipo',
        loadComponent: () =>
          import('./pages/home-sections/crear-equipo/crear-equipo'),
      },
      {
        path: 'gestionar-equipo',
        loadComponent: () =>
          import('./pages/home-sections/gestionar-equipo/gestionar-equipo'),
      },
      {
        path: 'muro',
        loadComponent: () => import('./pages/home-sections/muro/muro'),
      },
    ],
  },

  { path: 'sign-in', redirectTo: 'iniciar-sesion', pathMatch: 'full' },
  { path: 'sign-up', redirectTo: 'registrarse', pathMatch: 'full' },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
