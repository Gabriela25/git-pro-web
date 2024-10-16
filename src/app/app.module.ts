import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';


const config: SocketIoConfig = { url: 'http://localhost:4500', options: {} };

@NgModule({

  imports: [

    CommonModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [SocketIoModule],

})
export class AppModule {}
