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
  token: any = localStorage.getItem('tn');
  socket = io('http://localhost:3200', { query: { code: 'app', token: this.token } });

  constructor() { }

  ngOnInit() {
    const self = this;
    this.headList = ['#', 'Codigo', 'Tienda', 'Verificacion', 'Comprobantes', 'Online']

    this.socket.on('sessionConnect', (listaSession) => {
      let dataList = (listaSession || []);
      this.bodyList = [];
      (dataList || []).filter((data: any) => {
        this.bodyList.push({
          codigo: (data || {}).CODIGO_TERMINAL,
          Tienda: (data || {}).DESCRIPCION,
          isVerification: (data || {}).VERIFICACION,
          cant_comprobantes: (data || {}).CANT_COMPROBANTES,
          online: (data || {}).ISONLINE
        });
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




