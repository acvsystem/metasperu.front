import { Component, HostListener, inject, Input, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '@metasperu/utils/storage';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ShareService } from '@metasperu/services/shareService';
import * as html2pdf from 'html2pdf.js';
import * as $ from 'jquery';
import { SocketService } from '@metasperu/services/socket.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'mt-horario-tienda',
  templateUrl: './mt-horario-tienda.component.html',
  styleUrls: ['./mt-horario-tienda.component.scss']
})
export class MtHorarioTiendaComponent implements OnInit {
  @Input() data: Array<any> = [];
  //socket = io(GlobalConstants.backendServer, { reconnectionDelayMax: 10000, query: { code: 'app' } });
  cboCargo: number = 0;
  idCargo: number = 1;
  horaInit: string = "";
  isOpenModal: boolean = false;
  isObservacion: boolean = false;
  isPapeleta: boolean = false;
  isExpiredDay: boolean = false;
  isStartEditRg: boolean = false;
  isPapeletaDay: boolean = false;
  isLoading: boolean = false;
  isViewPapeleta: boolean = false;
  dataSource = new MatTableDataSource<any>([]);

  dataObservation: Array<any> = [];
  onListEmpleado: Array<any> = [];
  allPapeletas: Array<any> = [];
  selectedIdRango: number = 0;
  indexObservacion: number = -1;
  horaEnd: string = "";
  codeTienda: string = "";
  unidServicio: string = "";
  codigoPap: string = "";
  isSearch: boolean = false;
  idCalendar: number = 0;
  arListDia: Array<any> = [
    { id: 1, dia: "Lunes", fecha: "16-sep", isObservacion: false, isExpired: false },
    { id: 2, dia: "Martes", fecha: "17-sep", isObservacion: false, isExpired: false },
    { id: 3, dia: "Miercoles", fecha: "18-sep", isObservacion: false, isExpired: false },
    { id: 4, dia: "Jueves", fecha: "19-sep", isObservacion: false, isExpired: false },
    { id: 5, dia: "Viernes", fecha: "20-sep", isObservacion: false, isExpired: false },
    { id: 6, dia: "Sabado", fecha: "21-sep", isObservacion: false, isExpired: false },
    { id: 7, dia: "Domingo", fecha: "22-sep", isObservacion: false, isExpired: false }
  ];
  arRangeFecha: Array<any> = [];
  vSelectDia: number = 0;
  vSelectHorario: number = 0;
  onListCargo: Array<any> = [];
  vRangoDiasSearch: String = "";
  dataHorario: Array<HorarioElement> = [];
  titleObservacion: String = "";
  nameTienda: string = "";
  arListTrabajador: Array<any> = [];
  parseEJB: Array<any> = [];
  optionDefault: Array<any> = [];
  arDataEJB: Array<any> = [];
  arDataServer: Array<any> = [];
  arObservacion: Array<any> = [];
  displayedColumns: string[] = ['codigo_papeleta', 'Fecha', 'tipo_papeleta', 'nombre_completo', 'Accion'];
  screenHeight: number = 0;
  screenWith: number = 0;
  vObservacion: string = "";
  onListTiendas: Array<any> = [
    { code_uns: '0001', uns: 'ADMINISTRACION', code: 'OF', name: 'ADMINISTRACION', procesar: 0, procesado: -1 }
  ];

  isRangoEdit: boolean = false;

  arListaDiaTrab: Array<any> = [];
  profileUser: any = {};
  dataViewPermiso: Array<any> = [];

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @HostListener('window:resize', ['$event'])
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  getScreenSize(event?) {
    this.screenHeight = window.innerHeight - 100;
    this.screenWith = window.innerWidth - 10;
  }

  constructor(private store: StorageService, private service: ShareService, private socket: SocketService) {

  }



