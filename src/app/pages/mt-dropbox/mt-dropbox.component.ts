import { Component, inject, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/shareService';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MtAccionCloudComponent } from './mt-accion-cloud/mt-accion-cloud.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'mt-dropbox',
  templateUrl: './mt-dropbox.component.html',
  styleUrls: ['./mt-dropbox.component.scss'],
})
export class MtDropboxComponent implements OnInit {
  dialog = inject(MatDialog);
  arDirectorios: Array<any> = [];
  dataSource: Array<any> = [];
  displayedColumns: string[] = ['select', 'nombre', 'modificacion', 'tamaño', 'accion'];
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  pathRoute: string = "";
  arPathSelect: Array<any> = [];
  uploading: boolean = false;
  selection = new SelectionModel<any>(true, []);

  constructor(private service: ShareService) { }

  ngOnInit() {
    this.onDirFile();
    /*
        var myButton = document.getElementById('myButton');
        myButton.addEventListener('contextmenu', function(event) {
          // Prevenir el comportamiento por defecto del navegador al hacer clic derecho
          event.preventDefault();
          // Limpiar consola
          console.clear();
          // Mostrar un mensaje en la consola cuando se simula un clic derecho
          console.log('Clic derecho simulado');
          // Mostrar el menú contextual cambiando su estilo para que sea visible
    
      });
    */
  }


  openDialog(parametro) {
    const dialogRef = this.dialog.open(MtAccionCloudComponent, {
      data: {
        accion: parametro,
        path: this.pathRoute
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.oneDirectory('', result);
    });
  }

  onDirFile() {
    let parms = {
      url: '/listDirectory'
    };

    this.service.get(parms).then((response) => {
      this.arDirectorios = [];
      this.arPathSelect = [];
      this.pathRoute = "";
      let directorioList = response;
      (directorioList || []).filter((dir) => {
        let evalueDir = (dir || "").split(".");
        this.arDirectorios.push(
          {
            name: dir,
            type: evalueDir.length >= 2 ? "file" : "directory"
          }
        );
      });

      this.dataSource = this.arDirectorios;

    });
  }

  onDeleteFile(ev) {
    let route = ev;
    let parms = {
      url: '/deleteDirectory',
      body: {
        route: route
      }
    };

    this.service.post(parms).then((response) => {
      this.openSnackBar((response || {}).msj);
      this.onDirFile();
    });
  }

  onDownload() {
    let selected = this.selection['_selected'];
    let pathDownload = this.pathRoute + "/" + this.selection['_selected'][selected.length - 1]['name'];
    let parms = {
      url: '/download/driveCloud',
      parms: [
        { key: "route", value: pathDownload }
      ]
    };

    this.service.getBlob(parms).then((response) => {
      const link = document.createElement('a');
      link.href = response.url;
      link.download = this.selection['_selected'][selected.length - 1]['name'];
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    });
    console.log(pathDownload);
  }
  oneDirectory(ev, path?) {

    if (!path.length) {
      let route = ev;
      this.pathRoute = !this.pathRoute.length ? route.name : this.pathRoute + "/" + route.name;
      this.arPathSelect = this.pathRoute.split("/");
    } else {
      this.pathRoute = path;
    }

    let validDownload = this.arPathSelect[this.arPathSelect.length - 1];
    let validDw = validDownload.split(".");

    if (validDw.length > 1) {
      let parms = {
        url: '/download/driveCloud',
        parms: [
          { key: "route", value: this.pathRoute }
        ]
      };

      this.service.getBlob(parms).then((response) => {
        console.log(validDownload);
        const link = document.createElement('a');
        link.href = response.url;
        link.download = validDownload;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      });

    } else {
      let parms = {
        url: '/oneListDirectory',
        body: {
          path: this.pathRoute
        }
      };
      this.service.post(parms).then((response) => {
        this.arDirectorios = [];
        let directorioList = response;
        (directorioList || []).filter((dir) => {
          let evalueDir = (dir || "").split(".");
          this.arDirectorios.push(
            {
              name: dir,
              type: evalueDir.length >= 2 ? "file" : "directory"
            }
          );
        });

        this.dataSource = this.arDirectorios;
      });
    }

  }

  openSnackBar(msj) {
    this._snackBar.open(msj, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000
    });
  }


  private uploadFiles(images: FileList): void {
    this.uploading = true;

    for (let index = 0; index < images.length; index++) {

      const element = images[index];
      let tamañoFile = (images[0].size / (1024 * 1024)).toFixed(2);
      let isMega = images[0].size >= 1000000 ? true : false;
      let nomenclatura = isMega ? ' MB' : ' KB';
      console.log(images[0].name, images[0].size >= 1000000 ? tamañoFile : (images[0].size / 1024).toFixed(2) + nomenclatura);
      this.uploading = false;
      /*
            this.fakeImageUploadService.uploadImage(element).subscribe((p) => {
              this.imagesUrl.push(p);
      
              this.uploading = false;
            });*/
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (event?.dataTransfer?.files) {
      this.uploadFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }



}

