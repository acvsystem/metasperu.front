import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ShareService } from '../../services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-articulos',
  templateUrl: './mt-articulos.component.html',
  styleUrls: ['./mt-articulos.component.scss'],
})
export class MtArticulosComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  displayedColumns: string[] = ['codigoBarra', 'referencia', 'descripcion', 'departamento', 'seccion', 'familia', 'subfamilia', 'temporada', 'talla', 'color'];
  headList = ['Referencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Familia', 'SubFamilia', 'Temporada', 'Talla', 'Color', 'Familia', 'SubFamilia'];
  headListTienda = ['Tienda', 'Procesar', 'Procesado', 'Estado'];
  onReporteList: Array<any> = [];
  onDataView: Array<any> = [];
  filterProducto: string = "";
  dataSource = new MatTableDataSource<any>(this.onDataView);
  onListPagination: Array<any> = [];
  vPageActualTable: number = 1;
  vPageAnteriorTable: number = 0;
  vNumPaginas: number = 0;
  isLoading: boolean = false;
  isProccess: boolean = false;
  isError: boolean = false;
  nameExcel: string = "";
  selectedEmail: string = "";
  barcode: string = "";
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
    { key: '7A7', value: 'BBW ASIA', progress: -1, checked: false },
    { key: '9P', value: 'VS MALL PLAZA', progress: -1, checked: false },
    { key: '7I', value: 'BB MALL PLAZA', progress: -1, checked: false }
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
    { code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { code: '9P', name: 'VS MALL PLAZA', procesar: 0, procesado: -1 },
    { code: '7I', name: 'BB MALL PLAZA', procesar: 0, procesado: -1 }
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
  isVendedor: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: ShareService, private store: StorageService) { }

  ngOnInit() {
    let configuracion = {
      socket: '',
      centroCosto: 'VS',
      fechInit: '2023-05-01',
      fechEnd: '2023-05-10'
    }

    this.socket.on('consultAsistencia', (configuracion) => {

    });

    this.socket.on('responseAsistencia', (configuracion) => {
      
    });

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

    let profileUser = this.store.getStore('mt-profile');
    if (((profileUser || {}).mt_nivel == "VSBA" || (profileUser || {}).mt_nivel == "BBW" || (profileUser || {}).code.length) && (profileUser || {}).code != 'OF') {
      this.isVendedor = true;

      let profileUser = this.store.getStore('mt-profile');

      let codeTiendasVs = [
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
        { code: '9F' },
        { code: '9P' }
      ];

      let codeTiendasBBW = [
        { code: '7A' },
        { code: '7J' },
        { code: '7E' },
        { code: '7C' },
        { code: '7D' },
        { code: '7F' },
        { code: '7A7' },
        { code: '7I' }
      ];

      let undServicio = "";

      let indexVS = (codeTiendasVs || []).find((tienda) => tienda.code == (profileUser || {}).code);
   
      if (Object.keys(indexVS || {}).length) {
        undServicio = 'VICTORIA SECRET';
      }

      let indexBBW = (codeTiendasBBW || []).find((tienda) => tienda.code == (profileUser || {}).code);

      if (Object.keys(indexBBW || {}).length) {
        undServicio = 'BATH AND BODY WORKS';
      }


      this.selectedUS = undServicio;
      this.onProcessPetition(undServicio);
    }




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

    });

  }

  onViewDataTable(pageAnt, pageAct) {
    const self = this;
    self.onDataView = [];

    self.onDataView = self.onReporteList;

    this.dataSource = new MatTableDataSource(this.onDataView);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    // self.vPageAnteriorTable = pageAnt;
    //self.vPageActualTable = pageAct;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onProcessData(dataInventario) {

    return new Promise((resolve, reject) => {
      const self = this;

      let codigoTienda = (dataInventario || [])[0].cCodigoTienda;

      let dataResponse = [];
      let dataProcess = [];
      let dataServer = dataInventario;

      let tiendasList = [
        { code: '7A', property_r: 'BBW_JOC', property: 'bbw_jockey', ready: false },
        { code: '9N', property_r: 'VS_AQP', property: 'vs_m_aventura', ready: false },
        { code: '7J', property_r: 'BBW_AQP', property: 'bbw_m_aventura', ready: false },
        { code: '7E', property_r: 'BBW_LRB', property: 'bbw_rambla', ready: false },
        { code: '9D', property_r: 'VS_LRB', property: 'vs_rambla', ready: false },
        { code: '9B', property_r: 'VS_PN', property: 'vs_p_norte', ready: false },
        { code: '7C', property_r: 'BBW_PSM', property: 'bbw_s_miguel', ready: false },
        { code: '9C', property_r: 'VS_PSM', property: 'vs_s_miguel', ready: false },
        { code: '7D', property_r: 'BBW_RPS', property: 'bbw_salaverry', ready: false },
        { code: '9I', property_r: 'VS_RPS', property: 'vs_salaverry', ready: false },
        { code: '9G', property_r: 'VS_MDS', property: 'vs_m_sur', ready: false },
        { code: '9H', property_r: 'VS_PUR', property: 'vs_puruchuco', ready: false },
        { code: '9M', property_r: 'VS_ECOM', property: 'vs_ecom', ready: false },
        { code: '7F', property_r: 'BBW_ECOM', property: 'bbw_ecom', ready: false },
        { code: '9K', property_r: 'VS_MEP', property: 'vs_m_plaza', ready: false },
        { code: '9L', property_r: 'VS_MNK', property: 'vs_minka', ready: false },
        { code: '9F', property_r: 'VSFA_JOC', property: 'vs_full', ready: false },
        { code: '7A7', property_r: 'BBW_ASIA', property: 'bbw_asia', ready: false },
        { code: '9P', property_r: 'VS_M_PLAZA', property: 'vs_mall_plaza', ready: false },
        { code: '7I', property_r: 'BBW_M_PLAZA', property: 'bbw_m_plaza', ready: false }
      ];


      dataProcess = dataServer;
      let indexTienda = tiendasList.findIndex((property) => (property || {}).code == codigoTienda);
      self.onListTiendas[indexTienda]['procesar'] = dataInventario.length;
      let profileUser = this.store.getStore('mt-profile');
      let undServicio = (profileUser || {}).mt_nivel == "VSBA" ? 'VICTORIA SECRET' : (profileUser || {}).mt_nivel == "BBW" ? 'BATH AND BODY WORKS' : '';

      (dataProcess || []).filter((data, i) => {
        let index = self.onReporteList.findIndex((res) => ((res || {}).cCodigoBarra == (data || {}).cCodigoBarra));
        let codigoExist = (data || {}).cCodigoTienda;
        if (index != -1) {
          let valueSock = tiendasList.find((property) => (property || {}).code == codigoExist);
          let indexProductoExist = self.onReporteList.findIndex((articulo) => (articulo || {}).cCodigoBarra == (data || {}).cCodigoBarra);
          self.onReporteList[indexProductoExist][(valueSock || {}).property_r] = (data || {})[(valueSock || {}).property];
          self.onReporteList[indexProductoExist]['cTemporada'] = (data || {})['cTemporada'] != "" || (data || {})['cTemporada'] != null || (data || {})['cTemporada'] != 'null' ? (data || {})['cTemporada'] : self.onReporteList[indexProductoExist]['cTemporada'];

          //if (this.isVendedor) {
          self.onReporteList[indexProductoExist]["cReferencia"] = ((data || {})['cReferencia'] || "").length ? (data || {})['cReferencia'] : self.onReporteList[indexProductoExist]['cReferencia'];
          self.onReporteList[indexProductoExist]["cDescripcion"] = ((data || {})['cDescripcion'] || "").length ? (data || {})['cDescripcion'] : self.onReporteList[indexProductoExist]['cDescripcion'];
          self.onReporteList[indexProductoExist]["cDepartamento"] = ((data || {})['cDepartamento'] || "").length ? (data || {})['cDepartamento'] : self.onReporteList[indexProductoExist]['cDepartamento'];
          self.onReporteList[indexProductoExist]["cSeccion"] = ((data || {})['cSeccion'] || "").length ? (data || {})['cSeccion'] : self.onReporteList[indexProductoExist]['cSeccion'];
          self.onReporteList[indexProductoExist]["cFamilia"] = ((data || {})['cFamilia'] || "").length ? (data || {})['cFamilia'] : self.onReporteList[indexProductoExist]['cFamilia'];
          self.onReporteList[indexProductoExist]["cSubFamilia"] = ((data || {})['cSubFamilia'] || "").length ? (data || {})['cSubFamilia'] : self.onReporteList[indexProductoExist]['cSubFamilia'];
          self.onReporteList[indexProductoExist]["cTalla"] = ((data || {})['cTalla'] || "").length ? (data || {})['cTalla'] : self.onReporteList[indexProductoExist]['cTalla'];
          self.onReporteList[indexProductoExist]["cColor"] = ((data || {})['cColor'] || "").length ? (data || {})['cColor'] : self.onReporteList[indexProductoExist]['cColor'];
          self.onReporteList[indexProductoExist]["cColor"] = ((data || {})['cColor'] || "").length ? (data || {})['cColor'] : self.onReporteList[indexProductoExist]['cColor'];

          // }

        } else {

          if (this.selectedUS == 'VICTORIA SECRET' || undServicio == 'VICTORIA SECRET') {
            self.onReporteList.push({
              "cCodigoBarra": (data || {}).cCodigoBarra,
              "cReferencia": (data || {}).cReferencia || "",
              "cDescripcion": (data || {}).cDescripcion || "",
              "cDepartamento": (data || {}).cDepartamento || "",
              "cSeccion": (data || {}).cSeccion || "",
              "cFamilia": (data || {}).cFamilia || "",
              "cSubFamilia": (data || {}).cSubFamilia || "",
              "cTemporada": (data || {}).cTemporada || "",
              "cTalla": (data || {}).cTalla || "",
              "cColor": (data || {}).cColor || "",
              "VS_AQP": this.onEvalDesconection('9N', (data || {}).vs_m_aventura || 0),
              "VS_LRB": this.onEvalDesconection('9D', (data || {}).vs_rambla || 0),
              "VS_PN": this.onEvalDesconection('9B', (data || {}).vs_p_norte || 0),
              "VS_PSM": this.onEvalDesconection('9C', (data || {}).vs_s_miguel || 0),
              "VS_RPS": this.onEvalDesconection('9I', (data || {}).vs_s_miguel || 0),
              "VS_MDS": this.onEvalDesconection('9G', (data || {}).vs_m_sur || 0),
              "VS_PUR": this.onEvalDesconection('9H', (data || {}).vs_puruchuco || 0),
              "VS_ECOM": this.onEvalDesconection('9M', (data || {}).vs_ecom || 0),
              "VS_MEP": this.onEvalDesconection('9K', (data || {}).vs_m_plaza || 0),
              "VS_MNK": this.onEvalDesconection('9L', (data || {}).vs_minka || 0),
              "VSFA_JOC": this.onEvalDesconection('9F', (data || {}).vs_full || 0),
              "VS_M_PLAZA": this.onEvalDesconection('9P', (data || {}).vs_mall_plaza || 0)
            });
          }
          if (this.selectedUS == 'BATH AND BODY WORKS' || undServicio == 'BATH AND BODY WORKS') {
            self.onReporteList.push({
              "cCodigoBarra": (data || {}).cCodigoBarra || "",
              "cReferencia": (data || {}).cReferencia || "",
              "cDescripcion": (data || {}).cDescripcion || "",
              "cDepartamento": (data || {}).cDepartamento || "",
              "cSeccion": (data || {}).cSeccion || "",
              "cFamilia": (data || {}).cFamilia || "",
              "cSubFamilia": (data || {}).cSubFamilia || "",
              "cTemporada": (data || {}).cTemporada || "",
              "cTalla": (data || {}).cTalla || "",
              "cColor": (data || {}).cColor || "",
              "BBW_JOC": this.onEvalDesconection('7A', (data || {}).bbw_jockey || 0),
              "BBW_AQP": this.onEvalDesconection('7J', (data || {}).bbw_m_aventura || 0),
              "BBW_LRB": this.onEvalDesconection('7E', (data || {}).bbw_rambla || 0),
              "BBW_PSM": this.onEvalDesconection('7C', (data || {}).bbw_s_miguel || 0),
              "BBW_RPS": this.onEvalDesconection('7D', (data || {}).bbw_salaverry || 0),
              "BBW_ECOM": this.onEvalDesconection('7F', (data || {}).bbw_ecom || 0),
              "BBW_ASIA": this.onEvalDesconection('7A7', (data || {}).bbw_asia || 0),
              "BBW_M_PLAZA": this.onEvalDesconection('7I', (data || {}).bbw_m_plaza || 0)
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

  onEvalDesconection(codigo, value) {

    let storeConxOnline = this.store.getStore('conx_online');
    let online = false;
    let index = storeConxOnline.findIndex((codeCnx) => codeCnx == codigo);
    if (index > -1) {
      online = true;
    }

    return !online ? 'S/C' : value;

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
      this.headList = ['Codigo Barra', 'Referencia', 'Descripcion', 'Departamento', 'Seccion', 'Familia', 'SubFamilia', 'Temporada', 'Talla', 'Color', 'VS-AQP', 'VS-LRB', 'VS-PN', 'VS-PSM', 'VS-RPS', 'VS-MDS', 'VS-PUR', 'VS-ECOM', 'VS-MEP', 'VS-MNK', 'VSFA-JOC', 'VS-MPTRU'];
      this.displayedColumns = ['codigoBarra', 'referencia', 'descripcion', 'departamento', 'seccion', 'familia', 'subfamilia', 'temporada', 'talla', 'color', 'vs_aqp', 'vs_lrb', 'vs_pn', 'vs_psm', 'vs_rps', 'vs_mds', 'vs_pur', 'vs_ecom', 'vs_mep', 'vs_mnk', 'vsfa_joc', 'vs_mptru'];
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
        { code: '9F' },
        { code: '9P' }
      ];

      codeTiendas.filter((tienda) => {

        let index = storeConxOnline.findIndex((codeCnx) => codeCnx == tienda.code);
        if (index > -1) {
          this.compTiendaList.push({ code: tienda.code });
        }
      });

      this.tiendasPetition = this.tiendasPetition = this.compTiendaList;

    }

    if (undNegocio == 'BATH AND BODY WORKS') {
      this.onDataView = [];
      this.onReporteList = [];
      this.compTiendaList = [];
      this.nameExcel = "bbw";
      this.headList = ['Codigo Barra', 'Referencia', 'Descripcion', 'Departamento', 'Seccion', 'Familia', 'SubFamilia', 'Temporada', 'Talla', 'Color', 'BBW-JOC', 'BBW-AQP', 'BBW-LRB', 'BBW-PSM', 'BBW-RPS', 'BBW-ECOM', 'BBW ASIA', 'BBW-MPTRU']
      this.displayedColumns = ['codigoBarra', 'referencia', 'descripcion', 'departamento', 'seccion', 'familia', 'subfamilia', 'temporada', 'talla', 'color', 'bbw_joc', 'bbw_aqp', 'bbw_lrb', 'bbw_psm', 'bbw_rps', 'bbw_ecom', 'bbw_asia', 'bbw_mptru'];

      let codeTiendas = [
        { code: '7A' },
        { code: '7J' },
        { code: '7E' },
        { code: '7C' },
        { code: '7D' },
        { code: '7F' },
        { code: '7A7' },
        { code: '7I' }
      ];

      codeTiendas.filter((tienda) => {

        let index = storeConxOnline.findIndex((codeCnx) => codeCnx == tienda.code);
        if (index > -1) {
          this.compTiendaList.push({ code: tienda.code });
        }
      });

      this.tiendasPetition = this.compTiendaList;
    }
  };

  onStockTable() {
    if (this.barcode.length || this.selectedUS.length) {
      this.onDataView = [];
      this.onReporteList = [];
      this.proccessData = [];
      this.isLoading = true;

      if (!this.isVendedor) {
        this.onProcessPetition(this.selectedUS);
      } else {
        let profileUser = this.store.getStore('mt-profile');

        let codeTiendasVs = [
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
          { code: '9F' },
          { code: '9P' }
        ];

        let codeTiendasBBW = [
          { code: '7A' },
          { code: '7J' },
          { code: '7E' },
          { code: '7C' },
          { code: '7D' },
          { code: '7F' },
          { code: '7A7' },
          { code: '7I' }
        ];

        let undServicio = "";

        let indexVS = (codeTiendasVs || []).find((tienda) => tienda.code == (profileUser || {}).code);

        if (Object.keys(indexVS || {}).length) {
          undServicio = 'VICTORIA SECRET';
        }

        let indexBBW = (codeTiendasBBW || []).find((tienda) => tienda.code == (profileUser || {}).code);

        if (Object.keys(indexBBW || {}).length) {
          undServicio = 'BATH AND BODY WORKS';
        }


        this.onProcessPetition(undServicio);
      }

      if ((this.barcode || "").length) {

        this.socket.emit('comunicationStockTable', this.tiendasPetition, this.barcode);
      } else {
        this.socket.emit('comunicationStockTable', this.tiendasPetition, "");
      }



    }
  }

  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
    if (index == 'barcode' && this[index].length > 11) {
      this.onStockTable();
    }
  }





}
