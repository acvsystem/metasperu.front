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
  codigoPap: number = 0;
  horaSalida: string = "";
  vObservacion: string = "";
  horaLlegada: string = "";
  totalHoras: string = "";
  nameTienda: string = "";
  cboEmpleado: string = "";
  vFechaHasta: string = "";
  vFechaDesde: string = "";
  isViewPapeleta: boolean = false;
  hroAcumulada: string = "00:00";
  hroAcumuladaTotal: string = "00:00";
  hroTomada: string = "00:00";
  vHtomada: string = "";
  onDataTemp: Array<any> = [];
  parseHuellero: Array<any> = [];
  arHoraExtra: Array<any> = [];
  arHoraTomada: Array<any> = [];
  arHoraTomadaCalc: Array<any> = [];
  bodyList: Array<any> = [];
  arCopiHoraExtra: Array<any> = [];
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
  diffHoraPap: string = "";
  totalAcumulado: string = "";
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


    });

    this.socket.on('reporteEmpleadoTienda', async (response) => {

      let dataEmpleado = (response || {}).data;
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
      let data = (response || {}).data;
      this.parseHuellero = data;
      this.onDataTemp = [];
      this.bodyList = [];
      this.dataVerify = [];

      await (this.parseHuellero || []).filter(async (huellero) => {

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
              hr_faltante: 0
            });
          } else {

            this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
            this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
            this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
            let hora_trb_1 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_1'], this.onDataTemp[indexData]['hr_salida_1']);
            let hora_trb_2 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_2'], this.onDataTemp[indexData]['hr_salida_2']);
            this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(hora_trb_1, hora_trb_2);
            let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
            let process = this.obtenerHoraExtra(this.onDataTemp[indexData]['hr_trabajadas'], "8:00");

            if (hora_1_pr[0] >= 8) {
              let hr = process.split(":");
              if (parseInt(hr[1]) >= 30 || parseInt(hr[0]) > 0) {
                this.onDataTemp[indexData]['hr_extra'] = process;//23:59
                let salida = this.onDataTemp[indexData]['hr_salida_2'].split(":");
                let estado = salida[0] == 23 && salida[1] == 59 ? 'aprobar' : 'correcto';
                let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
                let aprobado = estado == "correcto" ? true : false;
                this.dataVerify.push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });

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
      });

      if ((this.dataVerify || []).length) {
        this.onVerificarHrExtra(this.dataVerify);
      }

      this.hroAcumulada = this.arHoraExtra[0];
      this.hroAcumuladaTotal = this.arHoraExtra[0];
    });


    this.onGenerarCodigoPapeleta();
    this.onListTipoPapeleta();
    this.onListPapeleta();

  }

  onVerificarHrExtra(dataVerificar) {
    let parms = {
      url: '/papeleta/verificar/horas_extras',
      body: dataVerificar
    };

    this.service.post(parms).then(async (response) => {
      const ascDates = response.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });

      this.bodyList = ascDates;
      this.hroAcumulada = "";
      this.hroAcumuladaTotal = "";
      this.arHoraExtra = [];
      this.bodyList.filter((dt, i) => {
        if (!dt.seleccionado && dt.aprobado && !dt.verify) {

          if (!this.arHoraExtra.length) {
            this.arHoraExtra = [dt.extra];
          } else {
            this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
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
      url: '/papeleta/lista',
      body: [{ codigo_tienda: this.codeTienda }]
    };

    this.service.post(parms).then(async (response) => {
      this.listaPapeletas = response;
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
    if ((selectData || {}).value == 'Compensacion de horas trabajadas' || (index == "cboEmpleado" && this.idCboTipoPap)) {
      if (index != "cboEmpleado") {
        this[index] = (selectData || {}).value;
        this.idCboTipoPap = (selectData || {}).key;
      }

      let dateNow = new Date();

      var año = dateNow.getFullYear();
      var mes = (dateNow.getMonth() + 1);
      let dayNow = dateNow.getDay();
      let day = new Date(dateNow).toLocaleDateString().split('/');

      let configuracion = [{
        fechain: `${año}-${mes - 2}-${day[0]}`,
        fechaend: `${año}-${mes}-${day[0]}`,
        nro_documento: this.cboEmpleado
      }]
      //SE CONSULTA HORAS EXTRAS DE 2 MESES O 60 DIAS
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
        this.onCalcHorasSolicitadas();
      }
    }

    if (ev.isDefault) {
      let date = new Date(ev.value).toLocaleDateString().split('/');
      this[ev.id] = `${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`;
    }
  }

  onCalcHorasSolicitadas() {
    this.diffHoraPap = this.obtenerDiferenciaHora(this.horaSalida, this.horaLlegada);
    let diffH = this.diffHoraPap;
    let solicitado = this.diffHoraPap;
    let responseCalc = [];
    let isStop = false;
    this.bodyList.filter((hrx, i) => {

      
      
      console.log((hrx || {}).extra, this.totalAcumulado || diffH, this.obtenerDiferenciaHora((hrx || {}).extra, this.totalAcumulado || diffH));
      responseCalc.push(this.totalAcumulado);
      this.totalAcumulado = this.obtenerDiferenciaHora((hrx || {}).extra, this.totalAcumulado || diffH);

      /** 
            if (!isStop) {
              if (!(this.totalAcumulado).length) {
                this.totalAcumulado = this.obtenerDiferenciaHora((hrx || {}).extra, diffH);
                
              } else {
                this.totalAcumulado = this.obtenerDiferenciaHora(this.totalAcumulado, diffH);
                
              }
      
              if (this.totalAcumulado != '00:00') {
                console.log(this.totalAcumulado);
                let sobrante = this.totalAcumulado;
                let tomada = this.obtenerDiferenciaHora(sobrante, diffH);
      
                if (tomada == (hrx || {}).extra) {
                  this.bodyList[i]['hrx_sobrante'] = "00:00";
                } else {
                  this.bodyList[i]['hrx_sobrante'] = sobrante;
                }
      
                this.bodyList[i]['hrx_tomada'] = tomada;
      
                responseCalc.push(hrx);
              } else {
                isStop = true;
              }
            }
      */
    });
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
    let dataSelect = this.onDataTemp.filter((dt) => dt.dia == fecha);
    this.arSelectRegistro = dataSelect;
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
      url: '/papeleta/generar/codigo'
    };
    this.service.get(parms).then((response) => {
      this.codigoPapeleta = (response || {})['codigo'];
    })
  }

  onSavePapeleta() {
    let dataPapeleta = [];
    let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
    let dateNow = new Date();
    let day = new Date(dateNow).toLocaleDateString().split('/');
    let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;

    (dataPapeleta || []).push({
      nombre_completo: ejb[0]['nombre_completo'] || "",
      documento: ejb[0]['documento'],
      id_tipo_papeleta: this.cboCasos,
      cargo_empleado: this.cboCargo,
      fecha_desde: this.vFechaDesde,
      fecha_hasta: this.vFechaHasta,
      salida_hora: this.horaSalida,
      llegada_hora: this.horaLlegada,
      horas_acomuladas: this.hroAcumuladaTotal,
      horas_tomadas: this.hroTomada,
      horas_sobrantes: this.hroAcumulada,
      codigo_tienda: this.codeTienda,
      fecha_creacion: fechaActual,
      codigo_papeleta: this.codigoPapeleta,
      horas_extras: this.bodyList || [],
      observacion: this.vObservacion
    });

    let parms = {
      url: '/papeleta/generar',
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

        this.onGenerarCodigoPapeleta();
        //this.openSnackBar("PAPELETA REGISTRADA CON EXISTO..!!!");
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
    this.codigoPap = 0;
  }

}
