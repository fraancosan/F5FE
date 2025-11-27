import { Component, HostListener, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Navigation } from '../../services/common/navigation';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-go-back',
  imports: [FaIconComponent, NgClass],
  templateUrl: './go-back.html',
  styleUrl: './go-back.css',
})
export class GoBack {
  @Input() url: string = '';
  @Input() label: string = '';
  @Input() mode: 'light' | 'dark' = 'light';

  faArrowLeft = faArrowLeft;

  constructor(private navServ: Navigation) {}

  @HostListener('click')
  onHostClick() {
    this.goBack();
  }

  goBack() {
    this.navServ.toPageTop(this.url);
  }
}
