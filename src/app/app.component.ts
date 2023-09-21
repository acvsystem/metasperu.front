import { Component } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { StorageService } from './utils/storage';
import { NavController } from '@ionic/angular';
import { ShareService } from './services/shareService';

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
    private service: ShareService
  ) {
    this.httpService.eventShowLoading.subscribe((response) => {
      this.isShowLoading = response;
    });

    this.service.onProfileUser.subscribe((profile) => {
      this.profileUser = [];
      this.profileUser.push(profile);
      this.store.removeStore("mt-profile");
      this.store.setStore("mt-profile", JSON.stringify(profile));
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
    let profileUser = this.store.getStore('mt-profile');
    let menu = this.store.getStore('mt-menu');
    console.log(menu);
    this.isMobil = window.innerWidth < 769;
    let pathActual: any = {};

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
      this.renderNavBar = true;
      pathActual = this.store.getStore('pathURL') || 'comprobantes';
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
            pathActual = this.store.getStore('pathURL') || 'comprobantes';
            if (!this.store.getStore('tn')) {
              this.renderNavBar = false;
            }
          }
        )

    } catch (e) {
      console.log('error app ', e);
    }
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
  }

}
