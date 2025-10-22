import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mt-table-filter-papeletas-creadas',
  templateUrl: './mt-table-filter-papeletas-creadas.component.html',
  styleUrls: ['./mt-table-filter-papeletas-creadas.component.scss'],
})
export class MtTableFilterPapeletasCreadasComponent implements OnInit {
  @Input() dataTable: Array<any> = [];

  displayedColumnsPap: string[] = ['Codigo_Papeleta', 'Tienda', 'Fecha', 'Fecha_comp','Hr_solicitada', 'Tipo_papeleta', 'Nombre_Completo', 'Accion'];
  listaPapeletas: Array<any> = [];
  dataSourcePap = new MatTableDataSource<any>(this.listaPapeletas);
  filterCodigov: string = "";
  filterTiendaUnid: string = "";
  filterTipoPapv: string = "";
  filterNombreCompletov: string = "";
  codigoPap: string = "";
  isFilterCP: boolean = false;
  isFilterNM: boolean = false;
  isFilterT: boolean = false;
  isFilterTP: boolean = false;
  isViewPapeleta: boolean = false;
  filteredValues: any = {
    cargo_empleado: "",
    codigo_papeleta: "",
    codigo_tienda: "",
    documento: "",
    fecha_creacion: "",
    fecha_compensacion: "",
    fecha_desde: "",
    fecha_hasta: "",
    hora_acumulado: "",
    hora_llegada: "",
    hora_salida: "",
    hora_solicitada: "",
    horas_extras: [],
    id_tipo_papeleta: "",
    nombre_completo: "",
    tipo: "",
    uns: ""
  };

  @ViewChild('MatPaginator2') paginator_pap: MatPaginator;
  @ViewChild(MatSort) sort_pap: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('filterCodigo') searchCodigo!: MatMenu;
  @ViewChild('filterTienda') searchTienda!: MatMenu;
  @ViewChild('filterTipoPap') searchTipoPap!: MatMenu;
  @ViewChild('filterNombreCompleto') searchNombreCompleto!: MatMenu;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    console.log(this.dataTable);
    this.dataSourcePap = new MatTableDataSource(this.dataTable);
    this.dataSourcePap.paginator = this.paginator_pap;
    this.dataSourcePap.sort = this.sort_pap;
  }

  ngAfterViewInit() {
    // Inject our custom logic of menu close
    (this.searchCodigo as any).closed = this.configureMenuClose(this.searchCodigo.close);
    (this.searchTienda as any).closed = this.configureMenuClose(this.searchTienda.close);
    (this.searchTipoPap as any).closed = this.configureMenuClose(this.searchTipoPap.close);
    (this.searchNombreCompleto as any).closed = this.configureMenuClose(this.searchNombreCompleto.close);
  }

  private configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    this.feed(upd.pipe(
      filter(event => {
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

  applyFilterCodigo(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterCP = true;
    } else {
      this.isFilterCP = false;
    }

    this.filteredValues['codigo_papeleta'] = filterValue.trim().toLowerCase();
    this.dataSourcePap.filter = JSON.stringify(this.filteredValues);
    this.dataSourcePap.filterPredicate = this.customFilterPredicate();
  }

  onViewPapeleta(ev) {
    this.isViewPapeleta = true;
    this.codigoPap = ev.codigo_papeleta;
  }


  applyFilterNombreCompleto(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterNM = true;
    } else {
      this.isFilterNM = false;
    }
    this.filteredValues['nombre_completo'] = filterValue.trim().toLowerCase();
    this.dataSourcePap.filter = JSON.stringify(this.filteredValues);
    this.dataSourcePap.filterPredicate = this.customFilterPredicate();
  }

  applyFilterTienda(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterT = true;
    } else {
      this.isFilterT = false;
    }
    this.filteredValues['uns'] = filterValue.trim().toLowerCase();
    this.dataSourcePap.filter = JSON.stringify(this.filteredValues);
    this.dataSourcePap.filterPredicate = this.customFilterPredicate();
  }

  applyFilterTipoPap(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterTP = true;
    } else {
      this.isFilterTP = false;
    }
    this.filteredValues['tipo'] = filterValue.trim().toLowerCase();
    this.dataSourcePap.filter = JSON.stringify(this.filteredValues);
    this.dataSourcePap.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    const myFilterPredicate = (
      data: PeriodicElement,
      filter: string
    ): boolean => {
      var globalMatch = !this.filterTiendaUnid;

      if (this.filterTiendaUnid) {
        // search all text fields
        globalMatch =
          data.uns
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.filterTiendaUnid.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return false;
      }

      let searchString = JSON.parse(filter);
      return (
        data.codigo_papeleta.toLowerCase().includes(searchString.codigo_papeleta) &&
        data.nombre_completo.toLowerCase().includes(searchString.nombre_completo) &&
        data.tipo.toLowerCase().includes(searchString.tipo) &&
        data.uns.toLowerCase().includes(searchString.uns)
      );

    };
    return myFilterPredicate;
  }

}

export interface PeriodicElement {
  cargo_empleado: String,
  codigo_papeleta: String,
  codigo_tienda: String,
  documento: String,
  fecha_creacion: String,
  fecha_compensacion: String,
  fecha_desde: String,
  fecha_hasta: String,
  hora_acumulado: String,
  hora_llegada: String,
  hora_salida: String,
  hora_solicitada: String,
  horas_extras: Array<any>,
  id_tipo_papeleta: number,
  nombre_completo: String,
  tipo: String,
  uns: String
}
