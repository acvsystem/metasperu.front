import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ShareService } from 'src/app/services/shareService';
import { StorageService } from 'src/app/utils/storage';
import { SocketService } from '../../services/socketOptimizer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';


interface PeriodicElement {
  codigo: string;
  Tienda: string;
  isVerification: boolean;
  cant_comprobantes: number;
  transacciones: number;
  clientes_null: number;
  online: number;
  conexICG: number;
  terminales: any[];
  dataTerminales: any[];
  traffic: any[];
}

@Component({
  selector: 'app-mt-verification-comprobantes',
  templateUrl: './mt-verification-comprobantes.component.html',
  styleUrls: ['./mt-verification-comprobantes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MtVerificationComprobantesComponent implements OnInit {
  private destroy$ = new Subject<void>();

  dataSource = new MatTableDataSource<PeriodicElement>([]);
  columnsToDisplay = [
    'codigo',
    'Tienda',
    'Traffic',
    'Verificacion',
    'Comprobantes',
    'Transacciones',
    'Clientes',
    'Online',
    'conexICG',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  isShowLoading = false;
  isViewPage = false;

  headList: Array<any> = [];
  headListSunat: Array<any> = [];
  bodyList: Array<any> = [];
  bodyListSunat: Array<any> = [];
  bodyListBD: Array<any> = [];
  actionButton: boolean = true;
  isConnectServer: string = 'false';
  vCoeData: string = '';
  vManagerData: string = '';
  isVisibleStatus: boolean = false;
  isVerificarBd: boolean = false;
  isLoadingDB: boolean = false;
  statusServerList: any = [];
  countClientes: any = 0;

  isErrorVerificacion: boolean = false;
  contadorCliente: any = 0;
  contadorCajaOnline: any = 0;

  conxOnline: Array<any> = [];
  vListaClientes: string = '';
  vDataTienda: Array<any> = [];
  vDataTransferencia: Array<any> = [
    {
      dataOne: [],
      dataTwo: []
    }
  ];

  expandedElement: Array<PeriodicElement> = [];

  private _snackBar = inject(MatSnackBar);

  constructor(
    private shareService: ShareService,
    private storage: StorageService,
    private socket: SocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.initializeView();
    this.listenSocketEvents();
    this.loadTiendas();
  }

  private initializeView(): void {
    const profile = this.storage.getStore('mt-profile');
    this.isViewPage = profile?.mt_nivel === 'SISTEMAS';
    this.getComprobantes();
    this.listClientNull();
    this.shareService.onViewPageAdmin
      .pipe(takeUntil(this.destroy$))
      .subscribe(view => (this.isViewPage = view));
  }

  private listenSocketEvents(): void {
    this.socket.onComprobantes()
      .subscribe(lista => this.updateComprobantes(lista));

    this.socket.onTerminalesName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => this.updateTerminales(term));

    this.socket.onTerminalesCantidad()
      .pipe(takeUntil(this.destroy$))
      .subscribe(termc => this.updateTerminalesCantidad(termc));

    this.socket.onConexionICG()
      .pipe(takeUntil(this.destroy$))
      .subscribe(conex => this.updateConexionICG(conex));

    this.socket.onTransacciones()
      .subscribe(trans => this.updateTransacciones(trans));

    this.socket.onTrafficOnline()
      .pipe(takeUntil(this.destroy$))
      .subscribe(traff => this.updateTraffic(traff));

    this.socket.onDataClientNull()
      .pipe(takeUntil(this.destroy$))
      .subscribe(client => this.updateClienteNull(client));

    this.socket.onComparacionBD()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bd => this.updateComparacionBD(bd));

  }


  getComprobantes() {
    this.isShowLoading = true;
    this.socket.getComprobantes();
  }

  getTransacciones() {
    this.isShowLoading = true;
    this.socket.getTransacciones();
  }

  getTerminalesName() {
    this.socket.getTerminalesName();
  }

  getTerminalesCantidad() {
    this.socket.getTerminalesCantidad();
  }

  getComparacionBD() {
    this.isLoadingDB = true;
    this.socket.getComparacionBD();
  }

  getTrafficOnline(storeId) {
    this.socket.getTrafficOnline(storeId);
  }

  cleanColaFront() {
    this.socket.cleanColaFront();
  }

  transferirCola(dataTransferencia: any) {
    this.socket.transferirCola(dataTransferencia);
  }

  getClientesNull() {
    this.isShowLoading = true;
    this.socket.getClientesNull(this.vListaClientes.split(','));
  }

  emitirLimpiezaClientes() {
    this.socket.emitirLimpiezaClientes(this.vListaClientes.split(','));
  }

  private loadTiendas(): void {
    this.isShowLoading = true;
    this.shareService.get({ url: '/comprobantes/session/lista' }).then(response => {
      const tiendas = response?.data || [];
      const bodyList = tiendas.map((tnd: any) => ({
        codigo: tnd.CODIGO_TERMINAL,
        Tienda: tnd.DESCRIPCION,
        isVerification: tnd.VERIFICACION,
        cant_comprobantes: tnd.CANT_COMPROBANTES,
        transacciones: 0,
        clientes_null: 0,
        online: tnd.ISONLINE,
        conexICG: 0,
        terminales: [],
        dataTerminales: [],
        traffic: tnd.TRAFFIC_COUNTERS || [],
      }));
      this.dataSource.data = bodyList;
      this.isShowLoading = false;
    });
  }

  private updateComprobantes(lista: any[]): void {
    console.log(lista);
    this.isShowLoading = false;
    setTimeout(() => {
      this.getTrafficOnline(lista[0].CODIGO_TERMINAL);
      this.getTerminalesName();
    }, 2000);

    const updated = [...this.dataSource.data];
    lista.forEach(item => {
      const index = updated.findIndex(d => d.codigo === item.CODIGO_TERMINAL);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          cant_comprobantes: item.CANT_COMPROBANTES,
          online: item.ISONLINE,
        };
      }
    });
    this.dataSource.data = updated;
    this.getTrafficOnline(lista[0].CODIGO_TERMINAL);
    
  }

  private updateTerminales(terminales: any[]): void {
    const updated = [...this.dataSource.data];
    const codigo = terminales[0]?.CODIGO_TIENDA;
    const index = updated.findIndex(d => d.codigo === codigo);
    if (index !== -1) updated[index].terminales = terminales;
    this.dataSource.data = updated;
    this.getTerminalesCantidad();
  }

  private updateTerminalesCantidad(dataTerminal: any[]): void {

    const updated = [...this.dataSource.data];
    const codigo = dataTerminal[0]?.CODIGO_TIENDA;
    const index = updated.findIndex(d => d.codigo === codigo);
    let dataTerminales = [];
    updated[index].terminales.filter((trm) => {
      dataTerminales.push({
        'NOM_TERMINAL': (trm || {}).NOM_TERMINAL,
        'CANTIDAD': ((dataTerminal || [])[0] || {}).CANTIDAD || 0,
        'CODIGO': (((dataTerminal || [])[0] || {}).CODIGO_TIENDA || "")
      });
    })

    if (index !== -1) updated[index].dataTerminales = dataTerminales;
    this.dataSource.data = updated;
  }

  private updateConexionICG(conexion: any[]): void {
    const updated = [...this.dataSource.data];
    const codigo = conexion[0]?.code;
    const isConect = conexion[0]?.isConect;
    const index = updated.findIndex(d => d.codigo === codigo);
    if (index !== -1) updated[index].conexICG = isConect;
    this.dataSource.data = updated;
  }

  private updateTransacciones(trans: any[]): void {
    const updated = [...this.dataSource.data];
    const codigo = trans[0]?.code;
    const index = updated.findIndex(d => d.codigo === codigo);
    if (index !== -1) updated[index].transacciones = trans[0]?.transaciones;
    this.dataSource.data = updated;
    this.isShowLoading = false;
  }

  private updateTraffic(traffic): void {
    const updated = [...this.dataSource.data];
    const codigo = traffic.code;
    const index = updated.findIndex(d => d.codigo === codigo);
    const trafficIp = traffic.ip;
    const indexTraffic = updated[index]?.traffic.findIndex(d => d.ip === trafficIp);
    if (index !== -1) updated[index].traffic[indexTraffic].active = traffic.active;
    this.dataSource.data = updated;
  }

  private updateClienteNull(client): void {
    const updated = [...this.dataSource.data];
    const codigo = client[0]?.code;
    const index = updated.findIndex(d => d.codigo === codigo);
    if (index !== -1) updated[index].clientes_null = client[0]?.clientCant;
    this.dataSource.data = updated;
    this.isShowLoading = false;
  }

  private updateComparacionBD(bd): void {
    this.isLoadingDB = false;
    this.isVerificarBd = false;
    this.bodyListBD = (bd || []).data;
    if (!this.bodyListBD.length || ((this.bodyListBD || [])[0] || {})['code_data'] == ((this.bodyListBD || [])[0] || {})['manager_data']) {
      this.vCoeData = ((this.bodyListBD || [])[0] || {})['code_data'];
      this.vManagerData = ((this.bodyListBD || [])[0] || {})['manager_data'];
      this.shareService.toastSuccess("Servidor", "No hay diferencias entre las bases de datos.");
    }
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  listClientNull() {
    this.shareService.clientClearList('GET').then((listClient: Array<any>) => {
      this.vListaClientes = listClient.toString();
    });
  }

  onSelectedTranferencia(ev, dataOne, dataTwo?) {
    this.vDataTransferencia[0]['dataOne'] = dataOne || this.vDataTransferencia[0]['dataOne'];
    this.vDataTransferencia[0]['dataTwo'] = dataTwo || this.vDataTransferencia[0]['dataTwo'];

    if (Object.keys(dataOne).length) {
      let element = document.getElementsByClassName("origen");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }

      document.getElementById(ev.target.id).classList.add('active');
    }

    if (Object.keys(dataTwo).length) {
      let element = document.getElementsByClassName("destino");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }

      document.getElementById(ev.target.id).classList.add('active');
    }

  }

  onTranferirCola() {
    if (Object.keys(this.vDataTransferencia[0]['dataOne']).length && Object.keys(this.vDataTransferencia[0]['dataTwo']).length) {
      this.isShowLoading = true;
      this.transferirCola(this.vDataTransferencia);
      setTimeout(() => {
        this.getComprobantes();
      }, 1000);
    } else {
      this.openSnackBar('Seleccione el Origen y Destino.');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}






