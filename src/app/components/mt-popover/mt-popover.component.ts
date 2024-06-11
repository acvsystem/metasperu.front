
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mt-popover',
  templateUrl: './mt-popover.component.html',
  styleUrls: ['./mt-popover.component.scss'],
})
export class MtPopoverComponent implements OnInit {

  @Input() menuList: Array<any> = [];
  @Output() onClickedCallback: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  OnClickedMenu(ev) {
    this.onClickedCallback.emit(ev);
  }

}