  async ngOnInit() {

    await this.onAllStore();

    this.profileUser = this.store.getStore('mt-profile');

    if ((this.profileUser || {}).mt_nivel == "RRHH" || (this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "OPERACIONES" || (this.profileUser || {}).mt_nivel == "FIELDLEADER") {
      this.store.setStore('mt-profile', JSON.stringify({
        "mt_name_1": (this.profileUser || {}).mt_name_1,
        "mt_nivel": (this.profileUser || {}).mt_nivel,
        "code": "OF"
      }));

    }

    this.getScreenSize();
    if ((this.data || []).length) {
      this.isLoading = true;
      this.onSearchCalendario(`${(this.data || [])[0]['rango_1']} ${(this.data || [])[0]['rango_2']}`, (this.data || [])[0]['code']);
    }

    let dataHr = this.store.getStore("mt-horario") || [];
    this.isSearch = this.store.getStore("mt-isSearch") || false;

    if ((dataHr || []).length) {
      this.dataHorario = dataHr || [];
      await this.dataHorario.filter((dt, index) => {
        if (!this.dataHorario[index]['dias'].length) {
          this.dataHorario[index]['dias'] = this.arListDia
        }
        //this.onListCargo.push({ key: dt.id, value: dt.cargo });
      });

    }


    if (!this.isSearch && (this.profileUser || {}).mt_nivel == "RRHH" || (this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "OPERACIONES" || (this.profileUser || {}).mt_nivel == "FIELDLEADER") {
      this.onListCargo = [
        { key: 1, value: "Recursos Humanos" },
        { key: 2, value: "Contabilidad" },
        { key: 3, value: "Sistemas" },
        { key: 4, value: "Recepcion" },
        { key: 5, value: "Vacaciones" }
      ];
    } else {
      this.onListCargo = [
        { key: 1, value: "Gerentes" },
        { key: 2, value: "Cajeros" },
        { key: 3, value: "Asesores" },
        { key: 4, value: "Almaceneros" },
        { key: 5, value: "Asesores part time" },
        { key: 6, value: "Vacaciones" },
      ];
    }


    if (this.dataHorario.length) {
      this.onListCargo = [];
      let dateNow = new Date();
      let day = new Date(dateNow).toLocaleDateString().split('/');
      let fechaActual = `${day[2]}-${day[1]}-${day[0]}`

      await this.dataHorario.filter((dt, index) => {
        if (!this.dataHorario[index]['dias'].length) {
          this.dataHorario[index]['dias'] = this.arListDia
        }


        this.dataHorario[index]['dias'].filter((ds, i) => {
          let parseDate = ds.fecha_number.split('-');
          let fechaInicio = new Date(fechaActual);
          let fechaFin = new Date(`${parseDate[2]}-${parseDate[1]}-${parseDate[0]}`);

          if ((fechaFin.getTime() < fechaInicio.getTime() || fechaFin.getTime() == fechaInicio.getTime()) && (this.profileUser || {}).mt_nivel != "RRHH" && (this.profileUser || {}).mt_nivel != "SISTEMAS" && (this.profileUser || {}).mt_nivel != "JOHNNY") {
            this.dataHorario[index]['dias'][i]['isExpired'] = true;
          } else {
            this.dataHorario[index]['dias'][i]['isExpired'] = false;
          }

          (this.dataViewPermiso || []).filter((tienda) => {
            //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
            if (this.codeTienda == (tienda || {}).SERIE_TIENDA && (tienda || {}).IS_FREE_HORARIO) {
              this.dataHorario[index]['dias'][i]['isExpired'] = false;
            }
          });

          let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);

          if (obsExist != -1) {
            this.dataHorario[index]['dias'][i]['isObservation'] = true;
          }
        });


        this.idCargo = this.dataHorario[index]['id'];

        //  this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];


        this.dataHorario[index]['dias'].filter((ds, i) => {
          let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);
          if (obsExist != -1) {
            this.dataHorario[index]['dias'][i]['isObservation'] = true;
          }


        });

        this.onListCargo.push({ key: dt.id, value: dt.cargo });

      });
    }

    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.filter((tienda) => tienda.code == this.codeTienda);
    this.unidServicio = (unidServicio || {})['uns'];
    this.onListEmpleado = [];

    this.socket.emit('horario/empleadoEJB', this.unidServicio);

    this.socket.on('reporteEmpleadoTienda', async (response) => {
      let dataEmpleado = (response || {}).data;
      let codigo_uns = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);

      dataEmpleado.filter((emp) => {
        if (response.id == "EJB") {
          this.arDataEJB = (response || {}).data;
        }

        if (this.arDataEJB.length) {

          this.arDataEJB.filter(async (ejb) => {
            if (this.codeTienda == '7F') {
              if (((ejb || {}).code_unid_servicio == '0016' || (ejb || {}).code_unid_servicio == '0019') && ((ejb || {}).nro_documento).trim() != '001763881' && ((ejb || {}).nro_documento).trim() != '75946420' && ((ejb || {}).nro_documento).trim() != '003755453' && ((ejb || {}).nro_documento).trim() != '002217530' && ((ejb || {}).nro_documento).trim() != '002190263' && ((ejb || {}).nro_documento).trim() != '70276451') {
                let exist = this.arListTrabajador.findIndex((pr) => pr.documento == ((ejb || {}).nro_documento).trim());

                if (exist == -1) {
                  this.arListTrabajador.push(
                    { id: this.arListTrabajador.length + 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: (ejb || {}).nombre_completo, documento: ((ejb || {}).nro_documento).trim() }
                  );
                }
              }
            } else {
              if ((ejb || {}).code_unid_servicio == (codigo_uns || {}).code_uns && ((ejb || {}).nro_documento).trim() != '001763881' && ((ejb || {}).nro_documento).trim() != '75946420' && ((ejb || {}).nro_documento).trim() != '003755453' && ((ejb || {}).nro_documento).trim() != '002217530' && ((ejb || {}).nro_documento).trim() != '002190263' && ((ejb || {}).nro_documento).trim() != '70276451') {
                let exist = this.arListTrabajador.findIndex((pr) => pr.documento == ((ejb || {}).nro_documento).trim());
                if (exist == -1) {
                  this.arListTrabajador.push(
                    { id: this.arListTrabajador.length + 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: (ejb || {}).nombre_completo, documento: ((ejb || {}).nro_documento).trim() }
                  );
                }
              }
            }
          });
        }
      });
    });

