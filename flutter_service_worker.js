'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/asset/bob.png": "6d428ce31667c0c5f675f22f3e044b45",
"assets/asset/humantiz.png": "f23191748381cd3af420143fc7e9b0f6",
"assets/asset/icon.jpg": "02b5de2093884d65f275687b20f2e366",
"assets/asset/jobqo.png": "af87fdc00d38da5cbbc12b7bc1cedee7",
"assets/asset/kpcc.jpg": "8db714d1b688b3ae0751b80dd3a022c1",
"assets/asset/petlo.png": "5873b87b37611f8ed55160a0dc7dae3a",
"assets/asset/pic.jpg": "44f9fbc211e1801a5134fbbcbadaae62",
"assets/asset/screenshots/covid1.jpg": "eb91c4c03c923be2fbcb6f4823db1392",
"assets/asset/screenshots/covid2.jpg": "272980cb9f78ac64d8fec7e20348efcd",
"assets/asset/screenshots/covid3.jpg": "e7f67998a127ca14bf7d24b9d5c763f3",
"assets/asset/screenshots/covid4.jpg": "55bae1834b5c962a9dacb939cfdbcdab",
"assets/asset/screenshots/humantiz1.jpg": "c6ba5335fe1503fd3d91bda54dbc4aee",
"assets/asset/screenshots/humantiz2.jpg": "2a24203f22f4aea4144a69c54e212242",
"assets/asset/screenshots/humantiz3.jpg": "161c91972a3289e7ab83b5d42248ffb9",
"assets/asset/screenshots/humantiz4.jpg": "6f204efa1aea3878e6fd498e38402214",
"assets/asset/screenshots/jobqo1.jpg": "2a4fb8e13e63a83360e7aab027597c29",
"assets/asset/screenshots/jobqo2.jpg": "6c5ba15fa2d9de85299f247a9edc931a",
"assets/asset/screenshots/jobqo3.jpg": "089d8a678006d70394b27e5e2535f91c",
"assets/asset/screenshots/jobqo4.jpg": "3d52687fa0b35ec831324b9f08327581",
"assets/asset/screenshots/petlo1.jpg": "8878058043d8674b07af50c9d05f29da",
"assets/asset/screenshots/petlo2.jpg": "9da70e648a5ebd079390543fd3428782",
"assets/asset/screenshots/petlo3.jpg": "ce442b99fb3cb71cb1440f93cc7a2cb2",
"assets/asset/screenshots/petlo4.jpg": "47d76528f2dccc2ddcef403b5d099570",
"assets/asset/screenshots/turfbooking1.jpg": "e4b82ffa20d539244526121fc0d95995",
"assets/asset/screenshots/turfbooking2.jpg": "c9d1e229c71cd8a83f3d4ab34ac5450c",
"assets/asset/screenshots/turfbooking3.jpg": "c7358dbc800dc165f51a27727750f7d5",
"assets/asset/turfbooking.png": "3bcf4bc269fca0f0729c684fd78e3a78",
"assets/asset/user.png": "7610e3d5d4a1cd5b280a8c1c79b0da48",
"assets/AssetManifest.json": "f4a8768acf77b5911446ae343141d765",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "29cf5f9512007d3853a98157eb6937a2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "831eb40a2d76095849ba4aecd4340f19",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "a126c025bab9a1b4d8ac5534af76a208",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "d80ca32233940ebadc5ae5372ccd67f9",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "db44042d79986499b452cac836b04b4d",
"/": "db44042d79986499b452cac836b04b4d",
"main.dart.js": "61791254e8cda7fcc8c86b16205f8daf",
"manifest.json": "5a2c0526f1fe73e6f211bc7a9d15c210",
"version.json": "426313f2f3133c2f20415344c4a22df3"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
