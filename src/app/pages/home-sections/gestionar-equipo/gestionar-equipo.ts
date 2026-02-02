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
import { Button3 } from '../../../shared/btns/button3/button3';
import { InputString } from '../../../shared/inputs/input-string/input-string';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestionar-equipo',
  imports: [
    GoBack,
    Spinner,
    CardEquipo,
    XBtn,
    Button3,
    InputString,
    ReactiveFormsModule
  ],
  templateUrl: './gestionar-equipo.html',
  styleUrl: './gestionar-equipo.css',
})
export default class GestionarEquipo {
  isUnirseEquipo: boolean = false;
  equipos: equipoUsuario[] = [];
  loading = false;

  idEquipoControl = new FormControl('', [Validators.required]);
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

  abrirUnirseEquipo() {
   this.isUnirseEquipo = true; 
  }

  unirseEquipo() {
    const id = Number(this.idEquipoControl.value);
    const idLogueado = Number(localStorage.getItem('idUsuario'));

    this.EquipoUsuarioService.create({idEquipo: id, idUsuario: idLogueado}).subscribe({
      next: () => {
        this.snackBar.open('Te has unido al equipo correctamente', 'Cerrar', { duration: 3000 });
        this.idEquipoControl.setValue('');
        this.isUnirseEquipo = false;
        this.ngOnInit();
      },
      error: (err) => {
        this.snackBar.open('Error al unirse al equipo', 'Cerrar', { duration: 3000 });
        this.isUnirseEquipo = false;
      }
    });
  }
}
