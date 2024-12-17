import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';



const config: SocketIoConfig = { url: environment.apiUrlBackend, options: {} };

@NgModule({

  imports: [

    CommonModule,
    SocketIoModule.forRoot(config),
    
  ],
  providers: [SocketIoModule],

})
export class AppModule {}
