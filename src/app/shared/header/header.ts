import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Users } from '../../services/db/users';

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

  constructor(private router: Router, private user: Users) {}

  ngOnInit(): void {
    this.user.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  goToLanding() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/sign-in']);
  }

  goToRegister() {
    this.router.navigate(['/sign-up']);
  }

  goToAccount() {
    this.router.navigate(['/cuenta']); //cambiar despues
  }

  goToMyTurnos() {
    this.router.navigate(['/mis-turnos']); //cambiar despues
  }

  logout() {
    this.user.signOut(false);
    this.router.navigate(['/']);
  }
}
