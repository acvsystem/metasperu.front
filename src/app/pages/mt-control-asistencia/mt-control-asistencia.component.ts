import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from '../../services/shareService';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MtChartDialogComponent } from '../../components/mt-chart-dialog/mt-chart-dialog.component';

@Component({
  selector: 'mt-control-asistencia',
  templateUrl: './mt-control-asistencia.component.html',
  styleUrls: ['./mt-control-asistencia.component.scss'],
})
export class MtControlAsistenciaComponent implements OnInit {

  @ViewChild('MatPaginator_1') paginator: MatPaginator;
  @ViewChild('MatPaginator_2') paginator_timerList: MatPaginator;

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

  chartData: Array<any> = [];

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
    { key: 'consulta', value: 'Consulta' },
    { key: 'exportFeriado', value: 'Reporte Feriados' },
    { key: 'exportAsistencia', value: 'Reporte Asistencia' }
  ];

  optionListMarca: Array<any> = [
    { key: 'BBW', value: 'BBW' },
    { key: 'VS', value: 'VS' },
    { key: 'AEO', value: 'AEO' },
    { key: 'VSFA', value: 'VSFA' }
  ];

  reporteList: Array<any> = [];
  reporteFaltante: Array<any> = [];
  employeList: Array<any> = [];
  dateCalendarList: Array<any> = [];
  displayedColumns: string[] = ['Nombre completo', 'Documento', 'Fecha', 'Hora Ingreso', 'H.S.B', 'H.I.B', 'Hora Salida', 'H. Trabajadas', 'H. Excedentes', 'H. Faltantes', 'H. Break'];

  tipoTableView: string = "allList";
  displayedColumnsTimerList: string[] = ['Nombre completo', 'Documento', 'H. Trabajadas', 'H. Excedentes', 'H. Faltantes', 'Accion'];
  dataTimerList: Array<any> = [];
  dataSource_timeList = new MatTableDataSource<TimerElement>(this.dataTimerList);
  dataSource = new MatTableDataSource<TimerElement>(this.dataTimerList);
  isLoadingResults: boolean = false;

  isReportForDay = true;
  isReportTotal = false;
  isReporRgDate = false;
  isReportFeriado = false;

  constructor(private service: ShareService, private dialog: MatDialog) { }

  ngOnInit() {
    const self = this;
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

      console.log("socket-sendControlAsistencia", asistencia);

      this.dataPaginationList = asistencia;

      if (this.dataPaginationList.length) {
        this.isLoadingResults = false;
      }

      this.dataSource = new MatTableDataSource<TimerElement>(this.dataPaginationList);
      this.dataSource.paginator = this.paginator;
    });

  }

  openDialog(nroDocumento) {
    let hrWorking = 0;
    this.chartData = [];
    this.dataPaginationList.filter((data) => {

      if (data.nroDocumento == nroDocumento) {

        hrWorking += Math.round(parseFloat(data.hrWorking.toFixed(2)));

        let index = this.chartData.findIndex((chart) => chart.name == data.dia);

        if (index != -1) {
          (this.chartData[index] || {}).value = hrWorking;
          hrWorking = 0;
        } else {
          this.chartData.push({ name: (data || {}).dia, value: hrWorking });
        }
      }
    })

    const dialogRef = this.dialog.open(MtChartDialogComponent, {
      data: this.chartData,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  viewModal: any = -1;
  onViewSearchModal(index) {
    this.viewModal = this.viewModal == index ? -1 : index;
  }


  searchData() {
    const self = this;
    let body = [];
    let centroCostoList = this.optionListMarca || [];
    let selectedOption = this.optionListExport.find((dat) => dat.value == this.functionExport);
    let tipoReporte = (selectedOption || {}).key;
    this.dataPaginationList = [];
    this.isLoadingResults = true;

    body.push(
      {
        "isReportForDay": this.isReportForDay,
        "isReportTotal": this.isReportTotal,
        "isReporRgDate": this.isReporRgDate,
        "isReportFeriado" : this.isReportFeriado,
        "centroCosto": this.lstCentroCosto,
        "dateList": this.dateCalendarList
      }
    );

    this.socket.emit('emitRRHH', body);

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
    let dataJson;
    let reportName = "";
    let empleadosAsistencia = this.dataPaginationList;

    this.reporteList = [];

     if (this.isReportFeriado) {
 
       let documentosListAdded = [];
       this.employeList.filter((ejb) => {
         let cantFeriado = 0;
 
         (empleadosAsistencia || []).find((emp) => {
           let addedEmp = documentosListAdded.filter((added) => added.dni == emp.documento && added.fecha == (emp || {}).fecha);
 
           if (ejb.NRO_DOC == emp.documento && !addedEmp.length) {
             let asist = (this.dateCalendarList || []).indexOf((emp || {}).fecha);
             (documentosListAdded || []).push({ dni: emp.documento, fecha: (emp || {}).fecha });
             if (asist !== -1) {
               cantFeriado += 1;
             }
           }
         });
 
         let nombreCompleto = `${(ejb || {}).AP_PATERNO} ${(ejb || {}).AP_MATERNO} ${(ejb || {}).NOM_EMPLEADO}`;
 
         this.reporteList.push({ 'PERIODO': this.lstPeriodo, 'CODIGO': (ejb || {}).CODIGO_EJB, 'TRABAJADOR': nombreCompleto, 'DIA-NOC': '', 'TAR-DIU': '', 'HOR-LAC': '', 'HED-25%': '', 'HED-35%': '', 'HED-50%': '', 'HED-100': '', 'HSI-MPL': '', 'DES-LAB': '', 'DIA-FER': cantFeriado, 'DIA-SUM': '', 'DIA-RES': '', 'PER-HOR': '' });
 
       });
     }

    dataJson = this.dataPaginationList || [];

    reportName = 'metasPeru';


    if (this.isReportFeriado && dataJson.length && this.lstPeriodo) {
      this.exportToExcel(this.reporteList, reportName);
    }

    if (this.isReportFeriado && dataJson.length && !this.lstPeriodo) {
      let notificationList = [{
        isCaution: true,
        bodyNotification: "Inserte el periodo del reporte."
      }];
      this.service.onNotification.emit(notificationList);
    }


    if (!this.isReportFeriado && dataJson.length) {
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
    //console.log("onDateCalendar", ev);
    if (ev.id == "mt-input-init" || ev.id == "mt-input-end") {
      this.dateCalendarList = [];

      this.searchFecInicio = (ev.value != this.searchFecInicio && ev.id == "mt-input-init") ? ev.value : this.searchFecInicio;
      this.searchFecFin = (ev.value != this.searchFecFin && ev.id == "mt-input-end") ? ev.value : this.searchFecFin;
      this.dateCalendarList = [this.searchFecInicio, this.searchFecFin];
      this.isReporRgDate = true;
    } else {
      this.searchFecInicio = "";
      this.searchFecFin = "";
    }

    if (!this.searchFecInicio.length && !this.searchFecFin.length) {
      this.dateCalendarList = ev.dateList;
      this.isReporRgDate = false;
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

  onOptionTipoReport(ev) {
    if (ev == "isReportForDay") {
      this.isReportForDay = true;
      this.isReportTotal = false;
      this.isReportFeriado = false;
    }

    if (ev == "isReportTotal") {
      this.isReportForDay = false;
      this.isReportTotal = true;
      this.isReportFeriado = false;
    }

    if (ev == "isReportFeriado") {
      this.isReportFeriado = true;
      this.isReportForDay = true;
    }
  }


}

export interface PeriodicElement {
  nombreCompleto: string;
  nroDocumento: string;
  dia: string;
  hrIn: string;
  hrOut: string;
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
  hBreak: number;
}
