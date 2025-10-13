import { Component } from '@angular/core';
import { Button3 } from '../../../shared/button3/button3';
import { Button4 } from '../../../shared/button4/button4';
import {
  faArrowLeft,
  faCalendar,
  faClock,
  faChevronDown,
  faUtensils,
  faUserPlus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputDate } from '../../../shared/input-date/input-date';

@Component({
  selector: 'app-reserva',
  imports: [Button3, Button4, FontAwesomeModule, FormsModule, InputDate],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export default class Reserva {
  faArrowLeft = faArrowLeft;
  faCalendar = faCalendar;
  faClock = faClock;
  faChevronDown = faChevronDown;
  faUtensils = faUtensils;
  faUserPlus = faUserPlus;
  faCheck = faCheck;

  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setMonth(this.minDate.getMonth() + 1)); // tryhardcodeado a un mes, buscar por backend

  base = 15000;
  parrilla = false;
  rival = false;

  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate(['/inicio']);
  }

  onDateSelected(date: string) {
    console.log('Fecha seleccionada:', date);
  }

  get total(): number {
    return this.base + (this.parrilla ? 5000 : 0) + (this.rival ? 3000 : 0);
  }
  get totalFormateado(): string {
    return new Intl.NumberFormat('es-AR').format(this.total);
  }
}
