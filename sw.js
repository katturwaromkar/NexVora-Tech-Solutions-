// Yugvex Tech Solutions - Service Worker & Offline Performance Cache
const CACHE_NAME = 'yugvex-cache-v2.5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/products.html',
  '/ai-products.html',
  '/industries.html',
  '/templates.html',
  '/portfolio.html',
  '/clients.html',
  '/brochures.html',
  '/team.html',
  '/careers.html',
  '/blog.html',
  '/contact.html',
  '/css/style.css',
  '/css/responsive.css',
  '/css/animations.css',
  '/css/chatbot.css',
  '/css/security.css',
  '/js/main.js',
  '/js/security.js',
  '/js/chatbot.js',
  '/assets/images/logo.png',
  '/assets/images/logo-icon.svg',
  '/assets/images/favicon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
