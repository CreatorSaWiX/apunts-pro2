import { useState, useEffect, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db, auth } from '../lib/firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export type NotificationStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export const usePushNotifications = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<NotificationStatus>('default');
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
            setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);
            setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true);

            if (!('Notification' in window) || !('serviceWorker' in navigator) || !messaging) {
                setStatus('unsupported');
            } else {
                setStatus(Notification.permission as NotificationStatus);
            }
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (status === 'unsupported' || !messaging || !user) return false;

        try {
            let permission = Notification.permission;
            // Safari bloqueja requestPermission si no es fa clic manualment, així que evitem cridar-ho si ja ho tenim!
            if (permission !== 'granted') {
                permission = await Notification.requestPermission();
            }
            setStatus(permission as NotificationStatus);

            if (permission === 'granted') {
                // Generar URL del Service Worker neta (sense els paràmetres antics)
                // Afegim ?v=2 per forçar a Safari (iOS) a ignorar la memòria cau i descarregar el nou SW
                const swUrl = `/firebase-messaging-sw.js?v=2`;
                
                const registration = await navigator.serviceWorker.register(swUrl);
                
                const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
                if (!vapidKey) {
                    console.error("Falta VITE_FIREBASE_VAPID_KEY al fitxer .env");
                    return false;
                }

                const currentToken = await getToken(messaging, { 
                    vapidKey, 
                    serviceWorkerRegistration: registration 
                });

                if (currentToken) {
                    console.log("🌟 EL TEU TOKEN FCM ÉS:", currentToken);
                    // Desa el token a Firestore per poder enviar-li missatges des del backend
                    const userRef = doc(db, 'users', user.id);
                    await setDoc(userRef, {
                        fcmTokens: arrayUnion(currentToken)
                    }, { merge: true });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error al sol·licitar permisos de notificació:", error);
            return false;
        }
    }, [status, user]);

    // Escolta de missatges en primer pla (foreground)
    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Missatge rebut en primer pla:', payload);
            // Aquí podries disparar un toast personalitzat de la UI
            // ex: toast.info(payload.notification.title, payload.notification.body)
        });

        return () => unsubscribe();
    }, []);

    // Afegit: Si ja tens els permisos donats, obtinguem el token automàticament per ensenyar-te'l
    useEffect(() => {
        console.log("🔄 L'estat dels permisos és:", status);
        if (status === 'granted') {
            console.log("✅ Permisos concedits, intentant obtenir el token...");
            requestPermission().then(success => {
                console.log("👉 Resultat de requestPermission:", success);
            });
        }
    }, [status, requestPermission]);

    return {
        status,
        requestPermission,
        isMobile,
        isIOS,
        isStandalone,
        canRequest: status === 'default' && (!isIOS || isStandalone)
    };
};
