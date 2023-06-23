importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCC3H9MGpEduGKlQAuJHPy0RekBitOvb4M",
  authDomain: "apna-mandir-test.firebaseapp.com",
  projectId: "apna-mandir-test",
  storageBucket: "apna-mandir-test.appspot.com",
  messagingSenderId: "821319961998",
  appId: "1:821319961998:web:e36ee74b6adf5a7e9868df",
  measurementId: "G-DF58EDVN2W"
};  

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();



messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body,
  };

  self?.registration?.showNotification(notificationTitle,
    notificationOptions);
});