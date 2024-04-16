import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';

@Component({
  selector: 'mt-menu-crud',
  templateUrl: './mt-menu-crud.component.html',
  styleUrls: ['./mt-menu-crud.component.scss'],
})
export class MtMenuCrudComponent implements OnInit {
  nombreMenu: string = "";
  nombreRuta: string = "";
  nombreIco: string = "";
  headList: Array<any> = [
    { value: "Descripcion" },
    { value: "Ruta" },
    { value: "ico" }
  ];
  dataPaginationList: Array<any> = [];

  constructor(private service: ShareService) { }

  ngOnInit() {
    this.onListMenu();
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }


  onAddMenu() {
    this.dataPaginationList.push(
      {
        description: this.nombreMenu.toUpperCase(),
        ruta: this.nombreRuta,
        ico: this.nombreIco
      }
    );

    let bodyRegister = {
      menu: this.nombreMenu.toUpperCase(),
      ruta: this.nombreRuta,
      ico: this.nombreIco
    }

    let parms = {
      url: '/settings/service/registrar/menu',
      body: bodyRegister
    };


    this.service.post(parms).then((response) => {
    });

  }

  onDeleteMenu(id) {
    let bodyRegister = {
      id: id
    }

    let parms = {
      url: '/settings/service/delete/menu',
      body: bodyRegister
    };


    this.service.post(parms).then((response) => {
      this.onListMenu();
    });
  }

  onListMenu() {
    this.dataPaginationList = [];

    let parms = {
      url: '/settings/service/lista/menu'
    };

    this.service.get(parms).then((response) => {
      let dateMenuList = (response || {}).data || [];

      dateMenuList.filter((menu) => {
        this.dataPaginationList.push(
          {
            id: menu.ID_MENU,
            description: menu.NOMBRE_MENU,
            ruta: menu.RUTA,
            ico: menu.ICO
          }
        );
      })
    });
  }

  onSelected(ev) {
    console.log(ev);
  }



}
