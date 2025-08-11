import { ChangeDetectionStrategy, inject, model, signal, Component, OnInit, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import * as $ from 'jquery';

export interface DialogData {
  comentario: string;
  isViewComentario: boolean;
  isRechazar: boolean;
  isStock: boolean;
}

@Component({
  selector: 'mt-modal-comentario',
  templateUrl: './mt-modal-comentario.component.html',
  styleUrls: ['./mt-modal-comentario.component.scss'],
})
export class MtModalComentarioComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MtModalComentarioComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly comentario = this.data.comentario;
  readonly isViewComentarioModal = this.data.isViewComentario;
  readonly isRechazarModal = this.data.isRechazar;
  readonly isStockModal = this.data.isStock;
  vComentario: string = "";
  isViewcomentario: any = this.isViewComentarioModal;
  isRechazar: any = this.isRechazarModal;
  isStock: any = this.isStockModal;
  cboComentarios: string = "";
  dataComentarios: Array<any> = [
    { key: "No marco su salida de turno", value: "No marco su salida de turno" },
    { key: "No marco su salida a break", value: "No marco su salida a break" },
    { key: "Error de sistema", value: "Error de sistema" }
  ];
  constructor() { }

  ngOnInit() {
  }

  onChangeTextArea(data: any) {
    let id = data.target.id;
    let inputData = $(`#${id}`).val();
    this[id] = inputData || "";
  }

  onChangeInput(data: any) {
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.dialogRef.close(this.vComentario);
  }

  async onChangeSelect(data: any) {
    let selectData = data || {};
    let index = (selectData || {}).selectId || "";
    this[index] = (selectData || {}).key || "";
  }
}
