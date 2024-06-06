import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';

@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {

  userName: string = "";
  password: string = "";

  constructor(
    private shrService: ShareService,
    private nav: NavController,
    private store: StorageService
  ) { }

  ngOnInit() {
/*
    document.addEventListener('keydown', (event) => {
      var keyValue = event.key;
      if (keyValue == "Enter") {
        this.onLogin();
      }
    }, false);*/
  }


  onLogin() {

    console.log(this.userName, this.password);
    /*
    this.shrService.createToken(this.userName, this.password).then((token) => {
      if (token) {
        this.nav.navigateRoot('comprobantes');
      }
    });*/
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

}
