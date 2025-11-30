import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalStorage } from '../common/local-storage';
import { Navigation } from '../common/navigation';
import {
  catchError,
  tap,
  throwError,
  BehaviorSubject,
  Observable,
  of,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { usuario, usuarioPremium } from '../../Interfases/interfaces';

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
    private navSv: Navigation,
    private snackBar: MatSnackBar
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
        const message =
          error.status !== 500
            ? 'Usuario o contraseña incorrectos'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  getAll(mail?: string): Observable<usuario[]> {
    return this.http
      .get<usuario[]>(
        this.urlBack + mail ? `usuarios?mail=${mail}` : 'usuarios'
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.snackBar.open('Error en solicitud', 'Cerrar', {
              duration: 5000,
            });
            return throwError(() => error);
          } else if (error.status === 404) {
            return of([]);
          } else {
            this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
              duration: 5000,
            });
            return throwError(() => error);
          }
        })
      );
  }

  getOwnAccount(): Observable<usuario> {
    return this.http.get<usuario>(this.urlBack + 'usuarios/mi-cuenta').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }

  getPremium(): Observable<usuarioPremium[]> {
    return this.http
      .get<usuarioPremium[]>(this.urlBack + 'usuarios/premium')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([]);
          } else {
            this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
              duration: 5000,
            });
            return throwError(() => error);
          }
        })
      );
  }

  getById(id: number): Observable<usuario> {
    return this.http.get<usuario>(this.urlBack + 'usuarios/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el usuario'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(usuario: Omit<usuario, 'id'>): Observable<any> {
    return this.http.post(this.urlBack + 'usuarios', usuario).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 400) {
          message = 'Error en los datos enviados';
        } else if (error.status === 409) {
          message = 'El correo electrónico ya está registrado';
        } else {
          message = 'Error al contactar con el servidor';
        }
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  // sirve tanto para administradores como para usuarios comunes, la validación se hace en el backend
  update(usuario: Partial<usuario>): Observable<any> {
    return this.http
      .patch(this.urlBack + 'usuarios/' + usuario.id, usuario)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let message = '';
          if (error.status === 400) {
            message = 'Error en los datos enviados';
          } else if (error.status === 404) {
            message = 'No se ha encontrado el usuario';
          } else {
            message = 'Error al contactar con el servidor';
          }
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
          });
          return throwError(() => error);
        })
      );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(this.urlBack + 'usuarios/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el usuario'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  sendEmail(
    id: number,
    content: { subject: string; text: string }
  ): Observable<any> {
    return this.http
      .post(this.urlBack + 'usuarios/send-email/' + id, content)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let message = '';
          if (error.status === 400) {
            message = 'Error en los datos enviados';
          } else if (error.status === 404) {
            message = 'No se ha encontrado el usuario';
          } else {
            message = 'Error al contactar con el servidor';
          }
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
          });
          return throwError(() => error);
        })
      );
  }
}
