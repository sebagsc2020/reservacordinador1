// ==================================================
// SERVICE WORKER PARA PWA - AVENTURA TOTAL CRM
// ==================================================

const CACHE_NAME = 'aventura-crm-v1.0';
const urlsToCache = [
    '/',
    '/dashboard.html',
    '/clientes.html',
    '/reservas.html',
    '/seguimiento.html',
    '/calendario.html',
    '/clima.html',
    '/index.html',
    '/login.html'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Error al cachear:', err))
    );
    self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar peticiones y servir desde cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en cache, devolver cache
                if (response) {
                    return response;
                }
                // Si no, ir a la red
                return fetch(event.request).then(response => {
                    // Guardar en cache para próxima vez
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});

// Sincronización en segundo plano (para reservas offline)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-reservas') {
        event.waitUntil(sincronizarReservasPendientes());
    }
});

async function sincronizarReservasPendientes() {
    // Aquí iría la lógica para sincronizar reservas pendientes
    console.log('🔄 Sincronizando reservas pendientes...');
}