import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Users } from '../../services/db/users';
import { Navigation } from '../../services/common/navigation';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  bellIcon = faBell;
  userIcon = faCircleUser;
  isLoggedIn: boolean = false;

  constructor(private navService: Navigation, private user: Users) {}

  ngOnInit(): void {
    this.user.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  goToLanding() {
    this.navService.toPageTop('');
  }

  goToLogin() {
    this.navService.toPageTop('sign-in');
  }

  goToRegister() {
    this.navService.toPageTop('sign-up');
  }

  goToAccount() {
    this.navService.toPageTop('mi-cuenta');
  }

  goToMyTurnos() {
    this.navService.toPageTop('mis-turnos');
  }

  logout() {
    this.user.signOut(false);
    this.navService.toPageTop('');
  }
}
