// src/app/services/socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment'; // Asegúrate de que existe
import { GlobalConstants } from '../const/globalConstants';
import { StorageService } from '../utils/storage';

@Injectable({
  providedIn: 'root' // Importante: esto lo convierte en singleton
})
export class SocketService {
  private socket: Socket;
  private token: string;
  constructor(private store: StorageService) {
    this.token = this.store.getStore('tn');
    this.socket = io(GlobalConstants.backendServer, {
      query: { code: 'frontend' },
      auth: {
        token: String((this.token || {})['value'])
      }
      // Puedes pasar opciones aquí, como auth
      //withCredentials: true,
    });
  }

  // Emitir eventos
  emit(event: string, data1?: any, data2?: any) {
    this.socket.emit(event, data1, data2);
  }

  // Escuchar eventos
  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Eliminar listeners (importante al destruir componentes)
  off(event: string) {
    this.socket.off(event);
  }

  // Acceder al socket si es necesario
  getSocket() {
    return this.socket;
  }
}
