import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { io } from "socket.io-client";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-autorizacion-hora-extra',
  templateUrl: './mt-autorizacion-hora-extra.component.html',
  styleUrls: ['./mt-autorizacion-hora-extra.component.scss'],
})
export class MtAutorizacionHoraExtraComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  onDataView: Array<any> = [];
  arDataEJB: Array<any> = [];
  onDataTemp: Array<any> = [];
  parseHuellero: Array<any> = [];
  bodyList: Array<any> = [];
  dataVerify: Array<any> = [];
  parseEJB: Array<any> = [];
  headListSunat: Array<any> = ["NOMBRE COMPLETO", "DOCUMENTO", "CAJA", "DIA", "HORA ENTRADA", "HORA SALIDA", "HORAS TRABAJADAS"];
  arHoraExtra: Array<any> = [];
  arCopiHoraExtra: Array<any> = [];
  arSelectRegistro: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.onDataView);
  displayedColumns: string[] = [];
  codeTienda: string = "";
  hroAcumulada: string = "";
  hroAcumuladaTotal: string = "";
  unidServicio: string = "";
  isDetalle: boolean = false;
  isLoading: boolean = false;
  profileUser: any = {};

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: StorageService, private service: ShareService) { }

  ngOnInit() {

    this.profileUser = this.store.getStore('mt-profile');

    console.log(this.profileUser);

    this.socket.on('lista_solicitudes', async (response) => {
      let dataResponse = response;
      let viewData = [];
      await dataResponse.filter(async (rs, i) => {

        let selectedLocal = await this.onListTiendas.find((data) => data.code == rs['CODIGO_TIENDA']) || {};
        dataResponse[i]['TIENDA'] = (selectedLocal || {}).name;
        dataResponse[i]['ESTADO'] = !rs.APROBADO && !rs.RECHAZADO ? 'pendiente' : rs.APROBADO ? 'aprobado' : rs.RECHAZADO ? 'rechazado' : '';
      });

      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'ESTADO', 'AUTORIZAR'];

      await dataResponse.filter(async (rs, i) => {

        if (this.profileUser.mt_nivel == "cmoron" && (dataResponse[i]['TIENDA'] == 'BBW MALL AVENTURA AQP' || dataResponse[i]['TIENDA'] == 'VS MALL AVENTURA AQP' || dataResponse[i]['TIENDA'] == 'VS MALL PLAZA TRU' || dataResponse[i]['TIENDA'] == 'BBW MALL PLAZA TRU' || dataResponse[i]['TIENDA'] == 'VSFA JOCKEY FULL' || dataResponse[i]['TIENDA'] == 'BBW JOCKEY')) {
          viewData.push(rs);
        }
        console.log(this.profileUser.mt_nivel, dataResponse[i]['TIENDA']);
        if (this.profileUser.mt_nivel == "jcarreno" && (dataResponse[i]['TIENDA'] == 'BBW JOCKEY' || dataResponse[i]['TIENDA'] == 'BBW LA RAMBLA' || dataResponse[i]['TIENDA'] == 'VS LA RAMBLA' || dataResponse[i]['TIENDA'] == 'VS PLAZA NORTE' || dataResponse[i]['TIENDA'] == 'VSFA JOCKEY FULL' || dataResponse[i]['TIENDA'] == 'BBW SAN MIGUEL' || dataResponse[i]['TIENDA'] == 'VS SAN MIGUEL' || dataResponse[i]['TIENDA'] == 'BBW SALAVERRY' || dataResponse[i]['TIENDA'] == 'VS SALAVERRY' || dataResponse[i]['TIENDA'] == 'VS MALL DEL SUR' || dataResponse[i]['TIENDA'] == 'VS PURUCHUCO' || dataResponse[i]['TIENDA'] == 'VS MEGA PLAZA' || dataResponse[i]['TIENDA'] == 'VS MINKA' || dataResponse[i]['TIENDA'] == 'BBW ASIA')) {
          viewData.push(rs);
        }

        if (this.profileUser.mt_nivel == "SISTEMAS" && this.profileUser.mt_nivel == "JOHNNY") {
          viewData.push(rs);
        }

      });

      this.onDataView = viewData;
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });


    this.socket.on('reporteHorario', async (response) => {

      let data = (response || {}).data;
      this.parseHuellero = data;
      this.onDataTemp = [];
      this.bodyList = [];
      this.dataVerify = [];

      await (this.parseHuellero || []).filter(async (huellero, i) => {

        var codigo = (huellero || {}).caja.substr(0, 2);

        this.parseHuellero[i]['hrWorking'] = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);

        if ((huellero || {}).caja.substr(2, 2) == 7) {
          codigo = (huellero || {}).caja;
        } else {
          codigo.substr(0, 1)
        }

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
              let aprobado = estado == "correcto" ? true : false;

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

      });

      this.isLoading = false;
      this.isDetalle = true;

      if ((this.dataVerify || []).length) {
        this.onVerificarHrExtra(this.dataVerify);
      }

      this.hroAcumulada = this.arHoraExtra[0];
      this.hroAcumuladaTotal = this.arHoraExtra[0];
    });

    this.onListHorasAutorizar();
  }

  onVerificarHrExtra(dataVerificar) {

    let parms = {
      url: '/papeleta/verificar/horas_extras',
      body: dataVerificar
    };

    this.service.post(parms).then(async (response) => {
      this.bodyList = response;
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
      console.log(this.bodyList);

    });

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

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
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

  onListHorasAutorizar() {
    let parms = {
      url: '/papeleta/lista/horas_autorizacion'
    };
    this.service.get(parms).then(async (response) => {

      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'ESTADO', 'AUTORIZAR'];
      let dataResponse = response;
      let viewData = [];

      await dataResponse.filter(async (rs, i) => {
        let selectedLocal = await this.onListTiendas.find((data) => data.code == rs['CODIGO_TIENDA']) || {};
        dataResponse[i]['TIENDA'] = (selectedLocal || {}).name;
        dataResponse[i]['ESTADO'] = !rs.APROBADO && !rs.RECHAZADO ? 'pendiente' : rs.APROBADO ? 'aprobado' : rs.RECHAZADO ? 'rechazado' : '';
      });

      await dataResponse.filter(async (rs, i) => {
        console.log(rs);
        if (this.profileUser.mt_nivel == "cmoron" && (dataResponse[i]['TIENDA'] == 'BBW MALL AVENTURA AQP' || dataResponse[i]['TIENDA'] == 'VS MALL AVENTURA AQP' || dataResponse[i]['TIENDA'] == 'VS MALL PLAZA TRU' || dataResponse[i]['TIENDA'] == 'BBW MALL PLAZA TRU' || dataResponse[i]['TIENDA'] == 'VSFA JOCKEY FULL' || dataResponse[i]['TIENDA'] == 'BBW JOCKEY')) {
          viewData.push(rs);
        }

        if (this.profileUser.mt_nivel == "jcarreno" && (dataResponse[i]['TIENDA'] == 'BBW JOCKEY' || dataResponse[i]['TIENDA'] == 'BBW LA RAMBLA' || dataResponse[i]['TIENDA'] == 'VS LA RAMBLA' || dataResponse[i]['TIENDA'] == 'VS PLAZA NORTE' || dataResponse[i]['TIENDA'] == 'VSFA JOCKEY FULL' || dataResponse[i]['TIENDA'] == 'BBW SAN MIGUEL' || dataResponse[i]['TIENDA'] == 'VS SAN MIGUEL' || dataResponse[i]['TIENDA'] == 'BBW SALAVERRY' || dataResponse[i]['TIENDA'] == 'VS SALAVERRY' || dataResponse[i]['TIENDA'] == 'VS MALL DEL SUR' || dataResponse[i]['TIENDA'] == 'VS PURUCHUCO' || dataResponse[i]['TIENDA'] == 'VS MEGA PLAZA' || dataResponse[i]['TIENDA'] == 'VS MINKA' || dataResponse[i]['TIENDA'] == 'BBW ASIA')) {
          viewData.push(rs);
        }


        if (this.profileUser.mt_nivel == "SISTEMAS" || this.profileUser.mt_nivel == "JOHNNY") {
          viewData.push(rs);
        }

      });

      this.onDataView = viewData;

      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  onAutorizar(ev) {

    let parse = {
      hora_extra: ev.HR_EXTRA_ACOMULADO,
      nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
      aprobado: true,
      rechazado: false,
      fecha: ev.FECHA,
      codigo_tienda: ev.CODIGO_TIENDA
    }
    this.socket.emit('autorizar_hrx', parse);
    this.onListHorasAutorizar();
  }

  onRechazar(ev) {

    let parse = {
      hora_extra: ev.HR_EXTRA_ACOMULADO,
      nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
      aprobado: false,
      rechazado: true,
      fecha: ev.FECHA,
      codigo_tienda: ev.CODIGO_TIENDA
    }
    this.socket.emit('autorizar_hrx', parse);
    this.onListHorasAutorizar();
  }

  onViewRegistro(ev) {
    this.isLoading = true;
    let configuracion = [{
      fechain: `${ev['FECHA']}`,
      fechaend: `${ev['FECHA']}`,
      nro_documento: ev['NRO_DOCUMENTO_EMPLEADO']
    }]

    this.socket.emit('consultaHorasTrab', configuracion);
  }

  onBackPap() {
    this.parseHuellero = [];
    this.isDetalle = false;
  }

}
