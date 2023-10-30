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
  headList: Array<any> = [
    { value: "Descripcion" },
    { value: "Ruta" }
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
        ruta: this.nombreRuta
      }
    );
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
            description: menu.DESCRIPTION_MENU,
            ruta: '****'
          }
        );
      })
    });
  }



}
