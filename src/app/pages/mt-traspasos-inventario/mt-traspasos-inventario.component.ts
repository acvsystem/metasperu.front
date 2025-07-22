import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { io } from "socket.io-client";
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MtModalComentarioComponent } from '../../components/mt-modal-comentario/mt-modal-comentario.component';
import { GlobalConstants } from '../../const/globalConstants';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'mt-traspasos-inventario',
  templateUrl: './mt-traspasos-inventario.component.html',
  styleUrls: ['./mt-traspasos-inventario.component.scss'],
})
export class MtTraspasosInventarioComponent implements OnInit {
  socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  barcode: string = "";
  filterProducto: string = "";
  udsOrigen: string = "";
  udsDestino: string = "";
  selectedUdsOrigen: string = "";
  undServicio: string = "";
  vAlmacenOrigen: string = "";
  vAlmacenDestino: string = "";
  vTPOrigen: string = "";
  vTPDestino: string = "";
  vCode: string = "";
  isOnlineTiendaOrigen: boolean = false;
  isOnlineTiendaDestino: boolean = false;
  isDisabledSelect: boolean = false;
  lsDataTiendas: Array<any> = [];
  cboUnidadServicioOrigen: Array<any> = [];
  cboUnidadServicioDestino: Array<any> = [];
  onDataView: Array<any> = [];
  parsedData: Array<any> = [];
  conxOnline: Array<any> = [];
  optionDefault: Array<any> = [];
  onListMarcas: Array<any> = [
    { key: 'VS', value: 'VICTORIA SECRET' },
    { key: 'BBW', value: 'BATH AND BODY WORKS' }
  ];
  isDiferencia: boolean = false;
  readonly dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<any>(this.onDataView);
  displayedColumns: string[] = ['codigoBarras', 'codigoArticulo', 'descripcion', 'talla', 'color', 'stock', 'solicitado', 'estado', 'accion'];

