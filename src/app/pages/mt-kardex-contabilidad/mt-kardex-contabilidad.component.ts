import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { ShareService } from 'src/app/services/shareService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { io } from "socket.io-client";

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
  vSerieDoc: String = "9N1A";
  vNumeroDoc: String = "";
  vFechaDoc: String = "";
  vHoraDoc: String = "";
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

  constructor(private service: ShareService) {
    this.form = new FormGroup({
      clothes: this.shoesControl,
    });
  }

  ngOnInit() {
    console.log(this.shoesControl);
    this.onListTienda();
    this.socket.emit('kardex:get:comprobantes', {
      init: '2025-04-01',
      end: '2025-04-23',
      code: '9F'
    });

    this.socket.on('kardex:get:comprobantes:response', (listaSession) => {
      let data = JSON.parse((listaSession || {}).data || []);
      (data || []).filter((cbz) => {
        let indexEx = (this.dataAlbaran || []).findIndex((alb) => alb.cmpNumero == cbz.cmpNumero);
        if (indexEx == -1) {
          this.dataAlbaran.push(cbz);
        } else {
          this.dataAlbaran[indexEx]['value'] = cbz.cmpNumero;
          this.dataAlbaran[indexEx]['name'] = `${cbz.cmpSerie} | ${cbz.cmpNumero} | ${cbz.cmpSuAlbaran}`;
          (((this.dataAlbaran || [])[indexEx] || {})['detalle'] || []).push(cbz);
        }
      });

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
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

}
