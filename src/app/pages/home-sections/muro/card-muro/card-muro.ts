import { Component, Input } from '@angular/core';
import { muro } from '../../../../Interfases/interfaces';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { CapitalizePipe } from '../../../../pipes/capitalize-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card-muro',
  imports: [FaIconComponent, CapitalizePipe, DatePipe],
  templateUrl: './card-muro.html',
  styleUrl: './card-muro.css',
})
export class CardMuro {
  @Input() muro: muro = {} as muro;

  usersIcon = faUsers;
}
