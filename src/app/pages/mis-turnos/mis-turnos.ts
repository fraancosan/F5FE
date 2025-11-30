import { Component } from '@angular/core';
import { GoBack } from '../../shared/go-back/go-back';
import { MatTableModule } from '@angular/material/table';
import { turno } from '../../Interfases/interfaces';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Spinner } from '../../shared/spinner/spinner';
import { Turnos } from '../../services/db/turnos';
@Component({
  selector: 'app-mis-turnos',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    TitleCasePipe,
    DatePipe,
    CurrencyPipe,
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
  ];
  turnos: turno[] = [];

  loading: boolean = false;

  constructor(private turnosService: Turnos) {}

  ngOnInit() {
    this.loading = true;
    this.turnosService.getAll().subscribe((turnos) => {
      this.turnos = turnos;
      this.loading = false;
    });
  }
}
