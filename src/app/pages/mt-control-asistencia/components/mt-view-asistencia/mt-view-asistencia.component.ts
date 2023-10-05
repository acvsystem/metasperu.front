import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mt-view-asistencia',
  templateUrl: './mt-view-asistencia.component.html',
  styleUrls: ['./mt-view-asistencia.component.scss'],
})
export class MtViewAsistenciaComponent implements OnInit {
  @Input() dataAsistencia: Array<any> = [];

  headList: Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.headList = [
      {
        value: 'Nombre',
      },
      {
        value: 'Nro Documento'
      },
      {
        value: 'Dia'
      },
      {
        value: 'H.Ingreso'
      },
      {
        value: 'H.Salida'
      },
      {
        value: 'Caja'
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('dataAsistencia')) {
      this.dataAsistencia = this.dataAsistencia;
      
    }

  }

}
