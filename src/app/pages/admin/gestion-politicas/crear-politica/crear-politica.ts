import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import {
  faAlignLeft,
  faCalendar,
  faClock,
  faDollarSign,
  faHashtag,
  faPercent,
  faHeading
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
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
import { FIXED_POLICIES_CONFIG, PolicyInputType } from './config-politica';

@Component({
  selector: 'app-crear-politica',
  imports: [
    GoBack,
    Button2,
    Button1,
    FaIconComponent,
    InputString,
    ReactiveFormsModule,
    Spinner
  ],
  templateUrl: './crear-politica.html',
  styleUrl: './crear-politica.css'
})

export default class CrearPolitica {

  faCalendar = faCalendar;
  faHeading = faHeading;
  form: FormGroup;
  loading = false;
  isEditMode = false;
  nombreOriginal: string = '';

  // Configuración dinámica del control de la descripción
  inputType: PolicyInputType = 'text';
  inputLabel: string = 'Descripción de la política';
  inputPlaceholder: string = 'Ingrese la descripción';
  inputIcon: IconProp = faAlignLeft;

  constructor(
    private navService: Navigation,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private politicasService: Politicas,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    const nombreParam = this.route.snapshot.paramMap.get('nombre');

    if (nombreParam) {
      this.isEditMode = true;
      this.nombreOriginal = nombreParam;
      this.configurarPolitica(nombreParam);
      this.cargarPolitica(nombreParam);
      this.form.get('nombre')?.disable();
    }
  }

  /**
    Configura dinámicamente los metadatos y validaciones del formulario
    según la política que se está editando o creando.
   */
  private configurarPolitica(nombre: string) {
    const config = FIXED_POLICIES_CONFIG[nombre];

    if (config) {
      this.inputType = config.type;
      this.inputLabel = config.label;
      this.inputPlaceholder = config.placeholder;
      this.inputIcon = this.getIconForType(this.inputType);

      const descControl = this.form.get('descripcion');
      descControl?.clearValidators();
      descControl?.addValidators(Validators.required);

      // Aplicar reglas específicas según el tipo
      if (this.inputType === 'time') {
        // Regex estricto para formato 24hs HH:mm
        descControl?.addValidators(Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/));
      } else if (this.inputType === 'currency' || this.inputType === 'number') {
        descControl?.addValidators([
          Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
          Validators.min(0)
        ]);
      } else if (this.inputType === 'percentage') {
        descControl?.addValidators([
          Validators.min(1),
          Validators.max(100)
        ]);
      }

      descControl?.updateValueAndValidity();
    }
  }

  private getIconForType(type: PolicyInputType): IconProp {
    switch (type) {
      case 'time':
        return faClock;
      case 'currency':
        return faDollarSign;
      case 'percentage':
        return faPercent;
      case 'number':
        return faHashtag;
      default:
        return faAlignLeft;
    }
  }

 private validarHorario(callback: () => void): void {

  const nombre = this.form.getRawValue().nombre;
  const hora = this.form.get('descripcion')?.value;

  if (nombre === 'horaAbre') {
    this.politicasService.getByNombre('horaCierra').subscribe({
      next: (res: politica) => {
        if (res.descripcion && hora >= res.descripcion) {
          this.loading = false;
          this.snackBar.open(
            'La hora de apertura debe ser menor que la de cierre',
            'Aceptar',
            { duration: 3000 }
          );
          return;
        }

        callback();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          'No se pudo validar la hora de cierre.',
          'Aceptar',
          { duration: 3000 }
        );
      }
    });

    return;
  }

  if (nombre === 'horaCierra') {
    this.politicasService.getByNombre('horaAbre').subscribe({
      next: (res: politica) => {
        if (res.descripcion && hora <= res.descripcion) {
          this.loading = false;
          this.snackBar.open(
            'La hora de cierre debe ser mayor que la de apertura',
            'Aceptar',
            { duration: 3000 }
          );
          return;
        }

        callback();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          'No se pudo validar la hora de apertura.',
          'Aceptar',
          { duration: 3000 }
        );
      }
    });

    return;
  }

  // Si no es una política de horario, continúa normalmente
  callback();
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
            this.snackBar.open('Error al crear la política ', 'Aceptar', {
              duration: 5000,
            });
          }
        });
      }
  }

  cargarPolitica(nombre: string) {
    this.loading = true;
    this.politicasService.getByNombre(nombre).subscribe({
      next: (res: politica) => {
        let valorDescripcion = res.descripcion ?? '';
        if (this.inputType === 'percentage' && valorDescripcion) {
          const num = Number(valorDescripcion.replace(',', '.'));
          if (!isNaN(num) && num <= 1) {
            valorDescripcion = String(num * 100);
          }
        }

        this.form.patchValue({
          nombre: res.nombre,
          descripcion: valorDescripcion
        });
        this.loading = false
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error al cargar la política ', 'Aceptar', {
          duration: 5000,
        });
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
    let valorFinal = String(this.form.get('descripcion')?.value ?? '').trim().replace(',', '.');
    // Convertir de porcentaje visual (ej: 25%) al formato que guarda la BD (ej: "0.25")
    if (this.inputType === 'percentage') {
      // Si ingresó algo como 0.25 (menor a 1 pero mayor a 0), lo transformamos a 25
      let num = Number(valorFinal);
      if (num > 0 && num < 1) {
          num = num * 100;
      }
      if (isNaN(num) || num < 0 || num > 100) {
        this.snackBar.open('Ingrese un porcentaje válido entre 0 y 100', 'Aceptar', { duration: 3000 });
        this.loading = false;
        return;
      }
      //Esto lo hace con todo? 
      valorFinal = String(num / 100);   
    }
  
    this.validarHorario(() => {
    if (this.isEditMode) {
        this.politicasService.update(this.nombreOriginal, valorFinal).subscribe({
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
  });
  }
}