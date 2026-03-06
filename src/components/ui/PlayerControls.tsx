import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

export interface PlayerControlsProps {
    currentStep: number;
    totalSteps: number;
    description: string;
    isPlaying: boolean;
    onStepChange: (step: number) => void;
    onPlayPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
    onFullEnd: () => void;
}

export function PlayerControls({
    currentStep,
    totalSteps,
    description,
    isPlaying,
    onStepChange,
    onPlayPause,
    onNext,
    onPrev,
    onReset,
    onFullEnd
}: PlayerControlsProps) {
    return (
        <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
            {/* Description Card */}
            <div className="bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl pointer-events-auto transition-all duration-300 hover:bg-slate-900/85">
                <p className="text-[12px] sm:text-[13px] text-emerald-300 font-medium leading-[18px] sm:leading-relaxed font-sans shadow-black drop-shadow-md">
                    {description}
                </p>
            </div>

            {/* Player Controls Card */}
            <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 shadow-2xl pointer-events-auto">
                {/* Custom Slider Row (Native) */}
                <div className="flex items-center gap-3 w-full px-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono font-medium w-6 text-right">{currentStep}</span>
                    <input
                        type="range"
                        min={0}
                        max={totalSteps - 1}
                        value={currentStep}
                        onChange={(e) => onStepChange(parseInt(e.target.value))}
                        className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium w-6">{totalSteps - 1}</span>
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                    <button onClick={onReset} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                        <SkipBack size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={onPrev} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                        <ChevronLeft size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    </button>
                    <button
                        onClick={onPlayPause}
                        className="p-3 bg-gradient-to-b from-emerald-400 to-emerald-600 text-slate-950 border border-emerald-400/50 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    >
                        {isPlaying ? <Pause size={18} className="fill-current w-[18px] h-[18px]" /> : <Play size={18} className="ml-0.5 fill-current w-[18px] h-[18px]" />}
                    </button>
                    <button onClick={onNext} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                        <ChevronRight size={16} className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    </button>
                    <button onClick={onFullEnd} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95">
                        <SkipForward size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
