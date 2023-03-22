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
  isConnectServer: string = 'false';
  isVisibleStatus: boolean = false;
  statusServerList: any = [];
  socket = io('http://159.65.226.239:3200', { query: { code: 'app' } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['#', 'Codigo', 'Tienda', 'Verificacion', 'Comprobantes', 'Online', 'Server ICG']

    this.socket.on('sessionConnect', (listaSession) => {
      let dataList = [];
      dataList = listaSession || [];

      if (dataList.length > 1) {
        this.bodyList = [];
        (dataList || []).filter((dataSocket: any) => {
          (this.bodyList || []).push({
            codigo: (dataSocket || {}).CODIGO_TERMINAL,
            Tienda: (dataSocket || {}).DESCRIPCION,
            isVerification: (dataSocket || {}).VERIFICACION,
            cant_comprobantes: (dataSocket || {}).CANT_COMPROBANTES,
            online: (dataSocket || {}).ISONLINE,
            conexICG: 0
          });
        });
      } else {
        (dataList || []).filter((dataSocket: any) => {
          let codigo = (dataSocket || {}).CODIGO_TERMINAL;
          let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo));
          if (indexData != -1) {
            (this.bodyList || [])[indexData].codigo = (dataSocket || {}).CODIGO_TERMINAL;
            (this.bodyList || [])[indexData].Tienda = (dataSocket || {}).DESCRIPCION;
            (this.bodyList || [])[indexData].isVerification = (dataSocket || {}).VERIFICACION;
            (this.bodyList || [])[indexData].cant_comprobantes = (dataSocket || {}).CANT_COMPROBANTES;
            (this.bodyList || [])[indexData].online = (dataSocket || {}).ISONLINE;
            (this.bodyList || [])[indexData].conexICG = ((this.bodyList || [])[indexData] || {}).conexICG || 0;
          }
        });
      }
    });

    this.socket.on('conexion:serverICG:send', (conexion) => {
      let codigo = ((conexion || [])[0] || {}).code || '';
      let isConect = ((conexion || [])[0] || {}).isConect || 0;
      let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo && data.conexICG != isConect));
      if (indexData != -1) {
        ((this.bodyList || [])[indexData] || {}).conexICG = isConect;
      }

    });

    this.socket.on('status:serverSUNAT:send', (status) => {
      this.statusServerList = [status] || [];
      let isConect = (status || {}).online || 'false';
      this.isConnectServer = isConect;
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




