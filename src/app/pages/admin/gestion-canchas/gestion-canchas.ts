import { Component, OnInit } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { cancha } from '../../../Interfases/interfaces';
import { TitleCasePipe } from '@angular/common';
import { Spinner } from '../../../shared/spinner/spinner';
import { Cancha } from '../../../services/db/cancha';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Button3 } from '../../../shared/btns/button3/button3';
import { XBtn } from '../../../shared/btns/x-btn/x-btn';

@Component({
  selector: 'app-gestion-canchas',
  imports: [
    GoBack,
    MatTableModule,
    TitleCasePipe,
    Spinner,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    Button3,
    XBtn
  ],
  templateUrl: './gestion-canchas.html',
  styleUrl: './gestion-canchas.css'
})
export default class GestionCanchas {
filaEditar: any = null;

  displayedColumns: string[] = [
    'ID',
    'Disponible',
    'Acciones',
  ];

  canchas: cancha[] = [];
  loading: boolean = false;

  constructor(private canchaService: Cancha,
     private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadCanchas();
  }

  loadCanchas() {
    this.loading = true;
    this.canchaService.getAll().subscribe((canchas) => {
      this.canchas = canchas.map(c => ({
        ...c,
        disponible: Number(c.disponible) === 1
      }));
      this.loading = false;
    });
  }

  habilitarEdicion(cancha: cancha) {
    this.filaEditar = {...cancha,
    disponible: !!cancha.disponible
    };
  }

  guardarCambios(cancha: cancha) {

   const nuevoEstado = Boolean(this.filaEditar.disponible);

    this.canchaService.update(this.filaEditar.id, nuevoEstado).subscribe({
      next: () => {
        this.snackBar.open('Cancha actualizada exitosamente', 'Cerrar', { duration: 3000 });
        this.filaEditar = null;
        this.loadCanchas();
      },
      error: () => {
        this.snackBar.open('Error al actualizar la cancha', 'Cerrar', { duration: 3000 });
      }
    });
  }
  
  cancelarEdicion() {
    this.filaEditar = null;
  }

  crearCancha() {
   this.canchaService.create(true).subscribe({
    next: () => {
      this.snackBar.open('Cancha creada exitosamente', 'Cerrar', { duration: 3000 });
      this.loadCanchas();
    },
    error: () => {
      this.snackBar.open('Error al crear la cancha', 'Cerrar', { duration: 3000 });
    }
   });
  }
  eliminarCancha(cancha: cancha) {
    if (!confirm(`¿Estás seguro de eliminar la cancha #${cancha.id}?`)) {
    return;
  }
    this.canchaService.delete(cancha.id).subscribe({
      next: () => {
        this.snackBar.open('Cancha eliminada exitosamente', 'Cerrar', { duration: 3000 });
        this.loadCanchas();
      },
      error: () => {
        this.snackBar.open('Error al eliminar la cancha', 'Cerrar', { duration: 3000 });
      }
    });
  }
 
}
