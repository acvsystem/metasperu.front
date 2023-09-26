import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'mt-input',
  templateUrl: './mt-input.component.html',
  styleUrls: ['./mt-input.component.scss'],
})
export class MtInputComponent implements OnInit {
  @Input() id: string = 'mt-input-' + Math.floor(Math.random() * 9999 + 1111);
  @Input() label: string = "label";
  @Input() type: string = "text";
  @Input() placeholder: string = "placeholder";
  @Input() value: string = "";
  @Input() isCopy: boolean = false;
  @Input() sizeSllim: boolean = false;
  @Input() isRequired: boolean = false;
  @Output() afterChange: EventEmitter<any> = new EventEmitter();
  viewPassword: boolean = false;
  typePassword: string = "password";

  constructor(private clipboard: Clipboard) { }

  ngOnInit() { }

  onCopyText() {
    var copyTextarea = document.getElementById(`${this.id}`) as HTMLInputElement;
    //copyTextarea.select();
    this.clipboard.copy;
    //document.execCommand("copy");
  }

  onChange(ev: any) {
    const self = this;
    let value = (ev.target.value || '').trim();
    // this.checkout.setValues(this.id, value);
    this.afterChange.emit({ id: self.id, value: value });
  }
}
