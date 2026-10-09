// Atomep Enteam Offline Service Worker (Cache-First)
const CACHE_NAME = 'aepl-phe-v2.2';
const OFFLINE_URLS = [
  "./",
  "./AI_DM_Plant_Platform.html",
  "./NBC2026_Water_Demand_Calculator_v2.html",
  "./NBCS_2026_Drainage_Calculator.html",
  "./NBCS_2026_Pipe_Size_Calculator.html",
  "./RO_Plant_Sizing_Calculator.html",
  "./STP_Design_Calculator.html",
  "./Storm_Sump_Design_Tool.html",
  "./Water_Softener_Plant_Designer.html",
  "./Water_Treatment_Plant_Designer.html",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/vendor/FileSaver.min.js",
  "./assets/vendor/chart.umd.min.js",
  "./assets/vendor/html-docx.js",
  "./assets/vendor/html2canvas.min.js",
  "./assets/vendor/jspdf.plugin.autotable.min.js",
  "./assets/vendor/jspdf.umd.min.js",
  "./assets/vendor/three.min.js",
  "./assets/vendor/xlsx.full.min.js",
  "./atomep_enteam_logo.png",
  "./css/tokens.css",
  "./css/base.css",
  "./css/app.css",
  "./css/components.css",
  "./css/utilities.css",
  "./css/pages/AI_DM_Plant_Platform.css",
  "./css/pages/NBC2026_Water_Demand_Calculator_v2.css",
  "./css/pages/NBCS_2026_Drainage_Calculator.css",
  "./css/pages/NBCS_2026_Pipe_Size_Calculator.css",
  "./css/pages/RO_Plant_Sizing_Calculator.css",
  "./css/pages/STP_Design_Calculator.css",
  "./css/pages/Storm_Sump_Design_Tool.css",
  "./css/pages/Water_Softener_Plant_Designer.css",
  "./css/pages/Water_Treatment_Plant_Designer.css",
  "./css/pages/firefighting_calculator.css",
  "./css/pages/heat_pump_sizing_tool.css",
  "./css/pages/index.css",
  "./css/pages/pump-head-calculator.css",
  "./firefighting_calculator.html",
  "./heat_pump_sizing_tool.html",
  "./index.html",
  "./manifest.webmanifest",
  "./pump-head-calculator.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline suite...');
      return cache.addAll(OFFLINE_URLS).catch(err => {
        console.warn('[SW] Cache pre-fetch partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
