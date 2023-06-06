import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { ShareService } from '../../services/shareService';
import * as XLSX from 'xlsx';

@Component({
  selector: 'mt-control-asistencia',
  templateUrl: './mt-control-asistencia.component.html',
  styleUrls: ['./mt-control-asistencia.component.scss'],
})
export class MtControlAsistenciaComponent implements OnInit {
  token: any = localStorage.getItem('tn');
  socket = io('http://159.65.226.239:4200', { query: { code: 'app', token: this.token } });
  bodyList: Array<any> = [];
  headList: Array<any> = [];
  dataPaginationList: Array<any> = [];
  indexPageList: Array<any> = [];
  cantPagination: any = 0;
  actualIndexPage: any = 0;
  viewLengthRegister: any = 20;
  isPopoverSearch: boolean = false;
  searchEmpleado: string = "";
  searchFecInicio: string = "";
  searchFecFin: string = "";
  searchTienda: string = "";
  functionExport: string = "";

  optionListTiendas: Array<any> = [
    { key: 'BBW JOCKEY', value: 'BBW JOCKEY' },
    { key: 'VSBA JOCKEY', value: 'VSBA JOCKEY' },
    { key: 'AEO JOCKEY', value: 'AEO JOCKEY' },
    { key: 'AEO ASIA', value: 'AEO ASIA' },
    { key: 'BBW LA RAMBLA', value: 'BBW LA RAMBLA' },
    { key: 'VS LA RAMBLA', value: 'VS LA RAMBLA' },
    { key: 'VS PLAZA NORTE', value: 'VS PLAZA NORTE' },
    { key: 'BBW SAN MIGUEL', value: 'BBW SAN MIGUEL' },
    { key: 'VS SAN MIGUEL', value: 'VS SAN MIGUEL' },
    { key: 'BBW SALAVERRY', value: 'BBW SALAVERRY' },
    { key: 'VS SALAVERRY', value: 'VS SALAVERRY' },
    { key: 'VS MALL DEL SUR', value: 'VS MALL DEL SUR' },
    { key: 'VS PURUCHUCO', value: 'VS PURUCHUCO' },
    { key: 'VS ECOMMERCE', value: 'VS ECOMMERCE' },
    { key: 'BBW ECOMMERCE', value: 'BBW ECOMMERCE' },
    { key: 'AEO ECOMMERCE', value: 'AEO ECOMMERCE' },
    { key: 'VS MEGA PLAZA', value: 'VS MEGA PLAZA' },
    { key: 'VS MINKA', value: 'VS MINKA' },
    { key: 'VSFA JOCKEY FULL', value: 'VSFA JOCKEY FULL' },
    { key: 'BBW ASIA', value: 'BBW ASIA' }

  ];

  optionListExport: Array<any> = [
    { key: 'exportVacaciones', value: 'Reporte Feriados' }
  ];

  reporteList: Array<any> = [];
  reporteFaltante: Array<any> = [];

  constructor(private service: ShareService) { }

