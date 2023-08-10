import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from '../../services/shareService';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'mt-control-asistencia',
  templateUrl: './mt-control-asistencia.component.html',
  styleUrls: ['./mt-control-asistencia.component.scss'],
})
export class MtControlAsistenciaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator_timerList: MatPaginator;

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
    { key: 'exportFeriado', value: 'Reporte Feriados' },
    { key: 'exportAsistencia', value: 'Reporte Asistencia' }
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
  displayedColumns: string[] = ['Nombre completo', 'Documento', 'Fecha', 'Hora Ingreso', 'Hora Salida', 'Horas Trabajadas'];
  tipoTableView: string = "allList";
  displayedColumnsTimerList: string[] = ['Nombre completo', 'Documento', 'Fecha', 'Hora Ingreso', 'H.S.B', 'H.I.B', 'Hora Salida', 'H. Trabajadas', 'H. Excedentes', 'H. Faltantes', 'H. Brake'];
  dataTimerList: Array<any> = [];
  dataSource_timeList = new MatTableDataSource<TimerElement>(this.dataTimerList);
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);

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

      this.dataPaginationList = this.dataPaginationList || [];
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);
      this.dataSource.paginator = this.paginator;

      this.onDataTimer();
    });

  }

  onDataTimer() {
    if (this.tipoTableView == "timerList") {
      let documentosListAdded = [];
      this.dataTimerList = [];

      this.employeList.filter((ejb) => {
        let hrWorking = 0;
        let nroVentas = 0;
        let ventas = 0;

        (this.dataPaginationList || []).find((emp) => {
          let nombreCompleto = `${(ejb || {}).AP_PATERNO} ${(ejb || {}).AP_MATERNO} ${(ejb || {}).NOM_EMPLEADO}`;
          let hExcedente = 0;
          let hFaltante = 0;

          if (ejb.NRO_DOC == emp.nroDocumento) {

            hrWorking += emp.hrWorking;
            nroVentas += emp.nroVentas;

            if (hrWorking > 8) {
              hExcedente = hrWorking % 8;
            }

            if (hrWorking < 8) {
              hFaltante = 8 - hrWorking;
            }

            ventas += emp.Ventas;

            let index = this.reporteList.findIndex((report) => report.DOCUMENTO == emp.nroDocumento && report.FECHA == emp.dia);

            if (index != -1) {
              let hora_1 = parseInt(this.reporteList[index]['H.S.B'].split(":")[0]) * 60 + parseInt(this.reporteList[index]['H.S.B'].split(":")[1]);
              let hora_2 = parseInt(emp.hrIn.split(":")[0]) * 60 + parseInt(emp.hrIn.split(":")[1]);

              ((this.reporteList || [])[index] || {})['H.I.B'] = emp.hrIn;
              ((this.reporteList || [])[index] || {})['H.SALIDA'] = emp.hrOut;
              ((this.reporteList || [])[index] || {})['H.TRABAJADAS'] = hrWorking.toFixed(2);
              ((this.reporteList || [])[index] || {})['NRO.VENTAS'] = nroVentas.toFixed(2);
              ((this.reporteList || [])[index] || {})['VENTAS'] = ventas.toFixed(2);
              ((this.reporteList || [])[index] || {})['H.EXCEDENTES'] = hExcedente.toFixed(2);
              ((this.reporteList || [])[index] || {})['H.FALTANTES'] = hFaltante.toFixed(2);
              ((this.reporteList || [])[index] || {})['H.BRAKE'] = (hora_2 - hora_1) / 60;

              ((this.dataTimerList || [])[index] || {})['hib'] = emp.hrIn;
              ((this.dataTimerList || [])[index] || {})['hSalida'] = emp.hrOut;
              ((this.dataTimerList || [])[index] || {})['hTrabajadas'] = hrWorking.toFixed(2);
              ((this.dataTimerList || [])[index] || {})['nroVentas'] = nroVentas.toFixed(2);
              ((this.dataTimerList || [])[index] || {})['ventas'] = ventas.toFixed(2);
              ((this.dataTimerList || [])[index] || {})['hExcedente'] = hExcedente.toFixed(2);
              ((this.dataTimerList || [])[index] || {})['hFaltantes'] = hFaltante.toFixed(2);
              ((this.dataTimerList || [])[index] || {})['hBrake'] = (hora_2 - hora_1) / 60;
            }

            let addedEmp = documentosListAdded.filter((added) => added.dni == emp.nroDocumento && added.fecha == (emp || {}).dia);

            if (ejb.NRO_DOC == emp.nroDocumento && !addedEmp.length) {
              let asist = (this.dateCalendarList || []).indexOf((emp || {}).dia);
              (documentosListAdded || []).push({ dni: emp.nroDocumento, fecha: (emp || {}).dia });
              if (asist !== -1) {
                this.dataTimerList.push({ 'nomEmpleado': nombreCompleto, 'documento': emp.nroDocumento, 'fecha': emp.dia, 'hIngreso': emp.hrIn, 'hsb': emp.hrOut, 'hib': '', 'hSalida': '', 'hTrabajadas': hrWorking.toFixed(2), 'hExcedente': hExcedente.toFixed(2), 'hFaltantes': hFaltante.toFixed(2), 'hBrake': 0 });
                this.reporteList.push({ 'EMPLEADO': nombreCompleto, 'DOCUMENTO': emp.nroDocumento, 'FECHA': emp.dia, 'H.INGRESO': emp.hrIn, 'H.S.B': emp.hrOut, 'H.I.B': '', 'H.SALIDA': '', 'H.TRABAJADAS': hrWorking.toFixed(2), 'H.EXCEDENTES': hExcedente.toFixed(2), 'H.FALTANTES': hFaltante.toFixed(2), 'H.BRAKE': 0 });
              }
            }

          }
        });

      });
      this.dataSource_timeList = new MatTableDataSource<TimerElement>(this.dataTimerList);
      this.dataSource_timeList.paginator = this.paginator_timerList;
    }
  }

  viewModal: any = -1;
  onViewSearchModal(index) {
    this.viewModal = this.viewModal == index ? -1 : index;
  }

  searchData() {

    let body = [];

    if (this.searchFecInicio.length && this.searchFecFin.length) {
      body.push(
        {
          centroCosto: this.lstCentroCosto,
          date_1: this.searchFecInicio,
          date_2: this.searchFecFin
        }
      );
    }

    if (this.lstCentroCosto.length && (this.dateCalendarList || []).length && !this.searchFecInicio.length && !this.searchFecFin.length) {
      body.push(
        {
          centroCosto: this.lstCentroCosto,
          dateList: this.dateCalendarList
        }
      );
    }

    console.log(body);
    if ((this.lstCentroCosto.length && (this.dateCalendarList || []).length) || (this.searchFecInicio.length && this.searchFecFin.length)) {
      let parms = {
        url: '/control-asistencia',
        body: body
      };

      this.service.post(parms).then((response) => {
      });
    }

  }


  onEmpleadoList() {

    let parms = {
      url: '/rrhh/search/empleado'
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];

      this.employeList = data || [];
    });
  }

  exportReporte() {
    let selectedOption = this.optionListExport.find((dat) => dat.value == this.functionExport);
    let tipoReporte = (selectedOption || {}).key;
    let dataJson = [];
    let reportName = "";
    let empleadosAsistencia = this.dataPaginationList;
    this.reporteList = [];

    if (tipoReporte == "exportFeriado") {

      let documentosListAdded = [];
      this.employeList.filter((ejb) => {
        let cantFeriado = 0;

        (empleadosAsistencia || []).find((emp) => {
          let addedEmp = documentosListAdded.filter((added) => added.dni == emp.nroDocumento && added.fecha == (emp || {}).dia);

          if (ejb.NRO_DOC == emp.nroDocumento && !addedEmp.length) {
            let asist = (this.dateCalendarList || []).indexOf((emp || {}).dia);
            (documentosListAdded || []).push({ dni: emp.nroDocumento, fecha: (emp || {}).dia });
            if (asist !== -1) {
              cantFeriado += 1;
            }
          }
        });

        let nombreCompleto = `${(ejb || {}).AP_PATERNO} ${(ejb || {}).AP_MATERNO} ${(ejb || {}).NOM_EMPLEADO}`;

        this.reporteList.push({ 'PERIODO': this.lstPeriodo, 'CODIGO': (ejb || {}).CODIGO_EJB, 'TRABAJADOR': nombreCompleto, 'DIA-NOC': '', 'TAR-DIU': '', 'HOR-LAC': '', 'HED-25%': '', 'HED-35%': '', 'HED-50%': '', 'HED-100': '', 'HSI-MPL': '', 'DES-LAB': '', 'DIA-FER': cantFeriado, 'DIA-SUM': '', 'DIA-RES': '', 'PER-HOR': '' });

      });
    }

    if (tipoReporte == "exportAsistencia") {
      let documentosListAdded = [];

      this.employeList.filter((ejb) => {
        let hrWorking = 0;
        let nroVentas = 0;
        let ventas = 0;

        (this.dataPaginationList || []).find((emp) => {
          let nombreCompleto = `${(ejb || {}).AP_PATERNO} ${(ejb || {}).AP_MATERNO} ${(ejb || {}).NOM_EMPLEADO}`;
          let hExcedente = 0;
          let hFaltante = 0;

          if (ejb.NRO_DOC == emp.nroDocumento) {

            hrWorking += emp.hrWorking;
            nroVentas += emp.nroVentas;

            if (hrWorking > 8) {
              hExcedente = hrWorking % 8;
            }

            if (hrWorking < 8) {
              hFaltante = 8 - hrWorking;
            }

            ventas += emp.Ventas;

            let index = this.reporteList.findIndex((report) => report.DOCUMENTO == emp.nroDocumento && report.FECHA == emp.dia);

            if (index != -1) {
              let hora_1 = parseInt(this.reporteList[index]['H.S.B'].split(":")[0]) * 60 + parseInt(this.reporteList[index]['H.S.B'].split(":")[1]);
              let hora_2 = parseInt(emp.hrIn.split(":")[0]) * 60 + parseInt(emp.hrIn.split(":")[1]);

              ((this.reporteList || [])[index] || {})['H.I.B'] = emp.hrIn;
              ((this.reporteList || [])[index] || {})['H.SALIDA'] = emp.hrOut;
              ((this.reporteList || [])[index] || {})['H.TRABAJADAS'] = hrWorking.toFixed(2);
              ((this.reporteList || [])[index] || {})['NRO.VENTAS'] = nroVentas;
              ((this.reporteList || [])[index] || {})['VENTAS'] = ventas;
              ((this.reporteList || [])[index] || {})['H.EXCEDENTES'] = hExcedente.toFixed(2);
              ((this.reporteList || [])[index] || {})['H.FALTANTES'] = hFaltante.toFixed(2);
              ((this.reporteList || [])[index] || {})['H.BRAKE'] = (hora_2 - hora_1) / 60;
            }

            let addedEmp = documentosListAdded.filter((added) => added.dni == emp.nroDocumento && added.fecha == (emp || {}).dia);

            if (ejb.NRO_DOC == emp.nroDocumento && !addedEmp.length) {
              let asist = (this.dateCalendarList || []).indexOf((emp || {}).dia);
              (documentosListAdded || []).push({ dni: emp.nroDocumento, fecha: (emp || {}).dia });
              if (asist !== -1) {
                this.reporteList.push({ 'EMPLEADO': nombreCompleto, 'DOCUMENTO': emp.nroDocumento, 'FECHA': emp.dia, 'H.INGRESO': emp.hrIn, 'H.S.B': emp.hrOut, 'H.I.B': '', 'H.SALIDA': '', 'H.TRABAJADAS': hrWorking, 'H.EXCEDENTES': hExcedente, 'H.FALTANTES': hFaltante, 'H.BRAKE': 0 });
              }
            }

          }
        });

      });
    }

    dataJson = this.reporteList || [];
   
    reportName = 'metasPeru';

    if (tipoReporte == "exportFeriado" && dataJson.length && this.lstPeriodo) {
      this.exportToExcel(dataJson, reportName);
    }

    if (tipoReporte == "exportAsistencia" && dataJson.length) {
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

    if (ev.id == "mt-input-init" || ev.id == "mt-input-end") {
      this.dateCalendarList = [];

      this.searchFecInicio = (!this.searchFecInicio.length) ? ev.id == "mt-input-init" ? ev.value : "" : this.searchFecInicio;
      this.searchFecFin = (!this.searchFecFin.length) ? ev.id == "mt-input-end" ? ev.value : "" : this.searchFecFin;
    }

    if (!this.searchFecInicio.length && !this.searchFecFin.length) {
      this.dateCalendarList = ev.dateList;
    }

  }

  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.tipoTableView == "timerList") {
      this.dataSource_timeList.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  }

  onChangeTableView(ev) {
    this.tipoTableView = ev;
  }

}

export interface PeriodicElement {
  nombreCompleto: string;
  nroDocumento: string;
  dia: string;
  hrIn: string;
  hrOut: string;
  nroVentas: number;
  Ventas: number;
  hrWorking: string;
}

export interface TimerElement {
  nomEmpleado: string;
  documento: string;
  fecha: string;
  hIngreso: string;
  hsb: string;
  hib: string;
  hSalida: string;
  hTrabajadas: string;
  hExcedente: string;
  hFaltantes: string;
  hBrake: number;
  nroVentas: number;
  ventas: number;
}
