import { useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettingsStore } from '../../../stores/useSettingsStore';

export const SettingsSync = () => {
    const { user } = useAuth();
    const { 
        isSettingsLoaded, 
        setIsSettingsLoaded, 
        syncFromFirebase,
        homeSubjects,
        defaultPlannerView,
        customSubjectColors,
        aiSettings,
        offlineStorage,
        shortcuts
    } = useSettingsStore();

    // Load from Firebase on mount if user is logged in
    useEffect(() => {
        let isMounted = true;
        const loadFirebaseSettings = async () => {
            if (!user) {
                setIsSettingsLoaded(true);
                return;
            }
            try {
                const { db } = await import('../../../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id);
                const snap = await getDoc(docRef);
                
                if (snap.exists() && isMounted) {
                    syncFromFirebase(snap.data());
                }
            } catch (err) {
                console.error('Failed to load settings from Firebase:', err);
            } finally {
                if (isMounted) setIsSettingsLoaded(true);
            }
        };

        loadFirebaseSettings();
        return () => { isMounted = false; };
    }, [user, syncFromFirebase, setIsSettingsLoaded]);

    // Save to Firebase when settings change (debounced)
    // We use a ref to track if this is the first render to avoid overwriting Firebase
    const isFirstRender = useRef(true);
    
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (isSettingsLoaded && user) {
            const timeoutId = setTimeout(async () => {
                try {
                    const { db } = await import('../../../lib/firebase');
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
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [
        homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, shortcuts,
        isSettingsLoaded, user
    ]);

    return null; // This component doesn't render anything
};
