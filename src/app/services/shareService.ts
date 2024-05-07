import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  @Output() onNotification: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelect: EventEmitter<any> = new EventEmitter();

  constructor() { }


}
