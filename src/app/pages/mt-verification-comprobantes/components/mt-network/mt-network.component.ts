import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";

@Component({
  selector: 'mt-network',
  templateUrl: './mt-network.component.html',
  styleUrls: ['./mt-network.component.scss'],
})
export class MtNetworkComponent implements OnInit {
  token: any = localStorage.getItem('tn');
  socket = io('http://159.65.226.239:4200', { query: { code: 'app', token: this.token } });
  arNetResponse: Array<any> = [];
  isLoading: boolean = false;
  isNetScan: boolean = false;

  constructor() { }

  ngOnInit() {
    this.socket.on('appResNetScan', (data) => {
      let resNet = [];
      this.arNetResponse = [];
      resNet = JSON.parse(data);
      (resNet || []).filter((netdata: any) => {
        let mac = netdata.addresses.mac;
        this.arNetResponse.push({
          ip: netdata.addresses.ipv4 || "Desconocido",
          mac: netdata.addresses.mac || "Desconocido",
          referencia: netdata.vendor[mac] || "Desconocido"
        });
      });

      this.isLoading = false;
    });
  }

  onScanNet() {
    this.isLoading = true;
    this.isNetScan = true;
    this.socket.emit('emitScanNet', 'angular');
  }

}
