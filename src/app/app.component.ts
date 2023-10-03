import { Component } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { StorageService } from './utils/storage';
import { NavController } from '@ionic/angular';
import { ShareService } from './services/shareService';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isShowLoading: boolean = false;
  renderNavBar: boolean = false;
  isMobil: boolean = false;
  isVisiblePopover: boolean = false;
  menuList: Array<any> = [{ name: "Logout", fn: "onLogout" }];
  profileUser: any = [];
  menuUser: any = [];
  isSubMenuRrhh: boolean = false;
  isSubMenuSistemas: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private store: StorageService,
    private nav: NavController,
    private service: ShareService,
    private menu: MenuController
  ) {
    this.httpService.eventShowLoading.subscribe((response) => {
      this.isShowLoading = response;
    });

    this.service.onProfileUser.subscribe((profile) => {
      this.profileUser = [];
      let newProfile = {
        name_1: profile.name.split(' ')[0],
        name_2: profile.name.split(' ')[1],
        nivel: profile.nivel
      };

      this.profileUser.push(newProfile);
      this.store.removeStore("mt-profile");
      this.store.setStore("mt-profile", JSON.stringify(newProfile));
    });

    this.service.onMenuUser.subscribe((menu) => {
      this.menuUser = [];
      this.store.removeStore("mt-menu");
      let newMenu = [
        {
          KEY: "rrhh",
          NAME_MENU: "Recursos Humanos",
          ISVISIBLE: false,
          RUTE_PAGE: "",
          SUBMENU: []
        }
      ];

      let menuUser = menu;

      if (this.profileUser[0].nivel == "ADMINISTRADOR") {
        newMenu.push(
          {
            KEY: "sistemas",
            NAME_MENU: "Sistemas",
            RUTE_PAGE: "",
            ISVISIBLE: false,
            SUBMENU: []
          }
        );
      }

      menuUser.filter((menu) => {
        if ((menu || {}).RUTE_PAGE == 'empleados' || (menu || {}).RUTE_PAGE == 'control-asistencia' || (menu || {}).RUTE_PAGE == 'recursos-humanos') {
          newMenu[0]['SUBMENU'].push(menu);
        } else if ((menu || {}).RUTE_PAGE == 'comprobantes-sunat' || (menu || {}).RUTE_PAGE == 'comprobantes') {
          newMenu[1]['SUBMENU'].push(menu);
        } else {
          newMenu.push(
            {
              KEY: "configuracion",
              NAME_MENU: menu.NAME_MENU,
              RUTE_PAGE: menu.RUTE_PAGE,
              ISVISIBLE: true,
              SUBMENU: []
            }
          );
        }
      });

      this.menuUser = newMenu;
      console.log(this.menuUser);
      this.store.setStore("mt-menu", JSON.stringify(this.menuUser));
    });
  }

  ngOnInit() {
    const selft = this;
    let profileUser = this.store.getStore('mt-profile');
    let menu = this.store.getStore('mt-menu');

    this.isMobil = window.innerWidth < 769;
    let pathActual: any = {};
    pathActual = this.store.getStore('pathURL') || 'comprobantes';
    this.service.eventIsLoggedIn.subscribe((isLogin) => {
      this.renderNavBar = isLogin;
    });

    if (profileUser) {
      this.profileUser = [];
      this.profileUser.push(profileUser);
    }

    if (menu) {
      this.menuUser = [];
      this.menuUser = menu;
    }

    if (this.store.getStore('tn')) {
      if (((pathActual || {}).value || "") != "postulante" && ((pathActual || {}).value || "").length > 0) {
        this.renderNavBar = true;
      }

      this.nav.navigateRoot((pathActual || {}).value);
    } else {
      this.renderNavBar = false;
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
      
            this.store.setStore('pathURL', location.pathname.split('/')[1]);
            pathActual = this.store.getStore('pathURL');
            if ((pathActual || {}).value != "postulante") {
              console.log("NavigationEnd");

              if (!this.store.getStore('tn') || ((pathActual || {}).value == "postulante" || (pathActual || {}).value.length == 0)) {
                this.renderNavBar = false;
              }
              this.nav.navigateRoot((pathActual || {}).value);
            } else {
              let path = location.pathname.split('/')[1];
              console.log(path);
              this.nav.navigateRoot(path);
            }
          }
        )

    } catch (e) {
      console.log('error app ', e);
    }

    document.body.addEventListener("click", function (evt) {
      let classListSelect = [...((evt || {}).target || {})["classList"]] || [];

      if (classListSelect.indexOf("isSelectComponent") == -1) {
        selft.service.onCloseSelect.emit(true);
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
    this.renderNavBar = false;
    this.nav.navigateRoot('login');
    this.isVisiblePopover = false;
    this.service.onDisconnectSocket.emit(true);
  }

  onNavigatorRoute(route) {
    this.nav.navigateRoot(route);
    this.menu.close();
  }

}
