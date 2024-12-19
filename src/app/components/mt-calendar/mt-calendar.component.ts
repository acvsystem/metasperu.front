import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ViewChild } from '@angular/core';
import { localeEs } from '@mobiscroll/angular';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_FORMATS,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss'],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: 'es-Es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
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
  @Input() selected: string = "";
  public localeEs = localeEs;
  readonly date = new FormControl(moment());
  @ViewChild('dp') datePickerElement = MatDatepicker;

  constructor() { }

  ngOnInit() {
  }

  onChangeInput(ev: any) {
    console.log("onChangeInput", ev);
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



  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log(normalizedMonthAndYear);
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());

    this.date.setValue(ctrlValue);
    console.log(datepicker);
    datepicker.close();
  }

}
