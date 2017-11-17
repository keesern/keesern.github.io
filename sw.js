
'use strict';

const dbVersion = 1;
const imgFilename = '/keesern.github.io/gallery/lunchBox.jpg';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v4').then(function(cache) {
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
  
  console.log('installing service worker');

  event.waitUntil(
    new Promise((resolve, reject) => {
      const request = self.indexedDB.open('images', dbVersion);

      request.onerror = event => {
        console.log('error opening IndexedDB');
        reject();
      };

      request.onsuccess = event => {
        const db = event.target.result;

        db.onerror = event => {
          console.log('error opening IndexedDB');
        };

        resolve(db);
      };

      request.onupgradeneeded = event => {
        event.target.result.createObjectStore('images');
      };
    }).then(db => {
      return fetch(imgFilename).then(response => {
        return response.blob();
      }).then(blob => {
        const transaction = db.transaction(['images'], 'readwrite');

        console.log('storing image blob:', blob);
        transaction.objectStore('images').put(blob, imgFilename);
        db.close();

        return self.skipWaiting();
      });
    })
  )
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
        
        caches.open('v4').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/keesern.github.io/gallery/snowTroopers.jpg');
      });
    }
  }));
  
  
    if (!event.request.url.endsWith(imgFilename)) {
    return;
  }

  event.respondWith(new Promise((resolve, reject) => {
    const request = self.indexedDB.open('images', dbVersion);

    request.onerror = event => {
      console.log('error opening IndexedDB');
      reject();
    };

    request.onsuccess = event => {
      const db = request.result;

      db.onerror = event => {
        console.log('error opening IndexedDB');
      };

      const transaction = db.transaction(['images'], 'readonly');

      transaction.objectStore('images').get(imgFilename).onsuccess = event => {
        const blob = event.target.result;

        // This doesn't work with Firefox
        // (tested with version 44.0.2 and 46.0a2)
        resolve(
          new Response(
            blob,
            {
              headers: {
                'Content-Type': blob.type,
                'Content-Length': blob.size
              }
            }
          )
        );

  
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
  
  
  
});
