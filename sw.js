const CACHE_NAME = 'street-review-shell-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'assets/logo.jpg'
];

// Installa e memorizza nella cache la shell iniziale dell'applicazione
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching shell dell\'app...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Attivazione: rimozione delle vecchie versioni della cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Rimozione vecchia cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Rilevamento delle chiamate API esterne da escludere rigorosamente dal caching
function isExcludedApi(url) {
  try {
    const urlObj = new URL(url);
    const host = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // Firebase (Firestore, Auth, Storage, Realtime Database)
    if (
      host.includes('firestore.googleapis.com') ||
      host.includes('identitytoolkit.googleapis.com') ||
      host.includes('securetoken.googleapis.com') ||
      host.includes('firebasestorage.googleapis.com') ||
      host.includes('firebaseio.com') ||
      host.includes('firebaseapp.com')
    ) {
      return true;
    }

    // Google Maps Platform & Places API
    if (
      host.includes('maps.googleapis.com') ||
      host.includes('maps.gstatic.com') ||
      host.includes('places.googleapis.com')
    ) {
      return true;
    }

    // Gemini AI / Google Generative AI
    if (
      host.includes('generativelanguage.googleapis.com') ||
      pathname.includes('/v1beta/models')
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

// Strategia Network-First con fallback su Cache per le risorse locali dell'app
self.addEventListener('fetch', (event) => {
  // Ignora le richieste non GET (es. salvataggi Firestore o chiamate POST)
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = event.request.url;

  // Esclusione rigorosa di API esterne in tempo reale
  if (isExcludedApi(requestUrl)) {
    return;
  }

  // Ignora schemi non supportati da Cache API (es. chrome-extension://)
  if (!requestUrl.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la risposta è valida (200), aggiorna la cache in background
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback su cache in caso di assenza di rete
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se la richiesta è di navigazione HTML, restituisci index.html precacheato
        if (event.request.mode === 'navigate') {
          const fallbackShell = await caches.match('./index.html');
          if (fallbackShell) {
            return fallbackShell;
          }
        }

        return Promise.reject(new Error('[SW] Risorsa offline non disponibile'));
      })
  );
});
