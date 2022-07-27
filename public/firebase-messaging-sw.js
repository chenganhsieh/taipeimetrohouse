importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.6.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': "82444690925"
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload['Title'];
    const notificationOptions = {
        body: '1',
        icon: 'https://firebasestorage.googleapis.com/v0/b/housebeauty-6ab4a.appspot.com/o/icon%2Fhouse.png?alt=media&token=85ec2abc-0c29-4c33-9b74-cf741bfad588',
        click_action: 'https://housebeauty-6ab4a.firebaseapp.com/'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', function() {
    self.skipWaiting();
});

console.log("Loaded SW..");