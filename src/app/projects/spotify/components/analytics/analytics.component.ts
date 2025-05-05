import { Component, HostListener } from '@angular/core';
declare var google:any;

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {

  colors: number[][] = [];

  constructor() {}

  // ngOnInit(): void {
  //   google.charts.load('current', {packages: ['corechart']});
  //   google.charts.setOnLoadCallback(this.drawChart);
  // }

  // drawChart() {
  //   // Create the data table.
  //   var data = new google.visualization.DataTable();
  //   data.addColumn('string', 'Topping');
  //   data.addColumn('number', 'Slices');
  //   data.addRows([
  //     ['Mushrooms', 3],
  //     ['Onions', 1],
  //     ['Olives', 1], 
  //     ['Zucchini', 1],
  //     ['Pepperoni', 2]
  //   ]);

  //   var chart = new google.visualizations.PieChart(document.getElementById("pieChart"));
  //   chart.draw(data, null);
  // }

  @HostListener('setColorPalette', ['$event'])
  setColorPalette(event: any): void {
    console.log(event);
    this.colors = event.detail
  }
}
