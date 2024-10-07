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
  cboCargo: string = "";
  horaInit: string = "";
  horaEnd: string = "";
  arListDia: Array<any> = [];
  vSelectDia: number = 0;
  vSelectHorario: number = 0;
  onListCargo: Array<any> = [
    { key: 'asesores', value: 'Asesores' },
    { key: 'gerentes', value: 'Gerentes' },
    { key: 'cajeros', value: 'Cajeros' },
    { key: 'almaceneros', value: 'Almaceneros' }
  ];

  dataHorario: Array<HorarioElement> = [];

  arListTrabajador: Array<any> = [
    "MARISA", "CLAUDIA", "GIANELA"
  ];

  arListaDiaTrab: Array<any> = [];


  constructor(private store: StorageService) { }

  ngOnInit() {
    let dataHr = this.store.getStore("mt-horario");

    if (dataHr.length) {
      this.dataHorario = dataHr;
    }

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
    let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());

    if (index != -1) {
      this.dataHorario[index]['rg_hora'].push({ id: this.dataHorario[index]['rg_hora'].length + 1, rg: `${this.horaInit} a ${this.horaEnd}` });
      this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  onDrop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {
      //console.log(event['container']['data']);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //let data =  {id:this.dataHorario.length + 1,rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: 1, nombre_completo: event['container']['data']['nombre_completo']}
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  onSelectDataDia(id_horario?, id_dia?) {
    this.vSelectDia = id_dia;
    this.vSelectHorario = id_horario;

    if (this.vSelectDia > 0 && this.vSelectHorario > 0) {
      let index = this.dataHorario.findIndex((dt) => dt.cargo.toUpperCase() == this.cboCargo.toUpperCase());

      if (index != -1) {

        this.dataHorario[index]['arListTrabajador'] = [];
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "ANDRE" });
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "JORGE" });
        this.dataHorario[index]['arListTrabajador'].push({ id: this.dataHorario[index]['arListTrabajador'].length + 1, rg: this.vSelectHorario, id_dia: this.vSelectDia, id_cargo: this.dataHorario[index]['id'], nombre_completo: "JOSE" });

        if (this.dataHorario[index]['dias_trabajo'].length) {
          this.dataHorario[index]['dias_trabajo'].filter((dr) => {
            console.log(dr.nombre_completo);
         

          });

        }


        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
      }
    }

  }

  onGenerarCalendario() {
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
          rg_hora: [
            // this.movies
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
          ],
          dias_libres: [
            //{ id_dia: 1, id_cargo: 1, id_empleado: 1 }
          ],
          arListTrabajador: [
            /* { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "ANDRE" },
             { id: 1, rg: 1, id_dia: 1, id_cargo: 1, nombre_completo: "JORGE" },*/
          ]
        }
      );
    });

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