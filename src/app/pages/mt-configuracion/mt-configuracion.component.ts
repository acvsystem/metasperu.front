import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/shareService';

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

  constructor(private service: ShareService) { }

  ngOnInit() {
    this.onListConfiguration();
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

}
