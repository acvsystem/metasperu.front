import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-mt-verification-comprobantes',
  templateUrl: './mt-verification-comprobantes.component.html',
  styleUrls: ['./mt-verification-comprobantes.component.scss'],
})
export class MtVerificationComprobantesComponent implements OnInit {

  headList: Array<any> = [];
  bodyList: Array<any> = [];
  actionButton: boolean = true;
  socket = io('http://159.65.226.239:3200', { query: { code: 'app' } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['#', 'Codigo', 'Tienda', 'Verificacion', 'Comprobantes', 'Online', 'Server ICG']

    this.socket.on('sessionConnect', (listaSession) => {
      let dataList = (listaSession || []);
      this.bodyList = [];
      (dataList || []).filter((data: any) => {
        this.bodyList.push({
          codigo: (data || {}).CODIGO_TERMINAL,
          Tienda: (data || {}).DESCRIPCION,
          isVerification: (data || {}).VERIFICACION,
          cant_comprobantes: (data || {}).CANT_COMPROBANTES,
          online: (data || {}).ISONLINE,
          conexICG: 0
        });
      });
    });

    this.socket.on('conexion:serverICG:send', (conexion) => {
      let codigo = ((conexion || [])[0] || {}).code || '';
      let isConect = ((conexion || [])[0] || {}).isConect || 0;
      this.bodyList.filter((data, i) => {
        if (data.codigo == codigo) {
          console.log((data || {}).online);
          ((this.bodyList || [])[i] || {}).conexICG = (!(data || {}).online) ? 0 : isConect;
        }
      });
    });

  }

  public onVerify() {
    this.socket.emit('comunicationFront', 'angular');
  }

  onSessionList() {
    // let lista = this.socket.listeners('sessionList');
    //console.log(lista);
  }

}




