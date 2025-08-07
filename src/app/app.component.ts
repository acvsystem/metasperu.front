import { Component, HostListener } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { StorageService } from './utils/storage';
import { NavController } from '@ionic/angular';
import { ShareService } from './services/shareService';
import { MenuController } from '@ionic/angular';
import { UAParser } from 'ua-parser-js';
import { io } from 'socket.io-client';
import { GlobalConstants } from './const/globalConstants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @HostListener('document:click', ['$event']) onClickFuera(event: MouseEvent) {
    if (!this.clicDentroDelDiv) {
      if (this.isVisiblePopover || this.isVisibleNotificacion) {
        this.isVisiblePopover = false;
        this.isVisibleNotificacion = false;
      }
    }
    this.clicDentroDelDiv = false; // Reiniciar para el siguiente clic
  }

  clicDentroDelDiv = false;
  socket = io(GlobalConstants.backendServer, { query: { code: 'app' } });
  isShowLoading: boolean = false;
  renderNavBar: boolean = false;
  isVisibleNotificacion: boolean = false;
  isMobil: boolean = false;
  isVisiblePopover: boolean = false;
  menuList: Array<any> = [{ name: "Logout", fn: "onLogout" }];
  profileUser: any = [];
  menuUser: any = [];
  isSubMenuRrhh: boolean = false;
  isSubMenuSistemas: boolean = false;
  isStart = 0;
  dataNotificaciones: Array<any> = [];

  constructor(
    private httpService: HttpService,
    private router: Router,
    private store: StorageService,
    private nav: NavController,
    private service: ShareService,
    private menu: MenuController
  ) {

    let profileUser = this.store.getStore('mt-profile');

    if ((profileUser || {}).mt_nivel == "SISTEMAS" || (profileUser || {}).mt_nivel == "JOHNNY") {
      this.menuUser = this.store.getStore('mt-menu') || [];

    }

    this.service.onMenuUser.subscribe((menuUser) => {
      const self = this;

      self.menuUser = [];

      menuUser.filter((menu) => {
        self.menuUser.push({
          ISVISIBLE: true,
          nombre_menu: (menu || "").NOMBRE_MENU,
          ruta: (menu || "").RUTA
        });
      });

      this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
    });

    this.service.onProfileUser.subscribe((user) => {
      console.log(user);
      const self = this;
      this.profileUser = [];
      let newProfile = {
        mt_name_1: user.profile.codigo.length ? user.profile.nameTienda.toUpperCase() : user.profile.name.split(' ')[0],
        mt_nivel: user.profile.nivel,
        code: user.profile.codigo,
        default: user.page.default,
        email: user.profile.email
      };
      console.log(newProfile);
      this.profileUser.push(newProfile);
      this.store.removeStore("mt-profile");
      this.store.setStore("mt-profile", JSON.stringify(newProfile));
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

    this.socket.on('notificaciones:get', async () => {
      this.onNotitifaciones();
    });

    this.onNotitifaciones();
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

  onDivClick() {
    this.clicDentroDelDiv = true;
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
    if (route == 'traspaso_inventario') {
      this.router.navigate(['/traspaso_inventario', { timestamp: new Date().getTime() }]);
    } else {
      this.nav.navigateRoot(route);
    }

    this.menu.close();
  }

  onNotitifaciones() {
    let parms = {
      url: '/notificaciones'
    };

    this.service.get(parms).then((response) => {
      let dataNoti = response || [];
      this.dataNotificaciones = [];

      (dataNoti || []).filter((nt) => {
        if (!nt.IS_READ) {
          this.dataNotificaciones.push(nt);
        }
      });
    });
  }

  onReadNotification(ev) {
    let parms = {
      url: '/notificaciones/read',
      body: { idNoti: ev }
    };

    this.service.post(parms).then((response) => {
      this.onNotitifaciones();
    });
  }

}