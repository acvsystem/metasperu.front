import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';
import { UAParser } from 'ua-parser-js';
import { publicIp, publicIpv4, publicIpv6 } from 'public-ip';
import { io } from 'socket.io-client';
import { GlobalConstants } from '../../const/globalConstants';

@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {
  socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });

  userName: string = "";
  password: string = "";
  codigo_auth: string = "";
  isCodigo: boolean = false;
  isCodeExpired: boolean = false;
  isCodeFail: boolean = false;
  isLogin: boolean = true;
  isLoading: boolean = false;
  msjErrorCodigo: string = "";
  msjErrorLogin: string = GlobalConstants.message.login.error;

  constructor(
    private shrService: ShareService,
    private nav: NavController,
    private store: StorageService
  ) { }

  async ngOnInit() {
  }


  async onLogin() {
    this.isLoading = true;
    const { browser, cpu, device, os } = UAParser();
    let publicIP = await publicIpv4();

    if (this.userName == "BBW" || this.userName == "VSBA") {
      this.shrService.createToken(this.userName, this.password).then((token) => {
        if (token) {
          this.onRouteDefault();
        }
      });
    } else {

      let parms = {
        url: '/session_login',
        body:
        {
          usuario: this.userName,
          password: this.password,
          divice: `${(browser || {}).name} ${(browser || {}).version}`,
          ip: publicIP
        }
      };

      this.shrService.post(parms).then(async (response) => {
        this.isLoading = false;
        if ((response || {}).success) {
          this.isLogin = true;
          this.shrService.createToken(this.userName, this.password).then((token) => {
            if (token) {
              this.onRouteDefault();
            }
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

    if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY" || (profileUser || {}).mt_nivel == "RRHH") {
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

    this.shrService.post(parms).then(async (response) => {
       this.isLoading = false;
      if ((response || {}).success) {
        this.isCodigo = false;
        this.isLogin = true;
        this.shrService.createToken(this.userName, this.password).then((token) => {
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
