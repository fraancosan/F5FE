import { Component } from '@angular/core';
import { CardMenu } from '../../shared/card-menu/card-menu';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faMagnifyingGlass,
  faTrophy,
  faPeopleGroup,
  faGear,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  imports: [CardMenu],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home {
  faCalendar = faCalendar;
  faMagnifyingGlass = faMagnifyingGlass;
  faTrophy = faTrophy;
  faPeopleGroup = faPeopleGroup;
  faGear = faGear;
  faMessage = faMessage;
}
