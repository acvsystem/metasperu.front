import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() dataIn: any = '';
  @Input() dataEmployeeList = {};
  @Input() dataAsistencia: Array<any> = [];
  @Output() onResponseModal: EventEmitter<any> = new EventEmitter();
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();

  contentHTML: any = '';

  constructor(private modalLogin: ModalController, private sanitizer: DomSanitizer) { }

  ngOnInit() {
   
    this.contentHTML = this.sanitizer.bypassSecurityTrustHtml(this.bodyContent);
  }

  oncloseModal() {
    this.dataEmployeeList = {};
    this.onCloseModal.emit(true);
    this.modalLogin.dismiss();
  }

  onResponseComponent($event) {
    if (this.bodyContent == "mt-frm-add-employee" && $event) {
      this.onResponseModal.emit($event);
      this.oncloseModal();
    }
  }

}
