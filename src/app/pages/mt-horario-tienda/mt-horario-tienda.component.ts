import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mt-horario-tienda',
  templateUrl: './mt-horario-tienda.component.html',
  styleUrls: ['./mt-horario-tienda.component.scss'],
})
export class MtHorarioTiendaComponent implements OnInit {


  dataHorario: Array<any> = [
    {
      id: 1,
      cargo: "ASESORES",
      rg_hora: [
        { id: 1, rg: "10:00 a 07:00" },
        { id: 2, rg: "12:30 A 9:30" },
        { id: 3, rg: "01:00 A 10:00" },
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
        { id: 1, rg: 3, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 3, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 5, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
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
        { id: 3, rg: "01:00 A 10:00" },
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
        { id: 1, rg: 3, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
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
        { id: 3, rg: "01:00 A 10:00" },
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
        { id: 1, rg: 3, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
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
        { id: 3, rg: "01:00 A 10:00" },
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
        { id: 1, rg: 3, id_dia: 1, id_cargo: 1, nombre_completo: "MARISA" },
        { id: 2, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 3, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 4, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "CLAUDIA" },
        { id: 5, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 6, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
        { id: 7, rg: 3, id_dia: 3, id_cargo: 1, nombre_completo: "" },
      ],
      dias_libres: [
        { id_dia: 1, id_cargo: 1, id_empleado: 1 }
      ]
    }
  ];


  constructor() { }

  ngOnInit() {
  }

}
