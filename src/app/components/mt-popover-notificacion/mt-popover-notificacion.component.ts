import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mt-popover-notificacion',
  templateUrl: './mt-popover-notificacion.component.html',
  styleUrls: ['./mt-popover-notificacion.component.scss'],
})
export class MtPopoverNotificacionComponent implements OnInit {
  @Input() dataNotification: Array<any> = [];
  @Output() onClickedCallback: EventEmitter<any> = new EventEmitter();
  data: Array<any> = [];
  constructor() { }

  ngOnInit() {
    console.log(this.dataNotification);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.hasOwnProperty('dataNotification')) {


    }

  }

  OnClickedMenu() {
    this.onClickedCallback.emit("");
  }


}
