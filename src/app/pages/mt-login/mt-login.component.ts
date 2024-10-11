import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';

@Component({
  selector: 'app-mt-login',
  templateUrl: './mt-login.component.html',
  styleUrls: ['./mt-login.component.scss'],
})
export class MtLoginComponent implements OnInit {

  userName: string = "";
  password: string = "";

  constructor(
    private shrService: ShareService,
    private nav: NavController,
    private store: StorageService
  ) { }

  ngOnInit() {
    /* document.addEventListener('keydown', (event) => {
       var keyValue = event.key;
       if (keyValue == "Enter") {
         this.onLogin();
       }
     }, false);*/
  }


  onLogin() {
    this.shrService.createToken(this.userName, this.password).then((token) => {
      if (token) {
        this.onRouteDefault();
      }
    });
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onRouteDefault() {
    let profileUser = this.store.getStore('mt-profile');
    if ((profileUser || {}).mt_nivel == "INVENTARIO" || (profileUser || {}).mt_nivel == "VSBA" || (profileUser || {}).mt_nivel == "BBW" || (profileUser || {}).code) {
      this.nav.navigateRoot('inventario');
    } else if ((profileUser || {}).mt_nivel == "SISTEMAS") {
      this.nav.navigateRoot('comprobantes');
    } else if ((profileUser || {}).mt_nivel == "RRHH") {
      this.nav.navigateRoot('asistencia');
    }

  }

}
