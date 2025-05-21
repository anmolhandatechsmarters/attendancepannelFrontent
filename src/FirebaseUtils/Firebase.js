


  import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC2UJpqlbqp5hOGZwkkGfr4bLm-huKGLLQ",
  authDomain: "smartersattendancepannel.firebaseapp.com",
  projectId: "smartersattendancepannel",
  storageBucket: "smartersattendancepannel.appspot.com",
  messagingSenderId: "980305979652",
  appId: "1:980305979652:web:a375b82e70a833c0a74851",
  measurementId: "G-QTNGMSTMN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Corrected FCM Token Request Function
export const RequestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const fcmToken = await getToken(messaging, { vapidKey: "BKiS82LJ5o5FkY2Mo2K_vDIkGqhfyrKm_VONXVyxNap-JGHrtm_aJV6UCqKdVf-FHf7yaXdi6AmGXdxmnc3F1Qk" }); 
      // console.log("FCM Token:", fcmToken);
      return fcmToken;
    } else {
      throw new Error("Permission not granted for push notifications.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// ✅ Handle Incoming Messages (For Foreground Notifications)
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  alert(`New Notification: ${payload.notification?.title}`);
});


