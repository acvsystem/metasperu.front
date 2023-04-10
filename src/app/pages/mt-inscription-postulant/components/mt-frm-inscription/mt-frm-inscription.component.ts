import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-frm-inscription',
  templateUrl: './mt-frm-inscription.component.html',
  styleUrls: ['./mt-frm-inscription.component.scss'],
})
export class MtFrmInscriptionComponent implements OnInit {
  menuStepList: Array<any> = [];
  optionListPais: Array<any> = [
    { key: 'peru', value: 'Peru' }
  ];

  stepSelected: number = 2;
  expLaboralList: Array<any> = [];
  exlabEmpresa: string = "";
  exlabPuesto: string = "";
  exlabFecInicio: string = "";
  exlabCulmino: string = "";
  exlabMotivo: string = "";

  constructor() { }

  ngOnInit() {
    this.menuStepList = [
      {
        id: "return",
        step: 0,
        addClass: "active",
        concept: "Datos personales",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap0",
        step: 1,
        concept: "Exp. laboral",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap1",
        step: 2,
        concept: "Form. academica",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap2",
        step: 3,
        concept: "Derechos habientes",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap2",
        step: 4,
        concept: "Datos de salud"
      }
    ];
  }

  onNextStep() {

  }

  onAddExpLab() {
    this.expLaboralList.push(
      {
        empresa: this.exlabEmpresa,
        puesto: this.exlabPuesto,
        desde: this.exlabFecInicio,
        culmino: this.exlabCulmino,
        motivo: this.exlabMotivo
      }
    );
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

}
