import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';
import { UAParser } from 'ua-parser-js';

@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {

  userName: string = "";
  password: string = "";
  codigo_auth: string = "";
  isCodigo: boolean = false;
  isCodeExpired: boolean = false;
  isCodeFail: boolean = false;
  msjError: string = "";

  constructor(
    private shrService: ShareService,
    private nav: NavController,
    private store: StorageService
  ) { }

  ngOnInit() {
    /* document.addEventListener('keydown', (event) => {
       var keyValue = event.key;
       if (keyValue == "Enter") {
         this.onLogin();
       }
     }, false);*/
  }


  onLogin() {
    const { browser, cpu, device, os } = UAParser();
    let parms = {
      url: '/session_login',
      body:
      {
        usuario: this.userName,
        password: this.password,
        divice: `${browser.name} ${browser.version}`,
        ip: '192.168.1.1'
      }

    };

    this.shrService.post(parms).then(async (response) => {
      if ((response || {}).success) {
        this.shrService.createToken(this.userName, this.password).then((token) => {
          if (token) {
            this.onRouteDefault();
          }
        });
      }

      if (!(response || {}).success) {
        this.isCodigo = true;
      }

    });
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onRouteDefault() {

    let profileUser = this.store.getStore('mt-profile');
    if ((profileUser || {}).mt_nivel == "INVENTARIO" || (profileUser || {}).mt_nivel == "VSBA" || (profileUser || {}).mt_nivel == "BBW" || (profileUser || {}).code) {
      this.nav.navigateRoot('inventario');
    } else if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY") {
      let path = this.store.getStore("pathResolve");
      if ((path || {}).value == "auth-hora-extra") {
        this.nav.navigateRoot('auth-hora-extra');
      } else {
        this.nav.navigateRoot('comprobantes');
      }

    } else if ((profileUser || {}).mt_nivel == "RRHH") {
      this.nav.navigateRoot('asistencia');
    }

  }

  onValid() {
    const { browser, cpu, device, os } = UAParser();
    let parms = {
      url: '/auth_session',
      body:
      {
        usuario: this.userName,
        password: this.password,
        codigo: this.codigo_auth,
        divice: `${browser.name} ${browser.version}`,
        ip: '192.168.1.1'
      }

    };

    this.shrService.post(parms).then(async (response) => {
      if ((response || {}).success) {
        this.onRouteDefault();
        this.isCodigo = false;
        
        this.shrService.createToken(this.userName, this.password).then((token) => {
          if (token) {
            this.onRouteDefault();
          }
        });
      } else {
        if ((response || {}).codExpired) {
          this.isCodeExpired = (response || {}).codExpired;
        }

        if ((response || {}).codeFail) {
          this.isCodeFail = (response || {}).codeFail;
        }

        this.msjError = (response || {}).msj;

      }
    });
  }

}
