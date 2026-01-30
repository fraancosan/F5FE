import { Component, OnInit} from '@angular/core';
import { GoBack } from '../../../shared/go-back/go-back';
import { CardTorneo } from './card-torneo/card-torneo';
import {Torneo} from '../../../services/db/torneo';
import { torneo as TorneoInterface } from '../../../Interfases/interfaces';
import { Spinner } from '../../../shared/spinner/spinner';
import { Button3} from '../../../shared/btns/button3/button3';
@Component({
  selector: 'app-torneo',
  imports: [
    GoBack,
    CardTorneo,
    Spinner,
    Button3,
  ],
  templateUrl: './torneo.html',
  styleUrl: './torneo.css',
})
export default class torneo {
  torneos: TorneoInterface[] = [];
  loading: boolean = false;
  isVerTorneo: boolean = false;
  constructor(
    private torneoService: Torneo,
  )
  {}
  ngOnInit(): void {
    this.loading = true;
    this.torneoService.getAll().subscribe({
      next: (torneos: TorneoInterface[]) => {
        this.torneos = torneos;
        console.log(this.torneos);
        this.loading = false;
      },
      error: (err) => {
        this.torneos = [];
        this.loading = false;
      },
    });
  }

  verTorneo(){
    //Logica de navegacion a ver torneo
  }

}
