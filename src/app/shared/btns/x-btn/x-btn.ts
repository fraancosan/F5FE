import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FaIconComponent, SizeProp } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-x-btn',
  imports: [FaIconComponent, NgClass],
  templateUrl: './x-btn.html',
  styleUrl: './x-btn.css',
})
export class XBtn {
  @Input() size: SizeProp = '1x';
  @Input() color: 'white' | 'dark' | 'light' = 'white';
  xIcon = faX;
}
