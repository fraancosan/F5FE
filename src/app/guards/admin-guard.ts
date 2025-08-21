import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/common/auth';
import { Navigation } from '../services/common/navigation';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const nav = inject(Navigation);

  if (auth.admin()) {
    return true;
  } else {
    nav.toPageTop('/iniciar-sesion');
    return false;
  }
};
