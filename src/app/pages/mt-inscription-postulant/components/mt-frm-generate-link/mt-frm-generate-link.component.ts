import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';


@Component({
  selector: 'mt-frm-generate-link',
  templateUrl: './mt-frm-generate-link.component.html',
  styleUrls: ['./mt-frm-generate-link.component.scss'],
})
export class MtFrmGenerateLinkComponent implements OnInit {
  txtLink: string = "";

  constructor(private service: ShareService) { }

  ngOnInit() {
    
  }

  onGenerateLink() {

    let parms = {
      url: '/security/create/access/postulante'
    };

    this.service.get(parms).then((response) => {
      this.txtLink = response;
    });
  }

 
}
