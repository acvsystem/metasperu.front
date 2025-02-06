import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';

@Component({
  selector: 'mt-hr-extra-consolidado',
  templateUrl: './mt-hr-extra-consolidado.component.html',
  styleUrls: ['./mt-hr-extra-consolidado.component.scss'],
})
export class MtHrExtraConsolidadoComponent implements OnInit {
  onListEmpleado: Array<any> = [];
  unidServicio: string = "";
  codeTienda: string = "";
  cboTiendas: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY' },
    { key: '7J', value: 'BBW MALL AVENTURA AQP' },
    { key: '7E', value: 'BBW LA RAMBLA' },
    { key: '7C', value: 'BBW SAN MIGUEL' },
    { key: '7D', value: 'BBW SALAVERRY' },
    { key: '7F', value: 'BBW ECOMMERCE' },
    { key: '7I', value: 'BBW MALL PLAZA TRU' },
    { key: '7A7', value: 'BBW ASIA' },
    { key: '9N', value: 'VS MALL AVENTURA AQP' },
    { key: '9D', value: 'VS LA RAMBLA' },
    { key: '9B', value: 'VS PLAZA NORTE' },
    { key: '9C', value: 'VS SAN MIGUEL' },
    { key: '9I', value: 'VS SALAVERRY' },
    { key: '9G', value: 'VS MALL DEL SUR' },
    { key: '9H', value: 'VS PURUCHUCO' },
    { key: '9M', value: 'VS ECOMMERCE' },
    { key: '9K', value: 'VS MEGA PLAZA' },
    { key: '9L', value: 'VS MINKA' },
    { key: '9F', value: 'VSFA JOCKEY FULL' },
    { key: '9P', value: 'VS MALL PLAZA TRU' }
  ];
  onListTiendas: Array<any> = [
    { code_uns: '0003', uns: 'BBW', code: '7A', name: 'BBW JOCKEY', procesar: 0, procesado: -1 },
    { code_uns: '0023', uns: 'VS', code: '9N', name: 'VS MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code_uns: '0024', uns: 'BBW', code: '7J', name: 'BBW MALL AVENTURA AQP', procesar: 0, procesado: -1 },
    { code_uns: '0010', uns: 'BBW', code: '7E', name: 'BBW LA RAMBLA', procesar: 0, procesado: -1 },
    { code_uns: '0009', uns: 'VS', code: '9D', name: 'VS LA RAMBLA', procesar: 0, procesado: -1 },
    { code_uns: '0004', uns: 'VS', code: '9B', name: 'VS PLAZA NORTE', procesar: 0, procesado: -1 },
    { code_uns: '0006', uns: 'BBW', code: '7C', name: 'BBW SAN MIGUEL', procesar: 0, procesado: -1 },
    { code_uns: '0005', uns: 'VS', code: '9C', name: 'VS SAN MIGUEL', procesar: 0, procesado: -1 },
    { code_uns: '0007', uns: 'BBW', code: '7D', name: 'BBW SALAVERRY', procesar: 0, procesado: -1 },
    { code_uns: '0012', uns: 'VS', code: '9I', name: 'VS SALAVERRY', procesar: 0, procesado: -1 },
    { code_uns: '0011', uns: 'VS', code: '9G', name: 'VS MALL DEL SUR', procesar: 0, procesado: -1 },
    { code_uns: '0013', uns: 'VS', code: '9H', name: 'VS PURUCHUCO', procesar: 0, procesado: -1 },
    { code_uns: '0019', uns: 'VS', code: '9M', name: 'VS ECOMMERCE', procesar: 0, procesado: -1 },
    { code_uns: '0016', uns: 'BBW', code: '7F', name: 'BBW ECOMMERCE', procesar: 0, procesado: -1 },
    { code_uns: '0014', uns: 'VS', code: '9K', name: 'VS MEGA PLAZA', procesar: 0, procesado: -1 },
    { code_uns: '0015', uns: 'VS', code: '9L', name: 'VS MINKA', procesar: 0, procesado: -1 },
    { code_uns: '0008', uns: 'VS', code: '9F', name: 'VSFA JOCKEY FULL', procesar: 0, procesado: -1 },
    { code_uns: '0022', uns: 'BBW', code: '7A7', name: 'BBW ASIA', procesar: 0, procesado: -1 },
    { code_uns: '0025', uns: 'VS', code: '9P', name: 'VS MALL PLAZA TRU', procesar: 0, procesado: -1 },
    { code_uns: '0026', uns: 'BBW', code: '7I', name: 'BBW MALL PLAZA TRU', procesar: 0, procesado: -1 }
  ];

  constructor(private service: ShareService) { }

  ngOnInit() { }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (index == 'cboTiendaConsulting') {

      this.onListEmpleado = [];
      let unidServicio = this.onListTiendas.find((tienda) => tienda.code == this.codeTienda);
      this.unidServicio = unidServicio['uns'];

      let parms = {
        url: '/consulta/lista/empleado',
        body: this.unidServicio
      };

      this.service.post(parms).then(async (response) => {
        console.log(response);
      });

      //this.socket.emit('consultaListaEmpleado', this.unidServicio);


      /*
          this.socket.on('reporteEmpleadoTienda', async (response) => { //LISTA EMPLEADOS DE TIENDA
      
            let dataEmpleado = (response || {}).data || [];
            let codigo_uns = (this.onListTiendas || []).find((tienda) => (tienda || {}).code == this.codeTienda);
      
            (dataEmpleado || []).filter((emp) => {
              if (response.id == "EJB") {
                this.arDataEJB = (response || {}).data;
              }
      
              if (this.arDataEJB.length) {
                (this.arDataEJB || []).filter(async (ejb) => {
      
                  if ((codigo_uns || {}).code_uns == '0016') {
                    if ((ejb || {}).code_unid_servicio == '0016' || (ejb || {}).code_unid_servicio == '0019') {
      
                      let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
                      if (exist == -1) {
                        (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                        (this.parseEJB || []).push({
                          nombre_completo: (ejb || {}).nombre_completo,
                          documento: (ejb || {}).nro_documento,
                          codigo_tienda: this.codeTienda
                        });
                      }
                    }
                  } else {
                    if ((ejb || {}).code_unid_servicio == (codigo_uns || {}).code_uns) {
      
                      let exist = (this.onListEmpleado || []).findIndex((pr) => (pr || {}).key == ((ejb || {}).nro_documento).trim());
                      if (exist == -1) {
                        (this.onListEmpleado || []).push({ key: ((ejb || {}).nro_documento).trim(), value: (ejb || {}).nombre_completo });
                        (this.parseEJB || []).push({
                          nombre_completo: (ejb || {}).nombre_completo,
                          documento: (ejb || {}).nro_documento,
                          codigo_tienda: this.codeTienda
                        });
                      }
                    }
                  }
      
      
                });
              }
            });
      
          });
      
          this.socket.on('reporteHorario', async (response) => { //DATA ASISTENCIA FRONT
      
            let data = (response || {}).data || [];
            console.log(data);
            this.parseHuellero = data;
            this.onDataTemp = [];
            this.bodyList = [];
            this.dataVerify = [];
            this.copyBodyList = [];
            this.arPartTimeFech = [];
            await (this.parseHuellero || []).filter(async (huellero, i) => { //CALCULO PARA LAS HORAS EXTRAS
      
              let tipoAsc = ((huellero || {}).tpAsociado || "").split('*');
              var codigo = (huellero || {}).caja.substr(0, 2);
      
              if ((huellero || {}).caja.substr(2, 2) == 7) {
                codigo = (huellero || {}).caja;
              } else {
                codigo.substr(0, 1)
              }
      
              if (codigo == this.codeTienda) {
                let indexData = (this.onDataTemp || []).findIndex((data) => ((data || {}).dia == (huellero || []).dia));
      
                if (indexData == -1) {
      
      
                  (this.onDataTemp || []).push({
                    dia: (huellero || {}).dia,
                    hr_ingreso_1: (huellero || {}).hrIn,
                    hr_salida_1: (huellero || {}).hrOut,
                    hr_brake: "",
                    hr_ingreso_2: "",
                    hr_salida_2: "",
                    hr_trabajadas: this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut),
                    hr_extra: 0,
                    hr_faltante: 0,
                    dataRegistro: [huellero]
                  });
      
                  if (huellero.tpAsociado == "**") { //PART TIME
                    this.isPartTime = true;
                    this.onProcesarPartTime(this.parseHuellero.length, i, {
                      dia: (huellero || {}).dia,
                      hr_ingreso_1: (huellero || {}).hrIn,
                      hr_salida_1: (huellero || {}).hrOut,
                      hr_brake: "",
                      hr_ingreso_2: "",
                      hr_salida_2: "",
                      hr_trabajadas: this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut),
                      hr_extra: 0,
                      hr_faltante: 0,
                      dataRegistro: [huellero]
                    });
                  }
      
                } else {
      
                  if (huellero.tpAsociado != "**") { //DEFAULT
      
                    this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
                    this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
                    this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
                    let hora_trb_1 = this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut);
                    //let hora_trb_2 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_2'], this.onDataTemp[indexData]['hr_salida_2']);
      
                    this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(this.onDataTemp[indexData]['hr_trabajadas'], hora_trb_1);
      
      
      
                    let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
                    this.onDataTemp[indexData]['dataRegistro'].push(huellero);
      
                    let defaultHT = "08:00";
      
                    if (tipoAsc.length == 2) { //LACTANCIA
      
                      let fechaLactancia = new Date(tipoAsc[1]).toLocaleDateString().split('/'); new Date();
      
                      var f1 = new Date(parseInt(fechaLactancia[2]) + 1 + "-" + fechaLactancia[1] + "-" + parseInt(fechaLactancia[0])).getTime(); //FECHA DE LACTANCIA
                      var f2 = new Date(this.onDataTemp[indexData]['dia']).getTime(); //FECHA TRABAJADA
      
                      if (f1 >= f2) {
                        defaultHT = "07:00";
                      }
                    }
      
                    let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
                    let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
                    let hrxSalida = (defaultHT).split(':');
                    let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);
      
                    let newAcumulado = llegada - salida;
      
                    const ToTime = (num) => {
                      var minutos: any = Math.floor((num / 60) % 60);
                      minutos = minutos < 10 ? '0' + minutos : minutos;
                      var segundos: any = num % 60;
                      segundos = segundos < 10 ? '0' + segundos : segundos;
                      return minutos + ':' + segundos;
                    }
      
                    let process = ToTime(newAcumulado);
      
                    let fecha = new Date().toLocaleDateString().split('/'); new Date();
      
                    let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;
      
                    if (hora_1_pr[0] >= 8 && validFecha) {
      
                      let hr = process.split(":");
      
                      if (parseInt(hr[1]) >= 30 || parseInt(hr[0]) > 0) {
      
                        this.onDataTemp[indexData]['hr_extra'] = process;//23:59
      
                        let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                        let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);
      
                        let estado = this.onDataTemp[indexData]['dataRegistro'].length >= 3 || salida >= 356 ? 'aprobar' : 'correcto';
                        let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
      
                        let aprobado = estado == "correcto" ? true : false;
      
                        let indexData2 = (this.dataVerify || []).findIndex((data) => ((data || {}).fecha == this.onDataTemp[indexData]['dia']));
      
                        if (indexData2 == -1) {
                          (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: this.onDataTemp[indexData]['hr_extra'], extra: this.onDataTemp[indexData]['hr_extra'], estado: estado, aprobado: aprobado, seleccionado: false });
                        } else {
                          this.dataVerify[indexData2] = { documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false };
                        }
                        (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });
      
                        if (estado == 'correcto') {
                          if (!this.arHoraExtra.length) {
                            this.arHoraExtra = [process];
                          } else {
                            this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                          }
                        }
                      }
                    } else {
                      this.onDataTemp[indexData]['hr_faltante'] = process;
                    }
      
                  }
      
      
                }
              }
            });
      
            if ((this.dataVerify || []).length && !this.isPartTime) {
      
              this.onDataTemp.filter((dt, indexData) => {
      
                if (((dt || {}).dataRegistro || []).length == 1) {
                  let hora_1_pr = this.onDataTemp[indexData]['hr_trabajadas'].split(":");
                  let defaultHT = "08:00";
                  let hrxLlegada = this.onDataTemp[indexData]['hr_trabajadas'].split(':');
                  let llegada = parseInt(hrxLlegada[0]) * 60 + parseInt(hrxLlegada[1]);
                  let hrxSalida = (defaultHT).split(':');
                  let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);
      
                  let newAcumulado = llegada - salida;
      
                  const ToTime = (num) => {
                    var minutos: any = Math.floor((num / 60) % 60);
                    minutos = minutos < 10 ? '0' + minutos : minutos;
                    var segundos: any = num % 60;
                    segundos = segundos < 10 ? '0' + segundos : segundos;
                    return minutos + ':' + segundos;
                  }
      
                  let process = ToTime(newAcumulado);
      
                  let fecha = new Date().toLocaleDateString().split('/'); new Date();
      
                  let validFecha = new Date(this.onDataTemp[indexData]['dia']).getTime() != new Date(parseInt(fecha[2]) + "-" + (parseInt(fecha[1]) <= 9 ? '0' + parseInt(fecha[1]) : parseInt(fecha[1])) + "-" + (parseInt(fecha[0]) <= 9 ? '0' + parseInt(fecha[0]) : parseInt(fecha[0]))).getTime() ? true : false;
      
      
      
                  if (hora_1_pr[0] >= 8 && validFecha) {
      
                    let hr = process.split(":");
                    if (parseInt(hr[1]) >= 30 || parseInt(hr[0]) > 0) {
                      this.onDataTemp[indexData]['hr_extra'] = process;//23:59
                      let hrxSalida = this.onDataTemp[indexData]['hr_extra'].split(':');
                      let salida = parseInt(hrxSalida[0]) * 60 + parseInt(hrxSalida[1]);
                      let estado = this.onDataTemp[indexData]['dataRegistro'].length == 1 || salida >= 356 ? 'aprobar' : 'correcto';
                      let ejb = this.parseEJB.filter((ejb) => ejb.documento == this.cboEmpleado);
      
                      let aprobado = estado == "correcto" ? true : false;
      
                      (this.dataVerify || []).push({ documento: ejb[0]['documento'], codigo_papeleta: this.codigoPapeleta, hr_trabajadas: this.onDataTemp[indexData]['hr_trabajadas'], fecha: this.onDataTemp[indexData]['dia'], hrx_acumulado: process, extra: process, estado: estado, aprobado: aprobado, seleccionado: false });
      
                      (this.arCopiHoraExtra || []).push({ fecha: this.onDataTemp[indexData]['dia'], extra: process, estado: estado });
      
                      if (estado == 'correcto') {
                        if (!this.arHoraExtra.length) {
                          this.arHoraExtra = [process];
                        } else {
                          this.arHoraExtra[0] = this.obtenerHorasTrabajadas(process, this.arHoraExtra[0]);
                        }
                      }
                    }
                  } else {
                    this.onDataTemp[indexData]['hr_faltante'] = process;
                  }
                }
      
                if (this.onDataTemp.length - 1 == indexData) {
                  this.onVerificarHrExtra(this.dataVerify);
                }
              });
      
      
            }
      
            this.hroAcumulada = this.arHoraExtra[0];
            this.hroAcumuladaTotal = this.arHoraExtra[0];
          });
            */
    }
  }

}
