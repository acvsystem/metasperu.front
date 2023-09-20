import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';

@Component({
  selector: 'mt-employee',
  templateUrl: './mt-employee.component.html',
  styleUrls: ['./mt-employee.component.scss']
})
export class MtEmployeeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataPaginationList: Array<any> = [];
  headList: Array<any> = [];
  displayedColumns: string[] = ['Nro', 'Codigo EJB', 'Nombre completo', 'Tipo Documento', 'Numero Documento', 'Tienda', 'Salario', 'Fecha Ingreso', 'Cargo', 'Estado'];

  dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);

  constructor(private service: ShareService, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.onEmpleadoList();
  }

  onEmpleadoList() {

    let parms = {
      url: '/rrhh/search/empleado'
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];
      console.log(data);
      this.dataPaginationList = data || [];
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openModalAddEmployee() {

    let onResponseModal = new EventEmitter();

    onResponseModal.subscribe((isSuccess) => {
      if (isSuccess) {
        this.onEmpleadoList();
      }
    });

    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addEmployee',
        title: 'Registrar empleado',
        bodyContent: 'mt-frm-add-employee',
        onResponseModal: onResponseModal
      },
      cssClass: 'mt-modal'
    });

    modal.present();
  }

}


export interface PeriodicElement {
  ID_EMPLEADO: number;
  CODIGO_EJB: number;
  AP_PATERNO: number;
  TIPO_DOC: string;
  NRO_DOC: string;
  TIENDA_ASIGNADO: string;
  SALARIO_BASE: number;
  FEC_INGRESO: string;
  CARGO: string;
  ESTADO_EMP: string;
}
