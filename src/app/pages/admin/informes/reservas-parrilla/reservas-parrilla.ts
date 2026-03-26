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
  selector: 'app-reservas-parrilla',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    DatePipe,
    InputDate,
    FormsModule,
    MatIconModule,
    MatButtonModule,  
    Button3,   
  ],
  templateUrl: './reservas-parrilla.html',
  styleUrl: './reservas-parrilla.css'
})
export default class ReservasParrilla {
  turnos: turno[] = [];
  totalParrilla: number = 0;
  displayedColumns: string[] = [
      //'ID-TURNO',
      'Fecha',
      'Hora',
      'ID-USUARIO',
      'NombreUsuario',
  ];

  loading: boolean = false;

  params: any = {
    fechaI:new Date().toISOString().split('T')[0],
    fechaF:new Date().toISOString().split('T')[0],
  };

  constructor (
    private turnosService: Turnos,
    private snackBar: MatSnackBar
  ) {}

  loadTurnosParrilla() {
    this.loading = true;
    this.turnosService.reporteParrilla(this.params).subscribe({
      next: (data) => {
        this.turnos = data.turnos || [];
        this.totalParrilla = data?.resumen?.ingresosTotales || 0;
        this.loading = false;
      },
      error: (error) => {
        this.turnos = [];
        this.totalParrilla = 0;
        this.snackBar.open('Error al cargar los turnos de parrilla', 'Cerrar', { duration: 3000 });
      }
    });
  }

  generarReporte() {
    this.loadTurnosParrilla();
  }

  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }
}
