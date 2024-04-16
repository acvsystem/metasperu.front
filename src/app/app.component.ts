import { Component } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { StorageService } from './utils/storage';
import { NavController } from '@ionic/angular';
import { ShareService } from './services/shareService';
import { MenuController } from '@ionic/angular';
import {UAParser} from 'ua-parser-js';
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
  isStart = 0;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private store: StorageService,
    private nav: NavController,
    private service: ShareService,
    private menu: MenuController
  ) {
    console.log(this.menuUser);
    this.httpService.eventShowLoading.subscribe((response) => {
      setTimeout(()=>{
        this.isShowLoading = response;
      },1000)
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
      const self = this;
      self.menuUser = [];
      this.store.removeStore("mt-menu");

      self.menuUser = menu;
      this.store.setStore("mt-menu", JSON.stringify(self.menuUser));
    });
  }

  ngOnInit() {
    const selft = this;
    let profileUser = this.store.getStore('mt-profile');
    let menu = this.store.getStore('mt-menu');
    this.isMobil = window.innerWidth < 769;
    var myOwnListOfBrowsers = [
      [/(mybrowser)\/([\w\.]+)/i], [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION]
  ];
  /*var myParser = new UAParser({ browser: myOwnListOfBrowsers });
    console.log(myParser.getBrowser()); // {}
    console.log(myParser.getOS()); // {}
    console.log(myParser.getUA()); // {}
    console.log(myParser.getEngine()); // {}
    console.log(myParser.getResult()); // {}
    console.log(myParser);*/
    /*  let pathActual: any = {};
      pathActual = {
        value: this.store.getStore('pathURL') || location.pathname.split('/')[1]
      };*/
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
      if (location.pathname.split('/')[1] != "postulante" && location.pathname.split('/')[1].length > 0) {
        this.renderNavBar = true;
      }

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

            if (this.store.getStore('tn')) {

              /* if (location.pathname.split('/')[1] != "postulante") {
                 this.store.setStore('pathURL', location.pathname.split('/')[1]);
                 pathActual = { value: this.store.getStore('pathURL') || location.pathname.split('/')[1] };
                 if (!this.store.getStore('tn') || ((pathActual || {}).value == "postulante" || (pathActual || {}).value.length == 0)) {
                   this.renderNavBar = false;
                 }
                 this.nav.navigateRoot((pathActual || {}).value);
               } else {
                 let path = location.pathname.split('/')[1];
                 this.nav.navigateRoot(path);
               }*/
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
