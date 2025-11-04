import { inject, model, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  password: string;
}

@Component({
  selector: 'mt-aprobar-horas',
  templateUrl: './mt-aprobar-horas.component.html',
  styleUrls: ['./mt-aprobar-horas.component.scss'],
})
export class MtAprobarHorasComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MtAprobarHorasComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly password = model(this.data.password);
  inputPassword: string = "";

  constructor() { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

}

