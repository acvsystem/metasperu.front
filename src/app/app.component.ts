import { Component } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { StorageService } from './utils/storage';
import { NavController } from '@ionic/angular';
import { ShareService } from './services/shareService';
import { MenuController } from '@ionic/angular';
import { UAParser } from 'ua-parser-js';
import { io } from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  isShowLoading: boolean = false;
  renderNavBar: boolean = false;
  isMobil: boolean = false;
  isVisiblePopover: boolean = false;
  menuList: Array<any> = [{ name: "Logout", fn: "onLogout" }];
  profileUser: any = [];
  menuUser: any = [];
  isSubMenuRrhh: boolean = false;
  isSubMenuSistemas: boolean = false;
  isStart = 0;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private store: StorageService,
    private nav: NavController,
    private service: ShareService,
    private menu: MenuController
  ) {
/*
    setInterval(() => {
      this.socket.emit('comunicationEnlace', 'RECONECT');
    }, 10000)
*/
    this.httpService.eventShowLoading.subscribe((response) => {
      setTimeout(() => {
        this.isShowLoading = response;
      }, 1000)
    });

    let profileUser = this.store.getStore('mt-profile');

    if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY") {
      this.menuUser = this.store.getStore('mt-menu') || [];

    }

    this.service.onProfileUser.subscribe((profile) => {
      const self = this;
      this.profileUser = [];
      let newProfile = {
        mt_name_1: profile.codigo.length ? profile.nameTienda.toUpperCase() : profile.name.split(' ')[0],
        mt_nivel: profile.name.split(' ')[0],
        code: profile.codigo
      };

      this.profileUser.push(newProfile);
      this.store.removeStore("mt-profile");
      this.store.setStore("mt-profile", JSON.stringify(newProfile));
      let profileUser = this.store.getStore('mt-profile');

      if ((profileUser || {}).mt_nivel == "RRHH") {
        self.menuUser = [
          {
            ISVISIBLE: true,
            nombre_menu: "ASISTENCIA",
            ruta: "asistencia"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "PLANILLA RRHH",
            ruta: "planilla"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "HORARIO",
            ruta: "horario"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "PANEL HORARIOS",
            ruta: "panel-horario"
          }

        ];

        this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
      }

      if ((profileUser || {}).mt_nivel == "cmoron" || (profileUser || {}).mt_nivel == "jcarreno") {
        self.menuUser = [
          {
            ISVISIBLE: true,
            nombre_menu: "INVENTARIO",
            ruta: "inventario"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "ASISTENCIA",
            ruta: "asistencia"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "PANEL HORARIOS",
            ruta: "panel-horario"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "AUTORIZACION HORA EXTRA",
            ruta: "auth-hora-extra"
          }
        ];

        this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
      }


      if ((profileUser || {}).mt_nivel == "nduran" || (profileUser || {}).mt_nivel == "aseijo") {
        self.menuUser = [
          {
            ISVISIBLE: true,
            nombre_menu: "INVENTARIO",
            ruta: "inventario"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "ASISTENCIA",
            ruta: "asistencia"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "PANEL HORARIOS",
            ruta: "panel-horario"
          }
        ];

        this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
      }

      if ((profileUser || {}).mt_nivel == "acarbajal") {
        self.menuUser = [
          {
            ISVISIBLE: true,
            nombre_menu: "INVENTARIO",
            ruta: "inventario"
          },
          {
            ISVISIBLE: true,
            nombre_menu: "PANEL HORARIOS",
            ruta: "panel-horario"
          }
        ];

        this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
      }

      if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY") {
        self.menuUser = [{
          ISVISIBLE: true,
          nombre_menu: "INVENTARIO",
          ruta: "inventario"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "COMPROBANTES",
          ruta: "comprobantes"
        }
          ,
        {
          ISVISIBLE: true,
          nombre_menu: "CONFIGURACION",
          ruta: "configuracion"
        }
          ,
        {
          ISVISIBLE: true,
          nombre_menu: "ASISTENCIA",
          ruta: "asistencia"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "HORARIO",
          ruta: "horario"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "AUTORIZACION HORA EXTRA",
          ruta: "auth-hora-extra"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "PANEL HORARIOS",
          ruta: "panel-horario"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "PLANILLA RRHH",
          ruta: "planilla"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "DRIVE CLOUD",
          ruta: "drive-cloud"
        }

        ];

        this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
      }

      if ((profileUser || {}).code.length) {
        self.menuUser = [{
          ISVISIBLE: true,
          nombre_menu: "INVENTARIO",
          ruta: "inventario"
        },
        {
          ISVISIBLE: true,
          nombre_menu: "HORARIO",
          ruta: "horario"
        }
        ];
      }

      this.store.setStore("mt-menu", JSON.stringify(self.menuUser));



    });

    this.service.onMenuUser.subscribe((menu) => {
      /*const self = this;
      self.menuUser = [];
      this.store.removeStore("mt-menu");

      self.menuUser = menu;
      this.store.setStore("mt-menu", JSON.stringify(self.menuUser));*/
    });
  }

  ngOnInit() {
    const selft = this;
    let profileUser = this.store.getStore('mt-profile');
    let menu = this.store.getStore('mt-menu');
    this.menuUser = menu;
    this.isMobil = window.innerWidth < 769;
    var myOwnListOfBrowsers = [
      [/(mybrowser)\/([\w\.]+)/i], [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION]
    ];
    
    this.service.eventIsLoggedIn.subscribe((isLogin) => {
      this.renderNavBar = isLogin;
    });

    if (profileUser) {
      this.profileUser = [];
      this.profileUser.push(profileUser);
    }

    /* if (menu) {
       this.menuUser = [];
       this.menuUser = menu;
     }*/

    if (this.store.getStore('tn')) {
      if (location.pathname.split('/')[1] != "postulante" && location.pathname.split('/')[1].length > 0) {
        this.renderNavBar = true;
      }

    } else {

      this.renderNavBar = false;
      if (location.pathname.split('/')[1] == "auth-hora-extra" && location.pathname.split('/')[1].length > 0) {
        this.store.setStore("pathResolve", "auth-hora-extra");
        this.nav.navigateRoot('login');
      }
    }

    try {
      this.router.events
        .pipe(
          filter(
            (event: NavigationEnd) => {
              return (event instanceof NavigationEnd);
            }
          )
        )
        .subscribe(
          (event: NavigationEnd) => {

            if (this.store.getStore('tn')) {
              let profileUser = this.store.getStore('mt-profile');

              if ((profileUser || {}).mt_nivel == "INVENTARIO" || (profileUser || {}).mt_nivel == "VSBA" || (profileUser || {}).mt_nivel == "BBW" || (profileUser || {}).code) {
                this.service.onViewPageAdmin.emit(false);
              }

              if ((profileUser || {}).mt_nivel == "RRHH") {
                this.service.onViewPageAdmin.emit(false);

                //this.nav.navigateRoot('asistencia');
              }

              if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY") {
                this.service.onViewPageAdmin.emit(true);
              }


            }
          }
        )

    } catch (e) {
      console.log('error app ', e);
    }

    document.body.addEventListener("click", function (evt) {
      let classListSelect = [...((evt || {}).target || {})["classList"] || []] || [];
      let parentClassList = [...(((evt || {}).target || {})["offsetParent"] || {})['classList'] || []] || [];

      if (classListSelect.indexOf("isSelectComponent") == -1) {
        if (parentClassList.indexOf("isSelectComponent") == -1 && parentClassList.indexOf("has-focus") == -1) {
          selft.service.onCloseSelect.emit(true);
        }
      }

    });
  }

  onFunctionMenu(ev) {
    this[ev]();
  }

  onLogout() {
    this.store.removeStore('tn');
    this.store.removeStore('mt-profile');
    this.store.removeStore('mt-menu');
    this.store.removeStore('mtStep');
    this.store.removeStore('inscription');
    this.store.removeStore('conx_online');
    this.store.removeStore('pathResolve');
    this.store.removeStore('mt-horario');

    this.renderNavBar = false;
    this.nav.navigateRoot('login');
    this.isVisiblePopover = false;
    this.menuUser = [];
    this.service.onDisconnectSocket.emit(true);
  }

  onNavigatorRoute(route) {
    this.nav.navigateRoot(route);
    this.menu.close();
  }

}