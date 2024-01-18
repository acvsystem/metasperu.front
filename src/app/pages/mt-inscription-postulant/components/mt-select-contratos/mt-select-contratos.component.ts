import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mt-select-contratos',
  templateUrl: './mt-select-contratos.component.html',
  styleUrls: ['./mt-select-contratos.component.scss'],
})
export class MtSelectContratosComponent implements OnInit {
  @Output() outputData = new EventEmitter<any>();
  listTipoContrato: string = "";
  optionListTipoContrato: Array<any> = [
    {
      "key": "pagePDF_1",
      "value": "CONTRATO PART TIME"
    },
    {
      "key": "pagePDF_2",
      "value": "CONTRATO POR TEMPORADA"
    },
    {
      "key": "pagePDF_3",
      "value": "CONTRATO POR NECESIDAD DE MERCADO"
    },
    {
      "key": "pagePDF_4",
      "value": "CONTRATO POR INICIO O INCREMENTO DE ACTIVIDAD"
    },
    {
      "key": "pagePDF_FC",
      "value": "FICHA DE DATOS"
    }
  ];

  optionSalario:Array<any> = [
    {
      "key": "pagePDF_1",
      "value": "S/ 1500 (UN MIL QUINIENTOS CON 00/100)"
    },
    {
      "key": "pagePDF_2",
      "value": "S/ 1500 (UN MIL QUINIENTOS CON 00/100)"
    },
    {
      "key": "pagePDF_3",
      "value": "S/ 1500 (UN MIL QUINIENTOS CON 00/100)"
    },
    {
      "key": "pagePDF_4",
      "value": "S/ 1500 (UN MIL QUINIENTOS CON 00/100)"
    }
  ];

  searchFecInicio: string = "";
  searchFecFin: string = "";
  opSueldo:any = {};
  txtSueldo:string = "";

  constructor() { }

  ngOnInit() { }

  onChangeSelect(selectData) {
    const self = this;
    self.listTipoContrato = (selectData || {}).key || "";
    this.opSueldo = this.optionSalario.find((pdf) => (pdf || {}).key == self.listTipoContrato);
    this.txtSueldo = (this.opSueldo || {}).value || "";
  }


  onSelected() {
    const self = this;

    if (self.listTipoContrato.length) {
      this.outputData.emit({
        opContrato: self.listTipoContrato,
        fechaInContrato: this.searchFecInicio,
        fechaOutContrato: this.searchFecFin,
        salario: this.txtSueldo
      });
    }
  }

  onDateCalendar(ev) {

    this.searchFecInicio = (ev.value != this.searchFecInicio && ev.id == "mt-input-init") ? ev.value : this.searchFecInicio;
    this.searchFecFin = (ev.value != this.searchFecFin && ev.id == "mt-input-end") ? ev.value : this.searchFecFin;

  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }



}
