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
  headListSunat: Array<any> = [];
  bodyList: Array<any> = [];
  bodyListSunat: Array<any> = [];
  actionButton: boolean = true;
  isConnectServer: string = 'false';
  isVisibleStatus: boolean = false;
  statusServerList: any = [];
  countClientes: any = 0;
  socket = io('http://190.117.53.171:3200', { query: { code: 'app' } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['#', 'Codigo', 'Tienda', 'Verificacion', 'Comprobantes', 'Transacciones', 'Clientes Blanco', 'Conexion Comprobantes', 'Conexion ICG']
    this.headListSunat = ['#', 'Codigo Documento', 'Nro Correlativo', 'Nom Adquiriente', 'Num documento', 'Tipo documento adq.', 'Observacion', 'Estado Sunat', 'Estado Comprobante', 'Codigo sunat', 'Fecha emision']
    this.onTransacciones();
    this.onListClientesNull();
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
            transacciones: 0,
            clientes_null: 0,
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

    this.socket.on('dataTransaction', (dataSocket) => {
      let codigo = (dataSocket || [])[0].code;
      let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo));
      if (indexData != -1) {
        (this.bodyList || [])[indexData].transacciones = (dataSocket || [])[0].transaciones;
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

    this.socket.on('sendDataClient', (dataSocket) => {
      let codigo = (dataSocket || [])[0].code;
      let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo));
      if (indexData != -1) {
        (this.bodyList || [])[indexData].clientes_null = (dataSocket || [])[0].clientCant;
      }
    });

  }

  onVerify() {
    this.socket.emit('comunicationFront', 'angular');
  }

  onTransacciones() {
    this.socket.emit('emitTransaction', 'angular');
  }

  onListClientesNull(){
    this.socket.emit('cleanClient', 'angular');
  }

  onClientesNull() {
    this.socket.emit('emitCleanClient', 'angular');
  }

  onSessionList() {
    // let lista = this.socket.listeners('sessionList');
    //console.log(lista);
  }

}




