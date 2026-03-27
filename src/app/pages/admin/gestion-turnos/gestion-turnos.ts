import { Component, OnInit } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../../Interfases/interfaces';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Spinner } from '../../../shared/spinner/spinner';
import { Turnos } from '../../../services/db/turnos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select } from '../../../shared/inputs/select/select';
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import { InputDate } from '../../../shared/inputs/input-date/input-date';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gestion-turnos',
  standalone: true,
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    Select,
    InputDate,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './gestion-turnos.html',
  styleUrl: './gestion-turnos.css',
})
export default class GestionTurnos implements OnInit {
  filaEditar: any = null;

  displayedColumns: string[] = [
    'Usuario',
    'Fecha',
    'Hora',
    'Estado',
    'Precio',
    'Cancha',
    'Parrilla',
    'Buscar Rival',
    'Acciones',
  ];

  turnos: turno[] = [];
  loading: boolean = false;
  orderIcon = faSort;
  filterIcon = faFilter;

  order: 'asc' | 'desc' = 'desc';
  estado: string = '';
  
  params: any = {
    fechaI: undefined,
    fechaF: undefined,
    ordenFecha: this.order,
    estado: this.estado,
  };

  orderSelect = [
    { value: 'asc', text: 'Ascendente', disabled: false },
    { value: 'desc', text: 'Descendente', disabled: false },
  ];

  estadoSelect = [
    { value: '', text: 'Todos', disabled: false },
    { value: 'señado', text: 'Señado', disabled: false },
    { value: 'cancelado', text: 'Cancelado', disabled: false },
    { value: 'finalizado', text: 'Finalizado', disabled: false },
    { value: 'pendiente de pago', text: 'Pendiente de pago', disabled: false },
  ];

  constructor(private turnosService: Turnos, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.loading = true;
    this.turnosService.getAll(this.params).subscribe((turnos) => {
      this.turnos = turnos;
      this.loading = false;
    });
  }

  habilitarEdicion(turno: turno) {
    this.filaEditar = {...turno};
  }

  guardarCambios(turno: turno) {
    let horaFormateada = this.filaEditar.hora;
    if (horaFormateada.length === 5) {
    horaFormateada += ':00';
    }
    const body: any = {
      fecha: this.filaEditar.fecha,
      hora: horaFormateada,
      idCancha: Number(this.filaEditar.idCancha),
      estado: this.filaEditar.estado,
      idUsuario: Number(this.filaEditar.idUsuario), 
      buscandoRival: this.filaEditar.buscandoRival ? 1 : 0,
      parrilla: this.filaEditar.parrilla ? 1 : 0
    };

    if (this.filaEditar.idUsuarioCompartido) {
    body.idUsuarioCompartido = Number(this.filaEditar.idUsuarioCompartido);
    }

    this.turnosService.update(this.filaEditar.id, body as any).subscribe({
      next: () => {
        this.snackBar.open('Turno actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.filaEditar = null;
        this.loadTurnos();
      },
      error: () => {
        this.snackBar.open('Error al actualizar el turno', 'Cerrar', { duration: 3000 });
      }
    });
  }
  
  cancelarEdicion() {
    this.filaEditar = null;
  }

  // Métodos de filtros
  changeDesde(date: string) { this.params.fechaI = date; this.loadTurnos(); }
  changeHasta(date: string) { this.params.fechaF = date; this.loadTurnos(); }
  changeOrder(order: string) { this.params.ordenFecha = order; this.loadTurnos(); }
  changeEstado(estado: string) { this.params.estado = estado; this.loadTurnos(); }
}