import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import * as html2pdf from 'html2pdf.js';
import * as $ from 'jquery';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'mt-papeleta-preview',
  templateUrl: './mt-papeleta-preview.component.html',
  styleUrls: ['./mt-papeleta-preview.component.scss'],
})
export class MtPapeletaPreviewComponent implements OnInit {
  @Input() codigoPap: string = "";
  @Input() arCodigos: Array<any> = [];
  @Input() isUpdate: Array<any> = [];
  bodyList: Array<any> = [];
  dataPap: Array<any> = [];
  listTipoPap: Array<any> = [];
  perfilUser: any = {};
  userNivel: string = "";
  observacion: string = "";
  vFechapap: string = "";
  isMultiPap: boolean = true;
  onListTiendas: Array<any> = [
    { uns: 'BBW', code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7E', name: 'BBW LA RAMBLA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9D', name: 'VS LA RAMBLA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9B', name: 'VS PLAZA NORTE', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7C', name: 'BBW SAN MIGUEL', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9C', name: 'VS SAN MIGUEL', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7D', name: 'BBW SALAVERRY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9I', name: 'VS SALAVERRY', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9G', name: 'VS MALL DEL SUR', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9H', name: 'VS PURUCHUCO', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9M', name: 'VS ECOMMERCE', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7F', name: 'BBW ECOMMERCE', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9K', name: 'VS MEGA PLAZA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9L', name: 'VS MINKA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9F', name: 'VSFA JOCKEY FULL', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { uns: 'VS', code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { uns: 'BBW', code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];

  constructor(private service: ShareService, private store: StorageService,) { }

  ngOnInit() {

    this.perfilUser = this.store.getStore('mt-profile');
    this.userNivel = (this.perfilUser || {}).mt_nivel;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('codigoPap')) {

      await this.onListTipoPapeleta();
      this.onSearchPap(this.codigoPap);
    }

    if (changes && changes.hasOwnProperty('arCodigos')) {
      this.dataPap = [];
      await this.onListTipoPapeleta();
      this.arCodigos.filter((p) => {
        this.onSearchPap((p || {}).codigoPap);
      });

    }


  }

  onSearchPap(codigo) {
    let parms = {
      url: '/recursos_humanos/pap/search/papeleta',
      body: [{ codigo_papeleta: codigo }]
    };

    this.service.post(parms).then(async (response) => {
      
      if ((this.arCodigos || []).length) {
        this.dataPap.push(response[0]);
      } else {
        this.dataPap = [response[0]];
      }

      if (this.dataPap.length) {

        (this.dataPap || []).filter((dt, i) => {
          let tipo = this.listTipoPap.filter((tp) => tp.ID_TIPO_PAPELETA == dt.id_tipo_papeleta);
          let tienda = this.onListTiendas.find((td) => td.code == dt.codigo_tienda);
          this.dataPap[i]['uns'] = tienda.name;
          this.dataPap[i]['tipo_papeleta'] = tipo[0].DESCRIPCION;

          const ascDates = dt.horas_extras.sort((a, b) => {
            return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          });

          this.bodyList = ascDates;
          this.observacion = dt.descripcion;
        });


      }
    });
  }

  async onPdf() {
    var element: any;
    element = $('#papeleta-pdf').clone();
    var opt = {
      filename: `PAPELETA.pdf`,
      margin: [0.1, 0.1, 0.2, 0.1],
      image: {
        type: 'jpg', quality: 0.99
      },
      html2canvas: {
        dpi: 192,
        useCORS: true,
        scale: 2
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'p' }
    };

    await html2pdf().from(element[0]).set(opt).save();
  }

  async onListTipoPapeleta() {
    let parms = {
      url: '/papeleta/lista/tipo_papeleta'
    };

    await this.service.get(parms).then(async (response) => {
      const ascDates = response.sort((a, b) => {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });

      this.listTipoPap = ascDates;
    });

    return;
  }

  onUpdateFecha() {

    let parms = {
      url: '/papeleta/update/fecha',
      body: [{ fecha: this.vFechapap, id_papeleta: this.dataPap[0].id_papeleta }]
    };

    this.service.post(parms).then(async (response) => {
      this.onSearchPap(this.codigoPap);
      this.service.toastSuccess('Actualizado con exito..!!', 'Papeleta');
    });

  }

  onCaledar(ev) {
    let date = new Date(ev.value).toLocaleDateString().split('/');
    this[ev.id] = `${date[2]}-${(date[1].length == 1) ? '0' + date[1] : date[1]}-${(date[0].length == 1) ? '0' + date[0] : date[0]}`;
  }

}
