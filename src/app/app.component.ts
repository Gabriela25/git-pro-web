import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'firebase-cms';

  constructor(
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.authSocket()

    this.socketService.getMessage('search-pros').subscribe((msg) => {
      console.log(msg);
    });
  }

  authSocket() {
    if (localStorage.getItem('token')) {
      this.socketService.sendMessage('auth', {});
    }
  }
  /*firestore = inject(Firestore);

  ngOnInit() {
    getDocs(collection(this.firestore, "testPath")).then((response) => {
      console.log(response.docs)
    })
  }*/
}


