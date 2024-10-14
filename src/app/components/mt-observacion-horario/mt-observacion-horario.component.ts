import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-observacion-horario',
  templateUrl: './mt-observacion-horario.component.html',
  styleUrls: ['./mt-observacion-horario.component.scss'],
})
export class MtObservacionHorarioComponent implements OnInit {
  onListEmpleado: Array<any> = [];
  vObservacion: string = "";
  constructor() { }

  ngOnInit() {
    this.onListEmpleado = [];
    this.onListEmpleado.push({ key: 1, value: "ANDRE" });
    this.onListEmpleado.push({ key: 2, value: "JORGE" });
    this.onListEmpleado.push({ key: 3, value: "JOSE" });
  }

  onAddObservacion() {

  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
    console.log(data);
  }

}
