import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { io } from "socket.io-client";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
    { key: 'FDM', value: 'FDM' },
    { key: 'CTS', value: 'CTS' }
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
      this.onDataView = [];
      this.onDataView = response.data || [];
      this.dataSource = new MatTableDataSource(this.onDataView);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
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
    this.isLoading = true;
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

  async onExcelExport() {
    const self = this;
    self.isLoading = true;
    let codigoList = [];
    let dataTemp = [];
    let dataExport = [];
    await this.onDataView.filter(async (dt, i) => {
      if (!codigoList.includes(dt['CODIGO_UNID_SERVICIO'].trim())) {
        codigoList.push(dt['CODIGO_UNID_SERVICIO'].trim());
      }
    });

    if (codigoList.length) {
      console.log(codigoList);
      await codigoList.filter(async (codigo, i) => {
        if (i <= 9) {
          let dataTemp = [];
          let dataExport = [];
          dataTemp = await this.onDataView.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
          dataTemp.filter(async (dw, i) => {

            let cuentaBanco = (dw || {}).BANCO == 2 ? ((dw || {}).CUENTA_BANCO_HABERES || "") : !((dw || {}).CUENTA_INTERBANCARIO || "").length ? '0' : ((dw || {}).CUENTA_INTERBANCARIO || "");
            this.fileName = dw['UNIDAD_SERVICIO'];
            console.log(dw.NOMBRE_COMPLETO, cuentaBanco || 0);
            dataExport.push({
              DOI_Tipo: dw.NRO_DOCUMENTO.trim().length == 8 ? 'L' : 'E',
              DOI_Numero: ((dw || {}).NRO_DOCUMENTO || 0).trim(),
              Tipo_Abono: dw.BANCO == 2 ? 'P' : 'I',
              N_Cuentas_abonar: cuentaBanco || '0',
              Nombre_Beneficiario: `${dw.APELLIDO_PATERNO} ${dw.APELLIDO_MATERNO} ${dw.NOMBRE_COMPLETO}`,
              Importe_Abonar: parseInt(dw.ADELANTO_QUINCENA)
            });

            if (dataTemp.length - 1 == i) {
              console.log(this.fileName, dataExport);
              this.exportAsExcelFile(dataExport, this.fileName);
              dataTemp = [];
              this.text = "";
              this.fileName = "";
            }


          });
        }
      });

      setTimeout(async () => {
        await codigoList.filter(async (codigo, i) => {
          if (i > 9 && i < 19) {
            let dataTemp = [];
            let dataExport = [];
            dataTemp = await this.onDataView.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
            dataTemp.filter(async (dw, i) => {

              let cuentaBanco = (dw || {}).BANCO == 2 ? ((dw || {}).CUENTA_BANCO_HABERES || "") : !((dw || {}).CUENTA_INTERBANCARIO || "").length ? '0' : ((dw || {}).CUENTA_INTERBANCARIO || "");
              this.fileName = dw['UNIDAD_SERVICIO'];
              console.log(dw.NOMBRE_COMPLETO, cuentaBanco || 0);
              dataExport.push({
                DOI_Tipo: dw.NRO_DOCUMENTO.trim().length == 8 ? 'L' : 'E',
                DOI_Numero: ((dw || {}).NRO_DOCUMENTO || 0).trim(),
                Tipo_Abono: dw.BANCO == 2 ? 'P' : 'I',
                N_Cuentas_abonar: cuentaBanco || '0',
                Nombre_Beneficiario: `${dw.APELLIDO_PATERNO} ${dw.APELLIDO_MATERNO} ${dw.NOMBRE_COMPLETO}`,
                Importe_Abonar: parseInt(dw.ADELANTO_QUINCENA)
              });

              if (dataTemp.length - 1 == i) {
                console.log(this.fileName, dataExport);
                this.exportAsExcelFile(dataExport, this.fileName);
                dataTemp = [];
                this.text = "";
                this.fileName = "";
              }


            });
          }
        });
      }, 3000);

      setTimeout(async () => {
        await codigoList.filter(async (codigo, i) => {
          if (i >= 19) {
            let dataTemp = [];
            let dataExport = [];
            dataTemp = await this.onDataView.filter((data) => data['CODIGO_UNID_SERVICIO'].trim() == codigo);
            dataTemp.filter(async (dw, i) => {

              let cuentaBanco = (dw || {}).BANCO == 2 ? ((dw || {}).CUENTA_BANCO_HABERES || "") : !((dw || {}).CUENTA_INTERBANCARIO || "").length ? '0' : ((dw || {}).CUENTA_INTERBANCARIO || "");
              this.fileName = dw['UNIDAD_SERVICIO'];
              dataExport.push({
                DOI_Tipo: dw.NRO_DOCUMENTO.trim().length == 8 ? 'L' : 'E',
                DOI_Numero: ((dw || {}).NRO_DOCUMENTO || 0).trim(),
                Tipo_Abono: dw.BANCO == 2 ? 'P' : 'I',
                N_Cuentas_abonar: cuentaBanco || '0',
                Nombre_Beneficiario: `${dw.APELLIDO_PATERNO} ${dw.APELLIDO_MATERNO} ${dw.NOMBRE_COMPLETO}`,
                Importe_Abonar: parseInt(dw.ADELANTO_QUINCENA)
              });

              if (dataTemp.length - 1 == i) {
                console.log(this.fileName, dataExport);
                this.exportAsExcelFile(dataExport, this.fileName);
                dataTemp = [];
                this.text = "";
                this.fileName = "";
              }


            });
          }
        });
      }, 9000);
    }

  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const self = this;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    self.isLoading = false;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
