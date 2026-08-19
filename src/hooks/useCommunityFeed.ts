import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import algoliasearch from 'algoliasearch/lite';
import type { CommunityPost } from '../types/community';
import { useAuth } from '../contexts/AuthContext';
import type { DocumentSnapshot } from 'firebase/firestore';

const POSTS_PER_PAGE = 24;

export const useCommunityFeed = (
    searchQuery: string,
    activeSubject: string,
    filterType: 'all' | 'pdf' | 'image' | 'code',
    sortBy: 'recent' | 'popular' | 'views' | 'liked',
    isOffline: boolean
) => {
    const { user } = useAuth();
    const searchClient = useMemo(() => algoliasearch(
        import.meta.env.VITE_ALGOLIA_APP_ID || '',
        import.meta.env.VITE_ALGOLIA_SEARCH_KEY || ''
    ), []);
    const algoliaIndex = useMemo(() => searchClient.initIndex('apunts_posts'), [searchClient]);

    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const observer = useRef<IntersectionObserver | null>(null);

    // Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Initial Fetch & Real-time Updates
    useEffect(() => {
        if (isOffline) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setHasMore(true);
        setPosts([]);
        let isCancelled = false;
        let unsubscribe = () => { };

        const setup = async () => {
            const [{ db }, { collection, query, orderBy, onSnapshot, where, limit, documentId }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);

            if (isCancelled) return;

            const currentLimit = debouncedSearch ? 30 : POSTS_PER_PAGE;
            let postIdsToFetch: string[] = [];

            if (debouncedSearch.trim()) {
                try {
                    const results = await algoliaIndex.search(debouncedSearch);
                    postIdsToFetch = results.hits.map(hit => hit.objectID);
                } catch (err) {
                    console.error("Algolia search failed", err);
                }

                if (isCancelled) return;
                if (postIdsToFetch.length === 0) {
                    setPosts([]);
                    setLoading(false);
                    setHasMore(false);
                    return;
                }
            }

            if (isCancelled) return;

            let q = query(collection(db, 'community_posts'), limit(currentLimit));

            if (debouncedSearch.trim()) {
                const chunk = postIdsToFetch.slice(0, 30);
                q = query(q, where(documentId(), 'in', chunk));
            } else {
                q = query(q, orderBy('isPinned', 'desc'), orderBy('createdAt', 'desc'));
                if (activeSubject !== 'all') {
                    q = query(q, where('subject', '==', activeSubject));
                }
            }

            unsubscribe = onSnapshot(q, (snapshot) => {
                if (isCancelled) return;
                const rawPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];

                if (debouncedSearch.trim()) {
                    rawPosts.sort((a, b) => postIdsToFetch.indexOf(a.id) - postIdsToFetch.indexOf(b.id));
                }

                setPosts(rawPosts);
                setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
                setHasMore(snapshot.docs.length === currentLimit);
                setLoading(false);
            });
        };

        setup();
        return () => {
            isCancelled = true;
            unsubscribe();
        };
    }, [activeSubject, debouncedSearch, isOffline, algoliaIndex]);

    // Infinite Scroll
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || !lastVisible || isOffline) return;
        if (debouncedSearch.trim()) return; 

        setLoadingMore(true);

        const [{ db }, { collection, query, orderBy, getDocs, where, limit, startAfter }] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/firestore')
        ]);

        const currentLimit = POSTS_PER_PAGE;

        let q = query(
            collection(db, 'community_posts'),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(currentLimit)
        );

        if (activeSubject !== 'all') {
            q = query(q, where('subject', '==', activeSubject));
        }

        const snapshot = await getDocs(q);
        const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityPost[];

        setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewPosts];
        });
        setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === currentLimit);
        setLoadingMore(false);
    }, [loadingMore, hasMore, lastVisible, activeSubject, debouncedSearch, isOffline]);

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMore]);

    // Cleanup observer
    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    // Filter & Sort Logic
    const filteredAndSortedPosts = useMemo(() => {
        let result = posts;

        if (filterType === 'pdf') {
            result = result.filter(p => p.attachments && p.attachments.some(att => att.type.includes('pdf') || att.name.toLowerCase().endsWith('.pdf')));
        } else if (filterType === 'image') {
            result = result.filter(p => p.attachments && p.attachments.some(att => att.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(att.name)));
        } else if (filterType === 'code') {
            result = result.filter(p => p.content.includes('```') || (p.attachments && p.attachments.some(att => /\.(cpp|c|py|js|ts|java|html|css|json)$/i.test(att.name))));
        }

        if (sortBy === 'liked') {
            if (user) {
                result = result.filter(p => p.reactions && p.reactions[user.id]?.emoji === '❤️');
            } else {
                result = [];
            }
        }

        if (sortBy === 'popular') {
            const withCounts = result.map(p => ({
                post: p,
                count: p.reactions ? Object.keys(p.reactions).length : 0
            }));
            withCounts.sort((a, b) => b.count - a.count);
            return withCounts.map(w => w.post);
        } else if (sortBy === 'views') {
            return [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        return result;
    }, [posts, filterType, sortBy, user]);

    // Auto-fetch if client-side filters hide all current chunk items (max 3 retries)
    const autoFetchCountRef = useRef(0);
    useEffect(() => {
        autoFetchCountRef.current = 0;
    }, [filterType, sortBy, activeSubject, searchQuery]);

    useEffect(() => {
        if (!loading && !loadingMore && hasMore && posts.length > 0 && filteredAndSortedPosts.length === 0) {
            if (autoFetchCountRef.current >= 3) return;
            autoFetchCountRef.current++;
            const t = setTimeout(() => {
                loadMore();
            }, 100);
            return () => clearTimeout(t);
        }
    }, [filteredAndSortedPosts.length, loading, loadingMore, hasMore, posts.length, loadMore]);

    return {
        posts,
        loading,
        loadingMore,
        hasMore,
        debouncedSearch,
        filteredAndSortedPosts,
        loadMore,
        lastPostRef
    };
};
