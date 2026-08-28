import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsService } from '../../../services/common/validators';
@Component({
  selector: 'app-input-date',
  imports: [FaIconComponent, DatePipe],
  templateUrl: './input-date.html',
  styleUrl: './input-date.css',
  providers: [DatePipe],
})
export class InputDate {
  @Input() label: string = '';
  @Input() fromDate?: Date;
  @Input() toDate?: Date;
  @Input() name: string = '';
  @Input() form?: FormGroup;
  @Input() required: boolean = false
  @Input() prefixMessage?: string;
  @Output() dateSelected = new EventEmitter<string>();

  constructor(private datePipe: DatePipe,
    public vs: ValidatorsService
  ) {}

  icon = faCalendar;
  placeholder: string = 'dd/mm/aaaa';

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (val) {
      const [year, month, day] = val.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      this.placeholder = this.datePipe.transform(dateObj, 'dd/MM/yyyy')!;
    } else {
      this.placeholder = 'dd/mm/aaaa';
    }

    const control = this.form?.get(this.name)
    control?.setValue(val);
    control?.markAsTouched();

    this.dateSelected.emit(val);
  }

  onBlur() {
    this.form?.get(this.name)?.markAsTouched();
  }
}
