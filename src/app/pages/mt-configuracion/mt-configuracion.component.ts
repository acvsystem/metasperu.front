import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from '../../services/shareService';
import { io } from "socket.io-client";
import { ModalController } from '@ionic/angular';
import { MtModalContentComponent } from '../../components/mt-modal-content/mt-modal-content.component';

import { StorageService } from 'src/app/utils/storage';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'mt-configuracion',
  templateUrl: './mt-configuracion.component.html',
  styleUrls: ['./mt-configuracion.component.scss'],
})
export class MtConfiguracionComponent implements OnInit {

  displayedColumnsSession: string[] = ['id_session', 'email', 'ip', 'divice'];
  displayedColumnsAuthSession: string[] = ['id_auth_session', 'email', 'codigo', 'accion'];
  displayedColumnsUsers: string[] = ['usuario', 'password', 'page_default', 'email', 'nivel'];
  displayedColumnsCajas: string[] = ['nro_caja', 'mac', 'serie_tienda', 'database_instance', 'database_name', 'cod_tipo_factura', 'cod_tipo_boleta', 'property_stock', 'name_excel_stock', 'ruta_download_agente', 'ruta_download_sunat'];
  dataViewSession: Array<any> = [];
  dataViewAuthSession: Array<any> = [];
  dataViewUser: Array<any> = [];
  dataViewCaja: Array<any> = [];
  dataViewPermiso: Array<any> = [];
  dataSourceSession = new MatTableDataSource<any>(this.dataViewSession);
  dataSourceAuthSession = new MatTableDataSource<any>(this.dataViewAuthSession);
  dataSourceUser = new MatTableDataSource<any>(this.dataViewUser);
  dataSourceCajas = new MatTableDataSource<any>(this.dataViewCaja);
  dataSourcePermiso = new MatTableDataSource<any>(this.dataViewPermiso);

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
  filterTienda: string = "";

  emailList: Array<any> = [];
  emailSend: string = "";
  isEmailDelete: boolean = false;
  isAddTienda: boolean = false;
  userEmailService: string = "";
  passEmailService: string = "";
  vAddSerieTienda: string = "";
  vAddNombreTienda: string = "";
  cboTienda: string = "";
  vEmail: string = "";
  cboTipo: string = "";
  tipoCuenta: string = "";
  dataEmailService: Array<any> = [];
  dataEmailListSend: Array<any> = [];
  onListPageDefault: Array<any> = [];
  onListTipoCuenta: Array<any> = [];
  cboListTienda: Array<any> = [];
  selectOption: Array<any> = [];
  emailLinkRegistro: string = "";
  hashAgente: string = "";
  nombreMenu: string = "";
  routeMenu: string = "";
  vUsuario: string = "";
  vPassword: string = "";
  isSession: boolean = false;
  isUsers: boolean = false;
  isCajas: boolean = false;
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
  onListPlugin: Array<any> = [
    { key: 'python', value: 'PYTHON' },
    { key: 'sunat', value: 'SUNAT' },
    { key: "validacion", value: "VALIDACION" }
  ];
  selectNivel: any = {};
  selectedHashNivel: string = "";
  tiendasList: Array<any> = [];

  vSerieTienda: String = "";
  vNumeroCaja: String = "";
  vMac: String = "";
  vInstanciaDataBase: String = "";
  vNameDataBase: String = "";
  vCodigoTipoFactura: String = "";
  vCodigoTipoBoleta: String = "";
  vPropertyStock: String = "";
  vAsuntoEmailStock: String = "";
  vRutaDownloadAgente: String = "";
  vRutaDownloadSunat: String = "";
  vNameExcelStock: String = "";

  optionListRol: Array<any> = [];
  vListaClientes: String = "";
  socket = io('http://38.187.8.22:3200', { query: { code: 'app', token: this.token } });
  @ViewChild(MatPaginator) paginator_user: MatPaginator;
  @ViewChild(MatSort) sort_user: MatSort;

  @ViewChild(MatPaginator) paginator_session: MatPaginator;
  @ViewChild(MatSort) sort_session: MatSort;

  @ViewChild(MatPaginator) paginator_caja: MatPaginator;
  @ViewChild(MatSort) sort_caja: MatSort;


  constructor(private modalCtrl: ModalController, private service: ShareService, private store: StorageService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    /* this.onListPerfil();
     this.onListConfiguration();
     this.onListMenu();
     this.onListRoles();*/
    this.onListTienda();
    this.socket.on('update:file:status', (status) => {
      let index = this.tiendasList.findIndex((tienda) => tienda.key == status.serie);
      (this.tiendasList[index] || {})['progress'] = (status || {}).status == 100 ? 0 : (status || {}).progress;
    });

    this.onListClient();


    this.socket.on('refreshSessionView', (status) => {
      this.onListSession();
      this.onListAuthSession();
    });

    this.onListPageDefault = [
      { key: 'comprobantes', value: 'comprobantes' },
      { key: 'inventario', value: 'inventario' },
      { key: 'configuracion', value: 'configuracion' },
      { key: 'asistencia', value: 'asistencia' },
      { key: 'horario', value: 'horario' },
      { key: 'auth-hora-extra', value: 'auth-hora-extra' },
      { key: 'panel-horario', value: 'panel-horario' },
      { key: 'planilla', value: 'planilla' }
    ];

    this.onListTipoCuenta = [
      { key: 'SISTEMAS', value: 'SISTEMAS' },
      { key: 'INVENTARIO', value: 'INVENTARIO' },
      { key: 'RRHH', value: 'RRHH' },
      { key: 'TIENDA', value: 'TIENDA' },
      { key: 'GERENCIA', value: 'GERENCIA' },
    ];
  }

