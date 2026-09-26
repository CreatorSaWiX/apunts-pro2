import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { PersonalNote } from 'content-collections';
import { DEFAULT_HOME_SUBJECTS } from '../stores/useSettingsStore';

// In-memory module cache so content-collections chunk is only loaded once across the entire application lifecycle
let cachedNotesPromise: Promise<PersonalNote[]> | null = null;
let cachedNotes: PersonalNote[] | null = null;

export const loadAllPersonalNotes = async (): Promise<PersonalNote[]> => {
    if (cachedNotes) return cachedNotes;
    if (!cachedNotesPromise) {
        cachedNotesPromise = import('content-collections')
            .then(m => {
                cachedNotes = (m.allPersonalNotes || []) as PersonalNote[];
                return cachedNotes;
            })
            .catch(err => {
                console.error('Failed to load content-collections in useAvailableSubjects:', err);
                cachedNotesPromise = null;
                return [];
            });
    }
    return cachedNotesPromise;
};

/**
 * Computes the Set of available subject names in a single O(N) pass.
 * An assignatura is available if it contains at least one non-draft note
 * in the active language (or fallback to Catalan if the active language is not Catalan).
 */
export const getAvailableSubjectNames = (
    notes: PersonalNote[],
    targetLang: string = 'ca'
): Set<string> => {
    const available = new Set<string>();
    if (!notes || notes.length === 0) return available;

    const normalizedLang = (targetLang || 'ca').toLowerCase();

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (note.draft) continue;

        const noteLang = (note.lang || '').toLowerCase();
        const noteSubject = (note.subject || '').toLowerCase();
        if (!noteSubject) continue;

        if (noteLang === normalizedLang) {
            available.add(noteSubject);
        } else if (normalizedLang !== 'ca' && noteLang === 'ca') {
            // Non-Catalan interfaces can fallback to Catalan notes
            available.add(noteSubject);
        }
    }
    return available;
};

export interface UseAvailableSubjectsReturn {
    allPersonalNotes: PersonalNote[];
    availableSubjectNames: Set<string>;
    isLoaded: boolean;
    isSubjectAvailable: (subjectName?: string | null) => boolean;
    sanitizeSubjects: (subjects: string[]) => string[];
}

/**
 * Hook to efficiently manage and query available subjects across the application.
 * Complexity: O(N) single-pass computation on notes load, followed by O(1) membership lookups.
 */
export const useAvailableSubjects = (langOverride?: string): UseAvailableSubjectsReturn => {
    const { i18n } = useTranslation();
    const currentLang = (langOverride || i18n.resolvedLanguage || i18n.language || 'ca').split('-')[0].toLowerCase();
    
    const [allPersonalNotes, setAllPersonalNotes] = useState<PersonalNote[]>(() => cachedNotes || []);
    const [isLoaded, setIsLoaded] = useState<boolean>(() => cachedNotes !== null);

    useEffect(() => {
        let isMounted = true;
        loadAllPersonalNotes().then(notes => {
            if (isMounted) {
                setAllPersonalNotes(notes);
                setIsLoaded(true);
            }
        });
        return () => { isMounted = false; };
    }, []);

    // O(N) memoized computation of available subject names
    const availableSubjectNames = useMemo(() => {
        return getAvailableSubjectNames(allPersonalNotes, currentLang);
    }, [allPersonalNotes, currentLang]);

    // O(1) membership check
    const isSubjectAvailable = useCallback((subjectName?: string | null): boolean => {
        if (!subjectName) return false;
        // If notes are not yet loaded, return true temporarily to prevent layout flash
        if (!isLoaded || availableSubjectNames.size === 0) return true;
        return availableSubjectNames.has(subjectName.toLowerCase());
    }, [availableSubjectNames, isLoaded]);

    // Fast O(K) sanitization of subject lists (e.g. homeSubjects)
    const sanitizeSubjects = useCallback((subjects: string[]): string[] => {
        if (!isLoaded || availableSubjectNames.size === 0) return subjects;
        const valid = subjects.filter(s => availableSubjectNames.has(s.toLowerCase()));
        if (valid.length > 0) return valid;

        const defaultValid = DEFAULT_HOME_SUBJECTS.filter(s => availableSubjectNames.has(s.toLowerCase()));
        return defaultValid.length > 0 ? defaultValid : Array.from(availableSubjectNames).slice(0, 5).map(s => s.toUpperCase());
    }, [availableSubjectNames, isLoaded]);

    return {
        allPersonalNotes,
        availableSubjectNames,
        isLoaded,
        isSubjectAvailable,
        sanitizeSubjects
    };
};
