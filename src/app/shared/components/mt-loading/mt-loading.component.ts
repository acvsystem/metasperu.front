import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mt-loading',
  templateUrl: './mt-loading.component.html',
  styleUrls: ['./mt-loading.component.scss'],
})
export class MtLoadingComponent implements OnInit {
  
  @Input() isVisible: boolean = false;

  constructor() { }

  ngOnInit() { }

}
