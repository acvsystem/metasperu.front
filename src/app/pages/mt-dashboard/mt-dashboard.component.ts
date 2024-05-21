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
  countTiendasOnline: any = 0;
  countTiendasOffline: any = 0;
  socket = io('http://38.187.8.22:3600', { query: { code: 'app', token: this.token } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['Codigo', 'Tienda', 'Comprobantes', 'Online']
    this.headListSunat = ['Nro Correlativo', 'Num documento', 'Estado Sunat', 'Estado Comprobante', 'Emision']

    this.socket.emit('emitScanNet', 'angular');

    this.socket.on('sessionConnect', (listaSession) => {
      console.log(listaSession);
      let dataList = [];
      dataList = listaSession || [];

      if (dataList.length > 1) {
        this.bodyList = [];
        (dataList || []).filter((dataSocket: any) => {

          if ((dataSocket || {}).ISONLINE) {
            this.countTiendasOnline += 1;
          } else {
            this.countTiendasOffline += 1;
          }

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
      this.countClientes = 0;
      let cantidad = JSON.parse(listaSession)[0].clientCant;
      console.log(cantidad);
      this.countClientes += cantidad;
    });



    this.socket.on('sendNotificationSunat', (sunat) => {
      let dataList = [];
      dataList = sunat || [];
      this.bodyListSunat = [];
      (dataList || []).filter((dataSocket: any) => {
        const fechaDocumento = new Date((dataSocket || {}).FECHA_EMISION).toLocaleDateString('en-CA');
        const fecha = new Date().toLocaleDateString('en-CA');
        var fechaInicio = new Date(fechaDocumento).getTime();
        var fechaFin = new Date(fecha).getTime();

        var diff: any = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24) || 0;

        if (parseInt(diff) < 3) {
          (this.bodyListSunat || []).push({
            cod_documento: (dataSocket || {}).CODIGO_DOCUMENTO,
            nro_correlativo: (dataSocket || {}).NRO_CORRELATIVO,
            nom_aquiriente: (dataSocket || {}).NOM_ADQUIRIENTE,
            nro_documento: (dataSocket || {}).NRO_DOCUMENTO,
            tipo_doc_adquiriente: (dataSocket || {}).TIPO_DOCUMENTO_ADQUIRIENTE,
            observacion: (dataSocket || {}).OBSERVACION,
            estado_sunat: (dataSocket || {}).ESTADO_SUNAT,
            estado_comprobante: (dataSocket || {}).ESTADO_COMPROBANTE,
            codigo_sunat: (dataSocket || {}).CODIGO_ERROR_SUNAT,
            fecha_emision: (dataSocket || {}).FECHA_EMISION
          });
        }

      });
    });

    this.socket.on('appResNetScan', (data) => {
      let resNet = [];
     // this.arNetResponse = [];
      console.log(data);
    /*  resNet = JSON.parse(data);
      (resNet || []).filter((netdata: any) => {
        let mac = netdata.addresses.mac;
        this.arNetResponse.push({
          ip: netdata.addresses.ipv4 || "Desconocido",
          mac: netdata.addresses.mac || "Desconocido",
          referencia: netdata.vendor[mac] || "Desconocido"
        });
      });*/

      //this.isLoading = false;
    });

  }

}
