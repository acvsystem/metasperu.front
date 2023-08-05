import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from '../../services/shareService';
import * as XLSX from 'xlsx';

@Component({
  selector: 'mt-control-asistencia',
  templateUrl: './mt-control-asistencia.component.html',
  styleUrls: ['./mt-control-asistencia.component.scss'],
})
export class MtControlAsistenciaComponent implements OnInit {
  token: any = localStorage.getItem('tn');
  socket = io('http://159.65.226.239:4200', { query: { code: 'app', token: this.token } });
  bodyList: Array<any> = [];
  headList: Array<any> = [];
  dataPaginationList: Array<any> = [];
  indexPageList: Array<any> = [];
  cantPagination: any = 0;
  actualIndexPage: any = 0;
  viewLengthRegister: any = 20;
  isPopoverSearch: boolean = false;
  searchEmpleado: string = "";
  searchFecInicio: string = "";
  searchFecFin: string = "";
  searchTienda: string = "";
  functionExport: string = "";

  exlabFecInicio: string = "";
  exlabCulmino: string = "";
  lstCentroCosto: string = "";
  lstPeriodo: string = "";

  optionListTiendas: Array<any> = [
    { key: 'BBW JOCKEY', value: 'BBW JOCKEY' },
    { key: 'VSBA JOCKEY', value: 'VSBA JOCKEY' },
    { key: 'AEO JOCKEY', value: 'AEO JOCKEY' },
    { key: 'AEO ASIA', value: 'AEO ASIA' },
    { key: 'BBW LA RAMBLA', value: 'BBW LA RAMBLA' },
    { key: 'VS LA RAMBLA', value: 'VS LA RAMBLA' },
    { key: 'VS PLAZA NORTE', value: 'VS PLAZA NORTE' },
    { key: 'BBW SAN MIGUEL', value: 'BBW SAN MIGUEL' },
    { key: 'VS SAN MIGUEL', value: 'VS SAN MIGUEL' },
    { key: 'BBW SALAVERRY', value: 'BBW SALAVERRY' },
    { key: 'VS SALAVERRY', value: 'VS SALAVERRY' },
    { key: 'VS MALL DEL SUR', value: 'VS MALL DEL SUR' },
    { key: 'VS PURUCHUCO', value: 'VS PURUCHUCO' },
    { key: 'VS ECOMMERCE', value: 'VS ECOMMERCE' },
    { key: 'BBW ECOMMERCE', value: 'BBW ECOMMERCE' },
    { key: 'AEO ECOMMERCE', value: 'AEO ECOMMERCE' },
    { key: 'VS MEGA PLAZA', value: 'VS MEGA PLAZA' },
    { key: 'VS MINKA', value: 'VS MINKA' },
    { key: 'VSFA JOCKEY FULL', value: 'VSFA JOCKEY FULL' },
    { key: 'BBW ASIA', value: 'BBW ASIA' }
  ];

  optionListExport: Array<any> = [
    { key: 'exportVacaciones', value: 'Reporte Feriados' }
  ];

  optionListMarca: Array<any> = [
    { key: 'BBWW', value: 'BBWW' },
    { key: 'VS', value: 'VS' },
    { key: 'AEO', value: 'AEO' },
    { key: 'VSFA', value: 'VSFA' }
  ];

  reporteList: Array<any> = [];
  reporteFaltante: Array<any> = [];
  employeList: Array<any> = [];
  dateCalendarList: Array<any> = [];

  constructor(private service: ShareService) { }

  ngOnInit() {

    this.onEmpleadoList();

    this.headList = [
      {
        value: '#',
        isSearch: false
      },
      {
        value: 'Empleado',
        isSearch: false
      },
      {
        value: 'DNI',
        isSearch: false
      },
      {
        value: 'Dia',
        isSearch: false
      }
    ];

    //this.onPaginationData(1);

    this.socket.on('sendControlAsistencia', (asistencia) => {
      console.log("socket-sendControlAsistencia", JSON.parse(asistencia.serverData));

      let dataReport = (asistencia || {}).serverData || "{}";

      this.dataPaginationList = JSON.parse(dataReport);
    });

  }
  viewModal: any = -1;
  onViewSearchModal(index) {
    this.viewModal = this.viewModal == index ? -1 : index;
  }

  searchData() {

   // if (this.lstCentroCosto.length && this.exlabFecInicio && this.exlabCulmino) {
      let parms = {
        url: '/control-asistencia',
        body: [
          {
            centroCosto: this.lstCentroCosto,
            dateList: this.dateCalendarList
          }
        ]
      };
console.log(parms);
     /* this.service.post(parms).then((response) => {
      });*/
    //}

  }


