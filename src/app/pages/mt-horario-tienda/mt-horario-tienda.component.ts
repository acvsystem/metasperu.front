import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'app-mt-horario-tienda',
  templateUrl: './mt-horario-tienda.component.html',
  styleUrls: ['./mt-horario-tienda.component.scss']
})
export class MtHorarioTiendaComponent implements OnInit {

  horaInit: string = "";
  horaEnd: string = "";
  arListDia: Array<any> = [];
  onListCargo: Array<any> = [
    { key: 'asesores', value: 'Asesores' },
    { key: 'gerentes', value: 'Gerentes' },
    { key: 'cajeros', value: 'Cajeros' },
    { key: 'almaceneros', value: 'Almaceneros' }
  ];

  dataHorario: Array<any> = [
    {
      id: 1,
      cargo: "ASESORES",
      rg_hora: [
        { id: 1, rg: "10:00 a 07:00" },
        { id: 2, rg: "11:00 a 12:00" },
        { id: 3, rg: "DIAS LIBRE" },
      ],
      dias: [
        { id: 1, dia: "Lunes", fecha: "16-sep" },
        { id: 2, dia: "Martes", fecha: "17-sep" },
        { id: 3, dia: "Miercoles", fecha: "18-sep" },
        { id: 4, dia: "Jueves", fecha: "19-sep" },
        { id: 5, dia: "Viernes", fecha: "20-sep" },
        { id: 6, dia: "Sabado", fecha: "21-sep" },
        { id: 7, dia: "Domingo", fecha: "22-sep" }
      ],
      dias_trabajo: [
        { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 3, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 5, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
      ],
      dias_libres: [
        { id_dia: 1, id_cargo: 1, id_empleado: 1 }
      ]
    },
    {
      id: 2,
      cargo: "SUB GERENTE/JUNIOR",
      rg_hora: [
        { id: 1, rg: "10:00 a 07:00" },
        { id: 4, rg: "DIAS LIBRE" },
      ],
      dias: [
        { id: 1, dia: "Lunes", fecha: "16-sep" },
        { id: 2, dia: "Martes", fecha: "17-sep" },
        { id: 3, dia: "Miercoles", fecha: "18-sep" },
        { id: 4, dia: "Jueves", fecha: "19-sep" },
        { id: 5, dia: "Viernes", fecha: "20-sep" },
        { id: 6, dia: "Sabado", fecha: "21-sep" },
        { id: 7, dia: "Domingo", fecha: "22-sep" }
      ],
      dias_trabajo: [
        { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
      ],
      dias_libres: [
        { id_dia: 1, id_cargo: 1, id_empleado: 1 }
      ]
    },
    {
      id: 3,
      cargo: "CAJEROS",
      rg_hora: [
        { id: 1, rg: "10:00 a 07:00" },
        { id: 4, rg: "DIAS LIBRE" },
      ],
      dias: [
        { id: 1, dia: "Lunes", fecha: "16-sep" },
        { id: 2, dia: "Martes", fecha: "17-sep" },
        { id: 3, dia: "Miercoles", fecha: "18-sep" },
        { id: 4, dia: "Jueves", fecha: "19-sep" },
        { id: 5, dia: "Viernes", fecha: "20-sep" },
        { id: 6, dia: "Sabado", fecha: "21-sep" },
        { id: 7, dia: "Domingo", fecha: "22-sep" }
      ],
      dias_trabajo: [
        { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
      ],
      dias_libres: [
        { id_dia: 1, id_cargo: 1, id_empleado: 1 }
      ]
    },
    {
      id: 4,
      cargo: "ALMACENERO",
      rg_hora: [
        { id: 1, rg: "10:00 a 07:00" },
        { id: 4, rg: "DIAS LIBRE" },
      ],
      dias: [
        { id: 1, dia: "Lunes", fecha: "16-sep" },
        { id: 2, dia: "Martes", fecha: "17-sep" },
        { id: 3, dia: "Miercoles", fecha: "18-sep" },
        { id: 4, dia: "Jueves", fecha: "19-sep" },
        { id: 5, dia: "Viernes", fecha: "20-sep" },
        { id: 6, dia: "Sabado", fecha: "21-sep" },
        { id: 7, dia: "Domingo", fecha: "22-sep" }
      ],
      dias_trabajo: [
        { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 1, id_dia: 3, id_cargo: 1, nombre_completo: "" },
      ],
      dias_libres: [
        { id_dia: 1, id_cargo: 1, id_empleado: 1 }
      ]
    }
  ];

  arListTrabajador: Array<any> = [
    "MARISA", "CLAUDIA", "GIANELA"
  ];

  arListaDiaTrab: Array<any> = [];


  constructor(private store: StorageService) { }

  ngOnInit() {
    this.movies = this.store.getStore("mt-horario");
    this.arListDia = [
      { id: 1, dia: "Lunes", fecha: "16-sep" },
      { id: 2, dia: "Martes", fecha: "17-sep" },
      { id: 3, dia: "Miercoles", fecha: "18-sep" },
      { id: 4, dia: "Jueves", fecha: "19-sep" },
      { id: 5, dia: "Viernes", fecha: "20-sep" },
      { id: 6, dia: "Sabado", fecha: "21-sep" },
      { id: 7, dia: "Domingo", fecha: "22-sep" }
    ]
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
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

  movies = [];

  onAddHorario() {
    this.movies.push(`${this.horaInit} a ${this.horaEnd}`);
    this.store.setStore("mt-horario", JSON.stringify(this.movies));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  onListDia() {

  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
