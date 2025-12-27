import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from 'src/app/services/shareService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GlobalConstants } from '../../const/globalConstants';

@Component({
  selector: 'mt-panel-horario',
  templateUrl: './mt-panel-horario.component.html',
  styleUrls: ['./mt-panel-horario.component.scss'],
})
export class MtPanelHorarioComponent implements OnInit {
  displayedColumns: string[] = ['Tienda', 'Inicio_semana', 'Termino_semana', 'fecha_hora', 'Accion'];
  displayedColumnsPap: string[] = ['Codigo_Papeleta', 'Tienda', 'Fecha', 'Tipo_papeleta', 'Nombre_Completo', 'Accion'];
  dataView: Array<any> = [];
  dataViewPap: Array<any> = [];
  listaPapeletas: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.dataView);
  dataSourcePap = new MatTableDataSource<any>(this.listaPapeletas);
  filterEmpleado: string = "";
  codigoPap: string = "";
  filterCodigoPapeleta: string = "";
  isHorario: boolean = false;
  isViewPap: boolean = false;
  isViewPapeleta: boolean = false;
  isObservaciones: boolean = false;
  onSelectedHorario: Array<any> = [];
  onSelectedPapeleta: Array<any> = [];
  onListCasos: Array<any> = [];
  socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('MatPaginator2') paginator_pap: MatPaginator;
  @ViewChild(MatSort) sort_pap: MatSort;

  arDataHorario: Array<any> = [{ code: 'OF', rango: '', name: 'ADMINISTRACION', isHorario: false, id_Horario: 0 }];

  constructor(private service: ShareService) {
  }

  async ngOnInit() {
    await this.onAllStore().then(async () => {
      await this.onListTipoPapeleta();
      this.onListHorario();
    });


  }

  onAllStore() {
    return new Promise((resolve, reject) => {
      this.service.allStores().then((stores: Array<any>) => {
        (stores || []).filter((store, i) => {
          (this.arDataHorario || []).push({
            code: (store || {}).serie,
            rango: '',
            name: (store || {}).description,
            isHorario: false,
            id_Horario: 0
          });
        });
        resolve(stores);
      });
    });
  }

  //LISTA DE PAPELETAS
  onListPapeleta() {
    let parms = {
      url: '/papeleta/listarPapeleta'
    };

    this.service.get(parms).then(async (response) => {
      const ascDates = response.reverse();

      this.listaPapeletas = ascDates;
      (this.listaPapeletas || []).filter((data, i) => {
        let tipo = this.onListCasos.filter((tp) => tp.key == data['id_tipo_papeleta']);
        this.listaPapeletas[i]['tipo'] = ((tipo || [])[0] || {})['value'];
        this.listaPapeletas[i]['uns'] = this.arDataHorario.find((tp) => tp.code == data['codigo_tienda'])['name'];
        if (this.listaPapeletas.length - 1 == i) {
          this.dataSourcePap = new MatTableDataSource(this.listaPapeletas);
          this.dataSourcePap.paginator = this.paginator_pap;
          this.dataSourcePap.sort = this.sort_pap;
        }
      });


    });
  }

  onListTipoPapeleta() {
    let parms = {
      url: '/papeleta/lista/tipo_papeleta'
    };

    this.service.get(parms).then(async (response) => {
      (response || []).filter((tp) => {
        this.onListCasos.push({ key: tp.ID_TIPO_PAPELETA, value: tp.DESCRIPCION });
      });
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
        console.log(dataResponse);
        (dataResponse || []).filter(async (dt, i) => {

          let tienda = await this.arDataHorario.filter((hr) => hr.code == dt.CODIGO_TIENDA);

          let horario = ((dt || {}).RANGO_DIAS || "").split(" ");

          if ((tienda || []).length && (dt || {}).RANGO_DIAS != "") {

            if ((dt || {}).RANGO_DIAS != 'undefined' && horario[0] != '20-1-2025') {

              let exist = this.dataView.find((dw) => dw.code == tienda[0].code && dw.rango_1 == horario[0]);

              if (!Object.keys(exist || {}).length && dt.ESTADO != 'ANULADO') {
                this.dataView.push({
                  id: this.dataView.length + 1, fecha: dt.FECHA, code: tienda[0].code, rango_1: horario[0], rango_2: horario[1], name: tienda[0].name, datetime: dt.DATETIME
                })
              }
            }
          }

          if (dataResponse.length - 1 == i) {
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

  applyFilterPapeleta(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePap.filter = filterValue.trim().toLowerCase();
  }


  onViewHorario(ev) {
    this.isHorario = true;
    this.isObservaciones = false;
    this.onSelectedHorario = [ev];
  }

  onViewObservacion(ev) {
    this.isHorario = true;
    this.isObservaciones = true;
    this.onSelectedHorario = [ev];
  }

  onBack() {
    this.isHorario = false
    this.onListHorario();
    this.onListPapeleta();
  }

  onBackPap() {
    this.codigoPap = "";
    this.isHorario = false
    this.isViewPapeleta = false
    this.onListHorario();
    this.onListPapeleta();
  }

  onSearchPapeleta() {
    this.codigoPap = this.filterCodigoPapeleta;
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }


  onViewPapeleta(ev) {
    this.codigoPap = "";
    this.codigoPap = ev.codigo_papeleta;
    this.isViewPapeleta = true;
  }

  async onCall(ev) {
    if (ev.tab.textLabel == "Horarios Creados") {
      await this.onListHorario();
      this.dataSourcePap = new MatTableDataSource<any>([]);
      this.dataSourcePap.paginator = this.paginator_pap;
      this.dataSourcePap.sort = this.sort_pap;
    }

    if (ev.tab.textLabel == "Papeletas Creadas") {
      await this.onListPapeleta();
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }

}
