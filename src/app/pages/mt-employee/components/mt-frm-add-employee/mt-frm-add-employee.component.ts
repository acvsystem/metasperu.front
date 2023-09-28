import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShareService } from '../../../../services/shareService';

@Component({
  selector: 'mt-frm-add-employee',
  templateUrl: './mt-frm-add-employee.component.html',
  styleUrls: ['./mt-frm-add-employee.component.scss'],
})
export class MtFrmAddEmployeeComponent implements OnInit {
  @Output() onResponse: EventEmitter<any> = new EventEmitter();
  @Input() dataEmployeeList = {};

  estadoCivil: string = "";
  tipoDocumento: string = "";
  paisNacimiento: string = "";
  tiendaEmpleado: string = "";
  aEmpNombre: string = "";
  aEmpApellido: string = "";
  aEmpMaterno: string = "";
  aEmpNumDocumento: string = "";
  aEmpNumTelefono: string = "";
  aEmpEmail: string = "";
  aEmpFechaNac: string = "";
  aEmpCodigoEjb: string = "";
  selectOptionPais = {};
  selectOptionTienda = {};
  selectOptionSTC = {};
  selectOptionTdoc = {};
  isUpdate: boolean = false;
  textButton: string = "Registrar";
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

  optionListTipoDoc: Array<any> = [
    {
      "key": "DNI",
      "value": "DNI"
    },
    {
      "key": "CE",
      "value": "CE"
    },
    {
      "key": "Pasaporte",
      "value": "Pasaporte"
    },
    {
      "key": "PTP",
      "value": "PTP"
    }
  ];

  optionListEstadoCivil: Array<any> = [
    {
      "key": "Solera(o)",
      "value": "Solera(o)"
    },
    {
      "key": "Casada(o)",
      "value": "Casada(o)"
    },
    {
      "key": "Conviviente",
      "value": "Conviviente"
    },
    {
      "key": "Divorciada(o)",
      "value": "Divorciada(o)"
    },
    {
      "key": "Viuda(o)",
      "value": "Viuda(o)"
    }
  ];

