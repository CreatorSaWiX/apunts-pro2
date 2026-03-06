import { useEffect, useState, type ReactNode } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export interface PlayerTab {
    id: string;
    label: string;
    icon: ReactNode;
}

export interface PlayerShellProps {
    tabs: PlayerTab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    leftPanel: ReactNode;
    rightPanel: ReactNode;
}

export function PlayerShell({
    tabs,
    activeTab,
    onTabChange,
    leftPanel,
    rightPanel
}: PlayerShellProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Handle body scroll locking and Escape key when fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('player-fullscreen');
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('player-fullscreen');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen]);

    return (
        <>
            {/* Placeholder to prevent aggressive layout shift when fixed */}
            {isFullscreen && <div className="h-[500px] lg:h-[550px] w-full my-12 hidden md:block opacity-0" />}

            <div className={`not-prose flex flex-col bg-[#0B0F17] overflow-hidden shadow-2xl font-sans group/player transition-all duration-300 ease-out origin-center
                ${isFullscreen
                    ? 'fixed inset-0 z-[99999] h-[100dvh] w-full rounded-none m-0'
                    : 'relative w-full z-10 rounded-2xl border border-white/10 my-12 h-[500px] lg:h-[550px] max-h-[85vh] xl:max-h-[600px]'
                }`}
            >
                {/* Fullscreen Toggle */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="absolute top-2 right-2 md:top-3 md:right-3 z-50 p-2 text-slate-400 hover:text-white bg-[#1a212e]/80 hover:bg-[#232c3d]/90 backdrop-blur-md rounded-lg transition-all border border-white/10 shadow-lg active:scale-95"
                    title={isFullscreen ? "Minimitza (Esc)" : "Pantalla completa"}
                >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                </button>

                {/* Mobile Tab Switcher */}
                {tabs.length > 0 && (
                    <div className="flex lg:hidden border-b border-white/5 bg-[#0a0d14]">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex-1 py-3 text-[11px] flex justify-center items-center gap-2 font-bold font-mono tracking-widest transition-colors ${activeTab === tab.id ? 'text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-400'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    {leftPanel}
                    {rightPanel}
                </div>
            </div>
        </>
    );
}
