import { Component } from '@angular/core';
import { Card } from '../../shared/card/card';
import { faTrophy, faCalendar, faMagnifyingGlass, faPeopleGroup, faGear, faMessage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  imports: [Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home {
  faTrophy = faTrophy;
  faCalendar = faCalendar;
  faMagnifyingGlass = faMagnifyingGlass;
  faPeopleGroup = faPeopleGroup;
  faGear = faGear;
  faMessage = faMessage;
}
