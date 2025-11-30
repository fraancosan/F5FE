import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button3',
  imports: [],
  templateUrl: './button3.html',
  styleUrl: './button3.css',
})
export class Button3 {
  @Input() text: string = '';
}
