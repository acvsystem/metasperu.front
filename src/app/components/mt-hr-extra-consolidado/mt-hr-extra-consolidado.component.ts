import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { io } from 'socket.io-client';
import { ShareService } from 'src/app/services/shareService';
import { GlobalConstants } from '../../const/globalConstants';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-hr-extra-consolidado',
  templateUrl: './mt-hr-extra-consolidado.component.html',
  styleUrls: ['./mt-hr-extra-consolidado.component.scss'],
})
export class MtHrExtraConsolidadoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() inUserData: any = {};
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  onListEmpleado: Array<any> = [];
  arDataEJB: Array<any> = [];
  parseEJB: Array<any> = [];
  parseHuellero: Array<any> = [];
  onDataTemp: Array<any> = [];
  bodyList: Array<any> = [];
  dataVerify: Array<any> = [];
  copyBodyList: Array<any> = [];
  arPartTimeFech: Array<any> = [];
  arCopiHoraExtra: Array<any> = [];
  arHoraExtra: Array<any> = [];
  dataViewTolerancia: Array<any> = [];
  isPartTime: boolean = true;
  unidServicio: string = "";
  codeTienda: string = "";
  cboEmpleado: string = "";
  codigoPapeleta: string = "";
  cboTiendaConsulting: string = "";
  nameTienda: string = "";
  hroAcumulada: string = "00:00";
  hroAcumuladaTotal: string = "00:00";
  dataSource = new MatTableDataSource<any>(this.onListEmpleado);
  displayedColumns = ['nombre_completo', 'nro_documento', 'hroAcumulada'];
  isTienda: boolean = false;
  isLoading: boolean = false;
  cboTiendas: Array<any> = [];
  onListTiendas: Array<any> = [];

  constructor(private service: ShareService, private store: StorageService) {
    this.onAllStore();
  }

  ngOnInit() {
    this.onTiempoTolerancia();
    this.onProcess();
    this.onSocketListening();
  }

  onAllStore() {
    this.service.allStores().then((stores: Array<any>) => {
      (stores || []).filter((store) => {
        (this.onListTiendas || []).push(
          {
            code_uns: (store || {}).code_store_ejb,
            uns: (store || {}).service_unit,
            code: (store || {}).serie,
            name: (store || {}).description,
            procesar: 0,
            procesado: -1
          });

        (this.cboTiendas || []).push({
          key: (store || {}).serie,
          value: (store || {}).description
        });
      });
    });
  }

  onProcess() {

    this.onListEmpleado = [];
    this.parseEJB = [];

    if (!Object.keys(this.inUserData).length) {
      this.isTienda = false;
      let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.cboTiendaConsulting);
      this.codeTienda = (unidServicio || {})['code'];
      this.unidServicio = (unidServicio || {})['uns'];
    } else {
      this.isTienda = true;
      this.codeTienda = (this.inUserData || {})['code'];
      this.unidServicio = (this.inUserData || {})['uns'];
    }

    this.socket.emit('consultaListaEmpleado', this.unidServicio);
  }

  onSocketListening() {

    this.socket.on('reporteEmpleadoTienda', async (response) => { //LISTA EMPLEADOS DE TIENDA
      let dataEmpleado = (response || {}).data || [];
      let codigo_uns = (this.onListTiendas || []).find((tienda) => (tienda || {}).code == this.codeTienda);

      (dataEmpleado || []).filter((emp, index) => {
        if (response.id == "EJB") {
          this.arDataEJB = (response || {}).data;
        }

        if (this.arDataEJB.length) {
          (this.arDataEJB || []).filter(async (ejb, i) => {

            if ((codigo_uns || {}).code_uns == '0016') {
              if ((ejb || {}).code_unid_servicio == '0016' || (ejb || {}).code_unid_servicio == '0019') {

                let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
                if (exist == -1) {
                  (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                  (this.parseEJB || []).push({
                    nombre_completo: (ejb || {}).nombre_completo,
                    documento: (ejb || {}).nro_documento,
                    codigo_tienda: this.codeTienda,
                    hroAcumulada: ""
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
                    codigo_tienda: this.codeTienda,
                    hroAcumulada: ""
                  });
                }
              }
            }
          });
        }



        if (dataEmpleado.length - 1 == index) {

          this.afterChange.emit(response);
          this.parseEJB.filter((arEmp) => {

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
              nro_documento: arEmp.documento
            }];

            //SE CONSULTA HORAS EXTRAS DE 2 MESES O 60 DIAS
            this.socket.emit('consultaHorasTrab', configuracion);
          });


          this.dataSource = new MatTableDataSource(this.parseEJB);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;


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
      this.arHoraExtra = [];
      var documentoConsultar = "";
      this.isPartTime = false;
      await (this.parseHuellero || []).filter(async (huellero, i) => { //CALCULO PARA LAS HORAS EXTRAS

        documentoConsultar = (huellero || {}).nroDocumento;

        if (documentoConsultar == '001698517') {
          console.log(huellero);
        }

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
              documento: (huellero || {}).nroDocumento,
              isException: (huellero || {}).isException,
              hr_brake: "",
              hr_ingreso_2: "",
              hr_salida_2: "",
              hr_trabajadas: htrb,
              hr_extra: 0,
              hr_faltante: 0,
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

                let fechaLactancia = tipoAsc[1].trim().split('-');
                var f1 = new Date(parseInt(fechaLactancia[0]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[2])).getTime(); //FECHA DE LACTANCIA
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
                      let obj = { documento: ((ejb || [])[0] || {})['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false };
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

                let fechaLactancia = tipoAsc[1].trim().split('-');
                var f1 = new Date(parseInt(fechaLactancia[0]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[2])).getTime(); //FECHA DE LACTANCIA
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
                  let ejb = this.parseEJB.filter((ejb) => ejb.documento == documentoConsultar);

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

      if (!this.isPartTime && this.onDataTemp.length) {

        this.onDataTemp.filter((dt, indexData) => {

          if (((dt || {}).dataRegistro || []).length == 1) {
            let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
            let defaultHT = "08:00";
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
                let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 ? 'aprobar' : 'correcto';

                let ejb = this.parseEJB.filter((ejb) => ejb.documento == documentoConsultar);

                let aprobado = estado == "correcto" ? true : false;

                (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });

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
            this.onVerificarHrExtra(this.dataVerify, documentoConsultar);
          }
        });
      }


      this.hroAcumulada = this.arHoraExtra[0] || "";
      this.hroAcumuladaTotal = this.arHoraExtra[0] || "";

    });
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'cboTiendaConsulting') {
      this.onProcess();
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

  onVerificarHrExtra(dataVerificar, nro_documento?) {

    let parms = {
      url: '/recursos_humanos/pap/horas_extras',
      body: dataVerificar
    };



    if ((dataVerificar || []).length) {
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

          let sobrante = dt.hrx_sobrante.split(':');
          let hSobrante = parseInt(sobrante[0]) * 60 + parseInt(sobrante[1]);

          if (hSobrante > 0) {
            this.bodyList[i]['extra'] = dt.hrx_sobrante;
          }
          this.bodyList[i]['aprobado'] = dt.aprobado;
          this.bodyList[i]['estado'] = dt.estado;

          if (!dt.seleccionado && dt.aprobado && !dt.verify) {

            if (!this.arHoraExtra.length && dt.estado != "utilizado" && dt.estado != "rechazado") {
              this.arHoraExtra = [dt.extra];
            } else {
              if ((dt.estado == "correcto" || dt.estado == "aprobado") && dt.estado != "rechazado") {
                this.arHoraExtra[0] = this.obtenerHorasTrabajadas(dt.extra, this.arHoraExtra[0]);
              }
            }
          }

          if (this.bodyList.length - 1 == i) {

            this.hroAcumulada = this.arHoraExtra[0] || "";
            this.hroAcumuladaTotal = this.arHoraExtra[0] || "";

            let index = this.parseEJB.findIndex((ejb) => ejb.documento == this.bodyList[0]['documento']);

            if (nro_documento == '71293455') {
              console.log(this.hroAcumulada);
            }

            if (!((this.parseEJB[index] || {})['hroAcumulada'] || "").length) {
              (this.parseEJB[index] || {})['hroAcumulada'] = typeof this.hroAcumulada == 'undefined' || this.hroAcumulada.length == 0 ? '-------' : this.hroAcumulada;
            }

          }
        });
      });
    } else {
      let index = this.parseEJB.findIndex((ejb) => ejb.documento == nro_documento);
      (this.parseEJB[index] || {})['hroAcumulada'] = '-------';
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

  onProcesarPartTime(length, index, row, isUpdate?) {
    this.dataVerify = [];


    let fecha = new Date(row.dia).toLocaleDateString().split('/'); new Date();

    var dias = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];

    var indice = new Date((parseInt(fecha[1])) + "/" + parseInt(fecha[0]) + "/" + (parseInt(fecha[2]))).getDay();

    let estado = row.dataRegistro.length >= 3 ? 'aprobar' : 'correcto';
    let aprobado = estado == "correcto" ? true : false;

    let htrb = row.hr_trabajadas;

    if (((row || {})['papeleta'] || []).length) {
      htrb = this.obtenerHorasTrabajadas(row.hr_trabajadas, (((row || {})['papeleta'] || [])[0] || {})['HORA_SOLICITADA']);
    }

    if (!isUpdate) {
      this.arPartTimeFech.push({
        dia: row.dia, diaNom: dias[indice], hr_trabajadas: htrb, indice: indice
      });
    } else {
      let indexData = (this.arPartTimeFech || []).findIndex((data) => ((data || {}).dia == (row || {}).dia));

      this.arPartTimeFech[indexData]['hr_trabajadas'] = htrb;

    }



    if (length - 1 == index) {

      const ascDates = this.arPartTimeFech.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });

      this.arPartTimeFech = ascDates;
      let count = "00:00";
      let arFechas = [];
      let cFechas = [];




      this.arPartTimeFech.filter(async (pt, index) => {

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
            cFechas.push((this.arPartTimeFech[index] || {}).dia);
            this.arPartTimeFech[index]["fechas"] = arFechas;
            this.arPartTimeFech[index]["fechasProcess"] = cFechas;

            if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[0]) >= 24) {


              this.arPartTimeFech[index]["hrExtra"] = process;

              let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra part time');

              // LIMITE HORA PART TIME

              if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[0]) == 24) {
                if (parseInt((this.arPartTimeFech[index]["hrTrabajadas"] || "").split(":")[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1])) {
                  console.log(this.arPartTimeFech[index]["fechas"]);
                  this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.arPartTimeFech[index]["hrTrabajadas"], fecha: this.arPartTimeFech[index]["fechas"][0]['dia'], hrx_acumulado: this.arPartTimeFech[index]["hrExtra"], extra: this.arPartTimeFech[index]["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: this.arPartTimeFech[index]["fechas"] });
                }
              } else {
                this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.arPartTimeFech[index]["hrTrabajadas"], fecha: this.arPartTimeFech[index]["fechas"][0]['dia'], hrx_acumulado: this.arPartTimeFech[index]["hrExtra"], extra: this.arPartTimeFech[index]["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: this.arPartTimeFech[index]["fechas"] });
              }

            }
          }


          count = "00:00";
          arFechas = [];
          cFechas = [];


        } else {
          arFechas.push({ dia: (this.arPartTimeFech[index] || {}).dia, hr_trabajadas: (this.arPartTimeFech[index] || {}).hr_trabajadas });
          cFechas.push((this.arPartTimeFech[index] || {}).dia);
          count = this.obtenerHorasTrabajadas(hora, count);
        }



        if (this.arPartTimeFech.length - 1 == index) { // TERMINO DEL ARRAY
          this.dataVerify = [];

          await this.onRepoccesarPart((row || {})['dataRegistro'][0]['nroDocumento']).then((dataPromise: any) => {

            (dataPromise || []).filter((dt, i) => {
              if (((dt || {}).fechas || []).length) {
                dataPromise[i]['hrTrabajadas'] = this.sumarHoras((dt || {}).fechas);
              }

              if (dataPromise.length - 1 == i) {
                this.arPartTimeFech = dataPromise;

                dataPromise.filter((dtp, indx) => {

                  if (parseInt((dtp["hrTrabajadas"] || "").split(":")[0]) >= 24) {

                    dtp["hrExtra"] = this.diferenciaHoras(dtp["hrTrabajadas"], '24:00');

                    let tolerancia = this.dataViewTolerancia.find((dtt) => dtt.REFERENCIA == 'hora extra part time');

                    // LIMITE HORA PART TIME

                    if (parseInt((dtp["hrTrabajadas"] || "").split(":")[0]) == 24) {

                      if (parseInt((dtp["hrTrabajadas"] || "").split(":")[1]) >= parseInt(((tolerancia || {}).TIEMPO_TOLERANCIA).split(":")[1])) {
                        console.log(dtp);
                        this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: dtp["hrTrabajadas"], fecha: dtp["fechas"][0]['dia'], hrx_acumulado: dtp["hrExtra"], extra: dtp["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: dtp["fechas"] });
                      }
                    } else {
                      let inx = this.dataVerify.findIndex((dv) => dv.fecha == dataPromise[indx]["fechas"][0]['dia']);

                      if (inx == -1) {
                        this.dataVerify.push({ documento: row.dataRegistro[0]['nroDocumento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: dtp["hrTrabajadas"], fecha: dtp["fechas"][0]['dia'], hrx_acumulado: dtp["hrExtra"], extra: dtp["hrExtra"], estado: estado, aprobado: aprobado, seleccionado: false, arFechas: dtp["fechas"] });
                      }
                    }

                  }


                  if (dataPromise.length - 1 == indx) {

                    this.onVerificarHrExtra(this.dataVerify, row.dataRegistro[0]['nroDocumento']);
                  }
                });
              }
            });
          });

        }

      });

    } else {
      this.onVerificarHrExtra([], row.dataRegistro[0]['nroDocumento']);
    }

  }

  diferenciaHoras(hora1, hora2) {
    const [h1, m1] = hora1.split(':').map(Number);
    const [h2, m2] = hora2.split(':').map(Number);

    const minutos1 = h1 * 60 + m1;
    const minutos2 = h2 * 60 + m2;

    let diferencia = Math.abs(minutos1 - minutos2);

    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }

  sumarHoras(arrayHoras: Array<any>) {
    let totalMinutos = 0;
    let arF = [];
    let horasTotales;
    let minutosRestantes;
    (arrayHoras || []).forEach((ar, i) => {
      arF.push(ar.hr_trabajadas);
      if (arrayHoras.length - 1 == i) {
        (arF || []).filter((hora) => {
          let [h, m] = (hora || "").split(':').map(Number);
          totalMinutos += h * 60 + m;
        });

        horasTotales = Math.floor(totalMinutos / 60);
        minutosRestantes = totalMinutos % 60;

      }
    });

    return `${String(horasTotales).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`;

  }

  onVerifyPap(fecha, documento) {
    let parms = {
      url: '/papeleta/search/fecha',
      body: { nroDocumento: documento, dia: fecha }
    };

    return this.service.post(parms).then(async (response) => {
      return response;
    });

  }

  onRepoccesarPart(nroDocumento) {
    return new Promise((resolve, reject) => {
      let dataPT = [...this.arPartTimeFech];
      dataPT.filter((fecha, i) => {
        if (((fecha || {})['fechasProcess'] || []).length) {

          let fechaFaltante = this.fechasFaltantesDeSemana(((fecha || {})['fechasProcess'] || []), i, nroDocumento);

          (fechaFaltante || []).filter((fecha, j) => {
            this.onVerifyPap(fecha.dia, fecha.documento).then((rs) => {
              if (((rs || {}).data || []).length) {
                let data = ((rs || {}).data || [])[0];
                const [h, m] = (data.HORA_SOLICITADA || "").split(':').map(Number);
                let hora = String(h).length == 1 ? `0${h}:${String(m).padStart(2, '0')}` : data.HORA_SOLICITADA;
                dataPT[fecha['index']]['fechas'].push({ dia: data.FECHA_DESDE, hr_trabajadas: hora, isPapeleta: true });
              }

              if (fechaFaltante.length - 1 == j) {
                setTimeout(() => {
                  resolve(dataPT);
                }, 2000);
              }
            });
          });
        }
      });
    });
  }

  obtenerLunes(fechaStr) {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = (dia + 6) % 7; // diferencia desde el lunes
    fecha.setDate(fecha.getDate() - diff);
    fecha.setHours(0, 0, 0, 0);
    return (fecha).toISOString().slice(0, 10);
  }

  generarSemanaDesdeLunes(lunesStr, index, documento) {
    const fechas = [];
    const lunes = new Date(lunesStr);
    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      fechas.push({ dia: dia.toISOString().slice(0, 10), index: index, documento: documento });
    }
    return fechas;
  }

  fechasFaltantesDeSemana(fechasArray, index, documento) {

    if (fechasArray.length === 0) return [];

    const lunesSemana = this.obtenerLunes(fechasArray[fechasArray.length - 1]);

    const semanaCompleta = this.generarSemanaDesdeLunes(lunesSemana, index, documento);
    const fechasSet = new Set(fechasArray);

    return semanaCompleta.filter(fecha => !fechasSet.has(fecha.dia));
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
