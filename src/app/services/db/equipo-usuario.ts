import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { equipoUsuario } from '../../Interfases/interfaces';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipoUsuario {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll({
    idEquipo,
    idUsuario,
  }: {
    idEquipo?: number;
    idUsuario?: number;
  }): Observable<equipoUsuario[]> {
    let queryParams: string[] = [];
    if (idEquipo) {
      queryParams.push(`idEquipo=${idEquipo}`);
    }
    if (idUsuario) {
      queryParams.push(`idUsuario=${idUsuario}`);
    }
    const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
    return this.http
      .get<equipoUsuario[]>(this.urlBack + 'equiposUsuarios' + queryString)
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

  getById(id: number): Observable<equipoUsuario> {
    return this.http
      .get<equipoUsuario>(this.urlBack + 'equiposUsuarios/' + id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message =
            error.status === 404
              ? 'No se ha encontrado la relación'
              : 'Error al contactar con el servidor';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
          });
          return throwError(() => error);
        })
      );
  }

  create(body: Pick<equipoUsuario, 'idEquipo' | 'idUsuario'>): Observable<any> {
    return this.http.post(this.urlBack + 'equiposUsuarios', body).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 400
            ? 'Error en los datos enviados'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  update(
    id: number,
    body: Partial<Pick<equipoUsuario, 'idEquipo' | 'idUsuario'>>
  ): Observable<any> {
    return this.http.patch(this.urlBack + 'equiposUsuarios/' + id, body).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 400) {
          message = 'Error en los datos enviados';
        } else if (error.status === 404) {
          message = 'No se ha encontrado la relación';
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
    return this.http.delete(this.urlBack + 'equiposUsuarios/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado la relación'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
