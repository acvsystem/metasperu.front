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
  dataViewVenc: Array<any> = [];
  displayedColumns: string[] = ['referencia', 'talla', 'color', 'descripcion', 'unid', 'precio', 'descuento', 'total', 'almacen'];
  displayedColumnsVenc: string[] = ['forma_pago', 'importe', 'medio_pago', 'estado', 'fecha_cobro'];
  dataSource = new MatTableDataSource<any>(this.dataView);
  dataSourceVenc = new MatTableDataSource<any>(this.dataViewVenc);
  cboTiendaConsulting: String = "";
  vSerieDoc: String = "";
  vNumeroDoc: String = "";
  vFechaDoc: String = "";
  vHoraDoc: String = "";
  vAlbaran: String = "";
  vBruto: number = 0;
  vDescuentos: number = 0;
  vImponible: number = 0;
  vImpuestos: number = 0;
  vTBruto: number = 0;
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
    console.log(this.shoesControl);
    this.onListTienda();
    this.socket.on('kardex:get:comprobantes:response', (listaSession) => {
      let data = JSON.parse((listaSession || {}).data || []);
      (data || []).filter((cbz) => {

        let indexEx = (this.dataAlbaran || []).findIndex((alb) => alb.cmpNumero == cbz.cmpNumero && alb.cmpSerie == cbz.cmpSerie);

        if (indexEx == -1) {
          (cbz['detalle'] || []).push(cbz);
          this.dataAlbaran.push(cbz);
        } else {
          this.dataAlbaran[indexEx]['value'] = cbz.cmpNumero;
          this.dataAlbaran[indexEx]['name'] = `${cbz.cmpSerie} | ${cbz.cmpNumero} | ${cbz.cmpSuAlbaran}`;
          (((this.dataAlbaran || [])[indexEx] || {})['detalle'] || []).push(cbz);
        }
      });
      this.isLoading = false;
      console.log(this.dataAlbaran);
    });

  }

  onCaledar($event) {
    console.log("onCaledar", $event);
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
      code: this.codeTienda
    });
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
    this.codeTienda = (selectData || {}).key;
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

}
