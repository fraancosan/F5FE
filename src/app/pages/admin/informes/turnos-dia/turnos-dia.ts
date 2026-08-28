import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../../../Interfases/interfaces';
import { DatePipe  } from '@angular/common';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Turnos } from '../../../../services/db/turnos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDate } from '../../../../shared/inputs/input-date/input-date';
import { FormsModule } from '@angular/forms';
import { Button3 } from '../../../../shared/btns/button3/button3';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-turnos-dia',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    InputDate,
    FormsModule,
    Button3,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './turnos-dia.html',
  styleUrl: './turnos-dia.css'
})
export default class TurnosDia {
  loading: boolean = false;
  totalTurnos: number = 0;
  totalBuscarRival: number = 0;
  totalParrilla: number = 0;
  turnos: turno[] = [];

  displayedColumns: string[] = [
      'Fecha',
      'CantidadTurnos',
      'CantidadBuscarRival',
      'CantidadParrilla',
  ];

  params: any = {
    fechaI: '',
    fechaF: '',
  };


  constructor(private turnosService: Turnos, private snackBar: MatSnackBar) {}

  loadTurnos() {
    this.loading = true;
    if (!this.params.fechaI || !this.params.fechaF) {
      this.snackBar.open('Debe seleccionar un rango de fechas', 'Cerrar', { duration: 3000 });
      this.loading = false;
      return;
    }
    if (this.params.fechaI > this.params.fechaF) {
      this.snackBar.open('La fecha desde no puede ser mayor a la fecha hasta', 'Cerrar', { duration: 3000 });
      this.loading = false;
      return;
    }
    this.turnosService.reporteCantidadPorDia(this.params).subscribe({
      next: (res) => {
        this.turnos = res?.turnosPorDia || [];
        this.totalTurnos = res?.totales?.totalTurnos || 0;
        this.totalBuscarRival = res?.totales?.totalBuscandoRival || 0;
        this.totalParrilla = res?.totales?.totalParrilla || 0;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.turnos = []; 
        this.totalTurnos = 0;
        this.totalBuscarRival = 0;
        this.totalParrilla = 0;
        if (err.status !== 404){
          this.snackBar.open('Error al cargar los turnos', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  generarReporte() {
    this.loadTurnos();
  }

  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }
}
