import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { Turnos } from '../../../services/db/turnos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { turno } from '../../../Interfases/interfaces';
import { MatTableModule } from '@angular/material/table';
import { Spinner } from '../../../shared/spinner/spinner';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Button3 } from '../../../shared/btns/button3/button3';
import { Navigation } from '../../../services/common/navigation';

@Component({
  selector: 'app-buscar-partido',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
    Button3,
  ],
  templateUrl: './buscar-partido.html',
  styleUrl: './buscar-partido.css',
})
export default class BuscarPartido {
  loading: boolean = false;

  displayedColumns: string[] = [
    'Fecha',
    'Hora',
    'Precio',
    'Precio Seña',
    'Cancha',
    'Parrilla',
    'Usuario',
    'Acciones',
  ];
  turnos: turno[] = [];

  constructor(
    private turnosService: Turnos,
    private snackBar: MatSnackBar,
    private navService: Navigation,
  ) {}

  ngOnInit() {
    this.loadTurnos();
  }

  loadTurnos() {
    this.loading = true;
    this.turnosService.getBuscarRival().subscribe({
      next: (turnos) => {
        this.turnos = turnos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  unirsePartido(id: string) {
    this.turnosService.unirseTurno(id).subscribe({
      next: (response) => {
        this.loading = false;
        window.open(response.urlPreferenciaPagoCompartido, '_blank');
        this.snackBar.open('Te has unido al partido', 'Cerrar', {
          duration: 5000,
        });
        this.navService.toPageTop('mis-turnos');
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
