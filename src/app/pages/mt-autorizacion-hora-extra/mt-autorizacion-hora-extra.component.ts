import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { io } from "socket.io-client";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-autorizacion-hora-extra',
  templateUrl: './mt-autorizacion-hora-extra.component.html',
  styleUrls: ['./mt-autorizacion-hora-extra.component.scss'],
})
export class MtAutorizacionHoraExtraComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  onDataView: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.onDataView);
  displayedColumns: string[] = [];
  codeTienda: string = "";
  onListTiendas: Array<any> = [
    { code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code: '7E', name: 'BBW LA RAMBLA', procesar: 0, procesado: -1 },
    { code: '9D', name: 'VS LA RAMBLA', procesar: 0, procesado: -1 },
    { code: '9B', name: 'VS PLAZA NORTE', procesar: 0, procesado: -1 },
    { code: '7C', name: 'BBW SAN MIGUEL', procesar: 0, procesado: -1 },
    { code: '9C', name: 'VS SAN MIGUEL', procesar: 0, procesado: -1 },
    { code: '7D', name: 'BBW SALAVERRY', procesar: 0, procesado: -1 },
    { code: '9I', name: 'VS SALAVERRY', procesar: 0, procesado: -1 },
    { code: '9G', name: 'VS MALL DEL SUR', procesar: 0, procesado: -1 },
    { code: '9H', name: 'VS PURUCHUCO', procesar: 0, procesado: -1 },
    { code: '9M', name: 'VS ECOMMERCE', procesar: 0, procesado: -1 },
    { code: '7F', name: 'BBW ECOMMERCE', procesar: 0, procesado: -1 },
    { code: '9K', name: 'VS MEGA PLAZA', procesar: 0, procesado: -1 },
    { code: '9L', name: 'VS MINKA', procesar: 0, procesado: -1 },
    { code: '9F', name: 'VSFA JOCKEY FULL', procesar: 0, procesado: -1 },
    { code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: StorageService, private service: ShareService) { }

  ngOnInit() {

    let profileUser = this.store.getStore('mt-profile');
    this.codeTienda = profileUser.code.toUpperCase();

    this.socket.on('lista_solicitudes', async (response) => {
      let selectedLocal = await this.onListTiendas.find((data) => data.code == response['CODIGO_TIENDA']) || {};
      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'AUTORIZAR'];
      this.onDataView = response;
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.onListHorasAutorizar();
  }

  onListHorasAutorizar() {
    let parms = {
      url: '/papeleta/lista/horas_autorizacion'
    };
    this.service.get(parms).then(async (response) => {
      let selectedLocal = await this.onListTiendas.find((data) => data.code == response['CODIGO_TIENDA']) || {};
      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'AUTORIZAR']; this.onDataView = response;
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onAutorizar(ev) {

    let parse = {
      hora_extra: ev.HR_EXTRA_ACOMULADO,
      nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
      aprobado: true,
      rechazado: false,
      fecha: ev.FECHA,
      codigo_tienda: this.codeTienda
    }
    this.socket.emit('autorizar_hrx', parse);
  }

  onRechazar(ev) {

    let parse = {
      hora_extra: ev.HR_EXTRA_ACOMULADO,
      nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
      aprobado: false,
      rechazado: true,
      fecha: ev.FECHA,
      codigo_tienda: this.codeTienda
    }
    this.socket.emit('autorizar_hrx', parse);
  }

}
