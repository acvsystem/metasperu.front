import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/utils/storage';
import { io } from "socket.io-client";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ShareService } from '../../services/shareService';
import { ToastrService } from 'ngx-toastr';
import * as html2pdf from 'html2pdf.js';
import * as $ from 'jquery';

@Component({
  selector: 'mt-horario-tienda',
  templateUrl: './mt-horario-tienda.component.html',
  styleUrls: ['./mt-horario-tienda.component.scss']
})
export class MtHorarioTiendaComponent implements OnInit {
  @Input() data: Array<any> = [];
  socket = io('http://38.187.8.22:3200', { reconnectionDelayMax: 10000, query: { code: 'app' } });
  cboCargo: number = 0;
  idCargo: number = 1;
  horaInit: string = "";
  isOpenModal: boolean = false;
  isObservacion: boolean = false;
  isPapeleta: boolean = false;
  isExpiredDay: boolean = false;
  isStartEditRg: boolean = false;
  isLoading: boolean = false;
  dataObservation: Array<any> = [];
  onListEmpleado: Array<any> = [];
  selectedIdRango: number = 0;
  indexObservacion: number = -1;
  horaEnd: string = "";
  codeTienda: string = "";
  unidServicio: string = "";
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
  screenHeight: number = 0;
  screenWith: number = 0;
  vObservacion: string = "";
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

  isRangoEdit: boolean = false;

