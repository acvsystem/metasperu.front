import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isShowLoading: boolean = false;
  renderNavBar: boolean = false;
  
  constructor() { }
}
