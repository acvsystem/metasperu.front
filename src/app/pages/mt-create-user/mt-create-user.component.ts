import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'mt-create-user',
  templateUrl: './mt-create-user.component.html',
  styleUrls: ['./mt-create-user.component.scss'],
})
export class MtCreateUserComponent implements OnInit {


  userName: string = "";
  password: string = "";
  nombreProfile: string = "";
  apellidoProfile: string = "";
  token: string = '';

  constructor(
    private service: ShareService,
    private nav: NavController,
    private store: StorageService,
    private navStart: ActivatedRoute
  ) {

    this.token = this.navStart.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      //  this.nav.navigateRoot('login');
    }
  }

  ngOnInit() {
    let token = location.pathname.split('/')[2];
    this.store.setStore('tn', token);
  }

  onRegistrar() {

    let bodyRegister = {
      usuario: this.userName,
      password: this.password,
      nombreProfile: this.nombreProfile,
      apellidoProfile: this.apellidoProfile
    }

    let validForm = Object.values(bodyRegister).filter((value) => value == "");

    let parms = {
      url: '/security/create/user',
      body: bodyRegister
    };

    if (!validForm.length) {
      this.service.post(parms).then((response) => {
        let res = response || {};

        if ((res || {}).success) {
          this.nav.navigateRoot('login');
        }
      });
    }
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onLoginRoute() {
    this.nav.navigateRoot('login');
  }

}
