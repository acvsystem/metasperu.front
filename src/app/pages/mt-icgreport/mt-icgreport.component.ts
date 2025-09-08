import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'mt-icgreport',
  templateUrl: './mt-icgreport.component.html',
  styleUrls: ['./mt-icgreport.component.scss'],
})
export class MtIcgreportComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns: string[] = ['departamento', 'unidades', 'importe'];
  dataSource = [];
  isErrorFecha: boolean = false;
  vDetallado: Array<any> = [];
  arCardData: Array<any> = [];

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.socket.on('report:sales:departament:response', (response) => {
     
      let dataResponse: Array<any> = JSON.parse(response['data']);
      let dateResponse: Array<any> = response['date'];
      let dataTable = [];
      (dataResponse || []).filter((dr) => {
        dataTable.push({
          departament: dr.cDepartamento,
          unid: parseInt(dr.cUnidades),
          import: dr.cImporte
        });
      });

      let titleCard = `${dateResponse[0]} - ${dateResponse[1]}`;
      this.arCardData.push({ id: this.arCardData.length + 1, title: titleCard, data: dataTable })

      this.dataSource = dataTable;
      console.log(this.dataSource);
    });
  }

  onCaledar($event) {
    this.isErrorFecha = false;

    if ($event.isRange) {
      this.vDetallado = [];
      let range = $event.value;

      let dateNow = new Date();

      let day = new Date(dateNow).toLocaleDateString().split('/');

      let date = new Date(range[1]).toLocaleDateString().split('/');
      var f1 = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
      var f2 = new Date(parseInt(day[2]), parseInt(day[1]), parseInt(day[0]));

      if (range.length >= 2) {
        this.vDetallado = range;
        console.log(this.vDetallado);
      }
    }
  }

  onConsultar() {
    this.socket.emit('reportSalesDepartament', this.vDetallado);
  }

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
