import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back';
import { MatIcon } from '@angular/material/icon';
import { Spinner } from '../../../../shared/spinner/spinner';
import { Navigation } from '../../../../services/common/navigation';
import { CardMuro } from '../../../home-sections/muro/card-muro/card-muro';
import { muro } from '../../../../Interfases/interfaces';
import { Muro as muroService } from '../../../../services/db/muro';
import { Button3 } from '../../../../shared/btns/button3/button3';

@Component({
  selector: 'app-gestion-muro',
  imports: [
    GoBack,
    MatIcon,
    Spinner,
    CardMuro,
    Button3
  ],
  templateUrl: './gestion-muro.html',
  styleUrl: './gestion-muro.css'
})
export default class GestionMuro {
  muros: muro[] = [];
  loading: boolean = false;

  constructor(private navService: Navigation, private muroService: muroService) {}

  ngOnInit() {
    this.loading = true;
    this.muroService.getAll().subscribe({
      next: (data) => {
        this.muros = data;
        this.loading = false;
      },
      error: (err) => {
        this.muros = [];
        this.loading = false;
      },
    });
  }

  crearMensaje() {
    this.navService.toPageTop('/admin/crear-mensaje');
  }

  editarMensaje(muro: muro) {
    this.navService.toPageTop(`/admin/editar-mensaje/${muro.id}`);
  }
  
  eliminarMensaje(muro: muro) {
    if (confirm(`¿Estás seguro de eliminar el mensaje "${muro.titulo}"?`)) {
      this.muroService.delete(muro.id).subscribe({
        next: () => {
          this.muros = this.muros.filter(m => m.id !== muro.id);
        },
        error: (err) => {
          alert('Error al eliminar el mensaje. Inténtalo de nuevo.');
        }
      });
    }
  }

}
