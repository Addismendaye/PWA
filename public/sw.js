import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import {offlineFallback} from 'workbox-recipes';
import {setDefaultHandler} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
  console.log("working");
}
setDefaultHandler(new NetworkOnly());

offlineFallback();


self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
//  self.skipWaiting()
clientsClaim();

onNeedRefersh();
onOfflineReady();
let coreAssets = ["./main.js"];
console.log(coreAssets);

// On install, cache core assets
self.addEventListener("install", function (event) {
  // Cache core assets
  event.waitUntil(
    caches.open("app").then(function (cache) {
      for (let asset of coreAssets) {
        cache.add(new Request(asset));
      }
      return cache;
    })
  );
});

self.addEventListener("fetch", function (event) {
  let request = event.request;

  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  )
    return;

  if (request.headers.get("Accept").includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          let copy = response.clone();
          event.waitUntil(
            caches.open("app").then(function (cache) {
              console.log(app);
              return cache.put(request, copy);
            })
          );

          return response;
        })
        .catch(function (error) {
          return caches.match(request).then(function (response) {
            return response || caches.match("/offline.html");
          });
        })
    );
  }

  // CSS & JavaScript
  // Offline-first
  if (
    request.headers.get("Accept").includes("text/css") ||
    request.headers.get("Accept").includes("text/javascript")
  ) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return (
          response ||
          fetch(request).then(function (response) {
            // Return the response
            return response;
          })
        );
      })
    );
    return;
  }

  if (request.headers.get("Accept").includes("image")) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return (
          response ||
          fetch(request).then(function (response) {
            let copy = response.clone();
            event.waitUntil(
              caches.open("app").then(function (cache) {
                return cache.put(request, copy);
              })
            );

            return response;
          })
        );
      })
    );
  }
});
