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
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalConstants } from '../../const/globalConstants';

@Component({
  selector: 'mt-configuracion',
  templateUrl: './mt-configuracion.component.html',
  styleUrls: ['./mt-configuracion.component.scss'],
})
export class MtConfiguracionComponent implements OnInit {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  displayedColumnsSession: string[] = ['id_session', 'email', 'ip', 'divice'];
  displayedColumnsAuthSession: string[] = ['id_auth_session', 'email', 'codigo', 'accion'];
  displayedColumnsUsers: string[] = ['usuario', 'password', 'page_default', 'email', 'nivel', 'accion'];
  displayedColumnsCajas: string[] = ['nro_caja', 'mac', 'serie_tienda', 'database_instance', 'database_name', 'cod_tipo_factura', 'cod_tipo_boleta', 'property_stock', 'name_excel_stock', 'ruta_download_agente', 'ruta_download_sunat'];
  displayedColumnsPermiso: string[] = ['codigo', 'tienda', 'horario_permiso', 'papeleta_permiso'];
  displayedColumnsPlugin: string[] = ['select', 'tienda', 'nro_caja', 'mac', 'plugins_instalados', 'ip', 'progreso', 'online'];


  dataViewSession: Array<any> = [];
  dataViewAuthSession: Array<any> = [];
  dataViewUser: Array<any> = [];
  dataViewCaja: Array<any> = [];
  dataViewPermiso: Array<any> = [];
  dataViewTolerancia: Array<any> = [];
  dataViewEquipos: Array<any> = [];
  dataOrigicalEq: Array<any> = [];
  dataSourceSession = new MatTableDataSource<any>(this.dataViewSession);
  dataSourceAuthSession = new MatTableDataSource<any>(this.dataViewAuthSession);
  dataSourceUser = new MatTableDataSource<any>(this.dataViewUser);
  dataSourceCajas = new MatTableDataSource<any>(this.dataViewCaja);
  dataSourcePermiso = new MatTableDataSource<any>(this.dataViewPermiso);
  dataSourceEquipos = new MatTableDataSource<any>(this.dataViewEquipos);
  selection = new SelectionModel<any>(true, []);

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
  vReferencia: string = "";
  vTiempoTolerancia: string = "";
  idEditUSer: string = "";
  emailList: Array<any> = [];
  emailSend: string = "";
  isEmailDelete: boolean = false;
  isAddTienda: boolean = false;
  isResetCalendar: boolean = false;
  isEditUser: boolean = false;
  userEmailService: string = "";
  passEmailService: string = "";
  vAddSerieTienda: string = "";
  vAddNombreTienda: string = "";
  optionDefaultPage: Array<any> = [];
  optionDefaultNivel: Array<any> = [];
  cboNivel: string = "";
  cboTienda: string = "";
  vEmail: string = "";
  cboTipo: string = "";
  tipoCuenta: string = "";
  cboPageDefault: string = "";
  cboNivelUser: string = "";
  cboPlugin: string = "";
  dataEmailService: Array<any> = [];
  dataEmailListSend: Array<any> = [];
  onListPageDefault: Array<any> = [];
  onListTipoCuenta: Array<any> = [];
  cboListTienda: Array<any> = [];
  selectOption: Array<any> = [];
  dataMenuList: Array<any> = [];
  dataViewMenu: Array<any> = [];
  dataNivelList: Array<any> = [];
  dataNivelListOne: Array<any> = [];
  dataPermiso: Array<any> = [];
  dataDeafultPage: Array<any> = [];
  emailLinkRegistro: string = "";
  hashAgente: string = "";
  nombreMenu: string = "";
  routeMenu: string = "";
  vUsuario: string = "";
  vPassword: string = "";
  isSession: boolean = false;
  isUsers: boolean = false;
  isCajas: boolean = false;
  isHp: boolean = false;
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

