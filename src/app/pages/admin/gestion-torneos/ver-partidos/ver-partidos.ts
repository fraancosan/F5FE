import { Component, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { equipo, equipoTorneo, partidoTorneo, torneo } from '../../../../Interfases/interfaces';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button3 } from '../../../../shared/btns/button3/button3';
import { XBtn } from '../../../../shared/btns/x-btn/x-btn';
import { GoBack } from '../../../../shared/go-back/go-back';
import { InputDate } from '../../../../shared/inputs/input-date/input-date';
import { InputString } from '../../../../shared/inputs/input-string/input-string';
import { Select } from '../../../../shared/inputs/select/select';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Navigation } from '../../../../services/common/navigation';
import { Equipo } from '../../../../services/db/equipo';
import { EquipoTorneo } from '../../../../services/db/equipo-torneo';
import { PartidosTorneo } from '../../../../services/db/partidos-torneo';
import { Torneo } from '../../../../services/db/torneo';

@Component({
  selector: 'app-ver-partidos',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    Button1,
    Button2,
    Button3,
    XBtn,
    InputString,
    InputDate,
    Select,
    DatePipe,
  ],
  templateUrl: './ver-partidos.html',
  styleUrl: './ver-partidos.css',
})
export default class VerPartidos {
  displayedColumns: string[] = [
    'Equipo1',
    'Resultado',
    'Equipo2',
    'Fecha',
    'Acciones',
  ];

  torneoId: number | null = null;
  selectedTorneo: torneo | null = null;
  partidos: partidoTorneo[] = [];
  equiposTorneo: equipo[] = [];
  loading = false;
  loadingPartidos = false;
  loadingEquipos = false;
  isEditPartido = false;
  partidoEditId: number | null = null;
  partidoForm: FormGroup;

