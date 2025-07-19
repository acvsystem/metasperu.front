
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mt-popover',
  templateUrl: './mt-popover.component.html',
  styleUrls: ['./mt-popover.component.scss'],
})
export class MtPopoverComponent implements OnInit {

  @Input() dataProfile: Array<any> = [];
  @Output() onClickedCallback: EventEmitter<any> = new EventEmitter();

  nombreUsuario: String = "";
  emailUsuario: String = "";

  constructor() { }

  ngOnInit() {
    this.nombreUsuario = this.dataProfile[0]['mt_name_1'];
    this.emailUsuario = this.dataProfile[0]['email'];
    console.log(this.dataProfile);
  }

  OnClickedMenu() {
    this.onClickedCallback.emit("");
  }

}