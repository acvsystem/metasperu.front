import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'mt-chart-dialog',
  templateUrl: './mt-chart-dialog.component.html',
  styleUrls: ['./mt-chart-dialog.component.scss'],
})
export class MtChartDialogComponent implements OnInit {

  multi: any[];
  chartData: any = [];
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
  schemeType = 'ordinal';
  colorScheme = {
    name: 'cool',
    selectable: true,
    group: 'ordinal',
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a95963', '#8796c0', '#7ed3ed', '#50abcc', '#ad6886'],
  };

  customColors = [
    {
      name: 'Germany',
      value: '#a8385d'
    }
  ]

  constructor(private dialogRef: MatDialogRef<MtChartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData) {

  }

  ngOnInit() {
    this.chartData = this.data;
    console.log(this.data);
  }

}

export interface DialogData {
  name: string;
  value: number;
}
