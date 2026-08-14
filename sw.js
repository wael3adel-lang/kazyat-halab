const CACHE='halab-fuel-v4';
const ASSETS=['./','./index.html','./admin.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys(),Promise.resolve()]).then(([keys])=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));

self.addEventListener('fetch',e=>{
  if(e.request.mode==="navigate") return e.respondWith(fetch(e.request).then(r=>r||caches.match('/index.html')));
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
