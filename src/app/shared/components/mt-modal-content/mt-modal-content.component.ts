import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'mt-modal-content',
  templateUrl: './mt-modal-content.component.html',
  styleUrls: ['./mt-modal-content.component.scss'],
})
export class MtModalContentComponent implements OnInit {
  @Input() nameSection: string = '';
  @Input() title: string = '';
  @Input() bodyContent: any = '';
  contentHTML: any = '';

  constructor(private modalLogin: ModalController, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(this.bodyContent);
  }

  oncloseModal() {
    this.modalLogin.dismiss();
  }

}
