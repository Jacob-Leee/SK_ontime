// firebase-messaging-sw.js
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

// Force new SW to activate immediately — prevents old SW handling push with FCM defaults
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));

// Data-only push — browser won't auto-show; we control display here.
// onBackgroundMessage fires when app is CLOSED or BACKGROUND.
// When app is FOREGROUND, onMessage in the page fires instead (no duplicate).
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  // Read from data field (no notification field in payload)
  const title = payload.data?.title || 'New Order';
  const body  = payload.data?.body  || 'A new work order has been assigned.';

  return self.registration.showNotification(title, {
    body,
    icon:               '/SK_ontime/icon-192.png',
    badge:              '/SK_ontime/icon-192.png',
    tag:                'sk-new-order',   // replaces any previous notification
    data:               payload.data || {},
    requireInteraction: false,
    vibrate:            [200, 100, 200]
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let client of clientList) {
        if (client.url.includes('/SK_ontime/mobile.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/SK_ontime/mobile.html');
    })
  );
});
