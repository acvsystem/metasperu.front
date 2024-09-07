import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-rrhh-asistencia',
  templateUrl: './mt-rrhh-asistencia.component.html',
  styleUrls: ['./mt-rrhh-asistencia.component.scss'],
})
export class MtRrhhAsistenciaComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  headList = ['Tienda', 'codigo EJB', 'Documento', 'Nombre Completo', 'Fecha', 'Hr Entrada 1', 'Hr Salida 1', 'Hrs Brake', 'Hr Entrada 2', 'Hr Salida 2', 'Hrs Trabajadas'];
  isLoading: boolean = false;
  fechaInicio: string = "";
  parseEJB: Array<any> = [];
  parseHuellero: Array<any> = [];
  onDataView: Array<any> = [];
  onDataTemp: Array<any> = [];
  onDataParse: Array<any> = [];
  isViewDefault: boolean = true;
  isViewFeriados: boolean = false;
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

  constructor() { }

  ngOnInit() {

    this.socket.on('reporteHuellero', async (configuracion) => {

      if (configuracion.id == "EJB") {
        console.log("EJB", true);
        let dataEJB = [];
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
        dataServGeneral = (configuracion || {}).data || [];
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
      console.log(this.parseEJB.length, this.parseHuellero.length);
      if (this.parseEJB.length && this.parseHuellero.length) {
        this.onDataTemp = [];

        await (this.parseHuellero || []).filter(async (huellero) => {

          var codigo = (huellero || {}).caja.substr(0, 2);
          var selectedLocal = {};
          if ((huellero || {}).caja.substr(2, 2) == 7) {
            codigo = codigo;
          } else {
            codigo.substr(0, 1)
          }

          selectedLocal = await this.onListTiendas.find((data) => data.code == codigo) || {};



          let indexData = this.onDataTemp.findIndex((data) => (data || {}).nro_documento == (huellero || {}).nro_documento && ((data || {}).dia == (huellero || []).dia));
          let dataEJB = this.parseEJB.find((ejb) => ejb.nro_documento == (huellero || {}).nro_documento);


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
              hr_trabajadas: (huellero || {}).hr_trabajadas,
              caja: (huellero || {}).caja
            });
          } else {
            this.onDataTemp[indexData]['hr_brake'] = "";
            this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hr_ingreso;
            this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hr_salida;
          }
        })

        if (this.isViewDefault) {
          this.onDataView = this.onDataTemp;
        }

        if (this.isViewFeriados) {
          this.onFiltrarFeriado();
        }
      }



    });
  }

  onConsultarAsistencia() {
    var configuracion = {
      isDefault: false,
      isFeriados: true,
      centroCosto: 'BBW',
      dateList: ['2024', '07', '08']
    };

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

    if ((selectData || {}).key == "General") {
      this.isViewDefault = true;
      this.isViewFeriados = false;
      this.headList = ['Tienda', 'codigo EJB', 'Documento', 'Nombre Completo', 'Fecha', 'Hr Entrada 1', 'Hr Salida 1', 'Hrs Brake', 'Hr Entrada 2', 'Hr Salida 2', 'Hrs Trabajadas'];
    }

    if ((selectData || {}).key == "Feriados") {
      this.isViewFeriados = true;
      this.isViewDefault = false;
      this.headList = ['codigo EJB', 'Documento', 'Nombre Completo', 'Feriados Trabajados'];

    }

  }

  onFiltrarFeriado() {
    let tmpFeriado = [];
    let arrFecFeriado = ["2024-07-28", "2024-07-29", "2024-08-06"];
    arrFecFeriado.filter((feriado) => {
      this.onDataTemp.filter((data) => {
        if ((data || {}).dia == feriado) {

          let indexTmp = tmpFeriado.findIndex((tmp) => tmp.nro_documento == (data || {}).nro_documento);

          if (indexTmp == -1) {
            tmpFeriado.push({
              codigoEJB: (data || {}).codigoEJB,
              nombre_completo: (data || {}).nombre_completo,
              nro_documento: (data || {}).nro_documento,
              dia: (data || {}).dia,
              cantFeriado: 1
            });
          } else {
            tmpFeriado[indexTmp]['cantFeriado'] = tmpFeriado[indexTmp]['cantFeriado'] + 1;
          }
        }
      });
    });

    this.onDataView = tmpFeriado;

  }

  onExcelExport() {
    const self = this;
    self.isLoading = true;
    this.exportAsExcelFile(this.onDataView, "Reporte_Feriados");
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

}