  onListPlugin: Array<any> = [];

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
  vUsuarioNew: String = "";
  vAsuntoEmailStock: String = "";
  vRutaDownloadAgente: String = "";
  vRutaDownloadSunat: String = "";
  vNameExcelStock: String = "";
  vNivel: String = "";
  vMenu: String = "";
  vRutaMenu: String = "";
  optionListRol: Array<any> = [];
  vListaClientes: String = "";
  isOnlineTienda: Boolean = false;
  cboUnidServicio: String = "";
  onListUndServicio: Array<any> = [
    { key: 'VS', value: 'VICTORIA SECRET' },
    { key: 'BBW', value: 'BATH AND BODY WORKS' }
  ];

  socket = io(GlobalConstants.backendServer, { query: { code: 'app', token: this.token } });

  @ViewChild(MatPaginator) paginator_user: MatPaginator;
  @ViewChild(MatSort) sort_user: MatSort;

  @ViewChild(MatPaginator) paginator_session: MatPaginator;
  @ViewChild(MatSort) sort_session: MatSort;

  @ViewChild(MatPaginator) paginator_caja: MatPaginator;
  @ViewChild(MatSort) sort_caja: MatSort;

  @ViewChild(MatPaginator) paginator_equipos: MatPaginator;
  @ViewChild(MatSort) sort_paginator_equipos: MatSort;

