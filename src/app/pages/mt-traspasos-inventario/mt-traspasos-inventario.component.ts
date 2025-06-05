import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { io } from "socket.io-client";
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'mt-traspasos-inventario',
  templateUrl: './mt-traspasos-inventario.component.html',
  styleUrls: ['./mt-traspasos-inventario.component.scss'],
})
export class MtTraspasosInventarioComponent implements OnInit {
  socket = io('http://161.132.94.174:3200', { query: { code: 'app' } });
  barcode: string = "";
  filterProducto: string = "";
  udsOrigen: string = "";
  udsDestino: string = "";
  selectedUdsOrigen: string = "";
  vAlmacenOrigen: string = "";
  vAlmacenDestino: string = "";
  isOnlineTienda: boolean = false;
  lsDataTiendas: Array<any> = [];
  cboUnidadServicio: Array<any> = [];
  onDataView: Array<any> = [];
  isDiferencia: boolean = false;
  dataSource = new MatTableDataSource<any>(this.onDataView);
  displayedColumns: string[] = ['codigoBarras', 'codigoArticulo', 'descripcion', 'talla', 'color', 'stock', 'solicitado', 'estado', 'accion'];

  constructor(private service: ShareService, private store: StorageService, private http: HttpClient) { }

  ngOnInit() {
    this.onListaTiendas();
    this.socket.on('inventario:get:barcode:response', (inventario) => {
      let dataInventario = JSON.parse(((inventario || {}).data || []));

      let indexEx = this.onDataView.findIndex((dt) => dt.cCodigoBarra == dataInventario[0].cCodigoBarra);
      if (indexEx == -1) {
        let indexPD = this.parsedData.findIndex((dtp) => dtp[0] == dataInventario[0].cCodigoBarra && dtp[1] <= dataInventario[0].cStock);
        if (indexPD != -1) {
          dataInventario[0]['cSolicitado'] = this.parsedData[indexPD][1];
          this.onDataView.push(dataInventario[0]);
        }

        this.dataSource = new MatTableDataSource(this.onDataView);
      } else {
        let indexPD = this.parsedData.findIndex((dtp) => dtp[0] == dataInventario[0].cCodigoBarra && dtp[1] <= dataInventario[0].cStock);
        if (indexPD != -1) {
          this.onDataView[indexEx]['cStock'] = dataInventario[0].cStock;
          this.onDataView[indexEx]['cSolicitado'] = this.parsedData[indexPD][1];
        }
      }
    });

  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'udsOrigen') {
      let selectedTienda = (this.lsDataTiendas || []).find((dt) => dt.SERIE_TIENDA == this.udsOrigen);
      this.vAlmacenOrigen = (selectedTienda || {}).COD_ALMACEN;
      //this.onProcessPetition((selectData || {}).key);
    }

    if (index == 'udsDestino') {
      let selectedTienda = (this.lsDataTiendas || []).find((dt) => dt.SERIE_TIENDA == this.udsDestino);
      this.vAlmacenDestino = (selectedTienda || {}).COD_ALMACEN;
    }

  }


  onAlmacenOrigen() {

  }

  parsedData: any;

  onFileSelected(event: any): void {
    console.log(event);
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'xlsx') {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.SheetNames[0];
        this.parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
        console.log(this.parsedData);
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
    if (index == 'barcode' && this[index].length > 11) {
      this.onInventarioOne(this.udsOrigen, this.barcode, this.vAlmacenOrigen);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onListaTiendas() {
    const self = this;
    let parms = {
      url: '/security/lista/registro/tiendas'
    };

    this.service.get(parms).then((response) => {
      this.lsDataTiendas = (response || {}).data || [];
      this.cboUnidadServicio = [];
      //this.tiendasList = [];

      (this.lsDataTiendas || []).filter((tienda) => {

        this.cboUnidadServicio.push({ key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION });

        /*this.tiendasList.push(
          { key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION, progress: -1 });*/
      });
    });
  }

  onInventarioOne(codigoTienda, barcode, almOrgine) {

    let configuracion = {
      codigoTienda: codigoTienda,
      origen: almOrgine,
      barcode: barcode
    }

    console.log(configuracion);

    this.socket.emit('inventario:get:barcode', configuracion);
  }


  onGenerarTxt() {
    let isDiferencia = false;
    this.onDataView.filter((dt, i) => {
      if (dt.cSolicitado > dt.cStock) {
        isDiferencia = true;
      }

      if (this.onDataView.length - 1 == i) {
        if (isDiferencia) {
          this.service.toastError('Tienes stock en negativo..!!', 'Traspasos');
        } else {
          let contenido = ``;

          this.onDataView.filter((dt) => {
            contenido += `${this.vAlmacenOrigen}|${this.vAlmacenDestino}|${dt.cCodigoArticulo}|${dt.cColor}|${dt.cTalla}|${dt.cSolicitado}|\n`;
          });

          const blob = new Blob([contenido], { type: 'text/plain' });
          const archivo = new File([blob], 'traspaso_stock.txt', { type: 'text/plain' });
          const formData = new FormData();
          formData.append('file', archivo);

          this.http.post('http://161.132.94.174:3200/upload/traspasos', formData)
            .subscribe({
              next: res => console.log('Subido con éxito'),
              error: err => console.error('Error', err)
            });


          const enlace = document.createElement('a');
          enlace.href = URL.createObjectURL(blob);
          enlace.download = 'traspaso_stock.txt';
          enlace.click();

          URL.revokeObjectURL(enlace.href);
        }
      }
    });
  }

  onConsultarStock(dataConsultar) {
    (dataConsultar || []).filter((dt, i) => {
      this.onInventarioOne(this.udsOrigen, String(dt[0]), this.vAlmacenOrigen);
    });
  }



}