  optionListPais: Array<any> = [
    {
      "key": 144,
      "value": "Afganistán"
    },
    {
      "key": 114,
      "value": "Albania"
    },
    {
      "key": 18,
      "value": "Alemania"
    },
    {
      "key": 98,
      "value": "Algeria"
    },
    {
      "key": 145,
      "value": "Andorra"
    },
    {
      "key": 119,
      "value": "Angola"
    },
    {
      "key": 4,
      "value": "Anguilla"
    },
    {
      "key": 147,
      "value": "Antigua y Barbuda"
    },
    {
      "key": 207,
      "value": "Antillas Holandesas"
    },
    {
      "key": 91,
      "value": "Arabia Saudita"
    },
    {
      "key": 5,
      "value": "Argentina"
    },
    {
      "key": 6,
      "value": "Armenia"
    },
    {
      "key": 142,
      "value": "Aruba"
    },
    {
      "key": 1,
      "value": "Australia"
    },
    {
      "key": 2,
      "value": "Austria"
    },
    {
      "key": 3,
      "value": "Azerbaiyán"
    },
    {
      "key": 80,
      "value": "Bahamas"
    },
    {
      "key": 127,
      "value": "Bahrein"
    },
    {
      "key": 149,
      "value": "Bangladesh"
    },
    {
      "key": 128,
      "value": "Barbados"
    },
    {
      "key": 9,
      "value": "Bélgica"
    },
    {
      "key": 8,
      "value": "Belice"
    },
    {
      "key": 151,
      "value": "Benín"
    },
    {
      "key": 10,
      "value": "Bermudas"
    },
    {
      "key": 7,
      "value": "Bielorrusia"
    },
    {
      "key": 123,
      "value": "Bolivia"
    },
    {
      "key": 79,
      "value": "Bosnia y Herzegovina"
    },
    {
      "key": 100,
      "value": "Botsuana"
    },
    {
      "key": 12,
      "value": "Brasil"
    },
    {
      "key": 155,
      "value": "Brunéi"
    },
    {
      "key": 11,
      "value": "Bulgaria"
    },
    {
      "key": 156,
      "value": "Burkina Faso"
    },
    {
      "key": 157,
      "value": "Burundi"
    },
    {
      "key": 152,
      "value": "Bután"
    },
    {
      "key": 159,
      "value": "Cabo Verde"
    },
    {
      "key": 158,
      "value": "Camboya"
    },
    {
      "key": 31,
      "value": "Camerún"
    },
    {
      "key": 32,
      "value": "Canadá"
    },
    {
      "key": 130,
      "value": "Chad"
    },
    {
      "key": 81,
      "value": "Chile"
    },
    {
      "key": 35,
      "value": "China"
    },
    {
      "key": 33,
      "value": "Chipre"
    },
    {
      "key": 82,
      "value": "Colombia"
    },
    {
      "key": 164,
      "value": "Comores"
    },
    {
      "key": 112,
      "value": "Congo (Brazzaville)"
    },
    {
      "key": 165,
      "value": "Congo (Kinshasa)"
    },
    {
      "key": 166,
      "value": "Cook, Islas"
    },
    {
      "key": 84,
      "value": "Corea del Norte"
    },
    {
      "key": 69,
      "value": "Corea del Sur"
    },
    {
      "key": 168,
      "value": "Costa de Marfil"
    },
    {
      "key": 36,
      "value": "Costa Rica"
    },
    {
      "key": 71,
      "value": "Croacia"
    },
    {
      "key": 113,
      "value": "Cuba"
    },
    {
      "key": 22,
      "value": "Dinamarca"
    },
    {
      "key": 169,
      "value": "Djibouti, Yibuti"
    },
    {
      "key": 103,
      "value": "Ecuador"
    },
    {
      "key": 23,
      "value": "Egipto"
    },
    {
      "key": 51,
      "value": "El Salvador"
    },
    {
      "key": 93,
      "value": "Emiratos Árabes Unidos"
    },
    {
      "key": 173,
      "value": "Eritrea"
    },
    {
      "key": 52,
      "value": "Eslovaquia"
    },
    {
      "key": 53,
      "value": "Eslovenia"
    },
    {
      "key": 28,
      "value": "España"
    },
    {
      "key": 55,
      "value": "Estados Unidos"
    },
    {
      "key": 68,
      "value": "Estonia"
    },
    {
      "key": 121,
      "value": "Etiopía"
    },
    {
      "key": 175,
      "value": "Feroe, Islas"
    },
    {
      "key": 90,
      "value": "Filipinas"
    },
    {
      "key": 63,
      "value": "Finlandia"
    },
    {
      "key": 176,
      "value": "Fiyi"
    },
    {
      "key": 64,
      "value": "Francia"
    },
    {
      "key": 180,
      "value": "Gabón"
    },
    {
      "key": 181,
      "value": "Gambia"
    },
    {
      "key": 21,
      "value": "Georgia"
    },
    {
      "key": 105,
      "value": "Ghana"
    },
    {
      "key": 143,
      "value": "Gibraltar"
    },
    {
      "key": 184,
      "value": "Granada"
    },
    {
      "key": 20,
      "value": "Grecia"
    },
    {
      "key": 94,
      "value": "Groenlandia"
    },
    {
      "key": 17,
      "value": "Guadalupe"
    },
    {
      "key": 185,
      "value": "Guatemala"
    },
    {
      "key": 186,
      "value": "Guernsey"
    },
    {
      "key": 187,
      "value": "Guinea"
    },
    {
      "key": 172,
      "value": "Guinea Ecuatorial"
    },
    {
      "key": 188,
      "value": "Guinea-Bissau"
    },
    {
      "key": 189,
      "value": "Guyana"
    },
    {
      "key": 16,
      "value": "Haiti"
    },
    {
      "key": 137,
      "value": "Honduras"
    },
    {
      "key": 73,
      "value": "Hong Kong"
    },
    {
      "key": 14,
      "value": "Hungría"
    },
    {
      "key": 25,
      "value": "India"
    },
    {
      "key": 74,
      "value": "Indonesia"
    },
    {
      "key": 140,
      "value": "Irak"
    },
    {
      "key": 26,
      "value": "Irán"
    },
    {
      "key": 27,
      "value": "Irlanda"
    },
    {
      "key": 215,
      "value": "Isla Pitcairn"
    },
    {
      "key": 83,
      "value": "Islandia"
    },
    {
      "key": 228,
      "value": "Islas Salomón"
    },
    {
      "key": 58,
      "value": "Islas Turcas y Caicos"
    },
    {
      "key": 154,
      "value": "Islas Virgenes Británicas"
    },
    {
      "key": 24,
      "value": "Israel"
    },
    {
      "key": 29,
      "value": "Italia"
    },
    {
      "key": 132,
      "value": "Jamaica"
    },
    {
      "key": 70,
      "value": "Japón"
    },
    {
      "key": 193,
      "value": "Jersey"
    },
    {
      "key": 75,
      "value": "Jordania"
    },
    {
      "key": 30,
      "value": "Kazajstán"
    },
    {
      "key": 97,
      "value": "Kenia"
    },
    {
      "key": 34,
      "value": "Kirguistán"
    },
    {
      "key": 195,
      "value": "Kiribati"
    },
    {
      "key": 37,
      "value": "Kuwait"
    },
    {
      "key": 196,
      "value": "Laos"
    },
    {
      "key": 197,
      "value": "Lesotho"
    },
    {
      "key": 38,
      "value": "Letonia"
    },
    {
      "key": 99,
      "value": "Líbano"
    },
    {
      "key": 198,
      "value": "Liberia"
    },
    {
      "key": 39,
      "value": "Libia"
    },
    {
      "key": 126,
      "value": "Liechtenstein"
    },
    {
      "key": 40,
      "value": "Lituania"
    },
    {
      "key": 41,
      "value": "Luxemburgo"
    },
    {
      "key": 85,
      "value": "Macedonia"
    },
    {
      "key": 134,
      "value": "Madagascar"
    },
    {
      "key": 76,
      "value": "Malasia"
    },
    {
      "key": 125,
      "value": "Malawi"
    },
    {
      "key": 200,
      "value": "Maldivas"
    },
    {
      "key": 133,
      "value": "Malí"
    },
    {
      "key": 86,
      "value": "Malta"
    },
    {
      "key": 131,
      "value": "Man, Isla de"
    },
    {
      "key": 104,
      "value": "Marruecos"
    },
    {
      "key": 201,
      "value": "Martinica"
    },
    {
      "key": 202,
      "value": "Mauricio"
    },
    {
      "key": 108,
      "value": "Mauritania"
    },
    {
      "key": 42,
      "value": "México"
    },
    {
      "key": 43,
      "value": "Moldavia"
    },
    {
      "key": 44,
      "value": "Mónaco"
    },
    {
      "key": 139,
      "value": "Mongolia"
    },
    {
      "key": 117,
      "value": "Mozambique"
    },
    {
      "key": 205,
      "value": "Myanmar"
    },
    {
      "key": 102,
      "value": "Namibia"
    },
    {
      "key": 206,
      "value": "Nauru"
    },
    {
      "key": 107,
      "value": "Nepal"
    },
    {
      "key": 209,
      "value": "Nicaragua"
    },
    {
      "key": 210,
      "value": "Níger"
    },
    {
      "key": 115,
      "value": "Nigeria"
    },
    {
      "key": 212,
      "value": "Norfolk Island"
    },
    {
      "key": 46,
      "value": "Noruega"
    },
    {
      "key": 208,
      "value": "Nueva Caledonia"
    },
    {
      "key": 45,
      "value": "Nueva Zelanda"
    },
    {
      "key": 213,
      "value": "Omán"
    },
    {
      "key": 19,
      "value": "Países Bajos, Holanda"
    },
    {
      "key": 87,
      "value": "Pakistán"
    },
    {
      "key": 124,
      "value": "Panamá"
    },
    {
      "key": 88,
      "value": "Papúa-Nueva Guinea"
    },
    {
      "key": 110,
      "value": "Paraguay"
    },
    {
      "key": 89,
      "value": "Perú"
    },
    {
      "key": 178,
      "value": "Polinesia Francesa"
    },
    {
      "key": 47,
      "value": "Polonia"
    },
    {
      "key": 48,
      "value": "Portugal"
    },
    {
      "key": 246,
      "value": "Puerto Rico"
    },
    {
      "key": 216,
      "value": "Qatar"
    },
    {
      "key": 13,
      "value": "Reino Unido"
    },
    {
      "key": 65,
      "value": "República Checa"
    },
    {
      "key": 138,
      "value": "República Dominicana"
    },
    {
      "key": 49,
      "value": "Reunión"
    },
    {
      "key": 217,
      "value": "Ruanda"
    },
    {
      "key": 72,
      "value": "Rumanía"
    },
    {
      "key": 50,
      "value": "Rusia"
    },
    {
      "key": 242,
      "value": "Sáhara Occidental"
    },
    {
      "key": 223,
      "value": "Samoa"
    },
    {
      "key": 219,
      "value": "San Cristobal y Nevis"
    },
    {
      "key": 224,
      "value": "San Marino"
    },
    {
      "key": 221,
      "value": "San Pedro y Miquelón"
    },
    {
      "key": 225,
      "value": "San Tomé y Príncipe"
    },
    {
      "key": 222,
      "value": "San Vincente y Granadinas"
    },
    {
      "key": 218,
      "value": "Santa Elena"
    },
    {
      "key": 220,
      "value": "Santa Lucía"
    },
    {
      "key": 135,
      "value": "Senegal"
    },
    {
      "key": 226,
      "value": "Serbia y Montenegro"
    },
    {
      "key": 109,
      "value": "Seychelles"
    },
    {
      "key": 227,
      "value": "Sierra Leona"
    },
    {
      "key": 77,
      "value": "Singapur"
    },
    {
      "key": 106,
      "value": "Siria"
    },
    {
      "key": 229,
      "value": "Somalia"
    },
    {
      "key": 120,
      "value": "Sri Lanka"
    },
    {
      "key": 141,
      "value": "Sudáfrica"
    },
    {
      "key": 232,
      "value": "Sudán"
    },
    {
      "key": 67,
      "value": "Suecia"
    },
    {
      "key": 66,
      "value": "Suiza"
    },
    {
      "key": 54,
      "value": "Surinam"
    },
    {
      "key": 234,
      "value": "Swazilandia"
    },
    {
      "key": 56,
      "value": "Tadjikistan"
    },
    {
      "key": 92,
      "value": "Tailandia"
    },
    {
      "key": 78,
      "value": "Taiwan"
    },
    {
      "key": 101,
      "value": "Tanzania"
    },
    {
      "key": 171,
      "value": "Timor Oriental"
    },
    {
      "key": 136,
      "value": "Togo"
    },
    {
      "key": 235,
      "value": "Tokelau"
    },
    {
      "key": 236,
      "value": "Tonga"
    },
    {
      "key": 237,
      "value": "Trinidad y Tobago"
    },
    {
      "key": 122,
      "value": "Túnez"
    },
    {
      "key": 57,
      "value": "Turkmenistan"
    },
    {
      "key": 59,
      "value": "Turquía"
    },
    {
      "key": 239,
      "value": "Tuvalu"
    },
    {
      "key": 62,
      "value": "Ucrania"
    },
    {
      "key": 60,
      "value": "Uganda"
    },
    {
      "key": 111,
      "value": "Uruguay"
    },
    {
      "key": 61,
      "value": "Uzbekistán"
    },
    {
      "key": 240,
      "value": "Vanuatu"
    },
    {
      "key": 95,
      "value": "Venezuela"
    },
    {
      "key": 15,
      "value": "Vietnam"
    },
    {
      "key": 241,
      "value": "Wallis y Futuna"
    },
    {
      "key": 243,
      "value": "Yemen"
    },
    {
      "key": 116,
      "value": "Zambia"
    },
    {
      "key": 96,
      "value": "Zimbabwe"
    }
  ];

