import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { turno } from '../../Interfases/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Turnos {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getAll({
    fechaI,
    fechaF,
    horaI,
    horaF,
  }: {
    fechaI: string;
    fechaF: string;
    horaI: string;
    horaF: string;
  }): Observable<turno[]> {
    let query = '?';
    if (fechaI) {
      query += `fechai=${fechaI}&`;
    }
    if (fechaF) {
      query += `fechaf=${fechaF}&`;
    }
    if (horaI) {
      query += `horai=${horaI}&`;
    }
    if (horaF) {
      query += `horaf=${horaF}`;
    }
    return this.http.get<turno[]>(this.urlBack + 'turnos' + query).pipe(
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

  getById(id: string): Observable<turno> {
    return this.http.get<turno>(this.urlBack + 'turnos/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.snackBar.open('No se ha encontrado el turno', 'Cerrar', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }

  getDisponibles(): Observable<any> {
    return this.http.get(this.urlBack + 'turnos/disponibles').pipe(
      catchError((error: HttpErrorResponse) => {
        this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  }

  getPrePrecio(
    parrilla: boolean,
    compartido: boolean
  ): Observable<{ precio: number; precioSeña: number }> {
    const query = `?parrilla=${parrilla ? '1' : '0'}&compartido=${
      compartido ? '1' : '0'
    }`;
    return this.http
      .get<{ precio: number; precioSeña: number }>(
        this.urlBack + 'turnos/pre-precio' + query
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
          return throwError(() => error);
        })
      );
  }

  getBuscarRival(): Observable<turno[]> {
    return this.http.get<turno[]>(this.urlBack + 'turnos/buscar-rival').pipe(
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

  reporteParrilla({
    fechaI,
    fechaF,
  }: {
    fechaI: string;
    fechaF: string;
  }): Observable<any> {
    const query = `?fechaD=${fechaI}&fechaH=${fechaF}`;
    return this.http
      .get(this.urlBack + 'turnos/reporte-parrilla' + query, {
        responseType: 'blob',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackBar.open(
              'No se encontraron turnos con parrilla reservada en ese rango de fechas',
              'Cerrar',
              {
                duration: 5000,
              }
            );
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

  reporteCancelados({
    fechaI,
    fechaF,
  }: {
    fechaI: string;
    fechaF: string;
  }): Observable<any> {
    const query = `?fechaD=${fechaI}&fechaH=${fechaF}`;
    return this.http
      .get(this.urlBack + 'turnos/reporte-cancelados' + query)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackBar.open(
              'No se encontraron turnos cancelados en ese rango de fechas',
              'Cerrar',
              { duration: 5000 }
            );
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

  reporteIngresos({
    fechaI,
    fechaF,
  }: {
    fechaI: string;
    fechaF: string;
  }): Observable<any> {
    const query = `?fechaD=${fechaI}&fechaH=${fechaF}`;
    return this.http.get(this.urlBack + 'turnos/reporte-ingresos' + query).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.snackBar.open(
            'No se encontraron ingresos en ese rango de fechas',
            'Cerrar',
            {
              duration: 5000,
            }
          );
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

  reporteCantidadPorDia({
    fechaI,
    fechaF,
  }: {
    fechaI: string;
    fechaF: string;
  }): Observable<any> {
    const query = `?fechaD=${fechaI}&fechaH=${fechaF}`;
    return this.http
      .get(this.urlBack + 'turnos/reporte-cantidad-dia' + query)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackBar.open(
              'No se encontraron turnos en ese día',
              'Cerrar',
              {
                duration: 5000,
              }
            );
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

  cancelar(id: string): Observable<any> {
    return this.http.post(this.urlBack + 'turnos/cancelar/' + id, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.snackBar.open(
            'No se puede cancelar un turno compartido',
            'Cerrar',
            {
              duration: 5000,
            }
          );
        } else if (error.status === 404) {
          this.snackBar.open(
            'No se encontro el turno a cancelar o el mismo no es apto para cancelarse',
            'Cerrar',
            {
              duration: 5000,
            }
          );
        } else {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }

  unirseTurno(id: string): Observable<any> {
    return this.http.post(this.urlBack + 'turnos/unirse-turno/' + id, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        } else {
          this.snackBar.open(error.error.message, 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }

  create(data: Pick<turno, 'fecha' | 'hora' | 'buscandoRival' | 'parrilla'>) {
    return this.http.post(this.urlBack + 'turnos', data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        } else {
          this.snackBar.open(error.error.message, 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }

  update(
    id: string,
    data: Pick<
      turno,
      | 'fecha'
      | 'hora'
      | 'buscandoRival'
      | 'parrilla'
      | 'idUsuario'
      | 'idUsuarioCompartido'
      | 'idCancha'
      | 'estado'
    >
  ) {
    return this.http.patch(this.urlBack + 'turnos/' + id, data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.snackBar.open('Error al contactar con el servidor', 'Cerrar', {
            duration: 5000,
          });
        } else {
          this.snackBar.open(error.error.message, 'Cerrar', {
            duration: 5000,
          });
        }
        return throwError(() => error);
      })
    );
  }
}
