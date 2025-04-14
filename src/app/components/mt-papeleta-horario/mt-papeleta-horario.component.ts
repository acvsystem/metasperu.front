import { Component, HostListener, Input, OnInit, ViewChild, inject } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { StorageService } from 'src/app/utils/storage';
import { ShareService } from 'src/app/services/shareService';
import * as $ from 'jquery';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';
import { ModalController } from '@ionic/angular';
import { MtModalComentarioComponent } from '../../components/mt-modal-comentario/mt-modal-comentario.component';
import { MtModalViewComentarioComponent } from '../../components/mt-modal-view-comentario/mt-modal-view-comentario.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'mt-papeleta-horario',
  templateUrl: './mt-papeleta-horario.component.html',
  styleUrls: ['./mt-papeleta-horario.component.scss'],
})
export class MtPapeletaHorarioComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  @Input() isConsulting: boolean = false;
  isMantenimiento: boolean = false;
  readonly dialog = inject(MatDialog);
  onListEmpleado: Array<any> = [];
  cboCasos: string = "";
  codigoPap: string = "";
  cboTiendaConsulting: string = "";
  horaSalida: string = "";
  horaLlegada: string = "";
  vNameOptionSelected: string = "";
  totalHoras: string = "";
  arHoraExtra: Array<any> = [];
  arHoraTomada: Array<any> = [];
  arHoraTomadaCalc: Array<any> = [];
  arCopiHoraExtra: Array<any> = [];
  bodyList: Array<any> = [];
  dataViewPermiso: Array<any> = [];
  dataViewTolerancia: Array<any> = [];
  vObservacion: string = "";
  nameTienda: string = "";
  cboEmpleado: string = "";
  vFechaHasta: string = "";
  vFechaDesde: string = "";
  isViewPapeleta: boolean = false;
  isResetForm: boolean = false;
  isResetCalendar: boolean = false;
  isResetCalendarComp: boolean = false;
  hroAcumulada: string = "00:00";
  hroAcumuladaTotal: string = "00:00";
  hroTomada: string = "00:00";
  vHtomada: string = "";
  onDataTemp: Array<any> = [];
  parseHuellero: Array<any> = [];
  isValidPapeleta: boolean = false;
  listaPapeletas: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.listaPapeletas);
  arSelectRegistro: Array<any> = [];
  arDataEJB: Array<any> = [];
  arDataServer: Array<any> = [];
  parseEJB: Array<any> = [];
  dataVerify: Array<any> = [];
  codeTienda: string = "";
  codigoPapeleta: string = "";
  isDataEJB: boolean = false;
  isDataServer: boolean = false;
  isEJB: boolean = false;
  isServer: boolean = false;
  isPapPermiso: boolean = false;
  unidServicio: string = "";
  cboCargo: string = "";
  idCboTipoPap: number = 0;
  screenHeight: number = 0;
  hroSelectedPap: string = "";
  vNameTienda: string = "";
  arCalHoraPap: Array<any> = [];
  copyBodyList: any = [];
  arPartTimeFech: Array<any> = [];
  diffHoraPap: string = "";
  vCodeTiendaSelected: string = "";
  totalAcumulado: string = "";
  isVacacionesProgramadas: boolean = false;
  isPartTime: boolean = false;
  isLoaderHrx: boolean = false;
  cantidadPapeletas: number = 0;
  onListCargo: Array<any> = [
    { key: 'Asesor', value: 'Asesor' },
    { key: 'Gerente', value: 'Gerente' },
    { key: 'Cajero', value: 'Cajero' },
    { key: 'Almacenero', value: 'Almacenero' }
  ];
  filterProducto: string = "";
  onListCasos: Array<any> = [];
  onSelectTienda: any = {};
  onListTiendas: Array<any> = [
    { code_uns: '0003', uns: 'BBW', code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { code_uns: '0023', uns: 'VS', code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code_uns: '0024', uns: 'BBW', code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code_uns: '0010', uns: 'BBW', code: '7E', name: 'BBW LA RAMBLA', procesar: 0, procesado: -1 },
    { code_uns: '0009', uns: 'VS', code: '9D', name: 'VS LA RAMBLA', procesar: 0, procesado: -1 },
    { code_uns: '0004', uns: 'VS', code: '9B', name: 'VS PLAZA NORTE', procesar: 0, procesado: -1 },
    { code_uns: '0006', uns: 'BBW', code: '7C', name: 'BBW SAN MIGUEL', procesar: 0, procesado: -1 },
    { code_uns: '0005', uns: 'VS', code: '9C', name: 'VS SAN MIGUEL', procesar: 0, procesado: -1 },
    { code_uns: '0007', uns: 'BBW', code: '7D', name: 'BBW SALAVERRY', procesar: 0, procesado: -1 },
    { code_uns: '0012', uns: 'VS', code: '9I', name: 'VS SALAVERRY', procesar: 0, procesado: -1 },
    { code_uns: '0011', uns: 'VS', code: '9G', name: 'VS MALL DEL SUR', procesar: 0, procesado: -1 },
    { code_uns: '0013', uns: 'VS', code: '9H', name: 'VS PURUCHUCO', procesar: 0, procesado: -1 },
    { code_uns: '0019', uns: 'VS', code: '9M', name: 'VS ECOMMERCE', procesar: 0, procesado: -1 },
    { code_uns: '0016', uns: 'BBW', code: '7F', name: 'BBW ECOMMERCE', procesar: 0, procesado: -1 },
    { code_uns: '0014', uns: 'VS', code: '9K', name: 'VS MEGA PLAZA', procesar: 0, procesado: -1 },
    { code_uns: '0015', uns: 'VS', code: '9L', name: 'VS MINKA', procesar: 0, procesado: -1 },
    { code_uns: '0008', uns: 'VS', code: '9F', name: 'VSFA JOCKEY FULL', procesar: 0, procesado: -1 },
    { code_uns: '0022', uns: 'BBW', code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { code_uns: '0025', uns: 'VS', code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { code_uns: '0026', uns: 'BBW', code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { code_uns: '0001', uns: 'ADMINISTRACION', code: 'OF', name: 'ADMINISTRACION', procesar: 0, procesado: -1 }
  ];

  cboListCargo: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY' },
    { key: '9N', value: 'VS MALL AVENTURA AQP' },
    { key: '7J', value: 'BBW MALL AVENTURA AQP' },
    { key: '7E', value: 'BBW LA RAMBLA' },
    { key: '9D', value: 'VS LA RAMBLA' },
    { key: '9B', value: 'VS PLAZA NORTE' },
    { key: '7C', value: 'BBW SAN MIGUEL' },
    { key: '9C', value: 'VS SAN MIGUEL' },
    { key: '7D', value: 'BBW SALAVERRY' },
    { key: '9I', value: 'VS SALAVERRY' },
    { key: '9G', value: 'VS MALL DEL SUR' },
    { key: '9H', value: 'VS PURUCHUCO' },
    { key: '9M', value: 'VS ECOMMERCE' },
    { key: '7F', value: 'BBW ECOMMERCE' },
    { key: '9K', value: 'VS MEGA PLAZA' },
    { key: '9L', value: 'VS MINKA' },
    { key: '9F', value: 'VSFA JOCKEY FULL' },
    { key: '7A7', value: 'BBW ASIA' },
    { key: '9P', value: 'VS MALL PLAZA TRU' },
    { key: '7I', value: 'BBW MALL PLAZA TRU' },
    { key: 'OF', value: 'ADMINISTRACION' }
  ];

  displayedColumns: string[] = ['codigo_papeleta', 'Fecha', 'tipo_papeleta', 'nombre_completo', 'Accion'];

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight - 200;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private modalCtrl: ModalController, private store: StorageService, private service: ShareService) {
    this.getScreenSize();
  }


  ngOnInit() {

    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
    this.onSelectTienda = unidServicio;

    this.unidServicio = (unidServicio || {})['uns'];
    this.onListEmpleado = [];
    this.onTiempoTolerancia();
    this.socket.emit('consultaListaEmpleado', this.unidServicio);

    this.socket.on('respuesta_autorizacion', async (response) => { //AUTORIZACION HORAS EXTRA

      let index = (this.bodyList || []).findIndex((bd) => (bd || {}).fecha == ((response || [])[0] || {})['FECHA']);

      let estado = ((response || [])[0] || {})['APROBADO'] ? 'correcto' : ((response || [])[0] || {})['RECHAZADO'] ? 'rechazado' : 'aprobar';
      let aprobado = estado == "correcto" ? true : false;

      this.bodyList[index]['estado'] = estado;
      this.bodyList[index]['aprobado'] = aprobado;
      this.bodyList[index]['rechazado'] = ((response || [])[0] || {})['RECHAZADO'] ? true : false;

      if (((response || [])[0] || {})['RECHAZADO']) {
        this.service.toastError("Hora extra rechazada.", "Hora Extra");
      }

      if (!((response || [])[0] || {})['RECHAZADO']) {
        this.service.toastSuccess("Hora extra aprobada.", "Hora Extra");
      }
    });

    this.socket.on('reporteEmpleadoTienda', async (response) => { //LISTA EMPLEADOS DE TIENDA

      this.onCargarEmpleado(response);

    });

    this.socket.on('reporteHorario', async (response) => { //DATA ASISTENCIA FRONT

      let data = (response || {}).data || [];

      this.parseHuellero = data;
      this.onDataTemp = [];
      this.bodyList = [];
      this.dataVerify = [];
      this.copyBodyList = [];
      this.arPartTimeFech = [];
      await (this.parseHuellero || []).filter(async (huellero, i) => { //CALCULO PARA LAS HORAS EXTRAS

        let tipoAsc = ((huellero || {}).tpAsociado || "").split('*');
        var codigo = (huellero || {}).caja.substr(0, 2);

        if ((huellero || {}).caja.substr(2, 2) == 7) {
          codigo = (huellero || {}).caja;
        } else {
          codigo.substr(0, 1)
        }

        if (codigo == this.codeTienda) {
          //COMPROBAR SI EXISTE EL REGISTRO POR DIA
          let indexData = (this.onDataTemp || []).findIndex((data) => ((data || {}).dia == (huellero || []).dia));

          //PROCESO SI NO ESTA REGISTRADO EL DIA
          if (indexData == -1) {

            //HORAS TRABAJDAS CON O SIN PAPELETA
            let htrb = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

            if (((huellero || {})['papeleta'] || []).length) {
              htrb = this.obtenerHorasTrabajadas(htrb, (((huellero || {})['papeleta'] || [])[0] || {})['HORA_SOLICITADA']);
            }


            (this.onDataTemp || []).push({
              dia: (huellero || {}).dia,
              hr_ingreso_1: (huellero || {}).hrIn,
              hr_salida_1: (huellero || {}).hrOut,
              hr_brake: "",
              hr_ingreso_2: "",
              hr_salida_2: "",
              hr_trabajadas: htrb,
              hr_extra: 0,
              hr_faltante: 0,
              isException: (huellero || {}).isException,
              dataRegistro: [huellero]
            });

            if (huellero.tpAsociado == "**") { //PART TIME
              this.isPartTime = true;

              this.onProcesarPartTime(this.parseHuellero.length, i, {
                dia: (huellero || {}).dia,
                hr_ingreso_1: (huellero || {}).hrIn,
                hr_salida_1: (huellero || {}).hrOut,
                hr_brake: "",
                hr_ingreso_2: "",
                hr_salida_2: "",
                hr_trabajadas: this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut),
                hr_extra: 0,
                hr_faltante: 0,
                dataRegistro: [huellero]
              });
            }

            if ((huellero || {}).isException) { //UNA SOLA MARCACION TRABAJO MADRUGADA

              let indexData = (this.onDataTemp || []).findIndex((data) => ((data || {}).dia == (huellero || []).dia));

              if (huellero.tpAsociado != "**") { //DEFAULT

                let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");

                let defaultHT = "00:00";

                if (tipoAsc.length == 2) { //LACTANCIA

                  let fechaLactancia = new Date(tipoAsc[1]).toLocaleDateString().split('/'); new Date();

                  var f1 = new Date(parseInt(fechaLactancia[2]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[0])).getTime(); //FECHA DE LACTANCIA
                  var f2 = new Date(this.onDataTemp[indexData]['dia']).getTime(); //FECHA TRABAJADA

                  if (f1 >= f2) {
                    defaultHT = "07:00";
                  }
                }

                let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
                let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
                let hrxSalida = (defaultHT).split(':');
                let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

                const ToTime = (num) => {
                  var minutos: any = Math.floor((num / 60) % 60);
                  minutos = minutos < 10 ? '0' + minutos : minutos;
                  var segundos: any = num % 60;
                  segundos = segundos < 10 ? '0' + segundos : segundos;
                  return minutos + ':' + segundos;
                }

                let process = ToTime(newAcumulado);

                let fecha = new Date().toLocaleDateString().split('/'); new Date();

                let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;


                if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

                  let hr = process.split(":");

                  //CONTEO HORA EXTRA

                  let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');

                  if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {

                    this.onDataTemp[indexData]['hr_extra'] = process;//23:59

                    let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                    let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                    let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                    let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                    let aprobado = estado == "correcto" ? true : false;

                    let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));

                    if (indexData2 == -1) {
                      let obj = { documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false };
                      (this.dataVerify || []).push(obj);
                    }

                    (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                    if (estado == 'correcto') {
                      if (!this.arHoraExtra.length) {
                        this.arHoraExtra = [process];
                      } else {
                        this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                      }
                    }
                  }
                } else {
                  this.onDataTemp[indexData]['hr_faltante'] = process;
                }

              }
            }

          } else {

            if (huellero.tpAsociado == "**") { //PART TIME


              let htrb = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

              if (((huellero || {})['papeleta'] || []).length) {
             //   htrb = this.obtenerHorasTrabajadas(htrb, (((huellero || {})['papeleta'] || [])[0] || {})['HORA_SOLICITADA']);
              }

              this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], htrb);

              this.onProcesarPartTime(this.parseHuellero.length, i, {
                dia: (huellero || {}).dia,
                hr_ingreso_1: (huellero || {}).hrIn,
                hr_salida_1: (huellero || {}).hrOut,
                hr_brake: "",
                hr_ingreso_2: "",
                hr_salida_2: "",
                hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'],
                hr_extra: 0,
                hr_faltante: 0,
                dataRegistro: [huellero]
              }, true);
            }
            
            if (huellero.tpAsociado != "**") { //DEFAULT

              this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
              this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
              this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
              let hora_trb_1 = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

              this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], hora_trb_1);



              let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
              this.onDataTemp[indexData]['dataRegistro'].push(huellero);

              let defaultHT = "08:00";

              if (tipoAsc.length == 2) { //LACTANCIA

                let fechaLactancia = new Date(tipoAsc[1]).toLocaleDateString().split('/'); new Date();

                var f1 = new Date(parseInt(fechaLactancia[2]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[0])).getTime(); //FECHA DE LACTANCIA
                var f2 = new Date(this.onDataTemp[indexData]['dia']).getTime(); //FECHA TRABAJADA

                if (f1 >= f2) {
                  defaultHT = "07:00";
                }
              }

              let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
              let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
              let hrxSalida = (defaultHT).split(':');
              let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

              let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

              const ToTime = (num) => {
                var minutos: any = Math.floor((num / 60) % 60);
                minutos = minutos < 10 ? '0' + minutos : minutos;
                var segundos: any = num % 60;
                segundos = segundos < 10 ? '0' + segundos : segundos;
                return minutos + ':' + segundos;
              }

              let process = ToTime(newAcumulado);

              let fecha = new Date().toLocaleDateString().split('/'); new Date();

              let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;

              if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

                let hr = process.split(":");

                //CONTEO HORA EXTRA
                let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');

                if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {

                  this.onDataTemp[indexData]['hr_extra'] = process;//23:59

                  let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                  let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                  let estado = this.onDataTemp[indexData]['dataRegistro'].length >= 3 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                  let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                  let aprobado = estado == "correcto" ? true : false;

                  let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));

                  if (indexData2 == -1) {
                    (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false });
                  } else {
                    this.dataVerify[indexData2] = { documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false };
                  }
                  (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                  if (estado == 'correcto') {
                    if (!this.arHoraExtra.length) {
                      this.arHoraExtra = [process];
                    } else {
                      this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                    }
                  }
                }
              } else {
                this.onDataTemp[indexData]['hr_faltante'] = process;
              }

            }


          }
        }
      });
      console.log(this.dataVerify);
      if ((this.dataVerify || []).length && !this.isPartTime) {

        this.onDataTemp.filter((dt, indexData) => {

          if (((dt || {}).dataRegistro || []).length == 1) {
            let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
            let defaultHT = "08:00";
            let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
            let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
            let hrxSalida = (defaultHT).split(':');
            let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

            let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

            const ToTime = (num) => {
              var minutos: any = Math.floor((num / 60) % 60);
              minutos = minutos < 10 ? '0' + minutos : minutos;
              var segundos: any = num % 60;
              segundos = segundos < 10 ? '0' + segundos : segundos;
              return minutos + ':' + segundos;
            }

            let process = ToTime(newAcumulado);

            let fecha = new Date().toLocaleDateString().split('/'); new Date();

            let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;



            if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

              let hr = process.split(":");
              //CONTEO HORA EXTRA

              let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');

              if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {
                this.onDataTemp[indexData]['hr_extra'] = process;//23:59
                let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                let aprobado = estado == "correcto" ? true : false;

                if (indexData == -1) {
                  (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });
                }

                (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                if (estado == 'correcto') {
                  if (!this.arHoraExtra.length) {
                    this.arHoraExtra = [process];
                  } else {
                    this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                  }
                }
              }
            } else {
              this.onDataTemp[indexData]['hr_faltante'] = process;
            }
          }

          if (this.onDataTemp.length - 1 == indexData) {
            this.onVerificarHrExtra(this.dataVerify);
          }
        });


      }

      this.hroAcumulada = this.arHoraExtra[0];
      this.hroAcumuladaTotal = this.arHoraExtra[0];
    });

    if (!this.isConsulting) {
      this.onGenerarCodigoPapeleta();
      this.onListTipoPapeleta();
      this.onListPapeleta();
      this.onPermisosTienda();
    }
  }

  onCargarEmpleado(response) {
    let dataEmpleado = (response || {}).data || [];
    let codigo_uns = (this.onListTiendas || []).find((tienda) => (tienda || {}).code == this.codeTienda);

    (dataEmpleado || []).filter((emp) => {
      if (response.id == "EJB") {
        this.arDataEJB = (response || {}).data;
      }

      if (this.arDataEJB.length) {
        (this.arDataEJB || []).filter(async (ejb) => {

          if ((codigo_uns || {}).code_uns == '0016') {
            if ((ejb || {}).code_unid_servicio == '0016' || (ejb || {}).code_unid_servicio == '0019') {

              let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
              if (exist == -1) {
                (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                (this.parseEJB || []).push({
                  nombre_completo: (ejb || {}).nombre_completo,
                  documento: (ejb || {}).nro_documento,
                  codigo_tienda: this.codeTienda
                });
              }
            }
          } else {
            if ((ejb || {}).code_unid_servicio == (codigo_uns || {}).code_uns) {

              let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
              if (exist == -1) {
                (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                (this.parseEJB || []).push({
                  nombre_completo: (ejb || {}).nombre_completo,
                  documento: (ejb || {}).nro_documento,
                  codigo_tienda: this.codeTienda
                });
              }
            }
          }


        });
      }
    });
  }

  onProcesarPartTime(length, index, row, isUpdate?) {
    this.dataVerify = [];

    let fecha = new Date(row.dia).toLocaleDateString().split('/'); new Date();

    var dias = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];

    var indice = new Date((parseInt(fecha[1])) + "/" + parseInt(fecha[0]) + "/" + (parseInt(fecha[2]))).getDay();

    let estado = row.dataRegistro.length >= 3 ? 'aprobar' : 'correcto';
    let aprobado = estado == "correcto" ? true : false;

    if (!isUpdate) {
      this.arPartTimeFech.push({
        dia: row.dia, diaNom: dias[indice], hr_trabajadas: row.hr_trabajadas, indice: indice
      });
    } else {
      let indexData = (this.arPartTimeFech || []).findIndex((data) => ((data || {}).dia == (row || {}).dia));

      this.arPartTimeFech[indexData]['hr_trabajadas'] = row.hr_trabajadas;
      console.log(this.arPartTimeFech);
    }

    if (length - 1 == index) {
      const ascDates = this.arPartTimeFech.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });

      this.arPartTimeFech = ascDates;

      let count = "00:00";
      let arFechas = [];

      this.arPartTimeFech.filter((pt, index) => {

        let hr = (pt.hr_trabajadas || "").split(":");
        let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra part time');

        let hora = parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) ? `${hr[0]}:${hr[1]}` : `${hr[0]}:00`; //LIMITIE DE HORA VALIDA

        if ((this.arPartTimeFech[index] || {}).indice > (this.arPartTimeFech[index + 1] || {}).indice || pt.indice == 6) {

          count = this.obtenerHorasTrabajadas(hora, count);

          if (((this.arPartTimeFech[index] || {}).indice > (this.arPartTimeFech[index + 1] || {}).indice) || pt.indice == 6) {

            this.arPartTimeFech[index]["hrTrabajadas"] = count;

            let hrxLlegada = count.split(':');

            let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);

            let hrxSalida = ("24:00").split(':');
            let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

            let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

            const ToTime = (num) => {
              var minutos: any = Math.floor((num / 60) % 60);
              minutos = minutos < 10 ? '0' + minutos : minutos;
              var segundos: any = num % 60;
              segundos = segundos < 10 ? '0' + segundos : segundos;
              return minutos + ':' + segundos;
            };

            let process = ToTime(newAcumulado);

            arFechas.push({ dia: (this.arPartTimeFech[index] || {}).dia, hr_trabajadas: (this.arPartTimeFech[index] || {}).hr_trabajadas });

            if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[0]) >= 24) {

              this.arPartTimeFech[index]["fechas"] = arFechas;
              this.arPartTimeFech[index]["hrExtra"] = process;

              let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra part time');
              console.log(this.arPartTimeFech[index]["hrTrabajadas"]);
              // LIMITE HORA PART TIME

              if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[0]) == 24) {
                if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1])) {
                  this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.arPartTimeFech[index]["hrTrabajadas"], fecha: this.arPartTimeFech[index]["fechas"][0]['dia'], hrx_acumulado: this.arPartTimeFech[index]["hrExtra"], extra: this.arPartTimeFech[index]["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: this.arPartTimeFech[index]["fechas"] });
                }
              } else {
                this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.arPartTimeFech[index]["hrTrabajadas"], fecha: this.arPartTimeFech[index]["fechas"][0]['dia'], hrx_acumulado: this.arPartTimeFech[index]["hrExtra"], extra: this.arPartTimeFech[index]["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: this.arPartTimeFech[index]["fechas"] });
              }

            }
          }


          count = "00:00";
          arFechas = [];


        } else {
          arFechas.push({ dia: (this.arPartTimeFech[index] || {}).dia, hr_trabajadas: (this.arPartTimeFech[index] || {}).hr_trabajadas });

          count = this.obtenerHorasTrabajadas(hora, count);
        }


        if (this.arPartTimeFech.length - 1 == index) { // TERMINO DEL ARRAY

          this.onVerificarHrExtra(this.dataVerify);
        }

      });

    }
  }

  onSearchFechasPartTime(index) {
    this.arSelectRegistro = this.dataVerify[index].arFechas;
  }

  onVerificarHrExtra(dataVerificar) {

    let parms = {
      url: '/recursos_humanos/pap/horas_extras',
      body: dataVerificar
    };

    this.service.post(parms).then(async (response) => {
      const ascDates = response.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });
      this.bodyList = [];
      this.copyBodyList = [];
      this.bodyList = ascDates;

      this.hroAcumulada = "";
      this.hroAcumuladaTotal = "";
      this.arHoraExtra = [];

      this.bodyList.filter((dt, i) => {
        this.bodyList[i]['hrx_solicitado'] = "00:00";
        this.bodyList[i]['comentario'] = (((dt || {}).comentario || [])[0] || {})['COMENTARIO'];

        let sobrante = dt.hrx_sobrante.split(':');
        let hSobrante = parseInt(sobrante[0]) * 60 + parseInt(sobrante[1]);

        if (hSobrante > 0) {
          this.bodyList[i]['extra'] = dt.hrx_sobrante;
        }
        this.bodyList[i]['aprobado'] = dt.aprobado;
        this.bodyList[i]['estado'] = dt.estado;

        if (!dt.seleccionado && dt.aprobado && !dt.verify) {

          if (!this.arHoraExtra.length && dt.estado != "utilizado" && dt.estado != 'rechazado') {
            this.arHoraExtra = [dt.extra];
          } else {
            if ((dt.estado == "correcto" || dt.estado == "aprobado") && dt.estado != 'rechazado') {

              this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
            }
          }
        }

        if (this.bodyList.length - 1 == i) {

          this.hroAcumulada = this.arHoraExtra[0];
          this.hroAcumuladaTotal = this.arHoraExtra[0];

          this.store.removeStore('mt-hrExtra');
          this.store.setStore('mt-hrExtra', JSON.stringify(ascDates));
        }
      });
    });

  }

  onListPapeleta() {
    let parms = {
      url: '/recursos_humanos/pap/lista/papeleta',
      body: [{ codigo_tienda: this.codeTienda }]
    };

    this.service.post(parms).then(async (response) => {
      const ascDates = response.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });

      this.listaPapeletas = ascDates;

      (this.listaPapeletas || []).filter((data, i) => {
        let tipo = this.onListCasos.filter((tp) => tp.key == data['id_tipo_papeleta']);
        this.listaPapeletas[i]['tipo'] = tipo[0]['value'];
      });

      this.dataSource = new MatTableDataSource(this.listaPapeletas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onListTipoPapeleta() {
    let parms = {
      url: '/papeleta/lista/tipo_papeleta'
    };

    this.service.get(parms).then(async (response) => {
      (response || []).filter((tp) => {
        this.onListCasos.push({ key: tp.ID_TIPO_PAPELETA, value: tp.DESCRIPCION });
      });
    });
  }

  async onChangeSelect(data: any) {
    const self = this;

    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";


    if (index == 'cboCasos') {
      this.isVacacionesProgramadas = false;

      this.horaSalida = "";
      this.horaLlegada = "";

      this.diffHoraPap = "";
      this.hroAcumulada = "";
      this.hroAcumuladaTotal = "";
      // $("#cboCasos span#cboCasos")[0].innerText = (selectData || {}).value;
      //$('#horaLlegada input')[0].value = "";
      //$('#horaSalida input')[0].value = "";
    }

    if (index == 'cboCargo') {
      $("#cboCargo span#cboCargo")[0].innerText = (selectData || {}).value;
    }

    if (index == "cboEmpleado" && !this.isConsulting) {
      this.horaSalida = "";
      this.horaLlegada = "";
      $('#horaLlegada input')[0].value = "";
      $('#horaSalida input')[0].value = "";

      $("#cboEmpleado span#cboEmpleado")[0].innerText = (selectData || {}).value;
    }

    if ((selectData || {}).value != 'Compensacion de horas trabajadas' && index == 'cboCasos') {
      if (index != "cboEmpleado") {
        this[index] = (selectData || {}).value;
        this.idCboTipoPap = (selectData || {}).key;
      }
    }

    if ((selectData || {}).value == 'Vacaciones programadas' && index == 'cboCasos') {
      if (index != "cboEmpleado") {
        this.isVacacionesProgramadas = true;
        this.bodyList = [];
      }
    }

    if (index != 'cboCargo') {
      if (this.cboCasos == '7' || this.cboCasos == "Compensacion de horas trabajadas" || this.isConsulting || (index == "cboEmpleado" && this.idCboTipoPap)) {

        this.isPartTime = false;

        if (index != "cboEmpleado") {
          this[index] = (selectData || {}).value;
          this.idCboTipoPap = (selectData || {}).key;
        }

        let dateNow = new Date();

        var año = dateNow.getFullYear();
        var mes = (dateNow.getMonth() + 1);
        let dayNow = dateNow.getDay();
        let day = new Date(dateNow).toLocaleDateString().split('/');
        let añoIn = año;
        let mesIn = mes > 1 ? mes - 1 : mes;
        let diaR = mes == 1 ? 1 : day[0];
        let configuracion = [{
          fechain: `${añoIn}-${mesIn}-${1}`,
          fechaend: `${año}-${mes}-${day[0]}`,
          nro_documento: this.cboEmpleado
        }];


        let cantidadPap = this.listaPapeletas.filter((pap) => (pap || {}).documento == this.cboEmpleado);

        this.cantidadPapeletas = (cantidadPap || []).length;
        //SE CONSULTA HORAS EXTRAS DE 2 MESES O 60 DIAS
        this.socket.emit('consultaHorasTrab', configuracion);
      }
    }


    if (index == 'cboTiendaConsulting') {
      this.socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });

      let perfil = this.store.getStore("mt-profile");

      this.store.setStore("mt-profile", JSON.stringify({
        code: (selectData || {}).key,
        mt_name_1: (perfil || {}).mt_name_1,
        mt_nivel: (perfil || {}).mt_nivel
      }));

      let profileUser = this.store.getStore('mt-profile');
      this.nameTienda = profileUser.mt_name_1.toUpperCase();
      this.codeTienda = profileUser.code.toUpperCase();
      let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
      this.unidServicio = (unidServicio || {})['uns'];
      this.onListEmpleado = [];
      this.socket.emit('consultaListaEmpleado', this.unidServicio);

      this.socket.on('respuesta_autorizacion', async (response) => { //AUTORIZACION HORAS EXTRA

        let index = (this.bodyList || []).findIndex((bd) => (bd || {}).fecha == ((response || [])[0] || {})['FECHA']);

        let estado = ((response || [])[0] || {})['APROBADO'] ? 'correcto' : ((response || [])[0] || {})['RECHAZADO'] ? 'rechazado' : 'aprobar';
        let aprobado = estado == "correcto" ? true : false;

        this.bodyList[index]['estado'] = estado;
        this.bodyList[index]['aprobado'] = aprobado;
        this.bodyList[index]['rechazado'] = ((response || [])[0] || {})['RECHAZADO'] ? true : false;

        if (((response || [])[0] || {})['RECHAZADO']) {
          this.service.toastError("Hora extra rechazada.", "Hora Extra");
        }

        if (!((response || [])[0] || {})['RECHAZADO']) {
          this.service.toastSuccess("Hora extra aprobada.", "Hora Extra");
        }
      });

      this.socket.on('reporteEmpleadoTienda', async (response) => { //LISTA EMPLEADOS DE TIENDA

        let dataEmpleado = (response || {}).data || [];
        let codigo_uns = (this.onListTiendas || []).find((tienda) => (tienda || {}).code == this.codeTienda);

        (dataEmpleado || []).filter((emp) => {
          if (response.id == "EJB") {
            this.arDataEJB = (response || {}).data;
          }

          if (this.arDataEJB.length) {
            (this.arDataEJB || []).filter(async (ejb) => {

              if ((codigo_uns || {}).code_uns == '0016') {
                if ((ejb || {}).code_unid_servicio == '0016' || (ejb || {}).code_unid_servicio == '0019') {

                  let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
                  if (exist == -1) {
                    (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                    (this.parseEJB || []).push({
                      nombre_completo: (ejb || {}).nombre_completo,
                      documento: (ejb || {}).nro_documento,
                      codigo_tienda: this.codeTienda
                    });
                  }
                }
              } else {
                if ((ejb || {}).code_unid_servicio == (codigo_uns || {}).code_uns) {

                  let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
                  if (exist == -1) {
                    (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                    (this.parseEJB || []).push({
                      nombre_completo: (ejb || {}).nombre_completo,
                      documento: (ejb || {}).nro_documento,
                      codigo_tienda: this.codeTienda
                    });
                  }
                }
              }


            });
          }
        });

      });

      this.socket.on('reporteHorario', async (response) => { //DATA ASISTENCIA FRONT

        let data = (response || {}).data || [];

        this.parseHuellero = data;
        this.onDataTemp = [];
        this.bodyList = [];
        this.dataVerify = [];
        this.copyBodyList = [];
        this.arPartTimeFech = [];
        await (this.parseHuellero || []).filter(async (huellero, i) => { //CALCULO PARA LAS HORAS EXTRAS

          let tipoAsc = ((huellero || {}).tpAsociado || "").split('*');
          var codigo = (huellero || {}).caja.substr(0, 2);

          if ((huellero || {}).caja.substr(2, 2) == 7) {
            codigo = (huellero || {}).caja;
          } else {
            codigo.substr(0, 1)
          }

          if (codigo == this.codeTienda) {

            let indexData = (this.onDataTemp || []).findIndex((data) => ((data || {}).dia == (huellero || []).dia));

            if (indexData == -1) {

              let htrb = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

              if (((huellero || {})['papeleta'] || []).length) {
               // htrb = this.obtenerHorasTrabajadas(htrb, (((huellero || {})['papeleta'] || [])[0] || {})['HORA_SOLICITADA']);
              }

              if (huellero.tpAsociado == "**") { //PART TIME
                console.log((huellero || {}).dia);
                (this.onDataTemp || []).push({
                  dia: (huellero || {}).dia,
                  hr_ingreso_1: (huellero || {}).hrIn,
                  hr_salida_1: (huellero || {}).hrOut,
                  hr_brake: "",
                  hr_ingreso_2: "",
                  hr_salida_2: "",
                  hr_trabajadas: htrb,
                  hr_extra: 0,
                  hr_faltante: 0,
                  isException: (huellero || {}).isException,
                  dataRegistro: [huellero]
                });

                this.isPartTime = true;
                this.onProcesarPartTime(this.parseHuellero.length, i, {
                  dia: (huellero || {}).dia,
                  hr_ingreso_1: (huellero || {}).hrIn,
                  hr_salida_1: (huellero || {}).hrOut,
                  hr_brake: "",
                  hr_ingreso_2: "",
                  hr_salida_2: "",
                  hr_trabajadas: this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut),
                  hr_extra: 0,
                  hr_faltante: 0,
                  dataRegistro: [huellero]
                });
              }

              if ((huellero || {}).isException) { //UNA SOLA MARCACION TRABAJO MADRUGADA

                let indexData = (this.onDataTemp || []).findIndex((data) => ((data || {}).dia == (huellero || []).dia));

                if (huellero.tpAsociado != "**") { //DEFAULT

                  let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");

                  let defaultHT = "00:00";

                  if (tipoAsc.length == 2) { //LACTANCIA

                    let fechaLactancia = new Date(tipoAsc[1]).toLocaleDateString().split('/'); new Date();

                    var f1 = new Date(parseInt(fechaLactancia[2]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[0])).getTime(); //FECHA DE LACTANCIA
                    var f2 = new Date(this.onDataTemp[indexData]['dia']).getTime(); //FECHA TRABAJADA

                    if (f1 >= f2) {
                      defaultHT = "07:00";
                    }
                  }

                  let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
                  let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
                  let hrxSalida = (defaultHT).split(':');
                  let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                  let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

                  const ToTime = (num) => {
                    var minutos: any = Math.floor((num / 60) % 60);
                    minutos = minutos < 10 ? '0' + minutos : minutos;
                    var segundos: any = num % 60;
                    segundos = segundos < 10 ? '0' + segundos : segundos;
                    return minutos + ':' + segundos;
                  }

                  let process = ToTime(newAcumulado);

                  let fecha = new Date().toLocaleDateString().split('/'); new Date();

                  let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;


                  if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

                    let hr = process.split(":");

                    //CONTEO HORA EXTRA

                    let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');


                    if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {

                      this.onDataTemp[indexData]['hr_extra'] = process;//23:59

                      let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                      let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                      let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                      let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                      let aprobado = estado == "correcto" ? true : false;

                      let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));

                      if (indexData2 == -1) {
                        let obj = { documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false };
                        (this.dataVerify || []).push(obj);
                      }

                      (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                      if (estado == 'correcto') {
                        if (!this.arHoraExtra.length) {
                          this.arHoraExtra = [process];
                        } else {
                          this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                        }
                      }
                    }
                  } else {
                    this.onDataTemp[indexData]['hr_faltante'] = process;
                  }

                }
              }

            } else {

              if (huellero.tpAsociado == "**") { //PART TIME


                let htrb = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

                if (((huellero || {})['papeleta'] || []).length) {
               //   htrb = this.obtenerHorasTrabajadas(htrb, (((huellero || {})['papeleta'] || [])[0] || {})['HORA_SOLICITADA']);
                }

                this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], htrb);

                this.onProcesarPartTime(this.parseHuellero.length, i, {
                  dia: (huellero || {}).dia,
                  hr_ingreso_1: (huellero || {}).hrIn,
                  hr_salida_1: (huellero || {}).hrOut,
                  hr_brake: "",
                  hr_ingreso_2: "",
                  hr_salida_2: "",
                  hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'],
                  hr_extra: 0,
                  hr_faltante: 0,
                  dataRegistro: [huellero]
                }, true);
              }

              if (huellero.tpAsociado != "**") { //DEFAULT

                this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
                this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
                this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
                let hora_trb_1 = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);
                //let hora_trb_2 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_2'], this.onDataTemp[indexData]['hr_salida_2']);

                this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], hora_trb_1);

                let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
                this.onDataTemp[indexData]['dataRegistro'].push(huellero);

                let defaultHT = "08:00";

                if (tipoAsc.length == 2) { //LACTANCIA

                  let fechaLactancia = new Date(tipoAsc[1]).toLocaleDateString().split('/'); new Date();

                  var f1 = new Date(parseInt(fechaLactancia[2]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[0])).getTime(); //FECHA DE LACTANCIA
                  var f2 = new Date(this.onDataTemp[indexData]['dia']).getTime(); //FECHA TRABAJADA

                  if (f1 >= f2) {
                    defaultHT = "07:00";
                  }
                }

                let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
                let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
                let hrxSalida = (defaultHT).split(':');
                let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

                const ToTime = (num) => {
                  var minutos: any = Math.floor((num / 60) % 60);
                  minutos = minutos < 10 ? '0' + minutos : minutos;
                  var segundos: any = num % 60;
                  segundos = segundos < 10 ? '0' + segundos : segundos;
                  return minutos + ':' + segundos;
                }

                let process = ToTime(newAcumulado);

                let fecha = new Date().toLocaleDateString().split('/'); new Date();

                let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;


                if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

                  let hr = process.split(":");

                  //CONTEO HORA EXTRA

                  let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');


                  if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {

                    this.onDataTemp[indexData]['hr_extra'] = process;//23:59

                    let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                    let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

                    let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                    let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                    let aprobado = estado == "correcto" ? true : false;

                    let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));

                    if (indexData2 == -1) {
                      (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false });
                    } else {
                      this.dataVerify[indexData2] = { documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false };
                    }
                    (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                    if (estado == 'correcto') {
                      if (!this.arHoraExtra.length) {
                        this.arHoraExtra = [process];
                      } else {
                        this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                      }
                    }
                  }
                } else {
                  this.onDataTemp[indexData]['hr_faltante'] = process;
                }

              }


            }
          }
        });

        if ((this.dataVerify || []).length && !this.isPartTime) {

          this.onDataTemp.filter((dt, indexData) => {

            if (((dt || {}).dataRegistro || []).length == 1) {

              let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
              let defaultHT = "08:00";
              let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
              let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
              let hrxSalida = (defaultHT).split(':');
              let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

              let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

              const ToTime = (num) => {
                var minutos: any = Math.floor((num / 60) % 60);
                minutos = minutos < 10 ? '0' + minutos : minutos;
                var segundos: any = num % 60;
                segundos = segundos < 10 ? '0' + segundos : segundos;
                return minutos + ':' + segundos;
              }

              let process = ToTime(newAcumulado);

              let fecha = new Date().toLocaleDateString().split('/'); new Date();

              let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;


              if ((hora_1_pr[0] >= 8 && validFecha) || this.onDataTemp[indexData].isException) {

                let hr = process.split(":");

                //CONTEO HORA EXTRA
                let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra default');
                if (parseInt(hr[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1]) || parseInt(hr[0]) > 0 || this.onDataTemp[indexData].isException) {
                  this.onDataTemp[indexData]['hr_extra'] = process;//23:59
                  let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                  let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);
                  let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 || this.onDataTemp[indexData]['hr_salida_2'] == '23:59:59' || this.onDataTemp[indexData]['hr_ingreso_1'] == '00:00:00' ? 'aprobar' : 'correcto';
                  let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);

                  let aprobado = estado == "correcto" ? true : false;


                  let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));

                  if (indexData2 == -1) {
                    (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });
                  }

                  (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });

                  if (estado == 'correcto') {
                    if (!this.arHoraExtra.length) {
                      this.arHoraExtra = [process];
                    } else {
                      this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                    }
                  }
                }
              } else {
                this.onDataTemp[indexData]['hr_faltante'] = process;
              }
            }

            if (this.onDataTemp.length - 1 == indexData) {
              this.onVerificarHrExtra(this.dataVerify);
            }
          });


        }

        this.hroAcumulada = this.arHoraExtra[0];
        this.hroAcumuladaTotal = this.arHoraExtra[0];
      });

      this.onGenerarCodigoPapeleta();
      this.onListTipoPapeleta();
      this.onListPapeleta();

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

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
  }

  obtenerHoraExtra(hr1, hr2) {
    let diferencia = 0;
    let hora_1_pr = hr1.split(":");
    let hora_2_pr = hr2.split(":");
    let response = "";
    let hora_1 = this.obtenerHoras(hr1);
    let hora_2 = this.obtenerHoras(hr2);
    let minutos = this.obtenerMinutos(hr1, hr2);

    let hrExtr = (minutos[0] > 0) ? minutos[0] : 0;

    if (hora_1 > hora_2) {
      diferencia = hora_1 - hora_2;
    } else {
      diferencia = hora_2 - hora_1;
    }

    let hr_resta: number = (hora_1_pr[1] > 0) ? parseInt(hora_1_pr[1]) : parseInt(hora_2_pr[1]);
    let horaResult = ((diferencia - hr_resta) / 60).toString();
    let minutosParse = minutos[1] < 0 ? minutos[1] * -1 : minutos[1];
    response = `${parseInt(horaResult) + hrExtr}:${(minutosParse < 10) ? '0' + minutosParse : minutosParse}`

    return response;
  }

  onDiferenciaCalc(hr1, hr2) {
    let response = "";
    var hora_inicio = hr1;
    var hora_final = hr2;

    // Calcula los minutos de cada hora
    var minutos_inicio = hora_inicio.split(':')
      .reduce((p, c) => parseInt(p) * 60 + parseInt(c));
    var minutos_final = hora_final.split(':')
      .reduce((p, c) => parseInt(p) * 60 + parseInt(c));

    // Diferencia de minutos
    var diferencia = minutos_final - minutos_inicio;

    // Cálculo de horas y minutos de la diferencia
    var horas = Math.floor(diferencia / 60);
    var minutos = diferencia % 60;

    response = `${horas}:${(minutos < 10) ? '0' + minutos : minutos}`;

    return response;
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



  /*
    obtenerDiferenciaHora(hr1, hr2) {
   
      let diferencia = 0;
      let hora_1 = this.obtenerHoras(hr1);
      let hora_2 = this.obtenerHoras(hr2);
      let minutos = this.obtenerMinutos(hr1, hr2);
      let min_1 = 0;
      let min_ultimate = 0;
      let hrExtr = 0;
      let response = "";
      if (minutos[1] > 0) {
        hrExtr = (minutos[0] > 0) ? minutos[0] : 0;
      }
   
      if (hora_1 > hora_2) {
   
        diferencia = hora_1 - hora_2;
      } else {
        diferencia = hora_2 - hora_1;
      }
   
      let hora_1_pr = hr1.split(":");
      let hora_2_pr = hr2.split(":");
   
      if (hora_2 == 0 && (hora_2_pr[1] > hora_1_pr[1])) {
   
        min_1 = parseInt(hora_1_pr[1]) + 60;
        min_ultimate = min_1 - parseInt(hora_2_pr[1]);
        diferencia = parseInt(hora_1_pr[0]) - 1;
        response = `${diferencia}:${(min_ultimate < 10) ? '0' + min_ultimate : min_ultimate}`
      } else {
        let hr_resta: number = (hora_1_pr[1] > 0) ? parseInt(hora_1_pr[1]) : parseInt(hora_2_pr[1]);
        let horaResult = ((diferencia - hr_resta) / 60).toString();
        response = `${parseInt(horaResult) + hrExtr}:${(minutos[1] < 10) ? '0' + minutos[1] : minutos[1]}`
      }
   
      return response;
    }
  */

  onPermisosTienda() {
    let parms = {
      url: '/security/configuracion/permisos/hp'
    };
    this.service.get(parms).then((response) => {
      this.dataViewPermiso = response || [];
      //this.isPapPermiso = response || [];
    });
  }

  onCaledar(ev) {

    if (ev.isTime) {
      this[ev.id] = ev.value;

      if (this.horaSalida.length && this.horaLlegada.length && this.cboCasos == 'Compensacion de horas trabajadas') {


        this.isLoaderHrx = true;
        setTimeout(() => {
          this.diffHoraPap = "00:00";
          this.diffHoraPap = this.onDiferenciaCalc(this.horaSalida, this.horaLlegada);
          let hrxLlegada = this.hroAcumuladaTotal.split(':');
          let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);

          let hrxSalida = this.diffHoraPap.split(':');
          let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

          if (salida <= 480) {
            if (llegada > salida || llegada == salida) {
              this.onCalcHorasSolicitadas();
              let newAcumulado = llegada > salida ? llegada - salida : salida - llegada;

              const ToTime = (num) => {
                var minutos: any = Math.floor((num / 60) % 60);
                minutos = minutos < 10 ? '0' + minutos : minutos;
                var segundos: any = num % 60;
                segundos = segundos < 10 ? '0' + segundos : segundos;
                return minutos + ':' + segundos;
              }

              this.hroAcumulada = ToTime(newAcumulado);
              this.isLoaderHrx = false;
            } else {
              this.isLoaderHrx = false;
              this.service.toastError("Las horas solicitadas no pueden ser mayor al acumulado...!!!", "Papeleta");
            }
          } else {
            this.isLoaderHrx = false;
            this.service.toastError("solo puede solicitar 8 horas por papeleta..!!", "Papeleta");
          }
        }, 1500);



      }
    }

    /*
        if (ev.isDefault) { //VERIFICACION DE FECHA ANTERIOR PAPELETA
          let dateNow = new Date();
    
          let day = new Date(dateNow).toLocaleDateString().split('/');
    
          let date = new Date(ev.value).toLocaleDateString().split('/');
          var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
          var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));
    
          if (f1.getTime() < f2.getTime()) {
            this.service.toastError("La fecha seleccionada no puede ser anterior a la actual.", "Papeleta");
          }
        }
    */

    if (ev.isDefault) {
      let date = new Date(ev.value).toLocaleDateString().split('/');
      this[ev.id] = `${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`;

      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));

      (this.dataViewPermiso || []).filter((tienda) => {
        //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
        if (this.codeTienda == (tienda || {}).SERIE_TIENDA) {
          console.log((f1.getTime(), f2.getTime()), (tienda || {}).IS_FREE_PAPELETA);
          if ((f1.getTime() < f2.getTime()) && !(tienda || {}).IS_FREE_PAPELETA) {

            this.service.toastError("La fecha seleccionada no puede ser anterior a la actual.", "Papeleta");
          } else {
            if (this.vFechaDesde.length && this.vFechaHasta.length && this.cboCasos == 'Compensacion de horas trabajadas') {
              if (this.vFechaDesde != this.vFechaHasta) {
                this.service.toastError("Las fechas de salida y entrada deben ser iguales..!!", "Papeleta");
              }
            }
          }
        }
      });
    }
  }


  onCalcHorasSolicitadas() {
    this.diffHoraPap = "00:00";
    this.diffHoraPap = this.onDiferenciaCalc(this.horaSalida, this.horaLlegada);

    let partDiff = this.diffHoraPap.split(':');
    let solicitado = 0;
    solicitado = parseInt(partDiff[0]) * 60 + parseInt(partDiff[1]);
    let tot = solicitado;
    let tot2 = solicitado;
    let i = 0;
    let nextProcess = true;
    this.bodyList = this.store.getStore("mt-hrExtra");

    this.bodyList.filter((hrx, i) => {
      this.bodyList[i]['hrx_tomada'] = "00:00";
      this.bodyList[i]['hrx_sobrante'] = "00:00";
      this.bodyList[i]['checked'] = false;
    });

    do {

      let estado = this.bodyList[i]['estado'] || "";

      if ((estado == 'correcto' || estado == 'aprobado') && !this.bodyList[i]['seleccionado']) {
        let parseTime = "00:00";

        const ToTime = (num) => {

          var minutos: any = Math.floor((num / 60) % 60);
          minutos = minutos < 10 ? '0' + minutos : minutos;
          var segundos: any = num % 60;
          segundos = segundos < 10 ? '0' + segundos : segundos;
          return minutos + ':' + segundos;
        }

        if (nextProcess) {

          let object = this.bodyList[i]['extra'] || "";

          let hora = object;

          let parts = hora.split(':');

          var total = parseInt(parts[0]) * 60 + parseInt(parts[1]);

          tot2 = tot2 - total;

          this.bodyList[i]['hrx_solicitado'] = (tot2 < 0 ? ToTime(tot2 < 0 ? tot2 * -1 : tot2) : parseTime) == "00:00" ? this.bodyList[i]['extra'] : ToTime(tot);

          tot = tot - total;

          this.bodyList[i]['hrx_sobrante'] = tot < 0 ? ToTime(tot < 0 ? tot * -1 : tot) : parseTime;

          this.bodyList[i]['checked'] = true;
          this.bodyList[i]['estado'] = this.bodyList[i]['hrx_sobrante'] == "00:00" ? "utilizado" : "correcto";
          this.bodyList[i]['seleccionado'] = this.bodyList[i]['estado'] == 'utilizado' ? true : false;
          if (tot < 0 || tot == 0) {
            nextProcess = false;
          }
        }
      }

      i += 1;
    }
    while (nextProcess);

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

  onRecalcHoras(ev, fecha) {
    this.diffHoraPap = "00:00";
    this.arHoraExtra = [];
    this.arHoraTomadaCalc = [];

    if (ev.target.checked) {
      this.bodyList = this.store.getStore("mt-hrExtra");
      let index = this.bodyList.findIndex((bd) => bd.fecha == fecha);

      this.bodyList[index]['seleccionado'] = false;
      this.bodyList[index]['verify'] = false;
      this.bodyList[index]['old_extra'] = this.bodyList[index]['hrx_acumulado'];

      this.bodyList.filter((ext, i) => {
        //CALCULO PARA LAS HORAS TOMADAS
        if (ext.seleccionado && !ext.verify) {
          if (!this.arHoraTomadaCalc.length) {
            this.arHoraTomadaCalc = [ext.extra];
          } else {
            this.arHoraTomadaCalc[0] = this.obtenerDiferenciaHora(ext.extra, this.diffHoraPap);
          }
        }
        //CALCULO PARA LAS HORAS RESIDUALES
        if (!ext.seleccionado && ext.aprobado) {
          if (!this.arHoraExtra.length) {
            this.arHoraExtra = [ext.old_extra];
          } else {
            this.bodyList[index]['extra'] = this.obtenerDiferenciaHora(this.bodyList[index]['hrx_acumulado'], this.diffHoraPap);
            this.arHoraExtra[0] = this.obtenerDiferenciaHora(ext.hrx_acumulado, this.diffHoraPap);
          }
        }


      });
    } else {

      let index = this.bodyList.findIndex((bd) => bd.fecha == fecha);

      this.bodyList[index]['seleccionado'] = false;
      this.bodyList[index]['verify'] = false;
      this.bodyList[index]['old_extra'] = this.bodyList[index]['hrx_acumulado'];
      this.bodyList[index]['extra'] = this.bodyList[index]['hrx_acumulado'];
    }

    this.hroAcumulada = this.arHoraExtra[0];
    this.hroTomada = this.arHoraTomadaCalc[0] || '00:00';
  }

  onAprobarExtra(fecha) {
    this.arHoraExtra = [];
    let index = this.bodyList.findIndex((bd) => bd.fecha == fecha);
    let indexH = this.arCopiHoraExtra.findIndex((ext) => ext.fecha == fecha);

    this.bodyList[index]['estado'] = 'correcto';
    this.arCopiHoraExtra[indexH]['estado'] = 'correcto';

    this.arCopiHoraExtra.filter((dt) => {
      if (dt.estado == 'correcto') {
        if (!this.arHoraExtra.length) {
          this.arHoraExtra = [dt.extra];
        } else {
          this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
        }
      }
    });

    this.hroAcumulada = this.arHoraExtra[0];
  }

  onExcelExport() {
    const self = this;
    this.exportAsExcelFile(this.onDataTemp, "Reporte_registro_asistencia");
  }

  onSearchRegistro(fecha) {
    let dataSelect = this.onDataTemp.find((dt) => dt.dia == fecha);
    this.arSelectRegistro = dataSelect.dataRegistro;
  }

  onBack() {
    this.arSelectRegistro = [];
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const self = this;
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

  onAutorizacion(ev) { //SOLICITAR APROBACION DE HORAS EXTRA
    let ejb = this.parseEJB.find((ejb) => ejb.documento == this.cboEmpleado);
    let parse = {
      hora_extra: ev.extra,
      nro_documento: ev.documento,
      nombre_completo: ejb.nombre_completo,
      aprobado: ev.aprobado,
      fecha: ev.fecha,
      codigo_tienda: this.codeTienda
    };
    this.socket.emit('solicitar_aprobacion_hrx', parse);

    this.service.toastSuccess("Solicitud enviada.", "Hora Extra");
  }

  onGenerarCodigoPapeleta() { //GENERAR CODIGO DE LA PAPELETA

    let parms = {
      url: '/recursos_humanos/pap/gen_codigo_pap',
      body: {
        "serie_tienda": this.codeTienda
      }
    };
    this.service.post(parms).then((response) => {
      this.isResetCalendarComp = false;
      this.isResetForm = false;
      this.codigoPapeleta = (response || {})['codigo'];
    })
  }

  async onSavePapeleta() { //GUARDAR PAPELETA
    let hrxSalida = this.diffHoraPap.split(':');
    let salida = (parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1])) || 0;

    if (salida <= 480) { // 8 HORAS POR PAPELETA
      let dataPapeleta = [];
      let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
      let dateNow = new Date();
      let day = new Date(dateNow).toLocaleDateString().split('/');
      let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;
      let caso = this.onListCasos.find((cs) => cs.value == this.cboCasos) || {};
      let arVerify = [];
      let isErrorHSolicitada = false;
      (dataPapeleta || []).push({
        codigo_papeleta: this.codigoPapeleta,
        nombre_completo: ((ejb || [])[0] || {})['nombre_completo'] || "",
        documento: ((ejb || [])[0] || {})['documento'],
        id_tipo_pap: (caso || {}).key,
        cargo_empleado: this.cboCargo,
        fecha_desde: this.vFechaDesde,
        fecha_hasta: this.vFechaHasta,
        hora_salida: this.horaSalida,
        hora_llegada: this.horaLlegada,
        hora_acumulado: this.hroAcumuladaTotal,
        hora_solicitada: this.diffHoraPap,
        codigo_tienda: this.codeTienda,
        fecha_creacion: fechaActual,
        descripcion: this.vObservacion,
        horas_extras: this.bodyList || []
      });

      await (dataPapeleta || []).filter((pap, i) => {
        Object.keys(pap).filter((property) => {
          if (this.cboCasos == "Compensacion de horas trabajadas") {
            if ((pap[property] == "" || typeof pap[property] == "undefined") && property != "descripcion") {
              arVerify.push(false);
            } else {
              arVerify.push(true);
            }
          }

          if (this.cboCasos != "Compensacion de horas trabajadas" && !this.isVacacionesProgramadas) {
            if ((pap[property] == "" || typeof pap[property] == "undefined") && property != "horas_extras" && property != "hora_solicitada" && property != 'hora_acumulado') {
              arVerify.push(false);
            } else {
              arVerify.push(true);
            }
          }

          if (this.isVacacionesProgramadas) {
            if ((pap[property] == "" || typeof pap[property] == "undefined") && property != "horas_extras" && property != "hora_solicitada" && property != "hora_acumulado" && property != "hora_salida" && property != "hora_llegada") {

              arVerify.push(false);
            } else {
              arVerify.push(true);
            }
          }

          if (this.cboCasos == "Compensacion de horas trabajadas") {
            if (pap['fecha_desde'] != pap['fecha_hasta']) {
              arVerify.push(false);
              this.service.toastError("Las fechas de salida y entrada deben ser iguales..!!", "Papeleta");
            } else {
              arVerify.push(true);
            }

            let hrxLlegada = this.hroAcumuladaTotal.split(':');
            let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);

            let hrxSalida = this.diffHoraPap.split(':');
            let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

            if (llegada < salida) {
              arVerify.push(false);
              isErrorHSolicitada = true;
              this.service.toastError("Las horas solicitadas no pueden ser mayor al acumulado...!!!", "Papeleta");
            } else {
              isErrorHSolicitada = false;
              arVerify.push(true);
            }

            (this.dataViewPermiso || []).filter((tienda) => {
              //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
              if (this.codeTienda == (tienda || {}).SERIE_TIENDA) {
                if ((tienda || {}).IS_FREE_PAPELETA) {
                  arVerify.push(true);
                } else {
                  this.service.toastError("La fecha seleccionada no puede ser anterior a la actual.", "Papeleta");
                  arVerify.push(false);
                }
              }

            });
          }
        });

        if (arVerify.length && dataPapeleta.length - 1 == i) {
          const isBelowThreshold = (currentValue) => currentValue == true;

          this.isValidPapeleta = arVerify.every(isBelowThreshold);

          if (this.isValidPapeleta) {
            let parms = {
              url: '/recursos_humanos/pap/registrar',
              body: dataPapeleta
            };

            this.service.post(parms).then(async (response) => {
              if ((response || {}).success) {
                this.service.toastSuccess("Registrado con exito..!!", 'Registro Papeleta');
                this.isResetCalendarComp = true;
                this.isResetForm = true;
                this.store.removeStore('mt-hrExtra');

                this.cboCasos = "";
                this.cboCargo = "";
                //this.vFechaDesde = "";
                //this.vFechaHasta = "";
                this.horaSalida = "";
                this.horaLlegada = "";
                this.hroAcumuladaTotal = "";
                this.hroTomada = "";
                this.hroAcumulada = "";
                this.bodyList = [];
                this.vObservacion = "";
                this.horaSalida = "";
                this.horaLlegada = "";


                this.onListPapeleta();
                this.onGenerarCodigoPapeleta();



                $('#horaLlegada input')[0].value = "";
                $('#horaSalida input')[0].value = "";

                this.horaSalida = "";
                this.horaLlegada = "";
                $('#horaLlegada input')[0].value = "";
                $('#horaSalida input')[0].value = "";


                this.cboEmpleado = "";
                this.vNameOptionSelected = "";
                $("#cboEmpleado span#cboEmpleado")[0].innerText = "Seleccione Empleado";
                $("#cboCasos span#cboCasos")[0].innerText = "Tipo de caso";
                $("#cboCargo span#cboCargo")[0].innerText = "Seleccione Cargo";

              }
            });

          } else {
            if (!isErrorHSolicitada) {
              this.service.toastError("Complete todos los campos..!!", "Papeleta");
            }
          }
          /*
          VALIDACION CON FECHA ANTERIOR NO SE PUEDE CREAR PAPELETA
     
          let dateNow = new Date();
          let day = new Date(dateNow).toLocaleDateString().split('/');
          let date1 = new Date(dataPapeleta[0]['fecha_desde']).toLocaleDateString().split('/');
          let date2 = new Date(dataPapeleta[0]['fecha_hasta']).toLocaleDateString().split('/');
     
          var f1 = new Date(parseInt(date1[2]), parseInt(date1[1]), parseInt(date1[0]));
          var f2 = new Date(parseInt(date2[2]), parseInt(date2[1]), parseInt(date2[0]));
          var f3 = new Date(parseInt(day[2]) - 1, parseInt(day[1]), parseInt(day[0]));
          
          if ((f1.getTime() < f3.getTime()) || (f2.getTime() < f3.getTime())) {
            this.service.toastError("La fecha seleccionada no puede ser anterior a la actual.", "Papeleta");
          } else {
     
          }
          */
        }
      });
    } else {
      this.service.toastError("solo puede solicitar 8 horas por papeleta..!!", "Papeleta");
    }
  }

  async onViewComentario(row) {
    const dialogRef = this.dialog.open(MtModalViewComentarioComponent, {
      data: { comentario: (row || {}).comentario, isViewComentario: true },
      width: '500px'

    });


  }

  onChange(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onChangeTextArea(data: any) {
    let id = data.target.id;
    let inputData = $(`#${id}`).val();
    this[id] = inputData || "";
  }

  onViewPapeleta(ev) {
    this.isViewPapeleta = true;
    this.codigoPap = ev.codigo_papeleta;
  }

  onBackPap() {
    this.isViewPapeleta = false;
    this.codigoPap = "";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onTiempoTolerancia() {
    let parms = {
      url: '/security/configuracion/tiempo/tolerancia'
    };
    this.service.get(parms).then((response) => {
      this.dataViewTolerancia = response;
    });
  }

  onRecal(row) {
    let parms = {
      url: '/recursos_humanos/pap/horas_extras/recalcular',
      body: [
        {
          id_hora_extra: (row || {}).id_hora_extra
        }
      ]
    };
    this.service.post(parms).then((response) => {
      let dateNow = new Date();

      var año = dateNow.getFullYear();
      var mes = (dateNow.getMonth() + 1);
      let dayNow = dateNow.getDay();
      let day = new Date(dateNow).toLocaleDateString().split('/');
      let añoIn = año;
      let mesIn = mes > 1 ? mes - 1 : mes;
      let diaR = mes == 1 ? 1 : day[0];
      let configuracion = [{
        fechain: `${añoIn}-${mesIn}-${1}`,
        fechaend: `${año}-${mes}-${day[0]}`,
        nro_documento: this.cboEmpleado
      }];


      let cantidadPap = this.listaPapeletas.filter((pap) => (pap || {}).documento == this.cboEmpleado);

      this.cantidadPapeletas = (cantidadPap || []).length;
      //SE CONSULTA HORAS EXTRAS DE 2 MESES O 60 DIAS
      this.socket.emit('consultaHorasTrab', configuracion);
      this.service.toastSuccess("Recalculo finalizado.", "Hora Extra");
    });
  }
}
