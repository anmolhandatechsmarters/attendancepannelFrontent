export default function registerServiceWorker() {
  console.log("🔹 Registering Service Worker...");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js") // Use a single service worker
      .then((registration) => {
        console.log("✅ Service Worker Registered:", registration);
      })
      .catch((error) => {
        console.error("❌ Service Worker Registration Failed:", error);
      });
  } else {
    console.warn("🚨 Service Workers are not supported in this browser.");
  }
}
