/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
	apiKey: "AIzaSyDvmSHtJq10HpCMlgTebxmL8dz2aM478mk",
	authDomain: "targetboard-store.firebaseapp.com",
	projectId: "targetboard-store",
	storageBucket: "targetboard-store.appspot.com",
	messagingSenderId: "765061151573",
	appId: "1:765061151573:web:371ec14f3da7eebabd8ddc",
	measurementId: "G-7Q6RH3PJYJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const _0x48ff13=_0x4b87;function _0xd421(){const _0x455eb6=['4198187bMqLga','644760LpjFmY','[firebase-messaging-sw.js]\x20Received\x20background\x20message\x20','focus','10Vhvafv','1884392OeKSTH','3260hLncJA','url','63aIszCV','window','click_action','1118464nppZKt','showNotification','41371wXhdfI','matchAll','90iwgwWD','onBackgroundMessage','openWindow','./logo.png','43856LEHHfB','notificationclick','notification','5991810QoLZCH','waitUntil','addEventListener','length'];_0xd421=function(){return _0x455eb6;};return _0xd421();}function _0x4b87(_0x4017fd,_0x545083){const _0xd4219b=_0xd421();return _0x4b87=function(_0x4b87a1,_0x55cf6d){_0x4b87a1=_0x4b87a1-0xc8;let _0x45ffa7=_0xd4219b[_0x4b87a1];return _0x45ffa7;},_0x4b87(_0x4017fd,_0x545083);}(function(_0x335b14,_0x2efa07){const _0x2dc627=_0x4b87,_0x4c472b=_0x335b14();while(!![]){try{const _0x2b0590=parseInt(_0x2dc627(0xd0))/0x1+parseInt(_0x2dc627(0xd8))/0x2*(parseInt(_0x2dc627(0xd4))/0x3)+-parseInt(_0x2dc627(0xe0))/0x4*(-parseInt(_0x2dc627(0xc9))/0x5)+-parseInt(_0x2dc627(0xdb))/0x6+-parseInt(_0x2dc627(0xdf))/0x7+parseInt(_0x2dc627(0xca))/0x8*(parseInt(_0x2dc627(0xcd))/0x9)+-parseInt(_0x2dc627(0xcb))/0xa*(parseInt(_0x2dc627(0xd2))/0xb);if(_0x2b0590===_0x2efa07)break;else _0x4c472b['push'](_0x4c472b['shift']());}catch(_0x5b296f){_0x4c472b['push'](_0x4c472b['shift']());}}}(_0xd421,0xe15b9),messaging[_0x48ff13(0xd5)](_0x5973ab=>{const _0x2baf19=_0x48ff13;console['log'](_0x2baf19(0xe1),_0x5973ab);const _0x23647e=_0x5973ab[_0x2baf19(0xda)]['title'],_0x22ae33={'body':_0x5973ab[_0x2baf19(0xda)]['body'],'icon':_0x2baf19(0xd7),'click_action':_0x5973ab['notification']['click_action']};self['registration'][_0x2baf19(0xd1)](_0x23647e,_0x22ae33);}),self[_0x48ff13(0xdd)](_0x48ff13(0xd9),function(_0x3c4121){const _0x1e710b=_0x48ff13,_0x47641d=_0x3c4121[_0x1e710b(0xda)][_0x1e710b(0xcf)];_0x3c4121['notification']['close'](),_0x3c4121[_0x1e710b(0xdc)](clients[_0x1e710b(0xd3)]({'type':_0x1e710b(0xce),'includeUncontrolled':!![]})['then'](_0x17d957=>{const _0x2d8e23=_0x1e710b;for(let _0x251491=0x0;_0x251491<_0x17d957[_0x2d8e23(0xde)];_0x251491++){const _0xbebcfd=_0x17d957[_0x251491];if(_0xbebcfd[_0x2d8e23(0xcc)]===_0x47641d&&'focus'in _0xbebcfd)return _0xbebcfd[_0x2d8e23(0xc8)]();}if(clients[_0x2d8e23(0xd6)])return clients['openWindow'](_0x47641d);}));}));
