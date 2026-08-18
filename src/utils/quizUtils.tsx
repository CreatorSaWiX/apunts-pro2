import React from 'react';

export const renderInlineCode = (text: string): React.ReactNode[] | string => {
    if (!text.includes('`')) return text;
    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, i) => {
        if (i % 2 === 1) {
            return (
                <code key={i} className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shadow-[0_0_10px_rgba(14,165,233,0.15)] mx-0.5 leading-none text-[0.85em]">
                    {part}
                </code>
            );
        }
        return <span key={i}>{part}</span>;
    });
};

export const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Fisher-Yates shuffle algorithm for O(N) unbiased array shuffling.
 * Does not mutate the original array.
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
