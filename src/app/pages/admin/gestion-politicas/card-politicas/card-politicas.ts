import { Component, Input } from '@angular/core';
import { politica } from '../../../../Interfases/interfaces';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { CapitalizePipe } from '../../../../pipes/capitalize-pipe';

@Component({
  selector: 'app-card-politicas',
  imports: [
    CapitalizePipe,
    ],
  templateUrl: './card-politicas.html',
  styleUrl: './card-politicas.css'
})
export class CardPoliticas {
  @Input() politica: politica = {} as politica;
  usersIcon = faUsers;

}