  constructor(private service: ShareService, private store: StorageService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.onVerify();
    this.onListaTiendas();
    this.socket.on('inventario:get:barcode:response', (inventario) => {
      let dataInventario = JSON.parse(((inventario || {}).data || []));

      let indexEx = this.onDataView.findIndex((dt) => dt.cCodigoBarra == dataInventario[0].cCodigoBarra);
      if (indexEx == -1) {
        let indexPD = this.parsedData.findIndex((dtp) => dtp[0] == dataInventario[0].cCodigoBarra);

        if (indexPD != -1) {
          dataInventario[0]['cSolicitado'] = this.parsedData[indexPD][1];
          this.onDataView.push(dataInventario[0]);
        }

        this.dataSource = new MatTableDataSource(this.onDataView);
      } else {

        let indexPD = this.parsedData.findIndex((dtp) => dtp[0] == dataInventario[0].cCodigoBarra);
        if (indexPD != -1) {
          this.onDataView[indexEx]['cStock'] = dataInventario[0].cStock;
          this.onDataView[indexEx]['cSolicitado'] = this.parsedData[indexPD][1];
        }
      }

    });

    this.socket.on('comprobantes:get:response', (listaSession) => {
      console.log(listaSession);
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

  }

  onVerify() { // CONSULTA DE TIENDAS CONECTADAS
    this.socket.emit('comprobantes:get', 'angular');
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'undServicio') {
      this.cboUnidadServicioOrigen = [];
      // this.cboUnidadServicioDestino = [];
      (this.lsDataTiendas || []).filter((tienda) => {
        if ((tienda || "").UNID_SERVICIO == this.undServicio) {
          this.cboUnidadServicioOrigen.push({ key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION });
          // this.cboUnidadServicioDestino.push({ key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION });
        }
      });
    }

    if (index == 'udsOrigen') {
      this.cboUnidadServicioDestino = [];
      let selectedTienda = (this.lsDataTiendas || []).find((dt) => dt.SERIE_TIENDA == this.udsOrigen);
      console.log(selectedTienda);
      this.vAlmacenOrigen = (selectedTienda || {}).COD_ALMACEN;
      this.vTPOrigen = (selectedTienda || {}).TIPO_TIENDA;
      this.cboUnidadServicioDestino = this.cboUnidadServicioOrigen.filter((tdo) => tdo.key != this.udsOrigen);

      if (this.vAlmacenOrigen == this.vAlmacenDestino) {
        this.optionDefault = [{ key: "", value: "" }];
        this.udsDestino = "";
        this.isOnlineTiendaDestino = false;
      }
    }

    if (index == 'udsDestino') {
      let selectedTienda = (this.lsDataTiendas || []).find((dt) => dt.SERIE_TIENDA == this.udsDestino);
      this.vAlmacenDestino = (selectedTienda || {}).COD_ALMACEN;
      this.vTPDestino = (selectedTienda || {}).TIPO_TIENDA;
    }

    if ((selectData || {}).selectId == "udsOrigen") {
      this.vCode = (selectData || {}).key;
      let storeConxOnline = this.store.getStore('conx_online');
      let index = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (index > -1) {
        this.isOnlineTiendaOrigen = true;
      } else {
        this.isOnlineTiendaOrigen = false;
      }
    }

    if ((selectData || {}).selectId == "udsDestino") {
      this.vCode = (selectData || {}).key;
      let storeConxOnline = this.store.getStore('conx_online');
      let index = storeConxOnline.findIndex((codeCnx) => codeCnx == (selectData || {}).key);
      if (index > -1) {
        this.isOnlineTiendaDestino = true;
      } else {
        this.isOnlineTiendaDestino = false;
      }
    }

  }


  onAlmacenOrigen() {

  }

  onNewTraspaso() {
    this.router.navigate(['/traspaso_inventario', { timestamp: new Date().getTime() }]);
  }



  onFileSelected(event: any): void {
    const self = this;

    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'xlsx') {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.SheetNames[0];
        let dataJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
        (dataJson || []).filter((dtj, i) => {
          if (i > 0) {
            this.parsedData.push(dtj);
          }
        });
        self.isDisabledSelect = true;
        this.onConsultarStock(this.parsedData);
      };
      reader.readAsArrayBuffer(file);
    }

