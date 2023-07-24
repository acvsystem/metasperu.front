import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mt-select',
  templateUrl: './mt-select.component.html',
  styleUrls: ['./mt-select.component.scss'],
})
export class MtSelectComponent implements OnInit {
  @Input() id = "";
  @Input() enableSearchInput: boolean = false;
  @Input() optionList = [];
  @Input() placeHolder: string = "Seleccione su opcion";
  @Input() isRequired: boolean = false;
  @Input() selectOption: boolean = false;
  @Output() changeSelected: EventEmitter<any> = new EventEmitter();

  activeSelect: boolean = false;
  sboSearch: string = "";
  optionSelected: any = {};
  nameOptionSelected: string = "";
  originalOptionList = [];

  constructor() {
    const self = this;
    /* document.body.addEventListener("click", function (evt) {
       if (self.activeSelect) {
         self.activeSelect = false;
       }
     });*/
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('optionList')) {
      this.originalOptionList = [...this.optionList];
    }

    if (changes && changes.hasOwnProperty('selectOption')) {
      this.onSelectedOption(this.selectOption);
    }

  }

  onOpenSelect() {
    const self = this;
    self.activeSelect = !self.activeSelect;
  }

  onSelectedOption(ev) {
    this.nameOptionSelected = (ev || {}).value;
    this.optionSelected = {
      selectId: this.id,
      key: (ev || {}).key,
      value: (ev || {}).value
    };
    this.activeSelect = false;
    this.changeSelected.emit(this.optionSelected);
  }

  onChangeInput(ev) {
    this.onFilter((ev || {}).value);
  }

  onFilter(value) {
    let originalOptionList = [...this.originalOptionList];
    let dataSearch = originalOptionList.filter((option) => {
      return String(option.value).toLowerCase().indexOf(value.trim().toLowerCase()) > -1
    });

    this.optionList = !value.length ? originalOptionList : dataSearch;
  }

}
