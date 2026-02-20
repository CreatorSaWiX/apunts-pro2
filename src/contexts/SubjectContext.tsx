import React, { createContext, useContext, useState, useEffect } from 'react';

type Subject = 'pro2' | 'm1';

interface Theme {
    primary: string;
    primary_rgb: string;
    accent: string;
    accent_rgb: string;
    background: string;
    label: string;
}

const themes: Record<Subject, Theme> = {
    pro2: {
        primary: '#0ea5e9', // sky-500
        primary_rgb: '14, 165, 233',
        accent: '#38bdf8', // sky-400
        accent_rgb: '56, 189, 248',
        background: '#0f172a', // slate-900
        label: 'PRO2'
    },
    m1: {
        primary: '#8b5cf6', // violet-500
        primary_rgb: '139, 92, 246',
        accent: '#a78bfa', // violet-400
        accent_rgb: '167, 139, 250',
        background: '#0f172a', // slate-900 (same base)
        label: 'M1'
    }
};

interface SubjectContextType {
    subject: Subject;
    setSubject: (subject: Subject) => void;
    theme: Theme;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: React.ReactNode }) {
    const [subject, setSubject] = useState<Subject>('pro2');

    // Apply theme colors to CSS variables for global transition
    useEffect(() => {
        const root = document.documentElement;
        const theme = themes[subject];

        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--primary-rgb', theme.primary_rgb);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent-rgb', theme.accent_rgb);

        // Ensure body background transition
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        // We might want to change selection color too

    }, [subject]);

    return (
        <SubjectContext.Provider value={{ subject, setSubject, theme: themes[subject] }}>
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
