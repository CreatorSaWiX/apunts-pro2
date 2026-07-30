import { useState, useEffect } from 'react';

/**
 * Robust hook to detect mobile environment.
 * Combined viewport width, height and touch capability detection.
 */
export function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        const isPortraitMobile = window.innerWidth < breakpoint;
        // Detect landscape mobile (e.g. iPhone Max is 932x430)
        const isLandscapeMobile = window.innerHeight < 550 && window.innerWidth < 1000;
        return isPortraitMobile || isLandscapeMobile;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkMobile = () => {
            const isPortraitMobile = window.innerWidth < breakpoint;
            const isLandscapeMobile = window.innerHeight < 550 && window.innerWidth < 1000;
            setIsMobile(isPortraitMobile || isLandscapeMobile);
        };

        // Initial check
        checkMobile();

        window.addEventListener('resize', checkMobile, { passive: true });
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

