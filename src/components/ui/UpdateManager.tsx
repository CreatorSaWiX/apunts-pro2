import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const UpdateManager = () => {
    // Inicialitzem el PWA de forma silenciosa.
    // Com que a vite.config.ts tenim 'autoUpdate', el Service Worker
    // s'actualitzarà en segon pla sense requerir acció de l'usuari.
    useRegisterSW();

    useEffect(() => {
        // En SPA amb 'autoUpdate', els "chunks" (trossos de codi lazy) vells
        // es poden esborrar del servidor/cache quan hi ha una nova versió.
        // Si l'usuari navega i el chunk no es troba, Vite dispara 'vite:preloadError'.
        // L'atrapar-ho i recarregar la pàgina ens permet aplicar la nova versió automàticament
        // i de forma transparent, sense trencar l'aplicació ni mostrar botons molests.
        const handlePreloadError = () => {
            console.log("S'ha detectat una nova versió (chunk missing). Recarregant...");
            window.location.reload();
        };

        window.addEventListener('vite:preloadError', handlePreloadError as EventListener);

        return () => {
            window.removeEventListener('vite:preloadError', handlePreloadError as EventListener);
        };
    }, []);

    // (Opcional) Mantenim el listener a Firebase per forçar la recàrrega de forma remota
    // si l'usuari està inactiu (permet forçar updates globals ràpids).
    useEffect(() => {
        const currentVersion = localStorage.getItem('app-version') || '1.0.0';
        const docRef = doc(db, 'app', 'metadata');
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.latestVersion && data.latestVersion !== currentVersion) {
                    localStorage.setItem('app-version', data.latestVersion);
                    // Si detectem un update crític via Firebase, recarreguem directament
                    // en lloc de demanar a l'usuari. Això es pot fer de nit o en segon pla.
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        }, (error) => {
            // Silently ignore permissions error when user is not logged in yet
        });

        return () => unsubscribe();
    }, []);

    // Aquest component és totalment "Headless" (sense interfície d'usuari).
    return null;
};