  constructor(private modalCtrl: ModalController, private service: ShareService, private store: StorageService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    /* this.onListPerfil();
     this.onListConfiguration();
     this.onListMenu();
     this.onListRoles();*/
    this.onMenuList();
    this.onNivelesList();
    this.onListTienda();
    this.onEquiposList();
    this.onPluginList();

    this.socket.on('desconexion:eqp:send', (qep) => {

      let index = this.dataViewEquipos.findIndex((eqp) => eqp.MAC == ((qep || [])[0] || {}).mac.toUpperCase());

      (this.dataViewEquipos[index] || {})['ONLINE'] = 'false';

      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;
    });

    this.socket.on('update:file:status', (status) => {

      let index = this.dataViewEquipos.findIndex((eqp) => eqp.MAC == status.mac.toUpperCase());

      (this.dataViewEquipos[index] || {})['progress'] = (status || {}).status;

      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;
    });

    this.socket.on('status:EQP:send', (status) => {
      let index = this.dataViewEquipos.findIndex((eqp) => eqp.MAC == status.mac.toUpperCase());

      (this.dataViewEquipos[index] || {})['IP'] = status.ip;
      (this.dataViewEquipos[index] || {})['ONLINE'] = status.online;
      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;
      /*this.dataViewEquipos = [];
      this.dataViewEquipos = (response || [])['data'];
      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;*/
    });

    this.onListClient();
    this.onTiempoTolerancia();

    this.socket.on('refreshSessionView', (status) => {
      this.onListSession();
      this.onListAuthSession();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceEquipos.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceEquipos.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

    this.service.post(parms).then((response) => {

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

  onEquiposList() {
    let parms = {
      url: '/equipos/lista'
    };

    this.service.get(parms).then((response) => {
      this.dataViewEquipos = [];
      this.dataOrigicalEq = [];
      this.dataViewEquipos = (response || [])['data'];
      this.dataOrigicalEq = (response || [])['data'];
      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;
    });
  }


  onPluginList() {
    let parms = {
      url: '/plugin/lista'
    };

    this.service.get(parms).then((response) => {
      let data = (response || {}).data;

      (data || []).filter((dt) => {
        this.onListPlugin.push({ key: dt.NOMBRE_FILE, value: dt.NOMBRE_PLUGIN });
      });

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
      this.isHp = true;
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
    });
  }

  public onValueChange(event: Event): void {
    const value = (event.target as any).value;
    this[event.target['id']] = value;
  }

  onUpdatePlugin() {
    let dataSelection = this.selection['_selected'];
    (dataSelection || []).filter((ds) => {
      this.onUpdateAgentFront(ds['MAC']);
    });
  }

  onUpdateAgentFront(macEqp) {
    let body = {
      hash: this.hashAgente,
      fileName: this.cboPlugin,
      mac: (macEqp || "").toLowerCase()
    }

    this.socket.emit('update:file:FrontAgent', body);
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

    if (index != "cboUnidServicio" && index != "cboPlugin" && index != "cboTipo" && index != 'cboTienda' && index != 'cboNivel' && index != 'cboPageDefault' && index != 'cboNivelUser') {
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

    if (index == 'cboNivel') {
      this.onConsultaMenuNivel((selectData || {}).key);
    }

    if (index == 'cboPlugin') {
      this.onGenerarHash(this[index]);
    }

    if (index == 'cboUnidServicio') {
      this.dataViewEquipos = this.dataOrigicalEq.filter((dt) => dt.UNID_SERVICIO == this[index]);
      this.dataSourceEquipos = new MatTableDataSource([]);
      this.dataSourceEquipos = new MatTableDataSource(this.dataViewEquipos);
      this.dataSourceEquipos.paginator = this.paginator_equipos;
      this.dataSourceEquipos.sort = this.sort_paginator_equipos;
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

  onGenerarHash(nivel) {
    let parms = {
      url: '/security/create/hash/agente',
      body: { nivel: nivel }
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

  onUpdatePermisoHP(row, isPermiso_h, isPermiso_p) {
    let parms = {
      url: '/security/configuracion/permisos/hp',
      body: [{
        id: (row || {}).ID_CONF_HP,
        isPermiso_h: isPermiso_h ? 1 : 0,
        isPermiso_p: isPermiso_p ? 1 : 0,
      }]
    };
    this.service.post(parms).then((response) => {
      this.onPermisosTienda();
      this.service.toastSuccess("Actualizado con exito...!!", "Permisos");
    });

  }

  onTiempoTolerancia() {
    let parms = {
      url: '/security/configuracion/tiempo/tolerancia'
    };
    this.service.get(parms).then((response) => {
      this.dataViewTolerancia = response;
    });
  }

  onRegTiempoTolerancia() {
    let parms = {
      url: '/security/configuracion/tiempo/tolerancia',
      body: [{
        referencia: this.vReferencia,
        tiempo_tolerancia: this.vTiempoTolerancia,
      }]
    };
    this.service.post(parms).then((response) => {
      this.onTiempoTolerancia();
      this.vReferencia = "";
      this.vTiempoTolerancia = "";
      this.isResetCalendar = true;
      this.service.toastSuccess("Registrado con exito...!!", "Tiempo tolerancia");
    });
  }

  onCaledar(ev) {
    if (ev.isTime) {
      this[ev.id] = ev.value;
    }
  }

  onSelectTolerancia(data) {
    this.vReferencia = (data || {}).REFERENCIA;
  }

  onMenuList() {
    return new Promise((resolve, reject) => {
      let parms = {
        url: '/menu/sistema/lista'
      };
      this.service.get(parms).then((response) => {
        this.dataMenuList = response;
        this.dataViewMenu = [];
        this.dataDeafultPage = [];
        this.dataMenuList.filter((menu, i) => {
          this.dataViewMenu.push((menu || {}).NOMBRE_MENU);
          this.dataDeafultPage.push({ key: (menu || {}).RUTA, value: (menu || {}).RUTA });
          if (this.dataMenuList.length - 1 == i) {
            resolve(this.dataViewMenu);
          }
        });


      });
    });
  }


  onNivelesList() {
    let parms = {
      url: '/menu/sistema/niveles'
    };
    this.service.get(parms).then((response) => {
      response.filter((nivel) => {
        this.dataNivelList.push({ key: nivel.NIVEL_DESCRIPCION, value: nivel.NIVEL_DESCRIPCION });
      });
    });
  }

  onConsultaMenuNivel(nivel) {
    let parms = {
      url: '/menu/sistema/consulta',
      body: [{
        nivel: nivel || ""
      }]
    };
    this.service.post(parms).then((response) => {
      this.dataNivelListOne = [];
      this.dataPermiso = response;
      this.onMenuList().then((menuList: any) => {
        (response || []).filter((nivel) => {
          this.dataViewMenu = this.dataViewMenu.filter((menu) => menu != nivel.NOMBRE_MENU);

          this.dataNivelListOne.push(nivel.NOMBRE_MENU);
        });
      });
    });
  }


  onAddOpcionNivel(id_menu, nivel) {
    let parms = {
      url: '/menu/sistema/add/permisos',
      body: [{
        id_menu: id_menu,
        nivel: nivel
      }]
    };
    this.service.post(parms).then((response) => {
      this.service.toastSuccess('Opcion agregada con exito..!!', 'Permisos');
    });
  }

  onNewNivel() {
    let parms = {
      url: '/menu/sistema/niveles',
      body: [{
        nivel: this.vNivel
      }]
    };
    this.service.post(parms).then((response) => {
      this.onNivelesList();
      this.service.toastSuccess('Registrado con exito..!!', 'Nivel');
    });
  }

  onNewMenu() {
    let parms = {
      url: '/menu/add/sistema',
      body: [{
        nombre_menu: this.vMenu,
        ruta: this.vRutaMenu
      }]
    };
    this.service.post(parms).then((response) => {
      this.onMenuList();
      this.service.toastSuccess('Registrado con exito..!!', 'Menu');
    });
  }

  onDeletepcionNivel(id_permiso) {
    let parms = {
      url: '/menu/sistema/delete/permisos',
      body: [{
        id_menu: id_permiso
      }]
    };
    this.service.post(parms).then((response) => {
      this.service.toastSuccess('Opcion eliminada con exito..!!', 'Permisos');
    });
  }

  onNewUser() {
    let uri = !this.isEditUser ? '/usuario/registrar' : '/usuario/editar';

    let parms = {
      url: uri,
      body: [{
        id: this.idEditUSer,
        usuario: this.vUsuarioNew,
        password: this.vPassword,
        default_page: this.cboPageDefault,
        email: this.vEmail,
        nivel: this.cboNivelUser
      }]
    };

    this.service.post(parms).then((response) => {
      this.onUserList();

      this.idEditUSer = "";
      this.vUsuarioNew = "";
      this.vPassword = "";
      this.cboPageDefault = "";
      this.optionDefaultPage = [{ key: "", value: "" }];
      this.vEmail = "";
      this.cboNivelUser = "";
      this.optionDefaultNivel = [{ key: "", value: "" }];

      if (this.isEditUser) {
        this.service.toastSuccess('Editado con exito..!!', 'Usuario');
      } else {
        this.service.toastSuccess('Registrado con exito..!!', 'Usuario');
      }

    });
  }


  onEditUser(element) {
    this.isEditUser = true;
    this.idEditUSer = element.ID_LOGIN;
    this.vUsuarioNew = element.USUARIO;
    this.vPassword = element.PASSWORD;
    this.cboPageDefault = element.DEFAULT_PAGE;
    this.optionDefaultPage = [{ key: element.DEFAULT_PAGE, value: element.DEFAULT_PAGE }];
    this.vEmail = element.EMAIL;
    this.cboNivelUser = element.NIVEL;
    this.optionDefaultNivel = [{ key: element.NIVEL, value: element.NIVEL }];
  }

  onCancelarEdit() {
    this.isEditUser = false;
    this.idEditUSer = "";
    this.vUsuarioNew = "";
    this.vPassword = "";
    this.cboPageDefault = "";
    this.optionDefaultPage = [{ key: "", value: "" }];
    this.vEmail = "";
    this.cboNivelUser = "";
    this.optionDefaultNivel = [{ key: "", value: "" }];

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if ((event || {})['container']['id'] == "dropMenu") {
        let dataRecept = event.container.data;
        let dataPermiso = this.dataPermiso.find((permiso) => permiso.NOMBRE_MENU == dataRecept[event.currentIndex]);
        this.onDeletepcionNivel(dataPermiso.ID_PERMISO_USER);
      }

      if ((event || {})['container']['id'] == "dropNivel") {
        let dataRecept = event.container.data;

        let dataMenu = this.dataMenuList.find((menu) => menu.NOMBRE_MENU == dataRecept[event.currentIndex]);
        this.onAddOpcionNivel(dataMenu.ID_MENU, this.cboNivel);
      }

    }
  }
}