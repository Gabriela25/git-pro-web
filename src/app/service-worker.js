self.addEventListener('push', function(event) {
  console.log('esperando la notificación');
  
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: 'assets/logo.png',
    data: { url: data.url } 
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        console.log('URL del cliente:', client.url);
        console.log('URL a abrir:', urlToOpen);
        
        
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
}); 