  dataEmployee: Array<any> = [];

  constructor(private service: ShareService) { }

  ngOnInit() {

    if (Object.keys(this.dataEmployeeList).length) {
      this.isUpdate = true;
      this.estadoCivil = this.dataEmployeeList['ESTADO_CIVIL'];
      this.tipoDocumento = this.dataEmployeeList['TIPO_DOC'];
      this.paisNacimiento = this.dataEmployeeList['PAIS_NAC'];
      this.tiendaEmpleado = this.dataEmployeeList['TIENDA_ASIGNADO'];
      this.aEmpNombre = this.dataEmployeeList['NOM_EMPLEADO'];
      this.aEmpApellido = this.dataEmployeeList['AP_PATERNO'];
      this.aEmpMaterno = this.dataEmployeeList['AP_MATERNO'];
      this.aEmpNumDocumento = this.dataEmployeeList['NRO_DOC'];
      this.aEmpNumTelefono = this.dataEmployeeList['TLF_EMP'];
      this.aEmpEmail = this.dataEmployeeList['EMAIL_EMP'];
      this.aEmpFechaNac = this.dataEmployeeList['FEC_NAC'];
      this.aEmpCodigoEjb = this.dataEmployeeList['CODIGO_EJB'];
      this.textButton = "Actualizar";
      
      this.selectOptionPais = {
        key: this.paisNacimiento,
        value: this.paisNacimiento
      };

      this.selectOptionTienda = {
        key: this.tiendaEmpleado,
        value: this.tiendaEmpleado
      };

      this.selectOptionSTC = {
        key: this.estadoCivil,
        value: this.estadoCivil
      };

      this.selectOptionTdoc = {
        key: this.tipoDocumento,
        value: this.tipoDocumento
      };
    }


  }

