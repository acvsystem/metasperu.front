import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { io } from "socket.io-client";
import { StorageService } from 'src/app/utils/storage';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ShareService } from 'src/app/services/shareService';
import { GlobalConstants } from '../../const/globalConstants';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'mt-observacion-horario',
  templateUrl: './mt-observacion-horario.component.html',
  styleUrls: ['./mt-observacion-horario.component.scss'],
})
export class MtObservacionHorarioComponent implements OnInit {
  //socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  @Input() vIdDia: number = 0;
  @Output() changeObservation: EventEmitter<any> = new EventEmitter();
  @Input() dataObservation: Array<any> = [];
  @Input() dataTrabajadores: Array<any> = [];
  @Input() isSearch: boolean = false;
  @Input() idHorario: number = 0;
  @Input() isViewObservacion: boolean = false;

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
  onListTiendas: Array<any> = [];

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private store: StorageService, private service: ShareService, private socket: SocketService) {
    this.onAllStore();
  }

  ngOnInit() {
    let profileUser = this.store.getStore('mt-profile');
    this.nameTienda = profileUser.mt_name_1.toUpperCase();
    this.codeTienda = profileUser.code.toUpperCase();
    let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
    this.unidServicio = (unidServicio || {})['uns'];
    this.vObservacion = "";
    console.log(this.dataTrabajadores);
    this.dataTrabajadores.filter((trb) => {
      this.onListEmpleado.push({ key: trb.nombre_completo, value: trb.nombre_completo },);
    });
    this.socket.emit('consultaListaEmpleado', this.unidServicio);

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('dataObservation')) {
      this.arObservacion = this.dataObservation;
      this.vObservacion = "";

    }

    if (changes && changes.hasOwnProperty('vIdDia')) {
      this.idDia = this.vIdDia;
      this.vObservacion = "";
    }

  }

  onAllStore() {
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
    });
  }

  onAddObservacion() {
    const self = this;
    if (self.indexObservacion > -1) {
      this.arObservacion[self.indexObservacion]['observacion'] = this.vObservacion;
      if (this.isSearch) {
        let parms = {
          url: '/horario/update/observacion',
          body: {
            id: this.arObservacion[self.indexObservacion]['id'],
            observacion: this.vObservacion
          }
        };

        this.service.post(parms).then(async (response) => {

        });
      }
      this.changeObservation.emit(this.arObservacion);
    } else {
      if (this.vObservacion.length && this.cboEmpleado.length) {
        let index = this.arObservacion.findIndex((obs) => obs.nombre_completo == this.cboEmpleado);

        if (index == -1) {
          if (this.isSearch) {
            let parms = {
              url: '/horario/insert/observacion',
              body: {
                id_dia: this.idDia,
                id_horario: this.idHorario,
                codigo_tienda: this.codeTienda,
                nombre_completo: this.cboEmpleado,
                observacion: this.vObservacion
              }
            };

            this.service.post(parms).then(async (response) => {
              if ((response || {}).success) {
                this.arObservacion.push({ id: (response || {}).id, id_dia: this.idDia, nombre_completo: this.cboEmpleado, codigo_tienda: this.codeTienda, observacion: this.vObservacion, selected: this.dataOptionSelected });
                this.changeObservation.emit(this.arObservacion);
                self.indexObservacion = -1;
                this.vObservacion = "";
                this.optionDefault = [];

                this.service.toastSuccess('Registrado con exito..!!', 'Observacion');
              } else {
                this.service.toastError('Algo salio mal..!!', 'Observacion');
              }

            });
          } else {
            this.arObservacion.push({ id: this.arObservacion.length + 1, id_dia: this.idDia, nombre_completo: this.cboEmpleado, codigo_tienda: this.codeTienda, observacion: this.vObservacion, selected: this.dataOptionSelected });
            this.changeObservation.emit(this.arObservacion);
            self.indexObservacion = -1;
            this.vObservacion = "";
            this.optionDefault = [];
          }
        } else {
          this.arObservacion[index]['observacion'] = this.vObservacion;
          this.arObservacion[index]['isEdit'] = true;
          this.changeObservation.emit(this.arObservacion);
          self.indexObservacion = -1;
          this.vObservacion = "";
          this.optionDefault = [];
        }

      } else {
        this.openSnackBar('Llene todos los campos..!!');
      }
    }
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
    if (this.isSearch) {
      let objObservacion = this.arObservacion[this.indexObservacion];

      let parms = {
        url: '/horario/delete/observacion',
        body: {
          id: (objObservacion || {}).id
        }
      }

      this.service.post(parms).then(async (response) => {
        if ((response || {}).success) {
          let objObservacion = this.arObservacion[this.indexObservacion];
          this.arObservacion = (this.arObservacion || []).filter((obs) => obs.id != (objObservacion || {}).id);
          this.indexObservacion = -1;
          this.vObservacion = "";
          this.optionDefault = [];
          this.changeObservation.emit(this.arObservacion);
          this.service.toastSuccess('Observacion elimanda con exito..!!', 'Observacion');
        } else {
          this.service.toastError('Algo salio mal..!!', 'Observacion');
        }
      });
    } else {
      let objObservacion = this.arObservacion[this.indexObservacion];
      this.arObservacion = this.arObservacion.filter((obs) => obs.id != objObservacion.id);
      this.indexObservacion = -1;
      this.vObservacion = "";
      this.optionDefault = [];
      this.openSnackBar('Observacion eliminada..!!');
      this.changeObservation.emit(this.arObservacion);
    }


  }

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }

}
