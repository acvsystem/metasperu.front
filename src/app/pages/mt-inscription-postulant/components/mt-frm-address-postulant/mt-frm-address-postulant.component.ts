import { Component, Input, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';

@Component({
  selector: 'mt-frm-address-postulant',
  templateUrl: './mt-frm-address-postulant.component.html',
  styleUrls: ['./mt-frm-address-postulant.component.scss'],
})
export class MtFrmAddressPostulantComponent implements OnInit {
  @Input() data: any = '';

  estadoPostulante: string = "";
  tiendaPostulante: string = "";

  optionListEstado: Array<any> = [
    { key: 'ACEPTADO', value: 'ACEPTADO' },
    { key: 'PENDIENTE', value: 'PENDIENTE' }
  ];

  optionListTiendas: Array<any> = [
    { key: 'BBW JOCKEY', value: 'BBW JOCKEY' },
    { key: 'VSBA JOCKEY', value: 'VSBA JOCKEY' },
    { key: 'AEO JOCKEY', value: 'AEO JOCKEY' },
    { key: 'AEO ASIA', value: 'AEO ASIA' },
    { key: "VSBA MALL AVENTURA", value: "VSBA MALL AVENTURA"},
    { key: "BBW MALL AVENTURA", value: "BBW MALL AVENTURA"},
    { key: 'BBW LA RAMBLA', value: 'BBW LA RAMBLA' },
    { key: 'VS LA RAMBLA', value: 'VS LA RAMBLA' },
    { key: 'VS PLAZA NORTE', value: 'VS PLAZA NORTE' },
    { key: 'BBW SAN MIGUEL', value: 'BBW SAN MIGUEL' },
    { key: 'VS SAN MIGUEL', value: 'VS SAN MIGUEL' },
    { key: 'BBW SALAVERRY', value: 'BBW SALAVERRY' },
    { key: 'VS SALAVERRY', value: 'VS SALAVERRY' },
    { key: 'VS MALL DEL SUR', value: 'VS MALL DEL SUR' },
    { key: 'VS PURUCHUCO', value: 'VS PURUCHUCO' },
    { key: 'VS ECOMMERCE', value: 'VS ECOMMERCE' },
    { key: 'BBW ECOMMERCE', value: 'BBW ECOMMERCE' },
    { key: 'AEO ECOMMERCE', value: 'AEO ECOMMERCE' },
    { key: 'VS MEGA PLAZA', value: 'VS MEGA PLAZA' },
    { key: 'VS MINKA', value: 'VS MINKA' },
    { key: 'VSFA JOCKEY FULL', value: 'VSFA JOCKEY FULL' },
    { key: 'BBW ASIA', value: 'BBW ASIA' }
  ];

  dataPaginationList: Array<any> = [];
  headList: Array<any> = [];

  constructor(private service: ShareService) { }

  ngOnInit() {
    console.log(this.data);
    this.dataPaginationList.push(this.data);
    this.headList = [
      {
        value: '#',
        isSearch: false
      },
      {
        value: 'Nombre Via',
        isSearch: false
      },
      {
        value: 'Domicilio',
        isSearch: false
      },
      {
        value: 'Nro Depart',
        isSearch: false
      },
      {
        value: 'Descripcion Manzana',
        isSearch: false
      },
      {
        value: 'Descripcion Lote',
        isSearch: false
      },
      {
        value: 'Tipo Zona',
        isSearch: false
      },
      {
        value: 'Nombre Zona',
        isSearch: false
      },
      {
        value: 'Departamento Ubi',
        isSearch: false
      },
      {
        value: 'Provincia Ubi',
        isSearch: false
      },
      {
        value: 'Distrito Ubi',
        isSearch: false
      }
    ];
  }

  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }


  onChangeEstado() {

    let parms = {
      url: '/rrhh/update/estado_postulante',
      body: {
        dni: (this.data || {}).num_documento,
        estado: this.estadoPostulante,
        tienda: this.tiendaPostulante
      }
    };

    this.service.post(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || {};
      ((this.dataPaginationList || [])[0] || {}).estado = (data || {}).ESTADO;
      ((this.dataPaginationList || [])[0] || {}).tienda = (data || {}).TIENDA;
    });
  }

}
