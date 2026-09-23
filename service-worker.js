const CACHE_NAME = "courses-v3.0.0";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./catalogue.txt",
  "./menu.txt",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

});

self.addEventListener("activate", event => {

  event.waitUntil(

    Promise.all([

      caches.keys().then(keys => {

        return Promise.all(

          keys.map(key => {

            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }

          })

        );

      }),

      self.clients.claim()

    ])

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

   fetch(event.request)
  .then(response => {

    if(
      event.request.method === 'GET' &&
      response.status === 200
    ){

      const responseClone =
        response.clone();

      caches.open(CACHE_NAME)
        .then(cache => {

          cache.put(
            event.request,
            responseClone
          );

        });

    }

    return response;

  })

      .catch(() => {

        return caches.match(
          event.request
        );

      })

  );

});
