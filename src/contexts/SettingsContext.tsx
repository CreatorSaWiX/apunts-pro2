import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { type AISettings, DEFAULT_AI_SETTINGS } from '../types/ai';

export type PlannerViewMode = 'board' | 'calendar' | 'gantt' | 'roadmap';

export type OfflineStorageSettings = Record<string, boolean>;

const DEFAULT_OFFLINE_STORAGE: OfflineStorageSettings = {};

interface SettingsContextType {
    homeSubjects: string[];
    setHomeSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    defaultPlannerView: PlannerViewMode;
    setDefaultPlannerView: React.Dispatch<React.SetStateAction<PlannerViewMode>>;
    customSubjectColors: Record<string, string>;
    setCustomSubjectColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    aiSettings: AISettings;
    setAiSettings: React.Dispatch<React.SetStateAction<AISettings>>;
    offlineStorage: OfflineStorageSettings;
    setOfflineStorage: React.Dispatch<React.SetStateAction<OfflineStorageSettings>>;
    isSettingsLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

    const [homeSubjects, setHomeSubjects] = useState<string[]>(() => {
        const saved = localStorage.getItem('app-settings-home-subjects');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return ['PRO2', 'M1', 'M2'];
            }
        }
        return ['PRO2', 'M1', 'M2'];
    });

    const [defaultPlannerView, setDefaultPlannerView] = useState<PlannerViewMode>(() => {
        const saved = localStorage.getItem('app-settings-planner-view');
        return (saved as PlannerViewMode) || 'board';
    });

    const [customSubjectColors, setCustomSubjectColors] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('app-settings-subject-colors');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return {};
            }
        }
        return {};
    });

    const [aiSettings, setAiSettings] = useState<AISettings>(() => {
        const saved = localStorage.getItem('app-settings-ai');
        if (saved) {
            try { 
                const parsed = JSON.parse(saved);
                return {
                    ...DEFAULT_AI_SETTINGS,
                    ...parsed,
                    identity: { ...DEFAULT_AI_SETTINGS.identity, ...(parsed.identity || {}) },
                    userContext: { 
                        ...DEFAULT_AI_SETTINGS.userContext, 
                        ...(parsed.userContext || {}),
                        memories: parsed.userContext?.memories || []
                    },
                    soul: { ...DEFAULT_AI_SETTINGS.soul, ...(parsed.soul || {}) }
                };
            } catch (e) { 
                return DEFAULT_AI_SETTINGS; 
            }
        }
        return DEFAULT_AI_SETTINGS;
    });

    const [offlineStorage, setOfflineStorage] = useState<OfflineStorageSettings>(() => {
        const saved = localStorage.getItem('app-settings-offline');
        if (saved) {
            try {
                return { ...DEFAULT_OFFLINE_STORAGE, ...JSON.parse(saved) };
            } catch (e) {
                return DEFAULT_OFFLINE_STORAGE;
            }
        }
        return DEFAULT_OFFLINE_STORAGE;
    });

    // Load from Firebase on mount if user is logged in
    useEffect(() => {
        let isMounted = true;
        const loadFirebaseSettings = async () => {
            if (!user) {
                setIsSettingsLoaded(true);
                return;
            }
            try {
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id);
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.homeSubjects) setHomeSubjects(data.homeSubjects);
                    if (data.defaultPlannerView) setDefaultPlannerView(data.defaultPlannerView);
                    if (data.customSubjectColors) setCustomSubjectColors(data.customSubjectColors);
                    
                    if (data.aiSettings) {
                        setAiSettings({
                            ...DEFAULT_AI_SETTINGS,
                            ...data.aiSettings,
                            identity: {
                                ...DEFAULT_AI_SETTINGS.identity,
                                ...(data.aiSettings.identity || {})
                            },
                            userContext: {
                                ...DEFAULT_AI_SETTINGS.userContext,
                                ...(data.aiSettings.userContext || {}),
                                memories: data.aiSettings.userContext?.memories || []
                            },
                            soul: {
                                ...DEFAULT_AI_SETTINGS.soul,
                                ...(data.aiSettings.soul || {})
                            }
                        });
                    }
                    if (data.offlineStorage) {
                        setOfflineStorage({ ...DEFAULT_OFFLINE_STORAGE, ...data.offlineStorage });
                    }
                }
            } catch (err) {
                console.error('Failed to load settings from Firebase:', err);
            } finally {
                if (isMounted) setIsSettingsLoaded(true);
            }
        };

        loadFirebaseSettings();
        return () => { isMounted = false; };
    }, [user]);

    // Save to LocalStorage AND Firebase when they change, but ONLY if we have already loaded the initial settings from Firebase
    // to prevent overwriting Firebase with LocalStorage defaults on first render.
    useEffect(() => {
        localStorage.setItem('app-settings-home-subjects', JSON.stringify(homeSubjects));
        localStorage.setItem('app-settings-planner-view', defaultPlannerView);
        localStorage.setItem('app-settings-subject-colors', JSON.stringify(customSubjectColors));
        localStorage.setItem('app-settings-ai', JSON.stringify(aiSettings));
        localStorage.setItem('app-settings-offline', JSON.stringify(offlineStorage));

        if (isSettingsLoaded && user) {
            // DEBOUNCE: Esperem 1 segon abans d'enviar-ho al servidor de Firebase
            // per no saturar la xarxa si l'usuari fa canvis molt ràpids.
            const timeoutId = setTimeout(async () => {
                try {
                    const { db } = await import('../lib/firebase');
                    const { doc, setDoc } = await import('firebase/firestore');
                    const docRef = doc(db, 'users', user.id);
                    await setDoc(docRef, {
                        homeSubjects,
                        defaultPlannerView,
                        customSubjectColors,
                        aiSettings,
                        offlineStorage
                    }, { merge: true });
                } catch (err) {
                    console.error('Failed to save settings to Firebase:', err);
                }
            }, 1000); // 1000 ms (1 segon) de rebot (debounce)

            // Si hi ha un altre canvi abans del segon, es cancel·la el timer anterior (com aturar la IRQ)
            return () => clearTimeout(timeoutId);
        }
    }, [homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, isSettingsLoaded, user]);

    // MEMOITZACIÓ: Evitem fer un "new Struct" cada cop i mantenim el punter estable al Heap.
    // Això salva a tota l'aplicació de repintar-se si les variables de dalt no han canviat realment.
    const contextValue = useMemo(() => ({
        homeSubjects,
        setHomeSubjects,
        defaultPlannerView,
        setDefaultPlannerView,
        customSubjectColors,
        setCustomSubjectColors,
        aiSettings,
        setAiSettings,
        offlineStorage,
        setOfflineStorage,
        isSettingsLoaded
    }), [homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, isSettingsLoaded]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
