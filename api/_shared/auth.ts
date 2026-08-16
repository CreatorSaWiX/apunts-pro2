import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function initFirebaseIfNeeded() {
    if (getApps().length === 0) {
        try {
            const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
            if (serviceAccountJson) {
                const serviceAccount = JSON.parse(serviceAccountJson);
                initializeApp({
                    credential: cert(serviceAccount)
                });
            }
        } catch (error) {
            console.error("Error initializing Firebase Admin:", error);
            throw new Error('Firebase admin not initialized');
        }
    }
}

export async function verifyIdToken(idToken: string) {
    initFirebaseIfNeeded();

    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error('Invalid token');
    }
}