  onEmpleadoList() {

    let parms = {
      url: '/rrhh/search/empleado'
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];
      console.log(data);
      this.employeList = data || [];
    });
  }

  exportReporte() {
    let selectedOption = this.optionListExport.find((dat) => dat.value == this.functionExport);
    let tipoReporte = (selectedOption || {}).key;
    let dataJson = [];
    let reportName = "";

    let empleadosAsistencia = this.dataPaginationList;

    this.employeList.filter((ejb) => {
      let cantFeriado = 0;
      let empleado = (empleadosAsistencia || []).find((emp) => {
        return (ejb.NRO_DOC == emp.nroDocumento
        );
      });

      if (typeof empleado != 'undefined') {
        cantFeriado = 2;
      }

      let nombreCompleto = `${(ejb || {}).AP_PATERNO} ${(ejb || {}).AP_MATERNO} ${(ejb || {}).NOM_EMPLEADO} `;

      this.reporteList.push({ 'PERIODO': this.lstPeriodo, 'CODIGO': (ejb || {}).CODIGO_EJB, 'TRABAJADOR': nombreCompleto, 'DIA-NOC': '', 'TAR-DIU': '', 'HOR-LAC': '', 'HED-25%': '', 'HED-35%': '', 'HED-50%': '', 'HED-100': '', 'HSI-MPL': '', 'DES-LAB': '', 'DIA-FER': cantFeriado, 'DIA-SUM': '', 'DIA-RES': '', 'PER-HOR': '' });
    });

    dataJson = this.reporteList || [];
    reportName = 'metasPeru';

    if (this.lstPeriodo.length && dataJson.length) {
      this.exportToExcel(dataJson, reportName);
    }

  }


  exportToExcel(data, nameFile): void {
    let name = `${nameFile}.xlsx`;
    let element = data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, name);
  }

  onNextPage() {
    let indexLength = this.actualIndexPage + 1;
    if (indexLength < this.indexPageList.length && this.bodyList.length < this.indexPageList.length) {
      this.actualIndexPage = indexLength;
      this.onPaginationData(this.actualIndexPage * this.viewLengthRegister);
    } else {

      if (indexLength < this.indexPageList.length) {
        this.actualIndexPage = indexLength;
        this.dataPaginationList = this.bodyList[this.actualIndexPage];
      }

    }

  }

  onPreviousPage() {
    if (this.actualIndexPage > 0) {
      this.actualIndexPage = this.actualIndexPage - 1;
      this.dataPaginationList = this.bodyList[this.actualIndexPage];
    }
  }

  onPage(indexPage) {
    this.actualIndexPage = indexPage;

    if (((this.bodyList || [])[indexPage] || []).length) {
      this.dataPaginationList = this.bodyList[indexPage];
    } else {
      this.onPaginationData(indexPage * this.viewLengthRegister);
    }

  }

  onPaginationData(cantActual) {


    let parms = {
      url: '/rrhh/search/asistencia/pagination',
      parms: [
        { key: 'limitPage', value: this.viewLengthRegister },
        { key: 'cantRegister', value: cantActual }
      ]
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];
      if (data.length) {
        this.onInsertData(((response || [])[0] || {}).cant_registros, cantActual, data, false);
      }

    });
  }

  onInsertData(cantRegister, cantActual, data, isFilter) {

    let dataLength = cantRegister;
    var isActionFilter = isFilter;
    let insertPage = 0;

    if (cantActual > 1) {
      insertPage = (cantActual / this.viewLengthRegister);
    }

    this.cantPagination = Math.ceil(dataLength / this.viewLengthRegister);

    if (isActionFilter) {
      this.indexPageList = [];
      this.bodyList = [];
    }
    if (!this.indexPageList.length) {
      for (let i = 1; i <= this.cantPagination; i++) {
        this.indexPageList.push(i);

        if (isActionFilter) {
          let limiteRegister = i * this.viewLengthRegister;

          let initRegister = limiteRegister - this.viewLengthRegister;
          if (limiteRegister == this.viewLengthRegister) {
            initRegister = 0;
          }
          let indexArrow = initRegister / this.viewLengthRegister;
          this.bodyList[indexArrow] = [];
          (data || []).filter((register, j) => {
            if (j > initRegister - 1 && j < limiteRegister) {
              this.bodyList[indexArrow].push(register);
            }
          });
        }
      }
    }

    if (!isActionFilter) {
      this.bodyList[insertPage] = data;
    }

    console.log(this.bodyList);
    this.dataPaginationList = this.bodyList[insertPage];
  }

  onFiltrar() {

    let parametros = [];

    if (this.searchFecInicio.length) {
      parametros.push({ key: 'dateInit', value: this.searchFecInicio });
    }

    if (this.searchFecInicio.length && this.searchFecFin.length) {
      parametros.push({ key: 'dateEnd', value: this.searchFecFin });
    }

    if (this.searchTienda.length) {
      parametros.push({ key: 'dateNomTienda', value: this.searchTienda });
    }

    if (this.searchEmpleado.length) {
      parametros.push({ key: 'dateNomEmp', value: this.searchEmpleado });
    }
    console.log(parametros);
    let parms = {
      url: '/rrhh/search/asistencia',
      parms: parametros
    };

    this.service.get(parms).then((response) => {
      this.onInsertData(((response || [])[0] || {}).data.length, 1, ((response || [])[0] || {}).data, true);
      this.viewModal = -1;
    });


  }

  onClear() {
    this.searchFecInicio = "";
    this.searchFecFin = "";
    this.searchTienda = "";
    this.searchEmpleado = "";
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onDateCalendar(ev) {
    this.dateCalendarList = ev.dateList;
  }

  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

}
