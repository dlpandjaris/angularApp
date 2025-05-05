import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {

  colors: number[][] = [];

  constructor() {}

  ngOnInit() {}

  @HostListener('setColorPalette', ['$event'])
  setColorPalette(event: any): void {
    console.log(event);
    this.colors = event.detail
  }
}
