import { Component, Input, OnInit } from '@angular/core';

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
  viewPassword: boolean = false;
  typePassword: string = "password";

  constructor() { }

  ngOnInit() { }

  onCopyText() {
    var copyTextarea = document.getElementById("inputURL") as HTMLInputElement;
    copyTextarea.select();
    document.execCommand("copy");
  }
}
