import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ShareService } from '../../services/shareService';
import { StorageService } from 'src/app/utils/storage';

@Component({
  selector: 'app-mt-rrhh-asistencia',
  templateUrl: './mt-rrhh-asistencia.component.html',
  styleUrls: ['./mt-rrhh-asistencia.component.scss'],
})
export class MtRrhhAsistenciaComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  headList = ['codigo EJB', 'Documento', 'Nombre Completo', 'Fecha', 'Hr Entrada 1', 'Hr Salida 1', 'Hrs Brake', 'Hr Entrada 2', 'Hr Salida 2', 'Hrs Trabajadas'];
  isLoading: boolean = false;
  fechaInicio: string = "";
  parseEJB: Array<any> = [];
  parseHuellero: Array<any> = [];
  onDataView: Array<any> = [];
  onDataParse: Array<any> = [];
  isViewDefault: boolean = true;
  isViewFeriados: boolean = false;
  onListReporte: Array<any> = [
    { key: 'General', value: 'General' },
    { key: 'Feriados', value: 'Feriados' },
    { key: 'Detallado', value: 'Detallado' }
  ];

  constructor() { }

  ngOnInit() {

    this.socket.on('reporteHuellero', (configuracion) => {
      let dataResponse = [];

      if (configuracion.id == "EJB") {
        let dataEJB = [];
        dataEJB = (configuracion || {}).data || [];

        (dataEJB || []).filter((ejb) => {
          this.parseEJB.push({
            codigoEJB: ((ejb || {}).CODEJB).trim(),
            nombre_completo: `${(ejb || {}).APEPAT} ${(ejb || {}).APEMAT} ${(ejb || {}).NOMBRE}`,
            nro_documento: ((ejb || {}).NUMDOC).trim(),
            telefono: ((ejb || {}).TELEFO).trim(),
            email: ((ejb || {}).EMAIL).trim(),
            fec_nacimiento: ((ejb || {}).FECNAC).trim(),
            fec_ingreso: ((ejb || {}).FECING).trim(),
            status: ((ejb || {}).STATUS).trim()
          });
        });
      }

      if (configuracion.id == "servGeneral") {
        let dataServGeneral = [];
        dataServGeneral = (configuracion || {}).data || [];
        console.log(dataServGeneral);
        (dataServGeneral || []).filter((huellero) => {
          this.parseHuellero.push({
            nro_documento: (huellero || {}).nroDocumento,
            dia: (huellero || {}).dia,
            hr_ingreso: (huellero || {}).hrIn,
            hr_salida: (huellero || {}).hrOut,
            hr_trabajadas: (huellero || {}).hrWorking,
            caja: (huellero || {}).caja
          });
        });
      }

      if (this.parseEJB.length && this.parseHuellero.length) {
        this.onDataView = [];
        (this.parseEJB || []).filter(async (ejb) => {
          await (this.parseHuellero || []).filter((huellero) => {
            if ((ejb || {}).nro_documento == (huellero || {}).nro_documento) {
              let indexData = this.onDataView.findIndex((data) => data.nro_documento == (ejb || {}).nro_documento);

              if (indexData == -1) {
                this.onDataView.push({
                  codigoEJB: (ejb || {}).codigoEJB,
                  nombre_completo: (ejb || {}).nombre_completo,
                  nro_documento: (ejb || {}).nro_documento,
                  telefono: (ejb || {}).telefono,
                  email: ((ejb || {}).email).trim(),
                  fec_nacimiento: (ejb || {}).fec_nacimiento,
                  fec_ingreso: (ejb || {}).fec_ingreso,
                  status: (ejb || {}).status,
                  dia: (huellero || {}).dia,
                  hr_ingreso_1: (huellero || {}).hr_ingreso,
                  hr_salida_1: (huellero || {}).hr_salida,
                  hr_brake: "",
                  hr_ingreso_2: "",
                  hr_salida_2: "",
                  hr_trabajadas: (huellero || {}).hr_trabajadas,
                  caja: (huellero || {}).caja
                });
              } else {
                this.onDataView[indexData]['hr_brake'] = "";
                this.onDataView[indexData]['hr_ingreso_2'] = (huellero || {}).hr_ingreso;
                this.onDataView[indexData]['hr_salida_2'] = (huellero || {}).hr_salida;
              }


            }
          })
        })


      }



    });
  }

  onConsultarAsistencia() {
    var configuracion = {
      isDefault: false,
      isFeriados: true,
      centroCosto: 'BBW',
      dateList: ['2024','07']
    };

    this.socket.emit('consultaMarcacion', configuracion);
  }

  onChangeInput(data: any) {
    const self = this;
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if ((selectData || {}).key == "General") {
      this.isViewDefault = true;
      this.isViewFeriados = false;
      this.headList = ['codigo EJB', 'Documento', 'Nombre Completo', 'Fecha', 'Hr Entrada 1', 'Hr Salida 1', 'Hrs Brake', 'Hr Entrada 2', 'Hr Salida 2', 'Hrs Trabajadas'];
    }

    if ((selectData || {}).key == "Feriados") {
      this.isViewFeriados = true;
      this.isViewDefault = false;
      this.headList = ['codigo EJB', 'Documento', 'Nombre Completo', 'Feriados Trabajados'];

    }

  }

}
