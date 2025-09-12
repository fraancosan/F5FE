import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-menu',
  imports: [FontAwesomeModule],
  templateUrl: './card-menu.html',
  styleUrl: './card-menu.css',
})
export class CardMenu {
  @Input() icon!: IconDefinition;
  @Input() title = 'Card Menu';
  @Input() description = 'This is a reusable card menu component.';
  @Input() route = '/';

  constructor(private router: Router) {}

  onCardClick() {
    console.log('Card:', this.title, 'clickeada');
    this.router.navigate([this.route]);
  }
}
