import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

  sendMessage(msg: string) {
    this.socket.emit('enviar', msg);
  }

  getMessage() {
    return this.socket.fromEvent<string>('recibir-mensaje');
  }
}
