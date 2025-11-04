import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ShareService } from '@metasperu/services/shareService';
import { StorageService } from '@metasperu/utils/storage';

@Component({
  selector: 'mt-search-obervacion',
  templateUrl: './mt-search-obervacion.component.html',
  styleUrls: ['./mt-search-obervacion.component.scss'],
})
export class MtSearchObervacionComponent implements OnInit {
  @Input() data: Array<any> = [];
  dataHorario: Array<any> = [];
  onListCargo: Array<any> = [];
  onListView: Array<any> = [];
  filterEmpleado: string = "";
  displayedColumns: Array<any> = ["Dia", "Nombre_Completo", "Observacion"];
  dataSource = new MatTableDataSource<any>(this.onListView);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  arListDia: Array<any> = [
    { id: 1, dia: "Lunes", fecha: "16-sep", isObservacion: false, isExpired: false },
    { id: 2, dia: "Martes", fecha: "17-sep", isObservacion: false, isExpired: false },
    { id: 3, dia: "Miercoles", fecha: "18-sep", isObservacion: false, isExpired: false },
    { id: 4, dia: "Jueves", fecha: "19-sep", isObservacion: false, isExpired: false },
    { id: 5, dia: "Viernes", fecha: "20-sep", isObservacion: false, isExpired: false },
    { id: 6, dia: "Sabado", fecha: "21-sep", isObservacion: false, isExpired: false },
    { id: 7, dia: "Domingo", fecha: "22-sep", isObservacion: false, isExpired: false }
  ];
  arListDiaOrg: Array<any> = [
    { id: 1, dia: "Lunes", fecha: "16-sep", isObservacion: false, isExpired: false },
    { id: 2, dia: "Martes", fecha: "17-sep", isObservacion: false, isExpired: false },
    { id: 3, dia: "Miercoles", fecha: "18-sep", isObservacion: false, isExpired: false },
    { id: 4, dia: "Jueves", fecha: "19-sep", isObservacion: false, isExpired: false },
    { id: 5, dia: "Viernes", fecha: "20-sep", isObservacion: false, isExpired: false },
    { id: 6, dia: "Sabado", fecha: "21-sep", isObservacion: false, isExpired: false },
    { id: 7, dia: "Domingo", fecha: "22-sep", isObservacion: false, isExpired: false }
  ];
  isSearch: boolean = false;
  isLoading: boolean = false;
  idCargo: number = 1;

  constructor(private service: ShareService, private store: StorageService) { }

  ngOnInit() {

    if ((this.data || []).length) {
      this.isLoading = true;
      this.onSearchCalendario(`${(this.data || [])[0]['rango_1']} ${(this.data || [])[0]['rango_2']}`, (this.data || [])[0]['code']);
    }
  }

  onSearchCalendario(rango?, codigo?) {

    let parms = {
      url: '/calendario/searchrHorario',
      body: [{ rango_dias: rango, codigo_tienda: codigo }]
    };

    this.service.post(parms).then(async (response) => {
      if ((response || []).length) {
        this.dataHorario = [];
        // this.isSearch = true;
        //this.store.setStore("mt-isSearch", true);
        this.onListCargo = [];
        let lsOrden = ['Gerentes', 'Cajeros', 'Asesores', 'Almaceneros'];

        (lsOrden || []).filter((orden, i) => {
          let row = response.find((rs) => rs.cargo == orden);
          this.dataHorario.push(row);

        });


        //this.dataHorario = response;
        let dateNow = new Date();
        let day = new Date(dateNow).toLocaleDateString().split('/');
        let fechaActual = `${day[2]}-${day[1]}-${day[0]}`;

        await this.dataHorario.filter((dt, index) => {

          if (!this.dataHorario[index]['dias'].length) {
            this.dataHorario[index]['dias'] = this.arListDia
          }


          this.dataHorario[index]['dias'].filter((ds, i) => {
            let parseDate = ds.fecha_number.split('-');
            let fechaInicio = new Date(fechaActual);
            let fechaFin = new Date(`${parseDate[2]}-${parseDate[1]}-${parseDate[0]}`);

            if (fechaFin.getTime() < fechaInicio.getTime()) {
              this.dataHorario[index]['dias'][i]['isExpired'] = true;
            } else {
              this.dataHorario[index]['dias'][i]['isExpired'] = false;
            }

            let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);

            if (obsExist != -1) {
              this.dataHorario[index]['dias'][i]['isObservation'] = true;
            }
          });



          this.idCargo = this.dataHorario[index]['id'];

          //this.dataHorario[index]['rg_hora'] = this.dataHorario[0]['rg_hora'];


          this.dataHorario[index]['dias'].filter((ds, i) => {
            let obsExist = this.dataHorario[index]['observacion'].findIndex((obs) => obs.id_dia == ds.id);
            if (obsExist != -1) {
              this.dataHorario[index]['dias'][i]['isObservation'] = true;
            }
          });

          this.onListCargo.push({ key: dt.id, value: dt.cargo });
        });

        this.store.setStore("mt-horario", JSON.stringify(this.dataHorario));
      } else {
        this.dataHorario = [];
        this.service.toastError((response || {}).msj, "Horario");
      }

      if ((this.data || {}).length) {

        this.dataHorario.filter((d, i) => {

          this.dataHorario[i]['dias'].filter((rdia) => {

            let registro = this.dataHorario[i]['observacion'].filter((obs) => (obs || {}).id_dia == (rdia || {}).id);

            if ((registro || []).length) {
              (registro || []).filter((rg) => {
                this.onListView.push({ dia: (rdia || {}).dia, nombre_completo: rg['nombre_completo'], observacion: rg['observacion'] });
              });

            }
          });

          if (this.dataHorario.length - 1 == i) {
            this.dataSource = new MatTableDataSource(this.onListView);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });


        this.isLoading = false;
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
