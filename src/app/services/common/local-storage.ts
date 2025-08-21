import { Injectable } from '@angular/core';
import { Observable, Subject, skip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private storageSub = new Subject<any>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  getBooleanItem(key: string): boolean {
    let value: any = localStorage.getItem(key);
    value !== null ? (value = value === 'true') : skip;
    return value;
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  setItem(key: string, data: any): void {
    localStorage.setItem(key, data);
    this.storageSub.next({ status: 'set', key: key, value: data });
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSub.next({ status: 'removed', key: key });
  }
}
