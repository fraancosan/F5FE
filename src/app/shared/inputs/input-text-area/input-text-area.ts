import { Component, forwardRef, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ValidatorsService } from '../../../services/common/validators';
import {
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';


@Component({
  selector: 'app-input-text-area',
  standalone: true,
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './input-text-area.html',
  styleUrl: './input-text-area.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextArea),
      multi: true,
    },
  ],
})
export class InputTextArea {
  @Input() icon?: IconProp;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() form?: FormGroup;
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() prefixMessage?: string;
  @Input() rows: number = 5;


  constructor(public vs: ValidatorsService) {}

  value: string = '';
  disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

