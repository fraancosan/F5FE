import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { SignIn } from './pages/sign-in/sign-in';
import { SignUp } from './pages/sign-up/sign-up';
import { Reserva } from './pages/reserva/reserva';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'signin', component: SignIn },
  { path: 'signup', component: SignUp },
  { path: 'reserva', component: Reserva },
  { path: 'home', component: Home },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

/*
export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
  },

  {
    path: 'inicio',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },

  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/sign-in/sign-in').then(m => m.SignIn),
  },

  {
    path: 'registrarse',
    loadComponent: () => import('./pages/sign-up/sign-up').then(m => m.SignUp),
  },

  {
    path: 'reserva',
    loadComponent: () => import('./pages/reserva/reserva').then(m => m.Reserva),
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
*/
