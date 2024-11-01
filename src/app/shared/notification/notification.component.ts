import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  subscribeToPushNotifications() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {

      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);

          const vapidPublicKey = 'BA0DV_x_XXFmTQICsIa8bS6O8l3wUFnh8iYDuziX3fgJAIJMPQH5jb9C7x43f6LmyQ-Tv84yTrS8j4BpMAuUlHY'; // Tu clave pública VAPID
          const convertedVapidKey = this.urlB64ToUint8Array(vapidPublicKey);

          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        })
        .then((subscription) => {
          console.log('Usuario suscrito:', subscription);
          this.sendSubscriptionToServer(subscription);
        })
        .catch((error) => {
          console.error('Error al suscribir al usuario:', error);
        });

    } else {
      console.error('El navegador no soporta Service Workers o Push Notifications.');
    }
  }



  sendSubscriptionToServer(subscription: PushSubscription) {
    fetch('http://127.0.0.1:4500/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        console.log('Suscripción enviada al servidor');
      } else {
        console.error('Error al enviar suscripción al servidor');
      }
    }).catch(error => {
      console.error('Error de red al enviar suscripción al servidor:', error);
    });
  }
}
