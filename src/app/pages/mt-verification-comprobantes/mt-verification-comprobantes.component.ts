import { Component, OnInit, inject } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-mt-verification-comprobantes',
  templateUrl: './mt-verification-comprobantes.component.html',
  styleUrls: ['./mt-verification-comprobantes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MtVerificationComprobantesComponent implements OnInit {

  headList: Array<any> = [];
  headListSunat: Array<any> = [];
  bodyList: Array<any> = [];
  bodyListSunat: Array<any> = [];
  bodyListBD: Array<any> = [];
  actionButton: boolean = true;
  isConnectServer: string = 'false';
  vCoeData: string = '';
  vManagerData: string = '';
  isVisibleStatus: boolean = false;
  isVerificarBd: boolean = false;
  isLoadingDB: boolean = false;
  statusServerList: any = [];
  countClientes: any = 0;
  socket = io('http://38.187.8.22:3200', {
    query: { code: 'app' },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  });

  isShowLoading: boolean = false;
  isErrorVerificacion: boolean = false;
  contadorCliente: any = 0;
  contadorCajaOnline: any = 0;
  isViewPage: boolean = false;
  conxOnline: Array<any> = [];
  vListaClientes: string = '';
  vDataTienda: Array<any> = [];
  vDataTransferencia: Array<any> = [
    {
      dataOne: [],
      dataTwo: []
    }
  ];
  columnsToDisplay: Array<any> = [];
  columnsToDisplayWithExpand: Array<any> = [];
  expandedElement: Array<PeriodicElement> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.bodyList);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  private _snackBar = inject(MatSnackBar);

  constructor(private service: ShareService, private store: StorageService) { }

  ngOnInit() {
    this.onVerify();
    this.onListTienda();
    this.service.onViewPageAdmin.subscribe((view) => {
      this.isViewPage = view;
    });

    let profileUser = this.store.getStore('mt-profile');

    if ((profileUser || {}).mt_nivel == "SISTEMAS") {
      this.isViewPage = true;
    }

    const self = this;
    this.headList = []
    this.headListSunat = ['#', 'Codigo Documento', 'Nro Correlativo', 'Nom Adquiriente', 'Num documento', 'Observacion', 'Estado Sunat', 'Estado Comprobante', 'Fecha emision']
    this.columnsToDisplay = ['codigo', 'Tienda', 'isVerification', 'cant_comprobantes', 'transacciones', 'clientes_null', 'online', 'conexICG'];
    this.onTransacciones();
    this.onListClient();

    this.socket.on('terminales:get:name:response', (terminales) => {//RECIBE NOMBRE DE LOS TERMINALES FRONT RETAIL
      let indexData = (this.dataSource['_data']['_value'] || []).findIndex((data) => (data.codigo == (terminales || [])[0].CODIGO_TIENDA));
      if (indexData != -1) {
        (this.dataSource['_data']['_value'] || [])[indexData].terminales = terminales;
      }
    });

    this.socket.on('terminales:get:cantidad:response', (dataTerminal) => {//CANTIDAD DE COMPROBANTES POR TERMINAL
      this.isShowLoading = false;
      let indexData = (this.dataSource['_data']['_value'] || []).findIndex((data) => (data.codigo == (((dataTerminal || [])[0] || {}).CODIGO_TIENDA || "")));
      if (indexData != -1) {
        (this.dataSource['_data']['_value'] || [])[indexData].dataTerminales = [];
        (this.dataSource['_data']['_value'] || [])[indexData].terminales.filter((trm) => {
          let elm = (dataTerminal || []).find((dt) => (dt || {}).NOM_TERMINAL == (trm || {}).NOM_TERMINAL);

          (this.dataSource['_data']['_value'] || [])[indexData].dataTerminales.push({
            'NOM_TERMINAL': (trm || {}).NOM_TERMINAL,
            'CANTIDAD': (elm || {}).CANTIDAD || 0,
            'CODIGO': (((dataTerminal || [])[0] || {}).CODIGO_TIENDA || "")
          });
        })
      }
    });

    this.socket.on('comprobantes:get:response', (listaSession) => { //VERIFICACION DE COMPROBANTES
      console.log(listaSession);
      let dataList = [];
      dataList = listaSession || [];
      let index = this.conxOnline.findIndex((conx) => conx == (dataList || [])[0]['CODIGO_TERMINAL']);

      if (dataList.length >= 1 && index == -1) {
        //this.bodyList = [];
        /*
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
                    conexICG: 0,
                    terminales: [],
                    dataTerminales: []
                  });
                });
        
                (this.bodyList || []).filter((data: any) => {
        
                  if (data.online) {
                    this.contadorCajaOnline += 1;
                  }
        
                });
        */
      } else {

        console.log(listaSession[0]['CODIGO_TERMINAL']);
        (dataList || []).filter((dataSocket: any) => {

          if ((dataSocket || {}).ISONLINE == 1) {
            let index = this.conxOnline.findIndex((conx) => conx == (dataSocket || {}).CODIGO_TERMINAL);

            if (index == -1) {
              this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
            }
          }

          if ((dataSocket || {}).ISONLINE == 0) {
            // this.conxOnline = this.conxOnline.filter((conx) => conx != (dataSocket || {}).CODIGO_TERMINAL);
          }

          let codigo = (dataSocket || {}).CODIGO_TERMINAL;
          let indexData = this.dataSource['_data']['_value'].findIndex((data) => (data.codigo == codigo));
          if (indexData != -1) {
            (this.dataSource['_data']['_value'] || [])[indexData].codigo = (dataSocket || {}).CODIGO_TERMINAL;
            (this.dataSource['_data']['_value'] || [])[indexData].Tienda = (dataSocket || {}).DESCRIPCION;
            (this.dataSource['_data']['_value'] || [])[indexData].isVerification = (listaSession[0] || {}).VERIFICACION;
            (this.dataSource['_data']['_value'] || [])[indexData].cant_comprobantes = (dataSocket || {}).CANT_COMPROBANTES;
            (this.dataSource['_data']['_value'] || [])[indexData].online = (dataSocket || {}).ISONLINE;
            (this.dataSource['_data']['_value'] || [])[indexData].conexICG = ((this.bodyList || [])[indexData] || {}).conexICG || 0;
          }
        });
      }

      console.log(this.dataSource['_data']['_value']);

      this.store.removeStore("conx_online");
      this.store.setStore("conx_online", JSON.stringify(this.conxOnline));
      this.socket.emit('terminales:get:name', 'angular');
      this.socket.emit('terminales:get:cantidad', 'angular');
      this.dataSource = new MatTableDataSource(this.bodyList);
      this.isShowLoading = false;
    });

    this.socket.on('transacciones:get:response', (dataSocket) => { //VERIFICACION DE TRANSACCIONES
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

      let indexData = (this.dataSource['_data']['_value'] || []).findIndex((data) => (data.codigo == codigo));
      if (indexData != -1) {
        (this.dataSource['_data']['_value'] || [])[indexData].transacciones = (dataSocket || [])[0].transaciones;
      }
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

    this.socket.on('conexion:serverICG:send', (conexion) => {
      let codigo = ((conexion || [])[0] || {}).code || '';
      let isConect = ((conexion || [])[0] || {}).isConect || 0;
      let indexData = this.bodyList.findIndex((data) => (data.codigo == codigo && data.conexICG != isConect));
      if (indexData != -1) {
        ((this.bodyList || [])[indexData] || {}).conexICG = isConect;
      }

    });

    this.socket.on('status:serverSUNAT:send', (status) => {
      this.statusServerList = [status];
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
      let indexData = (this.dataSource['_data']['_value'] || []).findIndex((data) => (data.codigo == codigo));
      if (indexData != -1) {
        (this.dataSource['_data']['_value'] || [])[indexData].clientes_null = (dataSocket || [])[0].clientCant;
      }
    });

    this.socket.on('comparacion:get:bd:response', (response) => { // RECIBE COMPARACION ENTRE BASES DE DATOS COE_DATA
      this.isLoadingDB = false;
      this.isVerificarBd = false;
      this.bodyListBD = (response || []).data;
      if (!this.bodyListBD.length || ((this.bodyListBD || [])[0] || {})['code_data'] == ((this.bodyListBD || [])[0] || {})['manager_data']) {
        this.vCoeData = ((this.bodyListBD || [])[0] || {})['code_data'];
        this.vManagerData = ((this.bodyListBD || [])[0] || {})['manager_data'];
        this.service.toastSuccess("Servidor", "No hay diferencias entre las bases de datos.");
      }

    });

    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  }


  onVerify() { // ENVIO DE CONSULTA DE COMPROBANTES
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('comprobantes:get', 'angular');
  }

  onTransacciones() {// ENVIO DE CONSULTA DE TRANSACCIONES DE LOS FRONT RETAIL
    this.isShowLoading = true;
    this.contadorCliente = 0;
    this.socket.emit('transacciones:get', 'angular');
  }


  onVerificarDataBase() { // ENVIO COMPARACION ENTRE BASES DE DATOS COE_DATA
    this.isLoadingDB = true;
    this.socket.emit('comparacion:get:bd', 'angular');
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

  onListTienda() { //LISTA DE TIENDAS REGISTRADAS
    const self = this;
    let parms = {
      url: '/comprobantes/session/lista'
    };

    this.service.get(parms).then((response) => {

      let tiendaList = (response || {}).data || [];

      (tiendaList || []).filter((tnd) => {

        if ((tnd || {}).SERIE_TIENDA != '9Q') {
          this.conxOnline.push((tnd || {}).CODIGO_TERMINAL);

          (this.bodyList || []).push({
            codigo: (tnd || {}).CODIGO_TERMINAL,
            Tienda: (tnd || {}).DESCRIPCION,
            isVerification: (tnd || {}).VERIFICACION,
            cant_comprobantes: (tnd || {}).CANT_COMPROBANTES,
            transacciones: 0,
            clientes_null: 0,
            online: (tnd || {}).ISONLINE,
            conexICG: 0,
            terminales: [],
            dataTerminales: []
          });
        }

      });

      this.dataSource = new MatTableDataSource(this.bodyList);

    });
  }

  toolCaja(data) {
    this.vDataTienda = data;
    console.log(this.vDataTienda);
  }

  onSelectedTranferencia(ev, dataOne, dataTwo?) {
    this.vDataTransferencia[0]['dataOne'] = dataOne || this.vDataTransferencia[0]['dataOne'];
    this.vDataTransferencia[0]['dataTwo'] = dataTwo || this.vDataTransferencia[0]['dataTwo'];

    if (Object.keys(dataOne).length) {
      let element = document.getElementsByClassName("origen");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }

      document.getElementById(ev.target.id).classList.add('active');
    }

    if (Object.keys(dataTwo).length) {
      let element = document.getElementsByClassName("destino");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }

      document.getElementById(ev.target.id).classList.add('active');
    }

  }

  onClearColaUpdate() {
    this.socket.emit('cleanColaFront');
    this.onTransacciones();
  }

  onTranferirCola() {
    if (Object.keys(this.vDataTransferencia[0]['dataOne']).length && Object.keys(this.vDataTransferencia[0]['dataTwo']).length) {
      this.socket.emit('transacciones:post', this.vDataTransferencia);
      setTimeout(() => {
        this.onVerify();
      }, 1000);
    } else {
      this.openSnackBar('Seleccione el Origen y Destino.');
    }
  }

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }


}

export interface PeriodicElement {
  codigo: string,
  Tienda: string,
  isVerification: boolean,
  cant_comprobantes: number,
  transacciones: number,
  clientes_null: number,
  online: number,
  conexICG: number,
  terminales: Array<any>,
  dataTerminales: Array<any>
}




