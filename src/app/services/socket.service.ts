import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

  sendMessage(gateway: string, payload: Object) {
    const token = localStorage.getItem('token') || '';
    const payloadWithToken = {
      ...payload,
      token
    }
    this.socket.emit(gateway, payloadWithToken);
  }

  getMessage(gateway: string = 'recibir-mensaje') {
    return this.socket.fromEvent<any>(gateway);
  }
}
