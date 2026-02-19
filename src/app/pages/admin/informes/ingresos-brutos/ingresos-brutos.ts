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
  orderIcon = faSort;
  filterIcon = faFilter;

  params: any = {
    fechaI:new Date().toISOString().split('T')[0],
    fechaF:new Date().toISOString().split('T')[0],
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
        console.log('Turnos cargados:', this.turnos);
        this.actualizarTabla();
      },
      error: (err) => {
        this.snackBar.open('Error al cargar los turnos', 'Cerrar', { duration: 3000 });
        this.loading = false;
        this.actualizarTabla();
      }
    });

  }

  loadTorneos() {
    const fechaD = new Date(this.params.fechaI + 'T00:00:00');
    const fechaH = new Date(this.params.fechaF + 'T23:59:59');

    this.torneoService.reporteIngresos(fechaD, fechaH).subscribe({
      next: (data) => {
        this.torneos = data.ingresos || [];
        this.loading = false;
        console.log('Torneos cargados:', this.torneos);
        this.actualizarTabla();
      },
      error: (err) => {
        this.torneos = []; 
        this.actualizarTabla();
        if (err.status !== 404) {
        this.snackBar.open('Error al cargar los torneos', 'Cerrar', { duration: 3000 });
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
  
  this.loading = false;
}

  sumarTurnos(): number {
    return this.datosTabla?.reduce((acc, curr) => acc + (curr.ingresosTurno || 0), 0) || 0;
  }

  sumarTorneos(): number {
    return this.datosTabla?.reduce((acc, curr) => acc + (curr.ingresosInscripto || 0), 0) || 0;
  }

  generarReporte(){
    this.turnos = [];
    this.torneos = [];
    this.loading = true;
    this.loadTurnos();
    this.loadTorneos();
  }

  

  changeDesde(date: string) { this.params.fechaI = date;  }
  changeHasta(date: string) { this.params.fechaF = date;  }

}
