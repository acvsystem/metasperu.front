import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-chart-dialog',
  templateUrl: './mt-chart-dialog.component.html',
  styleUrls: ['./mt-chart-dialog.component.scss'],
})
export class MtChartDialogComponent implements OnInit {
  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];
  
  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];

  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    name: 'singleLightBlue',
    domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5'],
  };

  constructor() { }

  ngOnInit() {}

}
