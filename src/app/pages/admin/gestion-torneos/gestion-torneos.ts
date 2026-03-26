import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { torneo } from '../../../Interfases/interfaces';
import { DatePipe } from '@angular/common';
import { Spinner } from '../../../shared/spinner/spinner';
import { Torneo } from '../../../services/db/torneo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Button3 } from '../../../shared/btns/button3/button3';
import { XBtn } from '../../../shared/btns/x-btn/x-btn';
import { Navigation } from '../../../services/common/navigation';

@Component({
  selector: 'app-gestion-torneos',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    Button3,
    DatePipe,
    XBtn
  ],
  templateUrl: './gestion-torneos.html',
  styleUrl: './gestion-torneos.css'
})
export default class GestionTorneos {
  displayedColumns: string[] = [
    'Descripcion',
    'Inicio',
    'Fin',
    'Precio',
    'NroEquipos',
    'Acciones'
  ];

  torneos: torneo[] = [];
  loading: boolean = false;

  constructor(
    private torneosService: Torneo,
    private snackBar: MatSnackBar,
    private navService: Navigation
  ) {}
  
  ngOnInit() {
    this.cargarTorneos();
  }

  cargarTorneos() {
    this.loading = true; 
    this.torneosService.getAll().subscribe({
      next: (data: torneo[]) => {
        this.torneos = data;
        this.loading = false; 
      },
      error: () => {
      this.loading = false; 
      this.snackBar.open('Error al cargar los torneos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  crearTorneo()  {
    this.navService.toPageTop('/admin/crear-torneo');
  }

  editarTorneo(id: number) {
    this.navService.toPageTop(`/admin/editar-torneo/${id}`);
  }

  eliminarTorneo(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este torneo?')) {
    }
  
    this.torneosService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Torneo eliminado con éxito', 'Aceptar', {
          duration: 5000,
        });
        this.ngOnInit();
      },
      error: (err) => {
        this.snackBar.open('Error al eliminar el torneo', 'Aceptar', {
          duration: 5000,
        });
      }
    });
  }
}
