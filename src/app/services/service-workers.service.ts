import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { catchError, from, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthHeaders } from './auth-headers.service';
import { Router } from '@angular/router';
import { Notification } from '../interface/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkersService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private vapidPublicKey = environment.vapidPublicKey;
  permissionValue!: NotificationPermission;
  constructor
    (private http: HttpClient,
      private authHeadersService: AuthHeaders,
      private router: Router
    ) {

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.action === 'update-url') {
        this.updateUrl(event.data.url);
      }
    });
  }

  urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  subscribeToPushNotifications(): Observable<any> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return from(Promise.reject('El navegador no soporta Service Workers o Push Notifications.'));
    }

    return from(Notification.requestPermission()).pipe(
      switchMap(permission => {
        this.permissionValue = permission;
        if (permission === 'denied') {
          //this.sendSubscriptionToServer(null);
          return throwError(() => new Error('El usuario denegó los permisos de notificación.'));
        }
        return from(navigator.serviceWorker.register('/service-worker.js'));
      }),
      switchMap(registration => {
        console.log('Service Worker registrado:', registration);
        return from(navigator.serviceWorker.ready); // Asegurar que el SW está listo
      }),
      switchMap(registration => {
        const convertedVapidKey = this.urlB64ToUint8Array(this.vapidPublicKey);
        return from(registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey as BufferSource
        }));
      }),
      tap(subscription => {
        console.log('Usuario suscrito:', subscription);
        this.sendSubscriptionToServer(subscription);
      }),
      catchError(error => {
        console.error('Error en la suscripción:', error);
        return of(null);
      })
    );
  }
  sendSubscriptionToServer(subscription: PushSubscription | null) {
    const payload = {
      subscription,
      permission: this.permissionValue,
      device: navigator.userAgent
    };

    const headers = this.authHeadersService.getHeaders();
    this._http.post(`${this.apiUrlBackend}/notifications/subscribe`, payload, headers).subscribe({
      next: () => console.log('Suscripción enviada al servidor'),
      error: err => console.error('Error al enviar suscripción:', err)
    });
  }
  getPushNavigatorStatus(): string | null {
    console.log('Entré en el método getPushSubscription');

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('El navegador no soporta Service Workers o Push API.');
      return null;
    }

    return Notification.permission;

  }
  getSubscriptionActive(): Promise<string | null> {
    console.log('Entré en el método getPushNavigatorStatus');
  
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('El navegador no soporta Service Workers o Push API.');
      return Promise.resolve(null);
    }
  
    return navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(subscription => {
        if (subscription) {
          console.log('El navegador ya tiene una suscripción activa:', subscription.endpoint);
          return 'subscribed'; 
        } else {
          console.log('No hay suscripción activa.');
          return 'unsubscribed'; 
        }
      })
      .catch(error => {
        console.error('Error verificando la suscripción:', error);
        return null;
      });
  }
   
  getStatusByUser(): Observable<{notification:Notification}> {
    const headers = this.authHeadersService.getHeaders()
    return this._http.get<{notification:Notification}>(`${this.apiUrlBackend}/notifications/status`, headers);
  }

  private updateUrl(url: string) {
    //obtenermos el url
    const newUrl = new URL(url);

    // Extraemos la parte después del #
    const hashPath = newUrl.hash;

    const segments = hashPath.split('/');
    //obtnemos el id
    const id = segments[segments.length - 1];
    console.log('id del lead o order',id)
    //si el id existe actualizamos la ruta
    if (id) {

      this.router.navigate(['/leads/detail/', id]);
    }
  }
  removeNotification(id: string):Observable<{message:string}>{
  
      const headers = this.authHeadersService.getHeaders(); 
      return this._http.delete<{ message:string}>(`${this.apiUrlBackend}/notifications/${id}`, headers);
  
  }  
}