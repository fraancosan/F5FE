import { Component } from '@angular/core';
import { muro } from '../../../Interfases/interfaces';
import { Muro as muroService } from '../../../services/db/muro';
import { CardMuro } from './card-muro/card-muro';
import { GoBack } from '../../../shared/go-back/go-back';
import { Spinner } from '../../../shared/spinner/spinner';

@Component({
  selector: 'app-muro',
  imports: [CardMuro, GoBack, Spinner],
  templateUrl: './muro.html',
  styleUrl: './muro.css',
})
export default class Muro {
  muros: muro[] = [];
  loading = false;

  constructor(private muroService: muroService) {}

  ngOnInit() {
    this.loading = true;
    this.muroService.getAllVigentes().subscribe({
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
}
