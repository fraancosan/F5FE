import { Component } from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { MatIcon } from '@angular/material/icon';
import { Spinner } from '../../../shared/spinner/spinner';
import { Navigation } from '../../../services/common/navigation';
import { CardPoliticas } from '../gestion-politicas/card-politicas/card-politicas'; 

@Component({
  selector: 'app-informes',
  imports: [
    GoBack,
    MatIcon,
    Spinner,
    CardPoliticas,
],
  templateUrl: './informes.html',
  styleUrl: './informes.css'
})
export default class Informes {
  loading = false;
  informes = [
    { nombre: 'Ingresos Brutos',
      descripcion: 'Generar reporte de ingresos brutos del complejo en un periodo determinado de tiempo',
      url : 'admin/ingresos-brutos'
    },
    {
      nombre: 'Reservas Canceladas',
      descripcion: 'Generar reporte de reservas canceladas del complejo en un periodo determinado de tiempo',
      Url: 'admin/reservas-canceladas'
    },
    {
      nombre: 'Dias con mas turnos',
      descripcion: 'Generar reporte de los dias con mas turnos del complejo por periodo'
    },
    {
      nombre: 'Listado de usuarios premium',
      descripcion: 'Generar reporte de los usuarios premium del complejo'
    },
    {
      nombre: 'Reservas de la parrilla',
      descripcion: 'Generar reporte de las reservas de la parrilla del complejo por periodo'
    }
  ]
  constructor(private navService: Navigation) {}

  verInforme(informe: any) {
    this.navService.toPageTop(informe.url);
  }
}
