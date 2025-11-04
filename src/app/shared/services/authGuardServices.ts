import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../utils/storage';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  constructor(private store: StorageService, private nav: NavController,) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    if (!this.store.getStore('tn')) {
      let token = ((route || {}).params || {})['token'] || '';
      if (token) {
        this.store.setStore('tn', token);
        return true;
      } else {
        this.nav.navigateRoot('login');
        return false;
      }
    } else {
      return true;
    }

  }
}