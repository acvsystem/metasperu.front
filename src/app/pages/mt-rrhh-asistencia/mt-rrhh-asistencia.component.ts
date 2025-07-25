import { Component, EventEmitter, inject, OnInit, SimpleChanges, ViewChild, NgZone } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Chart from 'chart.js/auto'
import { jsonToPlainText, Options } from "json-to-plain-text";
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MtViewRegistroComponent } from './components/mt-view-registro/mt-view-registro.component';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GlobalConstants } from '../../const/globalConstants';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-mt-rrhh-asistencia',
  templateUrl: './mt-rrhh-asistencia.component.html',
  styleUrls: ['./mt-rrhh-asistencia.component.scss'],
})
export class MtRrhhAsistenciaComponent implements OnInit {
  socket = io(GlobalConstants.backendServer, {
    query: { code: 'app' }
  });

  displayedColumns: string[] = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'maximo_registro', 'estado_papeleta', 'view_registre', 'rango_horario', 'isTardanza'];
  displayedColumnsOf: string[] = ['nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'rango_horario', 'isTardanza'];
  isLoading: boolean = false;
  fechaInicio: string = "";
  parseEJB: Array<any> = [];
  parseHuellero: Array<any> = [];
  onDataView: Array<any> = [];
  onDataViewOf: Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.onDataView);
  dataSourceOf = new MatTableDataSource<PeriodicElement>(this.onDataViewOf);
  onDataExport: Array<any> = [];
  onDataTemp: Array<any> = [];
  onDataParse: Array<any> = [];
  vCalendar: Array<any> = [];
  vMultiSelect: Array<any> = [];
  dataViewTolerancia: Array<any> = [];
  vCalendarDefault: Array<any> = [];
  vDetallado: Array<any> = [];
  isViewDefault: boolean = true;
  isViewFeriados: boolean = false;
  isDetallado: boolean = false;
  isDataEJB: boolean = false;
  isDataServer: boolean = false;
  isGrafica: boolean = false;
  isErrorFecha: boolean = false;
  filterEmpleado: string = "";
  filterTardanzaStatus: string = "";
  filterEstatus: string = "";
  filterEstatusPapeleta: string = "";
  filterNombreEmpleado: string = "";
  fileName: string = "";
  sedeReporte: string = "tienda";
  text: string = "";
  vTipoReporte: string = "";
  nivelUsuario: string = "";
  cboTipoGraffic: string = "Jornada incompleta";
  exportFeriado: Array<any> = [];
  arrDataGrafic: Array<any> = [];
  arrMarcacionOf: Array<any> = [];
  originalOnDataView: Array<any> = [];
  dataServGeneral: Array<any> = [];
  dataRecipient: Array<any> = [];
  myGraffic: any;
  countDataLength: number = 0;
  dialog = inject(MatDialog);
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }
  backOption: string = "isViewDefault";
  onListReporte: Array<any> = [
    { key: 'General', value: 'General' },
    { key: 'Feriados', value: 'Feriados' },
    { key: 'Detallado', value: 'Detallado' }
  ];

  listTipoGraffic: Array<any> = [
    { key: 'Jornada incompleta', value: 'Jornada incompleta' },
    { key: 'Brake incompleta', value: 'Brake incompleta' },
    { key: 'Tardanzas', value: 'Tardanzas' }
  ];

  onListTiendas: Array<any> = [
    { code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
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
    { code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];
  fileUrl;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterMenu') searchMenu!: MatMenu;
  @ViewChild('filterTardanza') searchTardanza!: MatMenu;
  @ViewChild('filterStatus') searchStatus!: MatMenu;
  @ViewChild('filterStatusPapeleta') searchStatusPapeleta!: MatMenu;
  @ViewChild('filterNombre') searchNombreEmpleado!: MatMenu;

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private ngZone: NgZone, private sanitizer: DomSanitizer, private service: ShareService, private store: StorageService,) { }

  ngOnInit() {
    let profileUser = this.store.getStore('mt-profile');
    this.nivelUsuario = (profileUser || {}).mt_nivel;
    this.socket.on('marcacionOficina', async (response) => {
      let data = (response || {}).data;
      this.onProcesarAsistenciaOf(data);
    });

    this.onTiempoTolerancia();

    this.socket.on('reporteHuellero', async (configuracion) => {

      if (configuracion.id == "EJB") {
        this.isDataEJB = true;
        let dateNow = new Date();
        let mesNow = (dateNow.getMonth() + 1).toString();
        let periodo = `${(mesNow.length == 1) ? '0' + mesNow : mesNow}/${dateNow.getFullYear().toString()}`;
        console.log("EJB", true);
        let dataEJB = [];
        this.parseEJB = [];
        this.exportFeriado = [];
        dataEJB = (configuracion || {}).data || [];

        (dataEJB || []).filter((ejb) => {
          if (((ejb || {}).STATUS).trim() == "VIG") {

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

            this.exportFeriado.push({
              "PERIODO": periodo,
              "CODIGO": ((ejb || {}).CODEJB).trim(),
              "TRABAJADOR": `${(ejb || {}).APEPAT} ${(ejb || {}).APEMAT} ${(ejb || {}).NOMBRE}`,
              "DIA-NOC": "",
              "TAR-DIU": "",
              "HED-25%": "",
              "HED-35%": "",
              "HED-50%": "",
              "HED-100": "",
              "HSI-MPL": "",
              "DES-LAB": "",
              "DIA-FER": 0,
              "DIA-SUM": "",
              "DIA-RES": "",
              "PER-HOR": "",
              "HE2-5DL": ""
            });
          }
        });

      }

      if (configuracion.id == "servGeneral") {
        console.log("servGeneral", true);

        this.countDataLength += ((configuracion || {}).data || []).length;

        (configuracion || {}).data.filter((dt) => {
          this.dataServGeneral.push(dt);
        });


        if (this.countDataLength == (configuracion || {}).length) {
          console.log(this.countDataLength, (configuracion || {}).length);
          this.countDataLength = 0;
          this.onProcesarAsistencia();
        }
      }
    });
  }

  async onProcesarAsistencia() {
    this.isDataServer = true;
    this.parseHuellero = [];
    (this.dataServGeneral || []).filter((huellero) => {
      this.parseHuellero.push({
        nro_documento: (huellero || {}).nroDocumento,
        nombre_completo: (huellero || {}).nombreCompleto,
        dia: (huellero || {}).dia,
        hr_ingreso: (huellero || {}).hrIn,
        hr_salida: (huellero || {}).hrOut,
        hr_trabajadas: (huellero || {}).hrWorking,
        caja: (huellero || {}).caja,
        papeletas: (huellero || {}).papeleta,
        isPapeleta: ((huellero || {}).papeleta || []).length ? true : false,
        rango_horario: (huellero || {}).rango_horario
      });
    });

    if (this.isDataEJB && this.isDataServer) {
      this.onDataTemp = [];

      await (this.parseHuellero || []).filter(async (huellero) => {

        if ((huellero || {}).caja != '9M1' && (huellero || {}).caja != '9M2' && (huellero || {}).caja != '9M3') {

          var codigo = (huellero || {}).caja.substr(0, 2);
          var selectedLocal = {};



          if ((huellero || {}).caja.substr(2, 2) == 7) {
            codigo = (huellero || {}).caja;
          } else {
            codigo.substr(0, 1)
          }

          selectedLocal = await this.onListTiendas.find((data) => data.code == codigo) || {};

          let indexData = this.onDataTemp.findIndex((data) => (data || {}).nro_documento == (huellero || {}).nro_documento && ((data || {}).dia == (huellero || []).dia) && (data || {}).caja == (huellero || []).caja);
          let dataEJB = this.parseEJB.find((ejb) => ejb.nro_documento == (huellero || {}).nro_documento);

          if ((dataEJB || {}).codigoEJB != null) {

            if (indexData == -1) {

              let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'tardanza');

              let defaultHT = this.obtenerHorasTrabajadas(((huellero || {}).rango_horario || "").split(" ")[0], (tolerancia || "").TIEMPO_TOLERANCIA || "00:00"); //TOLERANCIA HORA ENTRADA
              let ingreso = (huellero || {}).hr_ingreso.split(':');
              let ingresoInt = parseInt(ingreso[0]) * 60 + parseInt(ingreso[1]);
              let ingresoHorario = (defaultHT).split(':');
              let ingresoHorarioInt = parseInt(ingresoHorario[0]) * 60 + parseInt(ingresoHorario[1]);

              let isTardanza = ingresoHorarioInt >= ingresoInt ? false : true;
              let isVerificar = false;

              if (!isTardanza) {
                if ((huellero || {}).nro_documento == '70611399' && (huellero || {}).dia == '2025-07-05') {
                  console.log(huellero);
                  console.log(parseInt(ingresoHorario[0]), parseInt(ingreso[0]), parseInt(ingreso[1]));
                }
                if (parseInt(ingresoHorario[0]) > parseInt(ingreso[0])) {
                  let diferencia = parseInt(ingresoHorario[0]) - parseInt(ingreso[0]);
                  if (diferencia == 1) {
                    if (parseInt(ingreso[1]) < 55) {
                      isVerificar = true;
                    }
                  } else if (diferencia > 1) {
                    isVerificar = true;
                  }
                }
              }

              let hrt = this.obtenerDiferenciaHora((huellero || {}).hr_ingreso, (huellero || {}).hr_salida);

              let hrPapeleta = "";

              if ((huellero || {}).isPapeleta) {
                ((huellero || {}).papeletas || []).filter((papeleta) => {
                  if (isTardanza) {
                    let salidapap = (papeleta || {})['HORA_SALIDA'].split(':');
                    let salidapapInt = parseInt(salidapap[0]) * 60 + parseInt(salidapap[1]);
                    let llegadapap = (papeleta || {})['HORA_LLEGADA'].split(':');
                    let llegadapapInt = parseInt(llegadapap[0]) * 60 + parseInt(llegadapap[1]);

                    if (ingresoHorarioInt >= salidapapInt) {
                      if (llegadapapInt >= ingresoInt) {
                        isTardanza = false;
                      } else {
                        isTardanza = true;
                      }
                    }
                  }

                  hrPapeleta = this.obtenerHorasTrabajadas((papeleta || {})['HORA_SOLICITADA'], (hrPapeleta || "").length > 0 ? hrPapeleta : hrt);
                });
              }

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
                rango_horario: (huellero || {}).rango_horario,
                isNullRango: !((huellero || {}).rango_horario || "").length ? true : false,
                isTardanza: isTardanza,
                isVerificar: isVerificar,
                hr_brake: "",
                hr_ingreso_2: "",
                hr_salida_2: "",
                hr_trabajadas: !(huellero || {}).isPapeleta ? hrt : hrPapeleta,
                caja: (huellero || {}).caja,
                isJornadaCompleta: this.onVerificacionJornada(!(huellero || {}).isPapeleta ? hrt : hrPapeleta),
                isBrakeComplete: false,
                isRegistroMax: false,
                statusRegistro: 'CORRECTO',
                statusTardanza: isVerificar ? 'verificar' : isTardanza && ((huellero || {}).rango_horario || "").length ? 'tardanza' : !isTardanza && ((huellero || {}).rango_horario || "").length ? 'correcto' : !((huellero || {}).rango_horario || "").length ? 'sin rango' : "",
                dataRegistro: [huellero],
                papeletas: (huellero || {}).papeletas || [],
                isPapeleta: (huellero || {}).isPapeleta,
                estadoPapeleta: (huellero || {}).isPapeleta ? 'con papeleta' : 'sin papeleta'
              });

            } else {

              this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hr_ingreso);
              this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hr_ingreso;
              this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hr_salida;
              let hora_trb_1 = this.obtenerDiferenciaHora((huellero || {}).hr_ingreso, (huellero || {}).hr_salida);

              let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'breake');

              let defaultHT = this.obtenerHorasTrabajadas("01:00", (tolerancia || "").TIEMPO_TOLERANCIA || "00:00"); //TOLERANCIA HORA BREAKE
              let ingresoHorario = (defaultHT).split(':');
              let ingresoHorarioInt = parseInt(ingresoHorario[0]) * 60 + parseInt(ingresoHorario[1]);

              let ingreso = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hr_ingreso).split(':');
              let ingresoInt = parseInt(ingreso[0]) * 60 + parseInt(ingreso[1]);

              let isBrakeComplete = ingresoInt > ingresoHorarioInt ? false : true;



              this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], hora_trb_1);


              this.onDataTemp[indexData]['isJornadaCompleta'] = this.onVerificacionJornada(this.onDataTemp[indexData]['hr_trabajadas']);
              this.onDataTemp[indexData]['isBrakeComplete'] = isBrakeComplete;
              this.onDataTemp[indexData]['dataRegistro'].push(huellero);
              this.onDataTemp[indexData]['isRegistroMax'] = this.onDataTemp[indexData]['dataRegistro'].length >= 3 || this.onDataTemp[indexData]['dataRegistro'].length == 1 ? true : false;

              let defaultHTT = "07:50";
              let ingresoHorario2 = (defaultHTT).split(':');
              let ingresoHorarioInt2 = parseInt(ingresoHorario2[0]) * 60 + parseInt(ingresoHorario2[1]);

              let ingreso2 = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
              let ingresoInt2 = parseInt(ingreso2[0]) * 60 + parseInt(ingreso2[1]);

              this.onDataTemp[indexData]['isIncompleto'] = ingresoInt2 > ingresoHorarioInt2 ? false : true;

              this.onDataTemp[indexData]['statusRegistro'] = this.onDataTemp[indexData]['dataRegistro'].length >= 3 || this.onDataTemp[indexData]['dataRegistro'].length == 1 ? "REVISAR" : this.onDataTemp[indexData]['isIncompleto'] ? "INCOMPLETO" : "CORRECTO";

            }
          }
        }
      });

      if (this.isViewDefault || this.isDetallado) {

        this.onDataView = this.onDataTemp;
        this.originalOnDataView = [...this.onDataTemp];
        this.dataSource = new MatTableDataSource(this.onDataView);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.onDataTemp.filter((dt) => {
          if (dt.nro_documento != '001763881' && dt.nro_documento != '75946420' && dt.nro_documento != '003755453' && dt.nro_documento != '002217530' && dt.nro_documento != '002190263' && dt.nro_documento != '70276451') {
            let indexData = this.arrDataGrafic.findIndex((gr) => gr.tienda == (dt || {}).tienda);

            if (!dt.isBrakeComplete && this.cboTipoGraffic == "Brake incompleta") {
              if (indexData == -1) {
                this.arrDataGrafic.push({
                  tienda: dt.tienda,
                  cantidad: 1
                });
              } else {
                this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
              }
            }

            if (!dt.isJornadaCompleta && this.cboTipoGraffic == "Jornada incompleta") {
              if (indexData == -1) {
                this.arrDataGrafic.push({
                  tienda: dt.tienda,
                  cantidad: 1
                });
              } else {
                this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
              }
            }

            if (dt.isTardanza && !dt.isNullRango && this.cboTipoGraffic == "Tardanzas") {
              if (indexData == -1) {
                this.arrDataGrafic.push({
                  tienda: dt.tienda,
                  cantidad: 1
                });
              } else {
                this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
              }
            }
          }
        });

        this.onViewGrafic();
        if (this.onDataView.length) {
          this.isLoading = false;
        }

      }

      if (this.isViewFeriados) {
        this.onFiltrarFeriado(this.vMultiSelect);
      }
    }
  }

  onProcesarAsistenciaOf(dataProcesar) {
    this.isLoading = false;
    console.log(dataProcesar);

    const ascDates = dataProcesar.sort((a, b) => {
      return new Date(a.logid).getTime() - new Date(b.logid).getTime();
    });

    (ascDates || []).filter((mc, i) => {
      let date = mc.checkinout.split(' ');

      if (mc.name != 'JOHNNY') {
        let date = mc.checkinout.split(' ');

        let nombre = mc.name + ' ' + mc.lastsname;
        let indexData = this.arrMarcacionOf.findIndex((data) => (data || {}).nombre == nombre && ((data || {}).fecha == date[0]));

        if (indexData == -1) {

          //PROCESO TARDANZA
          let isTardanza = false;

          if ((mc.rango_horario || "").length) {

            let defaultHT = this.obtenerHorasTrabajadas(mc.rango_horario.split(" ")[0], "00:05"); //TOLERANCIA HORA ENTRADA

            let ingresoHorario = (defaultHT).split(':');
            let ingresoHorarioInt = parseInt(ingresoHorario[0]) * 60 + parseInt(ingresoHorario[1]);

            let ingreso = date[1].split(':');
            let ingresoInt = parseInt(ingreso[0]) * 60 + parseInt(ingreso[1]);

            isTardanza = ingresoHorarioInt >= ingresoInt ? false : true;

          }

          this.arrMarcacionOf.push({
            nombre: mc.name + ' ' + mc.lastsname,
            fecha: date[0],
            hr_ingreso: date[1],
            hr_in_break: '',
            hr_out_break: '',
            hr_break: 0,
            hr_salida: '',
            hr_trabajadas: 0,
            rango_horario: mc.rango_horario,
            isTardanza: isTardanza,
            statusTardanza: isTardanza ? 'tardanza' : 'correcto'
          });
        } else {

          //PROCESO INICIO BRREAK

          if (this.arrMarcacionOf[indexData]['hr_in_break'].length && !this.arrMarcacionOf[indexData]['hr_out_break'].length) {
            this.arrMarcacionOf[indexData]['hr_out_break'] = date[1];
          }

          if (!this.arrMarcacionOf[indexData]['hr_in_break'].length) {
            this.arrMarcacionOf[indexData]['hr_in_break'] = date[1];
          }

          if (this.arrMarcacionOf[indexData]['hr_in_break'].length && this.arrMarcacionOf[indexData]['hr_out_break'].length) {
            this.arrMarcacionOf[indexData]['hr_break'] = this.obtenerDiferenciaHora(this.arrMarcacionOf[indexData]['hr_in_break'], this.arrMarcacionOf[indexData]['hr_out_break']);
          }

          //PROCESO HORA SALIDA DE TRABAJO

          if (this.arrMarcacionOf[indexData]['hr_ingreso'].length && this.arrMarcacionOf[indexData]['hr_in_break'].length && this.arrMarcacionOf[indexData]['hr_out_break'].length) {
            this.arrMarcacionOf[indexData]['hr_salida'] = date[1];
          }

          //PROCESO HORA TRABAJADAS

          if (this.arrMarcacionOf[indexData]['hr_ingreso'].length && this.arrMarcacionOf[indexData]['hr_salida'].length) {
            this.arrMarcacionOf[indexData]['hr_trabajadas'] = this.obtenerDiferenciaHora(this.arrMarcacionOf[indexData]['hr_ingreso'], this.arrMarcacionOf[indexData]['hr_salida']);
          }
        }
      }
    });

    if (this.arrMarcacionOf.length) {
      this.onDataViewOf = [...this.arrMarcacionOf];
      this.dataSourceOf = new MatTableDataSource(this.onDataViewOf);
      this.dataSourceOf.paginator = this.paginator;
      this.dataSourceOf.sort = this.sort;
    }

  }


  radioChange(ev) {
    this.sedeReporte = (ev || {}).value;
    if ((ev || {}).value == 'oficina') {
      this.isLoading = true;
      this.onDataView = [];
      this.socket.emit('marcacion_of', []);
    }
  }

  sinDiacriticos = (function () {
    let de = 'ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç',
      a = 'AAAAAEEEEIIIIOOOOUUUUNCaaaaaeeeeiiiioooouuuunc',
      re = new RegExp('[' + de + ']', 'ug');

    return texto =>
      texto.replace(
        re,
        match => a.charAt(de.indexOf(match))
      );
  })();

  onGenerarGraffic() {
    this.arrDataGrafic = [];
    console.log("onGenerarGraffic", this.onDataTemp);
    this.onDataTemp.filter((dt) => {
      if (dt.nro_documento != '001763881' && dt.nro_documento != '75946420' && dt.nro_documento != '003755453' && dt.nro_documento != '002217530' && dt.nro_documento != '002190263' && dt.nro_documento != '70276451') {
        let indexData = this.arrDataGrafic.findIndex((gr) => gr.tienda == (dt || {}).tienda);

        if (!dt.isBrakeComplete && this.cboTipoGraffic == "Brake incompleta") {
          if (indexData == -1) {
            this.arrDataGrafic.push({
              tienda: dt.tienda,
              cantidad: 1
            });
          } else {
            this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
          }
        }

        if (!dt.isJornadaCompleta && this.cboTipoGraffic == "Jornada incompleta") {
          if (indexData == -1) {
            this.arrDataGrafic.push({
              tienda: dt.tienda,
              cantidad: 1
            });
          } else {
            this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
          }
        }

        if (dt.isTardanza && this.cboTipoGraffic == "Tardanzas") {
          if (indexData == -1) {
            this.arrDataGrafic.push({
              tienda: dt.tienda,
              cantidad: 1
            });
          } else {
            this.arrDataGrafic[indexData]['cantidad'] = this.arrDataGrafic[indexData]['cantidad'] + 1;
          }
        }
      }
    });

    this.onViewGrafic();
  }

  timeMoments(dateStr) {
    // desarmamos el string por los '-' los descartamos y lo transformamos en un array
    let parts = (dateStr || "").split("/");
    // parts[2] es año
    // parts[1] el mes
    // parts[0] el día

    return new Date(parts[0], parts[1], parts[2]).getTime();
  }

  timeMoments2(dateStr) {
    // desarmamos el string por los '-' los descartamos y lo transformamos en un array
    let parts = (dateStr || "").split("/");
    // parts[2] es año
    // parts[1] el mes
    // parts[0] el día

    return new Date(parts[2], parts[0], parts[1]).getTime();
  }

  async onConsultarAsistencia() {

    if (!this.isErrorFecha) {
      if (this.sedeReporte == 'tienda') {
        let arVerif = [];

        await (this.vMultiSelect || []).filter((dt) => {

          let date = dt.split('/');
          if (date[1] == this.vCalendar[1] || date[1] == this.vCalendar[2]) {
            arVerif.push(true);
          } else {
            arVerif.push(false);
          }
        });

        if (arVerif.includes(false) && this.isViewFeriados) {
          this.openSnackBar("Fechas seleccionadas no son correcta..!!");
          this.isLoading = false;
        } else {
          if (this.vCalendarDefault.length || this.vDetallado.length >= 2) {
            this.dataServGeneral = [];

            var configuracion = {
              isDefault: this.isViewDefault,
              isFeriados: this.isViewFeriados,
              isDetallado: this.isDetallado,
              centroCosto: '',
              dateList: (this.isViewDefault) ? this.vCalendarDefault : this.isViewFeriados ? this.vMultiSelect : this.isDetallado ? this.vDetallado : []
            };



            if (this.isViewFeriados) {
              if (this.vCalendar.length && this.vMultiSelect.length) {
                this.isLoading = true;
                this.socket.emit('consultaMarcacion', configuracion);
              } else {
                this.openSnackBar("Seleccione una fecha.");
              }

            }

            if (this.isDetallado) {
              if (this.vDetallado.length >= 2) {
                this.isLoading = true;
                this.socket.emit('consultaMarcacion', configuracion);
              } else {
                this.openSnackBar("Seleccione una fecha.");
              }
            }

            if (this.isViewDefault) {
              if (this.vCalendarDefault) {
                this.isLoading = true;
                this.socket.emit('consultaMarcacion', configuracion);
              } else {
                this.openSnackBar("Seleccione una fecha.");
              }
            }

          }

        }
      } else {
        console.log(this.vDetallado);
        let date = ((this.vCalendarDefault || [])[0] || "").split('/');
        let dataTemp = [];
        this.onDataViewOf = [];

        this.dataSourceOf = new MatTableDataSource(this.onDataViewOf);
        this.dataSourceOf.paginator = this.paginator;
        this.dataSourceOf.sort = this.sort;

        if ((this.vDetallado || "").length) {
          let preDate = this.timeMoments(this.vDetallado[0]);
          let postDate = this.timeMoments(this.vDetallado[1]);
          dataTemp = this.arrMarcacionOf.filter((account) => {

            return this.timeMoments2(account.fecha) >= preDate && this.timeMoments2(account.fecha) <= postDate
          });
        } else {
          dataTemp = this.arrMarcacionOf.filter((mc) => mc.fecha == `${date[1]}/${date[2]}/${date[0]}`);
        }


        this.onDataViewOf = dataTemp;
        this.dataSourceOf = new MatTableDataSource(this.onDataViewOf);
        this.dataSourceOf.paginator = this.paginator;
        this.dataSourceOf.sort = this.sort;
      }

    } else {
      this.openSnackBar("La fecha seleccionada no puede ser posterior a la fecha actual.");
    }

  }



  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  async onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";


    if (index == "cboTipoGraffic") {
      this.onGenerarGraffic();
    } else {
      this.onDataView = [];
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if ((selectData || {}).key == "General") {
      this.backOption = "isViewDefault";
      this.isViewDefault = true;
      this.isViewFeriados = false;
      this.isDetallado = false;
      this.isGrafica = false;
      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'maximo_registro', 'estado_papeleta', 'view_registre', 'rango_horario', 'isTardanza'];
    }

    if ((selectData || {}).key == "Feriados") {
      this.backOption = "isViewFeriados";
      this.isViewFeriados = true;
      this.isViewDefault = false;
      this.isDetallado = false;
      this.isGrafica = false;
      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'cantFeriado', 'hr_trabajadas'];
    }

    if ((selectData || {}).key == "Detallado") {

      this.displayedColumns = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'maximo_registro', 'estado_papeleta', 'view_registre', 'rango_horario', 'isTardanza'];
      this.isDetallado = true;
      this.backOption = "isDetallado";
      this.isViewFeriados = false;
      this.isViewDefault = false;

      this.isGrafica = false;
    }

  }

  async onFiltrarFeriado(dateList) {
    let tmpFeriado = [];
    let arrFecFeriado = [];

    console.log(dateList);
    (dateList || []).filter((dt) => {
      let date = new Date(dt).toLocaleDateString().split('/');
      (arrFecFeriado || []).push(`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`);
    });


    await (arrFecFeriado || []).filter(async (feriado) => {

      await (this.onDataTemp || []).filter((data) => {
        if ((data || {}).dia == feriado && ((data || {}).codigoEJB != "" && (data || {}).codigoEJB != null)) {

          let indexTmp = tmpFeriado.findIndex((tmp) => tmp.nro_documento == (data || {}).nro_documento);
          let indexExport = this.exportFeriado.findIndex((tmp) => tmp.CODIGO == (data || {}).codigoEJB);

          let ext = tmpFeriado.findIndex((tmp) => (tmp.nro_documento == (data || {}).nro_documento) && (tmp.dia == (data || {}).dia));
          if (ext == -1 && (data || {}).nro_documento != "001763881" && (data || {}).nro_documento != "002217530") {
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


              this.exportFeriado[indexExport]['DIA-FER'] = this.exportFeriado[indexExport]['DIA-FER'] + 1;

            } else {
              tmpFeriado[indexTmp]['cantFeriado'] = tmpFeriado[indexTmp]['cantFeriado'] + 1;
              let hr_establecido = tmpFeriado[indexTmp]['cantFeriado'] * 8;
              tmpFeriado[indexTmp]['hr_establecido'] = hr_establecido;
              tmpFeriado[indexTmp]['hr_trabajadas'] = this.obtenerHorasTrabajadas(tmpFeriado[indexTmp]['hr_trabajadas'], (data || {}).hr_trabajadas);
              this.exportFeriado[indexExport]['DIA-FER'] = this.exportFeriado[indexExport]['DIA-FER'] + 1;
            }
          }


        }
      });
    });

    this.onDataView = tmpFeriado;
    this.dataSource = new MatTableDataSource(this.onDataView);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.onDataExport = (this.isViewDefault) ? tmpFeriado : this.exportFeriado;
    if (this.onDataView.length) {
      this.isLoading = false;
      this.isDataEJB = false;
      this.isDataServer = false;
    }
  }

  onExcelExport(isFeriado?) {
    const self = this;
    self.isLoading = true;
    if (!isFeriado) {
      let data = this.sedeReporte == 'oficina' ? this.onDataViewOf : this.onDataView;
      this.exportAsExcelFile(data, "Reporte_huellero");
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
    console.log("onCaledar", $event);
    this.isErrorFecha = false;
    if ($event.isPeriodo) {
      this.vCalendar = [];
      this.vCalendar = $event.value;
    }

    if ($event.isMultiSelect) {
      this.vMultiSelect = [];
      this.vMultiSelect = $event.value;
    }

    if ($event.isDefault) {
      this.vCalendarDefault = [];
      this.vDetallado = [];
      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      let date = new Date($event.value).toLocaleDateString().split('/');
      var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));

      if (f1.getTime() > f2.getTime()) {
        this.isErrorFecha = true;
        this.openSnackBar("La fecha seleccionada no puede ser posterior a la actual.");
      }

      this.vCalendarDefault = [`${$event.value}`];
    }

    if ($event.isRange) {
      this.vDetallado = [];
      let range = $event.value;

      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      let date = new Date(range[1]).toLocaleDateString().split('/');
      var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));

      console.log(range);

      if (f1.getTime() > f2.getTime()) {
        this.isErrorFecha = true;
        this.openSnackBar("La fecha seleccionada no puede ser posterior a la actual.");
      } else {
        if (range.length >= 2) {
          this.vDetallado = range;
        }
      }
    }
  }

  obtenerMinutos(hora_1, hora_2) {

    let hora_1_pr = hora_1.split(":");
    let hora_2_pr = hora_2.split(":");
    let residuo_1 = 0;
    let minutos = 0;
    let hora = 0;

    if (hora_1_pr[1] > 0 || hora_1_pr[1] == 0) {

      if (hora_1_pr[0] == hora_2_pr[0]) {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);
        minutos = residuo_1 - 60;

      } else {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);

        if (residuo_1 > 59) {
          minutos = residuo_1 - 60;
          hora = 1;

        } else {
          minutos = residuo_1;
        }
      }

    }

    return [hora, minutos];
  }

  obtenerHorasTrabajadas(hrRs_1, hrRs_2) {
    let hr_1 = hrRs_1.split(":");
    let hr_2 = hrRs_2.split(":");

    let dif_min = parseInt(hr_1[1]) + parseInt(hr_2[1]);
    let dif_hora = parseInt(hr_1[0]) + parseInt(hr_2[0]);
    let dif_res = 0;
    let dif_hr = 0;

    if (dif_min > 59) {
      dif_res = dif_min - 60;
      dif_hr = dif_hora + 1;
    } else {
      dif_hr = dif_hora;
      dif_res = dif_min;
    }

    return `${dif_hr}:${(dif_res < 10) ? '0' + dif_res : dif_res}`;
  }

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
  }

  obtenerDiferenciaHora(hr1, hr2) {

    let diferencia = 0;
    let hora_1 = this.obtenerHoras(hr1);
    let hora_2 = this.obtenerHoras(hr2);
    let minutos = this.obtenerMinutos(hr1, hr2);
    let hrExtr = (minutos[0] > 0) ? minutos[0] : 0;



    let hrxLlegada = hr1.split(':');
    let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
    let hrxSalida = hr2.split(':');
    let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

    if (hora_1 > hora_2) {
      diferencia = llegada - salida;
    } else {
      diferencia = salida - llegada;
    }

    const ToTime = (num) => {
      var minutos: any = Math.floor((num / 60) % 60);
      minutos = minutos < 10 ? '0' + minutos : minutos;
      var segundos: any = num % 60;
      segundos = segundos < 10 ? '0' + segundos : segundos;
      return minutos + ':' + segundos;
    }

    let horaResult = ToTime(diferencia);

    return horaResult;
  }

  codigoPap: string = "";
  isViewPapeleta: boolean = true;

  onViewPapeleta(ev) {
    console.log(ev);
    this.codigoPap = "";
    this.codigoPap = (ev || [])[0].CODIGO_PAPELETA;
    this.isViewPapeleta = true;
  }

  onGrafic() {
    this.isViewPapeleta = false;
  }

  onVerificacionJornada(hr) {
    let hora_pr = hr.split(":");
    return hora_pr[0] >= 8;
  }

  onVerficacionBrake(hr) {
    let hora_pr = hr.split(":");
    let isCorrect = false;
    let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'breake');

    if (hora_pr[0] <= 1 && hora_pr[1] <= (tolerancia || {}).TIEMPO_TOLERANCIA || "00:00") {
      isCorrect = true;
    } else if (hora_pr[0] == 0) {
      isCorrect = true;
    }

    return isCorrect;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.sedeReporte == 'oficina') {
      this.dataSourceOf.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  dataFilter: Array<any> = [];
  arFiltro: Array<any> = [];
  filteredValues: any = {
    tienda: "",
    codigoEJB: "",
    nombre_completo: "",
    nro_documento: "",
    telefono: "",
    email: "",
    fec_nacimiento: "",
    fec_ingreso: "",
    status: "",
    dia: "",
    hr_ingreso_1: "",
    hr_salida_1: "",
    rango_horario: "",
    isNullRango: "",
    isTardanza: "",
    hr_brake: "",
    hr_ingreso_2: "",
    hr_salida_2: "",
    hr_trabajadas: "",
    caja: "",
    isJornadaCompleta: "",
    isBrakeComplete: "",
    isRegistroMax: "",
    statusRegistro: "",
    statusTardanza: "",
    dataRegistro: "",
    papeletas: "",
    isPapeleta: "",
    estadoPapeleta: ""
  };

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }

  onViewGrafic() {

    console.log("onViewGrafic", this.cboTipoGraffic);
    let arrLabels = [];
    let data = [];

    this.arrDataGrafic.filter((gr) => {
      arrLabels.push(gr.tienda);
      data.push(gr.cantidad);
    });


    const ctx = document.getElementById('ctx');

    if (this.myGraffic != null) {
      this.myGraffic.destroy();
    }

    this.myGraffic = new Chart("ctx", {
      type: 'bar',
      data: {
        labels: arrLabels,
        datasets: [{
          label: this.cboTipoGraffic == 'Tardanzas' ? 'Tardanzas Asesores' : (this.cboTipoGraffic == 'Jornada incompleta') ? '# Horas trabajadas incompletas' : '# Tiempo Brake Sobre la hora',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(224, 140, 55, 0.2)',
            'rgba(177, 231, 51, 0.2)',
            'rgba(38, 177, 219, 0.2)',
            'rgba(255, 64, 191, 0.2)',
            'rgba(184, 8, 190, 0.2)',
            'rgba(24, 245, 72, 0.2)',
            'rgba(64, 217, 255, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(224, 140, 55, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(224, 140, 55, 0.2)',
            'rgba(24, 245, 72, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(161, 0, 35, 0.2)',
            'rgba(0, 81, 134, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(0, 146, 146, 0.2)',
            'rgba(66, 0, 199, 0.2)',
            'rgba(179, 89, 0, 0.2)',
            'rgba(163, 82, 0, 0.2)',
            'rgba(114, 163, 0, 0.2)',
            'rgba(0, 111, 145, 0.2)',
            'rgba(163, 0, 109, 0.2)',
            'rgba(150, 0, 155, 0.2)',
            'rgba(0, 165, 36, 0.2)',
            'rgba(0, 118, 148, 0.2)',
            'rgba(0, 153, 153, 0.2)',
            'rgba(182, 91, 0, 0.2)',
            'rgba(0, 104, 173, 0.2)',
            'rgba(170, 85, 0, 0.2)',
            'rgba(0, 173, 38, 0.2)',
            'rgba(62, 0, 185, 0.2)',
            'rgba(0, 98, 163, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  onGenTxt() {
    this.socket.emit('consultaPlanilla', "");
  }

  dyanmicDownloadByHtmlTag() {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = this.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(this.text)}`);
    element.setAttribute('download', this.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }


  openDialog(ev) {
    this.dialog.open(MtViewRegistroComponent, {
      data: ev,
      panelClass: 'full-screen-modal'
    });
  }

  onTiempoTolerancia() {
    let parms = {
      url: '/security/configuracion/tiempo/tolerancia'
    };
    this.service.get(parms).then((response) => {
      this.dataViewTolerancia = response;
    });
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
  rango_horario: string,
  isNullRango: string,
  isTardanza: string,
  hr_brake: string,
  hr_ingreso_2: string,
  hr_salida_2: string,
  hr_trabajadas: string,
  caja: string,
  isJornadaCompleta: string,
  isBrakeComplete: string,
  isRegistroMax: string,
  statusRegistro: string,
  statusTardanza: string,
  dataRegistro: string,
  papeletas: string,
  isPapeleta: string,
  estadoPapeleta: string
}
