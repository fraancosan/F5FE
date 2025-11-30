import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button2',
  imports: [],
  templateUrl: './button2.html',
  styleUrl: './button2.css',
})
export class Button2 {
  @Input() text: string = '';
}
