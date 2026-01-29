import { Component, Input } from '@angular/core';
import { CapitalizePipe } from '../../../../pipes/capitalize-pipe';
@Component({
  selector: 'app-card-equipo',
  imports: [CapitalizePipe],
  templateUrl: './card-equipo.html',
  styleUrl: './card-equipo.css'
})
export class CardEquipo {
  @Input() equipo: any = {};
  get nombreDelEquipo(): string {
      if (this.equipo && this.equipo.Equipo) {
        return this.equipo.Equipo.nombre;
      }
      return 'Cargando nombre...';
    }
}


