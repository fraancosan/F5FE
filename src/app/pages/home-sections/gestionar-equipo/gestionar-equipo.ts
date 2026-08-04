import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { Navigation } from '../../../services/common/navigation';
import { Spinner } from '../../../shared/spinner/spinner';
import { equipoUsuario } from '../../../Interfases/interfaces'
import { CardEquipo } from './card-equipo/card-equipo';
import { XBtn } from '../../../shared/btns/x-btn/x-btn';
import { EquipoUsuario } from '../../../services/db/equipo-usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Button3 } from '../../../shared/btns/button3/button3';
import { InputString } from '../../../shared/inputs/input-string/input-string';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CapitalizePipe } from '../../../pipes/capitalize-pipe';
import { Equipo } from '../../../services/db/equipo';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-gestionar-equipo',
  imports: [
    GoBack,
    Spinner,
    CardEquipo,
    XBtn,
    Button3,
    InputString,
    ReactiveFormsModule,
    MatIconModule,
    CapitalizePipe,
  ],
  templateUrl: './gestionar-equipo.html',
  styleUrl: './gestionar-equipo.css',
})
export default class GestionarEquipo {
  isUnirseEquipo: boolean = false;
  isVerIntegrantesModal: boolean = false;
  equipos: equipoUsuario[] = [];
  loading = false;
  loadingIntegrantes = false;
  integrantesEquipo: equipoUsuario[] = [];
  equipoSeleccionado?: equipoUsuario;

  linkEquipoControl = new FormControl('', [Validators.required]);
  constructor(
    private navService: Navigation,
    private EquipoUsuarioService: EquipoUsuario,
    private equipoService: Equipo,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loading = true;

    this.EquipoUsuarioService.getAll({}).subscribe({
      next: (equipo: equipoUsuario[]) => {
        this.equipos = equipo;
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
    if (
      (item.capitan &&
        confirm(
          '¿Estás seguro de que deseas disolver el equipo? Esta acción no se puede deshacer.',
        )) ||
      (!item.capitan &&
        confirm('¿Estás seguro de que deseas abandonar el equipo?'))
    ) {
      this.loading = true;

      this.EquipoUsuarioService.delete(item.id).subscribe({
        next: () => {
          this.equipos = this.equipos.filter((e) => e.id !== item.id);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
    }
  }

  abrirUnirseEquipo() {
    this.isUnirseEquipo = true;
  }

  abrirModalIntegrantes(item: equipoUsuario) {
    this.equipoSeleccionado = item;
    this.integrantesEquipo = [];
    this.loadingIntegrantes = true;
    this.isVerIntegrantesModal = true;

    this.EquipoUsuarioService.getAllMiembros(item.idEquipo).subscribe({
      next: (data) => {
        this.integrantesEquipo = data;
        this.loadingIntegrantes = false;
      },
      error: () => {
        this.integrantesEquipo = [];
        this.loadingIntegrantes = false;
        this.snackBar.open('No se pudieron cargar los integrantes', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  cerrarModalIntegrantes() {
    this.isVerIntegrantesModal = false;
    this.integrantesEquipo = [];
    this.equipoSeleccionado = undefined;
  }

  unirseEquipo() {
    if (this.linkEquipoControl.valid) {
      const link = this.linkEquipoControl.value!;
      this.EquipoUsuarioService.create(link).subscribe({
        next: () => {
          this.snackBar.open('Te has unido al equipo correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.linkEquipoControl.setValue('');
          this.isUnirseEquipo = false;
          this.ngOnInit();
        },
        error: (err) => {
          this.isUnirseEquipo = false;
        },
      });
    }
  }

  linkInvitacion(){
    // existe un link y el usuario es capitan, entonces se remueve el link
    if(this.equipoSeleccionado!.capitan && this.equipoSeleccionado!.Equipo!.linkInvitacion){
      this.equipoService.removerLinkInvitacion(this.equipoSeleccionado!.idEquipo).subscribe({
        next: () => {
          this.snackBar.open('Link de invitación removido', 'Cerrar', {
            duration: 3000,
          });
          this.equipoSeleccionado!.Equipo!.linkInvitacion = undefined;
        }
      });
    }
    // no existe un link y el usuario es capitan, entonces se crea un link
    else if (this.equipoSeleccionado!.capitan && !this.equipoSeleccionado!.Equipo!.linkInvitacion){
      this.equipoService
        .crearLinkInvitacion(this.equipoSeleccionado!.idEquipo)
        .subscribe({
          next: (res) => {
            this.snackBar.open('Link de invitación creado', 'Cerrar', {
              duration: 3000,
            });
            this.equipoSeleccionado!.Equipo!.linkInvitacion = res.linkInvitacion;
          }
        });
    }
  }
}
