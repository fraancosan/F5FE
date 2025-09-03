import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button4',
  imports: [],
  templateUrl: './button4.html',
  styleUrl: './button4.css',
})
export class Button4 {
  @Input() text: string = '';
}
