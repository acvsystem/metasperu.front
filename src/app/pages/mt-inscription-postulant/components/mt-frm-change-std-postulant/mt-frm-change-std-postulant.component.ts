import { Component, Input, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';

@Component({
  selector: 'mt-frm-change-std-postulant',
  templateUrl: './mt-frm-change-std-postulant.component.html',
  styleUrls: ['./mt-frm-change-std-postulant.component.scss'],
})
export class MtFrmChangeStdPostulantComponent implements OnInit {
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
    this.dataPaginationList.push(this.data);
    this.headList = [
      {
        value: '#',
        isSearch: false
      },
      {
        value: 'Nombre',
        isSearch: false,
        propSearch: [{
          input: true
        }]
      },
      {
        value: 'Tipo Documento',
        isSearch: false
      },
      {
        value: 'Documento',
        isSearch: false
      },
      {
        value: 'Tienda',
        isSearch: false
      },
      {
        value: 'Estado',
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