  ngOnInit() {

    this.headList = [
      {
        value: '#',
        isSearch: false
      },
      {
        value: 'Empleado',
        isSearch: true,
        propSearch: [{
          input: true
        }]
      },
      {
        value: 'Dia',
        isSearch: true,
        propSearch: [{
          date: true
        }]
      },
      {
        value: 'Hora Ingreso',
        isSearch: false
      },
      {
        value: 'Hora Salida',
        isSearch: false
      },
      {
        value: 'H. Trab.',
        isSearch: false
      },
      {
        value: 'Nro Ventas',
        isSearch: false
      },
      {
        value: 'Tienda',
        isSearch: true,
        propSearch: [{
          options: true
        }]
      }
    ];

    this.onPaginationData(1);

    this.socket.on('sendControlAsistencia', (asistencia) => {
      console.log("socket-sendControlAsistencia", asistencia);
      if (this.actualIndexPage == 0) {
        this.onPaginationData(1);
      }


      /* let socketCodEmp = (asistencia || {}).CODEMPLEADO;
       let socketHorasEmp = (asistencia || {}).HORAS;
       let dataEmpleado = (this.bodyList || []).find((data) => ((data || {}).CODEMPLEADO == socketCodEmp && (data || {}).DIA == '2023-05-03'));
       let indexEmpleado = (this.bodyList || []).findIndex((data) => ((data || {}).CODEMPLEADO == socketCodEmp && (data || {}).DIA == '2023-05-03'));
       if (socketHorasEmp == 0 || (dataEmpleado || {}).HORAS) {
         if (this.bodyList.length > 1) {
           console.log(this.bodyList[0]);
           (this.bodyList).unshift(asistencia);
           let endData = this.bodyList[0][this.bodyList[0].length - 1];
           this.bodyList[0][this.bodyList[0].length - 1].pop();
           this.bodyList[this.indexPageList.length - 1].push(endData);
         } else {
           (this.bodyList || []).push(asistencia);
           this.dataPaginationList = this.bodyList;
         }
 
       } else if (socketHorasEmp > 0) {
         ((this.bodyList || [])[indexEmpleado] || {}).CAJA = asistencia.CAJA;
         ((this.bodyList || [])[indexEmpleado] || {}).CODEMPLEADO = asistencia.CODEMPLEADO;
         ((this.bodyList || [])[indexEmpleado] || {}).DIA = asistencia.DIA;
         ((this.bodyList || [])[indexEmpleado] || {}).FO = asistencia.FO;
         ((this.bodyList || [])[indexEmpleado] || {}).HORAIN = asistencia.HORAIN;
         ((this.bodyList || [])[indexEmpleado] || {}).HORAOUT = asistencia.HORAOUT;
         ((this.bodyList || [])[indexEmpleado] || {}).HORAS = asistencia.HORAS;
         ((this.bodyList || [])[indexEmpleado] || {}).INPUT = asistencia.INPUT;
         ((this.bodyList || [])[indexEmpleado] || {}).NUMVENTAS = asistencia.NUMVENTAS;
         ((this.bodyList || [])[indexEmpleado] || {}).OUTPUT = asistencia.OUTPUT;
         ((this.bodyList || [])[indexEmpleado] || {}).TERMINAL = asistencia.TERMINAL;
         ((this.bodyList || [])[indexEmpleado] || {}).VENTAS = asistencia.VENTAS;
       }*/
    });

  }
  viewModal: any = -1;
  onViewSearchModal(index) {
    this.viewModal = this.viewModal == index ? -1 : index;
  }

