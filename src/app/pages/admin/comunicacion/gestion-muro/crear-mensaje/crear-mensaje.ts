import { Component } from '@angular/core';
import { GoBack } from '../../../../../shared/go-back/go-back';
import { Button2 } from '../../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../../shared/btns/button1/button1';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { InputString } from '../../../../../shared/inputs/input-string/input-string';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Navigation } from '../../../../../services/common/navigation';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Spinner } from '../../../../../shared/spinner/spinner';
import { ActivatedRoute } from '@angular/router';
import { InputDate } from '../../../../../shared/inputs/input-date/input-date';
import { muro } from '../../../../../Interfases/interfaces';
import { Muro } from '../../../../../services/db/muro';

@Component({
  selector: 'app-crear-mensaje',
  imports: [
    GoBack,
    Button2,
    Button1,
    InputString,
    InputDate,
    ReactiveFormsModule,
    Spinner,
  ],
  templateUrl: './crear-mensaje.html',
  styleUrl: './crear-mensaje.css'
})
export default class CrearMensaje {

  faCalendar = faCalendar;
  form: FormGroup;
  loading = false;
  isEditMode = false;
  muroId: number | null = null;
  muro: muro | null = null;

  constructor (
    private navService: Navigation,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private muroService: Muro
  ) {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      noticia: ['', Validators.required],
      fecha: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.muroId = +id;
      this.loading = true;
      this.muroService.getById(this.muroId).subscribe({
        next: (data) => {
          this.muro = data;
          this.form.patchValue({
            titulo: data.titulo,
            noticia: data.noticia,
            fecha: data.fecha,
            fechaFin: data.fechaFin,
          });
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Error al cargar el mensaje', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  cancelarMensaje() {
    this.navService.toPageTop('/admin/comunicacion/gestion-muro');
  }

  crearMensaje() {
    if (!this.form.valid) {
      this.snackBar.open('Por favor, complete todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.isEditMode) {
      this.muroService.create(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Mensaje creado exitosamente', 'Cerrar', { duration: 3000 });
          this.navService.toPageTop('/admin/comunicacion/gestion-muro');
        },
        error: () => {
          this.snackBar.open('Error al crear el mensaje', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.muroService.update(this.muroId!, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('Mensaje actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.navService.toPageTop('/admin/comunicacion/gestion-muro');
        },
        error: () => {
          this.snackBar.open('Error al actualizar el mensaje', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

}