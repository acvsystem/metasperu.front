import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { io } from "socket.io-client";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StorageService } from 'src/app/utils/storage';
import { MtModalComentarioComponent } from '../../components/mt-modal-comentario/mt-modal-comentario.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { GlobalConstants } from '../../const/globalConstants';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'mt-autorizacion-hora-extra',
  templateUrl: './mt-autorizacion-hora-extra.component.html',
  styleUrls: ['./mt-autorizacion-hora-extra.component.scss'],
})
export class MtAutorizacionHoraExtraComponent implements OnInit {
  //socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  readonly dialog = inject(MatDialog);
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
  filterEmpleado: string = "";
  onListTiendas: Array<any> = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: StorageService, private service: ShareService, private socket: SocketService) {

  }

  async ngOnInit() {


    await this.onAllStore();

    this.profileUser = this.store.getStore('mt-profile');


    this.socket.on('lista_solicitudes', async (response) => {
      let dataResponse = response;
      let viewData = [];
      await dataResponse.filter(async (rs, i) => {

        let selectedLocal = await this.onListTiendas.find((data) => data.code == rs['CODIGO_TIENDA']) || {};
        dataResponse[i]['TIENDA'] = (selectedLocal || {}).name;
        dataResponse[i]['ESTADO'] = !rs.APROBADO && !rs.RECHAZADO ? 'pendiente' : rs.APROBADO ? 'aprobado' : rs.RECHAZADO ? 'rechazado' : '';
      });

      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'COMENTARIO', 'APROBADO_POR', 'ESTADO', 'AUTORIZAR'];

      let dataPendiente = dataResponse.filter((pendiente) => pendiente.ESTADO == 'pendiente');

      await dataPendiente.filter((pen, i) => {
        if (this.profileUser.mt_name_1 == "cmoron" && (pen['TIENDA'] == 'BBW MALL AVENTURA AQP' || pen['TIENDA'] == 'VS MALL AVENTURA AQP' || pen['TIENDA'] == 'VS MALL PLAZA TRU' || pen['TIENDA'] == 'BBW MALL PLAZA TRU' || pen['TIENDA'] == 'VSFA JOCKEY FULL' || pen['TIENDA'] == 'BBW JOCKEY')) {
          viewData.push(pen);
        }

        if ((this.profileUser.mt_name_1 == "jcarreno" || this.profileUser.mt_name_1 == "paulodosreis") && (pen['TIENDA'] == 'BBW JOCKEY' || pen['TIENDA'] == 'BBW LA RAMBLA' || pen['TIENDA'] == 'VS LA RAMBLA' || pen['TIENDA'] == 'VS PLAZA NORTE' || pen['TIENDA'] == 'VS MALL AVENTURA SANTA ANITA' || pen['TIENDA'] == 'BBW SAN MIGUEL' || pen['TIENDA'] == 'VS SAN MIGUEL' || pen['TIENDA'] == 'BBW SALAVERRY' || pen['TIENDA'] == 'VS SALAVERRY' || pen['TIENDA'] == 'VS MALL DEL SUR' || pen['TIENDA'] == 'VS PURUCHUCO' || pen['TIENDA'] == 'VS MEGA PLAZA' || pen['TIENDA'] == 'VS MINKA' || pen['TIENDA'] == 'BBW ASIA')) {
          viewData.push(pen);
        }


        if (this.profileUser.mt_nivel == "SISTEMAS" || this.profileUser.mt_nivel == "JOHNNY" || this.profileUser.mt_nivel == 'RRHH') {
          viewData.push(pen);
        }
      });

      await dataResponse.filter((pen, i) => {

        if (pen.ESTADO != 'pendiente') {
          if (this.profileUser.mt_name_1 == "cmoron" && (pen['TIENDA'] == 'BBW MALL AVENTURA AQP' || pen['TIENDA'] == 'VS MALL AVENTURA AQP' || pen['TIENDA'] == 'VS MALL PLAZA TRU' || pen['TIENDA'] == 'BBW MALL PLAZA TRU' || pen['TIENDA'] == 'VSFA JOCKEY FULL' || pen['TIENDA'] == 'BBW JOCKEY')) {
            viewData.push(pen);
          }

          if ((this.profileUser.mt_name_1 == "jcarreno" || this.profileUser.mt_name_1 == "paulodosreis") && (pen['TIENDA'] == 'BBW JOCKEY' || pen['TIENDA'] == 'BBW LA RAMBLA' || pen['TIENDA'] == 'VS LA RAMBLA' || pen['TIENDA'] == 'VS PLAZA NORTE' || pen['TIENDA'] == 'VS MALL AVENTURA SANTA ANITA' || pen['TIENDA'] == 'BBW SAN MIGUEL' || pen['TIENDA'] == 'VS SAN MIGUEL' || pen['TIENDA'] == 'BBW SALAVERRY' || pen['TIENDA'] == 'VS SALAVERRY' || pen['TIENDA'] == 'VS MALL DEL SUR' || pen['TIENDA'] == 'VS PURUCHUCO' || pen['TIENDA'] == 'VS MEGA PLAZA' || pen['TIENDA'] == 'VS MINKA' || pen['TIENDA'] == 'BBW ASIA')) {
            viewData.push(pen);
          }


          if (this.profileUser.mt_nivel == "SISTEMAS" || this.profileUser.mt_nivel == "JOHNNY" || this.profileUser.mt_nivel == 'RRHH') {
            viewData.push(pen);
          }
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

    if (this.onListTiendas.length) {
      this.onListHorasAutorizar();
    }
  }

  onAllStore() {
    return new Promise((resolve, reject) => {
      this.service.allStores().then((stores: Array<any>) => {
        (stores || []).filter((store) => {
          (this.onListTiendas || []).push({
            uns: (store || {}).service_unit,
            code: (store || {}).serie,
            name: (store || {}).description,
            procesar: 0,
            procesado: -1
          });
        });

        resolve(this.onListTiendas);
      });
    });
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

      this.displayedColumns = ['TIENDA', 'FECHA', 'HORA_EXTRA', 'NOMBRE_COMPLETO', 'COMENTARIO', 'APROBADO_POR', 'ESTADO', 'AUTORIZAR'];
      let dataResponse = response;

      let viewData = [];

      await dataResponse.filter(async (rs, i) => {
        let selectedLocal = await this.onListTiendas.find((data) => data.code == rs['CODIGO_TIENDA']) || {};
        dataResponse[i]['TIENDA'] = (selectedLocal || {}).name;
        dataResponse[i]['ESTADO'] = !rs.APROBADO && !rs.RECHAZADO ? 'pendiente' : rs.APROBADO ? 'aprobado' : rs.RECHAZADO ? 'rechazado' : '';
      });

      let dataPendiente = dataResponse.filter((pendiente) => pendiente.ESTADO == 'pendiente');


      await dataPendiente.filter((pen, i) => {
        if (this.profileUser.mt_name_1 == "cmoron" && (pen['TIENDA'] == 'BBW MALL AVENTURA AQP' || pen['TIENDA'] == 'VSBA MALL AVENTURA AQP' || pen['TIENDA'] == 'VSBA MALL PLAZA TRU' || pen['TIENDA'] == 'BBW MALL PLAZA TRU' || pen['TIENDA'] == 'VSFA JOCKEY FULL' || pen['TIENDA'] == 'BBW JOCKEY')) {
          viewData.push(pen);
        }

        if ((this.profileUser.mt_name_1 == "jcarreno" || this.profileUser.mt_name_1 == "paulodosreis") && (pen['TIENDA'] == 'BBW JOCKEY' || pen['TIENDA'] == 'BBW LA RAMBLA' || pen['TIENDA'] == 'VSBA LA RAMBLA' || pen['TIENDA'] == 'VSBA PLAZA NORTE' || pen['TIENDA'] == 'VS MALL AVENTURA SANTA ANITA' || pen['TIENDA'] == 'BBW SAN MIGUEL' || pen['TIENDA'] == 'VSBA SAN MIGUEL' || pen['TIENDA'] == 'BBW SALAVERRY' || pen['TIENDA'] == 'VSBA SALAVERRY' || pen['TIENDA'] == 'VSBA MALL DEL SUR' || pen['TIENDA'] == 'VSBA PURUCHUCO' || pen['TIENDA'] == 'VSBA MEGA PLAZA' || pen['TIENDA'] == 'VSBA MINKA' || pen['TIENDA'] == 'BBW ASIA')) {
          viewData.push(pen);
        }


        if (this.profileUser.mt_nivel == "SISTEMAS" || this.profileUser.mt_nivel == "JOHNNY" || this.profileUser.mt_nivel == 'RRHH') {
          viewData.push(pen);
        }
      });

      await dataResponse.filter((pen, i) => {
        if (pen.ESTADO != 'pendiente') {
          if (this.profileUser.mt_name_1 == "cmoron" && (pen['TIENDA'] == 'BBW MALL AVENTURA AQP' || pen['TIENDA'] == 'VSBA MALL AVENTURA AQP' || pen['TIENDA'] == 'VSBA MALL PLAZA TRU' || pen['TIENDA'] == 'BBW MALL PLAZA TRU' || pen['TIENDA'] == 'VSFA JOCKEY FULL' || pen['TIENDA'] == 'BBW JOCKEY')) {
            viewData.push(pen);
          }

          if ((this.profileUser.mt_name_1 == "jcarreno" || this.profileUser.mt_name_1 == "paulodosreis") && (pen['TIENDA'] == 'BBW JOCKEY' || pen['TIENDA'] == 'BBW LA RAMBLA' || pen['TIENDA'] == 'VSBA LA RAMBLA' || pen['TIENDA'] == 'VSBA PLAZA NORTE' || pen['TIENDA'] == 'VS MALL AVENTURA SANTA ANITA' || pen['TIENDA'] == 'BBW SAN MIGUEL' || pen['TIENDA'] == 'VSBA SAN MIGUEL' || pen['TIENDA'] == 'BBW SALAVERRY' || pen['TIENDA'] == 'VSBA SALAVERRY' || pen['TIENDA'] == 'VSBA MALL DEL SUR' || pen['TIENDA'] == 'VSBA PURUCHUCO' || pen['TIENDA'] == 'VSBA MEGA PLAZA' || pen['TIENDA'] == 'VSBA MINKA' || pen['TIENDA'] == 'BBW ASIA')) {
            viewData.push(pen);
          }


          if (this.profileUser.mt_nivel == "SISTEMAS" || this.profileUser.mt_nivel == "JOHNNY" || this.profileUser.mt_nivel == 'RRHH') {
            viewData.push(pen);
          }
        }
      });

      this.onDataView = viewData;

      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  onAutorizar(ev) {
    let perfil = this.store.getStore('mt-profile');
    let parse = {
      hora_extra: ev.HR_EXTRA_ACOMULADO,
      nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
      aprobado: true,
      rechazado: false,
      fecha: ev.FECHA,
      codigo_tienda: ev.CODIGO_TIENDA,
      usuario: (perfil || {}).mt_name_1 || ''
    }
    this.socket.emit('autorizar_hrx', parse);
    this.onListHorasAutorizar();
  }


  onRechazar(ev) {

    const dialogRef = this.dialog.open(MtModalComentarioComponent, {
      data: { comentario: "", isRechazar: true, isStock: false },
      width: '500px'

    });

    dialogRef.afterClosed().subscribe(result => {
      if ((result || "").length) {
        let perfil = this.store.getStore('mt-profile');
        let parse = {
          hora_extra: ev.HR_EXTRA_ACOMULADO,
          nro_documento: ev.NRO_DOCUMENTO_EMPLEADO,
          aprobado: false,
          rechazado: true,
          fecha: ev.FECHA,
          codigo_tienda: ev.CODIGO_TIENDA,
          usuario: (perfil || {}).mt_name_1 || '',
          comentario: result
        }

        this.socket.emit('autorizar_hrx', parse);
        this.onListHorasAutorizar();
      } else {
        this.service.toastError("Tiene que poner un comentario sobre el porque fue rechazado", "Autorizacion Hora extra");
      }
    });
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

  applyFilterPapeleta(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  afterAction(ev) {
    let isApproved = (ev || {}).approved;
    if (isApproved) {
      this.onAutorizar((ev || {}).data);
    }

    if (!isApproved && typeof isApproved != 'undefined') {
      this.onRechazar((ev || {}).data)
    }

  }

}
