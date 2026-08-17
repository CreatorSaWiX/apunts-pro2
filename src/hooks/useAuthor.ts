import { useState, useEffect } from 'react';

interface AuthorData {
    avatar?: string;
    username?: string;
}

export const useAuthor = (authorId?: string) => {
    const [authorData, setAuthorData] = useState<AuthorData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchAuthor = async () => {
            if (!authorId) {
                if (isMounted) setAuthorData(null);
                return;
            }
            try {
                if (isMounted) setLoading(true);
                const { db } = await import('../lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const userDoc = await getDoc(doc(db, 'users', authorId));
                if (isMounted && userDoc.exists()) {
                    setAuthorData(userDoc.data() as AuthorData);
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
