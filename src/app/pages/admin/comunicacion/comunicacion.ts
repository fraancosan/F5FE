import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { MatIcon } from '@angular/material/icon';
import { Spinner } from '../../../shared/spinner/spinner';
import { Navigation } from '../../../services/common/navigation';
import { CardPoliticas } from '../gestion-politicas/card-politicas/card-politicas'; 

@Component({
  selector: 'app-comunicacion',
  imports: [
    GoBack,
    MatIcon,
    Spinner,
    CardPoliticas
  ],
  templateUrl: './comunicacion.html',
  styleUrl: './comunicacion.css'
})
export default class Comunicacion {

  opciones: any[] = [];
  loading: boolean = false;

  constructor(private navService: Navigation) {}

  ngOnInit() {
    this.cargarOpciones();
  }

  cargarOpciones() {
    this.loading = true;
    
    this.opciones = [
      {
        nombre: 'Muro de comunicacion',
        descripcion: 'Publica anuncios, noticias y comunicados para mantener a todos informados sobre las novedades y eventos importantes.',
        url: '/admin/comunicacion/gestion-muro'
      },
      {
      nombre: ' Mensaje privado a usuario',
      descripcion: 'Envía mensajes privados a usuarios específicos para comunicar información importante o responder consultas de manera directa.',
      url: '/admin/comunicacion/mensaje-usuario'
    }];

    this.loading = false;
  }

  verOpcion(nombre: string) {
    const opcion = this.opciones.find(op => op.nombre === nombre);
    if (opcion) {
    this.navService.toPageTop(opcion.url);
    }
  }
}
