import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        
        // Initial check
        setIsMobile(mediaQuery.matches);

        // Listener for changes
        const mql = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', mql);
        return () => mediaQuery.removeEventListener('change', mql);
    }, [breakpoint]);

    return isMobile;
}
