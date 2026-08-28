import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../../../Interfases/interfaces';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Turnos } from '../../../../services/db/turnos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputDate } from '../../../../shared/inputs/input-date/input-date';
import { FormsModule } from '@angular/forms';
import { Button3 } from '../../../../shared/btns/button3/button3';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-reservas-canceladas',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    DatePipe,
    CurrencyPipe,
    InputDate,
    FormsModule,
    MatIconModule,
    MatButtonModule,  
    Button3,
  ],
  templateUrl: './reservas-canceladas.html',
  styleUrl: './reservas-canceladas.css'
})
export default class ReservasCanceladas {
  turnos: turno[] = [];
  totalPerdidasGeneral: number = 0;
  totalCancelado: number = 0;
  displayedColumns: string[] = [
      'Usuario',
      'Cantidad',
      'Fecha',
      'Hora',
      'BuscarRival',
      'Parrilla',
  ];
  loading: boolean = false;

  params: any = {
    fechaI:'',
    fechaF:'',
  };
  constructor(
    private turnosService: Turnos,
    private snackBar: MatSnackBar) {}
  obtenerReservasCanceladas() {
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
    this.turnosService.reporteCancelados(this.params).subscribe({
      next: (data) => {
        this.turnos = data?.turnos || [];
        this.totalPerdidasGeneral = data?.totalPerdidas || 0;
        this.loading = false;
        this.totalCancelado = data?.turnos ? data?.turnos.length: 0;
      },
      error: (error) => {
        this.turnos = [];
        this.totalPerdidasGeneral = 0;
        this.snackBar.open('Error al obtener las reservas canceladas', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.totalCancelado = 0;
      }
    });
  }
  generarReporte() {
    this.loading = true;
    this.obtenerReservasCanceladas();
  }
  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }

}
