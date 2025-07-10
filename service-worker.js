// Dies ist der Service Worker. Er wird verwendet, um Ressourcen zu cachen und die App offline-fähig zu machen.

const CACHE_NAME = 'parkautomat-cache-v1'; // Name des Caches
const urlsToCache = [
  '/',
  '/index.html',
  // Pfade zu Ihren gebündelten JavaScript- und CSS-Dateien nach dem Build-Prozess
  // Beispielpfade für create-react-app:
  '/static/js/main.js', // Oder bundle.js, je nach Build-Konfiguration
  '/static/css/main.css', // Oder ein anderer Pfad, falls CSS extrahiert wird
  '/android-chrome-192x192.png', // Ihre Icons
  '/android-chrome-512x512.png'
  // Fügen Sie hier alle weiteren statischen Assets hinzu, die gecacht werden sollen
];

// Event-Listener für die Installation des Service Workers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // Alle URLs zum Cache hinzufügen
      })
      .catch(error => {
        console.error('Fehler beim Cachen während der Installation:', error);
      })
  );
});

// Event-Listener für das Abfangen von Fetch-Anfragen
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) // Versuche, die Anfrage im Cache zu finden
      .then(response => {
        // Cache Hit - gib die gecachte Antwort zurück
        if (response) {
          return response;
        }
        // Cache Miss - Anfrage über das Netzwerk abrufen
        return fetch(event.request).catch(() => {
          // Optional: Eine Fallback-Seite für Offline-Fälle anzeigen
          // return caches.match('/offline.html');
        });
      })
  );
});

// Event-Listener für die Aktivierung des Service Workers (Bereinigung alter Caches)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Lösche alte Caches, die nicht in der Whitelist sind
            console.log('Alten Cache löschen:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

