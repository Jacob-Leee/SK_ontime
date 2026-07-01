// firebase-messaging-sw.js
// Place this file at the ROOT of your web directory (same level as mobile.html)
// iOS 16.4+ required for PWA push notifications

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBRzLQXpX_tWdJCpxKT7DI5m402KiaiCUA",
  authDomain: "homes-nsw.firebaseapp.com",
  projectId: "homes-nsw",
  storageBucket: "homes-nsw.firebasestorage.app",
  messagingSenderId: "1064085096701",
  appId: "1:1064085096701:web:9463a7ccba801d9a9b5694",
  databaseURL: "https://homes-nsw-default-rtdb.firebaseio.com"
});

const messaging = firebase.messaging();

// Handle background push messages (phone locked / app closed)
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Order';
  const notificationOptions = {
    body: payload.notification?.body || 'A new work order has been assigned.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: payload.data?.orderId || 'new-order',
    data: payload.data || {},
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open/focus the mobile app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let client of clientList) {
        if (client.url.includes('/SK_ontime/mobile.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/SK_ontime/mobile.html');
      }
    })
  );
});
