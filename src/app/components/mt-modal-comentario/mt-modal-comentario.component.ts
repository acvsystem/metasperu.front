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
  isRechazar:boolean;
}

@Component({
  selector: 'mt-modal-comentario',
  templateUrl: './mt-modal-comentario.component.html',
  styleUrls: ['./mt-modal-comentario.component.scss'],
})
export class MtModalComentarioComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MtModalComentarioComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly comentario = model(this.data.comentario);
  readonly isViewComentarioModal = model(this.data.isViewComentario);
  readonly isRechazarModal = model(this.data.isRechazar);
  vComentario: string = "";
  isViewcomentario: any = this.isViewComentarioModal;
  isRechazar: any = this.isRechazarModal;
  constructor() { }

  ngOnInit() {
   }

  onChangeTextArea(data: any) {
    let id = data.target.id;
    let inputData = $(`#${id}`).val();
    this[id] = inputData || "";
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.dialogRef.close(this.vComentario);
  }

}
