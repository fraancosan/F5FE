import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { Button2 } from '../../../shared/btns/button2/button2';
import { Button1 } from '../../../shared/btns/button1/button1';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { InputString } from '../../../shared/inputs/input-string/input-string';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Navigation } from '../../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Spinner } from '../../../shared/spinner/spinner';
import { Equipo } from '../../../services/db/equipo';

@Component({
  selector: 'app-crear-equipo',
  imports: [
    GoBack,
    Button1,
    Button2,
    InputString,
    ReactiveFormsModule,
    Spinner,
  ],
  templateUrl: './crear-equipo.html',
  styleUrl: './crear-equipo.css',
})
export default class CrearEquipo {
  faCalendar = faCalendar;
  form: FormGroup;
  loading = false;

  constructor(
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private EquipoService: Equipo,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
    });
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  crearEquipo() {
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
        duration: 5000,
      });
    }else {
        this.loading = true;
        this.EquipoService.create(this.form.value.nombre).subscribe({
          next: (res) => {
            this.loading = false;
            this.snackBar.open('Equipo creado con éxito', 'Aceptar', {
              duration: 5000,
            });
            this.navService.toPageTop('gestionar-equipo');
          },
          error: (err) => {
            this.loading = false;
          }
        });
      }
  }
}
