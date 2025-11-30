import { Component } from '@angular/core';
import { Button2 } from '../../shared/button2/button2';
import { Button1 } from '../../shared/button1/button1';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputString } from '../../shared/input-string/input-string';
import { GoBack } from '../../shared/go-back/go-back';
import { Navigation } from '../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Users } from '../../services/db/users';
import { Spinner } from '../../shared/spinner/spinner';

@Component({
  selector: 'app-sign-up',
  imports: [
    Button1,
    Button2,
    ReactiveFormsModule,
    InputString,
    GoBack,
    Spinner,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export default class SignUp {
  faCalendar = faCalendar;
  form: FormGroup;
  loading = false;

  constructor(
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private usersService: Users,
    private fb: FormBuilder
  ) {
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
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{7,8}$'),
          Validators.minLength(7),
          Validators.maxLength(8),
        ],
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZÀ-ÿ\\s]{2,60}$'),
          Validators.minLength(2),
          Validators.maxLength(60),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{7,30}$'),
          Validators.minLength(7),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  registrarse() {
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
        duration: 5000,
      });
    } else {
      this.loading = true;
      this.usersService.create(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Usuario creado, inicie sesión', 'Aceptar', {
            duration: 5000,
          });
          this.navService.toPageTop('iniciar-sesion');
        },
        error: (err) => {
          this.loading = false;
        },
      });
    }
  }
}
