import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-socket',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule 
  ],
  templateUrl: './socket.component.html',
  styleUrl: './socket.component.css'
})
export class SocketComponent {
  messages: string[] = [];
  myMessage: string = '';
  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getMessage().subscribe((msg) => {
      console.log('este es el mensaje: ', msg)
      this.messages.push(msg);
    });
  }

  sendMessage() {
    this.socketService.sendMessage(this.myMessage);
    this.myMessage = ''; 
  }
}
