import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-papeleta-horario',
  templateUrl: './mt-papeleta-horario.component.html',
  styleUrls: ['./mt-papeleta-horario.component.scss'],
})
export class MtPapeletaHorarioComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  onListEmpleado: Array<any> = [];
  cboCasos: string = "";
  horaSalida: string = "";
  horaLlegada: string = "";
  totalHoras: string = "";
  onDataTemp: Array<any> = [];
  parseHuellero: Array<any> = [];
  onListCargo: Array<any> = [
    { key: 'Asesor', value: 'Asesor' },
    { key: 'Gerente', value: 'Gerente' },
    { key: 'Cajero', value: 'Cajero' },
    { key: 'Almacenero', value: 'Almacenero' }
  ];

  onListCasos: Array<any> = [
    { key: "Descanso medico", value: "Descanso medico" },
    { key: "Atencion medica", value: "Atencion medica" },
    { key: "Asunto particular", value: "Asunto particular" },
    { key: "Comision de servicio", value: "Comision de servicio" },
    { key: "Vacaciones programadas", value: "Vacaciones programadas" },
    { key: "Autorizacion de ingreso fuera de horario", value: "Autorizacion de ingreso fuera de horario" },
    { key: "Compensacion de horas trabajadas", value: "Compensacion de horas trabajadas" },
    { key: "Citacion judicial", value: "Citacion judicial" },
    { key: "Capacitacion", value: "Capacitacion" },
    { key: "Otros", value: "Otros" }
  ];
  constructor() { }

  ngOnInit() {
    this.onListEmpleado = [];
    this.onListEmpleado.push({ key: "ANDRE", value: "ANDRE" });
    this.onListEmpleado.push({ key: "JORGE", value: "JORGE" });
    this.onListEmpleado.push({ key: "JOSE", value: "JOSE" });

    this.socket.on('reporteHorario', async (response) => {
      let data = (response || {}).data;
      this.parseHuellero = data;

      await (this.parseHuellero || []).filter(async (huellero) => {

        let indexData = this.onDataTemp.findIndex((data) => ((data || {}).dia == (huellero || []).dia));

        if (indexData == -1) {
          this.onDataTemp.push({
            dia: (huellero || {}).dia,
            hr_ingreso_1: (huellero || {}).hrIn,
            hr_salida_1: (huellero || {}).hrOut,
            hr_brake: "",
            hr_ingreso_2: "",
            hr_salida_2: "",
            hr_trabajadas: this.obtenerDiferenciaHora((huellero || {}).hrIn, (huellero || {}).hrOut),
            hr_extra: 0
          });
        } else {

          this.onDataTemp[indexData]['hr_brake'] = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_salida_1'], (huellero || {}).hrIn);
          this.onDataTemp[indexData]['hr_ingreso_2'] = (huellero || {}).hrIn;
          this.onDataTemp[indexData]['hr_salida_2'] = (huellero || {}).hrOut;
          let hora_trb_1 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_1'], this.onDataTemp[indexData]['hr_salida_1']);
          let hora_trb_2 = this.obtenerDiferenciaHora(this.onDataTemp[indexData]['hr_ingreso_2'], this.onDataTemp[indexData]['hr_salida_2']);
          this.onDataTemp[indexData]['hr_trabajadas'] = this.obtenerHorasTrabajadas(hora_trb_1, hora_trb_2);
          this.onDataTemp[indexData]['hr_extra'] = this.obtenerHoraExtra(this.onDataTemp[indexData]['hr_trabajadas'], "8:00");
        }

      });
      console.log(this.onDataTemp);
    });


  }

  async onChangeSelect(data: any) {
    const self = this;
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";

    if (this.cboCasos == 'Compensacion de horas trabajadas') {
      let dateNow = new Date();

      var año = dateNow.getFullYear();
      var mes = (dateNow.getMonth() + 1);
      let dayNow = dateNow.getDay();
      let day = new Date(dateNow).toLocaleDateString().split('/');

      let configuracion = [{
        fechain: `${año}-${mes - 2}-${day[0]}`,
        fechaend: `${año}-${mes}-${day[0]}`,
        nro_documento: '77506437'
      }]
      this.socket.emit('consultaHorasTrab', configuracion);
    }
  }

  obtenerMinutos(hora_1, hora_2) {

    let hora_1_pr = hora_1.split(":");
    let hora_2_pr = hora_2.split(":");
    let residuo_1 = 0;
    let minutos = 0;
    let hora = 0;

    if (hora_1_pr[1] > 0 || hora_1_pr[1] == 0) {

      if (hora_1_pr[0] == hora_2_pr[0]) {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);
        minutos = residuo_1 - 60;

      } else {
        residuo_1 = (60 - parseInt(hora_1_pr[1])) + parseInt(hora_2_pr[1]);

        if (residuo_1 > 59) {
          minutos = residuo_1 - 60;
          hora = 1;

        } else {
          minutos = residuo_1;
        }
      }

    }

    return [hora, minutos];
  }

  obtenerHoras(hora) {
    let hora_pr = hora.split(":");
    return parseInt(hora_pr[0]) * 60;
  }

  obtenerHoraExtra(hrRs_1, hrRs_2) {
    let hr_1 = hrRs_1.split(":");
    let hr_2 = hrRs_2.split(":");
    let resultado = "";
    if (hr_1[0] == 8) {
      let dif_min = parseInt(hr_1[1]) + parseInt(hr_2[1]);
      let dif_hora = parseInt(hr_1[0]) + parseInt(hr_2[0]);
      let dif_res = 0;
      let dif_hr = 0;

      if (dif_min > 59) {
        dif_res = dif_min - 60;
        dif_hr = dif_hora + 1;
      } else {
        dif_hr = dif_hora;
        dif_res = dif_min;
      }
      resultado = `${dif_hr}:${(dif_res < 10) ? '0' + dif_res : dif_res}`;

    }
    
    return resultado;
  }

  obtenerDiferenciaHora(hr1, hr2) {
    let diferencia = 0;
    let hora_1 = this.obtenerHoras(hr1);
    let hora_2 = this.obtenerHoras(hr2);
    let minutos = this.obtenerMinutos(hr1, hr2);
    let hrExtr = (minutos[0] > 0) ? minutos[0] : 0;

    if (hora_1 > hora_2) {
      diferencia = hora_1 - hora_2;
    } else {
      diferencia = hora_2 - hora_1;
    }

    let hora_1_pr = hr1.split(":");
    let hora_2_pr = hr2.split(":");
    let hr_resta: number = (hora_1_pr[1] > 0) ? parseInt(hora_1_pr[1]) : parseInt(hora_2_pr[1]);
    let horaResult = ((diferencia - hr_resta) / 60).toString();
    return `${parseInt(horaResult) + hrExtr}:${(minutos[1] < 10) ? '0' + minutos[1] : minutos[1]}`;
  }

  onCaledar(ev) {
    if (ev.isTime) {
      this[ev.id] = ev.value;
      if (this.horaSalida.length && this.horaLlegada.length) {
        this.onVerificarHoras();
      }
    }
  }

  onVerificarHoras() {

  }

  obtenerHorasTrabajadas(hrRs_1, hrRs_2) {
    let hr_1 = hrRs_1.split(":");
    let hr_2 = hrRs_2.split(":");
    let dif_min = parseInt(hr_1[1]) + parseInt(hr_2[1]);
    let dif_hora = parseInt(hr_1[0]) + parseInt(hr_2[0]);
    let dif_res = 0;
    let dif_hr = 0;

    if (dif_min > 59) {
      dif_res = dif_min - 60;
      dif_hr = dif_hora + 1;
    } else {
      dif_hr = dif_hora;
      dif_res = dif_min;
    }

    return `${dif_hr}:${(dif_res < 10) ? '0' + dif_res : dif_res}`;
  }

}
