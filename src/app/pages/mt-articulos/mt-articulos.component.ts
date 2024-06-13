import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";

@Component({
  selector: 'app-mt-articulos',
  templateUrl: './mt-articulos.component.html',
  styleUrls: ['./mt-articulos.component.scss'],
})
export class MtArticulosComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });

  headList = ['Preferencia', 'Codigo Barra', 'Descripcion', 'Departamento', 'Seccion', 'Familia', 'SubFamilia', 'Talla', 'Color', 'BBW JK', 'VS ARQ', 'BBW ARQ', 'BBW RAMB', 'VS RAMB', 'VS PN', 'BBW SM', 'VS SM', 'BBW SLV', 'VS SLV', 'VS MSUR', 'VS PURU', 'VS ECOM', 'BW ECOM', 'VS MGP', 'VS MINKA', 'VSFA JK', 'BBW ASIA'];

  onReporteList: Array<any> = [];

  onDataView: Array<any> = [];
  onListPagination: Array<any> = [];
  vPageActualTable: number = 1;
  vPageAnteriorTable: number = 0;
  vNumPaginas: number = 0;

  constructor() { }

  ngOnInit() {
    this.onReporteList = [
      {
        "cCodigoTienda": "9F",
        "cPreferencia": "M0001484",
        "cCodigoBarra": "8000756",
        "cDescripcion": "Traffic Counter COMPLETO Vision II Peopl",
        "cDepartamento": "MUEBLES",
        "cSeccion": "SUPPLIES",
        "cFamilia": "INGRESOS",
        "cSubfamilia": "SUPPLIES",
        "cTalla": ".",
        "cColor": ".",
        "bbw_jockey": 0,
        "vs_m_aventura": 0,
        "bbw_m_aventura": 0,
        "bbw_rambla": 0,
        "vs_rambla": 0,
        "vs_p_norte": 0,
        "bbw_s_miguel": 0,
        "vs_s_miguel": 0,
        "bbw_salaverry": 0,
        "vs_salaverry": 0,
        "vs_m_sur": 0,
        "vs_puruchuco": 0,
        "vs_ecom": 0,
        "bbw_ecom": 0,
        "vs_m_plaza": 0,
        "vs_minka": 0,
        "vs_full": 0,
        "bbw_asia": 0
      },
      
    ];

    this.onPaginator();
    this.onViewDataTable(this.vPageAnteriorTable, this.vPageActualTable);

    /*
        this.socket.emit('comunicationStock', 'angular');
    
        this.socket.on('dataStock', (stock) => {
          console.log(stock);
        });*/
  }

  onViewDataTable(pageAnt, pageAct) {
    const self = this;
    self.onDataView = [];
    if (this.onReporteList.length < 10) {
      this.onDataView = this.onReporteList;
    } else {
      (this.onReporteList || []).filter((data, i) => {
        if (pageAct > 1) {
          if (i > (pageAnt * 10 - 1) && i <= (pageAct * 10 - 1)) {
            self.onDataView.push(data);
          }
        } else {
          if (i <= (pageAct * 10 - 1)) {
            self.onDataView.push(data);
          }
        }
      });
    }

    self.vPageAnteriorTable = pageAnt;
    self.vPageActualTable = pageAct;
  }

  onViewPrevius() {
    console.log(this.vPageAnteriorTable - 1, this.vPageActualTable - 1);
    this.onViewDataTable(this.vPageAnteriorTable - 1, this.vPageActualTable - 1);
  }

  onViewNext() {
    this.onViewDataTable(this.vPageAnteriorTable + 1, this.vPageActualTable + 1);
  }

  onPaginator() {
    if (this.onReporteList.length >= 5) {
      for (let i = 1; i <= Math.round(this.onReporteList.length / 10); i++) {
        this.onListPagination.push({
          pAnterior: i - 1,
          pActual: i
        });
      }
    } else {
      this.onListPagination.push({
        pAnterior: 0,
        pActual: 1
      });
    }

  }

}