  onListSession() {
    let parms = {
      url: '/session_login/view'
    };

    this.service.get(parms).then((response) => {
      this.dataViewSession = (response || [])['data'];
      this.dataSourceSession = new MatTableDataSource(this.dataViewSession);
      this.dataSourceSession.paginator = this.paginator_session;
      this.dataSourceSession.sort = this.sort_session;
    });
  }

  onListAuthSession() {
    let parms = {
      url: '/auth_session/view'
    };

    this.service.get(parms).then((response) => {
      this.dataViewAuthSession = (response || [])['data'];
      this.dataSourceAuthSession = new MatTableDataSource(this.dataViewAuthSession);
    });
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

  onUserList() {
    let parms = {
      url: '/login/users'
    };

    this.service.get(parms).then((response) => {
      this.dataViewUser = (response || [])['data'];
      this.dataSourceUser = new MatTableDataSource(this.dataViewUser);
      this.dataSourceUser.paginator = this.paginator_user;
      this.dataSourceUser.sort = this.sort_user;
    });
  }

  onCall(ev) {
    if (ev.tab.textLabel == "Usuario Sistema") {
      this.isSession = false;
      this.isUsers = true;
      this.onUserList();

      this.dataSourceSession = new MatTableDataSource<any>([]);
      this.dataSourceSession.paginator = this.paginator_session;
      this.dataSourceSession.sort = this.sort_session;
      this.dataSourceAuthSession = new MatTableDataSource<any>([]);
    }

    if (ev.tab.textLabel == "Session") {
      this.isSession = true;
      this.isUsers = false;
      this.onListSession();
      this.onListAuthSession();

      this.dataSourceUser = new MatTableDataSource<any>([]);
      this.dataSourceUser.paginator = this.paginator_user;
      this.dataSourceUser.sort = this.sort_user;
    }

    if (ev.tab.textLabel == "Registro Tiendas") {
      this.isSession = false;
      this.isUsers = false;
      this.isCajas = true;
      this.onListCajas();

      this.dataSourceCajas = new MatTableDataSource<any>([]);
      this.dataSourceCajas.paginator = this.paginator_caja;
      this.dataSourceCajas.sort = this.sort_caja;
    }
    if (ev.tab.textLabel == "Horario y papeletas") {
      this.isSession = false;
      this.isUsers = false;
      this.isCajas = false;
      this.onPermisosTienda();

      this.dataSourcePermiso = new MatTableDataSource<any>([]);
    }

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

    this.socket.emit('update:file:FrontAgent', this.cboTipo);
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

    if (index != "cboTipo" && index != 'cboTienda') {
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

    if (index == 'cboTienda') {
      this.vSerieTienda = this[index];
    }

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

  onListTienda() {
    const self = this;
    let parms = {
      url: '/security/lista/registro/tiendas'
    };

    this.service.get(parms).then((response) => {
      let tiendaList = (response || {}).data || [];
      this.cboListTienda = [];
      this.tiendasList = [];

      (tiendaList || []).filter((tienda) => {

        this.cboListTienda.push({ key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION });

        this.tiendasList.push(
          { key: (tienda || {}).SERIE_TIENDA, value: (tienda || {}).DESCRIPCION, progress: -1 });
      });
    });
  }

  onAddTiendaView() {
    this.isAddTienda = true;
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

  onRegistrarTienda() {
    let parms = {
      url: '/security/add/registro/tiendas',
      body: [{
        serie_tienda: this.vAddSerieTienda || "",
        nombre_tienda: this.vAddNombreTienda || ""
      }]
    };
    this.service.post(parms).then((response) => {
      this.onListTienda();
      this.vAddSerieTienda = "";
      this.vAddNombreTienda = "";
      this.service.toastSuccess("Registrado con exito...!!", "Tienda");
    });
  }

  onPermisosTienda() {
    let parms = {
      url: '/security/configuracion/permisos/hp'
    };
    this.service.get(parms).then((response) => {
      this.dataViewPermiso = response || [];
      this.dataSourcePermiso = new MatTableDataSource(this.dataViewPermiso);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = filterValue.trim().toLowerCase();
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

  onDeleteAuth(id_session) {
    let parms = {
      url: '/auth_session/delete',
      body: {
        id: id_session
      }
    };

    this.service.post(parms).then((response) => {
      this.onListAuthSession();
    });
  }



  onRegistrarCaja() {
    let parms = {
      url: '/security/add/tienda',
      body: [{
        nro_caja: this.vNumeroCaja || "",
        mac: this.vMac || "",
        serie_tienda: this.vSerieTienda || "",
        database_instance: this.vInstanciaDataBase || "",
        database_name: this.vNameDataBase || "",
        cod_tipo_factura: this.vCodigoTipoFactura || "",
        cod_tipo_boleta: this.vCodigoTipoFactura || "",
        property_stock: this.vPropertyStock || "",
        asunto_email_stock: this.vAsuntoEmailStock || "",
        name_excel_stock: this.vNameExcelStock || "",
        ruta_download_agente: this.vRutaDownloadAgente || "",
        ruta_download_sunat: this.vRutaDownloadSunat || ""
      }]
    };
    console.log(parms);
    this.service.post(parms).then((response) => {
      this.service.toastSuccess("Registrado con exito...!!", "Caja");
    });
  }

  onListCajas() {
    let parms = {
      url: '/security/lista/tienda'
    };
    this.service.get(parms).then((response) => {
      this.dataViewCaja = (response || [])['data'];
      this.dataSourceCajas = new MatTableDataSource(this.dataViewCaja);
      this.dataSourceCajas.paginator = this.paginator_caja;
      this.dataSourceCajas.sort = this.sort_caja;
    });
  }

  applyFilterPapeleta(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCajas.filter = filterValue.trim().toLowerCase();
  }

}