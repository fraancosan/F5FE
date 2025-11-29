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
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { InputDate } from '../../../shared/input-date/input-date';
import { GoBack } from '../../../shared/go-back/go-back';
import { InputCheckBox } from '../../../shared/input-check-box/input-check-box';
import { Turnos } from '../../../services/db/turnos';

@Component({
  selector: 'app-reserva',
  imports: [
    Button3,
    Button4,
    FontAwesomeModule,
    FormsModule,
    InputDate,
    GoBack,
    InputCheckBox,
  ],
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

  minDate: Date = new Date();
  maxDate: Date = new Date();

  turnosDisponibles: {
    fecha: string;
    horarios: { disponible: boolean; hora: string }[];
  }[] = [];
  horasDisponibles: { disponible: boolean; hora: string }[] = [
    { disponible: false, hora: 'Seleccione un turno' },
  ];

  hora = 'Seleccione un turno';
  fecha = '';

  base = 15000;
  parrilla = false;
  rival = false;

  constructor(private turnosService: Turnos) {}

  onDateSelected(date: string) {
    this.fecha = date;
    const turno = this.turnosDisponibles.find((t) => t.fecha === date);
    if (turno) {
      let disponible = false;
      for (const horario of turno.horarios) {
        if (horario.disponible) {
          disponible = true;
          break;
        }
      }
      this.horasDisponibles = disponible
        ? turno.horarios
        : [{ disponible: false, hora: 'No hay turnos disponibles' }];
    } else {
      this.horasDisponibles = [
        { disponible: false, hora: 'No hay turnos disponibles' },
      ];
    }
    this.hora = this.horasDisponibles[0].hora;
  }

  ngOnInit() {
    this.turnosService.getDisponibles().subscribe((data) => {
      console.log(data);
      this.turnosDisponibles = data;
      this.minDate = data[0].fecha;
      this.maxDate = data[data.length - 1].fecha;
    });
  }

  get total(): number {
    return this.base + (this.parrilla ? 5000 : 0) + (this.rival ? 3000 : 0);
  }
  get totalFormateado(): string {
    return new Intl.NumberFormat('es-AR').format(this.total);
  }
}
