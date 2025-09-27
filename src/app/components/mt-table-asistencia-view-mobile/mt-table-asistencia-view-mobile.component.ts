import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mt-table-asistencia-view-mobile',
  templateUrl: './mt-table-asistencia-view-mobile.component.html',
  styleUrls: ['./mt-table-asistencia-view-mobile.component.scss'],
})
export class MtTableAsistenciaViewMobileComponent implements OnInit {

  @Input() data: Array<any> = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('data')) {
      console.log(this.data);
    }
  }

}
