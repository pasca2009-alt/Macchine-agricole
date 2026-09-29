// AgriDB – service worker per il funzionamento offline.
// Mettilo nella stessa cartella di index.html su GitHub Pages.
// Quando aggiorni i dati, cambia il numero di versione qui sotto.
const CACHE = "agridb-v2";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Prima prova la rete (così vedi sempre la versione aggiornata), se non c'è connessione usa la copia salvata.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./")))
  );
});
