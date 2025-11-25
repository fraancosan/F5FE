import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { torneo } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Torneo {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  reporteIngresos(fechaD: Date, fechaH: Date): Observable<any> {
    const url = `${
      this.urlBack
    }/torneos/reporte-ingresos?fechaD=${fechaD.toISOString()}&fechaH=${fechaH.toISOString()}`;

    return this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha podido generar el reporte'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  getAll(descripcion?: string): Observable<torneo[]> {
    let url = `${this.urlBack}/torneos`;
    if (descripcion !== undefined) {
      url += `?descripcion=${descripcion}`;
    }
    return this.http.get<torneo[]>(url).pipe(
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

  getById(id: number): Observable<torneo> {
    return this.http.get<torneo>(this.urlBack + 'torneos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el torneo'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(torneo: Omit<torneo, 'id'>): Observable<any> {
    return this.http.post(this.urlBack + 'torneos', torneo).pipe(
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

  update(id: number, torneo: Partial<torneo>): Observable<any> {
    return this.http.patch(this.urlBack + 'torneos/' + id, torneo).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 400) {
          message = 'Error en los datos enviados';
        } else if (error.status === 404) {
          message = 'No se ha encontrado el torneo';
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
    return this.http.delete(this.urlBack + 'torneos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el torneo'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
