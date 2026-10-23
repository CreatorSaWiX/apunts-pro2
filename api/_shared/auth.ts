import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const JWKS = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

export interface DecodedIdToken extends JWTPayload {
    uid: string;
    email?: string;
}

export async function verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'apunts-pro2';

    try {
        const { payload } = await jwtVerify(idToken, JWKS, {
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
        });

        const uid = payload.sub;
        if (!uid) {
            throw new Error('Token does not contain subject (sub)');
        }

        return {
            ...payload,
            uid,
            email: typeof payload.email === 'string' ? payload.email : undefined,
        };
    } catch (error) {
        console.error("Token verification failed:", error);
        throw new Error('Invalid token');
    }
}
