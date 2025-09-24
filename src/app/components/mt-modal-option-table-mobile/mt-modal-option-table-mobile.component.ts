import { Component, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'mt-modal-option-table-mobile',
  templateUrl: './mt-modal-option-table-mobile.component.html',
  styleUrls: ['./mt-modal-option-table-mobile.component.scss'],
})
export class MtModalOptionTableMobileComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MtModalOptionTableMobileComponent>);
  constructor() { }

  ngOnInit() { }

  onResponse(isOption): void {
    this.dialogRef.close(isOption);
  }
}
