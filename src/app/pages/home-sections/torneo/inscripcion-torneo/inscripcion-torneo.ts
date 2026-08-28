import { Component} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navigation } from '../../../../services/common/navigation';
import { Button2 } from '../../../../shared/btns/button2/button2';
import { Button1 } from '../../../../shared/btns/button1/button1';
import { Spinner } from '../../../../shared/spinner/spinner';
import { GoBack } from '../../../../shared/go-back/go-back';
import { faCalendar, faAlignLeft, faDollarSign, faClock } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Select } from '../../../../shared/inputs/select/select';
import { Users } from '../../../../services/db/users';
import { EquipoTorneo } from '../../../../services/db/equipo-torneo'
import { EquipoUsuario } from '../../../../services/db/equipo-usuario';
import { Torneo } from '../../../../services/db/torneo';
import { torneo as TorneoInterface } from '../../../../Interfases/interfaces';
import { InputString } from '../../../../shared/inputs/input-string/input-string';
import { FormGroup,FormControl, ReactiveFormsModule } from '@angular/forms';
import { equipoUsuario } from '../../../../Interfases/interfaces';

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
  faAlignLeft = faAlignLeft;
  faDollarSign = faDollarSign;
  faClock = faClock;
  equiposOptions: SelectOption[] = [];
  equiposUsuario: equipoUsuario[] = [];
  equipoSeleccionadoId: string = '';
  equipoSeleccionado?: equipoUsuario;
  cantidadMiembrosEquipo: number = 0;
  cargandoMiembros: boolean = false;
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
        next: (res: equipoUsuario[]) => {
          this.equiposUsuario = res;
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

  seleccionarEquipo(id: string): void {
    this.equipoSeleccionadoId = id;

    this.equipoSeleccionado = this.equiposUsuario.find(
      relacion => relacion.idEquipo === Number(id)
    );

    this.cantidadMiembrosEquipo = 0;
    this.cargandoMiembros = true;

    this.EquipoUsuarioService.getAllMiembros(Number(id)).subscribe({
      next: miembros => {
        this.cantidadMiembrosEquipo = miembros.length;
        this.cargandoMiembros = false;
      },
      error: () => {
        this.cargandoMiembros = false;
      }
    });
  }

  InscripcionTorneo(torneo: TorneoInterface | null, idEquipo: number){
    if (!torneo || !idEquipo) {
    this.snackBar.open('Faltan datos por cargar...', 'Cerrar', { duration: 3000 });
    return;
    }

    this.loading = true;
    const fechaInicio = String(torneo.fechaInicio).slice(0, 10);
    const hoy = new Date();
    const fechaHoy = [hoy.getFullYear(),String(hoy.getMonth() + 1).padStart(2, '0'),String(hoy.getDate()).padStart(2, '0')].join('-');
    if (fechaInicio <= fechaHoy) {
      this.loading = false;
      this.snackBar.open('El torneo ya ha comenzado, no se puede inscribir.', 'Cerrar', { duration: 5000 });
      return;
    }
    if (!this.equipoSeleccionado?.capitan) {
      this.loading = false;
      this.snackBar.open('Solo el capitan del equipo puede inscribirse en el torneo.', 'Cerrar', { duration: 5000 });
      return;
    }
    if(this.cantidadMiembrosEquipo < 5) {
      this.loading = false;
      this.snackBar.open('El equipo debe tener al menos 5 miembros para inscribirse en el torneo.', 'Cerrar', { duration: 5000 });
      return;
    }
    if(this.equiposInscritosCount >= torneo.cantidadEquipos) {
      this.loading = false;
      this.snackBar.open('El torneo ya ha alcanzado el número máximo de equipos inscritos.', 'Cerrar', { duration: 5000 });
      return;
    }
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
      this.snackBar.open('Error al inscribirse en el torneo', 'Cerrar', { duration: 5000 });
    }
   });
  }
  
  volverTorneos() {
    this.navService.toPageTop('torneo');
  }
}