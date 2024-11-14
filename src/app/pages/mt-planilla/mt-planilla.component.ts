import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { io } from "socket.io-client";

@Component({
  selector: 'app-mt-planilla',
  templateUrl: './mt-planilla.component.html',
  styleUrls: ['./mt-planilla.component.scss'],
})
export class MtPlanillaComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  onDataView: Array<any> = [];
  vCalendar: string = "202411";
  fileName: string = "";
  text: string = "";
  isLoading: boolean = false;
  filterEmpleado: string = "";
  cboBanco: number = 0;
  cboReporte: string = "Adel.Quincena";
  displayedColumns: string[] = ['codigo', 'unidad_servicio', 'nombres', 'apellido_paterno', 'apellido_materno', 'nro_documento', 'cta_banco_haberes', 'cta_banco_cts', 'cta_interbancario', 'cta_interbancario_cts', 'adelanto_quincena'];
  dataSource = new MatTableDataSource<any>(this.onDataView);
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  };

  onListReporte: Array<any> = [
    { key: 'Adel.Quincena', value: 'Adel.Quincena' },
    { key: 'Comisiones', value: 'Comisiones' },
    { key: 'FinDM', value: 'FinDM' }
  ];

  onListBanco: Array<any> = [
    { key: 4, value: 'INTERBANK' },
    { key: 2, value: 'BBVA CONTINENTAL' }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.onDataPlanilla();
    this.socket.on('reporteQuincena', async (response) => {
      console.log(response);
      this.onDataView = [];
      this.onDataView = response.data || [];
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  async onGenTxt() {
    this.isLoading = true;
    let dataExport = "";
    let dataTemp = [];
    let data = this.onDataView || [];
    let nameTemplate = "";
    let oldName = "";
    let codigoList = [];
    this.onDataView = data;
    console.log(this.cboBanco);
    await data.filter(async (dt, i) => {
      if (!codigoList.includes(dt['CODIGO_UNID_SERVICIO'].trim())) {
        codigoList.push(dt['CODIGO_UNID_SERVICIO'].trim());
      }
    });

    if (codigoList.length) {

      await codigoList.filter(async (codigo, i) => {
        if (i <= 9) {
          dataTemp = await data.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
          dataTemp.filter(async (dt, i) => {

            let sueldo = dt['ADELANTO_QUINCENA'].split('.');
            let parseSueldo = `${sueldo[0]}${sueldo[1]}`;
            let sueldoLength = 15 - parseSueldo.length;
            let concatSueldo = "01";
            for (let i = 1; i <= sueldoLength; i++) {
              concatSueldo += '0';
            }
            concatSueldo += `${parseSueldo} `;

            let col1Length = 50 - `0201${dt.NRO_DOCUMENTO}`.length;
            let col1 = `0201${dt.NRO_DOCUMENTO}`;
            for (let i = 0; i <= col1Length; i++) {
              col1 += ' ';
            }

            let cuentaBanco = dt.BANCO == this.cboBanco ? dt.CUENTA_BANCO_HABERES : !dt.CUENTA_INTERBANCARIO.length ? 0 : dt.CUENTA_INTERBANCARIO;

            let tipoCuenta = dt.BANCO == this.cboBanco ? '09' : '99';
            let space = tipoCuenta == '99' ? `${tipoCuenta}00201   ` : `${tipoCuenta}00201`;
            let col3Length = 29 - `${space}${cuentaBanco}`.length;
            let col3 = `${space}${cuentaBanco}`;
            for (let i = 0; i <= col3Length; i++) {
              col3 += ' ';
            }

            let tipoDocumento = (dt.NRO_DOCUMENTO).trim().length == 8 ? '01' : '03';

            let col4Length = 17 - `P${tipoDocumento}${dt.NRO_DOCUMENTO}`.length;
            let col4 = `P${tipoDocumento}${dt.NRO_DOCUMENTO}`;
            for (let i = 0; i <= col4Length; i++) {
              col4 += ' ';
            }

            let col5Length = 20 - `${dt.APELLIDO_PATERNO}`.length;
            let col5 = `${this.sinDiacriticos(dt.APELLIDO_PATERNO)}`;
            for (let i = 0; i <= col5Length; i++) {
              col5 += ' ';
            }

            let col6Length = 20 - `${dt.APELLIDO_MATERNO}`.length;
            let col6 = `${this.sinDiacriticos(dt.APELLIDO_MATERNO)}`;
            for (let i = 0; i <= col6Length; i++) {
              col6 += ' ';
            }

            let col7Length = 27 - `${dt.NOMBRE_COMPLETO}`.length;
            let nombre_completo = this.sinDiacriticos(dt.NOMBRE_COMPLETO);
            let col7 = `${nombre_completo}`;
            for (let i = 0; i <= col7Length - 7; i++) {
              col7 += ' ';
            }
            this.fileName = dt['UNIDAD_SERVICIO'];
            this.text += `${col1}${concatSueldo}${col3}${col4}${col5}${col6}${col7}000000000000000 \n`;

            if (dataTemp.length - 1 == i) {
              this.dyanmicDownloadByHtmlTag();
              dataTemp = [];
              this.text = "";
              this.fileName = "";
            }
          });
        }
      });

      setTimeout(() => {
        codigoList.filter(async (codigo, i) => {
          if (i > 9 && i < 19) {
            dataTemp = await data.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
            dataTemp.filter(async (dt, i) => {

              let sueldo = dt['ADELANTO_QUINCENA'].split('.');
              let parseSueldo = `${sueldo[0]}${sueldo[1]}`;
              let sueldoLength = 15 - parseSueldo.length;
              let concatSueldo = "01";
              for (let i = 1; i <= sueldoLength; i++) {
                concatSueldo += '0';
              }
              concatSueldo += `${parseSueldo} `;

              let col1Length = 50 - `0201${dt.NRO_DOCUMENTO}`.length;
              let col1 = `0201${dt.NRO_DOCUMENTO}`;
              for (let i = 0; i <= col1Length; i++) {
                col1 += ' ';
              }

              let cuentaBanco = dt.BANCO == this.cboBanco ? dt.CUENTA_BANCO_HABERES : !dt.CUENTA_INTERBANCARIO.length ? 0 : dt.CUENTA_INTERBANCARIO;

              let tipoCuenta = dt.BANCO == this.cboBanco ? '09' : '99';
              let space = tipoCuenta == '99' ? `${tipoCuenta}00201   ` : `${tipoCuenta}00201`;
              let col3Length = 29 - `${space}${cuentaBanco}`.length;
              let col3 = `${space}${cuentaBanco}`;
              for (let i = 0; i <= col3Length; i++) {
                col3 += ' ';
              }

              let tipoDocumento = (dt.NRO_DOCUMENTO).trim().length == 8 ? '01' : '03';

              let col4Length = 17 - `P${tipoDocumento}${dt.NRO_DOCUMENTO}`.length;
              let col4 = `P${tipoDocumento}${dt.NRO_DOCUMENTO}`;
              for (let i = 0; i <= col4Length; i++) {
                col4 += ' ';
              }

              let col5Length = 20 - `${dt.APELLIDO_PATERNO}`.length;
              let col5 = `${this.sinDiacriticos(dt.APELLIDO_PATERNO)}`;
              for (let i = 0; i <= col5Length; i++) {
                col5 += ' ';
              }

              let col6Length = 20 - `${dt.APELLIDO_MATERNO}`.length;
              let col6 = `${this.sinDiacriticos(dt.APELLIDO_MATERNO)}`;
              for (let i = 0; i <= col6Length; i++) {
                col6 += ' ';
              }

              let col7Length = 27 - `${dt.NOMBRE_COMPLETO}`.length;
              let nombre_completo = this.sinDiacriticos(dt.NOMBRE_COMPLETO);
              let col7 = `${nombre_completo}`;
              for (let i = 0; i <= col7Length - 7; i++) {
                col7 += ' ';
              }
              this.fileName = dt['UNIDAD_SERVICIO'];
              this.text += `${col1}${concatSueldo}${col3}${col4}${col5}${col6}${col7}000000000000000 \n`;

              if (dataTemp.length - 1 == i) {
                this.dyanmicDownloadByHtmlTag();
                dataTemp = [];
                this.text = "";
                this.fileName = "";
              }
            });
          }
        });
      }, 3000);

      setTimeout(() => {
        codigoList.filter(async (codigo, i) => {
          if (i >= 19) {
            dataTemp = await data.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
            dataTemp.filter(async (dt, i) => {

              let sueldo = dt['ADELANTO_QUINCENA'].split('.');
              let parseSueldo = `${sueldo[0]}${sueldo[1]}`;
              let sueldoLength = 15 - parseSueldo.length;
              let concatSueldo = "01";
              for (let i = 1; i <= sueldoLength; i++) {
                concatSueldo += '0';
              }
              concatSueldo += `${parseSueldo} `;

              let col1Length = 50 - `0201${dt.NRO_DOCUMENTO}`.length;
              let col1 = `0201${dt.NRO_DOCUMENTO}`;
              for (let i = 0; i <= col1Length; i++) {
                col1 += ' ';
              }

              let cuentaBanco = dt.BANCO == this.cboBanco ? dt.CUENTA_BANCO_HABERES : !dt.CUENTA_INTERBANCARIO.length ? 0 : dt.CUENTA_INTERBANCARIO;

              let tipoCuenta = dt.BANCO == this.cboBanco ? '09' : '99';
              let space = tipoCuenta == '99' ? `${tipoCuenta}00201   ` : `${tipoCuenta}00201`;
              let col3Length = 29 - `${space}${cuentaBanco}`.length;
              let col3 = `${space}${cuentaBanco}`;
              for (let i = 0; i <= col3Length; i++) {
                col3 += ' ';
              }

              let tipoDocumento = (dt.NRO_DOCUMENTO).trim().length == 8 ? '01' : '03';

              let col4Length = 17 - `P${tipoDocumento}${dt.NRO_DOCUMENTO}`.length;
              let col4 = `P${tipoDocumento}${dt.NRO_DOCUMENTO}`;
              for (let i = 0; i <= col4Length; i++) {
                col4 += ' ';
              }

              let col5Length = 20 - `${dt.APELLIDO_PATERNO}`.length;
              let col5 = `${this.sinDiacriticos(dt.APELLIDO_PATERNO)}`;
              for (let i = 0; i <= col5Length; i++) {
                col5 += ' ';
              }

              let col6Length = 20 - `${dt.APELLIDO_MATERNO}`.length;
              let col6 = `${this.sinDiacriticos(dt.APELLIDO_MATERNO)}`;
              for (let i = 0; i <= col6Length; i++) {
                col6 += ' ';
              }

              let col7Length = 27 - `${dt.NOMBRE_COMPLETO}`.length;
              let nombre_completo = this.sinDiacriticos(dt.NOMBRE_COMPLETO);
              let col7 = `${nombre_completo}`;
              for (let i = 0; i <= col7Length - 7; i++) {
                col7 += ' ';
              }
              this.fileName = dt['UNIDAD_SERVICIO'];
              this.text += `${col1}${concatSueldo}${col3}${col4}${col5}${col6}${col7}000000000000000 \n`;

              if (dataTemp.length - 1 == i) {
                await this.dyanmicDownloadByHtmlTag();
                dataTemp = [];
                this.text = "";
                this.fileName = "";
                this.isLoading = false;
              }
            });
          }
        });
      }, 9000);

    }
  }

  onDataPlanilla() {
    let option = {
      tipo_planilla: this.cboReporte,
      date: this.vCalendar
    };

    this.socket.emit('consultaPlanilla', option);
  }

  dyanmicDownloadByHtmlTag() {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = this.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(this.text)}`);
    element.setAttribute('download', this.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  sinDiacriticos = (function () {
    let de = 'ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç',
      a = 'AAAAAEEEEIIIIOOOOUUUUNCaaaaaeeeeiiiioooouuuunc',
      re = new RegExp('[' + de + ']', 'ug');

    return texto =>
      texto.replace(
        re,
        match => a.charAt(de.indexOf(match))
      );
  })();

  onCaledar($event) {
    console.log($event);
    if ($event.isPeriodo) {
      let data = $event.value;
      this.vCalendar = `${data[0]}${data[1]}`;
      console.log(this.vCalendar);
    }

  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    this.onDataPlanilla();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