  exportReporte() {
    let selectedOption = this.optionListExport.find((dat) => dat.value == this.functionExport);
    let tipoReporte = (selectedOption || {}).key;
    let dataJson = [];
    let reportName = "";
    let registerList = [];
    if (tipoReporte == "exportVacaciones") {
      let empleados = [
        {
          "Codigo": "1",
          "Nombre": "SUPERVISOR",
          "Documento": "NULL"
        },
        {
          "Codigo": "2",
          "Nombre": "SOPORTE ICG",
          "Documento": "NULL"
        },
        {
          "Codigo": "851000",
          "Nombre": "EDWARD ENRIQUE AZARAK YNTRALIGGI",
          "Documento": "2249423"
        },
        {
          "Codigo": "851001",
          "Nombre": "PAULO RICARDO DOS REIS RIVERO",
          "Documento": "1698517"
        },
        {
          "Codigo": "851002",
          "Nombre": "LORENA ELIANA JIMENEZ ARROYO",
          "Documento": "72300939"
        },
        {
          "Codigo": "851003",
          "Nombre": "TESTUSER",
          "Documento": "NULL"
        },
        {
          "Codigo": "851004",
          "Nombre": "OSCAR JOSE MATA BRAVO",
          "Documento": "6502"
        },
        {
          "Codigo": "851005",
          "Nombre": "VICTOR ANGEL CHUMBIPUMA PITUY",
          "Documento": "43246428"
        },
        {
          "Codigo": "851006",
          "Nombre": "CARLOS WALDIR CRUZ BARRAZA",
          "Documento": "74846652"
        },
        {
          "Codigo": "851007",
          "Nombre": "LORENA ELIANA JIMENEZ ARROYO",
          "Documento": "72300939"
        },
        {
          "Codigo": "851008",
          "Nombre": "LUIS ROLANDO ESPICHAN CONDE",
          "Documento": "76752322"
        },
        {
          "Codigo": "851009",
          "Nombre": "ALEXANDER CESAR VARGAS CARBAJAL",
          "Documento": "45312973"
        },
        {
          "Codigo": "851010",
          "Nombre": "CARLOS MANUEL ESPINOZA RECAVARREN",
          "Documento": "73177765"
        },
        {
          "Codigo": "851011",
          "Nombre": "MARIANELA GARCIA",
          "Documento": "2776627"
        },
        {
          "Codigo": "851012",
          "Nombre": "GABRIELA DEL VALLE REYES GARCIA",
          "Documento": "2761474"
        },
        {
          "Codigo": "851013",
          "Nombre": "RAQUEL ALEXANDRA SANTANA CASTAÑEDA",
          "Documento": "1849482"
        },
        {
          "Codigo": "851015",
          "Nombre": "JAHIR NILO TENORIO ALVARADO",
          "Documento": "47541578"
        },
        {
          "Codigo": "851016",
          "Nombre": "MELISSA PAOLA GUERRERO SANCHEZ",
          "Documento": "2677821"
        },
        {
          "Codigo": "851017",
          "Nombre": "LUIS EDUARDO GARCIA CANALES",
          "Documento": "46508079"
        },
        {
          "Codigo": "851018",
          "Nombre": "CARLOS EDUARDO RUIZ ZURITA",
          "Documento": "NULL"
        },
        {
          "Codigo": "7000001",
          "Nombre": "JOSSY LESLIE HURTADO RAMOS",
          "Documento": "46353683"
        },
        {
          "Codigo": "7000002",
          "Nombre": "JOSÉ MIGUEL IMAN SAMAME",
          "Documento": "72804655"
        },
        {
          "Codigo": "7000003",
          "Nombre": "ARIANNY MARIA RUIZ RAMIREZ",
          "Documento": "4060977"
        },
        {
          "Codigo": "7000004",
          "Nombre": "CARLA LIDDA HUAMBACHANO NAVARRO",
          "Documento": "72156681"
        },
        {
          "Codigo": "7000005",
          "Nombre": "JOSE LUIS GARCIA NEGRETE",
          "Documento": "45334960"
        },
        {
          "Codigo": "7000006",
          "Nombre": "LUIS ALONSO FRANCO HUAMAN",
          "Documento": "72623551"
        },
        {
          "Codigo": "7000007",
          "Nombre": "IRIANALISSA AHRELI OLIDEN CANCINO",
          "Documento": "72352891"
        },
        {
          "Codigo": "7000008",
          "Nombre": "GLOBAL",
          "Documento": "NULL"
        },
        {
          "Codigo": "7000009",
          "Nombre": "LIZ VALERIA BRICEÑO DURAN",
          "Documento": "74972292"
        },
        {
          "Codigo": "7000010",
          "Nombre": "WESLY ASHLEY ARAMBURU ZAGACETA",
          "Documento": "71741253"
        },
        {
          "Codigo": "7000011",
          "Nombre": "LUZ ISABEL AGUIRRE AQUINO",
          "Documento": "74248956"
        },
        {
          "Codigo": "7000012",
          "Nombre": "Compras Peru",
          "Documento": "NULL"
        },
        {
          "Codigo": "7000013",
          "Nombre": "JOHNNY GERMANO",
          "Documento": "NULL"
        },
        {
          "Codigo": "7000014",
          "Nombre": "GEOVANNIE ANTONIO BERMUDEZ CABRERA",
          "Documento": "48988109"
        },
        {
          "Codigo": "7000015",
          "Nombre": "MARIA DEL PILAR PAUCCAR ALAMO",
          "Documento": "72410956"
        },
        {
          "Codigo": "7000016",
          "Nombre": "CARLOS EDUARDO RUIZ ZURITA",
          "Documento": "74832961"
        },
        {
          "Codigo": "7000018",
          "Nombre": "LUCERO GERALDINE QUISPE GUEVARA",
          "Documento": "71223383"
        },
        {
          "Codigo": "8000002",
          "Nombre": "MIRIAN MEJIA CAHUANA",
          "Documento": "47390291"
        },
        {
          "Codigo": "8000004",
          "Nombre": "GLOBAL",
          "Documento": "NULL"
        }
      ];

      let ejbList = [
        {
          "Codigo": "9",
          "Nombre": "HURTADO RAMOS JOSSY LESLIE",
          "Tdoc": "DNI",
          "NroDoc": "46353683"
        },
        {
          "Codigo": "11",
          "Nombre": "MAGO RIVAS MARY CHERYL",
          "Tdoc": "CE",
          "NroDoc": "2261375"
        },
        {
          "Codigo": "17",
          "Nombre": "RUIZ RAMIREZ ARIANNY MARIA",
          "Tdoc": "CE",
          "NroDoc": "4060977"
        },
        {
          "Codigo": "20",
          "Nombre": "ARAMBURU ZAGACETA WESLY ASHLEY",
          "Tdoc": "DNI",
          "NroDoc": "71741253"
        },
        {
          "Codigo": "28",
          "Nombre": "OLIDEN CANCINO IRIANALISSA AHRELI",
          "Tdoc": "DNI",
          "NroDoc": "72352891"
        },
        {
          "Codigo": "31",
          "Nombre": "COTRINA MONCADA DANIELA JANET",
          "Tdoc": "DNI",
          "NroDoc": "71306822"
        },
        {
          "Codigo": "42",
          "Nombre": "MEJIA CAHUANA MIRIAN",
          "Tdoc": "DNI",
          "NroDoc": "47390291"
        },
        {
          "Codigo": "47",
          "Nombre": "BRICEÑO DURAN LIZ VALERIA",
          "Tdoc": "DNI",
          "NroDoc": "74972292"
        },
        {
          "Codigo": "49",
          "Nombre": "HUAMBACHANO NAVARRO CARLA LIDDA",
          "Tdoc": "DNI",
          "NroDoc": "72156681"
        },
        {
          "Codigo": "52",
          "Nombre": "PAUCCAR ALAMO MARIA DEL PILAR",
          "Tdoc": "DNI",
          "NroDoc": "72410956"
        },
        {
          "Codigo": "54",
          "Nombre": "AGUIRRE AQUINO LUZ ISABEL",
          "Tdoc": "DNI",
          "NroDoc": "74248956"
        },
        {
          "Codigo": "55",
          "Nombre": "QUISPE GUEVARA LUCERO GERALDINE",
          "Tdoc": "DNI",
          "NroDoc": "71223383"
        }
      ];

      ejbList.filter((ejb) => {
        let cantFeriado = 1;
        let empleado = (empleados || []).find((emp) => {
          let empName = emp.Nombre.split(' ');
          let formatName = empName[2] + ' ' + empName[3] + ' ' + empName[0] + ' ' + empName[1];
          return (ejb.Nombre == formatName)
        });

        if (typeof empleado != 'undefined') {
          cantFeriado = 2;
        }

        this.reporteList.push({ 'PERIODO': '202305', 'CODIGO': (ejb || {}).Codigo, 'TRABAJADOR': (ejb || {}).Nombre, 'DIA-NOC': '', 'TAR-DIU': '', 'HOR-LAC': '', 'HED-25%': '', 'HED-35%': '', 'HED-50%': '', 'HED-100': '', 'HSI-MPL': '', 'DES-LAB': '', 'DIA-FER': cantFeriado, 'DIA-SUM': '', 'DIA-RES': '', 'PER-HOR': '' });
      });

      dataJson = this.reporteList;
      reportName = 'metasPeru';
      this.exportToExcel(this.reporteFaltante, 'FALTANTES');
    }

    this.exportToExcel(dataJson, reportName);
  }


