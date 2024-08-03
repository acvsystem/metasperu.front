import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService';
import { io } from "socket.io-client";
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';

import { StorageService } from 'src/app/utils/storage';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'mt-configuracion',
  templateUrl: './mt-configuracion.component.html',
  styleUrls: ['./mt-configuracion.component.scss'],
})
export class MtConfiguracionComponent implements OnInit {

  menuAllList: Array<any> = [];
  menuUserList: Array<any> = [];

  notOptionMenuUserList: Array<any> = [];
  optionMenuUserList: Array<any> = [];

  notOptionMenuKey: Array<any> = [];
  optionMenuKey: Array<any> = [];

  menuList: Array<any> = [
    "Envio de correo",
    "Programacion de tarea"
  ];

  lstRol: string = "";

  emailList: Array<any> = [];
  emailSend: string = "";
  isEmailDelete: boolean = false;
  userEmailService: string = "";
  passEmailService: string = "";
  dataEmailService: Array<any> = [];
  dataEmailListSend: Array<any> = [];
  selectOption: Array<any> = [];
  emailLinkRegistro: string = "";
  hashAgente: string = "";
  nombreMenu: string = "";
  routeMenu: string = "";
  token: any = localStorage.getItem('tn');
  optionNivelList: Array<any> = [];
  selectOptionNivel = {};
  optionListHashNivel: Array<any> = [
    { id: "ADMINSITRADOR", value: "ADMINITRADOR" },
    { id: "SERVER", value: "SERVER" },
    { id: "AGENTE", value: "AGENTE" },
    { id: "SUNAT", value: "SUNAT" },
    { id: "DOCUMENTO", value: "DOCUMENTO" }
  ];

