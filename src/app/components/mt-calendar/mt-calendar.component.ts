import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss'],
})
export class MtCalendarComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  public model = [
    new Date('7/15/1966')
  ];
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;

  constructor() { }

  ngOnInit() { }

  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return [ 'selected' ];
    }
    return [ ];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(date);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
  }

}
