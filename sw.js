const VERSION="ravrent-v8-20261014";
const CORE=["/","/site.css?v=8","/site.js?v=8","/icon.svg","/manifest.webmanifest"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==VERSION).map(key=>caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
  if(request.mode==="navigate"){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok){const backup=response.clone();caches.open(VERSION).then(cache=>cache.put("/",backup))}
      return response;
    }).catch(()=>caches.match("/")));
    return;
  }
  event.respondWith(fetch(request).then(response=>{
    if(response.ok){const backup=response.clone();caches.open(VERSION).then(cache=>cache.put(request,backup))}
    return response;
  }).catch(()=>caches.match(request)));
});
