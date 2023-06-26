import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'mt-calendar',
  templateUrl: './mt-calendar.component.html',
  styleUrls: ['./mt-calendar.component.scss'],
})
export class MtCalendarComponent implements OnInit {
  @Input() id: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() idInit: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() idEnd: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() label: string = "label";
  @Input() labelInit: string = "Inicio";
  @Input() labelFin: string = "Fin";
  @Input() isRageDate :boolean = false;
  
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  @Output() afterChangeInit: EventEmitter<any> = new EventEmitter();
  @Output() afterChangeEnd: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChange.emit({ id: this.id, value: fechaSelected });
  }

  addEventInit(type: string, event: MatDatepickerInputEvent<Date>){
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChangeInit.emit({ id: this.idInit, value: fechaSelected });
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>){
    const fechaSelected = new Date(event.value).toLocaleDateString('en-CA');
    this.afterChangeEnd.emit({ id: this.idEnd, value: fechaSelected });
  }

}
