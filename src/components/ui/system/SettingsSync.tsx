import { useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { DEFAULT_AI_SETTINGS } from '../../../types/ai';

const DEFAULT_SETTINGS = {
    homeSubjects: ['PRO2', 'M1', 'M2'],
    defaultPlannerView: 'board' as const,
    customSubjectColors: {},
    aiSettings: DEFAULT_AI_SETTINGS,
    offlineStorage: {},
    shortcuts: {
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
        editorTable: { key: 't', meta: true },
        plannerToday: { key: 't', meta: false },
        plannerViewWeek: { key: 'w', meta: false },
        plannerViewMonth: { key: 'm', meta: false },
        plannerViewYear: { key: 'y', meta: false },
        plannerPrev: { key: 'ArrowLeft', meta: false },
        plannerNext: { key: 'ArrowRight', meta: false },
        plannerCreateTask: { key: 'c', meta: false },
        plannerDeleteTask: { key: 'Backspace', meta: false },
        plannerEditTask: { key: 'Enter', meta: false },
        plannerPriorityLow: { key: '1', meta: false },
        plannerPriorityMedium: { key: '2', meta: false },
        plannerPriorityHigh: { key: '3', meta: false },
        plannerDuplicateModifier: { key: 'Alt', meta: false },
        canvasPen: { key: 'p', meta: false },
        canvasEraser: { key: 'e', meta: false },
        canvasPan: { key: 'h', meta: false },
        canvasTempPan: { key: ' ', meta: false },
        canvasUndo: { key: 'z', meta: true },
        canvasRedo: { key: 'y', meta: true },
        canvasClear: { key: 'Delete', meta: false },
        canvasSizeDecrease: { key: '[', meta: false },
        canvasSizeIncrease: { key: ']', meta: false },
        canvasColorCycle: { key: 'c', meta: false }
    }
};

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

    const lastSyncedPayloadRef = useRef<string | null>(null);

    // Unificat: Gestió de cicle de vida d'usuari i càrrega de Firebase en un sol efecte
    useEffect(() => {
        let isMounted = true;
        setIsSettingsLoaded(false);
        lastSyncedPayloadRef.current = null;

        if (!user) {
            setIsSettingsLoaded(true);
            return;
        }

        const loadFirebaseSettings = async () => {
            try {
                const { db } = await import('../../../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id);
                const snap = await getDoc(docRef);
                
                if (!isMounted) return;

                if (snap.exists()) {
                    const data = snap.data();
                    syncFromFirebase(data);
                    const currentStore = useSettingsStore.getState();
                    lastSyncedPayloadRef.current = JSON.stringify({
                        homeSubjects: currentStore.homeSubjects,
                        defaultPlannerView: currentStore.defaultPlannerView,
                        customSubjectColors: currentStore.customSubjectColors,
                        aiSettings: currentStore.aiSettings,
                        offlineStorage: currentStore.offlineStorage,
                        shortcuts: currentStore.shortcuts
                    });
                } else {
                    // Nou usuari: restablim valors per defecte per no heretar settings d'un altre usuari a localStorage
                    syncFromFirebase(DEFAULT_SETTINGS);
                    lastSyncedPayloadRef.current = JSON.stringify(DEFAULT_SETTINGS);
                }
            } catch (err) {
                console.error('Failed to load settings from Firebase:', err);
            } finally {
                if (isMounted) setIsSettingsLoaded(true);
            }
        };

        loadFirebaseSettings();
        return () => { isMounted = false; };
    }, [user?.id, syncFromFirebase, setIsSettingsLoaded]);

    // Save to Firebase when settings change (debounced)
    useEffect(() => {
        if (!isSettingsLoaded || !user) {
            return;
        }

        const currentPayload = {
            homeSubjects,
            defaultPlannerView,
            customSubjectColors,
            aiSettings,
            offlineStorage,
            shortcuts
        };
        const serialized = JSON.stringify(currentPayload);

        // If initial load or identical to last synced payload, skip saving
        if (lastSyncedPayloadRef.current === null) {
            lastSyncedPayloadRef.current = serialized;
            return;
        }
        if (serialized === lastSyncedPayloadRef.current) {
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const { db } = await import('../../../lib/firebase');
                const { doc, setDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.id);
                await setDoc(docRef, currentPayload, { merge: true });
                lastSyncedPayloadRef.current = serialized;
            } catch (err) {
                console.error('Failed to save settings to Firebase:', err);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [
        homeSubjects, defaultPlannerView, customSubjectColors, aiSettings, offlineStorage, shortcuts,
        isSettingsLoaded, user
    ]);

    return null;
};
