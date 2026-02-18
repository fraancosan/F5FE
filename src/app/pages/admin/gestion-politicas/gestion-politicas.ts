import { Component } from '@angular/core';
import { politica } from '../../../Interfases/interfaces';
import { Politicas } from '../../../services/db/politicas';
import { GoBack } from '../../../shared/go-back/go-back';
import { Spinner } from '../../../shared/spinner/spinner';
import { Button3 } from '../../../shared/btns/button3/button3';
import { CardPoliticas } from './card-politicas/card-politicas';
import { XBtn } from '../../../shared/btns/x-btn/x-btn';
import { MatIconModule } from '@angular/material/icon';
import { Navigation } from '../../../services/common/navigation';
 
@Component({
  selector: 'app-gestion-politicas',
  imports: [
    GoBack,
    Spinner,
    CardPoliticas,
    Button3,
    XBtn,
    MatIconModule
  ],
  templateUrl: './gestion-politicas.html',
  styleUrl: './gestion-politicas.css'
})
export default class GestionPoliticas {
politicas: politica[] = [];
loading = false;

constructor(private politicasService: Politicas,
  private navService: Navigation) {}

ngOnInit() {
  this.loading = true;
  this.politicasService.getAll().subscribe({
    next: (politicas) => {
      this.politicas = politicas;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar las políticas:', error);
      this.loading = false;
    }
  });
}

eliminarPolitica(nombre: string){
    if (!confirm(`¿Estás seguro de que deseas eliminar esta política ${nombre}?`)) {
      return;
    }

   this.politicasService.delete(nombre).subscribe({
    next: () => {
      this.ngOnInit();
    },
    error: (error) => {
      console.error('Error al eliminar la política:', error);
    }
   })
}

crearPolitica() {
  this.navService.toPageTop('admin/crear-politica');
}
}
