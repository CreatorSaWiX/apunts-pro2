import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AISettings, DEFAULT_AI_SETTINGS } from '../types/ai';
import { useSubjectStore } from './useSubjectStore';

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
};

interface SettingsState {
    homeSubjects: string[];
    defaultPlannerView: PlannerViewMode;
    customSubjectColors: Record<string, string>;
    aiSettings: AISettings;
    offlineStorage: OfflineStorageSettings;
    shortcuts: ShortcutsSettings;
    isSettingsLoaded: boolean;

    // Actions
    setHomeSubjects: (subjects: string[] | ((prev: string[]) => string[])) => void;
    setDefaultPlannerView: (view: PlannerViewMode | ((prev: PlannerViewMode) => PlannerViewMode)) => void;
    setCustomSubjectColors: (colors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
    setAiSettings: (settings: AISettings | ((prev: AISettings) => AISettings)) => void;
    setOfflineStorage: (settings: OfflineStorageSettings | ((prev: OfflineStorageSettings) => OfflineStorageSettings)) => void;
    setShortcuts: (shortcuts: ShortcutsSettings | ((prev: ShortcutsSettings) => ShortcutsSettings)) => void;
    setIsSettingsLoaded: (loaded: boolean) => void;

    // Helper to merge all settings from Firebase
    syncFromFirebase: (data: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            homeSubjects: ['PRO2', 'M1', 'M2'],
            defaultPlannerView: 'board',
            customSubjectColors: {},
            aiSettings: DEFAULT_AI_SETTINGS,
            offlineStorage: DEFAULT_OFFLINE_STORAGE,
            shortcuts: DEFAULT_SHORTCUTS,
            isSettingsLoaded: false,

            setHomeSubjects: (updater) => set((state) => ({
                homeSubjects: typeof updater === 'function' ? updater(state.homeSubjects) : updater
            })),
            setDefaultPlannerView: (updater) => set((state) => ({
                defaultPlannerView: typeof updater === 'function' ? updater(state.defaultPlannerView) : updater
            })),
            setCustomSubjectColors: (updater) => {
                set((state) => {
                    const newColors = typeof updater === 'function' ? updater(state.customSubjectColors) : updater;
                    // Trigger SubjectStore theme update
                    useSubjectStore.getState().updateTheme(newColors);
                    return { customSubjectColors: newColors };
                });
            },
            setAiSettings: (updater) => set((state) => ({
                aiSettings: typeof updater === 'function' ? updater(state.aiSettings) : updater
            })),
            setOfflineStorage: (updater) => set((state) => ({
                offlineStorage: typeof updater === 'function' ? updater(state.offlineStorage) : updater
            })),
            setShortcuts: (updater) => set((state) => ({
                shortcuts: typeof updater === 'function' ? updater(state.shortcuts) : updater
            })),
            setIsSettingsLoaded: (loaded) => set({ isSettingsLoaded: loaded }),

            syncFromFirebase: (data) => {
                set((state) => {
                    const newAiSettings = data.aiSettings ? {
                        ...DEFAULT_AI_SETTINGS,
                        ...data.aiSettings,
                        identity: { ...DEFAULT_AI_SETTINGS.identity, ...(data.aiSettings.identity || {}) },
                        userContext: {
                            ...DEFAULT_AI_SETTINGS.userContext,
                            ...(data.aiSettings.userContext || {}),
                            memories: data.aiSettings.userContext?.memories || []
                        },
                        soul: { ...DEFAULT_AI_SETTINGS.soul, ...(data.aiSettings.soul || {}) }
                    } : state.aiSettings;

                    const newShortcuts = data.shortcuts ? { ...DEFAULT_SHORTCUTS, ...data.shortcuts } : state.shortcuts;
                    const newOfflineStorage = data.offlineStorage ? { ...DEFAULT_OFFLINE_STORAGE, ...data.offlineStorage } : state.offlineStorage;

                    if (data.customSubjectColors) {
                        useSubjectStore.getState().updateTheme(data.customSubjectColors);
                    }

                    return {
                        ...state,
                        ...(data.homeSubjects && { homeSubjects: data.homeSubjects }),
                        ...(data.defaultPlannerView && { defaultPlannerView: data.defaultPlannerView }),
                        ...(data.customSubjectColors && { customSubjectColors: data.customSubjectColors }),
                        aiSettings: newAiSettings as AISettings,
                        shortcuts: newShortcuts,
                        offlineStorage: newOfflineStorage
                    };
                });
            }
        }),
        {
            name: 'app-settings',
            partialize: (state) => ({
                homeSubjects: state.homeSubjects,
                defaultPlannerView: state.defaultPlannerView,
                customSubjectColors: state.customSubjectColors,
                aiSettings: state.aiSettings,
                offlineStorage: state.offlineStorage,
                shortcuts: state.shortcuts
            })
        }
    )
);
