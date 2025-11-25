import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { muro } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Muro {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll(titulo?: string): Observable<muro[]> {
    return this.http
      .get<muro[]>(this.urlBack + titulo ? `muros?titulo=${titulo}` : 'muros')
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

  getAllVigentes(): Observable<muro[]> {
    return this.http.get<muro[]>(this.urlBack + 'muros/vigente').pipe(
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

  getById(id: number): Observable<muro> {
    return this.http.get<muro>(this.urlBack + 'muros/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el muro'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(muro: Omit<muro, 'id'>): Observable<any> {
    return this.http.post(this.urlBack + 'muros', muro).pipe(
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

  update(id: number, muro: Omit<muro, 'id'>): Observable<any> {
    return this.http.patch(this.urlBack + 'muros/' + id, muro).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 400) {
          message = 'Error en los datos enviados';
        } else if (error.status === 404) {
          message = 'No se ha encontrado el muro';
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
    return this.http.delete(this.urlBack + 'muros/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el muro'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
