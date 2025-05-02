import { Component, EventEmitter, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mt-table-oficina',
  templateUrl: './mt-table-oficina.component.html',
  styleUrls: ['./mt-table-oficina.component.scss'],
})
export class MtTableOficinaComponent implements OnInit {
  @Input() dataTable: Array<any> = [];
  onDataView: Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.onDataView);
  displayedColumnsOf: string[] = ['nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'rango_horario', 'isTardanza'];
  isFilterNM: boolean = false;
  isFilterTR: boolean = false;
  filterEmpleado: string = "";
  filterNombreEmpleado: string = "";
  filterTardanzaStatus: string = "";
  filteredValues: any = {
    nombre: "",
    fecha: "",
    hr_break: "",
    hr_in_break: "",
    hr_ingreso: "",
    hr_out_break: "",
    hr_salida: "",
    hr_trabajadas: "",
    rango_horario: "",
    isTardanza: "",
    statusTardanza: ""
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterNombre') searchNombreEmpleado!: MatMenu;
  @ViewChild('filterTardanza') searchTardanza!: MatMenu;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.dataTable);
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    // Inject our custom logic of menu close
    (this.searchNombreEmpleado as any).closed = this.configureMenuClose(this.searchNombreEmpleado.close);
    (this.searchTardanza as any).closed = this.configureMenuClose(this.searchTardanza.close);
  }

  private configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    this.feed(upd.pipe(
      filter(event => {
        console.log(`menu.close(${JSON.stringify(event)})`);
        if (event === 'click') {
          // Ignore clicks inside the menu 
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }

  feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
    return from.subscribe(
      data => to.next(data),
      err => to.error(err),
      () => to.complete(),
    );
  }

  applyFilterNombreEmpleado(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterNM = true;
    } else {
      this.isFilterNM = false;
    }

    this.filteredValues['nombre'] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filteredValues);

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  applyFilterTardanza(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterTR = true;
    } else {
      this.isFilterTR = false;
    }

    this.filteredValues['statusTardanza'] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filteredValues);
    this.dataSource.filterPredicate = this.customFilterPredicate();

  }

  customFilterPredicate() {
    const myFilterPredicate = (
      data: PeriodicElement,
      filter: string
    ): boolean => {
      var globalMatch = !this.filterEmpleado;
      if (this.filterEmpleado) {
        // search all text fields
        globalMatch =
          data.nombre
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.filterEmpleado.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return false;
      }

      let searchString = JSON.parse(filter);

      return (
        data.nombre.toLowerCase().includes(searchString.nombre) &&
        data.statusTardanza.toLowerCase().includes(searchString.statusTardanza)
      );

    };
    return myFilterPredicate;
  }

}

export interface PeriodicElement {
  nombre: string,
  fecha: string,
  hr_break: string,
  hr_in_break: string,
  hr_ingreso: string,
  hr_out_break: string,
  hr_salida: string,
  hr_trabajadas: string,
  rango_horario: string
  isTardanza: string,
  statusTardanza: string
}