  exportToExcel(data, nameFile): void {
    let name = `${nameFile}.xlsx`;
    let element = data;
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    XLSX.writeFile(workbook, name);
  }

  onNextPage() {
    let indexLength = this.actualIndexPage + 1;
    if (indexLength < this.indexPageList.length && this.bodyList.length < this.indexPageList.length) {
      this.actualIndexPage = indexLength;
      this.onPaginationData(this.actualIndexPage * this.viewLengthRegister);
    } else {

      if (indexLength < this.indexPageList.length) {
        this.actualIndexPage = indexLength;
        this.dataPaginationList = this.bodyList[this.actualIndexPage];
      }

    }

  }

  onPreviousPage() {
    if (this.actualIndexPage > 0) {
      this.actualIndexPage = this.actualIndexPage - 1;
      this.dataPaginationList = this.bodyList[this.actualIndexPage];
    }
  }

  onPage(indexPage) {
    this.actualIndexPage = indexPage;

    if (((this.bodyList || [])[indexPage] || []).length) {
      this.dataPaginationList = this.bodyList[indexPage];
    } else {
      this.onPaginationData(indexPage * this.viewLengthRegister);
    }

  }

  onPaginationData(cantActual) {


    let parms = {
      url: '/rrhh/search/asistencia/pagination',
      parms: [
        { key: 'limitPage', value: this.viewLengthRegister },
        { key: 'cantRegister', value: cantActual }
      ]
    };

    this.service.get(parms).then((response) => {
      let data = ((response || [])[0] || {}).data || [];
      if (data.length) {
        this.onInsertData(((response || [])[0] || {}).cant_registros, cantActual, data, false);
      }

    });
  }

