import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Notifications, setOptions } from '@mobiscroll/angular';

@Component({
  selector: 'mt-observacion-horario',
  templateUrl: './mt-observacion-horario.component.html',
  styleUrls: ['./mt-observacion-horario.component.scss'],
})
export class MtObservacionHorarioComponent implements OnInit {
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
  constructor(public notify: Notifications) { }

  ngOnInit() {
    this.onListEmpleado = [];
    this.onListEmpleado.push({ key: "ANDRE", value: "ANDRE" });
    this.onListEmpleado.push({ key: "JORGE", value: "JORGE" });
    this.onListEmpleado.push({ key: "JOSE", value: "JOSE" });
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
          this.arObservacion.push({ id: this.arObservacion.length + 1, id_dia: this.idDia, nombre_completo: this.cboEmpleado, observacion: this.vObservacion, selected: this.dataOptionSelected });
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
    this[index] = (selectData || {}).key || "";
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
