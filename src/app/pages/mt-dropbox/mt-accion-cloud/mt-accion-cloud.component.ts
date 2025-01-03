import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ShareService } from 'src/app/services/shareService';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'mt-accion-cloud',
  templateUrl: './mt-accion-cloud.component.html',
  styleUrls: ['./mt-accion-cloud.component.scss'],
})
export class MtAccionCloudComponent implements OnInit {
  directoryName: string = "Carpeta sin titulo";
  private _snackBar = inject(MatSnackBar);
  readonly dialogRef = inject(MatDialogRef<MtAccionCloudComponent>);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private service: ShareService) { }

  ngOnInit() { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreateDirectory() {
    let parms = {
      url: '/createDirectory',
      body: { route: this.directoryName }
    };

    this.service.post(parms).then((response) => {
      this.openSnackBar((response || {}).msj);
      this.dialogRef.close();
    });

  }

  onChangeInput(data: any) {
    console.log(data);
    let inputData = data || {};
    let index = (inputData || {}).id || "";
    this[index] = (inputData || {}).value || "";
  }

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }

}
