import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button5',
  imports: [],
  templateUrl: './button5.html',
  styleUrl: './button5.css',
})
export class Button5 {
  constructor(private router: Router) {}

  public goToMenu(): void {
    this.router.navigate(['/inicio']);
  }
}
