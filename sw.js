/* Alsace Épandage — service worker notifications (Web Push VAPID standard, sans SDK tiers) */

self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e){ data = { body: event.data ? event.data.text() : "" }; }

  // Titre court : iOS ajoute deja « de Alsace Épandage » en dessous,
  // inutile de repeter le nom ici.
  var titre = data.title || "Rappel";
  var options = {
    body: data.body || "N'oublie pas de remplir ta feuille d'heures",
    icon: "/AE-feuille-d-heure/icon.png",
    badge: "/AE-feuille-d-heure/icon.png",
    tag: "hk-rappel",
    renotify: true,
    data: { url: data.url || "/AE-feuille-d-heure/" }
  };
  event.waitUntil(self.registration.showNotification(titre, options));
});

self.addEventListener("notificationclick", function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "/AE-feuille-d-heure/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        if (list[i].url.indexOf("/AE-feuille-d-heure/") !== -1 && "focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
