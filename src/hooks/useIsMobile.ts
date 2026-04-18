import { useState, useEffect } from 'react';

/**
 * Robust hook to detect mobile environment.
 * Combined viewport width and touch capability detection.
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        
        const isSmallScreen = window.innerWidth < breakpoint;
        
        // On very high density devices, we prioritize the width-based break
        return isSmallScreen;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const widthQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        
        const updateMobile = () => {
            setIsMobile(widthQuery.matches);
        };

        // Initial check
        updateMobile();

        // Support both modern addEventListener and legacy addListener (Old Safari/Chrome)
        if (widthQuery.addEventListener) {
            widthQuery.addEventListener('change', updateMobile);
            return () => widthQuery.removeEventListener('change', updateMobile);
        } else {
            // @ts-ignore - Support legacy browsers
            widthQuery.addListener(updateMobile);
            // @ts-ignore
            return () => widthQuery.removeListener(updateMobile);
        }
    }, [breakpoint]);

    return isMobile;
}
