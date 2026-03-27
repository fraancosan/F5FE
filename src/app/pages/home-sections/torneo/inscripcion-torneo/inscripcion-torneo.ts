import { Component} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navigation } from '../../../../services/common/navigation';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { Spinner } from '../../../../shared/spinner/spinner';
import { GoBack } from '../../../../shared/go-back/go-back';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Select } from '../../../../shared/inputs/select/select';
import { Users } from '../../../../services/db/users';
import { EquipoTorneo } from '../../../../services/db/equipo-torneo'
import { EquipoUsuario } from '../../../../services/db/equipo-usuario';
import { Torneo } from '../../../../services/db/torneo';
import { torneo as TorneoInterface } from '../../../../Interfases/interfaces';
import { InputString } from '../../../../shared/inputs/input-string/input-string';
import { FormGroup,FormControl, ReactiveFormsModule } from '@angular/forms';

interface SelectOption {
  value: string;
  text: string;
  disabled: boolean;
}

@Component({
  selector: 'app-inscripcion-torneo',
  imports: [
    Button2,
    Button1,
    Spinner,
    GoBack,
    Select,
    InputString,
    ReactiveFormsModule
  ],
  templateUrl: './inscripcion-torneo.html',
  styleUrl: './inscripcion-torneo.css'
})
export default class InscripcionTorneo {
  torneo: TorneoInterface | null = null;
  faCalendar = faCalendar;
  equiposOptions: SelectOption[] = [];
  equipoSeleccionadoId: string = '';
  loading: boolean = false;
  equiposInscritosCount: number = 0;

  form = new FormGroup({
  descripcion: new FormControl({ value: '', disabled: true }),
  fechas: new FormControl({ value: '', disabled: true }),
  horario: new FormControl({ value: '', disabled: true }),
  precio: new FormControl({ value: '', disabled: true }),
  });

  get puedeInscribirse(): boolean {
    const tieneEquipo = this.equipoSeleccionadoId !== '';
    const hayCupos = this.torneo ? this.equiposInscritosCount < this.torneo.cantidadEquipos : false;
    return tieneEquipo && hayCupos;
  }

  constructor(
    private torneoService: Torneo,
    private equipoTorneoService: EquipoTorneo,
    private EquipoUsuarioService: EquipoUsuario,
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private usersService: Users,
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    const id = params['id'];

    if (id) {
      this.obtenerTorneo(+id);
    }
  });
    this.usersService.getOwnAccount().subscribe({
      next: (user) => {
        this.obtenerEquiposUsuario(user.id);
      },
      error: () => {
        this.snackBar.open('No se pudo obtener el usuario', 'Cerrar', {
          duration: 3000,
        });
      }
    });
}

  obtenerTextoBotonInscripcion(): string {
    if (this.torneo && this.equiposInscritosCount >= this.torneo.cantidadEquipos) {
      return 'Cupo Lleno';
    }
    if (!this.equipoSeleccionadoId) {
      return 'Seleccione un Equipo'; 
    }
    return "Unirse a Torneo";
  }
  obtenerTorneo(idTorneo: number) {
    this.torneoService.getById(idTorneo).subscribe({
      next: (torneo) => {
        this.torneo  = torneo;
        this.obtenerCupos(idTorneo);
      },
      error: (err) => {
        this.snackBar.open('Error al obtener los datos del torneo', 'Cerrar', { duration: 5000 });
      }
    });
  }

  obtenerCupos(idTorneo: number) {
    this.equipoTorneoService.getAllById({idTorneo : idTorneo}).subscribe({
      next: (res: any) => {
        this.equiposInscritosCount = res.cantidad;
      },
      error: (err) => {
        console.error('Error al obtener inscritos del torneo:', err);
        this.equiposInscritosCount = 0;
      }
    });
  }

  obtenerEquiposUsuario(idLogueado: number) {
    this.EquipoUsuarioService.getAll({idUsuario : idLogueado}).subscribe({
        next: (res: any[]) => {
          this.equiposOptions = res.map(relacion => ({
            value: relacion.idEquipo.toString(), 
            text: relacion.Equipo?.nombre || `Equipo ${relacion.idEquipo}`,
            disabled: false 
          }));
        },
        error: (err) => {
          this.equiposOptions = [];
        }
      });
    }

  InscripcionTorneo(torneo: TorneoInterface | null, idEquipo: number){
    if (!torneo || !idEquipo) {
    this.snackBar.open('Faltan datos por cargar...', 'Cerrar', { duration: 3000 });
    return;
    }

    this.loading = true;

    this.equipoTorneoService.create({idEquipo: Number(idEquipo), idTorneo: torneo.id}).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.urlPreferenciaPago) {
        window.open(response.urlPreferenciaPago, '_blank');
  
        this.snackBar.open('Redirigiendo a la plataforma de pago...', 'Cerrar', {duration: 5000,});
        
        this.navService.toPageTop('torneo');
        }
      },
    error: (err) => {
      this.loading = false;
      console.log('Error en la inscripción:', err);
    }
   });
  }
  
  volverTorneos() {
    this.navService.toPageTop('torneo');
  }
}