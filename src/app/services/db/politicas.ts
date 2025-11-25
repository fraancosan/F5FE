import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of, throwError } from 'rxjs';
import { politica } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Politicas {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll(): Observable<politica[]> {
    return this.http.get<politica[]>(this.urlBack + 'politicas').pipe(
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

  getByNombre(nombre: string): Observable<politica> {
    return this.http.get<politica>(this.urlBack + 'politicas/' + nombre).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado la política'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(data: politica): Observable<any> {
    return this.http.post(this.urlBack + 'politicas', data).pipe(
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

  update(nombre: string, descripcion: string): Observable<any> {
    return this.http
      .patch(this.urlBack + 'politicas/' + nombre, { descripcion })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let message = '';
          if (error.status === 400) {
            message = 'Error en los datos enviados';
          } else if (error.status === 404) {
            message = 'No se ha encontrado la política';
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

  delete(nombre: string): Observable<any> {
    return this.http.delete(this.urlBack + 'politicas/' + nombre).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado la política'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
