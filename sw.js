
'use strict';

const dbVersion = 2;
const imgFilename = '/keesern.github.io/databasePic.jpg';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v4').then(function(cache) {
      return cache.addAll([
        '/keesern.github.io/',
        '/keesern.github.io/index.html',
        '/keesern.github.io/style.css',
        '/keesern.github.io/app.js',
        '/keesern.github.io/image-list.js',
        '/keesern.github.io/unstoppableLunch.jpg',
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
        
        caches.open('v5').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/keesern.github.io/gallery/snowTroopers.jpg');
      });
    }
  }));
  
});

  
/**
 * Convert a <code>Blob</code> to an <code>ArrayBuffer</code>.
 * @param {Blob} blob A <code>Blob</code>
 * @returns {Promise} Promise that resolves with the <code>ArrayBuffer</code>
 */
function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = event => {
      resolve(event.target.result || new ArrayBuffer(0));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
  
