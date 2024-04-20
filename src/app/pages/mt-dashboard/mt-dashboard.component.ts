import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";

@Component({
  selector: 'app-mt-dashboard',
  templateUrl: './mt-dashboard.component.html',
  styleUrls: ['./mt-dashboard.component.scss'],
})
export class MtDashboardComponent implements OnInit {
  headList: Array<any> = [];
  headListSunat: Array<any> = [];
  bodyList: Array<any> = [];
  bodyListSunat: Array<any> = [];
  token: any = localStorage.getItem('tn');
  countClientes: any = 0;
  socket = io('http://190.117.53.171:3600', { query: { code: 'app', token: this.token } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['Codigo', 'Tienda', 'Comprobantes', 'Online']
    this.headListSunat = ['Nro Correlativo', 'Num documento', 'Estado Sunat', 'Estado Comprobante', 'Emision']

    this.socket.on('sessionConnect', (listaSession) => {
      console.log(listaSession);
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


    this.socket.emit('consultingClient', 'angular');
    this.socket.on('sendDataClient', (listaSession) => {
      let cantidad = JSON.parse(listaSession)[0].clientCant;
      console.log(cantidad);
      this.countClientes += cantidad;
    });
  }

}
