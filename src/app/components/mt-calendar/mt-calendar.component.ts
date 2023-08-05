import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss']
})
export class MtCalendarComponent implements OnInit {


  @Input() id: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() idInit: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() idEnd: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() label: string = "label";
  @Input() labelInit: string = "Inicio";
  @Input() labelFin: string = "Fin";
  @Input() isRageDate: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isMultiSelect: boolean = false;
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  @Output() afterChangeInit: EventEmitter<any> = new EventEmitter();
  @Output() afterChangeEnd: EventEmitter<any> = new EventEmitter();

  date: any = "";
  events: Array<any> = [];
  public resetModel = new Date(0);
  public model: any = [];

  public CLOSE_ON_SELECTED = false;
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;
  chipDateList: Array<any> = [];
  constructor() { }

  ngOnInit() {
    this.date = new FormControl(new Date());
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = new Date(event.value).toLocaleDateString('en-CA');
      this.model.push(event.value);
      this.chipDateList.push(date);
      
      this.afterChange.emit({ dateList: this.chipDateList });
    }
  }

  public dateClass = (date: Date) => {
    const dateSelected = new Date(date).toLocaleDateString('en-CA');

    if (this._findDate(dateSelected) !== -1) {
      return ['selected-date'];
    }
    return ['not-selected'];
  }

  private _findDate(date: any): number {
    return this.chipDateList.indexOf(date);
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChange.emit({ id: this.id, value: fechaSelected });
  }

  addEventInit(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChangeInit.emit({ id: this.idInit, value: fechaSelected });
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChangeEnd.emit({ id: this.idEnd, value: fechaSelected });
  }

  removeItem(item) {
    let index = this.chipDateList.indexOf(item);
    this.chipDateList.splice(index, 1);
  }

}
