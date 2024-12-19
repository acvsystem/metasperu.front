import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, inject, signal, model } from '@angular/core';
import { localeEs, Notifications } from '@mobiscroll/angular';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_FORMATS,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

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
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class MtCalendarComponent implements OnInit {
  public CLOSE_ON_SELECTED = false;
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
  date = new FormControl(moment());
  public model = [];
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;
  @ViewChild('pickerSemana', { static: true }) _picker2: MatDatepicker<Date>;
  @ViewChild('dp') datePickerElement = MatDatepicker;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public resetModel = new Date();
  public dateClass = (date: Date) => {
    if (this._findDate(date) !== -1) {
      return ['selected'];
    }
    return [];
  }

  constructor(public notify: Notifications) { }


  ngOnInit() {

    if (this.isDefault) {
      this.afterChange.emit({ id: this.id, isDefault: true, value: `${moment(this.date.value).format('YYYY/MM/DD')}` });
    }
  }

  onChangeInput(ev: any) {
    console.log("onChangeInput", ev);
    let arrDate = ev;
    let date = new Date(ev);

    if (this.isPeriodo) {
      var futureMonth = moment(this.date.value).add(1, 'months');
      this.afterChange.emit({ isPeriodo: true, value: [`${moment(this.date.value).format('YYYY')}`, `${moment(this.date.value).format('MM')}`, `${moment(futureMonth).format('MM')}`] });
    }

    if (this.isMultiSelect && arrDate.length >= 1 && arrDate.length <= 3) {
      console.log("isMultiSelect", arrDate);
      this.afterChange.emit({ isMultiSelect: true, value: arrDate });
    }

    if (this.isDefault) {
      this.afterChange.emit({ id: this.id, isDefault: true, value: `${moment(this.date.value).format('YYYY/MM/DD')}` });
    }

    if (this.isTime) {
      let dt = new Date(ev.value);
      let minutos = dt.getMinutes().toString().length < 2 ? '0' + dt.getMinutes() : dt.getMinutes();

      this.afterChange.emit({ isTime: true, value: `${dt.getHours()}:${minutos}`, id: this.id });
    }

    if (this.isRange) {
      let ar = [];
      let dateStart = `${moment(this.range.value.start).format('YYYY/MM/DD')}`;
      let dateEnd = `${moment(this.range.value.end).format('YYYY/MM/DD')}`;
      console.log(`${moment(this.range.value.start).format('YYYY/MM/DD')}`, `${moment(this.range.value.end).format('YYYY/MM/DD')}`);
      ar = [`${moment(this.range.value.start).format('YYYY/MM/DD')}`, `${moment(this.range.value.end).format('YYYY/MM/DD')}`];
      if ((dateStart != 'Invalid date' && dateEnd != 'Invalid date') && (dateStart != null && dateEnd != null)) {
        this.afterChange.emit({ isRange: true, value: ar });
      }

    }

    if (this.isPresentRange) {
      let startDayLetter = new Date(moment(this.range.value.start).format('YYYY/MM/DD'));
      var startTotalDays = moment(this.range.value.start).add(6, 'days').format('DD');
      let dateEnd = moment(this.range.value.end).format('DD');
      let diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");

      if (diasSemana[startDayLetter.getDay()] == "Lunes") {
        if (parseInt(dateEnd) > 0) {
          if (parseInt(startTotalDays) == parseInt(dateEnd)) {
            let ar = [`${moment(this.range.value.start).format('YYYY/MM/DD')}`, `${moment(this.range.value.end).format('YYYY/MM/DD')}`];
            this.afterChange.emit({ isPresentRange: true, value: ar });
          } else {
            this.notify.snackbar({
              message: "Numero de dias sobrepasan a la de una semana.",
              display: 'top',
              color: 'danger'
            });
          }
        }
      } else {
        this.notify.snackbar({
          message: "No puede iniciar el horario con ese dia.",
          display: 'top',
          color: 'danger'
        });
      }
    }
  }




  public dateChanged(event: MatDatepickerInputEvent<Date>): void {
    if (event.value && this.model.length < 3) {
      const date = event.value;
      const index = this._findDate(date);
      if (index === -1) {
        this.model.push(`${moment(date).format('YYYY/MM/DD')}`);
        this.onChangeInput(this.model);
      } else {
        this.model.splice(index, 1)
      }
      this.resetModel = new Date();
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }


    } else {
      this.notify.snackbar({
        message: "Solo puede seleccionar 3 fechas.",
        display: 'top',
        color: 'danger'
      });
    }
  }

  public remove(date: Date): void {
    const index = this._findDate(date);
    this.model.splice(index, 1)
  }

  private _findDate(date: Date): number {
    return this.model.map((m) => +m).indexOf(+date);
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


  chosenYearHandler(normalizedYear: Moment) {

    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    console.log(this.date);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

}
