import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private localStorageSv: LocalStorage) {}

  getToken() {
    return this.localStorageSv.getItem('token');
  }

  decodeToken(token: string) {
    const jwtHelper = new JwtHelperService();
    return jwtHelper.decodeToken(token);
  }

  isTokenValid() {
    const token = this.getToken();
    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }

  admin() {
    const token = this.getToken();
    if (token && this.isTokenValid()) {
      const decoded = this.decodeToken(token);
      return decoded.rol === 'admin';
    }
    return false;
  }

  user() {
    const token = this.getToken();
    if (token && this.isTokenValid()) {
      const decoded = this.decodeToken(token);
      return decoded.rol === 'usuario';
    }
    return false;
  }
}
