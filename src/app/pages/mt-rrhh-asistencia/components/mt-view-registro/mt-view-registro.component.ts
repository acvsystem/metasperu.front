import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'mt-view-registro',
  templateUrl: './mt-view-registro.component.html',
  styleUrls: ['./mt-view-registro.component.scss'],
  styles: [`
    :host {
      display: block;
      background: #fff;
      border-radius: 8px;
      padding: 10px;
    }
  `]
})
export class MtViewRegistroComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  parseHuellero:Array<any> = [];
  headListSunat: Array<any> = ["CAJA", "DIA", "HORA ENTRADA", "HORA SALIDA", "HORAS TRABAJADAS"];

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    this.parseHuellero = this.data;
  }

}
