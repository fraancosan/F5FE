import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-check-box',
  imports: [FormsModule, FaIconComponent, NgClass],
  templateUrl: './input-check-box.html',
  styleUrl: './input-check-box.css',
})
export class InputCheckBox {
  @Input() icon?: IconProp;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() value: boolean = false;
  @Input() mode: 'light' | 'dark' = 'light';
  @Output() valueChange = new EventEmitter<boolean>();

  faCheck = faCheck;

  onChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.valueChange.emit(checked);
  }
}
