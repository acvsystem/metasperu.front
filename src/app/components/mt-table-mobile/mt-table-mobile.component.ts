import { Component, OnInit, Input, SimpleChanges, inject, EventEmitter, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MtModalOptionTableMobileComponent } from '../mt-modal-option-table-mobile/mt-modal-option-table-mobile.component';
@Component({
  selector: 'mt-table-mobile',
  templateUrl: './mt-table-mobile.component.html',
  styleUrls: ['./mt-table-mobile.component.scss'],
})
export class MtTableMobileComponent implements OnInit {

  @Input() data: Array<any> = [];
  @Output() afterAction: EventEmitter<any> = new EventEmitter();
  @Output() afterView: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('data')) {
    }
  }


  readonly dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, data): void {
    const dialogRef = this.dialog.open(MtModalOptionTableMobileComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.afterAction.emit({ approved: result, data: data });
    });
  }

  onViewRegister(data) {
    this.afterView.emit(data);
  }


}
