import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, of, throwError } from 'rxjs';
import { partidoTorneo } from '../../Interfases/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PartidosTorneo {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll({
    idEquipo,
    idTorneo,
    fechaPartido,
  }: {
    idEquipo?: number;
    idTorneo?: number;
    fechaPartido?: string;
  }): Observable<partidoTorneo[]> {
    let queryParams: string[] = [];
    if (idEquipo) {
      queryParams.push(`idEquipo=${idEquipo}`);
    }
    if (idTorneo) {
      queryParams.push(`idTorneo=${idTorneo}`);
    }
    if (fechaPartido) {
      queryParams.push(`fechaPartido=${fechaPartido}`);
    }
    const queryString = queryParams.length ? '?' + queryParams.join('&') : '';
    return this.http
      .get<partidoTorneo[]>(this.urlBack + 'partidos' + queryString)
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

  getById(id: number): Observable<partidoTorneo> {
    return this.http.get<partidoTorneo>(this.urlBack + 'partidos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el partido del torneo'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  create(data: partidoTorneo): Observable<any> {
    return this.http.post(this.urlBack + 'partidos', data).pipe(
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

  update(id: number, data: Partial<partidoTorneo>): Observable<any> {
    return this.http.patch(this.urlBack + 'partidos/' + id, data).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = '';
        if (error.status === 400) {
          message = 'Error en los datos enviados';
        } else if (error.status === 404) {
          message = 'No se ha encontrado el partido del torneo';
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
    return this.http.delete(this.urlBack + 'partidos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          error.status === 404
            ? 'No se ha encontrado el partido del torneo'
            : 'Error al contactar con el servidor';
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }
}
