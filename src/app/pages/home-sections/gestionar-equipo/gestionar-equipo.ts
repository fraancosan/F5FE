import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { Navigation } from '../../../services/common/navigation';
import { Spinner } from '../../../shared/spinner/spinner';
import { equipoUsuario } from '../../../Interfases/interfaces'
import { CardEquipo } from './card-equipo/card-equipo';
import { XBtn } from '../../../shared/btns/x-btn/x-btn';
import { EquipoUsuario } from '../../../services/db/equipo-usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { equipo } from '../../../Interfases/interfaces';
import { Equipo } from '../../../services/db/equipo';

@Component({
  selector: 'app-gestionar-equipo',
  imports: [
    GoBack,
    Spinner,
    CardEquipo,
    XBtn,
  ],
  templateUrl: './gestionar-equipo.html',
  styleUrl: './gestionar-equipo.css',
})
export default class GestionarEquipo {
  equipos: equipoUsuario[] = [];
  loading = false;

  constructor(
    private navService: Navigation,
    private EquipoUsuarioService: EquipoUsuario,
    private EquipoService: Equipo,
    private snackBar: MatSnackBar
  )
     {}

  ngOnInit() {
    this.loading = true;
    const idLogueado = Number(localStorage.getItem('idUsuario'));

    this.EquipoUsuarioService.getAll({idUsuario : idLogueado}).subscribe({
      next: (equipo: equipoUsuario[]) => {
        this.equipos = equipo;
        console.log(this.equipos);
        this.loading = false;
      },
      error: (err) => {
        this.equipos = [];
        this.loading = false;
      },
    });
  }

  cancelar() {
    this.navService.toPageTop('inicio');
  }

  eliminarEquipo(item: equipoUsuario) {

    const idEquipoParaBorrar = typeof item.idEquipo === 'number' ? item.idEquipo : (item.idEquipo as any).id;
    if (confirm('¿Estás seguro de que deseas eliminar el equipo? Esta acción no se puede deshacer.')) {
      this.loading = true;

      this.EquipoUsuarioService.delete(item.id).subscribe({
      next: () => {
        this.EquipoService.delete(idEquipoParaBorrar).subscribe({
          next: () => {
            this.equipos = this.equipos.filter(e => e.id !== item.id);
            this.loading = false;
            this.snackBar.open('Equipo disuelto correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.loading = false;
            // Si entra aquí, es probable que la DB haya bloqueado el borrado 
            // porque el equipo aún tiene otros jugadores inscritos.
            console.error("Error al borrar el equipo:", err);
          }
        });
      },
      error: (err) => {
        this.loading = false;
      }
    });
    }
  }
}
