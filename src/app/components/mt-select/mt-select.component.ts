import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mt-select',
  templateUrl: './mt-select.component.html',
  styleUrls: ['./mt-select.component.scss'],
})
export class MtSelectComponent implements OnInit {

  @Input() optionList = [];
  @Input() placeHolder:string = "Seleccione su opcion";
  activeSelect: boolean = false;

  optionSelected: any = {};
  nameOptionSelected: string = "";

  constructor() { }

  ngOnInit() {
  }

  onSelectedOption(ev) {
    this.nameOptionSelected = (ev || {}).value;
    this.optionSelected = {
      key: (ev || {}).key,
      value: (ev || {}).value
    };
    this.activeSelect = false;
  }

}
