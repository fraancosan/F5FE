import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { Turnos } from '../../../services/db/turnos';
import { NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Button1 } from '../../btns/button1/button1';
import { Button2 } from '../../btns/button2/button2';
import { Navigation } from '../../../services/common/navigation';

@Component({
  selector: 'app-notificacion',
  imports: [FaIconComponent, NgClass, MatDialogModule, Button1, Button2],
  templateUrl: './notificacion.html',
  styleUrl: './notificacion.css',
})
export class Notificacion {
  bellIcon = faBell;
  cantidadTurnos: number = 0;
  wasOpened: boolean = false;
  intervalId: any;

  constructor(
    private snackBar: MatSnackBar,
    private turnosService: Turnos,
    private dialog: MatDialog,
    private navService: Navigation,
  ) {
    this.getNotifications();
    this.intervalId = setInterval(() => this.getNotifications(), 60000 * 5); // Verificar cada 5 minutos
  }

  getNotifications() {
    const hoy = new Date();
    const [year, month, day] = hoy
      .toISOString()
      .split('T')[0]
      .split('-')
      .map(Number);

    const horaActual = hoy.getHours();
    const horaSiguiente = horaActual + 2 > 23 ? 23 : horaActual + 2;

    const fechaI = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const fechaF = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const horaI = `${String(horaActual).padStart(2, '0')}:00:00`;
    const horaF = `${String(horaSiguiente).padStart(2, '0')}:59:59`;

    // obtener turnos propios y compartidos en paralelo
    forkJoin([
      this.turnosService.getAll({
        fechaI,
        fechaF,
        horaI,
        horaF,
        estado: 'señado',
      }),

      this.turnosService.getAll({
        fechaI,
        fechaF,
        horaI,
        horaF,
        estado: 'rival encontrado',
      }),
    ]).subscribe({
      next: ([turnosPropios, turnosCompartidos]) => {
        const cantidadTurnos = turnosPropios.length + turnosCompartidos.length;
        if (
          cantidadTurnos > 0 &&
          (!this.wasOpened || this.cantidadTurnos !== cantidadTurnos)
        ) {
          this.snackBar.open(
            `Tienes un turno programado en las próximas horas.`,
            'Cerrar',
            {
              duration: 5000,
            },
          );
        }
        this.cantidadTurnos = cantidadTurnos;
      },
    });
  }

  openDialog(dialog: any) {
    this.wasOpened = true;
    this.dialog.open(dialog, {
      position: { top: '80px', right: '5px' },
    });
  }

  goToMyTurnos() {
    this.navService.toPageTop('mis-turnos');
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
