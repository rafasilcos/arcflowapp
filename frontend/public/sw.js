// Service Worker para ArcFlow - Otimizado para 150k usuários
const CACHE_NAME = 'arcflow-v1.0.0';
const STATIC_CACHE = 'arcflow-static-v1.0.0';
const DYNAMIC_CACHE = 'arcflow-dynamic-v1.0.0';

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/dashboard-v2',
  '/briefing',
  '/projetos',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Estratégias de cache por tipo de recurso
const CACHE_STRATEGIES = {
  // Cache first para recursos estáticos
  static: ['js', 'css', 'woff', 'woff2', 'ttf', 'ico'],
  
  // Network first para dados dinâmicos
  dynamic: ['api', 'json'],
  
  // Stale while revalidate para imagens
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
};

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('ArcFlow Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('ArcFlow Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('ArcFlow Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('ArcFlow Service Worker: Installation failed', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('ArcFlow Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Deletar caches antigos
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('ArcFlow Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('ArcFlow Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-HTTP
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://')) {
    return;
  }

  // Determinar estratégia de cache
  const fileExtension = url.pathname.split('.').pop()?.toLowerCase();
  const isAPI = url.pathname.startsWith('/api/');
  const isStatic = CACHE_STRATEGIES.static.includes(fileExtension || '');
  const isImage = CACHE_STRATEGIES.images.includes(fileExtension || '');

  if (isAPI) {
    // Network first para APIs
    event.respondWith(networkFirstStrategy(request));
  } else if (isStatic) {
    // Cache first para recursos estáticos
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImage) {
    // Stale while revalidate para imagens
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    // Network first como padrão
    event.respondWith(networkFirstStrategy(request));
  }
});

// Estratégia Cache First
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First Strategy failed:', error);
    
    // Fallback para página offline se disponível
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Estratégia Network First
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      
      // Cachear apenas responses de sucesso
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Para navegação, retornar página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Buscar nova versão em background
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.log('Network failed for stale-while-revalidate:', error);
    });
  
  // Retornar versão em cache imediatamente se disponível
  return cachedResponse || networkResponsePromise;
}

// Limpar cache quando necessário
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName === DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync para requisições offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Processar requisições que falharam offline
      processOfflineRequests()
    );
  }
});

async function processOfflineRequests() {
  // Implementar lógica de sincronização offline
  console.log('Processing offline requests...');
  
  // Aqui você pode implementar a lógica para:
  // 1. Recuperar dados salvos no IndexedDB
  // 2. Enviar para servidor quando online
  // 3. Atualizar UI com status de sincronização
}

// Notificações push (se necessário)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Abrir ArcFlow',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Clique em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard-v2')
    );
  }
}); 