  arListaDiaTrab: Array<any> = [];
  profileUser: any = {};
  dataViewPermiso: Array<any> = [];

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.screenHeight = window.innerHeight - 100;
    this.screenWith = window.innerWidth - 10;
  }

  constructor(private store: StorageService, private service: ShareService) { }



  async ngOnInit() {


    this.profileUser = this.store.getStore('mt-profile');

    if ((this.profileUser || {}).mt_nivel == "SISTEMAS" || (this.profileUser || {}).mt_nivel == "JOHNNY" || (this.profileUser || {}).mt_nivel == "cmoron" || (this.profileUser || {}).mt_nivel == "jcarreno" || (this.profileUser || {}).mt_nivel == "nduran" || (this.profileUser || {}).mt_nivel == "aseijo") {
      this.store.setStore('mt-profile', JSON.stringify({
        "mt_name_1": (this.profileUser || {}).mt_name_1,
        "mt_nivel": (this.profileUser || {}).mt_nivel,
        "code": ""
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

    this.onListCargo = [
      { key: 1, value: "Gerentes" },
      { key: 2, value: "Cajeros" },
      { key: 3, value: "Asesores" },
      { key: 4, value: "Almaceneros" }
    ];

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

          if (fechaFin.getTime() < fechaInicio.getTime() || fechaFin.getTime() == fechaInicio.getTime()) {
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
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);

    this.unidServicio = (unidServicio || {})['uns'];
    this.onListEmpleado = [];

    this.socket.on("connect_error", () => {
      // revert to classic upgrade
      this.socket.io.opts.transports = ["polling", "websocket"];
    });


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
          /*
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
          
                          let exist = this.arListTrabajador.findIndex((pr) => pr.documento == registro.nro_documento);
          
                          if (codigo == this.codeTienda && exist == -1) {
          
                            let arNombre = registro.nombre_completo.split(' ');
                            this.arListTrabajador.push(
                              { id: this.arListTrabajador.length + 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: arNombre[2] + ' ' + arNombre[0].substr(0, 1) + '.' + arNombre[1].substr(0, 1), documento: registro.nro_documento }
                            );
                          }
                        }
                      }
                    });*/
        }


      });

    });

    this.onPermisosTienda();
  }

  onPermisosTienda() {
    let parms = {
      url: '/security/configuracion/permisos/hp'
    };
    this.service.get(parms).then((response) => {
      this.dataViewPermiso = response || [];
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

  onAddHorario() {
    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    if (index != -1 && this.horaInit.length && this.horaEnd.length) {
      let exist = this.dataHorario[index]['rg_hora'].findIndex((rgh) => rgh.rg == `${this.horaInit} a ${this.horaEnd}`);
      if (exist == -1) {
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
    console.log(id_horario, id_dia, dataDia, idSelectH, idPosicion);
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



        if (fechaFin.getTime() < fechaInicio.getTime() || fechaFin.getTime() == fechaInicio.getTime()) {
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
                            console.log(registro);
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
    console.log(data);
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

      console.log(arDias);
      this.dataHorario.filter((dth, i) => {
        let exist = this.dataHorario[i]['dias_libres'].find((dl) => dl.nombre_completo == (data || {}).nombre_completo && dl.id_dia == (data || {}).id_dia);
        console.log(arDias, (exist || {}).id_dia, (data || {}).id_dia);

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
    console.log(data);
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
          let lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros'];

          (lsOrden || []).filter((orden, i) => {
            let row = data.find((rs) => rs.cargo == orden);
            this.dataHorario.push(row);

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

              if (fechaFin.getTime() < fechaInicio.getTime()) {
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
    let arMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let dias = [];


    let listCargoTienda = [
      { cargo: 'Gerentes', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Cajeros', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Asesores', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia },
      { cargo: 'Almaceneros', codigo_tienda: this.codeTienda, fecha: `${day[0]}-${day[1]}-${day[2]}`, rango: this.vRangoDiasSearch, dias: this.arListDia }
    ];


    let listCargo = [
      { value: 'Gerentes' },
      { value: 'Cajeros' },
      { value: 'Asesores' },
      { value: 'Almaceneros' }
    ];

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
          rango: this.vRangoDiasSearch,
          codigo_tienda: this.codeTienda,
          rg_hora: [],
          dias: this.arListDia,
          dias_trabajo: [],
          dias_libres: [],
          arListTrabajador: [],
          observacion: []
        }
      );

      //this.onSearchCalendario();
    });

    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

    let parms = {
      url: '/calendario/generar',
      body: listCargoTienda
    };
    /*
            this.service.post(parms).then(async (response) => {
                let dataRes = response;
    
                if ((dataRes || []).length) {
                    this.onListCargo = [];
    
                    this.dataHorario = [];
                    this.store.removeStore("mt-horario");
                    let listCargo = [
                        { value: 'Asesores' },
                        { value: 'Gerentes' },
                        { value: 'Cajeros' },
                        { value: 'Almaceneros' }
                    ];
    
                    for (var dia = 1; dia <= diasMes; dia++) {
    
                        var indice = new Date(año, mes - 1, dia).getDay();
    
                        if (indice == parseInt(day[0]) && diasSemana[indice] == "Lunes") {
                            dias.push({ id: dias.length + 1, dia: diasSemana[indice], fecha: `${diasSemana[indice]}-${arMes[mes]}`, fecha_calendar: '', isExpired: false });
                        }
    
                    }
    
                    await listCargo.filter((cargo) => {
    
                        this.dataHorario.push(
                            {
                                id: this.dataHorario.length + 1,
                                cargo: cargo.value,
                                codigo_tienda: this.codeTienda,
                                rg_hora: [],
                                dias: this.arListDia,
                                dias_trabajo: [],
                                dias_libres: [],
                                arListTrabajador: [],
                                observacion: []
                            }
                        );
    
                        console.log("onGenerarCalendario", this.dataHorario);
                        //this.onSearchCalendario();
                    });
    
    
    
                    dataRes.filter((rs) => {
                        let index = this.dataHorario.findIndex((dh) => dh.cargo == rs.cargo);
                        if (index != -1) {
                            this.dataHorario[index]['id'] = rs.id;
                        }
                        this.onListCargo.push({ key: rs.id, value: rs.cargo });
    
                    });
                } else {
                    this.openSnackBar((dataRes || {}).msj);
                }
    
    
    
            });
    */
  }

  onModal(value) {
    this.isOpenModal = value;
    this.isPapeleta = false;
    this.isObservacion = false;
    this.onViewObservacion(false);
  }

  isObervacionView: boolean = false;

  onViewObservacion(ev) {
    this.isObervacionView = ev;
  }

  onCaledarRange($event) {

    let range = [];
    let dateList = $event.value;

    (dateList || []).filter((dt) => {
      let date = new Date(dt).toLocaleDateString().split('/');
      (range || []).push(`${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`);
    });

    let fechaInicio = new Date(range[0]);
    let fechaFin = new Date(range[1]);
    let count = 0;

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


  }

  onEditHorario(id) {

    this.isStartEditRg = true;
    this.selectedIdRango = id;
    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
    let horarioSelect = this.dataHorario[index]['rg_hora'].filter((rg) => rg.id == id);

    //console.log(this.cboCargo, id, horarioSelect);

    /*
    if (this.vSelectHorario > 0) {
        let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);
 
        if (index != -1) {
            let horarioSelect = this.dataHorario[index]['rg_hora'].filter((rg) => rg.id == this.vSelectHorario);
            if (horarioSelect.length > 0) {
                this.isRangoEdit = true;
                this.isStartEditRg = false;
                //this.dataHorario[index]['rg_hora']['isEdit'] = true;
            }
        }
047
        // this.socket.emit('actualizarHorario', this.dataHorario);
        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
    }
        */

  }

  onSaveRangoHorario(id) {
    let rowCargo = this.dataHorario.find((dt) => dt.id == this.cboCargo);

    let index = this.dataHorario.findIndex((dt) => dt.id == this.cboCargo);

    if (index != -1) {

      let exist = this.dataHorario[index]['rg_hora'].findIndex((rgh) => rgh.rg == `${this.horaInit} a ${this.horaEnd}`);
      let indexHorario = this.dataHorario[index]['rg_hora'].findIndex((rg) => rg.id == id);

      if (exist == -1) {

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

        if (this.dataHorario[index]['rg_hora'][indexHorario].rg == `${this.horaInit} a ${this.horaEnd}`) {
          this.isRangoEdit = false;
          //this.dataHorario[index]['rg_hora'][indexHorario]['isEdit'] = false;
          this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
        } else {
          this.service.toastError('Rango de hora ya existe..!!', "Rango horario");
        }

      }

      this.isStartEditRg = false;
      this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
      //this.socket.emit('actualizarHorario', this.dataHorario);
      //this.onSearchCalendario();
    }
  }

  onOpenObservacion(data?, diaData?) {
    console.log(data, diaData);
    let idCargo = Object.keys((data || {})).length ? (data || {}).id : this.cboCargo;
    let idDia = Object.keys((diaData || {})).length ? (diaData || {}).id : this.vSelectDia;

    let index = this.dataHorario.findIndex((dt) => dt.id == idCargo);
    if (index != -1) {
      this.dataObservation = this.dataHorario[index]['observacion'].filter((obs) => obs.id_dia == idDia);
    }
    console.log(this.dataObservation);
    this.isObservacion = true;
    this.isOpenModal = true;
  }

  onOpenPapeleta() {
    this.isPapeleta = true;
    this.isOpenModal = true;
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
        let lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros'];

        (lsOrden || []).filter((orden, i) => {
          let row = response.find((rs) => rs.cargo == orden);
          this.dataHorario.push(row);

        });


        //this.dataHorario = response;
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

            if (fechaFin.getTime() < fechaInicio.getTime()) {
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

          //this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];


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
        this.service.toastError((response || {}).msj, "Horario");
      }

      if ((this.data || {}).length) {
        this.isLoading = false;
      }
    });

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
  rango: any,
  rg_hora: Array<any>,
  dias: Array<any>,
  dias_trabajo: Array<any>,
  dias_libres: Array<any>,
  arListTrabajador: Array<any>,
  observacion: Array<any>
}