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

  onReporteList: Array<any> = [];

  onDataView: Array<any> = [];
  onListPagination: Array<any> = [];
  vPageActualTable: number = 1;
  vPageAnteriorTable: number = 0;
  vNumPaginas: number = 0;

  constructor() { }

  ngOnInit() {
    this.onReporteList = this.onReporteList;

    this.onPaginator();
    this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);
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
    this.exportAsExcelFile(this.onReporteList, "inventario");
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onCargaInventario() {
    const self = this;

    this.socket.emit('comunicationStock', 'angular');

    this.socket.on('dataStock', (dataInventario) => {
      console.log(dataInventario);
      let codigoTienda = (dataInventario[0]).cCodigoTienda;

      let dataResponse = [];
      let dataProcess = [];
      let dataServer = [];

      dataInventario.filter((data, i) => {
        if (i < 2000) {
          dataServer.push(data);
        }
      });

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

      let tiendaIndex = tiendasList.findIndex((property) => (property || {}).code == codigoTienda);
      tiendasList[tiendaIndex]['ready'] = true;

      let countReady = 0;

      tiendasList.filter((tienda) => {
        if ((tienda || {}).ready == true) {
          countReady += 1;
        }
      });

      if (countReady == 1) {

        dataProcess = dataServer;
        
        (dataProcess || []).filter((data, i) => {

          let isExist = self.onReporteList.find((res) => ((res || {}).cCodigoBarra == (data || {}).cCodigoBarra) && ((res || {}).cFamilia == (data || {}).cFamilia));
          
          if (typeof isExist != 'undefined') {
            let codigoExist = (data || {}).cCodigoTienda;
            let valueSock = tiendasList.find((property) => (property || {}).code == codigoExist);

            let index = self.onReporteList.findIndex((dataIndex) => ((dataIndex || {}).cCodigoBarra == (data || {}).cCodigoBarra) && ((dataIndex || {}).cFamilia == (data || {}).cFamilia));
            self.onReporteList[index][(valueSock || {}).property] = (data || {}).cStock;

          } else {
            let codigoTienda = (data || {}).cCodigoTienda;

            let valueSock = tiendasList.find((property) => (property || {}).code == codigoTienda);

            self.onReporteList.push({
              "cPreferencia": (data || {}).cPreferencia,
              "cCodigoBarra": (data || {}).cCodigoBarra,
              "cDescripcion": (data || {}).cDescripcion,
              "cDepartamento": (data || {}).cDepartamento,
              "cSeccion": (data || {}).cSeccion,
              "cFamilia": (data || {}).cFamilia,
              "cSubfamilia": (data || {}).cSubfamilia,
              "cTalla": (data || {}).cTalla,
              "cColor": (data || {}).cColor,
              "bbw_jockey": 0,
              "vs_m_aventura": 0,
              "bbw_m_aventura": 0,
              "bbw_rambla": 0,
              "vs_rambla": 0,
              "vs_p_norte": 0,
              "bbw_s_miguel": 0,
              "vs_s_miguel": 0,
              "bbw_salaverry": 0,
              "vs_salaverry": 0,
              "vs_m_sur": 0,
              "vs_puruchuco": 0,
              "vs_ecom": 0,
              "bbw_ecom": 0,
              "vs_m_plaza": 0,
              "vs_minka": 0,
              "vs_full": 0,
              "bbw_asia": 0
            });

            let index = self.onReporteList.findIndex((dataIndex) => (dataIndex || {}).cCodigoBarra == (data || {}).cCodigoBarra);
            self.onReporteList[index][(valueSock || {})['property']] = (data || {}).cStock;

          }
        });
             
        this.onPaginator();
        this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

      }

    });


  }

}


