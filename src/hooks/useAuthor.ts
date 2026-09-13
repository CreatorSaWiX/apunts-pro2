import { useState, useEffect } from 'react';

interface AuthorData {
    avatar?: string;
    username?: string;
}

const authorCache = new Map<string, AuthorData>();

export const useAuthor = (authorId?: string) => {
    const [authorData, setAuthorData] = useState<AuthorData | null>(() => {
        return authorId && authorCache.has(authorId) ? authorCache.get(authorId)! : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchAuthor = async () => {
            if (!authorId) {
                if (isMounted) setAuthorData(null);
                return;
            }

            if (authorCache.has(authorId)) {
                if (isMounted) {
                    setAuthorData(authorCache.get(authorId)!);
                    setLoading(false);
                }
                return;
            }

            try {
                if (isMounted) setLoading(true);
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const userDoc = await getDoc(doc(db, 'users', authorId));
                if (isMounted && userDoc.exists()) {
                    const data = userDoc.data() as AuthorData;
                    authorCache.set(authorId, data);
                    setAuthorData(data);
                } else if (isMounted) {
                    setAuthorData(null);
                }
            } catch (e) {
                console.error("Error fetching author:", e);
                if (isMounted) setAuthorData(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchAuthor();
        return () => {
            isMounted = false;
        };
    }, [authorId]);

    return { authorData, loading };
};