  constructor(
    private host: ElementRef<HTMLElement>,
    private route: ActivatedRoute,
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private torneosService: Torneo,
    private partidosService: PartidosTorneo,
    private equipoTorneoService: EquipoTorneo,
    private equipoService: Equipo,
    private fb: FormBuilder
  ) {
    this.partidoForm = this.fb.group({
      idEquipo1: ['', Validators.required],
      idEquipo2: ['', Validators.required],
      resultado: ['', [Validators.required, Validators.maxLength(7),
        Validators.pattern(/^(0|[1-9][0-9]*)-(0|[1-9][0-9]*)$/)
      ]],
      fecha: ['', Validators.required],
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.snackBar.open('No se encontró el torneo seleccionado', 'Aceptar', {
        duration: 5000,
      });
      this.volverATorneos();
      return;
    }

    const torneoId = Number(idParam);
    if (Number.isNaN(torneoId)) {
      this.snackBar.open('El torneo seleccionado no es válido', 'Aceptar', {
        duration: 5000,
      });
      this.volverATorneos();
      return;
    }

    this.torneoId = torneoId;
    this.cargarTorneo(torneoId);
    this.cargarPartidosDelTorneo();
    this.cargarEquiposDelTorneo();
  }

  volverATorneos() {
    this.navService.toPageTop('/admin/torneos');
  }

  nuevoPartido() {
    this.isEditPartido = false;
    this.partidoEditId = null;
    this.partidoForm.reset({
      idEquipo1: '',
      idEquipo2: '',
      resultado: '',
      fecha: '',
    });
    this.syncDateInputsWithForm();
  }

  editarPartido(partido: partidoTorneo) {
    this.isEditPartido = true;
    this.partidoEditId = partido.id;
    this.partidoForm.patchValue({
      idEquipo1: String(this.getEquipoId(partido.idEquipo1)),
      idEquipo2: String(this.getEquipoId(partido.idEquipo2)),
      resultado: partido.resultado,
      fecha: this.formatDateForInput(partido.fecha),
    });
    this.syncDateInputsWithForm();
  }

  guardarPartido() {
    if (!this.torneoId) {
      this.snackBar.open('Seleccione un torneo primero', 'Aceptar', {
        duration: 5000,
      });
      return;
    }

    if (this.partidoForm.invalid) {
      this.snackBar.open('Primero complete los datos del partido', 'Aceptar', {
        duration: 5000,
      });
      return;
    }

    const idEquipo1 = Number(this.partidoForm.value.idEquipo1);
    const idEquipo2 = Number(this.partidoForm.value.idEquipo2);

    if (idEquipo1 === idEquipo2) {
      this.snackBar.open('Los equipos deben ser distintos', 'Aceptar', {
        duration: 5000,
      });
      return;
    }

    const body: partidoTorneo = {
      id: this.partidoEditId ?? 0,
      idEquipo1,
      idEquipo2,
      idTorneo: this.torneoId,
      resultado: this.partidoForm.value.resultado?.trim() ?? '',
      fecha: this.partidoForm.value.fecha as unknown as Date,
    };

    this.loadingPartidos = true;

    const request = this.isEditPartido && this.partidoEditId
      ? this.partidosService.update(this.partidoEditId, body)
      : this.partidosService.create(body);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditPartido ? 'Partido actualizado con éxito' : 'Partido creado con éxito',
          'Aceptar',
          { duration: 5000 }
        );
        this.cargarPartidosDelTorneo();
        this.nuevoPartido();
      },
      error: () => {
        this.snackBar.open('Error al guardar el partido', 'Aceptar', {
          duration: 5000,
        });
        this.loadingPartidos = false;
      },
    });
  }

  eliminarPartido(id: number) {
    if (!confirm('¿Está seguro de que desea eliminar este partido?')) {
      return;
    }

    this.loadingPartidos = true;
    this.partidosService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Partido eliminado con éxito', 'Aceptar', {
          duration: 5000,
        });
        this.cargarPartidosDelTorneo();
      },
      error: () => {
        this.loadingPartidos = false;
        this.snackBar.open('Error al eliminar el partido', 'Aceptar', {
          duration: 5000,
        });
      },
    });
  }

  get loadingPartidosSeccion() {
    return this.loadingPartidos || this.loadingEquipos;
  }

  get equiposParaEquipo1() {
    const idEquipo2 = Number(this.partidoForm.value.idEquipo2 || 0);
    return this.equiposTorneo.filter((equipo) => equipo.id !== idEquipo2);
  }

  get equiposParaEquipo2() {
    const idEquipo1 = Number(this.partidoForm.value.idEquipo1 || 0);
    return this.equiposTorneo.filter((equipo) => equipo.id !== idEquipo1);
  }

  get opcionesEquipo1() {
    return [
      { value: '', text: 'Seleccione un equipo', disabled: true },
      ...this.equiposParaEquipo1.map((equipo) => ({
        value: String(equipo.id),
        text: equipo.nombre,
        disabled: false,
      })),
    ];
  }

  get opcionesEquipo2() {
    return [
      { value: '', text: 'Seleccione un equipo', disabled: true },
      ...this.equiposParaEquipo2.map((equipo) => ({
        value: String(equipo.id),
        text: equipo.nombre,
        disabled: false,
      })),
    ];
  }

  getNombreEquipo(valor: number | equipo) {
    if (typeof valor === 'object') {
      return valor.nombre;
    }

    const equipoEncontrado = this.equiposTorneo.find((equipo) => equipo.id === valor);
    return equipoEncontrado?.nombre ?? `Equipo ${valor}`;
  }

  private cargarTorneo(id: number) {
    this.loading = true;
    this.torneosService.getById(id).subscribe({
      next: (data) => {
        this.selectedTorneo = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private cargarPartidosDelTorneo() {
    if (!this.torneoId) {
      return;
    }

    this.loadingPartidos = true;
    this.partidosService.getAll({ idTorneo: this.torneoId }).subscribe({
      next: (data) => {
        this.partidos = data;
        this.loadingPartidos = false;
      },
      error: () => {
        this.loadingPartidos = false;
      },
    });
  }

  private cargarEquiposDelTorneo() {
    if (!this.torneoId) {
      return;
    }

    this.loadingEquipos = true;
    this.equipoTorneoService.getEquiposTorneo(this.torneoId).subscribe({
      next: (inscripciones) => {
        if (!inscripciones.length) {
          this.equiposTorneo = [];
          this.loadingEquipos = false;
          this.snackBar.open('No hay equipos inscriptos en este torneo', 'Aceptar', {
            duration: 5000,
          }); 
          return;
        }
        this.equiposTorneo =  inscripciones.map(inscripcion => inscripcion.equipo).filter(
          equipo => !!equipo);
        this.loadingEquipos = false;
      },
      error: () => {
        this.loadingEquipos = false;
      },
    });
  }

  private getEquipoId(valor: number | equipo) {
    return typeof valor === 'object' ? valor.id : valor;
  }

  private formatDateForInput(value: Date | string) {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // app-input-date no implementa ControlValueAccessor, por eso seteamos el valor visualmente.
  private syncDateInputsWithForm() {
    setTimeout(() => {
      const dateInputs = this.host.nativeElement.querySelectorAll(
        'app-input-date input[type="date"]'
      ) as NodeListOf<HTMLInputElement>;

      const fecha = this.partidoForm.get('fecha')?.value || '';

      if (dateInputs[0]) {
        dateInputs[0].value = fecha;
        dateInputs[0].dispatchEvent(new Event('input'));
      }
    });
  }
}
