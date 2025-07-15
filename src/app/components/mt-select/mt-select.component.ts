import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShareService } from '../../services/shareService';

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
  @Input() isDisabled: boolean = false;
  @Input() optionDefault: Array<any> = [];
  @Input() nameOptionSelected: string = "";
  @Output() changeSelected: EventEmitter<any> = new EventEmitter();

  activeSelect: boolean = false;
  sboSearch: string = "";
  optionSelected: any = {};
  originalOptionList = [];

  constructor(private service: ShareService) {
    const self = this;
    this.service.onCloseSelect.subscribe(() => {
      if (this.activeSelect) {
        self.activeSelect = false;
      }
    });
  }

  ngOnInit() {
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('optionList')) {
      this.originalOptionList = [...this.optionList];
      console.log(this.id,this.originalOptionList);
    }

    if (changes && changes.hasOwnProperty('selectOption')) {
      if (Object.keys(this.selectOption).length) {
        this.onSelectedOption(this.selectOption);
      }
    }

    if (changes && changes.hasOwnProperty('optionDefault')) {
      if (Object.keys(this.optionDefault).length) {
        this.onSelectedOption(this.optionDefault[0]);
      }
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
    //this.optionDefault = this.optionSelected;
    this.changeSelected.emit(this.optionSelected);
  }

  onChangeInput(ev) {
    this.onFilter((ev || {}).value);
  }

  onFilter(value) {

    let originalOptionList = [...this.originalOptionList];
    console.log(originalOptionList);
    let dataSearch = (originalOptionList || []).filter((option) => {
      const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
      let palabraFilter = (option || {}).value.split('').map(letra => acentos[letra] || letra).join('').toString();

      return String(palabraFilter).toUpperCase().indexOf(value.trim().toUpperCase()) > -1;
    });

    this.optionList = !(value || "").length ? originalOptionList : dataSearch;
  }

}
