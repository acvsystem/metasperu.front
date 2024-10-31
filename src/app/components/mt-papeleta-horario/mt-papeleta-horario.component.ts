import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { StorageService } from 'src/app/utils/storage';
import { ShareService } from 'src/app/services/shareService';
import { Notifications, setOptions } from '@mobiscroll/angular';

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
  horaSalida: string = "";
  horaLlegada: string = "";
  totalHoras: string = "";
  nameTienda: string = "";
  cboEmpleado: string = "";
  vFechaHasta: string = "";
  vFechaDesde: string = "";
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
  listaPapeletas: Array<any> = [];
  onListCargo: Array<any> = [
    { key: 'Asesor', value: 'Asesor' },
    { key: 'Gerente', value: 'Gerente' },
    { key: 'Cajero', value: 'Cajero' },
    { key: 'Almacenero', value: 'Almacenero' }
  ];

  onListCasos: Array<any> = [];

  onListTiendas: Array<any> = [
    { uns: 'BBW', code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7E', name: 'BBW LA RAMBLA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9D', name: 'VS LA RAMBLA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9B', name: 'VS PLAZA NORTE', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7C', name: 'BBW SAN MIGUEL', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9C', name: 'VS SAN MIGUEL', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7D', name: 'BBW SALAVERRY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9I', name: 'VS SALAVERRY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9G', name: 'VS MALL DEL SUR', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9H', name: 'VS PURUCHUCO', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9M', name: 'VS ECOMMERCE', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7F', name: 'BBW ECOMMERCE', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9K', name: 'VS MEGA PLAZA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9L', name: 'VS MINKA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9F', name: 'VSFA JOCKEY FULL', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];

  constructor(public notify: Notifications, private store: StorageService, private service: ShareService) { }

  ngOnInit() {

    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
    this.unidServicio = unidServicio['uns'];
    this.onListEmpleado = [];

    this.socket.emit('consultaListaEmpleado', this.unidServicio);

    this.socket.on('reporteEmpleadoTienda', async (response) => {
      console.log(response);
      if (response.id == "EJB") {
        this.isEJB = true;
        this.arDataEJB = (response || {}).data;
      }

      if (response.id == "server") {
        this.isServer = true;
        this.arDataServer = (response || {}).data;
      }

      if (this.arDataEJB.length && this.arDataServer.length) {

        this.arDataServer.filter(async (ds) => {
          if (ds.nroDocumento != '001763881' && ds.nroDocumento != '75946420' && ds.nroDocumento != '81433419' && ds.nroDocumento != '003755453' && ds.nroDocumento != '002217530' && ds.nroDocumento != '002190263' && ds.nroDocumento != '70276451') {
            let registro = this.arDataEJB.find((ejb) => ds.nroDocumento == ejb.nro_documento);
            let index = this.arDataEJB.findIndex((ejb) => ds.nroDocumento == ejb.nro_documento);

            if (index != -1) {
              var codigo = (ds || {}).caja.substr(0, 2);

              if ((ds || {}).caja.substr(2, 2) == 7) {
                codigo = (ds || {}).caja;
              } else {
                codigo.substr(0, 1)
              }

              let exist = this.parseEJB.findIndex((pr) => pr.documento == registro.nro_documento);

              if (codigo == this.codeTienda && exist == -1) {
                console.log(this.codeTienda, codigo, registro.nombre_completo);
                this.onListEmpleado.push({ key: registro.nro_documento, value: registro.nombre_completo });
                this.parseEJB.push({
                  nombre_completo: registro.nombre_completo,
                  documento: registro.nro_documento,
                  codigo_tienda: codigo
                });
              }
            }
          }
        });

        console.log("parseEJB ", this.parseEJB);
      }
    });



    this.socket.on('reporteHorario', async (response) => {
      let data = (response || {}).data;
      this.parseHuellero = data;
      this.onDataTemp = [];
      this.bodyList = [];

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

      this.onVerificarHrExtra(this.dataVerify);

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
      this.bodyList = response;
      
      this.bodyList.filter((dt) => {
        this.arHoraExtra = [dt.extra];
        this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
      });

      this.hroAcumulada = this.arHoraExtra[0];
      this.hroAcumuladaTotal = this.arHoraExtra[0];
      console.log(this.arHoraExtra[0]);
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

    if ((selectData || {}).value == 'Compensacion de horas trabajadas') {
      this[index] = (selectData || {}).value;
      this.idCboTipoPap = (selectData || {}).key;

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
    let hrExtr = (minutos[0] > 0) ? minutos[0] : 0;

    if (hora_1 > hora_2) {
      diferencia = hora_1 - hora_2;
    } else {
      diferencia = hora_2 - hora_1;
    }

    let hora_1_pr = hr1.split(":");
    let hora_2_pr = hr2.split(":");
    let hr_resta: number = (hora_1_pr[1] > 0) ? parseInt(hora_1_pr[1]) : parseInt(hora_2_pr[1]);
    let horaResult = ((diferencia - hr_resta) / 60).toString();
    return `${parseInt(horaResult) + hrExtr}:${(minutos[1] < 10) ? '0' + minutos[1] : minutos[1]}`;
  }

  onCaledar(ev) {
    console.log(ev);
    if (ev.isTime) {
      this[ev.id] = ev.value;
    }

    if (ev.isDefault) {
      let date = new Date(ev.value).toLocaleDateString().split('/');
      this[ev.id] = `${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`;
    }
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
      let copyData = [...this.arCopiHoraExtra];
      this.arCopiHoraExtra = [];
      this.arCopiHoraExtra = copyData.filter((dt) => dt.fecha != fecha);

      this.arHoraTomada.push(copyData.find((cdt) => cdt.fecha == fecha));

      this.arHoraTomada.filter((ht) => {
        if (!this.arHoraTomadaCalc.length) {
          this.arHoraTomadaCalc = [ht.extra];
        } else {
          this.arHoraTomadaCalc[0] = this.obtenerHorasTrabajadas(ht.extra, this.arHoraTomadaCalc[0]);
        }
      });

      this.arCopiHoraExtra.filter((dt) => {
        if (!this.arHoraExtra.length) {
          this.arHoraExtra = [dt.extra];
        } else {
          this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
        }
      });

      let index = this.bodyList.findIndex((bd) => bd.fecha == fecha);

      this.bodyList[index]['seleccionado'] = true;
    } else {

      let copyData = [...this.arHoraTomada];
      this.arHoraTomada = [];

      this.arCopiHoraExtra.push(this.bodyList.find((bd) => bd.fecha == fecha));

      this.arCopiHoraExtra.filter((dt) => {
        if (!this.arHoraExtra.length) {
          this.arHoraExtra = [dt.extra];
        } else {
          this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
        }
      });

      let data = copyData.find((cdt) => cdt.fecha != fecha);
      if (typeof data != 'undefined') {
        this.arHoraTomada.push(data);
        console.log(this.arHoraTomada);
        this.arHoraTomada.filter((ht) => {
          if (!this.arHoraTomadaCalc.length) {
            this.arHoraTomadaCalc = [ht.extra];
          } else {
            this.arHoraTomadaCalc[0] = this.obtenerHorasTrabajadas(ht.extra, this.arHoraTomadaCalc[0]);
          }
        });
      }

      let index = this.bodyList.findIndex((bd) => bd.fecha == fecha);

      this.bodyList[index]['seleccionado'] = true;

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
    let dataSelect = this.onDataTemp.filter((dt) => dt.dia == fecha);
    this.arSelectRegistro = dataSelect;
    console.log(dataSelect);
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

  onAutorizacion() {

    //this.socket.emit('authHoraExtra', this.unidServicio);
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
    console.log(this.cboEmpleado);
    let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
    let dateNow = new Date();
    let day = new Date(dateNow).toLocaleDateString().split('/');
    let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;

    (dataPapeleta || []).push({
      nombre_completo: ejb[0]['nombre_completo'] || "",
      documento: ejb[0]['documento'],
      id_tipo_papeleta: this.idCboTipoPap,
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
      horas_extras: this.bodyList
    });

    console.log(dataPapeleta);

    let parms = {
      url: '/papeleta/generar',
      body: dataPapeleta
    };

    this.service.post(parms).then(async (response) => {
      if (!(response || {}).success) {
        this.notify.snackbar({
          message: (response || {}).msj,
          display: 'top',
          color: 'danger'
        });
      } else {
        this.onListPapeleta();
      }

    });

  }
}
