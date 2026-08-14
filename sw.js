const CACHE = 'halab-fuel-v5';

const ASSETS = [
  './',
  './index.html',
  './admin.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );

  self.skipWaiting();
});


self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),

      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
    ])
  );
});


self.addEventListener('fetch', event => {

  if (event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put('./index.html', copy);
          });

          return response;

        })
        .catch(() =>
          caches.match('./index.html')
        )
    );

    return;
  }


  event.respondWith(
    fetch(event.request)
      .catch(() =>
        caches.match(event.request)
      )
  );

});
