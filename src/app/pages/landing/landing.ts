import { Component } from '@angular/core';
import { Button5 } from '../../shared/button5/button5';
import { Player } from "../../shared/player/player";


@Component({
  selector: 'app-landing',
  imports: [Button5, Player],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  
}
