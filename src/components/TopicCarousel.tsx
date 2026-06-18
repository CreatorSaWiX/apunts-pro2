import React, { Suspense, lazy } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const TopicCarouselMobile = lazy(() => import('./TopicCarouselMobile'));
const TopicCarouselDesktop = lazy(() => import('./TopicCarouselDesktop'));

interface TopicCarouselProps {
    isMenuOpen?: boolean;
    subjectOverride?: string;
}

const TopicCarousel: React.FC<TopicCarouselProps> = (props) => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={<div className="w-full flex-1" />}>
            {isMobile ? (
                <TopicCarouselMobile {...props} />
            ) : (
                <TopicCarouselDesktop {...props} />
            )}
        </Suspense>
    );
};

export default TopicCarousel;
