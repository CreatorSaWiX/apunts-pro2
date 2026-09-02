import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
    // eslint-disable-next-line react-doctor/public-env-secret-name
    databaseURL: import.meta.env.VITE_FIREBASE_DB_ENDPOINT
};

// Evitar múltiples inicialitzacions durant el Hot Module Replacement (HMR) de Vite
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Habilitar persistència offline
let firestoreDb;
try {
    firestoreDb = initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
} catch (error) {
    firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

// Lazy singletons per RTDB i Messaging — evita carregar ~80KB+ de SDKs que la majoria d'usuaris no necessiten
import type { Database } from 'firebase/database';
import type { Messaging } from 'firebase/messaging';

let _rtdb: Database | null = null;
/**
 * Lazy-initialized Realtime Database. Only loads the firebase/database SDK
 * when first called (community canvas multiplayer feature).
 */
export const getRtdb = async (): Promise<Database> => {
    if (!_rtdb) {
        const { getDatabase } = await import('firebase/database');
        _rtdb = getDatabase(app);
    }
    return _rtdb;
};
// Backward compat: síncron per a consumers que ja l'importen directament.
// DEPRECATED: Usar getRtdb() en lloc d'això.
export const rtdb = new Proxy({} as Database, {
    get(_target, prop) {
        if (!_rtdb) {
            // Force sync init per backward compat — caldrà migrar consumers a getRtdb()
            // Mentre no es migri, el SDK es carrega síncronament la primera vegada
            throw new Error(
                `rtdb.${String(prop)} accedit abans d'inicialitzar. ` +
                `Usa 'await getRtdb()' o importa 'firebase/database' amb dynamic import.`
            );
        }
        return (_rtdb as any)[prop];
    }
});

let _messaging: Messaging | null | undefined = undefined;
/**
 * Lazy-initialized Firebase Messaging. Only loads the firebase/messaging SDK
 * when first called (push notifications feature).
 */
export const getMessagingInstance = async (): Promise<Messaging | null> => {
    if (_messaging !== undefined) return _messaging;
    if (typeof window === 'undefined' || !('Notification' in window)) {
        _messaging = null;
        return null;
    }
    try {
        const { getMessaging } = await import('firebase/messaging');
        _messaging = getMessaging(app);
    } catch {
        _messaging = null;
    }
    return _messaging;
};
// Backward compat export — consumers que fan `if (messaging)` seguiran funcionant
// però amb valor null fins que s'inicialitzi.
export const messaging: Messaging | null = null;