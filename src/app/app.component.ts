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
  }

  ngOnInit() {
    let screen = window.innerWidth < 769;
    if (screen) {

    }
    this.service.eventIsLoggedIn.subscribe((isLogin) => {
      this.renderNavBar = isLogin;
    });

    if (this.store.getStore('tn')) {
      this.renderNavBar = true;
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

}
