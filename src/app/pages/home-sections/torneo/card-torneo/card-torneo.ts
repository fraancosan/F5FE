import { Component, Input } from '@angular/core';
import { CapitalizePipe } from '../../../../pipes/capitalize-pipe';

@Component({
  selector: 'app-card-torneo',
  imports: [
    CapitalizePipe,
  ],
  templateUrl: './card-torneo.html',
  styleUrl: './card-torneo.css'
})
export class CardTorneo {
  @Input() torneoDescripcion: string = '';
}
