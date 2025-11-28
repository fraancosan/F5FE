import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/common/auth';
import { Navigation } from '../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const nav = inject(Navigation);
  const notify = inject(MatSnackBar);

  if (auth.admin()) {
    return true;
  } else {
    notify.open('Primero debe iniciar sesión como Administrador', 'Cerrar', {
      duration: 5000,
    });
    nav.toPageTop('/iniciar-sesion');
    return false;
  }
};
