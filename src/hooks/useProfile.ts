import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import type { CommunityPost } from '../types/community';

interface ExtendedUser {
    id: string;
    username: string;
    avatar?: string;
    banner?: string;
    bio?: string;
    portfolio?: string;
    role?: string;
    email?: string;
}

export function useProfile(username: string | undefined) {
    const { t } = useTranslation();
    const { user: authUser, isLoading: authLoading, updateUser } = useAuth();
    
    const isOwnProfile = Boolean(!username || (authUser && authUser.username === username));

    const [extendedUser, setExtendedUser] = useState<ExtendedUser | null>(null);
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
    const [isFetchingPosts, setIsFetchingPosts] = useState(true);
    const [lastPostDoc, setLastPostDoc] = useState<any>(null); // For pagination
    const [hasMorePosts, setHasMorePosts] = useState(true);

    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    // 1. Fetch User Data
    useEffect(() => {
        let isMounted = true;
        const fetchUserData = async () => {
            const targetUsername = username || authUser?.username;
            if (targetUsername) {
                setIsFetchingUser(true);
                const [{ db }, { doc, getDoc }] = await Promise.all([
                    import('../lib/firebase'),
                    import('firebase/firestore')
                ]);
                if (!isMounted) return;
                
                // 1. Cerca quin UID correspon a aquest username
                const usernameDoc = await getDoc(doc(db, 'usernames', targetUsername));
                let resolvedUid = null;
                
                if (usernameDoc.exists()) {
                    resolvedUid = usernameDoc.data().uid;
                }
                
                // 2. Si l'hem trobat, descarrega l'usuari complet
                if (resolvedUid && isMounted) {
                    const userDocSnap = await getDoc(doc(db, 'users', resolvedUid));
                    if (userDocSnap.exists()) {
                        setExtendedUser({ ...userDocSnap.data(), id: userDocSnap.id } as ExtendedUser);
                        setIsFetchingUser(false);
                        return; // Acabem amb èxit
                    }
                }
                
                if (!isMounted) return;

                // 3. Fallbacks
                if (isOwnProfile && authUser) {
                    setExtendedUser(authUser as ExtendedUser);
                } else {
                    setExtendedUser({
                        id: targetUsername,
                        username: targetUsername, // Changed to use targetUsername as fallback for better UX
                        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${targetUsername}`,
                    });
                }
                setIsFetchingUser(false);
            }
        };
        
        if (!authLoading) {
            fetchUserData();
        }

        return () => { isMounted = false; };
    }, [username, authUser, isOwnProfile, authLoading, t]);

    // 2. Fetch Initial Posts
    useEffect(() => {
        if (!extendedUser?.id) return;
        let isMounted = true;
        
        const fetchPosts = async () => {
            setIsFetchingPosts(true);
            try {
                const [{ db }, { collection, query, where, getDocs, orderBy, limit }] = await Promise.all([
                    import('../lib/firebase'),
                    import('firebase/firestore')
                ]);
                if (!isMounted) return;

                const q = query(
                    collection(db, 'community_posts'), 
                    where('userId', '==', extendedUser.id),
                    orderBy('createdAt', 'desc'),
                    limit(20)
                );
                const snapshot = await getDocs(q);
                
                if (!isMounted) return;

                const posts: CommunityPost[] = [];
                snapshot.forEach(doc => {
                    posts.push({ id: doc.id, ...doc.data() } as CommunityPost);
                });
                
                setUserPosts(posts);
                setLastPostDoc(snapshot.docs[snapshot.docs.length - 1]);
                setHasMorePosts(snapshot.docs.length === 20);

            } catch (err) {
                console.error("Error fetching user posts:", err);
            } finally {
                if (isMounted) setIsFetchingPosts(false);
            }
        };
        fetchPosts();
        return () => { isMounted = false; };
    }, [extendedUser?.id]);

    // 3. Load More Posts (Pagination)
    const loadMorePosts = useCallback(async () => {
        if (!extendedUser?.id || !lastPostDoc || !hasMorePosts) return;

        try {
            const [{ db }, { collection, query, where, getDocs, orderBy, limit, startAfter }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);

            const q = query(
                collection(db, 'community_posts'), 
                where('userId', '==', extendedUser.id),
                orderBy('createdAt', 'desc'),
                startAfter(lastPostDoc),
                limit(20)
            );
            const snapshot = await getDocs(q);
            
            const newPosts: CommunityPost[] = [];
            snapshot.forEach(doc => {
                newPosts.push({ id: doc.id, ...doc.data() } as CommunityPost);
            });

            setUserPosts(prev => [...prev, ...newPosts]);
            setLastPostDoc(snapshot.docs[snapshot.docs.length - 1]);
            setHasMorePosts(snapshot.docs.length === 20);

        } catch (err) {
            console.error("Error loading more posts:", err);
        }
    }, [extendedUser?.id, lastPostDoc, hasMorePosts]);

    // 4. Fetch Unread Messages & Notifications
    useEffect(() => {
        if (!isOwnProfile || !authUser) return;
        let isMounted = true;
        let unsubscribeMsg: (() => void) | undefined;
        let unsubscribeNotif: (() => void) | undefined;

        const setup = async () => {
            const [{ db }, { collection, query, where, onSnapshot }] = await Promise.all([
                import('../lib/firebase'),
                import('firebase/firestore')
            ]);
            
            if (!isMounted) return;

            const qMsg = query(collection(db, 'messages'), where('receiverId', '==', authUser.id), where('read', '==', false));
            unsubscribeMsg = onSnapshot(qMsg, (snapshot) => setUnreadCount(snapshot.size));

            const qNotif = query(collection(db, 'notifications'), where('userId', '==', authUser.id), where('read', '==', false));
            unsubscribeNotif = onSnapshot(qNotif, (snapshot) => setUnreadNotificationsCount(snapshot.size));
        };

        setup();
        return () => { 
            isMounted = false;
            if (unsubscribeMsg) unsubscribeMsg(); 
            if (unsubscribeNotif) unsubscribeNotif(); 
        };
    }, [isOwnProfile, authUser]);

    // Helper per fer updates batchkejats de 500 en 500
    const executeChunkedBatches = async (db: any, writeBatch: any, docs: any[], updateData: any) => {
        const CHUNK_SIZE = 500;
        for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
            const chunk = docs.slice(i, i + CHUNK_SIZE);
            const batch = writeBatch(db);
            chunk.forEach(doc => {
                batch.update(doc.ref, updateData);
            });
            await batch.commit();
        }
    };

    // 5. Update Profile (with chunked fan-out)
    const handleUpdateProfile = async (data: Partial<ExtendedUser>) => {
        if (!authUser?.id) return;
        const [{ db, auth }, { doc, setDoc, deleteDoc, getDoc, collection, collectionGroup, query, where, getDocs, writeBatch }, { updateProfile }] = await Promise.all([
            import('../lib/firebase'),
            import('firebase/firestore'),
            import('firebase/auth')
        ]);
        
        const userRef = doc(db, 'users', authUser.id);
        
        try {
            if (data.username && data.username !== authUser.username) {
                const newUsernameDoc = await getDoc(doc(db, 'usernames', data.username));
                if (newUsernameDoc.exists()) {
                    throw new Error("Aquest nom d'usuari ja està en ús. Tria'n un altre.");
                }
                
                await setDoc(doc(db, 'usernames', data.username), { uid: authUser.id, avatar: data.avatar || authUser.avatar || '' });
                
                if (authUser.username) {
                    try {
                        await deleteDoc(doc(db, 'usernames', authUser.username));
                    } catch (e) {
                        console.error("No s'ha pogut esborrar el username antic", e);
                    }
                }
            } else if (data.avatar && authUser.username) {
                await setDoc(doc(db, 'usernames', authUser.username), { uid: authUser.id, avatar: data.avatar }, { merge: true });
            }

            await setDoc(userRef, data, { merge: true });
            if (auth.currentUser && (data.username || data.avatar)) {
                await updateProfile(auth.currentUser, { 
                    displayName: data.username || auth.currentUser.displayName, 
                    photoURL: data.avatar || auth.currentUser.photoURL 
                });
            }

            // Fan-out updates (Client-side, chunked to prevent limits)
            if (data.avatar || data.username) {
                const updateData: any = {};
                if (data.avatar) updateData.userAvatar = data.avatar;
                if (data.username) updateData.username = data.username;

                try {
                    const postsQuery = query(collection(db, 'community_posts'), where('userId', '==', authUser.id));
                    const postsSnapshot = await getDocs(postsQuery);
                    await executeChunkedBatches(db, writeBatch, postsSnapshot.docs, updateData);
                } catch (batchError) {
                    console.error("Error updating past posts:", batchError);
                }

                try {
                    const repliesQuery = query(collectionGroup(db, 'replies'), where('userId', '==', authUser.id));
                    const repliesSnapshot = await getDocs(repliesQuery);
                    const replyUpdate = { ...updateData };
                    if (data.avatar) replyUpdate.fromUserAvatar = data.avatar;
                    await executeChunkedBatches(db, writeBatch, repliesSnapshot.docs, replyUpdate);
                } catch (e) {
                    console.warn("No s'ha pogut actualitzar els replies:", e);
                }

                try {
                    const commentsQuery = query(collectionGroup(db, 'comments'), where('userId', '==', authUser.id));
                    const commentsSnapshot = await getDocs(commentsQuery);
                    const commentUpdate = { ...updateData };
                    if (data.avatar) commentUpdate.fromUserAvatar = data.avatar;
                    await executeChunkedBatches(db, writeBatch, commentsSnapshot.docs, commentUpdate);
                } catch (e) {
                    console.warn("No s'ha pogut actualitzar els comentaris:", e);
                }
            }

            setExtendedUser((prev: ExtendedUser | null) => prev ? { ...prev, ...data } : null);
            updateUser(data);
            
            if (data.username !== authUser.username && data.username) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error instanceof Error ? error.message : "Error al guardar el perfil.");
            throw error;
        }
    };

    return {
        extendedUser,
        isFetchingUser,
        isOwnProfile,
        userPosts,
        isFetchingPosts,
        hasMorePosts,
        loadMorePosts,
        unreadCount,
        unreadNotificationsCount,
        handleUpdateProfile,
        setUserPosts // Utilitzat per esborrar posts
    };
}
