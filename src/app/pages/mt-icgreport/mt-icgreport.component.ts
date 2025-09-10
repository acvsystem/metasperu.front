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
  displayedColumns: string[] = ['departamento', 'porcentage', 'importe', 'unidades'];
  dataSource = [];
  isErrorFecha: boolean = false;
  isOnlineTienda: boolean = false;
  isOnlineTienda1: boolean = false;
  isOnlineTienda2: boolean = false;
  cboColumn: string = "";
  cboStore1: string = "";
  cboStore2: string = "";
  cboStore: string = "";
  cboReport: string = "";
  vDetallado: Array<any> = [];
  vCalendar1: Array<any> = [];
  vCalendar2: Array<any> = [];
  arCardData: Array<any> = [];
  conxOnline: Array<any> = [];
  cboColunmAll: Array<any> = [
    { key: 'Departamento', value: 'Departamento' },
    { key: 'Familia', value: 'Familia' },
    { key: 'Sub Familia', value: 'Sub Familia' }
  ];
  cboReportAll: Array<any> = [
    { key: 'Simple', value: 'Simple' },
    { key: 'Comparativo', value: 'Comparativo' }
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
      let keyComparation = dateResponse['key'];
      let dataTable = [];



      let socketStore = this.arStoreAll.find((store) => store.serie == dateResponse['code'])

      let titleCard = `${dateResponse['f1']} - ${dateResponse['f2']}`;

      if (this.cboReport != 'Comparativo') {
        (dataResponse || []).filter((dr) => {
          dataTable.push({
            departament: dr.cDepartamento,
            unid: parseInt(dr.cUnidades),
            import: dr.cImporte,
            total_import: 0,
            porcentage_import: 0
          });
        });

        this.arCardData.push({
          id: this.arCardData.length + 1,
          title: titleCard,
          store: (socketStore || {}).description,
          column: dateResponse['column'],
          data: dataTable,
          total_stock: dataTable.reduce((acum, f) => acum + parseFloat(f.unid), 0),
          total_import: Number(dataTable.reduce((acum, f) => acum + parseFloat(f.import), 0).toFixed(2))
        });

      } else {

        let indexCard = this.arCardData.findIndex((card) => card.id == keyComparation);

        if (indexCard != -1) {
          if (indexCard != -1) {

            (dataResponse || []).filter((dr) => {
              let indexDepartament = this.arCardData[indexCard]['data'].findIndex((dt) => dt.departament == dr.cDepartamento);
              this.arCardData[indexCard]['data'][indexDepartament]['unid2'] = parseInt(dr.cUnidades);
              this.arCardData[indexCard]['data'][indexDepartament]['import2'] = dr.cImporte;
              this.arCardData[indexCard]['data'][indexDepartament]['porcentage_import2'] = 0;
            });

            this.arCardData[indexCard]['title2'] = titleCard;
            this.arCardData[indexCard]['store2'] = (socketStore || {}).description;
            this.arCardData[indexCard]['total_stock2'] = this.arCardData[indexCard]['data'].reduce((acum, f) => acum + parseFloat(f.unid2), 0);
            this.arCardData[indexCard]['total_import2'] = Number(this.arCardData[indexCard]['data'].reduce((acum, f) => acum + parseFloat(f.import2), 0).toFixed(2));
          }
        } else {

          (dataResponse || []).filter((dr) => {
            dataTable.push({
              departament: dr.cDepartamento,
              unid: parseInt(dr.cUnidades),
              import: dr.cImporte,
              total_stock1: 0,
              total_import1: 0,
              porcentage_import: 0,
              unid2: 0,
              import2: 0,
              total_import2: 0,
              porcentage_import2: 0
            });
          });

          this.arCardData.push({
            id: keyComparation,
            column: dateResponse['column'],
            title1: titleCard,
            store1: (socketStore || {}).description,
            data: dataTable,
            total_stock1: dataTable.reduce((acum, f) => acum + parseFloat(f.unid), 0),
            total_import1: Number(dataTable.reduce((acum, f) => acum + parseFloat(f.import), 0).toFixed(2))
          });
        }
      }

      console.log(this.arCardData);

      //this.dataSource = dataTable;
    });
  }

  onCaledar($event) {
    console.log($event);
    this.isErrorFecha = false;

    if ($event.isRange && $event.id != 'calendar1' && $event.id != 'calendar2') {
      this.vDetallado = [];
      let range = $event.value;

      if (range.length >= 2) {
        this.vDetallado = range;
      }
    }

    if ($event.isRange && $event.id == 'calendar1') {
      this.vCalendar1 = [];
      let range = $event.value;

      if (range.length >= 2) {
        this.vCalendar1 = range;
      }
    }

    if ($event.isRange && $event.id == 'calendar2') {
      this.vCalendar2 = [];
      let range = $event.value;

      if (range.length >= 2) {
        this.vCalendar2 = range;
      }
    }
  }

  onConsultar() {

    if (this.cboReport == 'Comparativo') {
      let keyReport = this.codigoNumerico();

      let configuration1 = {
        f1: this.vCalendar1[0],
        f2: this.vCalendar1[1],
        code: this.cboStore1,
        column: this.cboColumn,
        key: keyReport
      };

      this.socket.emit('reportSalesDepartament', configuration1);

      let configuration2 = {
        f1: this.vCalendar2[0],
        f2: this.vCalendar2[1],
        code: this.cboStore2,
        column: this.cboColumn,
        key: keyReport
      };

      this.socket.emit('reportSalesDepartament', configuration2);

    } else {
      let configuration = {
        f1: this.vDetallado[0],
        f2: this.vDetallado[1],
        code: this.cboStore,
        column: this.cboColumn
      };
      this.socket.emit('reportSalesDepartament', configuration);
    }
  }

  onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'cboReport' && (selectData || {}).key == 'Comparativo') {
      this.displayedColumns = ['departamento1', 'porcentage1', 'importe1', 'unidades1', 'porcentage2', 'importe2', 'unidades2', 'diff_procentage', 'diff_unid'];
    }
    if (index == 'cboStore') {
      let storeConxOnline = this.store.getStore('conx_online');
      let indexStore = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (indexStore > -1) {
        this.isOnlineTienda = true;
      } else {
        this.isOnlineTienda = false;
      }
      this.isOnlineTienda1 = false;
      this.isOnlineTienda2 = false;
    }

    if (index == 'cboStore1') {
      let storeConxOnline = this.store.getStore('conx_online');
      let indexStore = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (indexStore > -1) {
        this.isOnlineTienda1 = true;
      } else {
        this.isOnlineTienda1 = false;
      }

      this.isOnlineTienda = false;
    }

    if (index == 'cboStore2') {
      let storeConxOnline = this.store.getStore('conx_online');
      let indexStore = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (indexStore > -1) {
        this.isOnlineTienda2 = true;
      } else {
        this.isOnlineTienda2 = false;
      }

      this.isOnlineTienda = false;
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

  getTotalCost() {
    return Number(this.dataSource.reduce((acum, f) => acum + parseFloat(f.import), 0).toFixed(2));
  }

  getTotalStock() {
    return this.dataSource.reduce((acum, f) => acum + parseFloat(f.unid), 0);
  }

  getPorcentage(importe, total) {
    return Math.round((importe * 100) / total);
  }

  getDiferenciaProce(total1, total2) {
    return Math.round((total1 - total2) / total2 * 100);
  }

  codigoNumerico(longitud = 6) {
    return Math.floor(Math.random() * Math.pow(10, longitud))
      .toString()
      .padStart(longitud, '0');
  }


}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
