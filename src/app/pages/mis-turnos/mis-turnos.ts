import { Component } from '@angular/core';
import { GoBack } from '../../shared/go-back/go-back';
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../Interfases/interfaces';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Spinner } from '../../shared/spinner/spinner';
import { Turnos } from '../../services/db/turnos';
import { XBtn } from '../../shared/btns/x-btn/x-btn';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select } from '../../shared/inputs/select/select';
import { faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import { InputDate } from '../../shared/inputs/input-date/input-date';
@Component({
  selector: 'app-mis-turnos',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    XBtn,
    Select,
    InputDate,
  ],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export default class MisTurnos {
  displayedColumns: string[] = [
    'Fecha',
    'Hora',
    'Estado',
    'Precio',
    'Precio Seña',
    'Cancha',
    'Parrilla',
    'Turno Compartido',
    'Acciones',
  ];
  turnos: turno[] = [];

  order: 'asc' | 'desc' = 'desc';
  orderSelect = [
    {
      value: 'asc',
      text: 'Ascendente',
      disabled: false,
    },
    {
      value: 'desc',
      text: 'Descendente',
      disabled: false,
    },
  ];

  estado: string = '';
  estadoSelect = [
    { value: '', text: 'Todos', disabled: false },
    { value: 'señado', text: 'Señado', disabled: false },
    { value: 'cancelado', text: 'Cancelado', disabled: false },
    { value: 'finalizado', text: 'Finalizado', disabled: false },
    { value: 'pendiente de pago', text: 'Pendiente de pago', disabled: false },
    { value: 'rival encontrado', text: 'Rival encontrado', disabled: false },
    { value: 'buscando rival', text: 'Buscando rival', disabled: false },
  ];

  loading: boolean = false;
  orderIcon = faSort;
  filterIcon = faFilter;

  params: any = {
    fechaI: undefined,
    fechaF: undefined,
    ordenFecha: this.order,
    estado: this.estado,
  };

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

  cancelarTurno(turno: turno) {
    if (turno.buscandoRival) {
      this.snackBar.open('No se puede cancelar un turno compartido', 'Cerrar', {
        duration: 5000,
      });
    } else if (turno.estado !== 'señado') {
      this.snackBar.open('Solo se pueden cancelar turnos señados', 'Cerrar', {
        duration: 5000,
      });
    } else if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      this.turnosService.cancelar(turno.id).subscribe({
        next: () => {
          this.snackBar.open('Turno cancelado con éxito', 'Cerrar', {
            duration: 5000,
          });
          this.loadTurnos();
        },
      });
    }
  }

  changeDesde(date: string) {
    this.params.fechaI = date;
    this.loadTurnos();
  }
  changeHasta(date: string) {
    this.params.fechaF = date;
    this.loadTurnos();
  }
  changeOrder(order: string) {
    this.params.ordenFecha = order;
    this.loadTurnos();
  }
  changeEstado(estado: string) {
    this.params.estado = estado;
    this.loadTurnos();
  }
}
