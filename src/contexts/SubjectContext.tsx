import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import subjectsData from '../data/subjects.json';
import { useSettings } from './SettingsContext';

interface Theme {
    primary: string;
    primary_rgb: string;
    accent: string;
    accent_rgb: string;
    background: string;
    label: string;
}

// Map Tailwind color names to Hex and RGB
export const tailwindColors: Record<string, { primary: string, primary_rgb: string, accent: string, accent_rgb: string }> = {
    'slate':   { primary: '#64748b', primary_rgb: '100, 116, 139', accent: '#94a3b8', accent_rgb: '148, 163, 184' },
    'red':     { primary: '#ef4444', primary_rgb: '239, 68, 68',   accent: '#f87171', accent_rgb: '248, 113, 113' },
    'orange':  { primary: '#f97316', primary_rgb: '249, 115, 22',  accent: '#fb923c', accent_rgb: '251, 146, 60' },
    'amber':   { primary: '#f59e0b', primary_rgb: '245, 158, 11',  accent: '#fbbf24', accent_rgb: '251, 191, 36' },
    'yellow':  { primary: '#eab308', primary_rgb: '234, 179, 8',   accent: '#facc15', accent_rgb: '250, 204, 21' },
    'lime':    { primary: '#84cc16', primary_rgb: '132, 204, 22',  accent: '#a3e635', accent_rgb: '163, 230, 53' },
    'green':   { primary: '#22c55e', primary_rgb: '34, 197, 94',   accent: '#4ade80', accent_rgb: '74, 222, 128' },
    'emerald': { primary: '#10b981', primary_rgb: '16, 185, 129',  accent: '#34d399', accent_rgb: '52, 211, 153' },
    'teal':    { primary: '#14b8a6', primary_rgb: '20, 184, 166',  accent: '#2dd4bf', accent_rgb: '45, 212, 191' },
    'cyan':    { primary: '#06b6d4', primary_rgb: '6, 182, 212',   accent: '#22d3ee', accent_rgb: '34, 211, 238' },
    'sky':     { primary: '#0ea5e9', primary_rgb: '14, 165, 233',  accent: '#38bdf8', accent_rgb: '56, 189, 248' },
    'blue':    { primary: '#3b82f6', primary_rgb: '59, 130, 246',  accent: '#60a5fa', accent_rgb: '96, 165, 250' },
    'indigo':  { primary: '#6366f1', primary_rgb: '99, 102, 241',  accent: '#818cf8', accent_rgb: '129, 140, 248' },
    'violet':  { primary: '#8b5cf6', primary_rgb: '139, 92, 246',  accent: '#a78bfa', accent_rgb: '167, 139, 250' },
    'purple':  { primary: '#a855f7', primary_rgb: '168, 85, 247',  accent: '#c084fc', accent_rgb: '192, 132, 252' },
    'fuchsia': { primary: '#d946ef', primary_rgb: '217, 70, 239',  accent: '#e879f9', accent_rgb: '232, 121, 249' },
    'pink':    { primary: '#ec4899', primary_rgb: '236, 72, 153',  accent: '#f472b6', accent_rgb: '244, 114, 182' },
    'rose':    { primary: '#f43f5e', primary_rgb: '244, 63, 94',   accent: '#fb7185', accent_rgb: '251, 113, 133' },
};

interface SubjectContextType {
    subject: string;
    setSubject: (subject: string) => void;
    theme: Theme;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: React.ReactNode }) {
    const { customSubjectColors } = useSettings();

    const [subject, setSubject] = useState<string>(() => {
        return localStorage.getItem('app-subject') || 'PRO2';
    });

    useEffect(() => {
        localStorage.setItem('app-subject', subject);
    }, [subject]);

    const theme = useMemo<Theme>(() => {
        const subjectInfo = subjectsData.find((s: any) => s.name.toUpperCase() === subject.toUpperCase());
        
        let colorFamily = 'sky'; // default
        if (customSubjectColors && customSubjectColors[subject.toUpperCase()]) {
            colorFamily = customSubjectColors[subject.toUpperCase()];
        } else if (subjectInfo?.colorToken) {
            colorFamily = subjectInfo.colorToken.split('-')[0];
        }

        const colors = tailwindColors[colorFamily] || tailwindColors['sky'];

        return {
            ...colors,
            background: '#0f172a', // slate-900
            label: subjectInfo?.name || subject.toUpperCase()
        };
    }, [subject, customSubjectColors]);

    // Apply theme colors to CSS variables for global transition
    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--primary-rgb', theme.primary_rgb);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-rgb', theme.accent_rgb);

        // Ensure body background transition
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

    }, [theme]);

    const contextValue = useMemo(() => ({ subject, setSubject, theme }), [subject, theme]);

    return (
        <SubjectContext.Provider value={contextValue}>
            {children}
        </SubjectContext.Provider>
    );
}

export function useSubject() {
    const context = useContext(SubjectContext);
    if (context === undefined) {
        throw new Error('useSubject must be used within a SubjectProvider');
    }
    return context;
}
