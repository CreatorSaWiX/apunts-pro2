import { useEffect } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';
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
            {/* Subject Switcher - Premium Animated Pill */}
            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50 flex items-center p-1.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] scale-90 md:scale-100 origin-top-right transition-all hover:bg-slate-900/90 hover:border-white/20">
                <button
                    onClick={() => setSubject('pro2')}
                    className={`relative px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition-all duration-300 z-10 ${subject === 'pro2' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {subject === 'pro2' && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] z-[-1]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    PRO2
                </button>
                <button
                    onClick={() => setSubject('m1')}
                    className={`relative px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[11px] md:text-[13px] font-black tracking-widest transition-all duration-300 z-10 ${subject === 'm1' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    {subject === 'm1' && (
                        <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] z-[-1]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
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
