const BASE_PATH = self.location.pathname.includes("/Testerer/") 
  ? "/testerer-deploy.github.io/Testerer" 
  : "";

const CACHE_NAME = "game-cache-v1";
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  "https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css",
  `${BASE_PATH}/js/main.js`,
  `${BASE_PATH}/js/app.js`,   // ✅ Добавляем сам App
  `${BASE_PATH}/js/cameraManager.js`, // ✅ Добавляем модули
  `${BASE_PATH}/js/eventManager.js`,
  `${BASE_PATH}/js/profileManager.js`,
  `${BASE_PATH}/js/databaseManager.js`,
  `${BASE_PATH}/js/languageManager.js`,
  `${BASE_PATH}/locales/locales.json`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// Установка Service Worker и кеширование файлов
self.addEventListener("install", (event) => {
  console.log("🛠 Установка Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error("❌ Ошибка кэширования:", err))
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener("activate", (event) => {
  console.log("✅ Активация Service Worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑 Удаление старого кеша: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработчик запросов: сначала ищем в кэше, потом обновляем
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone()); // Обновляем кэш
          return networkResponse;
        });
      });
    }).catch(() => caches.match(`${BASE_PATH}/index.html`)) // Фоллбэк на index.html
  );
});