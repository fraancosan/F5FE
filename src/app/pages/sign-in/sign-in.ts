import { Component } from '@angular/core';
import { Button2 } from '../../shared/button2/button2';
import { Button1 } from '../../shared/button1/button1';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { InputString } from '../../shared/input-string/input-string';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoBack } from '../../shared/go-back/go-back';

@Component({
  selector: 'app-sign-in',
  imports: [Button1, Button2, InputString, ReactiveFormsModule, GoBack],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export default class SignIn {
  faCalendar = faCalendar;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-zA-Z]{2,}$'),
          Validators.maxLength(60),
        ],
      ],
      contraseña: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(60),
        ],
      ],
    });
  }
}
