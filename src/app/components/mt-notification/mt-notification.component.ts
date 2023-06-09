import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ShareService } from '../../services/shareService';

@Component({
  selector: 'mt-notification',
  templateUrl: './mt-notification.component.html',
  styleUrls: ['./mt-notification.component.scss'],
})
export class MtNotificationComponent implements OnInit {

  configurationList: any = [];
  isSuccess: boolean = false;
  isError: boolean = false;
  isCaution: boolean = false;
  isInformation: boolean = false;
  bodyNotification: string = "";
  isTimeClose: boolean = false;

  constructor(private service: ShareService) { }

  ngOnInit() {
    this.service.onNotification.subscribe((configuration) => {
      this.configurationList = [];
      this.isTimeClose = false;
      this.configurationList = configuration;

      setTimeout(() => {
        this.isTimeClose = true;
      }, 3000);
    });
  }

}
