const cacheName = "ListenRandomness";
const staticAssets = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/app2.js",
  "./manifest.webmanifest"
];
self.addEventListener("install", async e =>{
  const cache = await caches.open(cacheName);
  await cache.aaddAll(staticAssets);
  return self.skipWaiting();

});