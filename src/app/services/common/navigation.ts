import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Navigation {
  constructor(
    private viewPortScroller: ViewportScroller,
    private router: Router
  ) {}

  cleanUrl(url: string): string {
    return url.split('#')[0].split('?')[0];
  }

  toElement(element: string, changeUrl: boolean = false) {
    changeUrl ? this.router.navigate([], { fragment: element }) : null;
    setTimeout(() => {
      this.viewPortScroller.scrollToAnchor(element);
      // 15px + 65px (header) = 80px
      this.viewPortScroller.setOffset([0, 80]);
    }, 100);
  }

  toTop() {
    this.viewPortScroller.scrollToPosition([0, 0]);
  }

  toPage(link: string, fragment: string, params: any = {}) {
    this.router.navigate([link], { fragment: fragment, queryParams: params });
    this.toElement(fragment);
  }

  toPageTop(link: string, params: any = {}) {
    const currentUrl = this.cleanUrl(this.router.url);
    this.router.navigate([link], { queryParams: params });
    currentUrl === link ? this.toTop() : null;
  }
}
