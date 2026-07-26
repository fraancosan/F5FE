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
import { ActivatedRoute } from '@angular/router';

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
  isEditMode = false;
  nombreOriginal: string = '';

  constructor(
    private navService: Navigation,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private politicasService: Politicas,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    const nombreParam = this.route.snapshot.paramMap.get('nombre');

    if (nombreParam) {
      this.isEditMode = true;
      this.nombreOriginal = nombreParam;
      this.cargarPolitica(nombreParam);

      this.form.get('nombre')?.disable();
    }
  }

  private esPorcentajeValido(nombre: string, descripcion: string): boolean {
  const camposPorcentaje = ['descuentoPremium', 'porcentajeSeña'];
  
  if (camposPorcentaje.includes(nombre)) {
    const valorNum = Number(descripcion.replace(',', '.'));
    
    // Debe ser un número válido, mayor que 0 y menor o igual a 1 (ej: 0.25 para 25%)
    if (isNaN(valorNum) || valorNum <= 0 || valorNum > 1) {
      return false;
    }
  }
  return true;
  }

  cancelar() {
    this.navService.toPageTop('admin/politicas');
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

  cargarPolitica(nombre: string) {
    this.loading = true;
    this.politicasService.getByNombre(nombre).subscribe({
      next: (res: politica) => {
        this.form.patchValue(res);
        this.loading = false
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  guardarPolitica() {
    if (this.form.invalid) {
      this.snackBar.open('Primero complete sus datos', 'Aceptar', {
        duration: 5000,
      });
      return;
    }
    this.loading = true;
    // Validacion de porcentajes para que siempre sean menores a 1 (ej: 0.25 = 25%)
    const nombrePol = (this.isEditMode ? this.nombreOriginal : this.form.get('nombre')?.value) ?? '';
    const textoDescripcion = String(this.form.get('descripcion')?.value ?? '').trim();
    //VALIDACIÓN DE SEGURIDAD PARA PORCENTAJES
    if (!this.esPorcentajeValido(nombrePol, textoDescripcion)) {
      this.snackBar.open(
        'Para porcentajes debe ingresar un formato decimal menor a 1 (ej: 0.25 para 25%)',
        'Aceptar',
        { duration: 6000 }
      );
      return;
    }

    if (this.isEditMode) {
        const textoDescripcion = String(this.form.value.descripcion).trim();
        this.politicasService.update(this.nombreOriginal, textoDescripcion).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Politica actualizada con éxito', 'Aceptar', {
            duration: 5000,
          });
          this.navService.toPageTop('admin/politicas');
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open('Error al actualizar la política ', 'Aceptar', {
            duration: 5000,
          });
        }
      });
      } else {
         this.crearPolitica();
      }

  } 
}