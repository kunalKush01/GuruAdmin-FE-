// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useDispatch } from "react-redux";
const firebaseConfig = {
  apiKey: "AIzaSyCC3H9MGpEduGKlQAuJHPy0RekBitOvb4M",
  authDomain: "apna-mandir-test.firebaseapp.com",
  projectId: "apna-mandir-test",
  storageBucket: "apna-mandir-test.appspot.com",
  messagingSenderId: "821319961998",
  appId: "1:821319961998:web:e36ee74b6adf5a7e9868df",
  measurementId: "G-DF58EDVN2W",
};
initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey: `BC53FJ748DQoZ27hJEi7QGbQjZNtLClRf1IlS0g_a2LivHWRdMy6z_kZ63QmjUACpQJV2y5CeSoq85A7m98GSdM`,
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("currentToken", currentToken);
        localStorage.setItem("fcm_token", currentToken);
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token.", err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
