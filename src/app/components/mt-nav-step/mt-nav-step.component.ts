import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mt-nav-step',
  templateUrl: './mt-nav-step.component.html',
  styleUrls: ['./mt-nav-step.component.scss'],
})
export class MtNavStepComponent implements OnInit {
  @Input() actualStep: number = 1;
  @Input() isComplete: boolean = false;
  @Output() onChangeStep: EventEmitter<any> = new EventEmitter();

  menuStepList: Array<any> = [];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('actualStep')) {
      this.menuStepList = [
        {
          id: "tap1",
          step: 1,
          status: 'success',
          concept: "Datos personales",
          icon: "fa fa-file-text-o"
        },
        {
          id: "tap2",
          step: 2,
          status: 'progress',
          concept: "Exp. laboral",
          icon: "fa fa-suitcase"
        },
        {
          id: "tap3",
          step: 3,
          status: 'progress',
          concept: "Form. academica",
          icon: "fa fa-graduation-cap"
        },
        {
          id: "tap4",
          step: 4,
          status: 'progress',
          concept: "Derechos habientes",
          icon: "fa fa-users"
        },
        {
          id: "tap5",
          step: 5,
          status: 'progress',
          concept: "Datos de salud",
          icon: "fa fa-stethoscope"
        }
      ];

      this.actualStep = (changes || {})['actualStep'].currentValue;

      let indexStep = this.menuStepList.findIndex((data) => data.step == this.actualStep);

      for (let i = 0; i < this.menuStepList.length; i++) {
        if (!this.isComplete) {
          if (i == this.actualStep) {
            ((this.menuStepList || [])[indexStep] || {}).status = 'active';
          }

          if (i < indexStep) {
            ((this.menuStepList || [])[i] || {}).status = "success";
          }

          if (i > indexStep) {
            ((this.menuStepList || [])[i] || {}).status = "progress";
          }
        } else {
          ((this.menuStepList || [])[i] || {}).status = 'success';
        }
      }

    }
  }

  onSelectedStep(step: any) {
    this.onChangeStep.emit(step);
  }

}
