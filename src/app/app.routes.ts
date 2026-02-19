import { Routes } from '@angular/router';
import { userGuard } from './guards/user-guard';
import { adminGuard } from './guards/admin-guard';

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
        canActivate: [userGuard],
        loadComponent: () => import('./pages/home-sections/reserva/reserva'),
      },
      {
        path: 'buscar-partido',
        canActivate: [userGuard],
        loadComponent: () =>
          import('./pages/home-sections/buscar-partido/buscar-partido'),
      },
      {
        path: 'torneo',
        canActivate: [userGuard],
        loadComponent: () => import('./pages/home-sections/torneo/torneo'),
      },
      {
        path: 'mis-turnos',
        canActivate: [userGuard],
        loadComponent: () => import('./pages/mis-turnos/mis-turnos'),
      },
      {
        path: 'mi-cuenta',
        canActivate: [userGuard],
        loadComponent: () => import('./pages/mi-cuenta/mi-cuenta'),
      },
      {
        path: 'crear-equipo',
        canActivate: [userGuard],
        loadComponent: () =>
          import('./pages/home-sections/crear-equipo/crear-equipo'),
      },
      {
        path: 'gestionar-equipo',
        canActivate: [userGuard],
        loadComponent: () =>
          import('./pages/home-sections/gestionar-equipo/gestionar-equipo'),
      },
      {
        path: 'muro',
        loadComponent: () => import('./pages/home-sections/muro/muro'),
      },
      {
        path: 'inscripcion-torneo',
        canActivate: [userGuard],
        loadComponent: () => import('./pages/home-sections/torneo/inscripcion-torneo/inscripcion-torneo'),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {  
            path: 'turnos',
            loadComponent: () => import('./pages/admin/gestion-turnos/gestion-turnos'),
          },
          {
            path: 'torneos',
            loadComponent: () => import('./pages/admin/gestion-torneos/gestion-torneos'),
          },
          {
            path: 'canchas',
            loadComponent: () => import('./pages/admin/gestion-canchas/gestion-canchas'),
          },
          {
            path: 'politicas',
            loadComponent: () => import('./pages/admin/gestion-politicas/gestion-politicas'),
          },
          {
            path: 'informes',
            loadComponent: () => import('./pages/admin/informes/informes'),
          },
          {
            path: 'crear-politica',
            loadComponent: () => import('./pages/admin/gestion-politicas/crear-politica/crear-politica'),
          },
          {
            path: 'editar-politica/:nombre',
            loadComponent: () => import('./pages/admin/gestion-politicas/crear-politica/crear-politica'),
          },
          {
            path: 'ingresos-brutos',
            loadComponent: () => import('./pages/admin/informes/ingresos-brutos/ingresos-brutos'),
          },
          {
            path: 'reservas-canceladas',
            loadComponent: () => import('./pages/admin/informes/reservas-canceladas/reservas-canceladas'),
          },
          //AGREGAR RUTA PARA COMUNICACIONES ADMINISTRADOR (MURO Y ENVIAR MENSAJE)
        ],
      }
    ],

  },

  { path: 'sign-in', redirectTo: 'iniciar-sesion', pathMatch: 'full' },
  { path: 'sign-up', redirectTo: 'registrarse', pathMatch: 'full' },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
