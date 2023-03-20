import { Component } from '@angular/core';
import { HttpService } from './services/httpService';
import { Router, ActivationStart, NavigationEnd } from "@angular/router";
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
      this.store.setStore("mt-profile", JSON.stringify(profile));
      this.profileUser = [];
      this.profileUser.push(profile);
    });

    this.service.onMenuUser.subscribe((menu) => {
      this.store.setStore("mt-menu", JSON.stringify(menu));
      this.menuUser = [];
      this.menuUser = menu;
    });
  }

  ngOnInit() {
    let profileUser = this.store.getStore('mt-profile');
    let menu = this.store.getStore('mt-menu');
    this.isMobil = window.innerWidth < 769;

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
      this.nav.navigateRoot('configuracion');
    } else {
      this.renderNavBar = false;
      this.nav.navigateRoot('login');
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
            if (!this.store.getStore('tn')) {
              this.renderNavBar = false;
              this.nav.navigateRoot('login');
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
    this.renderNavBar = false;
    this.nav.navigateRoot('login');
    this.isVisiblePopover = false;
    this.service.onDisconnectSocket.emit(true);
  }

  onNavigatorRoute(route) {
    this.nav.navigateRoot(route);
  }

}