  selectNivel: any = {};
  selectedHashNivel: string = "";
  tiendasList: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY', progress: -1 },
    { key: "9N", value: "VSBA MALL AVENTURA", progress: -1 },
    { key: "7J", value: "BBW MALL AVENTURA", progress: -1 },
    { key: '7E', value: 'BBW LA RAMBLA', progress: -1 },
    { key: '9D', value: 'VS LA RAMBLA', progress: -1 },
    { key: '9B', value: 'VS PLAZA NORTE', progress: -1 },
    { key: '7C', value: 'BBW SAN MIGUEL', progress: -1 },
    { key: '9C', value: 'VS SAN MIGUEL', progress: -1 },
    { key: '7D', value: 'BBW SALAVERRY', progress: -1 },
    { key: '9I', value: 'VS SALAVERRY', progress: -1 },
    { key: '9G', value: 'VS MALL DEL SUR', progress: -1 },
    { key: '9H', value: 'VS PURUCHUCO', progress: -1 },
    { key: '9M', value: 'VS ECOMMERCE', progress: -1 },
    { key: '7F', value: 'BBW ECOMMERCE', progress: -1 },
    { key: '9K', value: 'VS MEGA PLAZA', progress: -1 },
    { key: '9L', value: 'VS MINKA', progress: -1 },
    { key: '9F', value: 'VSFA JOCKEY FULL', progress: -1 },
    { key: '7A7', value: 'BBW ASIA', progress: -1 },
    { key: '9P', value: 'VS MALL PLAZA', progress: -1},
    { key: '7I', value: 'BBW MALL PLAZA', progress: -1}
  ];

  optionListRol: Array<any> = [];
  vListaClientes: String = "";
  socket = io('http://38.187.8.22:3200', { query: { code: 'app', token: this.token } });

  constructor(private modalCtrl: ModalController, private service: ShareService, private store: StorageService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    /* this.onListPerfil();
     this.onListConfiguration();
     this.onListMenu();
     this.onListRoles();*/
    this.socket.on('update:file:status', (status) => {
      let index = this.tiendasList.findIndex((tienda) => tienda.key == status.serie);
      (this.tiendasList[index] || {})['progress'] = (status || {}).status == 100 ? 0 : (status || {}).progress;
    });

    this.onListClient();
  }

  onSaveClientes() {
    let parms = {
      url: '/security/service/cliente/list/delete',
      body: [{ cliente: this.vListaClientes }]
    };
    console.log(parms);
    this.service.post(parms).then((response) => {
      console.log(response);
    });
  }

  onListClient() {
    let parms = {
      url: '/security/service/cliente/list/delete'
    };
    this.service.get(parms).then((response) => {
      this.vListaClientes = response.toString();
      console.log(response.toString());
    });
  }

  public onValueChange(event: Event): void {
    const value = (event.target as any).value;
    this[event.target['id']] = value;
  }



  onUpdateAgentFront() {
    let body = {
      hash: this.hashAgente,
      fileName: this.selectedHashNivel == "SUNAT" ? "SUNAT.zip" : this.selectedHashNivel == "AGENTE" ? "agnFront.py" : "PLUGIN_VALIDACION.zip"
    }

    this.socket.emit('update:file:FrontAgent', "");
  }

  onAddEmailList() {
    if (this.emailSend.length) {
      let index = this.emailList.findIndex(email => (email || {}).name == this.emailSend);

      if (index == -1 || !this.emailList.length) {
        let parms = {
          url: '/settings/service/email/save',
          body: [{
            name: this.emailSend
          }]
        };

        this.service.post(parms).then((response) => {
          this.emailList.push(
            { name: this.emailSend }
          );
          this.emailSend = "";
        });
      }
    }
  }

  onChangeInput(data: any) {
    this.isEmailDelete = false;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
    console.log(data);
    this.onListMenuUsuario().then((menu: Array<any>) => {
      this.notOptionMenuUserList = [];
      this.optionMenuUserList = [];
      this.optionMenuUserList = menu;

      this.menuAllList.filter((allMenu) => {
        if (menu.indexOf(allMenu) == -1) {
          this.notOptionMenuUserList.push(allMenu);
        }
      });
    }).catch((rej) => {
      this.notOptionMenuUserList = [];
      this.optionMenuUserList = [];
      this.notOptionMenuUserList = [...this.menuAllList];
    });
  }

  onSelectEmail(value) {
    this.isEmailDelete = true;
    this.emailSend = value;
  }

  onDeleteEmail() {
    this.emailList = this.emailList.filter((email) => (email || {}).name !== this.emailSend);
    let parms = {
      url: '/settings/service/email/delete',
      body: [{
        name: this.emailSend
      }]
    };

    this.service.post(parms).then((response) => {

    });
  }

  onSaveConfiguration() {
    let parms = {
      url: '/settings/service/email',
      body: { "usuario": this.userEmailService, "password": this.passEmailService }
    };

    this.service.post(parms).then((response) => {
    });
  }

  onSaveEmailSend() {
    let parms = {
      url: '/settings/service/email/sendList',
      body: this.emailList
    };

    this.service.post(parms).then((response) => {

    });
  }

  onSendLinkRegister() {
    const self = this;
    var nivelUser = self.selectNivel;

    let parms = {
      url: '/settings/service/email/register',
      body: { path: 'create-account', email: this.emailLinkRegistro, nivel: nivelUser }
    };

    this.service.post(parms).then((response) => {

    });
  }

  onListRoles() {
    const self = this;
    let parms = {
      url: '/settings/service/lista/roles'
    };

    this.service.get(parms).then((response) => {
      let rolesList = (response || {}).data || [];
      (rolesList || []).filter((rol) => {
        self.optionNivelList.push(
          { key: (rol || {}).id_rol, value: (rol || {}).nom_rol });
      });
      console.log(self.optionNivelList);
      // self.cdr.detectChanges();
    });
  }

  onListConfiguration() {
    let parms = {
      url: '/settings/service/email/sendList'
    };

    this.service.get(parms).then((response) => {
      this.dataEmailService = (response || []).emailService || [];
      this.dataEmailListSend = (response || []).emailList || [];

      this.dataEmailListSend.filter((dataList) => {
        this.emailList.push({ name: (dataList || {}).email });
      });

      this.dataEmailService.filter((dataService) => {
        this.userEmailService = (dataService || {}).email;
        this.passEmailService = (dataService || {}).key;
      });


    });
  }

  onListMenuUsuario() {

    return new Promise((resolve, reject) => {
      this.optionMenuUserList = [];
      let parms = {
        url: '/settings/service/lista/menu/user',
        body: {
          ID_NVL_ACCESS: this.lstRol
        }
      };

      this.service.post(parms).then(async (response) => {
        let menuUser = (response || {}).data || [];
        let menu = [];
        menuUser.filter((menuUser) => {
          menu.push((menuUser || {}).NOMBRE_MENU);
        });

        if (menu.length) {
          resolve(menu);
        } else {
          reject([])
        }

      });
    });

  }

  onListMenu() {
    this.menuAllList = [];

    let parms = {
      url: '/settings/service/lista/menu'
    };

    this.service.get(parms).then((response) => {
      let dateMenuList = (response || {}).data || [];
      this.notOptionMenuUserList = [];

      dateMenuList.filter((menu) => {
        this.menuAllList.push(menu.NOMBRE_MENU);
        this.optionMenuKey.push(menu);
      })
    });
  }

  onListPerfil() {
    this.menuAllList = [];

    let parms = {
      url: '/settings/service/lista/perfil/user'
    };

    this.service.get(parms).then((response) => {
      let datePerfilList = (response || {}).data || [];

      datePerfilList.filter((perfil) => {
        this.optionListRol.push({
          key: perfil.ID_NVL_ACCESS,
          value: perfil.NM_NIVEL
        });
      })
    });
  }

  onSendTestEmail() {
    let parms = {
      url: '/settings/service/email/sendTest',
      body: []
    };

    this.service.post(parms).then((response) => {

    });
  }

  onGenerarHash() {
    let parms = {
      url: '/security/create/hash/agente',
      body: { nivel: this.selectedHashNivel }
    };

    this.service.post(parms).then((response) => {
      let success = (response || {}).success || false;

      if (success) {

        this.hashAgente = (response || {}).hash;
      }
    });
  }

  onSaveMenuUser() {

    let menuUser = [];
    let notOption = [];

    this.optionMenuUserList.filter((op) => {
      let option = this.optionMenuKey.find((mk) => mk.NOMBRE_MENU == op);
      menuUser.push(option['ID_MENU']);
    });

    this.notOptionMenuUserList.filter((op) => {
      let option = this.optionMenuKey.find((mk) => mk.NOMBRE_MENU == op);
      notOption.push(option['ID_MENU']);
    });


    let parms = {
      url: '/security/create/menu/profile',
      body: {
        idProfile: this.lstRol,
        menu: menuUser,
        noOption: notOption
      }
    };

    this.service.post(parms).then((response) => {

    });
  }

  async openModalMenuList() {
    let modal = await this.modalCtrl.create({
      component: MtModalContentComponent,
      componentProps: {
        nameSection: 'addEmployee',
        title: 'Registrar empleado',
        bodyContent: 'mt-menu-crud'
      },
      cssClass: 'mt-modal'
    });

    modal.present();
  }

}