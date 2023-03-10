import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'

@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {

  constructor(private shrService: ShareService) { }

  ngOnInit() { }


  onLogin() {
    let parms = {
      url: '/security/login',
      body: { "usuario": "SISTEMAS", "password": "METASPERU" },
      server: 'localhost:3200'
    };

    this.shrService.post(parms);
  }

}
