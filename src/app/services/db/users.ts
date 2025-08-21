import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LocalStorage } from '../common/local-storage';
import { Navigation } from '../common/navigation';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private urlBack: string = environment.urlBackend;

  constructor(
    private http: HttpClient,
    private localStorageSv: LocalStorage,
    private navSv: Navigation
  ) {}

  signOut(sendLogin: boolean = false) {
    this.localStorageSv.removeItem('token');
    if (sendLogin) {
      this.navSv.toPageTop('/sign-in');
    }
  }
}
