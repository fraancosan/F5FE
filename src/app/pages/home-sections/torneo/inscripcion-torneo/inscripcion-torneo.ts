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
import { Equipo } from '../../../../services/db/equipo';

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
  constructor(
    private torneoService: Torneo,
    private equipoTorneoService: EquipoTorneo,
    private EquipoUsuarioService: EquipoUsuario,
    private EquipoService: Equipo,
    private navService: Navigation,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private usersService: Users
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


  obtenerTorneo(idTorneo: number) {
    this.torneoService.getById(idTorneo).subscribe({
      next: (torneo) => {
        this.torneo  = torneo;
      },
      error: (err) => {
        this.snackBar.open('Error al obtener los datos del torneo', 'Cerrar', { duration: 5000 });
      }
    });
  }

  obtenerEquiposUsuario(idLogueado: number) {
    console.log('Buscando equipos para usuario:', idLogueado);
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

  InscripcionTorneo(torneo: TorneoInterface | null, equipo: any){
    if (!torneo) {
    this.snackBar.open('El torneo aún no está cargado', 'Cerrar', { duration: 3000 });
    return;
    }

    this.equipoTorneoService.create({idEquipo: equipo.id, idTorneo: torneo.id}).subscribe({
      next: (res) => {
        this.snackBar.open('Inscripción al torneo exitosa', 'Cerrar', { duration: 3000 });
        console.log('Inscripción exitosa:', res);
      },
    error: (err) => {
      this.snackBar.open('Error al inscribirse al torneo', 'Cerrar', { duration: 5000 });
      console.error('Error en la inscripción:', err);
    }
   });
  }
  
  cancelar() {
    this.navService.toPageTop('inicio');
  }
}