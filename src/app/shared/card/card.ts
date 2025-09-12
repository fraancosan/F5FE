import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-card',
  imports: [FontAwesomeModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon!: IconDefinition;
}
