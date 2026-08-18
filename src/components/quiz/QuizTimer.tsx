import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/quizUtils';

interface QuizTimerProps {
    initialTime: number;
    isFinished: boolean;
    onTimeUp: () => void;
    onTick: (time: number) => void;
}

export const QuizTimer = React.memo(({
    initialTime,
    isFinished,
    onTimeUp,
    onTick
}: QuizTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const onTimeUpRef = useRef(onTimeUp);
    const onTickRef = useRef(onTick);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
        onTickRef.current = onTick;
    }, [onTimeUp, onTick]);

    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                return next < 0 ? 0 : next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished]);

    useEffect(() => {
        if (isFinished) return;
        if (timeLeft === 0) {
            onTimeUpRef.current();
        } else if (timeLeft < initialTime) {
            onTickRef.current(timeLeft);
        }
    }, [timeLeft, isFinished, initialTime]);

    return (
        <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl font-mono text-sm font-bold border transition duration-500 ${timeLeft < 60
            ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-105'
            : 'bg-slate-800/50 backdrop-blur-md text-slate-300 border-white/10'
            }`}>
            <Clock size={16} className={timeLeft < 60 ? 'animate-pulse' : ''} />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
        </div>
    );
});
