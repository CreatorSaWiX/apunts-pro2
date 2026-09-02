import { useMemo } from 'react';
import type { PersonalNote } from 'content-collections';

/**
 * useTopicNotes — Shared hook that computes sorted topics and topic metadata
 * for all carousel variants (desktop, mobile portrait, mobile landscape).
 * 
 * Replaces the previously duplicated logic (3 copies) and fixes the O(N²) 
 * nested filter by pre-computing a slug→languages Map for O(1) lookups.
 * 
 * Complexity: O(N) where N = total personal notes
 */
export const useTopicNotes = (
    allPersonalNotes: PersonalNote[],
    subject: string,
    preferredLang: string
) => {
    return useMemo(() => {
        // Pass 1: Pre-compute metadata and available languages per slug — O(N)
        const meta = new Map<string, { hasNew: boolean; newestUpdate: number }>();
        const langsBySlug = new Map<string, Set<string>>();

        for (const note of allPersonalNotes) {
            // Build metadata map
            const existing = meta.get(note.slug);
            if (!existing) {
                meta.set(note.slug, { hasNew: !!note.isNew, newestUpdate: note.isUpdated || 0 });
            } else {
                if (note.isNew) existing.hasNew = true;
                const upd = note.isUpdated || 0;
                if (upd > existing.newestUpdate) existing.newestUpdate = upd;
            }

            // Build slug → available languages map (only non-draft)
            if (!note.draft) {
                if (!langsBySlug.has(note.slug)) langsBySlug.set(note.slug, new Set());
                langsBySlug.get(note.slug)!.add(note.lang);
            }
        }

        // Pass 2: Filter and sort — O(N) with O(1) slug lookup
        const topics = allPersonalNotes
            .filter(note => {
                const isMatch = note.subject === subject && !note.slug.includes('-lab-');
                if (!isMatch) return false;
                if (note.draft) return false;

                // Deduplicate by language using pre-computed Map — O(1) lookup
                const availableLangs = langsBySlug.get(note.slug);
                const hasPreferred = availableLangs?.has(preferredLang) ?? false;

                return hasPreferred ? note.lang === preferredLang : note.lang === 'ca';
            })
            .sort((a, b) => a.order - b.order);

        return { sortedTopics: topics, topicMeta: meta };
    }, [subject, preferredLang, allPersonalNotes]);
};
