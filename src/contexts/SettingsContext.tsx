import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type PlannerViewMode = 'board' | 'calendar' | 'gantt' | 'roadmap';

interface SettingsContextType {
    homeSubjects: string[];
    setHomeSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    defaultPlannerView: PlannerViewMode;
    setDefaultPlannerView: React.Dispatch<React.SetStateAction<PlannerViewMode>>;
    customSubjectColors: Record<string, string>;
    setCustomSubjectColors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
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

    // Load from Firebase on mount if user is logged in
    useEffect(() => {
        let isMounted = true;
        const loadFirebaseSettings = async () => {
            if (!user) {
                setIsSettingsLoaded(true);
                return;
            }
            try {
                const docRef = doc(db, 'users', user.id);
                const snap = await getDoc(docRef);
                if (snap.exists() && isMounted) {
                    const data = snap.data();
                    if (data.homeSubjects) setHomeSubjects(data.homeSubjects);
                    if (data.defaultPlannerView) setDefaultPlannerView(data.defaultPlannerView);
                    if (data.customSubjectColors) setCustomSubjectColors(data.customSubjectColors);
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

        if (isSettingsLoaded && user) {
            const saveToFirebase = async () => {
                try {
                    const docRef = doc(db, 'users', user.id);
                    await setDoc(docRef, {
                        homeSubjects,
                        defaultPlannerView,
                        customSubjectColors
                    }, { merge: true });
                } catch (err) {
                    console.error('Failed to save settings to Firebase:', err);
                }
            };
            saveToFirebase();
        }
    }, [homeSubjects, defaultPlannerView, customSubjectColors, isSettingsLoaded, user]);

    return (
        <SettingsContext.Provider value={{
            homeSubjects,
            setHomeSubjects,
            defaultPlannerView,
            setDefaultPlannerView,
            customSubjectColors,
            setCustomSubjectColors,
            isSettingsLoaded
        }}>
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
