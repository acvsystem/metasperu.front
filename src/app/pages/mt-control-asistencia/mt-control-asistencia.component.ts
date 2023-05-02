import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-control-asistencia',
  templateUrl: './mt-control-asistencia.component.html',
  styleUrls: ['./mt-control-asistencia.component.scss'],
})
export class MtControlAsistenciaComponent implements OnInit {
  token: any = localStorage.getItem('tn');
  socket = io('http://159.65.226.239:4200', { query: { code: 'app', token: this.token } });
  bodyList: Array<any> = [];
  headList: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.headList = ['#', 'Empleado', 'Dia', 'Hora In', 'Hora Out', 'Horas Trabajadas', 'Nro Ventas','Caja']

   /* this.bodyList = [
      {
        "ID_REG_EMPLEADO": 17,
        "FO": 1,
        "CODEMPLEADO": 107,
        "DIA": "2023-04-28T05:00:00.000Z",
        "HORAIN": "2023-04-24T14:09:03.000Z",
        "HORAOUT": "2023-04-24T14:09:03.000Z",
        "INPUT": 0,
        "OUTPUT": 0,
        "HORAS": 2,
        "VENTAS": 1,
        "NUMVENTAS": 0,
        "Z": 0,
        "CAJA": "7C1",
        "HORASNORMAL": 0,
        "HORASEXTRA": 0,
        "COSTEHORA": 0,
        "COSTEHORAEXTRA": 0,
        "CODMOTIVO": 0,
        "CODMOTIVOENTRADA": 0,
        "TERMINAL": "0"
      }
    ];*/

    this.socket.on('sendControlAsistencia', (asistencia) => {
      this.bodyList = asistencia || [];
      console.log("asistencia", asistencia);
    });

  }

}
