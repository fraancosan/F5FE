import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../services/common/auth';
import { Navigation } from '../services/common/navigation';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const nav = inject(Navigation);

  if (auth.user()) {
    return true;
  } else {
    nav.toPageTop('/iniciar-sesion');
    return false;
  }
};
