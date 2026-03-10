importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyCxVDBRV20xCo8sYmlnKt67ggh8HY3KxF8',
  authDomain:        'qantara-live.firebaseapp.com',
  projectId:         'qantara-live',
  storageBucket:     'qantara-live.firebasestorage.app',
  messagingSenderId: '219692468615',
  appId:             '1:219692468615:web:4598dd00cb99afa38a6b22'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'Qantara · قنطرة';
  const body  = payload.notification?.body  || 'تحديث جديد على المعبر';
  self.registration.showNotification(title, {
    body,
    icon:  '/Qantara/icon-192.png',
    badge: '/Qantara/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'qantara-notif',
    renotify: true,
    data: { url: 'https://elbadecostore.github.io/Qantara/' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://elbadecostore.github.io/Qantara/';
  e.waitUntil(clients.openWindow(url));
});
