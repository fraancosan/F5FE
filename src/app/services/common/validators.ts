import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor() {}

  getMessageError(
    form: any,
    field: string,
    msgPersonalized: string = 'El campo'
  ): string {
    let message = '';
    const errors = form.get(field)?.errors;
    if (errors?.['required']) {
      message = 'El campo es requerido';
    } else if (errors?.['pattern']) {
      message = msgPersonalized + ' no cumple con el formato válido';
    } else if (errors?.['minlength']) {
      message =
        msgPersonalized +
        ` debe tener al menos ${errors?.['minlength'].requiredLength} caracteres`;
    } else if (errors?.['maxlength']) {
      message =
        msgPersonalized +
        ` debe tener menos de ${errors?.['maxlength'].requiredLength} caracteres`;
    } else if (errors?.['email']) {
      message = 'El email no es válido';
    }
    return message;
  }
}
