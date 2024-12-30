import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import * as html2pdf from 'html2pdf.js';
import * as $ from 'jquery';

@Component({
  selector: 'mt-papeleta-preview',
  templateUrl: './mt-papeleta-preview.component.html',
  styleUrls: ['./mt-papeleta-preview.component.scss'],
})
export class MtPapeletaPreviewComponent implements OnInit {
  @Input() codigoPap: string = "";
  bodyList: Array<any> = [];
  dataPap: Array<any> = [];
  listTipoPap: Array<any> = [];
  observacion: string = "";
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

  constructor(private service: ShareService) { }

  ngOnInit() {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('codigoPap')) {
      console.log(this.codigoPap);
      await this.onListTipoPapeleta();
      this.onSearchPap(this.codigoPap);
    }
  }

  onSearchPap(codigo) {
    let parms = {
      url: '/recursos_humanos/pap/search/papeleta',
      body: [{ codigo_papeleta: codigo }]
    };

    this.service.post(parms).then(async (response) => {
      this.dataPap = response;

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
          this.observacion = dt.observacion;
        });


      }
    });
  }

  async onPdf() {
    var element: any;
    element = $('#content-pdf').clone();
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
      jsPDF: { unit: 'in', format: 'letter', orientation: 'l' }
    };
    console.log(element);
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
}
