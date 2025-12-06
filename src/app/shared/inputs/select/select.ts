import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select',
  imports: [FaIconComponent],
  templateUrl: './select.html',
  styleUrl: './select.css',
})
export class Select {
  @Input() icon?: IconProp;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() options: { value: string; text: string; disabled: boolean }[] = [];
  @Output() valueChange = new EventEmitter<string>();

  faChevronDown = faChevronDown;

  onChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.valueChange.emit(val);
  }
}
