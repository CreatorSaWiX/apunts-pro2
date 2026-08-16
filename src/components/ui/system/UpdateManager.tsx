import { useEffect } from 'react';

export const UpdateManager = () => {

    useEffect(() => {
        const handlePreloadError = () => {
            window.location.reload();
        };

        window.addEventListener('vite:preloadError', handlePreloadError as EventListener);

        return () => {
            window.removeEventListener('vite:preloadError', handlePreloadError as EventListener);
        };
    }, []);

    useEffect(() => {
        const currentVersion = localStorage.getItem('app-version') || '1.0.0';

        const checkVersion = async () => {
            try {
                const { db } = await import('../../../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                
                const docRef = doc(db, 'app', 'metadata');
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.latestVersion && data.latestVersion !== currentVersion) {
                        localStorage.setItem('app-version', data.latestVersion);
                        window.location.reload();
                    }
                }
            } catch (e) {
                console.error("Failed to load firestore in UpdateManager", e);
            }
        };

        checkVersion();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkVersion();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return null;
};
