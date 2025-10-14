// src/app/services/socket.service.ts

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
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
            query: { code: 'app' },
            auth: {
                token: String((this.token || {})['value'])
            }
        });
    }


    // --- Método general ---
    on<T>(eventName: string): Observable<T> {
        return new Observable<T>(observer => {
            this.socket.on(eventName, (data: T) => observer.next(data));
        });
    }

    emit(eventName: string, data?: any): void {
        this.socket.emit(eventName, data);
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    onComprobantes(): Observable<any[]> {
        return this.on<any[]>('comprobantes:get:response');
    }

    onTransacciones(): Observable<any[]> {
        return this.on<any[]>('transacciones:get:response');
    }

    onTerminalesName(): Observable<any[]> {
        return this.on<any[]>('terminales:get:name:response');
    }

    onTerminalesCantidad(): Observable<any[]> {
        return this.on<any[]>('terminales:get:cantidad:response');
    }

    onTrafficOnline(): Observable<any> {
        return this.on<any>('traffic:get:online:response');
    }

    onComparacionBD(): Observable<any> {
        return this.on<any>('comparacion:get:bd:response');
    }

    onConexionICG(): Observable<any[]> {
        return this.on<any[]>('conexion:serverICG:send');
    }

    onStatusSunat(): Observable<any> {
        return this.on<any>('status:serverSUNAT:send');
    }

    onDataClientNull(): Observable<any[]> {
        return this.on<any[]>('sendDataClient');
    }

    onSendNotificationSunat(): Observable<any[]> {
        return this.on<any[]>('sendNotificationSunat');
    }

    // --- 🔹 Acciones de envío ---

    getComprobantes(): void {
        this.emit('comprobantes:get', 'angular');
    }

    getTransacciones(): void {
        this.emit('transacciones:get', 'angular');
    }

    getTerminalesName(): void {
        this.emit('terminales:get:name', 'angular');
    }

    getTerminalesCantidad(): void {
        this.emit('terminales:get:cantidad', 'angular');
    }

    getComparacionBD(): void {
        this.emit('comparacion:get:bd', 'angular');
    }

    getTrafficOnline(storeId: string): void {
        this.emit('traffic:get:online', storeId);
    }

    cleanColaFront(): void {
        this.emit('cleanColaFront');
    }

    transferirCola(dataTransferencia: any): void {
        this.emit('transacciones:post', dataTransferencia);
    }

    getClientesNull(lista: string[]): void {
        this.emit('cleanClient', lista);
    }

    emitirLimpiezaClientes(lista: string[]): void {
        this.emit('emitCleanClient', lista);
    }

}
