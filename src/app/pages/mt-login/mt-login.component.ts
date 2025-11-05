import { Component, OnInit } from '@angular/core';
import { ShareService } from '@metasperu/services/shareService';
import { NavController } from '@ionic/angular';
import { StorageService } from '@metasperu/utils/storage';
import { UAParser } from 'ua-parser-js';
import { publicIpv4 } from 'public-ip';
import { GlobalConstants } from '@metasperu/const/globalConstants';
import { AuthService } from '@metasperu/services/authService';
import { User } from '@metasperu/models/user.model';
@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {

  userName: string = "";
  password: string = "";
  codigo_auth: string = "";
  msjErrorCodigo: string = "";
  publicIP: string = "";
  isCodigo: boolean = false;
  isCodeExpired: boolean = false;
  isCodeFail: boolean = false;
  isLoading: boolean = false;
  isLogin: boolean = true;
  msjErrorLogin: string = GlobalConstants.message.login.error;

  constructor(
    private shareService: ShareService,
    private nav: NavController,
    private store: StorageService,
    private auth: AuthService
  ) { }

  async ngOnInit() {
    this.publicIP = await publicIpv4();
  }

  async onLogin() {
    this.isLoading = true;
    const { browser } = UAParser();

    if (this.userName == "BBW" || this.userName == "VSBA") {
      this.auth.login(this.userName, this.password).then((response) => {
        ((response || [])[0].auth || {}).token ? this.onRouteDefault() : '';
      });
    } else {
      let parms = {
        url: '/session_login',
        body: {
          usuario: this.userName,
          password: this.password,
          divice: `${(browser || {}).name} ${(browser || {}).version}`,
          ip: this.publicIP
        }
      };

      this.shareService.post(parms).then(async (response) => {
        this.isLoading = false;
        if ((response || {}).success) {
          this.isLogin = true;
          this.auth.login(this.userName, this.password).then((token) => {
            token ? this.onRouteDefault() : "";
          });
        } else if ((response || {}).isSendCode) {
          this.isLogin = true;
          this.isCodigo = true;
        } else if (!(response || {}).login) {
          this.isLogin = false;
        }
      });
    }
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onRouteDefault() {

    let profileUser = this.store.getStore('mt-profile');
    console.log(profileUser);
    if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY" || (profileUser || {}).mt_nivel == "RRHH" || (profileUser || {}).mt_nivel == "FIELDLEADER" || (profileUser || {}).mt_nivel == "OPERACIONES") {
      this.store.setStore('mt-profile', JSON.stringify({
        "mt_name_1": (profileUser || {}).mt_name_1,
        "mt_nivel": (profileUser || {}).mt_nivel,
        "code": "OF",
        "default": (profileUser || {}).default,
        "email": (profileUser || {}).email
      }));
    }

    this.nav.navigateRoot((profileUser || {}).default);
  }

  async onValid() {
    this.isLoading = true;
    const { browser, cpu, device, os } = UAParser();
    let publicIP = await publicIpv4();
    let parms = {
      url: '/auth_session',
      body:
      {
        usuario: this.userName,
        password: this.password,
        codigo: this.codigo_auth,
        divice: `${browser.name} ${browser.version}`,
        ip: publicIP
      }

    };

    this.shareService.post(parms).then(async (response) => {
      this.isLoading = false;
      if ((response || {}).success) {
        this.isCodigo = false;
        this.isLogin = true;
        this.shareService.createToken(this.userName, this.password).then((token) => {
          if (token) {
            this.onRouteDefault();
          }
        });
      } else {
        if ((response || {}).codExpired) {
          this.isCodeExpired = (response || {}).codExpired;
          this.msjErrorCodigo = GlobalConstants.message.login.errorCodigoExp;
        }

        if ((response || {}).codeFail) {
          this.isCodeFail = (response || {}).codeFail;
          this.msjErrorCodigo = GlobalConstants.message.login.errorCodigo;
        }
      }
    });
  }

}
