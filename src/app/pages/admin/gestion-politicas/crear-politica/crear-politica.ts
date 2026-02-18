import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { InputString } from '../../../../shared/inputs/input-string/input-string';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Navigation } from '../../../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Politicas} from '../../../../services/db/politicas';
import { politica } from '../../../../Interfases/interfaces';

@Component({
  selector: 'app-crear-politica',
  imports: [
    GoBack,
    Button2,
    Button1,
    InputString,
    ReactiveFormsModule,
    Spinner
  ],
  templateUrl: './crear-politica.html',
  styleUrl: './crear-politica.css'
})

export default class CrearPolitica {

  faCalendar = faCalendar;
  form: FormGroup;
  loading = false;

  constructor(
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private politicasService: Politicas,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  crearPolitica() {
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
        duration: 5000,
      });
    }else {
        this.loading = true;
        this.politicasService.create(this.form.value).subscribe({
          next: (res) => {
            this.loading = false;
            this.snackBar.open('Politica creada con éxito', 'Aceptar', {
              duration: 5000,
            });
            this.navService.toPageTop('admin/politicas');
          },
          error: (err) => {
            this.loading = false;
          }
        });
      }
  }
}
