import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '@metasperu/components/mt-modal-content/mt-modal-content.component';

@Component({
  selector: 'app-mt-inscription-postulant',
  templateUrl: './mt-inscription-postulant.component.html',
  styleUrls: ['./mt-inscription-postulant.component.scss'],
})
export class MtInscriptionPostulantComponent implements OnInit {

  headList: Array<any> = [];
  bodyList: Array<any> = [];
  actionButton: boolean = true;
  buttonOptionList: Array<any> = [
    {
      text: 'Update',
      type: 'crud',
      fn: 'update',
      options: [
        { value: 'Update', fn: 'update' },
        { value: 'Delete' }
      ]
    }
  ];

  isAuth: boolean = false;
  isPostulant: boolean = true;

  constructor(private sanitized: DomSanitizer, public modalCtrl: ModalController) { }

  ngOnInit() {
    this.headList = ['Codigo', 'Nombre', 'TAV', 'Apellido Paterno', 'Apellido Materno', 'Tipo Documento', 'Documento', 'Accion']
    this.bodyList = [
      { codigo: 'ins01', Nombre: "test", Tav: 'TAV', Apellido_pa: 'Apellido Paterno', Apellido_ma: 'Apellido Materno', Tipo_doc: 'Tipo Documento', Numero_doc: 'Documento' },
      { codigo: 'ins02', Nombre: "test2", Tav: 'TAV', Apellido_pa: 'Apellido Paterno', Apellido_ma: 'Apellido Materno', Tipo_doc: 'Tipo Documento', Numero_doc: 'Documento' }

    ]
  }

  onSaveOrUpdate(ev: any) {

  }

  async openModalAddPostulant() {

    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addPostulant',
        title: 'Ingreso a inscripcion',
        bodyContent: 'mt-frm-add-postulant'
      },
      cssClass: 'mt-modal'
    });

    modal.present();
  }

  async openModalGenerateLink() {

    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'generateLink',
        title: 'Generar URL inscripcion',
        bodyContent: 'mt-frm-generate-link'
      },
      cssClass: 'mt-modal'
    });

    modal.present();
  }

}
