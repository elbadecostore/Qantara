importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCxVDBRV20xCo8sYmlnKt67ggh8HY3KxF8',
  authDomain: 'qantara-live.firebaseapp.com',
  projectId: 'qantara-live',
  storageBucket: 'qantara-live.firebasestorage.app',
  messagingSenderId: '219692468615',
  appId: '1:219692468615:web:4598dd00cb99afa38a6b22'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Qantara', {
    body: body || '',
    icon: '/Qantara/icon-192.png',
    badge: '/Qantara/icon-192.png'
  });
});
