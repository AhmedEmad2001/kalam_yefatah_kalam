const CACHE='kalam-yefatah-kalam-v2';
const ASSETS=['./','./index.html','./app.js','./config.js','./manifest.json','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('kalam-yefatah-kalam-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin) return;
 if(e.request.mode==='navigate' || /\/(app|config)\.js$/.test(u.pathname)) {
   e.respondWith(fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html'))));
   return;
 }
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(cache=>cache.put(e.request,r.clone()));return r})));
});
