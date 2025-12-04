import { Component } from '@angular/core';
import { GoBack } from '../../shared/go-back/go-back';
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../Interfases/interfaces';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Spinner } from '../../shared/spinner/spinner';
import { Turnos } from '../../services/db/turnos';
import { XBtn } from '../../shared/btns/x-btn/x-btn';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  loading: boolean = false;

  constructor(private turnosService: Turnos, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.loading = true;
    this.turnosService.getAll().subscribe((turnos) => {
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
}
