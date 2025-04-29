import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { ShareService } from 'src/app/services/shareService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { io } from "socket.io-client";
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

interface Shoes {
  value: string;
  name: string;
}

@Component({
  selector: 'mt-kardex-contabilidad',
  templateUrl: './mt-kardex-contabilidad.component.html',
  styleUrls: ['./mt-kardex-contabilidad.component.scss'],
})
export class MtKardexContabilidadComponent implements OnInit {
  form: FormGroup;
  vDetallado: Array<any> = [];
  cboListTienda: Array<any> = [];
  tiendasList: Array<any> = [];
  dataView: Array<any> = [];
  optionDefault: Array<any> = [];
  optionDefaultTD: Array<any> = [];
  dataViewVenc: Array<any> = [];
  displayedColumns: string[] = ['referencia', 'talla', 'color', 'descripcion', 'unid', 'precio', 'descuento', 'total', 'almacen'];
  displayedColumnsVenc: string[] = ['forma_pago', 'importe', 'medio_pago', 'estado', 'fecha_cobro'];
  cboMotivo: string = "";
  cboTipoDoc: string = "";
  cboMotivoList: Array<any> = [
    { key: '02-COMPRA', value: '02-COMPRA' },
    { key: '06-DEVOLUCIÓN', value: '06-DEVOLUCIÓN' },
    { key: '09-DONACIÓN', value: '09-DONACIÓN' },
    { key: '11-SALIDA TRASP', value: '11-SALIDA TRASP' },
    { key: '12-RETIRO', value: '12-RETIRO' },
    { key: '13-MERMAS', value: '13-MERMAS' },
    { key: '15-DESTRUCCIÓN', value: '15-DESTRUCCIÓN' },
    { key: '18-IMPORTACIÓN', value: '18-IMPORTACIÓN' },
    { key: '21-ENTRADA TRASP', value: '21-ENTRADA TRASP' },
    { key: '99-OTROS', value: '99-OTROS' }
  ];
  cboTipoDocList: Array<any> = [
    { key: '11 Registro civil', value: '11 Registro civil' },
    { key: '12 Tarjeta de identidad', value: '12 Tarjeta de identidad' },
    { key: '13 Cédula de ciudadanía', value: '13 Cédula de ciudadanía' },
    { key: '21 Tarjeta de extranjería', value: '21 Tarjeta de extranjería' },
    { key: '22 Cédula de extrajería', value: '22 Cédula de extrajería' },
    { key: '31 NIT', value: '31 NIT' },
    { key: '41 Pasaporte', value: '41 Pasaporte' },
    { key: '42 Documento de identificación extranjero', value: '42 Documento de identificación extranjero' },
    { key: '00-OTROS', value: '00-OTROS' },
    { key: '01-FACTURA', value: '01-FACTURA' },
    { key: '07-NOTA DE CREDITO', value: '07-NOTA DE CREDITO' },
    { key: '09-GUIA DE REMISION-REMITENTE', value: '09-GUIA DE REMISION-REMITENTE' },
    { key: '31-GUIA DE RENISION-TRANSPORTISTA', value: '31-GUIA DE RENISION-TRANSPORTISTA' },
    { key: '50-DECLARACIÓN UNICA DE ADUANA DUA/DAM', value: '50-DECLARACIÓN UNICA DE ADUANA DUA/DAM' }
  ];
  dataSource = new MatTableDataSource<any>(this.dataView);
  dataSourceVenc = new MatTableDataSource<any>(this.dataViewVenc);
  cboTiendaConsulting: String = "";
  vSerieDoc: String = "";
  vN: String = "";
  vNumeroDoc: String = "";
  vFechaDoc: String = "";
  vHoraDoc: String = "";
  vAlbaran: String = "";
  vDespacho: String = "";
  vContenedor: String = "";
  vTasaCambio: String = "";
  vTotalGastos: String = "";
  vFleteAcarreo: String = "";
  vRegistroSanitario: String = "";
  vNumeroSerie: String = "";
  vObservacion: String = "";
  vSize: String = "";
  vCode: String = "";
  vBruto: String = "";
  vDescuentos: String = "";
  vImponible: String = "";
  vImpuestos: String = "";
  vTBruto: String = "";
  codeTienda: String = "";
  isLoading: boolean = false;
  dataAlbaran: Array<any> = [];
  socket = io('http://38.187.8.22:3200', {
    query: { code: 'app' },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999
  });

  shoes: Shoes[] = [];

