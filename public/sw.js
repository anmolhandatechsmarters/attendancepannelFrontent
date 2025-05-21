importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-messaging.js');
firebase.initializeApp({
    messagingSenderId: "My-Sender-Id"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
self.addEventListener('push', function(e) {
    var data;
    if (e.data) {
        data = JSON.parse(e.data.text()).data;
    } else {
        data = {};
    }
    var title = data.title;
    var options = {
        body: data.body,
        icon: 'assets/custom/img/logo.png',
        vibrate: [100, 50, 100],
        requireInteraction: true,
        data: data.data ? data.data : null,
        dir: "rtl",
        actions: [{
                action: data.action,
                title: 'open',
                icon: 'images/checkmark.png'
            },
            {
                action: 'close',
                title: 'close',
                icon: 'images/xmark.png'
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification(title, options)
    );
});
self.addEventListener('notificationclick', function(event) {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();
    if (event.action != "" && event.action != "close") {
        return clients.openWindow(event.action);
    }
});