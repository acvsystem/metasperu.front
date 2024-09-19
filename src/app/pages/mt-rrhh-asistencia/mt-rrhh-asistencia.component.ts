import { Component, OnInit, ViewChild } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-rrhh-asistencia',
  templateUrl: './mt-rrhh-asistencia.component.html',
  styleUrls: ['./mt-rrhh-asistencia.component.scss'],
})
export class MtRrhhAsistenciaComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  displayedColumns: string[] = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas'];
  isLoading: boolean = false;
  fechaInicio: string = "";
  parseEJB: Array<any> = [];
  parseHuellero: Array<any> = [];
  onDataView: Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.onDataView);
  onDataExport: Array<any> = [];
  onDataTemp: Array<any> = [];
  onDataParse: Array<any> = [];
  vCalendar: Array<any> = [];
  vMultiSelect: Array<any> = [];
  vCalendarDefault: Array<any> = [];
  vDetallado: Array<any> = [];
  isViewDefault: boolean = true;
  isViewFeriados: boolean = false;
  isDetallado: boolean = false;
  filterEmpleado: string = "";
  onListReporte: Array<any> = [
    { key: 'General', value: 'General' },
    { key: 'Feriados', value: 'Feriados' },
    { key: 'Detallado', value: 'Detallado' }
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


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {

    this.socket.on('reporteHuellero', async (configuracion) => {

      if (configuracion.id == "EJB") {
        console.log("EJB", true);
        let dataEJB = [];
        this.parseEJB = [];
        dataEJB = (configuracion || {}).data || [];

        (dataEJB || []).filter((ejb) => {
          this.parseEJB.push({
            codigoEJB: ((ejb || {}).CODEJB).trim(),
            nombre_completo: `${(ejb || {}).APEPAT} ${(ejb || {}).APEMAT} ${(ejb || {}).NOMBRE}`,
            nro_documento: ((ejb || {}).NUMDOC).trim(),
            telefono: ((ejb || {}).TELEFO).trim(),
            email: ((ejb || {}).EMAIL).trim(),
            fec_nacimiento: ((ejb || {}).FECNAC).trim(),
            fec_ingreso: ((ejb || {}).FECING).trim(),
            status: ((ejb || {}).STATUS).trim()
          });
        });
      }

      if (configuracion.id == "servGeneral") {
        console.log("servGeneral", true);
        let dataServGeneral = [];
        this.parseHuellero = [];
        dataServGeneral = (configuracion || {}).data || [];
        console.log("servGeneral",dataServGeneral);
        (dataServGeneral || []).filter((huellero) => {
          this.parseHuellero.push({
            nro_documento: (huellero || {}).nroDocumento,
            nombre_completo: (huellero || {}).nombreCompleto,
            dia: (huellero || {}).dia,
            hr_ingreso: (huellero || {}).hrIn,
            hr_salida: (huellero || {}).hrOut,
            hr_trabajadas: (huellero || {}).hrWorking,
            caja: (huellero || {}).caja
          });
        });
      }

      
      if (this.parseEJB.length && this.parseHuellero.length) {
        this.onDataTemp = [];

        await (this.parseHuellero || []).filter(async (huellero) => {

          var codigo = (huellero || {}).caja.substr(0, 2);
          var selectedLocal = {};



          if ((huellero || {}).caja.substr(2, 2) == 7) {
            codigo = (huellero || {}).caja;
          } else {
            codigo.substr(0, 1)
          }

          selectedLocal = await this.onListTiendas.find((data) => data.code == codigo) || {};

          let indexData = this.onDataTemp.findIndex((data) => (data || {}).nro_documento == (huellero || {}).nro_documento && ((data || {}).dia == (huellero || []).dia));
          let dataEJB = this.parseEJB.find((ejb) => ejb.nro_documento == (huellero || {}).nro_documento);

          if ((dataEJB || {}).codigoEJB != null) {
            if (indexData == -1) {
              this.onDataTemp.push({
                tienda: (selectedLocal || {})["name"],
                codigoEJB: (dataEJB || {}).codigoEJB,
                nombre_completo: (dataEJB || {}).nombre_completo || "VRF - " + (huellero || {}).nombre_completo,
                nro_documento: (huellero || {}).nro_documento,
                telefono: (dataEJB || {}).telefono,
                email: (dataEJB || {}).email,
                fec_nacimiento: (dataEJB || {}).fec_nacimiento,
                fec_ingreso: (dataEJB || {}).fec_ingreso,
                status: (dataEJB || {}).status,
                dia: (huellero || {}).dia,
                hr_ingreso_1: (huellero || {}).hr_ingreso,
                hr_salida_1: (huellero || {}).hr_salida,
                hr_brake: "",
                hr_ingreso_2: "",
                hr_salida_2: "",
                hr_trabajadas: Math.round((huellero || {}).hr_trabajadas),
                caja: (huellero || {}).caja
              });

            } else {
              this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hr_ingreso);
              this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hr_ingreso;
              this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hr_salida;
              this.onDataTemp[indexData]['hr_trabajadas'] = this.onDataTemp[indexData]['hr_trabajadas'] + Math.round((huellero || {}).hr_trabajadas);
            }
          }

        })

        if (this.isViewDefault) {
          this.onDataView = this.onDataTemp;
          this.dataSource = new MatTableDataSource(this.onDataView);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }

        if (this.isViewFeriados) {
          this.onFiltrarFeriado(this.vMultiSelect);
        }
      }



    });
  }

  onConsultarAsistencia() {

    var configuracion = {
      isDefault: this.isViewDefault,
      isFeriados: this.isViewFeriados,
      isDetallado: this.isDetallado,
      centroCosto: '',
      dateList: (this.isViewDefault) ? this.vCalendarDefault : this.isViewFeriados ? this.vCalendar : this.isDetallado ? this.vDetallado : []
    };
    this.isLoading = true;
    this.socket.emit('consultaMarcacion', configuracion);
  }

  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
    this.onDataView = [];
    this.dataSource = new MatTableDataSource(this.onDataView);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if ((selectData || {}).key == "General") {
      this.isViewDefault = true;
      this.isViewFeriados = false;
      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas'];
    }

    if ((selectData || {}).key == "Feriados") {
      this.isViewFeriados = true;
      this.isViewDefault = false;
      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'cantFeriado', 'hr_trabajadas'];
    }

    if ((selectData || {}).key == "Detallado") {
      this.isViewFeriados = false;
      this.isViewDefault = false;
      this.isDetallado = true;
      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas'];
    }

  }

  async onFiltrarFeriado(dateList) {
    let dateNow = new Date();
    let mesNow = (dateNow.getMonth() + 1).toString();
    let periodo = `${(mesNow.length == 1) ? '0' + mesNow : mesNow}/${dateNow.getFullYear().toString()}`
    let tmpFeriado = [];
    let tmpExport = [];
    let arrFecFeriado = [];

    (dateList || []).filter((dt) => {
      let date = new Date(dt).toLocaleDateString().split('/');
      (arrFecFeriado || []).push(`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`);
    });


    (arrFecFeriado || []).filter(async (feriado) => {
      await (this.onDataTemp || []).filter((data) => {
        if ((data || {}).dia == feriado && ((data || {}).codigoEJB != "" && (data || {}).codigoEJB != null)) {

          let indexTmp = tmpFeriado.findIndex((tmp) => tmp.nro_documento == (data || {}).nro_documento);
          let indexExport = tmpFeriado.findIndex((tmp) => tmp.nro_documento == (data || {}).nro_documento);

          if (indexTmp == -1) {
            tmpFeriado.push({
              tienda: (data || {}).tienda,
              codigoEJB: (data || {}).codigoEJB,
              nombre_completo: (data || {}).nombre_completo,
              nro_documento: (data || {}).nro_documento,
              dia: (data || {}).dia,
              cantFeriado: 1,
              hr_trabajadas: (data || {}).hr_trabajadas,
              hr_establecido: 8
            });

            tmpExport.push({
              "PERIODO": periodo,
              "CODIGO": (data || {}).codigoEJB,
              "TRABAJADOR": (data || {}).nombre_completo,
              "DIA-NOC": "",
              "TAR-DIU": "",
              "HED-25%": "",
              "HED-35%": "",
              "HED-50%": "",
              "HED-100": "",
              "HSI-MPL": "",
              "DES-LAB": "",
              "DIA-FER": 1,
              "DIA-SUM": "",
              "DIA-RES": "",
              "PER-HOR": "",
              "HE2-5DL": ""
            });
          } else {
            tmpFeriado[indexTmp]['cantFeriado'] = tmpFeriado[indexTmp]['cantFeriado'] + 1;
            let hr_establecido = tmpFeriado[indexTmp]['cantFeriado'] * 8;
            tmpFeriado[indexTmp]['hr_establecido'] = hr_establecido;
            tmpFeriado[indexTmp]['hr_trabajadas'] = tmpFeriado[indexTmp]['hr_trabajadas'] + (data || {}).hr_trabajadas;
            tmpExport[indexExport]['DIA-FER'] = tmpExport[indexExport]['DIA-FER'] + 1;
          }
        }
      });
    });

    console.log("onFiltrarFeriado", tmpFeriado);
    this.onDataView = tmpFeriado;
    this.dataSource = new MatTableDataSource(this.onDataView);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.onDataExport = (this.isViewDefault) ? tmpFeriado : tmpExport;
    this.isLoading = false;
  }

  onExcelExport(isFeriado?) {
    const self = this;
    self.isLoading = true;
    if (!isFeriado) {
      this.exportAsExcelFile(this.onDataView, "Reporte_huellero");
    } else if (isFeriado) {
      this.exportAsExcelFile(this.onDataExport, "Reporte_Feriados");
    }

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

  onCaledar($event) {
    console.log($event);
    if ($event.isPeriodo) {
      this.vCalendar = $event.value;
    }

    if ($event.isMultiSelect) {
      this.vMultiSelect = $event.value;
    }

    if ($event.isDefault) {
      let date = new Date($event.value).toLocaleDateString().split('/');
      this.vCalendarDefault = [`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`];
    }

    if ($event.isRange) {
      let range = [];
      let dateList = $event.value;
      (dateList || []).filter((dt) => {
        let date = new Date(dt).toLocaleDateString().split('/');
        (range || []).push(`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`);
      });

      this.vDetallado = range;
    }
  }

  obtenerMinutos(hora) {
    var spl = hora.split(":");
    return parseInt(spl[0]) * 60 + parseInt(spl[1]);
  }

  obtenerDiferenciaHora(hr1, hr2) {
    let diferencia = 0;
    let hora_1 = this.obtenerMinutos(hr1);
    let hora_2 = this.obtenerMinutos(hr2);

    if (hora_1 > hora_2) {
      diferencia = hora_1 - hora_2;
    } else {
      diferencia = hora_2 - hora_1;
    }

    return diferencia;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export interface PeriodicElement {
  tienda: string,
  codigoEJB: string,
  nombre_completo: string,
  nro_documento: string,
  telefono: string,
  email: string,
  fec_nacimiento: string,
  fec_ingreso: string,
  status: string,
  dia: string,
  hr_ingreso_1: string,
  hr_salida_1: string,
  hr_brake: string,
  hr_ingreso_2: string,
  hr_salida_2: string,
  hr_trabajadas: string,
  caja: string
}
