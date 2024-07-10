import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
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
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  isShowLoading: boolean = false;
  contadorCliente: any = 0;
  contadorCajaOnline: any = 0;
  isViewPage: boolean = false;
  conxOnline: Array<any> = [];
  vListaClientes: string = '';

  constructor(private service: ShareService, private store: StorageService) { }

  ngOnInit() {
    this.service.onViewPageAdmin.subscribe((view) => {
      this.isViewPage = view;
    });

    let profileUser = this.store.getStore('mt-profile');

    if ((profileUser || {}).nivel == "SISTEMAS") {
      this.isViewPage = true;
    }

    const self = this;
    this.headList = ['#', 'Codigo', 'Tienda', 'Verificacion', 'Comprobantes', 'Transacciones', 'Clientes Blanco', 'Conexion Comprobantes', 'Conexion ICG']
    this.headListSunat = ['#', 'Codigo Documento', 'Nro Correlativo', 'Nom Adquiriente', 'Num documento', 'Tipo documento adq.', 'Observacion', 'Estado Sunat', 'Estado Comprobante', 'Codigo sunat', 'Fecha emision']
    this.onTransacciones();
    this.onListClient();
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

          if ((dataSocket || {}).ISONLINE == 1) {
            this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
          }


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

        (this.bodyList || []).filter((data: any) => {

          if (data.online) {
            this.contadorCajaOnline += 1;
          }

        });
      } else {
        (dataList || []).filter((dataSocket: any) => {

          if ((dataSocket || {}).ISONLINE == 1) {
            let index = this.conxOnline.findIndex((conx) => conx == (dataSocket || {}).CODIGO_TERMINAL);
            console.log(index);
            if (index == -1) {
              this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
            }
          }

          if ((dataSocket || {}).ISONLINE == 0) {
            this.conxOnline = this.conxOnline.filter((conx) => conx != (dataSocket || {}).CODIGO_TERMINAL);
          }

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
        this.isShowLoading = false;
      }
      console.log(this.conxOnline);
      this.store.removeStore("conx_online");
      this.store.setStore("conx_online", JSON.stringify(this.conxOnline));
    });

    this.socket.on('dataTransaction', (dataSocket) => {
      let codigo = (dataSocket || [])[0].code;
      this.contadorCliente += 1;
      if (this.contadorCliente == this.contadorCajaOnline) {
        this.isShowLoading = false;
        let notificationList = [{
          isSuccess: true,
          bodyNotification: "Proceso Exitoso."
        }];

        this.service.onNotification.emit(notificationList);
      } else {
        this.isShowLoading = false;
        let notificationList = [{
          isCaution: true,
          bodyNotification: "No se ejecuto el proceso en algunas cajas."
        }];

        this.service.onNotification.emit(notificationList);
      }

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
      console.log(dataSocket);
      this.contadorCliente += 1;

      if (this.contadorCliente == this.contadorCajaOnline) {
        this.isShowLoading = false;
        let notificationList = [{
          isSuccess: true,
          bodyNotification: "Proceso Exitoso."
        }];

        this.service.onNotification.emit(notificationList);
      } else {
        this.isShowLoading = false;
        let notificationList = [{
          isCaution: true,
          bodyNotification: "No se ejecuto el proceso en algunas cajas."
        }];

        this.service.onNotification.emit(notificationList);
      }


      let codigo = (dataSocket || [])[0].code;
      let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo));
      if (indexData != -1) {
        (this.bodyList || [])[indexData].clientes_null = (dataSocket || [])[0].clientCant;
      }
    });

  }

  onVerify() {
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('comunicationFront', 'angular');
  }

  onTransacciones() {
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('emitTransaction', 'angular');
  }

  onListClientesNull() {
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('cleanClient', this.vListaClientes.split(','));
  }

  onClientesNull() {
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('emitCleanClient', this.vListaClientes.split(','));
  }

  onListClient() {
    let parms = {
      url: '/security/service/cliente/list/delete'
    };
    this.service.get(parms).then((response) => {
      this.vListaClientes = response.toString();
    });
  }

  onSessionList() {
    // let lista = this.socket.listeners('sessionList');
    //console.log(lista);
  }

}




