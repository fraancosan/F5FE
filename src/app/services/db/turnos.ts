import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { turno } from '../../Interfases/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Turnos {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  transformEstado(turno: turno) {
    if (turno.estado === 'señado' && turno.idMP === null) {
      turno.estadoDetallado = 'pendiente de pago';
    } else if (
      turno.estado === 'señado' &&
      turno.idMP !== null &&
      turno.buscandoRival
    ) {
      if (turno.idMPCompartido !== null) {
        turno.estadoDetallado = 'rival encontrado';
      } else {
        turno.estadoDetallado = 'buscando rival';
      }
    } else {
      turno.estadoDetallado = turno.estado;
    }
  }

  getAll(params?: {
    fechaI?: string;
    fechaF?: string;
    horaI?: string;
    horaF?: string;
    ordenFecha?: 'asc' | 'desc';
    estado?: string;
  }): Observable<turno[]> {
    let query = '?';
    if (params && params.fechaI) {
      query += `fechai=${params.fechaI}&`;
    }
    if (params && params.fechaF) {
      query += `fechaf=${params.fechaF}&`;
    }
    if (params && params.horaI) {
      query += `horai=${params.horaI}&`;
    }
    if (params && params.horaF) {
      query += `horaf=${params.horaF}&`;
    }
    if (params && params.ordenFecha) {
      query += `ordenFecha=${params.ordenFecha}&`;
    }
    if (params && params.estado) {
      if (params.estado === 'pendiente de pago') {
        query += `estado=señado&hasIdMP=0&`;
      } else if (params.estado === 'rival encontrado') {
        query += `estado=señado&hasIdMP=1&hasIdMPCompartido=1&buscaRival=1&`;
      } else if (params.estado === 'buscando rival') {
        query += `estado=señado&hasIdMP=1&hasIdMPCompartido=0&buscaRival=1&`;
      } else if (params.estado === 'señado') {
        query += `estado=señado&hasIdMP=1&buscaRival=0&`;
      } else {
        query += `estado=${params.estado}&`;
      }
    }
    return this.http.get<turno[]>(this.urlBack + 'turnos' + query).pipe(
      map((data) =>
        data.map((turno) => {
          this.transformEstado(turno);
          turno.precioSenia = turno.precioSeña;
          return turno;
        })
      ),
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
      map((turno) => {
        this.transformEstado(turno);
        turno.precioSenia = turno.precioSeña;
        return turno;
      }),
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

  create(
    data: Pick<turno, 'fecha' | 'hora' | 'buscandoRival' | 'parrilla'>
  ): Observable<turno> {
    return this.http.post<turno>(this.urlBack + 'turnos', data).pipe(
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
