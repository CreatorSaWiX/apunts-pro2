import React, { createContext, useContext } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface PWAContextType {
    needRefresh: boolean;
    setNeedRefresh: (value: boolean) => void;
    offlineReady: boolean;
    setOfflineReady: (value: boolean) => void;
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        offlineReady: [offlineReady, setOfflineReady],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(_swUrl, r) {
            if (!r) return;
            const checkForUpdate = () => {
                r.update().catch(() => {});
            };
            // Comprova actualitzacions quan l'usuari torna a la pestanya
            window.addEventListener('focus', checkForUpdate);
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    checkForUpdate();
                }
            });
            // Comprova periòdicament cada 20 segons
            setInterval(checkForUpdate, 20 * 1000);
        },
        onRegisterError(error) {
            console.error('SW registration error:', error);
        }
    });

    return (
        <PWAContext.Provider
            value={{
                needRefresh,
                setNeedRefresh,
                offlineReady,
                setOfflineReady,
                updateServiceWorker,
            }}
        >
            {children}
        </PWAContext.Provider>
    );
};

export const usePWA = (): PWAContextType => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
};
