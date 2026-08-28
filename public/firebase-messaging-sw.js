// Firebase Web Push per iOS sovint falla perquè la seva llibreria compat (firebase-messaging-compat.js) 
// és molt pesada, triga a inicialitzar-se en segon pla, i entra en conflicte amb els estrictes requeriments d'Apple.
// Atès que les notificacions Push web són un estàndard, podem saltar-nos Firebase al Service Worker 
// i gestionar el missatge nosaltres mateixos de forma ultra ràpida i 100% compatible amb Safari.

self.addEventListener('install', (event) => {
    console.log('[Service Worker NET] Instal·lant la nova versió...');
    self.skipWaiting(); // Obliga al nou SW a expulsar el vell immediatament
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker NET] Nova versió activada!');
    event.waitUntil(clients.claim()); // Pren el control de totes les pestanyes obertes
});

self.addEventListener('push', (event) => {
    console.log('[Service Worker NET] Push event rebut!');
    
    let title = 'Apunts Pro2';
    let options = {
        body: 'Tens una nova notificació'
    };

    if (event.data) {
        try {
            const rawText = event.data.text();
            console.log('[Service Worker NET] Raw Payload:', rawText);
            
            const payload = JSON.parse(rawText);
            if (payload.notification) {
                title = payload.notification.title || title;
                options.body = payload.notification.body || options.body;
                options.data = payload.data;
            } else if (payload.data && payload.data.title) {
                title = payload.data.title;
                options.body = payload.data.body;
                options.data = payload.data;
            }
        } catch (err) {
            console.log("No s'ha pogut parsejar el JSON, utilitzant text base");
        }
    }

    const promise = self.registration.showNotification(title, options);
    event.waitUntil(promise);
});

self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker NET] Notificació clicada!');
    event.notification.close();
    
    const targetUrl = event.notification.data?.click_action || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
