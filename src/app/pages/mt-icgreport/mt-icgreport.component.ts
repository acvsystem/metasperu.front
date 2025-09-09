import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import { SocketService } from 'src/app/services/socket.service';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-icgreport',
  templateUrl: './mt-icgreport.component.html',
  styleUrls: ['./mt-icgreport.component.scss'],
})
export class MtIcgreportComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns: string[] = ['departamento', 'unidades', 'importe'];
  dataSource = [];
  isErrorFecha: boolean = false;
  isOnlineTienda: boolean = false;
  cboColumn: string = "";
  cboStore: string = "";
  vDetallado: Array<any> = [];
  arCardData: Array<any> = [];
  conxOnline: Array<any> = [];
  cboColunmAll: Array<any> = [
    { key: 'Departamento', value: 'Departamento' },
    { key: 'Familia', value: 'Familia' },
    { key: 'Sub Familia', value: 'Sub Familia' }
  ];
  arStoreAll: Array<any> = [];
  cboStoreAll: Array<any> = [];

  constructor(private socket: SocketService, private service: ShareService, private store: StorageService) { }

  ngOnInit() {
    this.conxOnline = []
    this.socket.emit('comprobantes:get', 'angular');
    this.socket.on('comprobantes:get:response', (listaSession) => {
      let dataList = [];
      dataList = listaSession || [];
      (dataList || []).filter((dataSocket: any) => {

        if ((dataSocket || {}).ISONLINE == 1) {
          let index = this.conxOnline.findIndex((conx) => conx == (dataSocket || {}).CODIGO_TERMINAL);

          if (index == -1) {
            this.conxOnline.push((dataSocket || {}).CODIGO_TERMINAL);
          }
        }

        if ((dataSocket || {}).ISONLINE == 0) {
          this.conxOnline = this.conxOnline.filter((conx) => conx != (dataSocket || {}).CODIGO_TERMINAL);
        }
      });

      this.store.removeStore("conx_online");
      this.store.setStore("conx_online", JSON.stringify(this.conxOnline));
    });

    this.onStoreAll();
    this.socket.on('report:sales:departament:response', (response) => {
      console.log(response);
      let dataResponse: Array<any> = JSON.parse(response['data']);
      let dateResponse: Array<any> = response['date'];
      let serieTienda: string = dataResponse[0]['cCodigoTienda'];

      let dataTable = [];

      (dataResponse || []).filter((dr) => {
        dataTable.push({
          departament: dr.cDepartamento,
          unid: parseInt(dr.cUnidades),
          import: dr.cImporte
        });
      });

      let socketStore = this.arStoreAll.find((store) => store.serie == dateResponse['code'])

      let titleCard = `${dateResponse['f1']} - ${dateResponse['f2']}`;
      this.arCardData.push({
        id: this.arCardData.length + 1,
        title: titleCard,
        store: (socketStore || {}).description,
        column: dateResponse['column'],
        data: dataTable
      })

      this.dataSource = dataTable;
      console.log(this.dataSource);
    });
  }

  onCaledar($event) {
    this.isErrorFecha = false;

    if ($event.isRange) {
      this.vDetallado = [];
      let range = $event.value;

      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      let date = new Date(range[1]).toLocaleDateString().split('/');
      var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));

      if (range.length >= 2) {
        this.vDetallado = range;
        console.log(this.vDetallado);
      }
    }
  }

  onConsultar() {
    let configuration = {
      f1: this.vDetallado[0],
      f2: this.vDetallado[1],
      code: this.cboStore,
      column: this.cboColumn
    };

    this.socket.emit('reportSalesDepartament', configuration);
  }

  onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
    if (index == 'cboStore') {
      let storeConxOnline = this.store.getStore('conx_online');
      let indexStore = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (indexStore > -1) {
        this.isOnlineTienda = true;
      } else {
        this.isOnlineTienda = false;
      }
    }
  }

  onStoreAll() {
    this.service.allStores().then((response: Array<any>) => {
      this.arStoreAll = response;
      this.arStoreAll.filter((store) => {
        console.log((store.serie.split('')[0]));
        if ((store.serie.split('')[0]) == '7') {
          this.cboStoreAll.push({ key: store.serie, value: store.description });
        }
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.arCardData, event.previousIndex, event.currentIndex);
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
