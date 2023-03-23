import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService'
import { NavController } from '@ionic/angular';
import { StorageService } from '../../utils/storage';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'mt-create-user',
  templateUrl: './mt-create-user.component.html',
  styleUrls: ['./mt-create-user.component.scss'],
})
export class MtCreateUserComponent implements OnInit {


  userName: string = "";
  password: string = "";
  nombreProfile: string = "";
  apellidoProfile: string = "";

  constructor(
    private shrService: ShareService,
    private nav: NavController,
    private store: StorageService,
    private navEnd: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.navEnd.snapshot.paramMap.get('token'));
  }


  onRegistrar() {
    this.nav.navigateRoot('login');
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

}