  shoesControl = new FormControl();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: ShareService) {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }

  ngOnInit() {
    this.onListTienda();
    this.socket.on('kardex:post:camposlibres:response', (refresh) => {

      let data = JSON.parse((refresh || {}).data || []);
      let index = this.dataAlbaran.findIndex((alb) => (alb || {}).cmpNumero == ((data || [])[0] || {}).cmpNumero && (alb || {}).cmpN == ((data || [])[0] || {}).cmpN && (alb || {}).cmpSerie == ((data || [])[0] || {}).cmpSerie);

      this.dataAlbaran[index]['clDespacho'] = ((data || [])[0] || {}).clDespacho;
      this.dataAlbaran[index]['clContenedor'] = ((data || [])[0] || {}).clContenedor;
      this.dataAlbaran[index]['clTasaCambio'] = ((data || [])[0] || {}).clTasaCambio;
      this.dataAlbaran[index]['clTotalGasto'] = ((data || [])[0] || {}).clTotalGasto;
      this.dataAlbaran[index]['clFleteAcarreo'] = ((data || [])[0] || {}).clFleteAcarreo;
      this.dataAlbaran[index]['clRegistroSanitario'] = ((data || [])[0] || {}).clRegistroSanitario;
      this.dataAlbaran[index]['clNSerieDocuento'] = ((data || [])[0] || {}).clNSerieDocuento;
      this.dataAlbaran[index]['clObservacion'] = ((data || [])[0] || {}).clObservacion;
      this.isLoading = false;
      this.service.toastSuccess('Registrado con exito..!!', 'Kardex');
    });

    this.socket.on('kardex:get:comprobantes:response', (listaSession) => {
      this.dataAlbaran = [];
      let data = JSON.parse((listaSession || {}).data || []);
      console.log(data);
      (data || []).filter((cbz) => {
        this.dataAlbaran.push(cbz);
      });

      this.isLoading = false;
    });

  }

  onCaledar($event) {
    if ($event.isRange) {
      this.vDetallado = [];
      let range = $event.value;
      if (range.length >= 2) {
        this.vDetallado = range;
      }
    }
  }

  onSelectAlbaran(ev) {
    console.log(ev);
    const self = this;
    self.vSerieDoc = (ev || {}).cmpSerie;
    self.vNumeroDoc = (ev || {}).cmpNumero;

    let startDayLetter = moment((ev || {}).cmpFechaAlbaran).format('YYYY-MM-DD');
    self.vFechaDoc = startDayLetter;
    self.vHoraDoc = moment((ev || {}).cmpFechaAlbaran).format('hh:mm:ss');
    self.vAlbaran = (ev || {}).cmpSuAlbaran;
    self.vBruto = (ev || {}).dtBruto;
    self.vDescuentos = (ev || {}).dtTDescuento;
    self.vImponible = (ev || {}).dtBaseImponible;
    self.vImpuestos = (ev || {}).dtImpuesto;
    self.vTBruto = (ev || {}).dtTotalBruto;

    self.vDespacho = (ev || {}).clDespacho;
    self.vContenedor = (ev || {}).clContenedor;
    self.vTasaCambio = (ev || {}).clTasaCambio;
    self.vTotalGastos = (ev || {}).clTotalGasto;
    self.vFleteAcarreo = (ev || {}).clFleteAcarreo;
    self.vRegistroSanitario = (ev || {}).clRegistroSanitario;
    self.vNumeroSerie = (ev || {}).clNSerieDocuento;
    self.vObservacion = (ev || {}).clObservacion;
    this.vN = ev.cmpN
    this.optionDefault = [{ key: (ev || {}).clMotivo, value: (ev || {}).clMotivo }];
    this.optionDefaultTD = [{ key: (ev || {}).clTipoDocumento, value: (ev || {}).clTipoDocumento }];
    this.dataSource = new MatTableDataSource(ev.detalle);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearch() {
    this.isLoading = true;
    let date = [this.vDetallado[0].replace('/', '-'), this.vDetallado[1].replace('/', '-')];
    this.vDetallado = [date[0].replace('/', '-'), date[1].replace('/', '-')];

    this.socket.emit('kardex:get:comprobantes', {
      init: date[0].replace('/', '-'),
      end: date[1].replace('/', '-'),
      code: this.vCode
    });
  }

  onSaveKardex() {
    this.isLoading = true;
    let data = {
      code: this.vCode,
      num_albaran: this.vNumeroDoc,
      num_serie: this.vSerieDoc,
      n: this.vN,
      numero_despacho: this.vDespacho,
      tasa_cambio: this.vTasaCambio,
      total_gastos: this.vTotalGastos,
      flete_acarreo: this.vFleteAcarreo,
      registro_sanitario: this.vRegistroSanitario,
      motivo: this.cboMotivo,
      tipo_documento: this.cboTipoDoc,
      numero_serie: this.vNumeroSerie,
      observacion: this.vObservacion,
      contenedor: this.vContenedor
    };

    console.log(data);
    this.socket.emit('kardex:post:camposlibres', data);
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }


  onListTienda() {
    const self = this;
    let parms = {
      url: '/security/lista/registro/tiendas'
    };

    this.service.get(parms).then((response) => {
      let tiendaList = (response || {}).data || [];
      this.cboListTienda = [];
      this.tiendasList = [];

      (tiendaList || []).filter((tienda) => {

        this.cboListTienda.push({ key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION });

        this.tiendasList.push(
          { key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION, progress: -1 });
      });
    });
  }

  async onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};

    if ((selectData || {}).selectId == "cboTiendaConsulting") {

      this.vCode = (selectData || {}).key;
    }

    this.codeTienda = (selectData || {}).key;
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";

  }

}
