import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { equipo } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Equipo {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll(nombre?: string): Observable<equipo[]> {
    return this.http
      .get<equipo[]>(
        this.urlBack + nombre ? `equipos?nombre=${nombre}` : 'equipos'
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

  getById(id: number, includeTorneo: boolean = false): Observable<equipo> {
    return this.http
      .get<equipo>(
        this.urlBack +
          'equipos/' +
          id +
          (includeTorneo ? '?includeTorneo=true' : '')
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message =
            error.status === 404
              ? 'No se ha encontrado el equipo'
              : 'Error al contactar con el servidor';
          this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
          });
          return throwError(() => error);
        })
      );
  }

  create(nombre: string): Observable<any> {
    return this.http
      .post(this.urlBack + 'equipos', {
        nombre: nombre,
      })
      .pipe(
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

  update(id: number, nombre: string): Observable<any> {
    return this.http
      .patch(this.urlBack + 'equipos/' + id, {
        nombre: nombre,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let message = '';
          if (error.status === 400) {
            message = 'Error en los datos enviados';
          } else if (error.status === 404) {
            message = 'No se ha encontrado el equipo';
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
    return this.http.delete(this.urlBack + 'equipos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el equipo'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
