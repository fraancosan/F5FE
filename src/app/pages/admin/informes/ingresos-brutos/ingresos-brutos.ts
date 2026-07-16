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
import { Torneo } from '../../../../services/db/torneo';
import {torneo} from '../../../../Interfases/interfaces';


interface FilaReporte {
  fecha: string;
  ingresosTurno: number;
  ingresosInscripto: number;
}

@Component({
  selector: 'app-ingresos-brutos',
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
  templateUrl: './ingresos-brutos.html',
  styleUrl: './ingresos-brutos.css'
})
export default class IngresosBrutos {

  datosTabla: FilaReporte[] = [];
  turnos: turno[] = [];
  torneos: torneo[] = [];
  displayedColumns: string[] = [
      'Fecha',
      'IngresosTurno',
      'IngresosInscriptos',
  ];

  loading: boolean = false;
  loadingTurnos: boolean = false;
  loadingTorneos: boolean = false;

  params: any = {
    fechaI:'',
    fechaF:'',
  };

  constructor(
    private turnosService: Turnos,
    private snackBar: MatSnackBar,
    private torneoService: Torneo,
  ) {}

  loadTurnos() {
    this.turnosService.reporteIngresos(this.params).subscribe({
      next: (data) => {
        this.turnos = data.ingresos || [];
        this.loadingTurnos = false;
        this.actualizarTabla();
      },
      error: (err) => {
        this.loadingTurnos = false;
        this.actualizarTabla();
        if (err.status !== 404) {
          this.snackBar.open('Error al cargar los turnos para el reporte.', 'Cerrar', { duration: 3000 });
        }
      }
    });

  }

  loadTorneos() {
    const fechaD = new Date(this.params.fechaI + 'T00:00:00');
    const fechaH = new Date(this.params.fechaF + 'T23:59:59');

    this.torneoService.reporteIngresos(fechaD, fechaH).subscribe({
      next: (data) => {
        this.torneos = data.ingresos || [];
        this.loadingTorneos = false;
        this.actualizarTabla();
      },
      error: (err) => {
        this.torneos = []; 
        this.loadingTorneos = false;
        this.actualizarTabla();
        if (err.status !== 404) {
        this.snackBar.open('Error al cargar los torneos para el reporte.', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

 private actualizarTabla() {
  if (!this.loading) return;

  const fechasTurnos = this.turnos.map((t: any) => t.fecha);
  const fechasTorneos = this.torneos.map((tor: any) => tor.fechaInicio);

  const todasLasFechas = Array.from(new Set([...fechasTurnos, ...fechasTorneos])).filter(f => !!f);

  this.datosTabla = todasLasFechas.map(f => {
    const tDia = this.turnos.find((t: any) => t.fecha === f) as any;
    const torDia = this.torneos.find((tor: any) => tor.fechaInicio === f) as any;

    const fila: FilaReporte = {
      fecha: f instanceof Date ? f.toISOString() : String(f),
      ingresosTurno: tDia ? Number(tDia.ingresosDelDia) : 0,
      ingresosInscripto: torDia ? Number(torDia.ingresosDelDia) : 0
    };
    return fila;
  });

  this.datosTabla.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  if (!this.loadingTurnos && !this.loadingTorneos){
    this.loading = false;}
}

  sumarTurnos(): number {
    return this.datosTabla?.reduce((acc, curr) => acc + (curr.ingresosTurno || 0), 0) || 0;
  }

  sumarTorneos(): number {
    return this.datosTabla?.reduce((acc, curr) => acc + (curr.ingresosInscripto || 0), 0) || 0;
  }

  generarReporte(){
    if (!this.params.fechaI || !this.params.fechaF) {
      this.snackBar.open('Por favor, ingrese ambas fechas para generar el reporte.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.params.fechaI > this.params.fechaF) {
      this.snackBar.open('La fecha "Desde" no puede ser mayor que la fecha "Hasta".', 'Cerrar', { duration: 3000 });
      return;
    }

    this.turnos = [];
    this.torneos = [];
    this.loadingTurnos = true;
    this.loadingTorneos = true;
    this.loading = true;
    this.loadTurnos();
    this.loadTorneos();

  }

  

  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }

}
