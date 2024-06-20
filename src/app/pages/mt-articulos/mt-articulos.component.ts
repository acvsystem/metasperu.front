import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-articulos',
  templateUrl: './mt-articulos.component.html',
  styleUrls: ['./mt-articulos.component.scss'],
})
export class MtArticulosComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });

  headList = ['Preferencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Familia', 'SubFamilia', 'Talla', 'Color', 'BBW JK', 'VS ARQ', 'BBW ARQ', 'BBW RAMB', 'VS RAMB', 'VS PN', 'BBW SM', 'VS SM', 'BBW SLV', 'VS SLV', 'VS MSUR', 'VS PURU', 'VS ECOM', 'BW ECOM', 'VS MGP', 'VS MINKA', 'VSFA JK', 'BBW ASIA'];
  headListTienda = ['Tienda', 'Procesar', 'Procesado', 'Estado'];
  onReporteList: Array<any> = [];

  onDataView: Array<any> = [];
  onListPagination: Array<any> = [];
  vPageActualTable: number = 1;
  vPageAnteriorTable: number = 0;
  vNumPaginas: number = 0;
  isLoading: boolean = false;
  isProccess: boolean = false;
  nameExcel: string = "";
  tiendasList: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY', progress: -1 },
    { key: "9N", value: "VSBA MALL AVENTURA", progress: -1 },
    { key: "7J", value: "BBW MALL AVENTURA", progress: -1 },
    { key: '7E', value: 'BBW LA RAMBLA', progress: -1 },
    { key: '9D', value: 'VS LA RAMBLA', progress: -1 },
    { key: '9B', value: 'VS PLAZA NORTE', progress: -1 },
    { key: '7C', value: 'BBW SAN MIGUEL', progress: -1 },
    { key: '9C', value: 'VS SAN MIGUEL', progress: -1 },
    { key: '7D', value: 'BBW SALAVERRY', progress: -1 },
    { key: '9I', value: 'VS SALAVERRY', progress: -1 },
    { key: '9G', value: 'VS MALL DEL SUR', progress: -1 },
    { key: '9H', value: 'VS PURUCHUCO', progress: -1 },
    { key: '9M', value: 'VS ECOMMERCE', progress: -1 },
    { key: '7F', value: 'BBW ECOMMERCE', progress: -1 },
    { key: '9K', value: 'VS MEGA PLAZA', progress: -1 },
    { key: '9L', value: 'VS MINKA', progress: -1 },
    { key: '9F', value: 'VSFA JOCKEY FULL', progress: -1 },
    { key: '7A7', value: 'BBW ASIA', progress: -1 }
  ];

  onListTiendas: Array<any> = [
    { code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { code: '9N', name: 'VS MALL AVENTURA', procesar: 0, procesado: -1 },
    { code: '7J', name: 'BBW MALL AVENTURA', procesar: 0, procesado: -1 },
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
    { code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 }
  ];
  constructor() { }

  ngOnInit() {
    this.onReporteList = this.onReporteList;

    this.onPaginator();
    this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

    this.socket.on('dataStock', (dataInventario) => {
      let dataParse = JSON.parse(dataInventario);
      let codigoTienda = (dataParse || {}).code;
      let tiendaIndex = this.tiendasList.findIndex((property) => (property || {}).key == codigoTienda);
      (this.tiendasList[tiendaIndex] || {})['progress'] = (dataParse || {}).progress == 100 ? 0 : (dataParse || {}).progress;
    });
  }

  onViewDataTable(pageAnt, pageAct) {
    const self = this;
    self.onDataView = [];
    if (this.onReporteList.length < 10) {
      this.onDataView = this.onReporteList;
    } else {
      (this.onReporteList || []).filter((data, i) => {
        if (pageAct > 1) {
          if (i > (pageAnt * 10 - 1) && i <= (pageAct * 10 - 1)) {
            self.onDataView.push(data);
          }
        } else {
          if (i <= (pageAct * 10 - 1)) {
            self.onDataView.push(data);
          }
        }
      });
    }

    self.vPageAnteriorTable = pageAnt;
    self.vPageActualTable = pageAct;
    self.isProccess = false;
  }

  onViewPrevius() {
    this.onViewDataTable(this.vPageAnteriorTable - 1, this.vPageActualTable - 1);
  }

  onViewNext() {
    this.onViewDataTable(this.vPageAnteriorTable + 1, this.vPageActualTable + 1);
  }

  onPaginator() {
    this.onListPagination = [];

    if (this.onReporteList.length >= 5) {
      for (let i = 1; i <= Math.round(this.onReporteList.length / 10); i++) {
        this.onListPagination.push({
          pAnterior: i - 1,
          pActual: i
        });
      }
    } else {
      this.onListPagination.push({
        pAnterior: 0,
        pActual: 1
      });
    }

  }

  onExcelExport() {
    const self = this;
    self.isLoading = true;
    this.exportAsExcelFile(this.onReporteList, self.nameExcel);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const self = this;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    self.isLoading = false;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onCargaInventario() {
    const self = this;
    self.isLoading = true;
    this.socket.emit('comunicationStock', 'angular');
  }

  onProcessData(dataInventario) {
    return new Promise((resolve, reject) => {
      console.log(dataInventario.length);
      const self = this;
      let codigoTienda = (dataInventario || [])[0].cCodigoTienda;

      //let dataResponse = [];
      let dataProcess = [];
      let dataServer = dataInventario;

      let tiendasList = [
        { code: '7A', property: 'bbw_jockey', ready: false },
        { code: '9N', property: 'vs_m_aventura', ready: false },
        { code: '7J', property: 'bbw_m_aventura', ready: false },
        { code: '7E', property: 'bbw_rambla', ready: false },
        { code: '9D', property: 'vs_rambla', ready: false },
        { code: '9B', property: 'vs_p_norte', ready: false },
        { code: '7C', property: 'bbw_s_miguel', ready: false },
        { code: '9C', property: 'vs_s_miguel', ready: false },
        { code: '7D', property: 'bbw_salaverry', ready: false },
        { code: '9I', property: 'vs_salaverry', ready: false },
        { code: '9G', property: 'vs_m_sur', ready: false },
        { code: '9H', property: 'vs_puruchuco', ready: false },
        { code: '9M', property: 'vs_ecom', ready: false },
        { code: '7F', property: 'bbw_ecom', ready: false },
        { code: '9K', property: 'vs_m_plaza', ready: false },
        { code: '9L', property: 'vs_minka', ready: false },
        { code: '9F', property: 'vs_full', ready: false },
        { code: '7A7', property: 'bbw_asia', ready: false }
      ];

      /*   let tiendaIndex = tiendasList.findIndex((property) => (property || {}).code == codigoTienda);
         tiendasList[tiendaIndex]['ready'] = true;
   
         let countReady = 0;
   
         tiendasList.filter((tienda) => {
           if ((tienda || {}).ready == true) {
             countReady += 1;
           }
         });*/

      // if (countReady == 1) {

      dataProcess = dataServer;
      let indexTienda = tiendasList.findIndex((property) => (property || {}).code == codigoTienda);
      self.onListTiendas[indexTienda]['procesar'] = dataInventario.length;

      (dataProcess || []).filter((data, i) => {

        let index = self.onReporteList.findIndex((res) => ((res || {}).cCodigoBarra == (data || {}).cCodigoBarra) && ((res || {}).cFamilia == (data || {}).cFamilia));

        if (index != -1) {
          let codigoExist = (data || {}).cCodigoTienda;
          let valueSock = tiendasList.find((property) => (property || {}).code == codigoExist);
          let stockProducto = typeof (data || {}).cStock != 'undefined' ? (data || {})[(valueSock || {}).property] : 0;
          //let index = self.onReporteList.findIndex((dataIndex) => ((dataIndex || {}).cCodigoBarra == (data || {}).cCodigoBarra) && ((dataIndex || {}).cFamilia == (data || {}).cFamilia));
          self.onReporteList[index][(valueSock || {}).property] = stockProducto + self.onReporteList[index][(valueSock || {}).property];

        } else {
          self.onReporteList.push(data);
        }
        self.onListTiendas[indexTienda]['procesado'] = i + 1;

      });

      this.onPaginator();
      this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

      resolve(true);
      // }
    });
  }

}


