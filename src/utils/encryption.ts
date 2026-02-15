import CryptoJS from 'crypto-js';

// In a real production app, this should be an environment variable
// VITE_ENCRYPTION_KEY="..."
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'apunts-secret-key-2026';

export const encryptMessage = (text: string): string => {
    if (!text) return '';
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (ciphertext: string): string => {
    if (!ciphertext) return '';
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText || 'Error de desencriptació'; // Fallback if empty
    } catch (e) {
        console.error("Decryption error:", e);
        return 'Error: Missatge corrupte o clau incorrecta';
    }
};
