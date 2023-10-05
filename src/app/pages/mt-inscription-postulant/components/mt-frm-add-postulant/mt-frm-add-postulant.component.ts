import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mt-frm-add-postulant',
  templateUrl: './mt-frm-add-postulant.component.html',
  styleUrls: ['./mt-frm-add-postulant.component.scss'],
})
export class MtFrmAddPostulantComponent implements OnInit {
  headList: Array<any> = ['Codigo', 'Documentos', 'Accion'];
  bodyList: Array<any> = [{ codigo: '01', documento: '471623968' }, { codigo: '02', documento: '88888888' }];
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
  ]

  constructor() { }

  ngOnInit() { }

  onSaveOrUpdate(ev: any) {
    
  }

  onAddDocument() {
    this.bodyList.push({ codigo: '03', documento: '471623968' });
    
  }

}
