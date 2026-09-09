import { es, ca, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';

export const COLUMN_COLORS = [
    'indigo-400',
    'fuchsia-400',
    'emerald-400',
    'amber-400',
    'rose-400',
    'cyan-400'
] as const;

export type ColumnColor = typeof COLUMN_COLORS[number];

export interface ColumnTheme {
    bg: string;
    text: string;
    shadow: string;
    halo: string;
    pillBg: string;
    pillBorder: string;
    pillSelectedBg: string;
}

export interface BoardColumnData {
    id: string;
    title: string;
    color?: string;
}

export const DEFAULT_COLUMNS: BoardColumnData[] = [
    { id: 'TODO', title: 'TO DO', color: 'indigo-400' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS', color: 'fuchsia-400' },
    { id: 'COMPLETE', title: 'COMPLETE', color: 'emerald-400' }
];

export const COLOR_THEMES: Record<ColumnColor, ColumnTheme> = {
    'indigo-400': {
        bg: 'bg-indigo-400',
        text: 'text-indigo-400',
        shadow: 'shadow-[0_0_15px_rgba(129,140,248,0.6)]',
        halo: 'from-indigo-400/20',
        pillBg: 'bg-indigo-400/10',
        pillBorder: 'border-indigo-400/20',
        pillSelectedBg: 'bg-indigo-400/20'
    },
    'fuchsia-400': {
        bg: 'bg-fuchsia-400',
        text: 'text-fuchsia-400',
        shadow: 'shadow-[0_0_15px_rgba(232,121,249,0.6)]',
        halo: 'from-fuchsia-400/20',
        pillBg: 'bg-fuchsia-400/10',
        pillBorder: 'border-fuchsia-400/20',
        pillSelectedBg: 'bg-fuchsia-400/20'
    },
    'emerald-400': {
        bg: 'bg-emerald-400',
        text: 'text-emerald-400',
        shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.6)]',
        halo: 'from-emerald-400/20',
        pillBg: 'bg-emerald-400/10',
        pillBorder: 'border-emerald-400/20',
        pillSelectedBg: 'bg-emerald-400/20'
    },
    'amber-400': {
        bg: 'bg-amber-400',
        text: 'text-amber-400',
        shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.6)]',
        halo: 'from-amber-400/20',
        pillBg: 'bg-amber-400/10',
        pillBorder: 'border-amber-400/20',
        pillSelectedBg: 'bg-amber-400/20'
    },
    'rose-400': {
        bg: 'bg-rose-400',
        text: 'text-rose-400',
        shadow: 'shadow-[0_0_15px_rgba(251,113,133,0.6)]',
        halo: 'from-rose-400/20',
        pillBg: 'bg-rose-400/10',
        pillBorder: 'border-rose-400/20',
        pillSelectedBg: 'bg-rose-400/20'
    },
    'cyan-400': {
        bg: 'bg-cyan-400',
        text: 'text-cyan-400',
        shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.6)]',
        halo: 'from-cyan-400/20',
        pillBg: 'bg-cyan-400/10',
        pillBorder: 'border-cyan-400/20',
        pillSelectedBg: 'bg-cyan-400/20'
    }
};

export const DEFAULT_COLUMN_THEMES: Record<string, ColumnTheme> = {
    TODO: {
        bg: 'bg-slate-400',
        text: 'text-slate-300',
        shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.5)]',
        halo: 'from-slate-500/10',
        pillBg: 'bg-slate-500/10',
        pillBorder: 'border-slate-500/20',
        pillSelectedBg: 'bg-slate-500/20'
    },
    IN_PROGRESS: {
        bg: 'bg-primary',
        text: 'text-primary',
        shadow: 'shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]',
        halo: 'from-primary/20',
        pillBg: 'bg-primary/10',
        pillBorder: 'border-primary/20',
        pillSelectedBg: 'bg-primary/20'
    },
    COMPLETE: {
        bg: 'bg-emerald-400',
        text: 'text-emerald-400',
        shadow: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]',
        halo: 'from-emerald-500/20',
        pillBg: 'bg-emerald-400/10',
        pillBorder: 'border-emerald-400/20',
        pillSelectedBg: 'bg-emerald-400/20'
    }
};

export const getColumnTheme = (col: { id: string; color?: string }): ColumnTheme => {
    if (col.color && col.color in COLOR_THEMES) {
        return COLOR_THEMES[col.color as ColumnColor];
    }
    return DEFAULT_COLUMN_THEMES[col.id] || DEFAULT_COLUMN_THEMES.TODO;
};

export const toLocalDatetime = (date: Date | string | null | undefined): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const getDateLocale = (language: string): Locale => {
    if (language === 'es') return es;
    if (language === 'en') return enUS;
    return ca;
};
