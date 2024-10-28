import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Notifications, setOptions } from '@mobiscroll/angular';
import { io } from "socket.io-client";
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-observacion-horario',
  templateUrl: './mt-observacion-horario.component.html',
  styleUrls: ['./mt-observacion-horario.component.scss'],
})
export class MtObservacionHorarioComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  @Input() vIdDia: number = 0;
  @Output() changeObservation: EventEmitter<any> = new EventEmitter();
  @Input() dataObservation: Array<any> = [];
  onListEmpleado: Array<any> = [];
  vObservacion: string = "";
  arObservacion: Array<any> = [];
  cboEmpleado: string = "";
  optionDefault: Array<any> = [];
  dataOptionSelected: Array<any> = [];
  indexObservacion: number = -1;
  idDia: number = 0;
  unidServicio: string = "";
  nameTienda: string = "";
  codeTienda: string = "";
  isDataEJB: boolean = false;
  isDataServer: boolean = false;
  isEJB: boolean = false;
  isServer: boolean = false;
  arDataEJB: Array<any> = [];
  arDataServer: Array<any> = [];
  parseEJB: Array<any> = [];
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

  constructor(public notify: Notifications, private store: StorageService) { }

  ngOnInit() {
    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
    this.unidServicio = unidServicio['uns'];

    this.socket.emit('consultaListaEmpleado', this.unidServicio);

    this.socket.on('reporteEmpleadoTienda', async (response) => {


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
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('dataObservation')) {
      this.arObservacion = this.dataObservation;
    }

    if (changes && changes.hasOwnProperty('vIdDia')) {
      this.idDia = this.vIdDia;
    }

  }

  onAddObservacion() {
    const self = this;
    if (self.indexObservacion > -1) {
      this.arObservacion[self.indexObservacion]['observacion'] = this.vObservacion;
      this.changeObservation.emit(this.arObservacion);
    } else {
      if (this.vObservacion.length && this.cboEmpleado.length) {
        let index = this.arObservacion.findIndex((obs) => obs.nombre_completo == this.cboEmpleado);
        if (index == -1) {
          this.arObservacion.push({ id: this.arObservacion.length + 1, id_dia: this.idDia, nombre_completo: this.cboEmpleado, codigo_tienda: this.codeTienda, observacion: this.vObservacion, selected: this.dataOptionSelected });
        } else {
          this.arObservacion[index]['observacion'] = this.vObservacion;
        }
        this.changeObservation.emit(this.arObservacion);
      } else {
        this.notify.snackbar({
          message: 'Llene todos los campos..!!',
          display: 'top',
          color: 'danger'
        });
      }
    }

    self.indexObservacion = -1;
    this.vObservacion = "";
    this.optionDefault = [];
  }


  async onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
    this.dataOptionSelected = data;
    this.optionDefault = [];
  }

  onObservacionSelected(ev) {
    const self = this;
    self.indexObservacion = -1;
    this.vObservacion = ev.observacion;
    this.optionDefault = ev.selected;
    self.indexObservacion = this.arObservacion.findIndex((obs) => obs.id == ev.id);
  }

  onChange(ev: any) {
    const self = this;
    let value = ev.target.value;
    this.vObservacion = value;
  }

  onDeleteObservacion() {
    let objObservacion = this.arObservacion[this.indexObservacion];
    this.arObservacion = this.arObservacion.filter((obs) => obs.id != objObservacion.id);
    this.indexObservacion = -1;
    this.vObservacion = "";
    this.optionDefault = [];
  }

}
