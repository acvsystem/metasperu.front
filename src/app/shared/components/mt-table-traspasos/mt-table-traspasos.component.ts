import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'mt-table-traspasos',
  templateUrl: './mt-table-traspasos.component.html',
  styleUrls: ['./mt-table-traspasos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MtTableTraspasosComponent implements OnInit {
  @Input() dataTransfers: Array<any> = [];
  onDataView: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.onDataView);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['code_transfer', 'unid_service', 'store_origin', 'store_destination', 'code_warehouse_origin', 'code_warehouse_destination', 'datetime'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: PeriodicElement | null;
  arDetail: Array<any> = [];
  
  constructor() { }

  ngOnInit() {

  }
  /** Checks whether an element is expanded. */
  isExpanded(element: PeriodicElement) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: PeriodicElement) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.dataTransfers);
    this.dataSource = new MatTableDataSource(this.dataTransfers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}

export interface PeriodicElement {
  code_transfer: string,
  code_warehouse_destination: string,
  code_warehouse_origin: string,
  datetime: string,
  store_destination: string,
  store_origin: string,
  unid_service: number
}
