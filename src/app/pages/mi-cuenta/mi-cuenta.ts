import { usuario } from './../../Interfases/interfaces';
import { Component } from '@angular/core';
import { Button1 } from '../../shared/btns/button1/button1';
import { Button2 } from '../../shared/btns/button2/button2';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputString } from '../../shared/inputs/input-string/input-string';
import { GoBack } from '../../shared/go-back/go-back';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { Navigation } from '../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Users } from '../../services/db/users';
import { Spinner } from '../../shared/spinner/spinner';

@Component({
  selector: 'app-mi-cuenta',
  imports: [
    Button1,
    Button2,
    ReactiveFormsModule,
    InputString,
    GoBack,
    Spinner,
  ],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export default class MiCuenta {
  faCalendar = faCalendar;
  form: FormGroup;
  loading = true;

  user: usuario = {} as usuario;

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

  ngOnInit() {
    this.loading = true;
    this.usersService.getOwnAccount().subscribe({
      next: (res) => {
        this.user = res;
        this.patchForm();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  patchForm() {
    this.form.patchValue({
      mail: this.user.mail,
      contraseña: '********',
      dni: this.user.dni,
      nombre: this.user.nombre,
      telefono: this.user.telefono,
    });
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  actualizarDatos() {
    const data = this.form.value;
    data.id = this.user.id;
    data.contraseña =
      data.contraseña === '********' ? undefined : data.contraseña;
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
        duration: 5000,
      });
    } else {
      this.loading = true;
      this.usersService.update(data).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Datos actualizados', 'Cerrar', {
            duration: 5000,
          });
        },
        error: (err) => {
          this.loading = false;
        },
      });
    }
  }
}
