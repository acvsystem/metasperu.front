import { Component, HostListener, OnInit, inject } from '@angular/core';
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

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'mt-papeleta-horario',
  templateUrl: './mt-papeleta-horario.component.html',
  styleUrls: ['./mt-papeleta-horario.component.scss'],
})
export class MtPapeletaHorarioComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  onListEmpleado: Array<any> = [];
  cboCasos: string = "";
  codigoPap: string = "";
  horaSalida: string = "";
  horaLlegada: string = "";
  totalHoras: string = "";
  arHoraExtra: Array<any> = [];
  arHoraTomada: Array<any> = [];
  arHoraTomadaCalc: Array<any> = [];
  arCopiHoraExtra: Array<any> = [];
  bodyList: Array<any> = [];
  vObservacion: string = "";
  nameTienda: string = "";
  cboEmpleado: string = "";
  vFechaHasta: string = "";
  vFechaDesde: string = "";
  isViewPapeleta: boolean = false;
  isResetCalendar: boolean = false;
  hroAcumulada: string = "00:00";
  hroAcumuladaTotal: string = "00:00";
  hroTomada: string = "00:00";
  vHtomada: string = "";
  onDataTemp: Array<any> = [];
  parseHuellero: Array<any> = [];
  isValidPapeleta: boolean = false;

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
  unidServicio: string = "";
  cboCargo: string = "";
  idCboTipoPap: number = 0;
  screenHeight: number = 0;
  hroSelectedPap: string = "";
  listaPapeletas: Array<any> = [];
  arCalHoraPap: Array<any> = [];
  copyBodyList: Array<any> = [];
  arPartTimeFech: Array<any> = [];
  diffHoraPap: string = "";
  totalAcumulado: string = "";
  isVacacionesProgramadas: boolean = false;
  onListCargo: Array<any> = [
    { key: 'Asesor', value: 'Asesor' },
    { key: 'Gerente', value: 'Gerente' },
    { key: 'Cajero', value: 'Cajero' },
    { key: 'Almacenero', value: 'Almacenero' }
  ];

  onListCasos: Array<any> = [];

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
    { code_uns: '0026', uns: 'BBW', code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight - 200;
  }


  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private store: StorageService, private service: ShareService) {
    this.getScreenSize();
  }
  isPartTime = false;
  ngOnInit() {

    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
    this.unidServicio = unidServicio['uns'];
    this.onListEmpleado = [];

    this.socket.emit('consultaListaEmpleado', this.unidServicio);

    this.socket.on('respuesta_autorizacion', async (response) => {
      //this.bodyList = response;
      /*this.hroAcumulada = "";
      this.hroAcumuladaTotal = "";
      this.arHoraExtra = [];*/

      let index = (this.bodyList || []).findIndex((bd) => bd.fecha == response[0]['FECHA']);

      let estado = response[0]['APROBADO'] ? 'correcto' : response[0]['RECHAZADO'] ? 'rechazado' : 'aprobar';
      let aprobado = estado == "correcto" ? true : false;

      this.bodyList[index]['estado'] = estado;
      this.bodyList[index]['aprobado'] = aprobado;
      this.bodyList[index]['rechazado'] = response[0]['RECHAZADO'] ? true : false;

      if (response[0]['RECHAZADO']) {
        this.openSnackBar("Hora extra rechazada.");
      }

      if (!response[0]['RECHAZADO']) {
        this.openSnackBar("Hora extra aprobada.");
      }

      //this.copyBodyList = [...this.bodyList];


    });

    this.socket.on('reporteEmpleadoTienda', async (response) => {

      let dataEmpleado = (response || {}).data;
      console.log(dataEmpleado);
      let codigo_uns = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);


      dataEmpleado.filter((emp) => {
        if (response.id == "EJB") {
          this.arDataEJB = (response || {}).data;
        }

        if (this.arDataEJB.length) {
          this.arDataEJB.filter(async (ejb) => {
            if ((ejb || {}).code_unid_servicio == (codigo_uns || {}).code_uns) {

              let exist = this.onListEmpleado.findIndex((pr) => pr.key == ((ejb || {}).nro_documento).trim());
              if (exist == -1) {
                this.onListEmpleado.push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                this.parseEJB.push({
                  nombre_completo: ejb.nombre_completo,
                  documento: ejb.nro_documento,
                  codigo_tienda: this.codeTienda
                });
              }
            }
          });
        }
      });

    });


    this.socket.on('reporteHorario', async (response) => {
      console.log(response);
      let data = (response || {}).data;
      this.parseHuellero = data;
      this.onDataTemp = [];
      this.bodyList = [];
      this.dataVerify = [];

      await (this.parseHuellero || []).filter(async (huellero, i) => {

        let tipoAsc = ((huellero || {}).tpAsociado || "").split('*');


        var codigo = (huellero || {}).caja.substr(0, 2);

        if ((huellero || {}).caja.substr(2, 2) == 7) {
          codigo = (huellero || {}).caja;
        } else {
          codigo.substr(0, 1)
        }

        if (codigo == this.codeTienda) {
          let indexData = this.onDataTemp.findIndex((data) => ((data || {}).dia == (huellero || []).dia));

          if (indexData == -1) {
            this.onDataTemp.push({
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

            if (huellero.tpAsociado == "**") {
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

          } else {
            if (huellero.tpAsociado != "**") {

              this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
              this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
              this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
              let hora_trb_1 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_1'], this.onDataTemp[indexData]['hr_salida_1']);
              let hora_trb_2 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_2'], this.onDataTemp[indexData]['hr_salida_2']);
              this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(hora_trb_1, hora_trb_2);
              let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
              this.onDataTemp[indexData]['dataRegistro'].push(huellero);

              let defaultHT = "08:00";


              if (tipoAsc.length == 2) { //SI ES LACTANCIA

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

              let newAcumulado = llegada - salida;

              const ToTime = (num) => {
                var minutos: any = Math.floor((num / 60) % 60);
                minutos = minutos < 10 ? '0' + minutos : minutos;
                var segundos: any = num % 60;
                segundos = segundos < 10 ? '0' + segundos : segundos;
                return minutos + ':' + segundos;
              }

              let process = ToTime(newAcumulado);

              if (hora_1_pr[0] >= 8) {
                let hr = process.split(":");
                if (parseInt(hr[1]) >= 30 || parseInt(hr[0]) > 0) {
                  this.onDataTemp[indexData]['hr_extra'] = process;//23:59
                  let salida = this.onDataTemp[indexData]['hr_salida_2'].split(":");

                  let estado = this.onDataTemp[indexData]['dataRegistro'].length >= 3 ? 'aprobar' : 'correcto';

                  let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
                  let aprobado = estado == "correcto" ? true : false;


                  this.dataVerify.push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'],fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });

                  this.arCopiHoraExtra.push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });
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
        console.log(this.dataVerify);
        this.onVerificarHrExtra(this.dataVerify);
      }

      this.hroAcumulada = this.arHoraExtra[0];
      this.hroAcumuladaTotal = this.arHoraExtra[0];
    });


    this.onGenerarCodigoPapeleta();
    this.onListTipoPapeleta();
    this.onListPapeleta();

  }



  onProcesarPartTime(length, index, row) {
    this.dataVerify = [];

    let fecha = new Date(row.dia).toLocaleDateString().split('/'); new Date();

    var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];

    var indice = new Date((parseInt(fecha[1])) + "/" + parseInt(fecha[0]) + "/" + (parseInt(fecha[2]))).getDay();
    console.log((parseInt(fecha[1])) + "/" + parseInt(fecha[0]) + "/" + parseInt(fecha[2]), "dia:", dias[indice], indice);
    let estado = row.dataRegistro.length >= 3 ? 'aprobar' : 'correcto';
    let aprobado = estado == "correcto" ? true : false;

    this.arPartTimeFech.push({

      dia: row.dia, diaNom: dias[indice], hr_trabajadas: row.hr_trabajadas, indice: indice
    });

    const ascDates = this.arPartTimeFech.sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

    this.arPartTimeFech = ascDates;
    let count = "00:00";
    let arFechas = [];
    this.arPartTimeFech.filter((pt, index) => {

      if (pt.indice > (this.arPartTimeFech[index - 1] || {}).indice || typeof this.arPartTimeFech[index - 1] == "undefined") {
        arFechas.push({ dia: (this.arPartTimeFech[index - 1] || {}).dia, hr_trabajadas: (this.arPartTimeFech[index - 1] || {}).hr_trabajadas });
        count = this.obtenerHorasTrabajadas(pt.hr_trabajadas, count);

      }

      if ((this.arPartTimeFech[index - 1] || {}).indice > pt.indice) {

        let hrxLlegada = count.split(':');
        let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);

        let hrxSalida = ("24:00").split(':');
        let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

        let newAcumulado = llegada - salida;

        const ToTime = (num) => {
          var minutos: any = Math.floor((num / 60) % 60);
          minutos = minutos < 10 ? '0' + minutos : minutos;
          var segundos: any = num % 60;
          segundos = segundos < 10 ? '0' + segundos : segundos;
          return minutos + ':' + segundos;
        };

        let process = ToTime(newAcumulado);
        this.arPartTimeFech[index - 1]["hrTrabajadas"] = count;
        arFechas.push({ dia: (this.arPartTimeFech[index - 1] || {}).dia, hr_trabajadas: (this.arPartTimeFech[index - 1] || {}).hr_trabajadas });
        if (parseInt(this.arPartTimeFech[index - 1]["hrTrabajadas"].split(":")[0]) >= 24) {
          this.arPartTimeFech[index - 1]["hrExtra"] = process;
          this.arPartTimeFech[index - 1]["fechas"] = arFechas;
          this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.arPartTimeFech[index - 1]["hrTrabajadas"], fecha: this.arPartTimeFech[index - 1]["fechas"][0]['dia'], hrx_acumulado: this.arPartTimeFech[index - 1]["hrExtra"], extra: this.arPartTimeFech[index - 1]["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: this.arPartTimeFech[index - 1]["fechas"] });

        }

        count = pt.hr_trabajadas;
        arFechas = [];
      }
    });

    if (length - 1 == index) {
      console.log(this.dataVerify);
      this.onVerificarHrExtra(this.dataVerify);
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
      this.bodyList = ascDates;
      this.hroAcumulada = "";
      this.hroAcumuladaTotal = "";
      this.arHoraExtra = [];
      this.bodyList.filter((dt, i) => {
        this.bodyList[i]['hrx_solicitado'] = "00:00";
        //this.bodyList[i]['hrx_sobrante'] = "00:00";
        let sobrante = dt.hrx_sobrante.split(':');
        let hSobrante = parseInt(sobrante[0]) * 60 + parseInt(sobrante[1]);

        if (hSobrante > 0) {
          this.bodyList[i]['extra'] = dt.hrx_sobrante;
        }

        if (!dt.seleccionado && dt.aprobado && !dt.verify) {

          if (!this.arHoraExtra.length) {
            this.arHoraExtra = [dt.extra];
          } else {
            if (dt.estado == "correcto") {
              this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
            }
          }
        }

        if (this.bodyList.length - 1 == i) {

          this.hroAcumulada = this.arHoraExtra[0];
          this.hroAcumuladaTotal = this.arHoraExtra[0];
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
      }
    }

    if ((selectData || {}).value == 'Compensacion de horas trabajadas' || (index == "cboEmpleado" && this.idCboTipoPap)) {
      this.isResetCalendar = false;
      if (index != "cboEmpleado") {
        this[index] = (selectData || {}).value;
        this.idCboTipoPap = (selectData || {}).key;
      }

      let dateNow = new Date();
      /*
            var año = dateNow.getFullYear();
            var mes = (dateNow.getMonth() + 1);
      
            let day = new Date(dateNow).toLocaleDateString().split('/');
            let añoIn = mes == 1 ? año - 1 : año;
            let mesIn = mes == 1 ? mes : mes - 1;
            let dayNow = mes == 1 ? 1 : day[0];
            let configuracion = [{
              fechain: `${año}-${mesIn}-${dayNow}`,
              fechaend: `${año}-${mes}-${day[0]}`,
              nro_documento: this.cboEmpleado
            }]
              */


      var año = dateNow.getFullYear();
      var mes = (dateNow.getMonth() + 1);
      let dayNow = dateNow.getDay();
      let day = new Date(dateNow).toLocaleDateString().split('/');
      let añoIn = mes == 1 ? año - 1 : año;
      let mesIn = mes == 1 ? 11 : mes == 2 ? 12 : mes - 2;
      let configuracion = [{
        fechain: `${añoIn}-${mesIn}-${day[0]}`,
        fechaend: `${año}-${mes}-${day[0]}`,
        nro_documento: this.cboEmpleado
      }]

      //SE CONSULTA HORAS EXTRAS DE 2 MESES O 60 DIAS
      console.log("consultaHorasTrab", configuracion);
      this.socket.emit('consultaHorasTrab', configuracion);
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

  onCaledar(ev) {
    if (ev.isTime) {
      this[ev.id] = ev.value;

      if (this.horaSalida.length && this.horaLlegada.length && this.cboCasos == 'Compensacion de horas trabajadas') {
        this.diffHoraPap = "00:00";
        this.diffHoraPap = this.obtenerDiferenciaHora(this.horaSalida, this.horaLlegada);
        let hrxLlegada = this.hroAcumuladaTotal.split(':');
        let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);

        let hrxSalida = this.diffHoraPap.split(':');
        let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);

        if (llegada > salida) {
          this.onCalcHorasSolicitadas();
          let newAcumulado = llegada - salida;

          const ToTime = (num) => {
            var minutos: any = Math.floor((num / 60) % 60);
            minutos = minutos < 10 ? '0' + minutos : minutos;
            var segundos: any = num % 60;
            segundos = segundos < 10 ? '0' + segundos : segundos;
            return minutos + ':' + segundos;
          }

          this.hroAcumulada = ToTime(newAcumulado);

        } else {
          this.openSnackBar("Las horas solicitadas no pueden ser mayor al acumulado...!!!");
        }

      }
    }

    if (ev.isDefault) {
      let date = new Date(ev.value).toLocaleDateString().split('/');
      this[ev.id] = `${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`;
    }
  }

  onCalcHorasSolicitadas() {
    this.diffHoraPap = "00:00";
    this.diffHoraPap = this.obtenerDiferenciaHora(this.horaSalida, this.horaLlegada);

    let partDiff = this.diffHoraPap.split(':');
    let solicitado = 0;
    solicitado = parseInt(partDiff[0]) * 60 + parseInt(partDiff[1]);
    let tot = solicitado;
    let tot2 = solicitado;
    let i = 0;
    let nextProcess = true;

    this.bodyList.filter((hrx, i) => {
      this.bodyList[i]['hrx_tomada'] = "00:00";
      this.bodyList[i]['hrx_sobrante'] = "00:00";
      this.bodyList[i]['checked'] = false;
    });

    do {
      let estado = this.bodyList[i]['estado'] || "";

      if (estado == 'correcto') {
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

          console.log(this.bodyList[i]);


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

      /* this.bodyList.filter((ext, i) => {
         if (ext.seleccionado && !ext.verify) {
           if (!this.arHoraTomadaCalc.length) {
             this.arHoraTomadaCalc = [ext.extra];
           } else {
             this.arHoraTomadaCalc[0] = this.obtenerHorasTrabajadas(ext.extra, this.arHoraTomadaCalc[0]);
           }
         }
 
         if (!ext.seleccionado && ext.aprobado) {
           if (!this.arHoraExtra.length) {
             this.arHoraExtra = [ext.extra];
           } else {
             this.arHoraExtra[0] = this.obtenerHorasTrabajadas(ext.extra, this.arHoraExtra[0]);
           }
         }
       });*/
    }

    this.hroAcumulada = this.arHoraExtra[0];
    this.hroTomada = this.arHoraTomadaCalc[0] || '00:00';

    /* if ((this.diffHoraPap != this.hroTomada) && (this.diffHoraPap.length && this.hroTomada.length)) {
       this.notify.snackbar({
         message: "La cantidad de hora, es menor o mayor a la cantidad de hora seleccionada.",
         display: 'top',
         color: 'danger'
       });
     }*/
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
    console.log(dataSelect);
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

  onAutorizacion(ev) {
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
  }


  onGenerarCodigoPapeleta() {
    let parms = {
      url: '/recursos_humanos/pap/gen_codigo_pap',
      body: {
        "serie_tienda": this.codeTienda
      }
    };
    this.service.post(parms).then((response) => {
      this.codigoPapeleta = (response || {})['codigo'];
    })
  }

  async onSavePapeleta() {
    let dataPapeleta = [];
    let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
    let dateNow = new Date();
    let day = new Date(dateNow).toLocaleDateString().split('/');
    let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;
    console.log(this.onListCasos);
    console.log(this.cboCasos);
    let caso = this.onListCasos.find((cs) => cs.value == this.cboCasos) || {};
    let arVerify = [];
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
          if ((pap[property] == "" || typeof pap[property] == "undefined") && property != "horas_extras" && property != "hora_solicitada") {
            arVerify.push(false);
          } else {
            arVerify.push(true);
          }
        }


        if (this.isVacacionesProgramadas) {
          if ((pap[property] == "" || typeof pap[property] == "undefined") && property != "horas_extras" && property != "hora_solicitada" && property != "hora_salida" && property != "hora_llegada") {
            arVerify.push(false);
          } else {
            arVerify.push(true);
          }
        }
      });

      if (arVerify.length && dataPapeleta.length - 1 == i) {
        const isBelowThreshold = (currentValue) => currentValue == true;

        this.isValidPapeleta = arVerify.every(isBelowThreshold);
        console.log(arVerify);


        if (this.isValidPapeleta) {
          console.log(this.isValidPapeleta);
          let parms = {
            url: '/recursos_humanos/pap/registrar',
            body: dataPapeleta
          };

          this.service.post(parms).then(async (response) => {
            if (!(response || {}).success) {
              this.openSnackBar((response || {}).msj);
            } else {
              this.onListPapeleta();

              this.cboCasos = "";
              this.cboCargo = "";
              this.vFechaDesde = "";
              this.vFechaHasta = "";
              this.horaSalida = "";
              this.horaLlegada = "";
              this.hroAcumuladaTotal = "";
              this.hroTomada = "";
              this.hroAcumulada = "";
              this.bodyList = [];
              this.vObservacion = "";
              this.isResetCalendar = true;

              this.onGenerarCodigoPapeleta();
              //this.openSnackBar("PAPELETA REGISTRADA CON EXISTO..!!!");
            }

          });

        } else {
          this.openSnackBar("Complete todos los campos..!!");
        }
      }
    });







  }

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
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

}
