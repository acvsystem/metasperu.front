import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'mt-datatable',
  templateUrl: './mt-datatable.component.html',
  styleUrls: ['./mt-datatable.component.scss'],
})
export class MtDatatableComponent implements OnInit {
  @Input() headList: Array<any> = [];
  @Input() bodyList: Array<any> = [];
  @Input() actionButton: boolean = false;
  @Input() buttonOptionList: Array<any> = [];
  @Output() onClickedCallback: EventEmitter<any> = new EventEmitter();
  @Output() returnData: EventEmitter<any> = new EventEmitter();

  renderBodyList: Array<any> = [];
  objEditFile: any = {};
  isEnableEdit: boolean = false;
  keyEditRegister: any = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    
   }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('bodyList')) {
      (this.bodyList || []).filter((data, i) => {
        var dataList: any = [];
        var dataLength: any = Object.keys((data || {})).length - 1;
        Object.keys((data || {})).map((obj, i) => {
          var valueColumn = { key: obj, value: `${data[obj]}` };
          (dataList || []).push(valueColumn);
          if (i == dataLength && this.actionButton) {
            (dataList || []).push({ key: 'endColunm', value: 'endColunm' });
          }
        });
        (this.renderBodyList || []).push({ key: data['codigo'], value: dataList });
      });
    }
  }

  onActionFunction(fn?: any, key?: any) {
    if (fn = 'update') {
      this.onUpdateFile(key);
    }
  }

  onUpdateFile(key: any) {
    this.objEditFile = {
      key: key,
      value: true
    };
  }

  onClear() {
    this.objEditFile = {
      key: 'a',
      value: false
    };
  }
  objResponse: any = {};

  onKeypress(code: any, ev: any) {
    var allData = this.renderBodyList.find((data) => data.key == code);
    this.keyEditRegister = code;

    if (allData.key != this.keyEditRegister) {
      Object.values(((allData || {}).value || [])).map((obj: any) => {
        (this.objResponse || {})[(obj || {}).key] = (obj || {}).value;
      });
    }
    (this.objResponse || {})[ev.target.name] = ev.target.value;
  }

  onSaveData() {
    this.returnData.emit(this.objResponse);
  }


}
