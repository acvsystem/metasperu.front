import { Component, EventEmitter, inject, OnInit, SimpleChanges, ViewChild, NgZone, input, Input } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MtViewRegistroComponent } from 'src/app/pages/mt-rrhh-asistencia/components/mt-view-registro/mt-view-registro.component';

@Component({
  selector: 'mt-table-filter',
  templateUrl: './mt-table-filter.component.html',
  styleUrls: ['./mt-table-filter.component.scss'],
})
export class MtTableFilterComponent implements OnInit {

  @Input() dataTable: Array<any> = [];

  onDataView: Array<any> = [];
  dataSource = new MatTableDataSource<PeriodicElement>(this.onDataView);
  displayedColumns: string[] = ['tienda', 'codigoEJB', 'nro_documento', 'nombre_completo', 'dia', 'hr_ingreso_1', 'hr_salida_1', 'hr_break', 'hr_ingreso_2', 'hr_salida_2', 'hr_trabajadas', 'maximo_registro', 'estado_papeleta', 'view_registre', 'rango_horario', 'isTardanza'];
  filterEmpleado: string = "";
  filterTardanzaStatus: string = "";
  filterEstatus: string = "";
  filterEstatusPapeleta: string = "";
  filterNombreEmpleado: string = "";
  codigoPap: string = "";
  isViewPapeleta: boolean = true;
  isFilterT: boolean = false;
  isFilterNM: boolean = false;
  isFilterTR: boolean = false;
  isFilterST: boolean = false;
  isFilterPAP: boolean = false;
  dataFilter: Array<any> = [];
  arFiltro: Array<any> = [];
  dialog = inject(MatDialog);
  filteredValues: any = {
    tienda: "",
    codigoEJB: "",
    nombre_completo: "",
    nro_documento: "",
    telefono: "",
    email: "",
    fec_nacimiento: "",
    fec_ingreso: "",
    status: "",
    dia: "",
    hr_ingreso_1: "",
    hr_salida_1: "",
    rango_horario: "",
    isNullRango: "",
    isTardanza: "",
    hr_brake: "",
    hr_ingreso_2: "",
    hr_salida_2: "",
    hr_trabajadas: "",
    caja: "",
    isJornadaCompleta: "",
    isBrakeComplete: "",
    isRegistroMax: "",
    statusRegistro: "",
    statusTardanza: "",
    dataRegistro: "",
    papeletas: "",
    isPapeleta: "",
    estadoPapeleta: ""
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterMenu') searchMenu!: MatMenu;
  @ViewChild('filterTardanza') searchTardanza!: MatMenu;
  @ViewChild('filterStatus') searchStatus!: MatMenu;
  @ViewChild('filterStatusPapeleta') searchStatusPapeleta!: MatMenu;
  @ViewChild('filterNombre') searchNombreEmpleado!: MatMenu;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    // Inject our custom logic of menu close
    (this.searchMenu as any).closed = this.configureMenuClose(this.searchMenu.close);
    (this.searchTardanza as any).closed = this.configureMenuClose(this.searchTardanza.close);
    (this.searchStatus as any).closed = this.configureMenuClose(this.searchStatus.close);
    (this.searchStatusPapeleta as any).closed = this.configureMenuClose(this.searchStatusPapeleta.close);
    (this.searchNombreEmpleado as any).closed = this.configureMenuClose(this.searchNombreEmpleado.close);
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

  applyFilterEstatusPapeleta(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterPAP = true;
    } else {
      this.isFilterPAP = false;
    }
    
    this.filteredValues['estadoPapeleta'] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filteredValues);
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  applyFilterNombreEmpleado(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterNM = true;
    } else {
      this.isFilterNM = false;
    }

    this.filteredValues['nombre_completo'] = filterValue.trim().toLowerCase();
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

  applyFilterEstatus(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterST = true;
    } else {
      this.isFilterST = false;
    }
    
    this.filteredValues['statusRegistro'] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filteredValues);
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  applyFilterTienda(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length) {
      this.isFilterT = true;
    } else {
      this.isFilterT = false;
    }
    this.filteredValues['tienda'] = filterValue.trim().toLowerCase();
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
        console.log();
        globalMatch =
          data.tienda
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.filterEmpleado.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return false;
      }

      let searchString = JSON.parse(filter);
      //console.log(data.tienda.toLowerCase(), data.tienda.includes(searchString.tienda), searchString.tienda);
      return (
        data.tienda.toLowerCase().includes(searchString.tienda) &&
        data.statusTardanza.toLowerCase().includes(searchString.statusTardanza) &&
        data.statusRegistro.toLowerCase().includes(searchString.statusRegistro) &&
        data.estadoPapeleta.toLowerCase().includes(searchString.estadoPapeleta) &&
        data.nombre_completo.toLowerCase().includes(searchString.nombre_completo)
      );

    };
    return myFilterPredicate;
  }


  openDialog(ev) {
    this.dialog.open(MtViewRegistroComponent, {
      data: ev,
      panelClass: 'full-screen-modal'
    });
  }

  onViewPapeleta(ev) {
    console.log(ev);
    this.codigoPap = "";
    this.codigoPap = (ev || [])[0].CODIGO_PAPELETA;
    this.isViewPapeleta = true;
  }
}

export interface PeriodicElement {
  tienda: string,
  codigoEJB: string,
  nombre_completo: string,
  nro_documento: string,
  telefono: string,
  email: string,
  fec_nacimiento: string,
  fec_ingreso: string,
  status: string,
  dia: string,
  hr_ingreso_1: string,
  hr_salida_1: string,
  rango_horario: string,
  isNullRango: string,
  isTardanza: string,
  hr_brake: string,
  hr_ingreso_2: string,
  hr_salida_2: string,
  hr_trabajadas: string,
  caja: string,
  isJornadaCompleta: string,
  isBrakeComplete: string,
  isRegistroMax: string,
  statusRegistro: string,
  statusTardanza: string,
  dataRegistro: string,
  papeletas: string,
  isPapeleta: string,
  estadoPapeleta: string
}

