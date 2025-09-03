import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommonDb {
  private urlBack: string = environment.urlBackend;

  constructor(private http: HttpClient) {}

  getAll<T>(table: string, query: string = ''): Observable<T[]> {
    const url = `${this.urlBack}${table}?${query}`;
    return this.http.get<T[]>(url).pipe(catchError(this.handleError));
  }

  getOne<T>(table: string, id: string | number): Observable<T> {
    const url = `${this.urlBack}${table}/${id}`;
    return this.http.get<T>(url).pipe(catchError(this.handleError));
  }

  post<T>(table: string, data: any): Observable<T> {
    const url = `${this.urlBack}${table}`;
    return this.http.post<T>(url, data).pipe(catchError(this.handleError));
  }

  patch<T>(table: string, id: string | number, data: any): Observable<T> {
    const url = `${this.urlBack}${table}/${id}`;
    return this.http.patch<T>(url, data).pipe(catchError(this.handleError));
  }

  delete<T>(table: string, id: string | number): Observable<T> {
    const url = `${this.urlBack}${table}/${id}`;
    return this.http.delete<T>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => error);
  }
}
