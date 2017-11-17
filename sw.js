
'use strict';

const dbVersion = 2;
const imgFilename = '/keesern.github.io/databasePic.jpg';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v6').then(function(cache) {
      return cache.addAll([
        '/keesern.github.io/',
        '/keesern.github.io/index.html',
        '/keesern.github.io/style.css',
        '/keesern.github.io/app.js',
        '/keesern.github.io/image-list.js',
        '/keesern.github.io/unstoppableLunch2.jpg',
        '/keesern.github.io/gallery/lunchBox.jpg',
        '/keesern.github.io/gallery/jasonDeli.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('activating service worker');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v6').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
