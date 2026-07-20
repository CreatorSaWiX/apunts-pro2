import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { type AISettings, DEFAULT_AI_SETTINGS } from '../types/ai';

export type PlannerViewMode = 'board' | 'calendar' | 'gantt' | 'roadmap';

export type OfflineStorageSettings = Record<string, boolean>;

const DEFAULT_OFFLINE_STORAGE: OfflineStorageSettings = {};

export type ShortcutConfig = { key: string; meta: boolean };
export type ShortcutsSettings = Record<string, ShortcutConfig>;

const DEFAULT_SHORTCUTS: ShortcutsSettings = {
    searchSubjects: { key: 'k', meta: true },
    carouselLeft: { key: 'ArrowLeft', meta: false },
    carouselRight: { key: 'ArrowRight', meta: false },
    carouselEnter: { key: 'Enter', meta: false },
    createResource: { key: 'c', meta: false },
    editorBold: { key: 'b', meta: true },
    editorItalic: { key: 'i', meta: true },
    editorUnderline: { key: 'u', meta: true },
    editorStrikethrough: { key: 'x', meta: true },
    editorLink: { key: 'k', meta: true },
    editorAlignLeft: { key: 'l', meta: true },
    editorAlignCenter: { key: 'e', meta: true },
    editorAlignRight: { key: 'r', meta: true },
    editorAlignJustify: { key: 'j', meta: true },
    editorListBullet: { key: '8', meta: true },
    editorListOrdered: { key: '7', meta: true },
    editorTaskList: { key: '9', meta: true },
    editorTable: { key: 't', meta: true }
};

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
    shortcuts: ShortcutsSettings;
    setShortcuts: React.Dispatch<React.SetStateAction<ShortcutsSettings>>;
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

    const [shortcuts, setShortcuts] = useState<ShortcutsSettings>(() => {
        const saved = localStorage.getItem('app-settings-shortcuts');
        if (saved) {
            try {
                return { ...DEFAULT_SHORTCUTS, ...JSON.parse(saved) };
            } catch (e) {
                return DEFAULT_SHORTCUTS;
            }
        }
        return DEFAULT_SHORTCUTS;
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
                    if (data.shortcuts) {
                        setShortcuts({ ...DEFAULT_SHORTCUTS, ...data.shortcuts });
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
        // DEBOUNCE LOCAL STORAGE
        const localTimeoutId = setTimeout(() => {
            localStorage.setItem('app-settings-home-subjects', JSON.stringify(homeSubjects));
            localStorage.setItem('app-settings-planner-view', defaultPlannerView);
            localStorage.setItem('app-settings-subject-colors', JSON.stringify(customSubjectColors));
            localStorage.setItem('app-settings-ai', JSON.stringify(aiSettings));
            localStorage.setItem('app-settings-offline', JSON.stringify(offlineStorage));
            localStorage.setItem('app-settings-shortcuts', JSON.stringify(shortcuts));
        }, 300);

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
                        offlineStorage,
                        shortcuts
                    }, { merge: true });
                } catch (err) {
                    console.error('Failed to save settings to Firebase:', err);
                }
            }, 1000); // 1000 ms (1 segon) de rebot (debounce)

            // Si hi ha un altre canvi abans del segon, es cancel·la el timer anterior (com aturar la IRQ)
            return () => {
                clearTimeout(timeoutId);
                clearTimeout(localTimeoutId);
            };
        }

        return () => clearTimeout(localTimeoutId);
    }, [homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, shortcuts, isSettingsLoaded, user]);

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
        shortcuts,
        setShortcuts,
        isSettingsLoaded
    }), [homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, shortcuts, isSettingsLoaded]);

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
