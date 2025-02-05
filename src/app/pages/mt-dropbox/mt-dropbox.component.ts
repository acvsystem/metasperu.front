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
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { io } from 'socket.io-client';

@Component({
  selector: 'mt-dropbox',
  templateUrl: './mt-dropbox.component.html',
  styleUrls: ['./mt-dropbox.component.scss'],
})
export class MtDropboxComponent implements OnInit {
  socket = io('http://38.187.8.22:3200', { query: { code: 'app' } });
  dialog = inject(MatDialog);
  arDirectorios: Array<any> = [];
  dataSource = new MatTableDataSource<any>(this.arDirectorios);
  displayedColumns: string[] = ['select', 'nombre', 'modificacion', 'tamaño', 'accion'];
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  pathRoute: string = "";
  arPathSelect: Array<any> = [];
  uploading: boolean = false;
  selection = new SelectionModel<any>(true, []);
  myFiles: Array<any> = [];
  sMsg: string = '';

  constructor(private service: ShareService, private http: HttpClient) { }

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
        let evalueDir = ((dir || {}).name || "").split(".");

        let tamañoFile = (dir.size / (1024 * 1024)).toFixed(2);
        let isMega = dir.size >= 1000000 ? true : false;
        let nomenclatura = isMega ? ' MB' : ' KB';

        this.arDirectorios.push(
          {
            name: dir.name,
            type: evalueDir.length >= 2 ? evalueDir[1] : "directory",
            size: dir.size >= 1000000 ? tamañoFile : (dir.size / 1024).toFixed(2) + nomenclatura,
            mFech: dir.mtime
          }
        );
      });

      this.dataSource = new MatTableDataSource(this.arDirectorios);

    });
  }

  onDeleteFile() {


    if (this.selection['_selected'].length) {
      this.selection['_selected'].filter((row, i) => {

        let pathDelete = this.pathRoute + "/" + row['name'];
        let parms = {
          url: '/deleteDirectory',
          body: {
            route: pathDelete
          }
        };

        this.service.post(parms).then((response) => {
          this.openSnackBar((response || {}).msj);
        });

        if (this.selection['_selected'].length - 1 == i) {
          this.onDirFile();
        }

      });

    } else {
      this.openSnackBar("No hay documentos seleccionados..!!!");
    }

  }

  onDownload() {
    if (this.selection['_selected'].length) {
      this.selection['_selected'].filter((row) => {

        let pathDownload = this.pathRoute + "/" + row['name'];

        let parms = {
          url: '/download/driveCloud',
          parms: [
            { key: "route", value: pathDownload }
          ]
        };

        this.service.getBlob(parms).then((response) => {
          saveAs(response.body, row['name']);
        });

      });
    } else {
      this.openSnackBar("No hay documentos seleccionados..!!!");
    }

  }

  oneDirectory(ev, path?) {
    this.selection.clear();
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
          let evalueDir = ((dir || {}).name || "").split(".");

          let tamañoFile = (dir.size / (1024 * 1024)).toFixed(2);
          let isMega = dir.size >= 1000000 ? true : false;
          let nomenclatura = isMega ? ' MB' : ' KB';
          console.log(dir.size >= 1000000 ? tamañoFile : (dir.size / 1024).toFixed(2) + nomenclatura);

          this.arDirectorios.push(
            {
              name: dir.name,
              type: evalueDir.length >= 2 ? evalueDir[1] : "directory",
              size: dir.size >= 1000000 ? tamañoFile : (dir.size / 1024).toFixed(2) + nomenclatura,
              mFech: dir.mtime
            }
          );
        });

        this.dataSource = new MatTableDataSource(this.arDirectorios);
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

      this.service.post({ url: '/upload/driveCloud', file: images[index] }).then((rs) => {
        if (rs.message == 'success') {
          this.uploading = false;
          console.log(images);
          let indexField = this.arDirectorios.findIndex((dir) => dir.name == (images || [])[index]['name']);
         
          this.arDirectorios[indexField]['process'] = false;
          this.arDirectorios[indexField]['upload'] = true;
        }
      });

      let tamañoFile = (images[index].size / (1024 * 1024)).toFixed(2);
      let isMega = images[index].size >= 1000000 ? true : false;
      let nomenclatura = !isMega ? ' KB' : ' MB';
      let evalueDir = (images[index].name).split(".");
      const file: File = images[index];


      this.arDirectorios.push(
        {
          name: images[index].name,
          type: "txt",
          size: images[index].size >= 1000000 ? tamañoFile : (images[index].size / 1024).toFixed(2) + nomenclatura,
          mFech: "",
          process: true,
          processEnd: false
        }
      );

      this.myFiles.push({
        name: images[index].name,
        size: images[index].size >= 1000000 ? tamañoFile : (images[index].size / 1024).toFixed(2) + nomenclatura
      });




    }




    this.dataSource = new MatTableDataSource(this.arDirectorios);
    console.log(this.dataSource);

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
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getFileDetails(e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    console.log(this.myFiles)
  }

  uploadSuccess: boolean = false;
  percentDone: any = 0;

  uploadAndProgress(files: FormData) {
    console.log(files)

    //Array.from(files).forEach(f => formData.append('file', f))

    this.http.post('http://38.187.8.22:3200/upload/driveCloud', files, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;

          this.uploading = false;
        }
      });
  }

}

