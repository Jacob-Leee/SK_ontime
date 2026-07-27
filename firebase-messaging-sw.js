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

// Everything is resolved relative to where this SW is served from, so the same
// file works at /SK_ontime/ and at a domain root without editing paths.
// self.registration.scope always ends in '/'.
const SCOPE = self.registration.scope;

// Force new SW to activate immediately — prevents an old SW handling push with
// FCM defaults after a deploy.
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));

// Data-only push — the browser will not auto-show it; display is controlled here.
// onBackgroundMessage fires when the app is CLOSED or BACKGROUNDED.
// When the app is in the FOREGROUND, onMessage in the page fires instead, so
// there is exactly one notification either way.
messaging.onBackgroundMessage(function (payload) {
  console.log('[SW] Background message:', payload);
  const d = payload.data || {};
  const title = d.title || 'New Order';
  const body  = d.body  || 'A new work order has been assigned.';

  // Tag identifies an ASSIGNMENT, not an order. Tagging by order number alone
  // meant a re-assignment of the same order silently replaced the earlier
  // notification instead of arriving as a new one.
  const tag = 'sk-order-' + (d.orderNumber || 'x') + '-' + (d.subbiesAt || Date.now());

  return self.registration.showNotification(title, {
    body,
    icon:  SCOPE + 'icon-192.png',
    badge: SCOPE + 'icon-192.png',
    tag,
    data: d,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    actions: [{ action: 'open', title: '오더 열기' }]
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const data = event.notification.data || {};

  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    // Prefer a window that already belongs to this app — whichever page the user
    // actually has open. Hardcoding mobile.html used to yank desktop admins into
    // the phone UI, and opened a second tab when index.html was already running.
    const mine = all.filter(c => c.url.startsWith(SCOPE));
    if (mine.length) {
      const target = mine.find(c => c.focused) || mine[0];
      await target.focus();
      // Tell the page which order was tapped so it can jump straight to the row.
      try { target.postMessage({ type: 'SK_OPEN_ORDER', orderNumber: data.orderNumber || '' }); } catch (e) {}
      return;
    }

    // Nothing open — pick the UI that suits the device.
    const isMobile = /Android|iPhone|iPad|iPod/i.test(self.navigator.userAgent || '');
    const url = SCOPE + (isMobile ? 'mobile.html' : 'index.html');
    if (clients.openWindow) await clients.openWindow(url);
  })());
});