  ngOnDestroy() {
    this.onClear();
  }

  onClear() {
    this.estadoCivil = "";
    this.tipoDocumento = "";
    this.paisNacimiento = "";
    this.tiendaEmpleado = "";
    this.aEmpNombre = "";
    this.aEmpApellido = "";
    this.aEmpMaterno = "";
    this.aEmpNumDocumento = "";
    this.aEmpNumTelefono = "";
    this.aEmpEmail = "";
    this.aEmpFechaNac = "";
    this.aEmpCodigoEjb = "";
    this.isUpdate = false;
    this.textButton = "Registrar";
  }


  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onAddRegister() {

    var keyList = [
      {
        key: 'FC_NOMBRES',
        property: 'aEmpNombre',
        required: true
      },
      {
        key: 'AP_PATERNO',
        property: 'aEmpApellido',
        required: true
      },
      {
        key: 'AP_MATERNO',
        property: 'aEmpMaterno',
        required: true
      },
      {
        key: 'NUM_DOCUMENTO',
        property: 'aEmpNumDocumento',
        required: true
      },
      {
        key: 'PAIS_NACIMIENTO',
        property: 'paisNacimiento',
        required: true
      },
      {
        key: 'TIENDA_ASIGNADO',
        property: 'tiendaEmpleado',
        required: true
      },
      {
        key: 'TIPO_DOCUMENTO',
        property: 'tipoDocumento',
        required: true
      },
      {
        key: 'FC_CELULAR',
        property: 'aEmpNumTelefono',
        required: false
      },
      {
        key: 'FECH_NAC',
        property: 'aEmpFechaNac',
        required: true
      },
      {
        key: 'ESTADO_CIVIL',
        property: 'estadoCivil',
        required: true
      },
      {
        key: 'CORREO_ELECTONICO',
        property: 'aEmpEmail',
        required: true
      },
      {
        key: 'CODIGO_EJB',
        property: 'aEmpCodigoEjb',
        required: true
      }
    ]

    let dataKeyList = keyList || [];
    let notValueList = [];
    let dataList = {};

    (dataKeyList || []).map((obj): any => {
      if (this[(obj || {}).property] || !(obj || {}).required) {
        dataList[(obj || {}).key] = this[(obj || {}).property];
      } else {
        notValueList.push((obj || {}).property);
      }
    });

    if (!notValueList.length) {
      this.dataEmployee.push(dataList);
      let notificationList = [{
        isSuccess: true,
        bodyNotification: "Registro agregado correctamente."
      }];
      this.onDataRegister().then((response) => {
        if (response) {
          this.onResponse.emit(response);
          this.service.onNotification.emit(notificationList);
        }
      });

    } else {
      let notificationList = [{
        isError: true,
        bodyNotification: "Todos los campos son requediros."
      }]
      this.service.onNotification.emit(notificationList);
    }


  }

  onDataRegister() {
    return new Promise((resolve, reject) => {
      let parms = {
        url: '/rrhh/registrar/employee',
        body: this.dataEmployee
      };

      if (this.dataEmployee.length) {
        this.service.post(parms).then((response) => {
          let success = (((response || [])[0] || {}).status || {}).success;
          if (success) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    });
  }

}
