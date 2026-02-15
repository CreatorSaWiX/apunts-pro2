import { useEffect } from 'react';
import Hero from '../components/Hero';
import TopicCarousel from '../components/TopicCarousel';

const HomePage = () => {
    // Lock scroll on mount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="h-screen w-full relative z-10 flex flex-col overflow-hidden">
            <div className="flex-none pt-10 z-20 pointer-events-none">
                <div className="pointer-events-auto">
                    <Hero />
                </div>
            </div>
            <div className="flex-1 min-h-0 relative z-10 flex flex-col justify-center -mt-4 pb-16">
                <TopicCarousel />
            </div>
        </div>
    );
};

export default HomePage;
