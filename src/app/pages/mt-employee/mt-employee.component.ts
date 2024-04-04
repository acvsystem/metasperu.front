import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';
import * as XLSX from 'xlsx';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-employee',
  templateUrl: './mt-employee.component.html',
  styleUrls: ['./mt-employee.component.scss']
})
export class MtEmployeeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataPaginationList: Array<any> = [];
  headList: Array<any> = [];
  displayedColumns: string[] = ['Nro', 'Codigo EJB', 'Nombre completo', 'Tipo Documento', 'Numero Documento', 'Tienda', 'Salario', 'Fecha Ingreso', 'Cargo', 'Estado', 'Accion'];
  selectedEmployee: Array<any> = [];
  isLoadPDF: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);
  token: any = localStorage.getItem('tn');
  socket = io('http://190.117.53.171:3600', { query: { code: 'app', token: this.token } });

  constructor(private service: ShareService, private modalCtrl: ModalController) { }

  ngOnInit() {
    const self = this;
    this.onEmpleadoList();

    this.socket.on('sendUDPEmpleados', (response) => {
      self.isLoadPDF = false;
      console.log(response);
      this.onEmpleadoList();
      let notificationList = [{
        isSuccess: true,
        bodyNotification: "Empleados Actualizados."
      }];
      this.service.onNotification.emit(notificationList);
    });
  }

  onUpdateEmpleado(){
    const self = this;
    self.isLoadPDF = true;
    this.socket.emit('emitRRHHEmpleados');
  }

  onEmpleadoList() {

    let parms = {
      url: '/rrhh/search/empleado'
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];
      
      this.dataPaginationList = data || [];
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataPaginationList);
      this.dataSource.paginator = this.paginator;
    });
  }

  onDeleteRegister(nroDocumento) {
    let parms = {
      url: '/rrhh/delete/employee',
      body: {
        nroDocumento: nroDocumento
      }
    };

    this.service.post(parms).then((response) => {
      let success = (((response || [])[0] || {}).status || {}).success;
      if (success) {
        this.onEmpleadoList();
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectedEmployee(ev) {
    this.selectedEmployee = ev;
    this.openModalAddEmployee(false);
  }

  async openModalAddEmployee(isNew) {

    let onResponseModal = new EventEmitter();

    onResponseModal.subscribe((isSuccess) => {
      if (isSuccess) {
        this.onEmpleadoList();
      }
    });

    if (isNew) {
      this.selectedEmployee = [];
    }

    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addEmployee',
        title: 'Registrar empleado',
        bodyContent: 'mt-frm-add-employee',
        dataEmployeeList: this.selectedEmployee,
        onResponseModal: onResponseModal
      },
      cssClass: 'mt-modal'
    });

    modal.present();
  }

  exportReporte(): void {
    let name = `dataEmpleados.xlsx`;
    let element = this.dataPaginationList;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, name);
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