    if (fileExt === 'xml') {
      reader.onload = (e: any) => {
        const xmlText = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        this.parsedData = this.xmlToJson(xmlDoc);

      };
      reader.readAsText(file);
    }
  }

  // Función recursiva para convertir XML a JSON
  xmlToJson(xml: Node): any {
    const obj: any = {};
    if (xml.nodeType === 1 && xml.hasChildNodes()) {
      Array.from(xml.childNodes).forEach((child: any) => {
        const childName = child.nodeName;
        if (child.nodeType === 1) {
          if (!obj[childName]) {
            obj[childName] = this.xmlToJson(child);
          } else {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(this.xmlToJson(child));
          }
        }
      });
    } else if (xml.nodeType === 3) {
      return xml.nodeValue?.trim();
    }
    return obj;
  }

  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";

    if ((inputData || {}).value.length > 11) {
      let indexPD = this.parsedData.findIndex((dtp) => dtp == (inputData || {}).value || dtp[0] == (inputData || {}).value);
      if (indexPD == -1) {
        this.parsedData.push((inputData || {}).value);
        this.onModalStock();
      } else {
        if (this.parsedData[indexPD].length == 2) {
          this.onModalStock();
        }
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim();

  }

  onModalStock() {
    const dialogRef = this.dialog.open(MtModalComentarioComponent, {
      data: { comentario: "", isStock: true },
      width: '100px'

    });

    dialogRef.afterClosed().subscribe(result => {
      if ((result || "").length) {
        let indexPD = this.parsedData.findIndex((dtp) => dtp == this.barcode || dtp[0] == this.barcode);
        this.parsedData[indexPD] = [this.barcode, result];
        this.onConsultarStock(this.parsedData);
      } else {
        this.onEliminarProducto(this.barcode);
      }
    });
  }



  onListaTiendas() {
    const self = this;
    let parms = {
      url: '/security/lista/registro/tiendas'
    };

    this.service.get(parms).then((response) => {
      this.lsDataTiendas = (response || {}).data || [];
    });
  }

  onInventarioOne(codigoTienda, barcode, almOrgine) {

    let configuracion = {
      codigoTienda: codigoTienda,
      origen: almOrgine,
      barcode: barcode
    }

    this.socket.emit('inventario:get:barcode', configuracion);
  }


  onGenerarTxt() {
    let isDiferencia = false;
    if (this.onDataView.length) {
      this.onDataView.filter((dt, i) => {
        if (dt.cSolicitado > dt.cStock) {
          isDiferencia = true;
        }

        if (this.onDataView.length - 1 == i) {
          if (this.vAlmacenOrigen.length && this.vAlmacenDestino.length && dt.cCodigoArticulo.toString().length && dt.cColor.length && dt.cTalla.length && dt.cSolicitado.toString().length) {
            if (isDiferencia) {
              this.service.toastError('Tienes stock en negativo..!!', 'Traspasos');
            } else {
              let contenido = ``;

              this.onDataView.filter((dt) => {
                contenido += `${this.vAlmacenOrigen}|${this.vAlmacenDestino}|${dt.cCodigoArticulo}|${dt.cColor}|${dt.cTalla}|${dt.cSolicitado}|\n`;
              });

              let nmCarpeta = this.onVerificarTipoTienda();
              let min = 1000;
              let max = 99000;
              let idFile = Math.floor(Math.random() * (max - min + 1) + min);

              const blob = new Blob([contenido], { type: 'text/plain' });
              const archivo = new File([blob], `traspaso_stock_${idFile}.txt`, { type: 'text/plain' });
              const formData = new FormData();

              formData.append('file', archivo);

              formData.append('ftpDirectorio', nmCarpeta);

              this.http.post(`${GlobalConstants.backendServer}/upload/traspasos`, formData)
                .subscribe({
                  next: res => console.log('Subido con éxito'),
                  error: err => console.error('Error', err)
                });



              const enlace = document.createElement('a');
              enlace.href = URL.createObjectURL(blob);
              enlace.download = `traspaso_stock_${idFile}.txt`;
              enlace.click();

              URL.revokeObjectURL(enlace.href);
            }
          } else {
            this.service.toastError('Faltan datos requeridos para generar el txt..!!', 'Traspasos');
          }
        }
      });
    } else {
      this.service.toastError('Faltan datos requeridos para generar el txt..!!', 'Traspasos');
    }

  }

  onVerificarTipoTienda(): string {
    let tipoTienda = "";

    if ((this.vTPOrigen == 'VSBA' && this.vTPDestino == 'VSBA')) {
      tipoTienda = 'VSBA';
    }

    if ((this.vTPOrigen == 'VSBA' && this.vTPDestino == 'VSFA')) {
      tipoTienda = 'VSBA_VSFA';
    }

    if ((this.vTPOrigen == 'VSFA' && this.vTPDestino == 'VSBA')) {
      tipoTienda = 'VSFA_VSBA';
    }

    if (this.vTPOrigen == 'BBW' && this.vTPDestino == 'BBW') {
      tipoTienda = 'BBW';
    }

    return tipoTienda;
  }

  onConsultarStock(dataConsultar) {
    (dataConsultar || []).filter((dt, i) => {
      this.onInventarioOne(this.udsOrigen, String(dt[0]), this.vAlmacenOrigen);
    });
  }


  onEliminarProducto(barcode) {
    let index = this.onDataView.findIndex((dt) => dt['cCodigoBarra'] == barcode);
    let indexPD = this.parsedData.findIndex((dt) => dt[0] == barcode);
    this.onDataView.splice(index, 1);
    this.parsedData.splice(indexPD, 1);
    this.dataSource = new MatTableDataSource(this.onDataView);
  }



}
