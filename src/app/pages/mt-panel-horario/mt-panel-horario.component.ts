import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from 'src/app/services/shareService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'mt-panel-horario',
  templateUrl: './mt-panel-horario.component.html',
  styleUrls: ['./mt-panel-horario.component.scss'],
})
export class MtPanelHorarioComponent implements OnInit {
  displayedColumns: string[] = ['Tienda', 'Inicio_semana', 'Termino_semana', 'Accion'];
  displayedColumnsPap: string[] = ['tienda', 'nro_papeleta', 'nombres', 'cargo', 'tipo_papeleta', 'fecha', 'Accion'];
  dataView: Array<any> = [];
  dataViewPap: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.dataView);
  dataSourcePap = new MatTableDataSource<any>(this.dataViewPap);
  filterEmpleado: string = "";
  codigoPap: string = "";
  isHorario: boolean = false;
  isViewPap: boolean = false;
  onSelectedHorario: Array<any> = [];
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  arDataHorario: Array<any> = [
    { code: '7A', rango: '', name: 'BBW JOCKEY', isHorario: false, id_Horario: 0 },
    { code: '9N', rango: '', name: 'VS MALL AVENTURA AQP', isHorario: false, id_Horario: 0 },
    { code: '7J', rango: '', name: 'BBW MALL AVENTURA AQP', isHorario: false, id_Horario: 0 },
    { code: '7E', rango: '', name: 'BBW LA RAMBLA', isHorario: false, id_Horario: 0 },
    { code: '9D', rango: '', name: 'VS LA RAMBLA', isHorario: false, id_Horario: 0 },
    { code: '9B', rango: '', name: 'VS PLAZA NORTE', isHorario: false, id_Horario: 0 },
    { code: '7C', rango: '', name: 'BBW SAN MIGUEL', isHorario: false, id_Horario: 0 },
    { code: '9C', rango: '', name: 'VS SAN MIGUEL', isHorario: false, id_Horario: 0 },
    { code: '7D', rango: '', name: 'BBW SALAVERRY', isHorario: false, id_Horario: 0 },
    { code: '9I', rango: '', name: 'VS SALAVERRY', isHorario: false, id_Horario: 0 },
    { code: '9G', rango: '', name: 'VS MALL DEL SUR', isHorario: false, id_Horario: 0 },
    { code: '9H', rango: '', name: 'VS PURUCHUCO', isHorario: false, id_Horario: 0 },
    { code: '9M', rango: '', name: 'VS ECOMMERCE', isHorario: false, id_Horario: 0 },
    { code: '7F', rango: '', name: 'BBW ECOMMERCE', isHorario: false, id_Horario: 0 },
    { code: '9K', rango: '', name: 'VS MEGA PLAZA', isHorario: false, id_Horario: 0 },
    { code: '9L', rango: '', name: 'VS MINKA', isHorario: false, id_Horario: 0 },
    { code: '9F', rango: '', name: 'VSFA JOCKEY FULL', isHorario: false, id_Horario: 0 },
    { code: '7A7', rango: '', name: 'BBW ASIA', isHorario: false, id_Horario: 0 },
    { code: '9P', rango: '', name: 'VS MALL PLAZA TRU', isHorario: false, id_Horario: 0 },
    { code: '7I', rango: '', name: 'BBW MALL PLAZA TRU', isHorario: false, id_Horario: 0 }
  ];



  constructor(private service: ShareService) {
  }

  ngOnInit() {
    this.onListHorario();
    this.onListPapeleta();
  }

//LISTA DE PAPELETAS
  onListPapeleta() {
    let parms = {
      url: '/papeleta/listarPapeleta'
    };

    this.service.get(parms).then(async (response) => {
      let dataResponse = response;
      this.dataViewPap = [];
      if ((dataResponse || {}).success != false) {
        (dataResponse || []).filter(async (dt, i) => {
          let tienda = await this.arDataHorario.filter((hr) => hr.code == dt.CODIGO_TIENDA);

          this.dataViewPap.push({
            tienda: tienda[0].name, nombre: dt.NOMBRE_COMPLETO, cargo: dt.CARGO_EMPLEADO, tipo: dt.ID_PAP_TIPO_PAPELETA, fecha: dt.FECHA_CREACION, nro_papeleta: dt.CODIGO_PAPELETA
          });

          if (dataResponse.length - 1 == i) {
            this.dataSourcePap = new MatTableDataSource(this.dataViewPap);
            this.dataSourcePap.paginator = this.paginator;
            this.dataSourcePap.sort = this.sort;
          }
        });
      }
    });
  }

  onListHorario() {
    let parms = {
      url: '/calendario/listarHorario'
    };

    this.service.get(parms).then(async (response) => {
      let dataResponse = response;
      this.dataView = [];
      if ((dataResponse || []).length) {
        (dataResponse || []).filter(async (dt, i) => {
          let tienda = await this.arDataHorario.filter((hr) => hr.code == dt.CODIGO_TIENDA);

          let horario = ((dt || {}).RANGO_DIAS || "").split(" ");

          if ((tienda || []).length && (dt || {}).RANGO_DIAS != "") {
            this.dataView.push({
              code: tienda[0].code, rango_1: horario[0], rango_2: horario[1], name: tienda[0].name
            });
          }

          if (dataResponse.length - 1 == i) {
            console.log(this.dataView);
            this.dataSource = new MatTableDataSource(this.dataView);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onViewHorario(ev) {
    this.isHorario = true;
    this.onSelectedHorario = [ev];
  }

  onBack() {
    this.isHorario = false
    this.onListHorario();
  }

  onBackPap() {
    this.isHorario = false
    this.isViewPap = false
    this.onListHorario();
  }

  onViewPapeleta(ev) {
    this.codigoPap = "";
    console.log(ev);
    this.codigoPap = ev.nro_papeleta;
    this.isViewPap = true;
  }

}
