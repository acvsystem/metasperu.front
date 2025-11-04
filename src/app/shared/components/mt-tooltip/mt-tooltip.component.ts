import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mt-tooltip',
  templateUrl: './mt-tooltip.component.html',
  styleUrls: ['./mt-tooltip.component.scss'],
})
export class MtTooltipComponent implements OnInit {
  @Input() textTooltip: any = false;
  @Input() tooltipInput:boolean = false;
  
  constructor() { }

  ngOnInit() {}

}
