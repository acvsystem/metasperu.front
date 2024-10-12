import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/utils/storage';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-horario-tienda',
  templateUrl: './mt-horario-tienda.component.html',
  styleUrls: ['./mt-horario-tienda.component.scss']
})
export class MtHorarioTiendaComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  cboCargo: string = "";
  idCargo: number = 1;
  horaInit: string = "";
  isOpenModal: boolean = false;
  horaEnd: string = "";
  arListDia: Array<any> = [
    { id: 1, dia: "Lunes", fecha: "16-sep" },
    { id: 2, dia: "Martes", fecha: "17-sep" },
    { id: 3, dia: "Miercoles", fecha: "18-sep" },
    { id: 4, dia: "Jueves", fecha: "19-sep" },
    { id: 5, dia: "Viernes", fecha: "20-sep" },
    { id: 6, dia: "Sabado", fecha: "21-sep" },
    { id: 7, dia: "Domingo", fecha: "22-sep" }
  ];;
  arRangeFecha: Array<any> = [];
  vSelectDia: number = 0;
  vSelectHorario: number = 0;
  onListCargo: Array<any> = [
    { key: 'Asesores', value: 'Asesores' },
    { key: 'Gerentes', value: 'Gerentes' },
    { key: 'Cajeros', value: 'Cajeros' },
    { key: 'Almaceneros', value: 'Almaceneros' }
  ];

  dataHorario: Array<HorarioElement> = [];

  arListTrabajador: Array<any> = [
    { id: 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: 1, nombre_completo: "ANDRE" },
    { id: 2, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: 1, nombre_completo: "JORGE" },
    { id: 3, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: 1, nombre_completo: "JOSE" }
  ];

  arListaDiaTrab: Array<any> = [];

  constructor(private store: StorageService) { }

  ngOnInit() {
    let dataHr = this.store.getStore("mt-horario") || [];

    if ((dataHr || []).length) {
      this.dataHorario = dataHr || [];
      /* this.dataHorario[0]['arListTrabajador'] = [];
        this.dataHorario[0]['dias_trabajo'] = [];
        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));*/
    }

  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (this.cboCargo.length) {
      let index = this.dataHorario.findIndex((cr) => cr.cargo == this.cboCargo);
      this.idCargo = this.dataHorario[index]['id'];
      this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];
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
    let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());

    if (index != -1) {
      this.dataHorario[index]['rg_hora'].pop();
      this.dataHorario[index]['rg_hora'].push({ id: this.dataHorario[index]['rg_hora'].length + 1, rg: `${this.horaInit} a ${this.horaEnd}` });
      this.dataHorario[index]['rg_hora'].push({ id: this.dataHorario[index]['rg_hora'].length + 1, rg: `DIAS LIBRES` });
      this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
    }

  }


  onSelectDataDia(id_horario?, id_dia?) {
    this.vSelectDia = id_dia;
    this.vSelectHorario = id_horario;

    if (this.vSelectDia > 0 && this.vSelectHorario > 0) {
      let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());
      let dataTrabajadores = [];
      let dataDTrabajo = [];

      if (index != -1) {

        this.dataHorario[index]['arListTrabajador'] = [];
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "ANDRE" });
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "JORGE" });
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "JOSE" });
        dataTrabajadores = [...this.dataHorario[index]['arListTrabajador']];
        this.dataHorario[index]['arListTrabajador'] = [];

        dataTrabajadores.filter((tr) => {
          let isExist = this.dataHorario[index]['dias_trabajo'].findIndex((dt) => dt.nombre_completo == tr.nombre_completo && dt.id_dia == tr.id_dia && dt.rg == tr.rg && dt.id_cargo == tr.id_cargo);
          if (isExist != -1) {
          } else {
            this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: tr.nombre_completo });
          }
        });

        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));

      }

    }
  }

  onAddDTrabajo(data) {
    let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());
    this.dataHorario[index]['dias_trabajo'].push({ id: this.dataHorario[index]['dias_trabajo'].length + 1, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo });
    this.dataHorario[index]['arListTrabajador'] = this.dataHorario[index]['arListTrabajador'].filter((dt) => dt.id != data.id);
    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
  }

  onDeleteDTrabajo(data) {
    let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());
    this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: data.rg, id_dia: data.id_dia, id_cargo: data.id_cargo, nombre_completo: data.nombre_completo });
    this.dataHorario[index]['dias_trabajo'] = this.dataHorario[index]['dias_trabajo'].filter((dt) => dt.id != data.id);
    this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
  }

  onGenerarCalendario() {

    //this.socket.emit('consultaEmpleado', '7A');

    this.dataHorario = [];
    this.store.removeStore("mt-horario");
    let listCargo = [
      { value: 'Asesores' },
      { value: 'Gerentes' },
      { value: 'Cajeros' },
      { value: 'Almaceneros' }
    ];

    let dateNow = new Date();

    var año = dateNow.getFullYear();
    var mes = (dateNow.getMonth() + 1);
    let dayNow = dateNow.getDay();
    let day = new Date(dateNow).toLocaleDateString().split('/');
    var diasMes = new Date(año, mes, 0).getDate();
    var diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let arMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    let dias = [];

    for (var dia = 1; dia <= diasMes; dia++) {

      var indice = new Date(año, mes - 1, dia).getDay();

      if (indice == parseInt(day[0]) && diasSemana[indice] == "Lunes") {
        dias.push({ id: dias.length + 1, dia: diasSemana[indice], fecha: `${diasSemana[indice]}-${arMes[mes]}` });

      }

    }

    listCargo.filter((cargo) => {
      this.dataHorario.push(
        {
          id: this.dataHorario.length + 1,
          cargo: cargo.value,
          rg_hora: [],
          dias: this.arListDia,
          dias_trabajo: [],
          dias_libres: [],
          arListTrabajador: []
        }
      );
    });

  }

  onModal(value) {
    this.isOpenModal = value;
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
      this.arListDia[index]['fecha'] = `${(fechaInicio.getDate().toString().length == 1) ? '0' + fechaInicio.getDate() : fechaInicio.getDate()} - ${fechaInicio.toLocaleString('default', { month: 'short' })}`;

    }

  }

}

export interface HorarioElement {
  id: number,
  cargo: string,
  rg_hora: Array<any>,
  dias: Array<any>,
  dias_trabajo: Array<any>,
  dias_libres: Array<any>,
  arListTrabajador: Array<any>
}