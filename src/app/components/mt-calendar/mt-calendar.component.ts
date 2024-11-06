import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { localeEs } from '@mobiscroll/angular';


@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss'],
})
export class MtCalendarComponent implements OnInit {
  @Input() isPeriodo: boolean = false;
  @Input() isMultiSelect: boolean = false;
  @Input() isDefault: boolean = false;
  @Input() isRange: boolean = false;
  @Input() maxSelect: boolean = false;
  @Input() isTime: boolean = false;
  @Input() isPresentRange: boolean = false;
  @Input() placeholder: string = "";
  @Input() id: string = "";
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  selected: string;
  public localeEs = localeEs;

  constructor() { }

  ngOnInit() {

  }

  onChangeInput(ev: any) {
    console.log(ev);
    let arrDate = ev;
    let date = new Date(ev);

    if (this.isPeriodo) {
      this.afterChange.emit({ isPeriodo: true, value: [`${date.getFullYear()}`, `${date.getMonth() + 1}`, `${date.getMonth() + 2}`] });
    }

    if (this.isMultiSelect && arrDate.length >= 1 && arrDate.length <= 3) {
      this.afterChange.emit({ isMultiSelect: true, value: arrDate });
    }

    if (this.isDefault) {
      this.afterChange.emit({ id: this.id, isDefault: true, value: `${date}` });
    }

    if (this.isTime) {
      let dt = new Date(ev.value);
      let minutos = dt.getMinutes().toString().length < 2 ? '0' + dt.getMinutes() : dt.getMinutes();

      this.afterChange.emit({ isTime: true, value: `${dt.getHours()}:${minutos}`, id: this.id });
    }

    if (this.isRange && arrDate.length >= 2) {
      this.afterChange.emit({ isRange: true, value: arrDate });
    }

    if (this.isPresentRange) {
      this.afterChange.emit({ isPresentRange: true, value: arrDate });
    }
  }

}
