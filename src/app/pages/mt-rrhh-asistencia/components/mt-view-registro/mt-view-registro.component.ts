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
  parseHuellero: Array<any> = [];
  headListSunat: Array<any> = ["CAJA", "DIA", "HORA ENTRADA", "HORA SALIDA", "HORAS TRABAJADAS"];

  constructor() { }

  ngOnInit() {

    this.data.filter((dt) => {
      this.parseHuellero.push({
        caja: dt.caja,
        dia: dt.dia,
        hr_ingreso: dt.hr_ingreso,
        hr_salida: dt.hr_salida,
        hr_trabajadas: this.obtenerDiferenciaHora(dt.hr_ingreso, dt.hr_salida),
        nombre_completo: dt.nombre_completo,
        nro_documento: dt.nro_documento
      });
    });
  }

  obtenerDiferenciaHora(hr1, hr2) {
    let diferencia = 0;
    let hora_1 = this.obtenerHoras(hr1);
    let hora_2 = this.obtenerHoras(hr2);
    let minutos = this.obtenerMinutos(hr1, hr2);
    let hrExtr = (minutos[0] > 0) ? minutos[0] : 0;

    if (hora_1 > hora_2) {
      diferencia = hora_1 - hora_2;
    } else {
      diferencia = hora_2 - hora_1;
    }

    let hora_1_pr = hr1.split(":");
    let hora_2_pr = hr2.split(":");
    let hr_resta: number = (hora_1_pr[1] > 0) ? parseInt(hora_1_pr[1]) : parseInt(hora_2_pr[1]);
    let horaResult = ((diferencia - hr_resta) / 60).toString();
    return `${parseInt(horaResult) + hrExtr}:${(minutos[1] < 10) ? '0' + minutos[1] : minutos[1]}`;
  }

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
  }

  obtenerMinutos(hora_1, hora_2) {

    let hora_1_pr = hora_1.split(":");
    let hora_2_pr = hora_2.split(":");
    let residuo_1 = 0;
    let minutos = 0;
    let hora = 0;

    if (hora_1_pr[1] > 0 || hora_1_pr[1] == 0) {

      if (hora_1_pr[0] == hora_2_pr[0]) {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);
        minutos = residuo_1 - 60;

      } else {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);

        if (residuo_1 > 59) {
          minutos = residuo_1 - 60;
          hora = 1;

        } else {
          minutos = residuo_1;
        }
      }

    }

    return [hora, minutos];
  }

}
