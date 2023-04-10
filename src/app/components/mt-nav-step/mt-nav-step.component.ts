import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-nav-step',
  templateUrl: './mt-nav-step.component.html',
  styleUrls: ['./mt-nav-step.component.scss'],
})
export class MtNavStepComponent implements OnInit {
  menuStepList: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.menuStepList = [
      {
        id: "tap0",
        step: 0,
        status: 'success',
        concept: "Datos personales",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap1",
        step: 1,
        status: 'success',
        concept: "Exp. laboral",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap2",
        step: 2,
        status: 'active',
        concept: "Form. academica",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap3",
        step: 3,
        status: 'progress',
        concept: "Derechos habientes",
        icon: "fa fa-angle-right"
      },
      {
        id: "tap4",
        step: 4,
        status: 'progress',
        concept: "Datos de salud"
      }
    ];
  }

  onSelectedStep(ev:any) {
    console.log(ev);
  }

}
