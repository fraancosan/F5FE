import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalStorage } from '../common/local-storage';
import { Navigation } from '../common/navigation';
import { catchError, tap, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private urlBack: string = environment.urlBackend;
  // Observable para el estado de autenticación (logueado/no logueado)
  private authStatus = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.authStatus.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageSv: LocalStorage,
    private navSv: Navigation
  ) {
    this.authStatus.next(!!this.localStorageSv.getItem('token'));
  }

  signOut(sendLogin: boolean = false) {
    this.localStorageSv.removeItem('token');
    this.authStatus.next(false);
    if (sendLogin) {
      this.navSv.toPageTop('/iniciar-sesion');
    }
  }

  signIn(data: { mail: string; contraseña: string }) {
    this.localStorageSv.removeItem('token');
    return this.http.post(this.urlBack + 'usuarios/login', data).pipe(
      tap((res: any) => {
        this.localStorageSv.setItem('token', res.token);
        this.authStatus.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        // habria que incluir un servicio de notificaciones
        return throwError(() => error);
      })
    );
  }
}
