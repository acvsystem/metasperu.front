import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss'],
})
export class MtCalendarComponent implements OnInit {
  @Input() isPeriodo: boolean = false;
  @Input() isMultiSelect: boolean = true;
  @Input() isDefault: boolean = false;
  @Input() maxSelect: boolean = false;
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  selected: string;
  constructor() { }

  ngOnInit() {

  }

  onChangeInput(ev: any) {
    let arrDate = ev;
    let date = new Date(ev);
    if (this.isPeriodo) {
      this.afterChange.emit({ isPeriodo: true, value: [`${date.getFullYear()}`, `${date.getMonth() + 1}`, `${date.getMonth() + 2}`] });
    }

    if (this.isMultiSelect && arrDate.length >= 3 && arrDate.length <= 4) {
      this.afterChange.emit({ isMultiSelect: true, value: arrDate });
    }

    if (this.isDefault) {
      this.afterChange.emit({ isDefault: true, value: `${date}` });
    }
  }

}
