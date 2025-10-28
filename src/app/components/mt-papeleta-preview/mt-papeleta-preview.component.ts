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
  isLoading: boolean = false;
  onListTiendas: Array<any> = [];

  constructor(private service: ShareService, private store: StorageService,) {
    this.onAllStore();
  }

  ngOnInit() {

    this.perfilUser = this.store.getStore('mt-profile');
    this.userNivel = (this.perfilUser || {}).mt_nivel;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('codigoPap')) {
      this.isLoading = true;
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

  onAllStore() {
    this.service.allStores().then((stores: Array<any>) => {
      (stores || []).filter((store) => {
        this.onListTiendas.push({
          uns: (store || {}).service_unit,
          code: (store || {}).serie,
          name: (store || {}).description,
          procesar: 0,
          procesado: -1
        });
      });
    });
  }

  onSearchPap(codigo) {
    let parms = {
      url: '/recursos_humanos/pap/search/papeleta',
      body: [{ codigo_papeleta: codigo }]
    };

    this.service.post(parms).then(async (response) => {
      this.isLoading = false;
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
