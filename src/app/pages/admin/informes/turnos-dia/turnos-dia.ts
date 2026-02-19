import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../../../Interfases/interfaces';
import { DatePipe  } from '@angular/common';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Turnos } from '../../../../services/db/turnos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
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
  orderIcon = faSort;
  filterIcon = faFilter;
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
    fechaI:new Date().toISOString().split('T')[0],
    fechaF:new Date().toISOString().split('T')[0],
  };


  constructor(private turnosService: Turnos, private snackBar: MatSnackBar) {}

  loadTurnos() {
    this.loading = true;
    this.turnosService.reporteCantidadPorDia(this.params).subscribe({
      next: (res) => {
        this.turnos = res.turnosPorDia;
        this.totalTurnos = res.totales.totalTurnos;
        this.totalBuscarRival = res.totales.totalBuscandoRival;
        this.totalParrilla = res.totales.totalParrilla;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error al cargar los turnos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  generarReporte() {
    this.loadTurnos();
  }

  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }
}
