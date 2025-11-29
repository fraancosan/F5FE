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
import { CurrencyPipe } from '@angular/common';
import { Navigation } from '../../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    CurrencyPipe,
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

  parrilla = false;
  rival = false;

  precio = 0;
  senia = 0;

  constructor(
    private turnosService: Turnos,
    private navService: Navigation,
    private snackBar: MatSnackBar
  ) {}

  onDateSelected(date: string) {
    this.fecha = date;
    this.horasDisponibles = [];
    const turno = this.turnosDisponibles.find((t) => t.fecha === date);
    if (turno) {
      let disponible = false;
      for (const horario of turno.horarios) {
        if (horario.disponible) {
          disponible = true;
          this.horasDisponibles.push(horario);
        }
      }
      if (!disponible) {
        this.horasDisponibles = [
          { disponible: false, hora: 'No hay turnos disponibles' },
        ];
      }
    } else {
      this.horasDisponibles = [
        { disponible: false, hora: 'No hay turnos disponibles' },
      ];
    }
    this.hora = this.horasDisponibles[0].hora;
  }

  ngOnInit() {
    this.loadPrecio();
    this.turnosService.getDisponibles().subscribe((data) => {
      this.turnosDisponibles = data;
      this.minDate = data[0].fecha;
      this.maxDate = data[data.length - 1].fecha;
    });
  }

  loadPrecio() {
    this.turnosService
      .getPrePrecio(this.parrilla, this.rival)
      .subscribe((data) => {
        this.senia = data.precioSeña;
        this.precio = data.precio;
      });
  }

  isValid(): boolean {
    return (
      this.fecha !== '' &&
      this.hora !== 'Seleccione un turno' &&
      this.hora !== 'No hay turnos disponibles'
    );
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  reservar() {
    if (!this.isValid()) {
      this.snackBar.open('Por favor seleccione un turno disponible', 'Cerrar', {
        duration: 5000,
      });
    } else {
      this.turnosService
        .create({
          fecha: this.fecha,
          hora: this.hora,
          parrilla: this.parrilla ? 1 : 0,
          buscandoRival: this.rival ? 1 : 0,
        })
        .subscribe({
          next: (response) => {
            window.open(response.urlPreferenciaPago, '_blank');
            this.snackBar.open('Reserva realizada con éxito', 'Cerrar', {
              duration: 5000,
            });
            this.navService.toPageTop('mis-turnos');
          },
        });
    }
  }
}
