import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-configuracion',
  templateUrl: './mt-configuracion.component.html',
  styleUrls: ['./mt-configuracion.component.scss'],
})
export class MtConfiguracionComponent implements OnInit {

  menuList: Array<any> = [
    "Envio de correo",
    "Programacion de tarea"
  ];

  emailList: Array<any> = [];
  emailSend: string = "";
  isEmailDelete: boolean = false;
  userEmailService: string = "";
  passEmailService: string = "";
  dataEmailService: Array<any> = [];
  dataEmailListSend: Array<any> = [];
  emailLinkRegistro: string = "";
  hashAgente: string = "";
  token: any = localStorage.getItem('tn');
  optionNivelList: Array<any> = [
    { id: "Administrador", value: "Administrador" },
    { id: "rrhh", value: "RRhh" }
  ];

  optionListHashNivel: Array<any> = [
    { id: "ADMINSITRADOR", value: "ADMINITRADOR" },
    { id: "SERVER", value: "SERVER" },
    { id: "AGENTE", value: "AGENTE" },
    { id: "SUNAT", value: "SUNAT" },
    { id: "VERIFICACION DOCUMENTO", value: "VERIFICACION DOCUMENTO" }
  ];

  selectNivel: any = {};
  selectedHashNivel: string = "";
  tiendasList: Array<any> = [
    { key: '7A', value: 'BBW JOCKEY', progress: 0 },
    { key: '9A', value: 'VSBA JOCKEY', progress: 0 },
    { key: 'PC', value: 'AEO JOCKEY', progress: 0 },
    { key: 'PB', value: 'AEO ASIA', progress: 0 },
    { key: '7E', value: 'BBW LA RAMBLA', progress: 0 },
    { key: '9D', value: 'VS LA RAMBLA', progress: 0 },
    { key: '9B', value: 'VS PLAZA NORTE', progress: 0 },
    { key: '7C', value: 'BBW SAN MIGUEL', progress: 0 },
    { key: '9C', value: 'VS SAN MIGUEL', progress: 0 },
    { key: '7D', value: 'BBW SALAVERRY' },
    { key: '9I', value: 'VS SALAVERRY' },
    { key: '9G', value: 'VS MALL DEL SUR' },
    { key: '9H', value: 'VS PURUCHUCO', progress: 0 },
    { key: '9M', value: 'VS ECOMMERCE', progress: 0 },
    { key: '7F', value: 'BBW ECOMMERCE', progress: 0 },
    { key: 'PA', value: 'AEO ECOMMERCE', progress: 0 },
    { key: '9K', value: 'VS MEGA PLAZA', progress: 0 },
    { key: '9L', value: 'VS MINKA', progress: 0 },
    { key: '9F', value: 'VSFA JOCKEY FULL', progress: 0 },
    { key: '7A7', value: 'BBW ASIA', progress: 0 }
  ];

  socket = io('http://159.65.226.239:4200', { query: { code: 'app', token: this.token } });

  constructor(private service: ShareService) { }

  ngOnInit() {
    this.onListConfiguration();

    this.socket.on('status:updateFile', (status) => {
      console.log(status);
    });
  }

  onUpdateAgentFront() {
    let body = {
      hash: this.hashAgente,
      fileName: this.selectedHashNivel == "SUNAT" ? "SUNAT.zip" : this.selectedHashNivel == "AGENTE" ? "agnFront.py" : "PLUGIN_VALIDACION.zip"
    }

    this.socket.emit('update:file:FrontAgent', this.hashAgente);
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

  onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).value || "";
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
      console.log(response);
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
      console.log(response);
    });
  }

  onSendLinkRegister() {
    var nivelUser = this.selectNivel;

    let parms = {
      url: '/settings/service/email/register',
      body: { path: 'create-account', email: this.emailLinkRegistro, nivel: nivelUser }
    };

    this.service.post(parms).then((response) => {
      console.log(response);
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

  onSendTestEmail() {
    let parms = {
      url: '/settings/service/email/sendTest',
      body: []
    };
    console.log(parms);
    this.service.post(parms).then((response) => {
      console.log(response);
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
        console.log(response);
        this.hashAgente = (response || {}).hash;
      }
    });
  }

}
