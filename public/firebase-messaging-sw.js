importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


const firebaseConfig = {
    apiKey: "AIzaSyC2UJpqlbqp5hOGZwkkGfr4bLm-huKGLLQ",
    authDomain: "smartersattendancepannel.firebaseapp.com",
    projectId: "smartersattendancepannel",
    storageBucket: "smartersattendancepannel.firebasestorage.app",
    messagingSenderId: "980305979652",
    appId: "1:980305979652:web:a375b82e70a833c0a74851",
    measurementId: "G-QTNGMSTMN8"
  };

  firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onMessage((payload)=>{
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
})



messaging.onBackgroundMessage((payload)=>{
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
})

// messaging.setBackgroundMessageHandler((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