    this.onListPapeleta();
    this.onPermisosTienda();
  }

  onAllStore() {
    this.service.allStores().then((stores: Array<any>) => {
      (stores || []).filter((store) => {
        (this.onListTiendas || []).push({
          code_uns: (store || {}).code_store_ejb,
          uns: (store || {}).service_unit,
          code: (store || {}).serie,
          name: (store || {}).description,
          procesar: 0,
          procesado: -1
        });
      });
    });
  }

  onPermisosTienda() {
    let parms = {
      url: '/security/configuracion/permisos/hp'
    };
    this.service.get(parms).then((response) => {
      this.dataViewPermiso = response || [];
    });
  }

  onListPapeleta() {

    let code = this.data.length ? (this.data || [])[0]['code'] : this.codeTienda;
    let parms = {
      url: '/recursos_humanos/pap/lista/papeleta',
      body: [{ codigo_tienda: code }]
    };

    this.service.post(parms).then(async (response) => {
      this.allPapeletas = response;
    });
  }


  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (typeof this.cboCargo != "undefined") {
      this.vSelectHorario = 0;
      let index = this.dataHorario.findIndex((cr) => cr.id == this.cboCargo);

      this.idCargo = this.dataHorario[index]['id'];

      // this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];

      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      this.dataHorario[index]['dias'].filter((ds, i) => {
        let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);
        if (obsExist != -1) {
          this.dataHorario[index]['dias'][i]['isObservation'] = true;
        }

      });

      // this.socket.emit('actualizarHorario', this.dataHorario);
      this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

    }

  }

  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onCaledar($event) {
    if ($event.isTime) {
      this[$event.id] = $event.value;
    }
  }

  esMayorADocePM(hora) {
    const [hh, mm] = hora.split(":").map(Number);
    return hh > 12 || (hh === 12 && mm >= 0);
  }

  onAddHorario() {
    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    if (index != -1 && this.horaInit.length && this.horaEnd.length) {
      let exist = this.dataHorario[index]['rg_hora'].findIndex((rgh) => rgh.rg == `${this.horaInit} a ${this.horaEnd}`);
      if (exist == -1) {

        let hora = this.obtenerDiferenciaHora(this.horaInit, this.horaEnd);
        let confirmHora = (hora || "").split(":");
        let selectCargo = this.onListCargo.find((dt) => dt.key == this.cboCargo);
        if (this.esMayorADocePM(this.horaEnd) || (selectCargo || {}).value == 'Asesores part time' || (selectCargo || {}).value == 'Vacaciones') {
          if (parseInt(confirmHora[0]) <= 9) {

            if (this.isSearch) {
              let parms = {
                url: '/horario/insert/rangoHorario',
                body: {
                  codigo_tienda: this.codeTienda,
                  rg: `${this.horaInit} a ${this.horaEnd}`,
                  id: this.dataHorario[index]['id']
                }
              };

              this.service.post(parms).then(async (response) => {
                if ((response || {}).success) {
                  this.dataHorario[index]['rg_hora'].push({ id: (response || {}).id, position: this.dataHorario[index]['rg_hora'].length + 1, codigo_tienda: this.codeTienda, rg: `${this.horaInit} a ${this.horaEnd}` });
                  this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

                  this.service.toastSuccess("Registrado con exito...!!", "Rango horario");
                } else {
                  this.service.toastError("Algo salio mal..!!", "Rango horario");
                }

              });

            } else {
              this.dataHorario[index]['rg_hora'].push({ id: this.dataHorario[index]['rg_hora'].length + 1, codigo_tienda: this.codeTienda, rg: `${this.horaInit} a ${this.horaEnd}` });
              this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
            }

          } else {
            this.service.toastError('Rango de hora debe ser menor o igual a 9 horas...!!', "Horario");
          }
        } else {
          this.service.toastError('Rango horario tiene que ser en formato de 24 horas y para part time seleccione en cargo: Asesor Part Time!!', "Horario");
        }
      } else {
        this.service.toastError('Rango de hora ya existe..!!', "Horario");
      }

    } else {
      this.service.toastError('Seleccione rango horario..!!', "Horario");
    }

    // this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
    // this.socket.emit('actualizarHorario', this.dataHorario);
    setTimeout(() => {
      //this.onUpdateRango();
    }, 1000);
  }

  vDataDiaSelected: any = {};
  vIdSelectH: number = 0;
  vIdPosition: number = 0;
  onSelectDataDia(id_horario?, id_dia?, dataDia?, idSelectH?, idPosicion?) {

    this.vSelectHorario = id_horario;
    this.vDataDiaSelected = dataDia;
    this.vIdSelectH = idSelectH;
    this.vIdPosition = idPosicion;
    if (this.vSelectHorario > 0) {
      this.vSelectDia = id_dia;

      this.idCalendar = idSelectH;
      this.isExpiredDay = (dataDia || {})['isExpired'] || false;
      let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

      let objDia = this.dataHorario[index]['dias'].find((dia) => dia.id == this.vSelectDia);

      this.titleObservacion = objDia['dia'];

      let dateNow = new Date();
      let day = new Date(dateNow).toLocaleDateString().split('/');
      let fechaActual = `${day[2]}-${day[1]}-${day[0]}`

      this.dataHorario[index]['dias'].filter((ds, i) => {
        let parseDate = ds.fecha_number.split('-');
        let fechaInicio = new Date(fechaActual);
        let fechaFin = new Date(`${parseDate[2]}-${parseDate[1]}-${parseDate[0]}`);



        if ((fechaFin.getTime() < fechaInicio.getTime() || fechaFin.getTime() == fechaInicio.getTime()) && (this.profileUser || {}).mt_nivel != "RRHH" && (this.profileUser || {}).mt_nivel != "SISTEMAS" && (this.profileUser || {}).mt_nivel != "JOHNNY") {
          this.dataHorario[index]['dias'][i]['isExpired'] = true;
        } else {
          this.dataHorario[index]['dias'][i]['isExpired'] = false;
        }

        (this.dataViewPermiso || []).filter((tienda) => {
          //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
          if (this.codeTienda == (tienda || {}).SERIE_TIENDA && (tienda || {}).IS_FREE_HORARIO) {
            this.dataHorario[index]['dias'][i]['isExpired'] = false;
          }
        });


        let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);

        if (obsExist != -1) {
          this.dataHorario[index]['dias'][i]['isObservation'] = true;
        }
      });

      if (this.vSelectDia > 0 && this.vSelectHorario > 0 && dataDia['isExpired'] == false) {

        let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
        let dataTrabajadores = [];

        if (index != -1) {
          let objDia = this.dataHorario[index]['dias'].find((dia) => dia.id == this.vSelectDia);

          this.titleObservacion = objDia['dia'];


          let arrDiaTrabajo = [];

          let arOf = [...this.arListTrabajador];
          this.dataHorario[index]['arListTrabajador'] = [];
          this.dataHorario.filter(async (dt2, index2) => {
            let listaDiasTrb =
              await this.dataHorario[index2]['dias_trabajo'].filter((diaTr) => {
                if (this.isSearch) {
                  let dia = this.dataHorario[index2]['dias'].find((dia) => dia.id == diaTr.id_dia);
                  if (dia.position == idPosicion) {
                    arrDiaTrabajo.push(diaTr);
                  }
                } else {
                  if (diaTr.id_dia == this.vSelectDia) {
                    arrDiaTrabajo.push(diaTr);
                  }
                }
              });

            if (this.dataHorario.length - 1 == index2) {
              await arrDiaTrabajo.filter((artd) => {
                let index = arOf.findIndex((ar) => ar.nombre_completo == artd.nombre_completo);
                if (index > -1) {
                  arOf.splice(index, 1);
                }
              });

              arOf.filter((emp, indexEmp) => {
                this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, dl: false, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: emp.nombre_completo, numero_documento: emp.documento });

                if (arOf.length - 1 == indexEmp) {
                  if (this.dataHorario[index]['arListTrabajador'].length) {
                    this.dataHorario[index]['dias_libres'].filter((dl) => {

                      let registro = this.dataHorario[index]['arListTrabajador'].find((tr) => tr.id_dia == dl.id_dia && tr.nombre_completo == dl.nombre_completo) || {};

                      if (Object.keys(registro).length) {
                        setTimeout(() => {
                          let elemntButtonAdd = document.getElementsByName('addHorario-' + registro.id);
                          let elementButtonDL = document.getElementsByName('addDL-' + registro.id);

                          let classList;
                          classList = elementButtonDL[0]['classList']['value'].split(' ');

                          let exist = classList.indexOf('agregado');

                          if (exist == -1) {

                            elemntButtonAdd[0]['disabled'] = true
                            elementButtonDL[0]['innerHTML'] = '<i class="fa fa-calendar-times-o" aria-hidden="true"></i>';
                            elementButtonDL[0]['className'] = 'btn btn-danger btn-sm agregado';
                            elementButtonDL[0]['attributes']['mattooltip']['value'] = 'Quitar trabajor de dia libre';
                            elementButtonDL[0]['attributes']['mattooltip']['textContent'] = 'Quitar trabajor de dia libre';
                            elementButtonDL[0]['attributes']['mattooltip']['nodeValue'] = 'Quitar trabajor de dia libre';
                          } else {
                            elemntButtonAdd[0]['disabled'] = false;
                            elementButtonDL[0]['innerHTML'] = '<i class="fa fa-calendar-check-o" aria-hidden="true"></i>';
                            elementButtonDL[0]['className'] = 'btn btn-success btn-sm';
                          }
                        }, 50);


                      }

                    });
                  }
                }

              });
            }
          });

          /*
                              dataTrabajadores = [...this.dataHorario[index]['arListTrabajador']];
          
                              this.dataHorario[index]['arListTrabajador'] = [];
          
                              dataTrabajadores.filter((tr) => {
          
                                  let isExist = this.dataHorario[index]['dias_trabajo'].findIndex((dt) => dt.nombre_completo == tr.nombre_completo && dt.id_dia == tr.id_dia && dt.id_cargo == tr.id_cargo);
                                  if (isExist != -1) {
          
                                  } else {
                                      this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, dl: false, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: tr.nombre_completo, numero_documento: tr.numero_documento });
                                  }
                              });
          */



          // this.socket.emit('actualizarHorario', this.dataHorario);
          this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

        }

      }
    } else {
      this.service.toastError("Seleccione un rango horario...!!", "Horario");
    }

  }


  onRevidarDataTrabajador(data) {



  }

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
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

  onAddDTrabajo(data) {

    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
    let isRegister = this.dataHorario[index]['dias_trabajo'].findIndex((dtr) => dtr.id_dia == data.id_dia && dtr.nombre_completo == data.nombre_completo);
    if (isRegister != -1) {
      this.service.toastError('No se puede asignar a otro horario...!!', "Dia Trabajo");
    } else {

      let isContinue = true;
      let arDias = [];
      this.dataHorario.filter((dt) => {
        dt.dias.filter((d) => {
          if (d.position == this.vIdPosition) {
            arDias.push(d.id);
          }
        });
      });


      this.dataHorario.filter((dth, i) => {
        let exist = this.dataHorario[i]['dias_libres'].find((dl) => dl.nombre_completo == (data || {}).nombre_completo && dl.id_dia == (data || {}).id_dia);


        if (Object.keys(exist || {}).length && isContinue) {
          isContinue = false;
          this.service.toastError('Ya esta asignado a un dia libre...!!', "Dia Trabajo");
        }


      });

      if (this.isSearch) {
        if (isContinue) {
          let parms = {
            url: '/horario/insert/diaTrabajo',
            body: {
              codigo_tienda: this.codeTienda,
              numero_documento: (data || {}).numero_documento,
              nombre_completo: (data || {}).nombre_completo,
              id_rango: (data || {}).rg,
              id_dia: (data || {}).id_dia,
              id_horario: this.dataHorario[index]['id']
            }
          }

          this.service.post(parms).then(async (response) => {
            if ((response || {}).success) {
              this.dataHorario[index]['dias_trabajo'].push({ id: (response || {}).id, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });

              this.onSelectDataDia(this.vSelectHorario, this.vSelectDia, this.vDataDiaSelected, this.vIdSelectH, this.vIdPosition);

              this.service.toastSuccess("Registrado con exito...!!", "Dia Trabajo");
            } else {
              this.service.toastError("Algo salio mal..!!", "Dia Trabajo");
            }
          });
        }

      } else {

        if (isContinue) {
          this.dataHorario[index]['dias_trabajo'].push({ id: this.dataHorario[index]['dias_trabajo'].length + 1, isNew: true, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });

          let arrDiaTrabajo = [];

          let arOf = [...this.arListTrabajador];
          this.dataHorario[index]['arListTrabajador'] = [];
          this.dataHorario.filter(async (dt2, index2) => {
            await this.dataHorario[index2]['dias_trabajo'].filter((diaTr) => {

              if (diaTr.id_dia == this.vSelectDia) {
                arrDiaTrabajo.push(diaTr);
              }

            });

            if (this.dataHorario.length - 1 == index2) {
              await arrDiaTrabajo.filter((artd) => {
                let index = arOf.findIndex((ar) => ar.nombre_completo == artd.nombre_completo);
                if (index > -1) {
                  arOf.splice(index, 1);
                }
              });

              arOf.filter((emp) => {
                this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, dl: false, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: emp.nombre_completo, numero_documento: emp.documento });
              });
            }
          });

          this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
        }

        /*
        this.dataHorario[index]['dias_trabajo'].push({ id: this.dataHorario[index]['dias_trabajo'].length + 1, isNew: true, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });
        let newArrTrabajadores = this.dataHorario[index]['arListTrabajador'].filter((dt) => dt.id != data.id);
        this.dataHorario.filter((trabajador, i) => {
            this.arListTrabajador = newArrTrabajadores;
            this.dataHorario[i]['arListTrabajador'] = this.arListTrabajador;
        });


        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
        */
      }


    }

    //this.socket.emit('actualizarHorario', this.dataHorario);
    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

  }

  onAddDLTrabajo(data, id) {
    let isContinue = true;

    let elemntButtonAdd = document.getElementsByName('addHorario-' + id);

    let elementButtonDL = document.getElementsByName('addDL-' + id);

    let classList;
    classList = elementButtonDL[0]['classList']['value'].split(' ');

    let exist = classList.indexOf('agregado');


    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    if (exist == -1) {
      this.dataHorario.filter((dth, i) => {
        let exist = this.dataHorario[i]['dias_libres'].find((dl) => dl.nombre_completo == (data || {}).nombre_completo);

        if (Object.keys(exist || {}).length && (exist || {}).id_dia == this.vSelectDia) {
          isContinue = false;
          this.service.toastError('Ya esta asignado a un dia libre...!!', "Dia Trabajo");
        }
      });

      if (isContinue) {
        elemntButtonAdd[0]['disabled'] = true
        elementButtonDL[0]['innerHTML'] = '<i class="fa fa-calendar-times-o" aria-hidden="true"></i>';
        elementButtonDL[0]['className'] = 'btn btn-danger btn-sm agregado';
        elementButtonDL[0]['attributes']['mattooltip']['value'] = 'Quitar trabajor de dia libre';
        elementButtonDL[0]['attributes']['mattooltip']['textContent'] = 'Quitar trabajor de dia libre';
        elementButtonDL[0]['attributes']['mattooltip']['nodeValue'] = 'Quitar trabajor de dia libre';

        let isRegister = this.dataHorario[index]['dias_libres'].findIndex((dtr) => dtr.id_dia == data.id_dia && dtr.nombre_completo == data.nombre_completo);

        if (isRegister != -1) {
          this.dataHorario[index]['dias_libres'] = this.dataHorario[index]['dias_libres'].filter((dt) => dt.id != data.id);

        } else {
          if (this.isSearch) {
            let parms = {
              url: '/horario/insert/diaLibre',
              body: {
                codigo_tienda: this.codeTienda,
                numero_documento: (data || {}).numero_documento,
                nombre_completo: (data || {}).nombre_completo,
                id_rango: (data || {}).rg,
                id_dia: (data || {}).id_dia,
                id_horario: this.dataHorario[index]['id']
              }
            };

            this.service.post(parms).then(async (response) => {
              if ((response || {}).success) {
                this.dataHorario[index]['dias_libres'].push({ id: (response || {}).id, dl: true, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });
                this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

                this.service.toastSuccess("Registrado con exito...!!", "Dia Libre");
              } else {
                this.service.toastError("Algo salio mal..!!", "Dia Libre");
              }
            });
          } else {
            this.dataHorario[index]['dias_libres'].push({ id: this.dataHorario[index]['dias_libres'].length + 1, isNew: true, dl: true, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });
            this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
          }
        }
      }

    } else {
      elemntButtonAdd[0]['disabled'] = false;
      elementButtonDL[0]['innerHTML'] = '<i class="fa fa-calendar-check-o" aria-hidden="true"></i>';
      elementButtonDL[0]['className'] = 'btn btn-success btn-sm';

      let dataDL = this.dataHorario[index]['dias_libres'].find((dt) => dt.id_dia == data.id_dia && dt.nombre_completo == data.nombre_completo);
      this.dataHorario[index]['dias_libres'] = this.dataHorario[index]['dias_libres'].filter((dt) => dt.id != dataDL.id);

      if (this.isSearch) {
        let parms = {
          url: '/horario/delete/diaLibre',
          body: { id: dataDL.id }
        };

        this.service.post(parms).then(async (response) => {
          if ((response || {}).success) {
            this.service.toastSuccess("Eliminado con exito...!!", "Dia Libre");
          } else {
            this.service.toastError("Algo salio mal..!!", "Dia Libre");
          }
        });
      }
    }

    //this.socket.emit('actualizarHorario', this.dataHorario);
    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

  }

  //BORRAR EMPLEADO DE DIA DE TRABAJO
  onDeleteDTrabajo(data) {

    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    let idPop = this.dataHorario[index]['arListTrabajador'][this.dataHorario[index]['arListTrabajador'].length - 1] || 0;

    this.dataHorario[index]['arListTrabajador'].push({ id: idPop.id + 1, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo, numero_documento: data.numero_documento, codigo_tienda: this.codeTienda });
    this.dataHorario[index]['dias_trabajo'] = this.dataHorario[index]['dias_trabajo'].filter((dt) => dt.id != data.id);
    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

    if (this.isSearch) {
      let parms = {
        url: '/horario/delete/diaTrabajo',
        body: { id: data.id }
      };

      this.service.post(parms).then(async (response) => {
        if ((response || {}).success) {
          this.service.toastSuccess("Eliminado con exito...!!", "Dia Trabajo");
        } else {
          this.service.toastError("Algo salio mal..!!", "Dia Trabajo");
        }
      });
    }




  }


  obtenerFechaMysql(): string {
    const ahora = new Date();

    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const dia = String(ahora.getDate()).padStart(2, '0');

    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    return `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`;
  }



  onSaveCalendario() {
    this.isSearch = true;

    let parms = {
      url: '/horario/registrar',
      body: this.dataHorario
    };

    this.service.post(parms).then(async (response) => {
      if ((response || {}).success) {
        let data = (response || {}).data || [];
        if ((data || []).length) {
          this.dataHorario = [];
          this.store.setStore("mt-isSearch", true);
          this.onListCargo = [];
          let lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros', 'Asesores part time', 'Vacaciones'];

          if (!this.isSearch && (this.profileUser || {}).mt_nivel == "RRHH" || (this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "cmoron" || (this.profileUser || {}).mt_nivel == "jcarreno" || (this.profileUser || {}).mt_nivel == "nduran" || (this.profileUser || {}).mt_nivel == "aseijo") {
            lsOrden = ["Recursos Humanos", "Contabilidad", "Sistemas", "Recepcion", "Vacaciones"];
          }

          (lsOrden || []).filter((orden, i) => {
            let indexRow = data.find((rs) => rs.cargo == orden);
            if (indexRow > -1) {
              this.dataHorario.push(data[indexRow]);
            }
          });

          let dateNow = new Date();
          let day = new Date(dateNow).toLocaleDateString().split('/');
          let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;

          await this.dataHorario.filter((dt, index) => {
            if (!this.dataHorario[index]['dias'].length) {
              this.dataHorario[index]['dias'] = this.arListDia
            }


            this.dataHorario[index]['dias'].filter((ds, i) => {
              let parseDate = ds.fecha_number.split('-');
              let fechaInicio = new Date(fechaActual);
              let fechaFin = new Date(`${parseDate[2]}-${parseDate[1]}-${parseDate[0]}`);

              if ((fechaFin.getTime() < fechaInicio.getTime()) && (this.profileUser || {}).mt_nivel != "RRHH" && (this.profileUser || {}).mt_nivel != "SISTEMAS" && (this.profileUser || {}).mt_nivel != "JOHNNY") {
                this.dataHorario[index]['dias'][i]['isExpired'] = true;
              } else {
                this.dataHorario[index]['dias'][i]['isExpired'] = false;
              }

              (this.dataViewPermiso || []).filter((tienda) => {
                //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
                if (this.codeTienda == (tienda || {}).SERIE_TIENDA && (tienda || {}).IS_FREE_HORARIO) {
                  this.dataHorario[index]['dias'][i]['isExpired'] = false;
                }
              });

              let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);

              if (obsExist != -1) {
                this.dataHorario[index]['dias'][i]['isObservation'] = true;
              }
            });

            this.idCargo = this.dataHorario[index]['id'];

            this.dataHorario[index]['dias'].filter((ds, i) => {
              let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);
              if (obsExist != -1) {
                this.dataHorario[index]['dias'][i]['isObservation'] = true;
              }
            });

            this.onListCargo.push({ key: dt.id, value: dt.cargo });
          });

          this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
        } else {
          this.dataHorario = [];
          this.service.toastError((data || {}).msj, "Horario");
        }

        this.service.toastSuccess("Registrado con exito...!!", "Horario");
      } else {
        this.isSearch = true;
        this.service.toastError("Algo salio mal..!!", "Horario");
      }
    });
  }

  async onGenerarCalendario() {
    let dateNow = new Date();
    this.isSearch = false;
    this.store.removeStore('mt-horario');
    this.store.setStore("mt-isSearch", false);
    var año = dateNow.getFullYear();
    var mes = (dateNow.getMonth() + 1);
    let dayNow = dateNow.getDay();
    let day = new Date(dateNow).toLocaleDateString().split('/');
    var diasMes = new Date(año, mes, 0).getDate();
    var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let arMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    let dias = [];


    let listCargoTienda = [
      { cargo: 'Gerentes', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Cajeros', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Asesores', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Almaceneros', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Asesores part time', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Vacaciones', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia }
    ];


    let listCargo = [
      { value: 'Gerentes' },
      { value: 'Cajeros' },
      { value: 'Asesores' },
      { value: 'Almaceneros' },
      { value: 'Asesores part time' },
      { value: 'Vacaciones' }
    ];

    if (!this.isSearch && (this.profileUser || {}).mt_nivel == "RRHH" || (this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "cmoron" || (this.profileUser || {}).mt_nivel == "jcarreno" || (this.profileUser || {}).mt_nivel == "nduran" || (this.profileUser || {}).mt_nivel == "aseijo") {
      listCargoTienda = [
        { cargo: 'Recursos Humanos', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
        { cargo: 'Contabilidad', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
        { cargo: 'Sistemas', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
        { cargo: 'Recepcion', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
        { cargo: 'Vacaciones', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      ];

      listCargo = [
        { value: 'Recursos Humanos' },
        { value: 'Contabilidad' },
        { value: 'Sistemas' },
        { value: 'Recepcion' },
        { value: 'Vacaciones' }
      ];
    }

    for (var dia = 1; dia <= diasMes; dia++) {

      var indice = new Date(año, mes - 1, dia).getDay();

      if (indice == parseInt(day[0]) && diasSemana[indice] == "Lunes") {
        dias.push({ id: dias.length + 1, dia: diasSemana[indice], fecha: `${diasSemana[indice]}-${arMes[mes]}`, fecha_calendar: '', isExpired: false });
      }

    }

    this.onListCargo = [];

    await listCargo.filter((cargo, i) => {
      this.onListCargo.push({ key: i + 1, value: cargo.value });
      this.dataHorario.push(
        {
          id: this.dataHorario.length + 1,
          cargo: cargo.value,
          fecha: `${day[0]}-${day[1]}-${day[2]}`,
          datetime: this.obtenerFechaMysql(),
          rango: this.vRangoDiasSearch,
          codigo_tienda: this.codeTienda,
          rg_hora: [],
          dias: this.arListDia,
          dias_trabajo: [],
          dias_libres: [],
          arListTrabajador: [],
          observacion: [],
          papeletas: []
        }
      );

    });

    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
  }

  onModal(value) {
    this.isOpenModal = value;
    this.isPapeleta = false;
    this.isObservacion = false;
    this.isPapeletaDay = false;
    this.onViewObservacion(false);
  }

  isObervacionView: boolean = false;

  onViewObservacion(ev) {
    this.isObervacionView = ev;
    this.isPapeletaDay = false;
  }

  onCaledarRange($event) {
    this.vRangoDiasSearch = '';
    let range = [];
    let dateList = $event.value;

    (dateList || []).filter((dt) => {
      let date = new Date(dt).toLocaleDateString().split('/');
      (range || []).push(`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`);
    });

    let fechaInicio = new Date(range[0]);
    let fechaFin = new Date(range[1]);
    let count = 0;
    this.onEvalueHorary(range[0], range[1]).then((resolve) => {
      let permisionStore = this.dataViewPermiso.find((per) => per.SERIE_TIENDA == this.codeTienda);
      //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA

      if (resolve || (permisionStore || {}).IS_FREE_HORARIO) {
        while (fechaFin.getTime() >= fechaInicio.getTime()) {

          count++;
          let index = this.arListDia.findIndex((dia) => dia.id == count);
          fechaInicio.setDate(fechaInicio.getDate() + 1);
          let date = new Date(fechaInicio).toLocaleDateString().split('/');

          this.arListDia[index]['fecha_number'] = `${date[0]}-${date[1]}-${date[2]}`;
          this.arListDia[index]['fecha'] = `${(fechaInicio.getDate().toString().length == 1) ? '0' + fechaInicio.getDate() : fechaInicio.getDate()} - ${fechaInicio.toLocaleString('default', { month: 'short' })}`;
        }

        let day1 = new Date(dateList[0]).toLocaleDateString().split('/');
        let day2 = new Date(dateList[1]).toLocaleDateString().split('/');

        this.vRangoDiasSearch = `${day1[0]}-${day1[1]}-${day1[2]} ${day2[0]}-${day2[1]}-${day2[2]}`;
      } else {
        this.service.toastError('Solo puede crear el horario de la semana siguiente.', 'Horario');
      }
    });
  }

  convertirAFormatoISO(fechaStr: string): string {
    const [dia, mes, anio] = fechaStr.split('-');
    return `${anio}-${mes}-${dia}`;
  }


  onEvalueHorary(newInitDate, newEndDate) {
    this.profileUser = this.store.getStore('mt-profile');
    this.codeTienda = this.profileUser.code.toUpperCase();

    return new Promise((resolve, reject) => {
      let parms = {
        url: '/schedule/limit/register',
        parms: [
          { key: "code", value: this.codeTienda }
        ]
      };

      this.service.get(parms).then(async (response) => {
        let currentRange = (((response || {}).data || [])[0] || {})['rangeSchedule'].split(' ');
        let isValid = this.esSiguienteSemana(this.convertirAFormatoISO(currentRange[0]), this.convertirAFormatoISO(currentRange[1]), newInitDate, newEndDate);
        console.log(this.convertirAFormatoISO(currentRange[0]), this.convertirAFormatoISO(currentRange[1]), newInitDate, newEndDate);
        resolve(isValid)
      });
    });
  }

  esSiguienteSemana(rangoActualInicio: string, rangoActualFin: string, nuevoInicio: string, nuevoFin: string): boolean {
    // Convertir a objetos Date
    const actualInicio = new Date(rangoActualInicio);
    const actualFin = new Date(rangoActualFin);
    const nuevoInicioDate = new Date(nuevoInicio);
    const nuevoFinDate = new Date(nuevoFin);

    // Calcular el día siguiente del rango actual
    const siguienteSemanaInicio = new Date(actualFin);
    siguienteSemanaInicio.setDate(siguienteSemanaInicio.getDate() + 1);

    // Calcular el fin de la nueva semana esperada (7 días después del fin actual)
    const siguienteSemanaFin = new Date(actualFin);
    siguienteSemanaFin.setDate(siguienteSemanaFin.getDate() + 7);

    // Validar que el nuevo rango coincide exactamente con esa semana siguiente

    return (
      nuevoInicioDate.getTime() <= siguienteSemanaInicio.getTime() &&
      nuevoFinDate.getTime() <= siguienteSemanaFin.getTime()
    );
  }

  onEditHorario(id) {

    this.isStartEditRg = true;
    this.selectedIdRango = id;
    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
    let horarioSelect = this.dataHorario[index]['rg_hora'].filter((rg) => rg.id == id);


  }

  onSaveRangoHorario(id) {
    let rowCargo = this.dataHorario.find((dt) => dt.id == this.cboCargo);

    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    if (index != -1) {

      let exist = this.dataHorario[index]['rg_hora'].findIndex((rgh) => rgh.rg == `${this.horaInit} a ${this.horaEnd}`);
      let indexHorario = this.dataHorario[index]['rg_hora'].findIndex((rg) => rg.id == id);

      if (exist == -1) {

        let hora = this.obtenerDiferenciaHora(this.horaInit, this.horaEnd);
        let confirmHora = (hora || "").split(":");

        if (parseInt(confirmHora[0]) <= 9) {

          this.dataHorario[index]['rg_hora'][indexHorario].rg = `${this.horaInit} a ${this.horaEnd}`;
          this.dataHorario[index]['rg_hora'][indexHorario]['isEdit'] = true;
          this.isRangoEdit = false;
          this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));


          if (this.isSearch) {
            let parms = {
              url: '/horario/update/rangoHorario',
              body: {
                id: id,
                rg: `${this.horaInit} a ${this.horaEnd}`
              }
            };

            this.service.post(parms).then(async (response) => {
              if ((response || {}).success) {
                this.service.toastSuccess('Registrado con exito..!!', 'Rango horario');
              } else {
                this.service.toastError('Algo salio mal..!!', 'Rango horario');
              }
            });
          }
        } else {
          this.service.toastError('Rango de hora debe ser menor o igual a 9 horas...!!', "Horario");
        }


      } else {

        let hora = this.obtenerDiferenciaHora(this.horaInit, this.horaEnd);
        let confirmHora = (hora || "").split(":");

        if (parseInt(confirmHora[0]) <= 9) {

          if (this.dataHorario[index]['rg_hora'][indexHorario].rg == `${this.horaInit} a ${this.horaEnd}`) {
            this.isRangoEdit = false;
            //this.dataHorario[index]['rg_hora'][indexHorario]['isEdit'] = false;
            this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
          } else {
            this.service.toastError('Rango de hora ya existe..!!', "Rango horario");
          }
        } else {
          this.service.toastError('Rango de hora debe ser menor o igual a 9 horas...!!', "Horario");

        }

        this.isStartEditRg = false;
        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

      }


      //this.socket.emit('actualizarHorario', this.dataHorario);
      //this.onSearchCalendario();
    }
  }

  onOpenObservacion(data?, diaData?) {

    let idCargo = Object.keys((data || {})).length ? (data || {}).id : this.cboCargo;
    let idDia = Object.keys((diaData || {})).length ? (diaData || {}).id : this.vSelectDia;

    let index = this.dataHorario.findIndex((dt) => dt.id == idCargo);
    if (index != -1) {
      this.dataObservation = this.dataHorario[index]['observacion'].filter((obs) => obs.id_dia == idDia);
    }

    this.isObservacion = true;
    this.isOpenModal = true;
    this.isPapeleta = false;
    this.isObervacionView = false;
  }

  onOpenPapeleta() {
    const self = this;
    self.isPapeleta = true;
    self.isPapeletaDay = false;
    self.isOpenModal = true;
    self.isObservacion = false;
    self.isObervacionView = false;
  }

  opChangeObservation(ev) {
    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
    let data = ev;
    let oldDAta = [...this.dataHorario[index]['observacion']];

    if (index != -1) {
      this.dataHorario[index]['observacion'] = [];
      this.dataHorario[index]['observacion'] = oldDAta.filter((dt) => dt.id_dia != this.vSelectDia);
      (data || []).filter((data) => {
        this.dataHorario[index]['observacion'].push(data);
      });

      this.dataHorario[index]['dias'].filter((ds, i) => {
        let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);
        if (obsExist != -1) {
          this.dataHorario[index]['dias'][i]['isObservation'] = true;
        } else {
          this.dataHorario[index]['dias'][i]['isObservation'] = false;
        }
      });


      //this.socket.emit('actualizarHorario', this.dataHorario);
      this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
    }
  }


  onUpdateRango() {

    let parms = {
      url: '/calendario/searchrHorario',
      body: [{ rango_dias: this.vRangoDiasSearch, codigo_tienda: this.codeTienda }]
    };

    this.service.post(parms).then(async (response) => {
      if ((response || []).length) {

        await response.filter((dt, index) => {
          let indexHorario = this.dataHorario.findIndex((dth) => dth.id == dt.id);
          this.dataHorario[indexHorario]['rg_hora'] = dt.rg_hora;
        });
        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
      } else {
        this.dataHorario = [];

        this.service.toastError("Algo salio mal..!!", "Rango horario");
      }

    });

  }

  onSearchCalendario(rango?, codigo?) {
    this.isLoading = true;
    let parms = {
      url: '/calendario/searchrHorario',
      body: [{ rango_dias: rango || this.vRangoDiasSearch, codigo_tienda: codigo || this.codeTienda }]
    };

    this.service.post(parms).then(async (response) => {
      if ((response || []).length) {
        this.dataHorario = [];
        this.isSearch = true;
        this.store.setStore("mt-isSearch", true);
        this.onListCargo = [];
        let isOficina = false;
        let lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros', 'Asesores part time', 'Vacaciones'];

        if ((codigo == 'OF' || (this.codeTienda == "OF" && typeof codigo == 'undefined')) && ((this.profileUser || {}).mt_nivel == "RRHH" || (this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "cmoron" || (this.profileUser || {}).mt_nivel == "jcarreno" || (this.profileUser || {}).mt_nivel == "nduran" || (this.profileUser || {}).mt_nivel == "aseijo")) {
          isOficina = true;
          lsOrden = ['Recursos Humanos', 'Contabilidad', 'Sistemas', 'Recepcion', 'Vacaciones'];
        }

        if (response.length == 4 && !isOficina) {
          lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros', 'Asesores part time', 'Vacaciones'];
        }

        (lsOrden || []).filter((orden, i) => {
          let indexRow = response.findIndex((rs) => (rs || {}).cargo == orden);
          if (indexRow > -1) {
            this.dataHorario.push(response[indexRow]);
          }
        });


        //this.dataHorario = response;
        let dateNow = new Date();
        let day = new Date(dateNow).toLocaleDateString().split('/');
        let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;

        await this.dataHorario.filter((dt, index) => {

          if (!(this.dataHorario[index]['dias'] || []).length) {
            this.dataHorario[index]['dias'] = this.arListDia || []
          }


          (this.dataHorario[index]['dias'] || []).filter((ds, i) => {
            let parseDate = ds.fecha_number.split('-');
            let fechaInicio = new Date(fechaActual);
            let fechaFin = new Date(`${parseDate[2]}-${parseDate[1]}-${parseDate[0]}`);

            if ((fechaFin.getTime() < fechaInicio.getTime()) && (this.profileUser || {}).mt_nivel != "RRHH" && (this.profileUser || {}).mt_nivel != "SISTEMAS" && (this.profileUser || {}).mt_nivel != "JOHNNY") {
              this.dataHorario[index]['dias'][i]['isExpired'] = true;
            } else {
              this.dataHorario[index]['dias'][i]['isExpired'] = false;
            }

            (this.dataViewPermiso || []).filter((tienda) => {
              //HABILITAR CAMBIOS DE CALENDARIO EN EL MISMO DIA
              if (this.codeTienda == (tienda || {}).SERIE_TIENDA && (tienda || {}).IS_FREE_HORARIO) {
                this.dataHorario[index]['dias'][i]['isExpired'] = false;
              }
            });


            let obsExist = (this.dataHorario[index]['observacion'] || []).findIndex((obs) => obs.id_dia == ds.id);
            if (obsExist != -1) {
              this.dataHorario[index]['dias'][i]['isObservation'] = true;
            }

            let objPapeleta = this.allPapeletas.filter((pap) => {
              let fPap = this.formatearFechaTexto(pap.fecha_desde);
              if (fPap == ds.fecha_number) {
                this.dataHorario[index]['papeleta'].push(pap)
                return pap;
              }
            });

            if ((objPapeleta || []).length) {
              this.dataHorario[index]['dias'][i]['isPapeleta'] = true;
            }
          });



          this.idCargo = this.dataHorario[index]['id'];

          //this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];


          this.dataHorario[index]['dias'].filter((ds, i) => {
            let obsExist = (this.dataHorario[index]['observacion'] || []).findIndex((obs) => obs.id_dia == ds.id);
            if (obsExist != -1) {
              this.dataHorario[index]['dias'][i]['isObservation'] = true;
            }
          });

          (this.onListCargo || []).push({ key: dt.id, value: dt.cargo });
        });
        this.isLoading = false;
        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
      } else {
        this.isLoading = false;
        this.dataHorario = [];
        this.service.toastError((response || {}).msj, "Horario");
      }
    });

  }

  formatearFechaTexto(fechaTexto: string): string {
    const [año, mes, dia] = fechaTexto.split('-');
    return `${parseInt(dia)}-${parseInt(mes)}-${año}`;
  }

  onViewPapeletaDia(day) {
    const self = this;
    self.isPapeletaDay = true;

    let allPApeletas = [];
    this.dataHorario[0]['papeleta'].find((pap, i) => {
      let fPap = this.formatearFechaTexto(pap.fecha_desde);
      if (fPap == day) {
        allPApeletas.push(pap)
      }
      self.isPapeleta = false;
      self.isOpenModal = true;
      self.isObservacion = false;
      self.isObervacionView = false;
      this.dataSource = new MatTableDataSource(allPApeletas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onViewPapeleta(ev) {
    this.isViewPapeleta = true;
    this.codigoPap = ev.codigo_papeleta;
  }

  onBackPap() {
    this.isViewPapeleta = false;
    this.codigoPap = "";
  }

  onObservacionSelected(ev) {
    const self = this;
    self.indexObservacion = -1;
    this.vObservacion = ev.observacion;
    this.optionDefault = ev.selected;
    self.indexObservacion = this.dataObservation.findIndex((obs) => obs.id == ev.id);
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


  async onPdf() {
    this.isLoading = true;
    var element: any;
    element = $('#content-pdf').clone();
    var opt = {
      filename: `HORARIO.pdf`,
      margin: [0.1, 0.1, 0.2, 0.1],
      image: {
        type: 'png', quality: 0.99
      },
      html2canvas: {
        dpi: 192,
        useCORS: true,
        scale: 2
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
    };

    await html2pdf().from(element[0]).set(opt).save();
    this.isLoading = false;
  }




}



export interface HorarioElement {
  id: number,
  cargo: string,
  codigo_tienda: string,
  fecha: string,
  datetime: string,
  rango: any,
  rg_hora: Array<any>,
  dias: Array<any>,
  dias_trabajo: Array<any>,
  dias_libres: Array<any>,
  arListTrabajador: Array<any>,
  observacion: Array<any>,
  papeletas: Array<any>
}