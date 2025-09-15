import { Component } from '@angular/core';
import { Button3 } from '../../../shared/button3/button3';
import { Button4 } from '../../../shared/button4/button4';
import { faArrowLeft, faCalendar, faClock, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  imports: [Button3, Button4, FontAwesomeModule],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export default class Reserva {
  faArrowLeft = faArrowLeft;
  faCalendar = faCalendar;
  faClock = faClock;
  faChevronDown = faChevronDown;

  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate(['/inicio']);
  }
}
