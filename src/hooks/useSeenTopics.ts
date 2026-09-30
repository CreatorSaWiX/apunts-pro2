import { useState, useEffect, useCallback } from 'react';

/**
 * Encapsulates all localStorage logic for tracking which topics have been seen
 * (new/updated status). Eliminates the duplicated logic that existed in both
 * PortraitCarousel and LandscapeView.
 */
export function useSeenTopics() {
    const [seenNewTopics, setSeenNewTopics] = useState<string[]>([]);
    const [seenVersions, setSeenVersions] = useState<Record<string, number>>({});

    useEffect(() => {
        try {
            // Migració de claus antigues per no perdre el progrés de l'usuari
            const oldNew = localStorage.getItem('v1_seen-new-topics');
            if (oldNew && !localStorage.getItem('seen-new-topics')) {
                localStorage.setItem('seen-new-topics', oldNew);
                localStorage.removeItem('v1_seen-new-topics');
            }
            
            const oldVersions = localStorage.getItem('v1_seen-topic-versions');
            if (oldVersions && !localStorage.getItem('seen-topic-versions')) {
                localStorage.setItem('seen-topic-versions', oldVersions);
                localStorage.removeItem('v1_seen-topic-versions');
            }

            const savedNew = localStorage.getItem('seen-new-topics');
            if (savedNew) setSeenNewTopics(JSON.parse(savedNew));
            const savedVersions = localStorage.getItem('seen-topic-versions');
            if (savedVersions) setSeenVersions(JSON.parse(savedVersions));
        } catch (e) {
            console.debug('LocalStorage read silenced:', e);
        }
    }, []);

    const markAsSeen = useCallback((slug: string, version?: number) => {
        try {
            const savedNew = localStorage.getItem('seen-new-topics');
            const prevNew = savedNew ? JSON.parse(savedNew) : [];
            if (!prevNew.includes(slug)) {
                const updatedNew = [...prevNew, slug];
                localStorage.setItem('seen-new-topics', JSON.stringify(updatedNew));
            }

            if (version !== undefined) {
                const savedVersions = localStorage.getItem('seen-topic-versions');
                const prevVersions = savedVersions ? JSON.parse(savedVersions) : {};
                if (prevVersions[slug] !== version) {
                    const updatedVersions = { ...prevVersions, [slug]: version };
                    localStorage.setItem('seen-topic-versions', JSON.stringify(updatedVersions));
                }
            }
        } catch (e) {
            console.debug('LocalStorage write silenced:', e);
        }
    }, []);

    return { seenNewTopics, seenVersions, markAsSeen };
}
