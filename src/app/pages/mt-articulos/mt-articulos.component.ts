import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ShareService } from '../../services/shareService';
import { StorageService } from 'src/app/utils/storage';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-articulos',
  templateUrl: './mt-articulos.component.html',
  styleUrls: ['./mt-articulos.component.scss'],
})
export class MtArticulosComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });

  headList = ['Preferencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Talla', 'Color'];
  headListTienda = ['Tienda', 'Procesar', 'Procesado', 'Estado'];
  onReporteList: Array<any> = [];

  onDataView: Array<any> = [];
  onListPagination: Array<any> = [];
  vPageActualTable: number = 1;
  vPageAnteriorTable: number = 0;
  vNumPaginas: number = 0;
  isLoading: boolean = false;
  isProccess: boolean = false;
  isError: boolean = false;
  nameExcel: string = "";
  selectedEmail: string = "";
  selectedUS: string = "";
  optionListEmail: Array<any> = [];
  tiendasList: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY', progress: -1, checked: false },
    { key: "9N", value: "VSBA MALL AVENTURA", progress: -1, checked: false },
    { key: "7J", value: "BBW MALL AVENTURA", progress: -1, checked: false },
    { key: '7E', value: 'BBW LA RAMBLA', progress: -1, checked: false },
    { key: '9D', value: 'VS LA RAMBLA', progress: -1, checked: false },
    { key: '9B', value: 'VS PLAZA NORTE', progress: -1, checked: false },
    { key: '7C', value: 'BBW SAN MIGUEL', progress: -1, checked: false },
    { key: '9C', value: 'VS SAN MIGUEL', progress: -1, checked: false },
    { key: '7D', value: 'BBW SALAVERRY', progress: -1, checked: false },
    { key: '9I', value: 'VS SALAVERRY', progress: -1, checked: false },
    { key: '9G', value: 'VS MALL DEL SUR', progress: -1, checked: false },
    { key: '9H', value: 'VS PURUCHUCO', progress: -1, checked: false },
    { key: '9M', value: 'VS ECOMMERCE', progress: -1, checked: false },
    { key: '7F', value: 'BBW ECOMMERCE', progress: -1, checked: false },
    { key: '9K', value: 'VS MEGA PLAZA', progress: -1, checked: false },
    { key: '9L', value: 'VS MINKA', progress: -1, checked: false },
    { key: '9F', value: 'VSFA JOCKEY FULL', progress: -1, checked: false },
    { key: '7A7', value: 'BBW ASIA', progress: -1, checked: false }
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

  onListMarcas: Array<any> = [
    { key: 'VICTORIA SECRET', value: 'VICTORIA SECRET' },
    { key: 'BATH AND BODY WORKS', value: 'BATH AND BODY WORKS' }
  ];

  petitionTiendaList: Array<any> = [];
  compTiendaList: Array<any> = [];
  proccessData: Array<any> = [];
  tiendasPetition: Array<any> = [];
  conxOnline: Array<any> = [];
  constructor(private http: ShareService, private store: StorageService) { }

  ngOnInit() {

    this.socket.on('sessionConnect', (listaSession) => {

      let dataList = [];
      dataList = listaSession || [];
      if (dataList.length > 1) {
        (dataList || []).filter((dataSocket: any) => {

          if ((dataSocket || {}).ISONLINE == 1) {
            this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
          }

        });
      } else {
        (dataList || []).filter((dataSocket: any) => {

          if ((dataSocket || {}).ISONLINE == 1) {
            let index = this.conxOnline.findIndex((conx) => conx == (dataSocket || {}).CODIGO_TERMINAL);
            if (index == -1) {
              this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
            }
          }

          if ((dataSocket || {}).ISONLINE == 0) {
            this.conxOnline = this.conxOnline.filter((conx) => conx != (dataSocket || {}).CODIGO_TERMINAL);
          }
        });

      }
     
      this.store.removeStore("conx_online");
      this.store.setStore("conx_online", JSON.stringify(this.conxOnline));
    });


    this.onReporteList = this.onReporteList;

    this.onPaginator();
    this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

    this.socket.on('dataStockParse', async (data) => {
      this.proccessData.push(data[0].cCodigoTienda);
      if (this.selectedUS == 'VICTORIA SECRET' && this.proccessData.length == this.compTiendaList.length) {
        this.isLoading = false;
      }

      if (this.selectedUS == 'BATH AND BODY WORKS' && this.proccessData.length == this.compTiendaList.length) {
        this.isLoading = false;
      }

      await this.onProcessData(data);
    });

    this.socket.on('dataStock', (dataInventario) => {

      let dataParse = JSON.parse(dataInventario);
      let codigoTienda = (dataParse || {}).code;
      let tiendaIndex = this.tiendasList.findIndex((property) => (property || {}).key == codigoTienda);
      (this.tiendasList[tiendaIndex] || {})['progress'] = (dataParse || {}).progress == 100 ? 0 : (dataParse || {}).progress;
    });

    let parms = {
      url: '/security/emailList'
    };

    return this.http.get(parms).then((response) => {
      let data = response || [];
      data.filter((list) => {
        this.optionListEmail.push({
          key: list.mail,
          value: list.mail
        });
      });

      console.log(this.optionListEmail);
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
    if (this.selectedEmail.length) {
      this.socket.emit('comunicationStock', this.selectedEmail, this.petitionTiendaList);
    } else {
      this.isError = true;
    }
  }

  onCheked(ev, code) {
    let isChecked = ev.target.checked;

    if (code != 'all') {
      let index = this.petitionTiendaList.findIndex((tienda) => tienda.code == code);

      if (isChecked && index == -1) {
        this.petitionTiendaList.push({
          code: code
        });
      } else {
        this.petitionTiendaList.splice(index, 1);
      }
    } else {
      this.tiendasList.forEach(x => x.checked = isChecked);
      if (this.petitionTiendaList.length != 18) {
        this.petitionTiendaList = [];
        this.tiendasList.filter((tn) => {
          this.petitionTiendaList.push({
            code: tn.key
          });
        });
      } else {
        this.petitionTiendaList = [];
      }
    }


  }

  onProcessData(dataInventario) {
    return new Promise((resolve, reject) => {
      const self = this;

      let codigoTienda = (dataInventario || [])[0].cCodigoTienda;

      let dataResponse = [];
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

      dataProcess = dataServer;
      let indexTienda = tiendasList.findIndex((property) => (property || {}).code == codigoTienda);
      self.onListTiendas[indexTienda]['procesar'] = dataInventario.length;

      (dataProcess || []).filter((data, i) => {
        let index = self.onReporteList.findIndex((res) => ((res || {}).cCodigoBarra == (data || {}).cCodigoBarra));
        if (index != -1) {
          let codigoExist = (data || {}).cCodigoTienda;
          let valueSock = tiendasList.find((property) => (property || {}).code == codigoExist);
          let indexProductoExist = self.onReporteList.findIndex((articulo) => (articulo || {}).cCodigoBarra == (data || {}).cCodigoBarra);
          self.onReporteList[indexProductoExist][(valueSock || {}).property] = (data || {})[(valueSock || {}).property];
        } else {

          if (this.selectedUS == 'VICTORIA SECRET') {
            self.onReporteList.push({
              "cPreferencia": (data || {}).cPreferencia,
              "cCodigoBarra": (data || {}).cCodigoBarra,
              "cDescripcion": (data || {}).cDescripcion,
              "cDepartamento": (data || {}).cDepartamento,
              "cSeccion": (data || {}).cSeccion,
              "cTalla": (data || {}).cTalla,
              "cColor": (data || {}).cColor,
              "vs_m_aventura": (data || {}).vs_m_aventura || 0,
              "vs_rambla": (data || {}).vs_rambla || 0,
              "vs_p_norte": (data || {}).vs_p_norte || 0,
              "vs_s_miguel": (data || {}).vs_s_miguel || 0,
              "vs_salaverry": (data || {}).vs_salaverry || 0,
              "vs_m_sur": (data || {}).vs_m_sur || 0,
              "vs_puruchuco": (data || {}).vs_puruchuco || 0,
              "vs_ecom": (data || {}).vs_ecom || 0,
              "vs_m_plaza": (data || {}).vs_m_plaza || 0,
              "vs_minka": (data || {}).vs_minka || 0,
              "vs_full": (data || {}).vs_full || 0
            });
          }
          if (this.selectedUS == 'BATH AND BODY WORKS') {
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
              "bbw_jockey": (data || {}).bbw_jockey || 0,
              "bbw_m_aventura": (data || {}).bbw_m_aventura || 0,
              "bbw_rambla": (data || {}).bbw_rambla || 0,
              "bbw_s_miguel": (data || {}).bbw_s_miguel || 0,
              "bbw_salaverry": (data || {}).bbw_salaverry || 0,
              "bbw_ecom": (data || {}).bbw_ecom || 0,
              "bbw_asia": (data || {}).bbw_asia || 0,
            });
          }
        }
        self.onListTiendas[indexTienda]['procesado'] = i + 1;

      });

      this.onPaginator();
      this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

      resolve(true);
    });
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
    this.isError = false;

    if (index != 'selectedEmail') {
      this.onProcessPetition((selectData || {}).key);
    }

  }

  onProcessPetition(undNegocio) {
    let storeConxOnline = this.store.getStore('conx_online');
    if (undNegocio == 'VICTORIA SECRET') {
      this.onDataView = [];
      this.onReporteList = [];
      this.compTiendaList = [];
      this.nameExcel = "vs";
      this.headList = ['Preferencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Talla', 'Color', 'VS ARQ', 'VS RAMB', 'VS PN', 'VS SM', 'VS SLV', 'VS MSUR', 'VS PURU', 'VS ECOM', 'VS MGP', 'VS MINKA', 'VSFA JK']
      let codeTiendas = [
        { code: '9N' },
        { code: '9D' },
        { code: '9B' },
        { code: '9C' },
        { code: '9I' },
        { code: '9G' },
        { code: '9H' },
        { code: '9M' },
        { code: '9K' },
        { code: '9L' },
        { code: '9F' }
      ];

      codeTiendas.filter((tienda) => {
        let index = storeConxOnline.findIndex((codeCnx) => codeCnx == tienda.code);
        console.log(index);
        if (index > -1) {
          this.compTiendaList.push(tienda.code);
        }
      });

      this.tiendasPetition = [
        { code: '9N' },
        { code: '9D' },
        { code: '9B' },
        { code: '9C' },
        { code: '9I' },
        { code: '9G' },
        { code: '9H' },
        { code: '9M' },
        { code: '9K' },
        { code: '9L' },
        { code: '9F' }
      ];

    }

    if (undNegocio == 'BATH AND BODY WORKS') {
      this.onDataView = [];
      this.onReporteList = [];
      this.compTiendaList = [];
      this.nameExcel = "bbw";
      this.headList = ['Preferencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Talla', 'Color', 'BBW JK', 'BBW ARQ', 'BBW RAMB', 'BBW SM', 'BBW SLV', 'BW ECOM', 'BBW ASIA']
      let codeTiendas = [
        { code: '7A' },
        { code: '7J' },
        { code: '7E' },
        { code: '7C' },
        { code: '7D' },
        { code: '7F' },
        { code: '7A7' }
      ];
      codeTiendas.filter((tienda) => {

        let index = storeConxOnline.findIndex((codeCnx) => codeCnx == tienda.code);

        if (index > -1) {
          this.compTiendaList.push(tienda.code);
        }
      });

      this.tiendasPetition = [
        { code: '7A' },
        { code: '7J' },
        { code: '7E' },
        { code: '7C' },
        { code: '7D' },
        { code: '7F' },
        { code: '7A7' }
      ];
    }
  };

  onStockTable() {
    this.onDataView = [];
    this.onReporteList = [];
    this.proccessData = [];
    this.isLoading = true;
    this.onProcessPetition(this.selectedUS);
    this.socket.emit('comunicationStockTable', this.tiendasPetition);
  }



}


