import { Component, ElementRef } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { faCalendar,
  faDollarSign,
  faHashtag,
  faAlignLeft,
 } from '@fortawesome/free-solid-svg-icons';
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
import { Torneo } from '../../../../services/db/torneo'; 
import { torneo } from '../../../../Interfases/interfaces';
import { ActivatedRoute } from '@angular/router';
import { InputDate } from '../../../../shared/inputs/input-date/input-date';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-crear-torneo',
  imports: [
    GoBack,
    Button2,
    Button1,
    InputString,
    InputDate,
    ReactiveFormsModule,
    Spinner,
  ],
  templateUrl: './crear-torneo.html',
  styleUrl: './crear-torneo.css'
})
export default class CrearTorneo {

  faCalendar = faCalendar;
  faDollarSign = faDollarSign;
  faHashtag = faHashtag;
  faAlignLeft = faAlignLeft;
  form: FormGroup;
  loading = false;
  isEditMode = false;
  torneoId: number | null = null;

  constructor(
    private host: ElementRef<HTMLElement>,
    private navService: Navigation,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private torneoService: Torneo,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      precioInscripcion: ['', Validators.required],
      cantidadEquipos: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    });

  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      const id = parseInt(idParam, 10);
      this.cargarTorneo(id);
    }
}

  cancelar() {
    this.navService.toPageTop('/admin/torneos');
  }

  crearTorneo() {
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
      duration: 5000,
    });
      this.loading = false;
      return;
    }

    if (this.form.valid) {
      this.loading = true;

      const payload = {
        ...this.form.value,
        precioInscripcion: Number(this.form.value.precioInscripcion),
        cantidadEquipos: Number(this.form.value.cantidadEquipos),
      };
      this.torneoService.create(payload).subscribe({
        next: (response) => {
          this.snackBar.open('Torneo creado exitosamente', 'Aceptar', {
            duration: 5000,
          });
          this.loading = false;
          this.navService.toPageTop('/admin/torneos');
        },
        error: (error) => {
          this.snackBar.open('Error al crear el torneo', 'Aceptar', {
            duration: 5000,
          });
          this.loading = false;
        }
      });
    }
  }

  cargarTorneo(id: number) {
    this.loading = true;
    this.torneoService.getById(id).subscribe({
      next: (response) => {
        this.torneoId = response.id;
        this.form.patchValue({
          ...response,
          fechaInicio: this.formatDateForInput(response.fechaInicio),
          fechaFin: this.formatDateForInput(response.fechaFin),
        });
        this.syncDateInputsWithForm();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  private formatDateForInput(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatearFecha(value: Date | string): string {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
  }

  private validarSuperposicion(
  fechaInicio: string,
  fechaFin: string,
  idActual?: number
  ): Observable<boolean> {
  return this.torneoService.getAll().pipe(
    map((torneos) =>
      torneos.some((torneo) => {
        // Al editar, no comparar el torneo consigo mismo
        if (torneo.id === idActual) {
          return false;
        }

        const inicioExistente = this.formatearFecha(torneo.fechaInicio);
        const finExistente = this.formatearFecha(torneo.fechaFin);

        return (
          fechaInicio <= finExistente &&
          fechaFin >= inicioExistente
          );
        })
      )
    );
  }

  // app-input-date no implementa ControlValueAccessor, por eso seteamos el valor visualmente en modo edición.
  private syncDateInputsWithForm() {
    setTimeout(() => {
      const dateInputs = this.host.nativeElement.querySelectorAll(
        'app-input-date input[type="date"]'
      ) as NodeListOf<HTMLInputElement>;

      const fechaInicio = this.form.get('fechaInicio')?.value || '';
      const fechaFin = this.form.get('fechaFin')?.value || '';

      if (dateInputs[0]) {
        dateInputs[0].value = fechaInicio;
        dateInputs[0].dispatchEvent(new Event('input'));
      }

      if (dateInputs[1]) {
        dateInputs[1].value = fechaFin;
        dateInputs[1].dispatchEvent(new Event('input'));
      }
    });
  }

  guardarTorneo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Complete todos los campos o corrija los errores', 'Aceptar', {
        duration: 5000,
      });
      return;
    }
    this.loading = true;
    const fechaInicio = this.form.get('fechaInicio')?.value;
    const fechaFin = this.form.get('fechaFin')?.value;

    if (fechaInicio > fechaFin) {
      this.snackBar.open('La fecha de inicio debe ser menor a la fecha de fin', 'Aceptar', {
        duration: 5000,
      });
      this.loading = false;
      return;
    };

    this.validarSuperposicion(
     fechaInicio,
     fechaFin,
     this.torneoId || undefined
    ).subscribe({
    next: (haySuperposicion) => {
    if (haySuperposicion) {
      this.snackBar.open(
        'Las fechas del torneo se superponen con otro torneo existente',
        'Aceptar',
        { duration: 5000 }
      );
      this.loading = false;
      return;
    }
    if (this.isEditMode) {
      const body = {
        descripcion: this.form.value.descripcion,
        fechaInicio: this.form.value.fechaInicio,
        fechaFin: this.form.value.fechaFin,
        precioInscripcion: Number(this.form.value.precioInscripcion),
        cantidadEquipos: Number(this.form.value.cantidadEquipos),
      };

      this.torneoService.update(this.torneoId!, body).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open(
            'Torneo actualizado con éxito',
            'Aceptar',
            { duration: 5000 }
          );
          this.navService.toPageTop('/admin/torneos');
        },
        error: () => {
          this.loading = false;
          this.snackBar.open(
            'Error al actualizar el torneo',
            'Aceptar',
            { duration: 5000 }
          );
        },
      });
    } else {
      this.crearTorneo();
    }
  },

  error: () => {
    this.loading = false;
    this.snackBar.open(
      'Error al validar las fechas del torneo',
      'Aceptar',
      { duration: 5000 }
    );
  },
})
}
}
