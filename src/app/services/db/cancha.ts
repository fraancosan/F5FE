import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { cancha } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Cancha {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll(disponible?: boolean): Observable<cancha[]> {
    let url = `${this.urlBack}/canchas`;
    if (disponible !== undefined) {
      url += `?disponible=${disponible ? '1' : '0'}`;
    }
    return this.http.get<cancha[]>(url).pipe(
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

  getById(id: number): Observable<cancha> {
    return this.http.get<cancha>(this.urlBack + 'canchas/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado la cancha'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(disponible: boolean): Observable<any> {
    return this.http
      .post(this.urlBack + 'canchas', {
        disponible: disponible ? 1 : 0,
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

  update(id: number, disponible: boolean): Observable<any> {
    return this.http
      .patch(this.urlBack + 'canchas/' + id, {
        disponible: disponible ? 1 : 0,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let message = '';
          if (error.status === 400) {
            message = 'Error en los datos enviados';
          } else if (error.status === 404) {
            message = 'No se ha encontrado la cancha';
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
    return this.http.delete(this.urlBack + 'canchas/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado la cancha'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
