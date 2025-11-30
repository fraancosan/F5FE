import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button1',
  imports: [],
  templateUrl: './button1.html',
  styleUrl: './button1.css',
})
export class Button1 {
  @Input() text: string = '';
}
