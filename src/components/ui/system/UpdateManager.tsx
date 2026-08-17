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

    return null;
};
