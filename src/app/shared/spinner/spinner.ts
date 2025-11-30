import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  imports: [NgClass, NgStyle, MatProgressSpinnerModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  @Input() margin?: string;
  @Input() centrado: boolean = true;
  @Input() size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' = 'md';
  @Input() mode: 'light' | 'dark' = 'light';
}
