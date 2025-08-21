import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalStorage } from '../common/local-storage';
import { Navigation } from '../common/navigation';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private urlBack: string = environment.urlBackend;

  constructor(
    private http: HttpClient,
    private localStorageSv: LocalStorage,
    private navSv: Navigation
  ) {}

  signOut(sendLogin: boolean = false) {
    this.localStorageSv.removeItem('token');
    if (sendLogin) {
      this.navSv.toPageTop('/iniciar-sesion');
    }
  }

  signIn(data: { mail: string; contraseña: string }) {
    this.localStorageSv.removeItem('token');
    return this.http.post(this.urlBack + 'usuarios/login', data).pipe(
      tap((res: any) => {
        this.localStorageSv.setItem('token', res.token);
      }),
      catchError((error: HttpErrorResponse) => {
        // habria que incluir un servicio de notificaciones
        return throwError(() => error);
      })
    );
  }
}