  onInsertData(cantRegister, cantActual, data, isFilter) {

    let dataLength = cantRegister;
    var isActionFilter = isFilter;
    let insertPage = 0;

    if (cantActual > 1) {
      insertPage = (cantActual / this.viewLengthRegister);
    }

    this.cantPagination = Math.ceil(dataLength / this.viewLengthRegister);

    if (isActionFilter) {
      this.indexPageList = [];
      this.bodyList = [];
    }
    if (!this.indexPageList.length) {
      for (let i = 1; i <= this.cantPagination; i++) {
        this.indexPageList.push(i);

        if (isActionFilter) {
          let limiteRegister = i * this.viewLengthRegister;

          let initRegister = limiteRegister - this.viewLengthRegister;
          if (limiteRegister == this.viewLengthRegister) {
            initRegister = 0;
          }
          let indexArrow = initRegister / this.viewLengthRegister;
          this.bodyList[indexArrow] = [];
          (data || []).filter((register, j) => {
            if (j > initRegister - 1 && j < limiteRegister) {
              this.bodyList[indexArrow].push(register);
            }
          });
        }
      }
    }

    if (!isActionFilter) {
      this.bodyList[insertPage] = data;
    }

    console.log(this.bodyList);
    this.dataPaginationList = this.bodyList[insertPage];
  }

  onFiltrar() {

    let parametros = [];

    if (this.searchFecInicio.length) {
      parametros.push({ key: 'dateInit', value: this.searchFecInicio });
    }

    if (this.searchFecInicio.length && this.searchFecFin.length) {
      parametros.push({ key: 'dateEnd', value: this.searchFecFin });
    }

    if (this.searchTienda.length) {
      parametros.push({ key: 'dateNomTienda', value: this.searchTienda });
    }

    if (this.searchEmpleado.length) {
      parametros.push({ key: 'dateNomEmp', value: this.searchEmpleado });
    }
    console.log(parametros);
    let parms = {
      url: '/rrhh/search/asistencia',
      parms: parametros
    };

    this.service.get(parms).then((response) => {
      this.onInsertData(((response || [])[0] || {}).data.length, 1, ((response || [])[0] || {}).data, true);
      this.viewModal = -1;
    });


  }

  onClear() {
    this.searchFecInicio = "";
    this.searchFecFin = "";
    this.searchTienda = "";
    this.searchEmpleado = "";
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

}
