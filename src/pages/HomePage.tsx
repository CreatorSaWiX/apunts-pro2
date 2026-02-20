import { useEffect } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import Hero from '../components/Hero';
import TopicCarousel from '../components/TopicCarousel';

const HomePage = () => {
    const { subject, setSubject } = useSubject();
    // Lock scroll on mount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="h-screen w-full relative z-10 flex flex-col overflow-hidden">
            {/* Subject Switcher */}
            {/* Subject Switcher - Responsive Positioning */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center p-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl scale-90 md:scale-100 origin-top-right">
                <button
                    onClick={() => setSubject('pro2')}
                    className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${subject === 'pro2' ? 'bg-[#0ea5e9] text-white shadow-lg shadow-sky-500/25 scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                    PRO2
                </button>
                <div className="w-px h-3 md:h-4 bg-white/10 mx-1"></div>
                <button
                    onClick={() => setSubject('m1')}
                    className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${subject === 'm1' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-violet-500/25 scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                    M1
                </button>
            </div>

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
