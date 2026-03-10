importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyAhefwgwnF2hoipXjEc_rjOW4sSaR1bQCY',
  authDomain:        'qantara-app-cb1c4.firebaseapp.com',
  projectId:         'qantara-app-cb1c4',
  storageBucket:     'qantara-app-cb1c4.firebasestorage.app',
  messagingSenderId: '402727898752',
  appId:             '1:402727898752:web:e7be8a336d344ad9566065'
});

const messaging = firebase.messaging();

/* استقبال الإشعارات عندما التطبيق مغلق أو في الخلفية */
messaging.onBackgroundMessage(payload => {
  console.log('[FCM SW] background message:', payload);
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

/* عند الضغط على الإشعار يفتح التطبيق */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://elbadecostore.github.io/Qantara/';
  e.waitUntil(clients.openWindow(url));
});
