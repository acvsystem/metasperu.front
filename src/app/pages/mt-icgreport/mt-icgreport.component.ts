import { Component, HostListener, OnInit } from '@angular/core';
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
  @HostListener('document:click', ['$event']) onClickFuera(event: MouseEvent) {
    if (this.isVisiblePopover) {
      this.isVisiblePopover = false;
    }
  }

  isLoading: boolean = false;
  displayedColumns_1 = ['departamento1', 'anio1', 'porcentage1', 'importe1', 'unidades1', 'anio2', 'porcentage2', 'importe2', 'unidades2', 'diff_procentage', 'diff_unid'];
  displayedColumns_2: string[] = ['departamento', 'porcentage', 'importe', 'unidades'];
  dataSource = [];
  isErrorFecha: boolean = false;
  isOnlineTienda: boolean = false;
  isOnlineTienda1: boolean = false;
  isOnlineTienda2: boolean = false;
  isComparationStores: boolean = false;
  isVisiblePopover: boolean = false;
  clicDentroDelDiv: boolean = false;
  cboColumn: string = "";
  cboStore1: string = "";
  cboStore2: string = "";
  cboStore: string = "";
  cboReport: string = "";
  cboSemana: string = "";
  vAnio_1: string = "";
  vAnio_2: string = "";
  vPlaceholder_anio_1: string = "Año";
  vPlaceholder_anio_2: string = "Año 2";
  optionTipoFecha: string = "fecha";
  vDetallado: Array<any> = [];
  vCalendar1: Array<any> = [];
  vCalendar2: Array<any> = [];
  arCardDataTemp: Array<any> = [];
  arCardData: Array<any> = [];
  conxOnline: Array<any> = [];
  cboSemanaAll: Array<any> = [];
  arStoreAll: Array<any> = [];
  arSemanaAll: Array<any> = [];
  cboStoreAll: Array<any> = [];
  cboColunmAll: Array<any> = [
    { key: 'Departamento', value: 'Departamento' },
    { key: 'Familia', value: 'Familia' },
    { key: 'Sub Familia', value: 'Sub Familia' }
  ];
  cboReportAll: Array<any> = [
    { key: 'Simple', value: 'Simple' },
    { key: 'Comparativo', value: 'Comparativo' }
  ];

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
    this.generarSemanas("");
    this.onStoreAll();
    this.socket.on('report:sales:departament:response', (response) => {
      //console.log(response);


      let dataResponse: Array<any> = JSON.parse(response['data']);
      let dateResponse: Array<any> = response['date'];
      let keyComparation = dateResponse['key'];
      let anioData = dateResponse['anio'];
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
          typeReport: dateResponse['type_report'],
          semana: dateResponse['semana'],
          data_simple: dataTable,
          total_stock: dataTable.reduce((acum, f) => acum + parseFloat(f.unid), 0),
          total_import: Number(dataTable.reduce((acum, f) => acum + parseFloat(f.import), 0).toFixed(2))
        });
        console.log(this.arCardData);
      } else {
        let indexCard = this.arCardDataTemp.findIndex((card) => card.id == keyComparation);
        if (indexCard != -1) {
          (dataResponse || []).filter((dr) => {
            let indexDepartament = this.arCardDataTemp.findIndex((card) => card.departament == dr.cDepartamento);
            console.log((socketStore || {}).description);
            this.arCardDataTemp[indexDepartament]['store_2'] = (socketStore || {}).description;
            this.arCardDataTemp[indexDepartament]['anio_2'] = {
              anio: anioData,
              unid: parseInt(dr.cUnidades),
              import: dr.cImporte
            };
          });

          this.onSearchDataAnio();
        } else {
          console.log((socketStore || {}).description);
          (dataResponse || []).filter((dr) => {
            this.arCardDataTemp.push({
              id: keyComparation,
              departament: dr.cDepartamento,
              column: dateResponse['column'],
              typeReport: dateResponse['type_report'],
              semana: dateResponse['semana'],
              store_1: (socketStore || {}).description,
              diffPorc: 0,
              anio_1: {
                anio: anioData,
                unid: parseInt(dr.cUnidades),
                import: dr.cImporte,
                proc_1: 0
              },
              anio_2: {}
            });

          });
        }
      }
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

  onSearchDataAnio() {
    let parseData = [];
    this.arCardDataTemp.filter((dt) => {
      parseData.push({
        id: dt.id,
        departament: dt.departament,
        column: dt.column,
        typeReport: dt.typeReport,
        semana: dt.semana,
        store_1: (((dt || {}).anio_1 || [])[0] || {}).anio > (((dt || {}).anio_2 || [])[0] || {}).anio ? dt.store_1 : dt.store_2,
        store_2: (((dt || {}).anio_1 || [])[0] || {}).anio > (((dt || {}).anio_2 || [])[0] || {}).anio ? dt.store_2 : dt.store_1,
        anio_1: (((dt || {}).anio_1 || [])[0] || {}).anio > (((dt || {}).anio_2 || [])[0] || {}).anio ? dt.anio_1 : dt.anio_2,
        anio_2: (((dt || {}).anio_1 || [])[0] || {}).anio > (((dt || {}).anio_2 || [])[0] || {}).anio ? dt.anio_2 : dt.anio_1
      });
    });

    let index = this.arCardData.findIndex((dt) => dt.id == parseData[0].id);

    if (index == -1) {
      let total_stock_1 = Number(parseData.reduce((acum, f) => acum + parseFloat(f.anio_1.unid), 0).toFixed(2));
      let total_stock_2 = Number(parseData.reduce((acum, f) => acum + parseFloat(f.anio_2.unid), 0).toFixed(2));
      let total_import_1 = Number(parseData.reduce((acum, f) => acum + parseFloat(f.anio_1.import), 0).toFixed(2));
      let total_import_2 = Number(parseData.reduce((acum, f) => acum + parseFloat(f.anio_2.import), 0).toFixed(2));

      let porc_1 = 0;
      let porc_2 = 0;

      parseData.filter((pr, i) => {
        porc_1 = this.getPorcentage(pr.anio_1.import, total_import_1);
        parseData[i]['anio_1']['proc_1'] = porc_1;
        porc_2 = this.getPorcentage(pr.anio_2.import, total_import_2);
        parseData[i]['anio_2']['proc_2'] = porc_2;
        parseData[i]['diffPorc'] = porc_1 - porc_2;
        parseData[i]['diffUnid'] = this.getPorcentage(pr.anio_1.unid, pr.anio_2.unid);
        //parseData[i]['store_1'] = pr.store_1;
        //parseData[i]['store_2'] = pr.store_1;
      });



      this.arCardData.push({
        id: parseData[0].id,
        store_1: parseData[0]['store_1'],
        store_2: parseData[0]['store_2'],
        departament: parseData[0]['departament'],
        column: parseData[0]['column'],
        type_report: parseData[0]['typeReport'],
        semana: parseData[0]['semana'],
        data_comparativo: parseData,
        total_stock_1: total_stock_1,
        total_stock_2: total_stock_2,
        total_import_1: total_import_1,
        total_import_2: total_import_2,
        diffImportTotal: this.getDiferenciaProce(total_import_1, total_import_2),
        diffUnidTotal: this.getDiferenciaProce(total_stock_1, total_stock_2)
      });
    }


    //this.arCardData['data'] = parseData;
    //console.log(parseData);

    const grupos = Object.entries(parseData).map(([departament, items]) => ({
      departament,
      items
    }));

    console.log(grupos);


  }

  onConsultar() {
    this.arCardDataTemp = [];
    if (this.cboReport == 'Simple' && this.cboColumn == 'Departamento' && this.optionTipoFecha == 'semana') {//simple,departamento,semana - rp-1
      let semanasAll: Array<any> = this.generarSemanas(this.vAnio_1);
      if (semanasAll.length) {
        let semanaSelected = semanasAll.find((sm) => sm.semana == this.cboSemana);
        this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected['inicio']), this.convertirFechaSQL(semanaSelected['fin']), this.cboStore, this.cboColumn);
      }
    }

    if (this.cboReport == 'Simple' && this.cboColumn == 'Departamento' && this.optionTipoFecha == 'fecha') {//simple,departamento,fecha - rp-2
      this.sendConsultReport(this.cboReport, this.vCalendar1[0], this.vCalendar1[1], this.cboStore, this.cboColumn);
    }

    if (this.cboReport == 'Comparativo' && this.cboColumn == 'Departamento' && this.optionTipoFecha == 'semana' && !this.isComparationStores) {//comparativo,departamento,semana - rp-3
      let keyReport = this.codigoNumerico();
      let semanasAll_1: Array<any> = this.generarSemanas(this.vAnio_1);
      let semanasAll_2: Array<any> = this.generarSemanas(this.vAnio_2);
      let semanaSelected_1 = semanasAll_1.find((sm) => sm.semana == this.cboSemana);
      let semanaSelected_2 = semanasAll_2.find((sm) => sm.semana == this.cboSemana);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_1['inicio']), this.convertirFechaSQL(semanaSelected_1['fin']), this.cboStore1, this.cboColumn, keyReport);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_2['inicio']), this.convertirFechaSQL(semanaSelected_2['fin']), this.cboStore1, this.cboColumn, keyReport);
    }

    if (this.cboReport == 'Comparativo' && this.cboColumn == 'Departamento' && this.optionTipoFecha == 'semana' && this.isComparationStores) {//comparativo,departamento,semana,entre_tiendas - rp-4
      let keyReport = this.codigoNumerico();
      let semanasAll_1: Array<any> = this.generarSemanas(this.vAnio_1);
      let semanasAll_2: Array<any> = this.generarSemanas(this.vAnio_2);
      let semanaSelected_1 = semanasAll_1.find((sm) => sm.semana == this.cboSemana);
      let semanaSelected_2 = semanasAll_2.find((sm) => sm.semana == this.cboSemana);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_1['inicio']), this.convertirFechaSQL(semanaSelected_1['fin']), this.cboStore1, this.cboColumn, keyReport);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_2['inicio']), this.convertirFechaSQL(semanaSelected_2['fin']), this.cboStore2, this.cboColumn, keyReport);
    }

    if (this.cboReport == 'Comparativo' && this.cboColumn == 'Departamento' && this.optionTipoFecha == 'fecha') {//comparativo,departamento,fecha,entre_tiendas - rp-5
      let keyReport = this.codigoNumerico();
      this.sendConsultReport(this.cboReport, this.vCalendar1[0], this.vCalendar1[1], this.cboStore1, this.cboColumn, keyReport);
      this.sendConsultReport(this.cboReport, this.vCalendar2[0], this.vCalendar2[1], this.cboStore1, this.cboColumn, keyReport);
    }

    if (this.cboReport == 'Comparativo' && this.cboColumn == 'Familia' && this.optionTipoFecha == 'semana' && !this.isComparationStores) {//comparativo,familia,semana - rp-3
      let keyReport = this.codigoNumerico();
      let semanasAll_1: Array<any> = this.generarSemanas(this.vAnio_1);
      let semanasAll_2: Array<any> = this.generarSemanas(this.vAnio_2);
      let semanaSelected_1 = semanasAll_1.find((sm) => sm.semana == this.cboSemana);
      let semanaSelected_2 = semanasAll_2.find((sm) => sm.semana == this.cboSemana);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_1['inicio']), this.convertirFechaSQL(semanaSelected_1['fin']), this.cboStore1, this.cboColumn, keyReport);
      this.sendConsultReport(this.cboReport, this.convertirFechaSQL(semanaSelected_2['inicio']), this.convertirFechaSQL(semanaSelected_2['fin']), this.cboStore1, this.cboColumn, keyReport);
    }
  }

  onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'cboReport' && (selectData || {}).key == 'Comparativo') {
      this.isComparationStores = false;
      if (this.optionTipoFecha == 'semana' && this.cboReport == 'Comparativo') {
        this.vPlaceholder_anio_1 = "Año 1";
      }
    }

    if (index == 'cboReport' && (selectData || {}).key == 'simple') {
      this.vPlaceholder_anio_1 = "Año";
    }

    if (index == 'cboStore') {
      let storeConxOnline = this.store.getStore('conx_online');
      let indexStore = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (indexStore > -1) {
        this.isOnlineTienda = true;
      } else {
        this.isOnlineTienda = false;
      }
      console.log(this.isOnlineTienda);
      // this.isOnlineTienda1 = false;
      //his.isOnlineTienda2 = false;
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

    if (index == 'cboSemana') {
      let semana = this.arSemanaAll.find((sm) => sm.semana == (selectData || {}).key);
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

  getPorcentage(totalUnid_1, totalUnid_2) {
    return Math.round((totalUnid_1 / totalUnid_2) * 100);
  }

  getDiferenciaProce(total1, total2) {
    return Math.round((total1 - total2) / total2 * 100);
  }

  codigoNumerico(longitud = 6) {
    return Math.floor(Math.random() * Math.pow(10, longitud))
      .toString()
      .padStart(longitud, '0');
  }

  generarSemanas(inAnio) {
    const semanas = [];
    this.arSemanaAll = [];
    this.cboSemanaAll = [];
    let anio = inAnio.length ? parseInt(inAnio) : new Date().getFullYear();
    // Primer lunes de febrero
    let inicio = new Date(anio, 1, 1);
    while (inicio.getDay() !== 1) {
      inicio.setDate(inicio.getDate() + 1);
    }

    // Ajuste: retroceder 1 día para que empiece en domingo
    inicio.setDate(inicio.getDate() - 1);

    // Último día = 31 de enero del año siguiente
    const limite = new Date(anio + 1, 0, 31);

    let contador = 1;
    while (inicio <= limite) {
      const fin = new Date(inicio);
      fin.setDate(inicio.getDate() + 6);

      semanas.push({
        semana: contador,
        inicio: inicio.toLocaleDateString('en-EN'),
        fin: fin.toLocaleDateString('en-EN')
      });
      this.cboSemanaAll.push({ key: contador, value: `Semana ${contador}` });
      inicio = new Date(fin);
      inicio.setDate(fin.getDate() + 1);
      contador++;


    }

    if (!this.arSemanaAll.length) {
      this.arSemanaAll = semanas;
    }

    return semanas;
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  radioChange(ev) {
    this.optionTipoFecha = (ev || {}).value;
    if (ev.value == 'semana' && this.cboReport == 'Comparativo') {
      this.vPlaceholder_anio_1 = "Año 1";
    } else {
      this.vPlaceholder_anio_1 = "Año";
    }
  }

  checkedChange(ev) {
    this.isComparationStores = ev;
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation(); // evita que se cierre al hacer click en el botón
    this.isVisiblePopover = !this.isVisiblePopover;
  }

  sendConsultReport(typeReport, date_1, date_2, codeStore, column, inKeyReport?) {
    let keyReport = (inKeyReport || "").length ? inKeyReport : this.codigoNumerico();
    let yearDate = new Date(date_1).getFullYear();

    let configuration = {
      f1: date_1,
      f2: date_2,
      semana: this.cboSemana,
      code: codeStore,
      column: column,
      key: keyReport,
      anio: yearDate,
      type_report: typeReport
    };

    console.log(configuration);
    this.socket.emit('reportSalesDepartament', configuration);
  }

  convertirFechaSQL(fechaStr: string): string {
    // Parsear la fecha (se asume formato M/d/yyyy o MM/dd/yyyy)
    const [mes, dia, anio] = fechaStr.split("/").map(Number);

    // Ajustar con ceros a la izquierda
    const mesStr = mes.toString().padStart(2, "0");
    const diaStr = dia.toString().padStart(2, "0");

    return `${anio}-${mesStr}-${diaStr}`;
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
