self.addEventListener('push', function(event) {
  console.log('esperando la notificación');
  
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: data.image || 'assets/logo.png',
    data: { url: data.url }, 
    image: data.image
  };
   console.log(options)
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener("notificationclick", (event) => {
console.log('en el método de click')
event.waitUntil(
  clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || "/";
    console.log('urlToOpen',urlToOpen)
    const existingClient = clientList.find(client => client.url.includes('/leads/detail/') || client.url.includes('/pro/order/detail/'));

    if (existingClient) {
      // Si la pestaña ya está abierta, enviar un mensaje a Angular para actualizar la ruta
      existingClient.postMessage({ action: 'update-url', url: urlToOpen });
      return existingClient.focus();
    } else {
      // Si no hay una pestaña abierta, abrir una nueva
      return clients.openWindow(urlToOpen);
    }
  })
);
})
