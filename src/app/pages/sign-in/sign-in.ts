import { Component } from '@angular/core';
import { Button2 } from '../../shared/button2/button2';
import { Button1 } from '../../shared/button1/button1';
import { faArrowLeft, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [Button1, Button2, FontAwesomeModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export default class SignIn {
  faArrowLeft = faArrowLeft;
  faCalendar = faCalendar;

  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate(['/inicio']);
  }
}
