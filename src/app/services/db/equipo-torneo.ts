import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { equipoTorneo } from '../../Interfases/interfaces';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipoTorneo {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  create(data: Pick<equipoTorneo, 'idEquipo' | 'idTorneo'>): Observable<any> {
    return this.http
      .post(
        this.urlBack + 'equiposTorneos/' + data.idEquipo + '/' + data.idTorneo,
        {}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.message) {
            this.snackBar.open(error.error.message, 'Cerrar', {
              duration: 5000,
            });
          }
          return throwError(() => error);
        })
      );
  }
}
