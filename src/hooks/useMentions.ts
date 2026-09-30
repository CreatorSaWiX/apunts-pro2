import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { resolveMediaUrl } from '../lib/mediaUtils';

export interface UserMention {
    id: string;
    username: string;
    avatar: string;
}

export const useMentions = () => {
    const { user, isLoading } = useAuth();
    const [allUsers, setAllUsers] = useState<UserMention[]>([]);
    const [mentionSearch, setMentionSearch] = useState<{ query: string, startIdx: number } | null>(null);

    useEffect(() => {
        if (!user || isLoading) return;
        
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                const snap = await getDocs(query(collection(db, 'usernames'), limit(200)));
                if (!isMounted) return;
                setAllUsers(snap.docs.map(doc => {
                    const rawAvatar = doc.data().avatar;
                    return { 
                        id: doc.data().uid, 
                        username: doc.id, 
                        avatar: resolveMediaUrl(rawAvatar) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(doc.id)}` 
                    };
                }));
            } catch (err) {
                console.error("Error fetching users for mentions", err);
            }
        };
        fetchUsers();
        return () => { isMounted = false; };
    }, [user, isLoading]);

    const handleInputChange = (val: string, cursorPosition: number) => {
        const textBeforeCursor = val.substring(0, cursorPosition);
        const match = textBeforeCursor.match(/(?:^|[\s\n(])@([a-zA-Z0-9_]*)$/);

        if (match) {
            const atIndex = textBeforeCursor.lastIndexOf('@');
            setMentionSearch({ query: match[1], startIdx: atIndex });
        } else {
            setMentionSearch(null);
        }
    };

    const insertMention = (currentText: string, username: string) => {
        if (!mentionSearch) return currentText;
        const before = currentText.substring(0, mentionSearch.startIdx);
        const after = currentText.substring(mentionSearch.startIdx + mentionSearch.query.length + 1);
        setMentionSearch(null);
        return `${before}@${username} ${after}`;
    };

    const getMentionedUsers = (text: string, currentUserId?: string) => {
        const matches = text.match(/@([a-zA-Z0-9_]+)/g);
        if (!matches || matches.length === 0) return [];
        const mentionedSet = new Set(matches.map(u => u.substring(1)));
        return allUsers.filter(u => mentionedSet.has(u.username) && u.id !== currentUserId);
    };

    const suggestedUsers = mentionSearch 
        ? allUsers
            .filter(u => u.username.toLowerCase().includes(mentionSearch.query.toLowerCase()))
            .sort((a, b) => {
                const q = mentionSearch.query.toLowerCase();
                const aStarts = a.username.toLowerCase().startsWith(q);
                const bStarts = b.username.toLowerCase().startsWith(q);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return a.username.localeCompare(b.username);
            })
            .slice(0, 6)
        : [];

    return {
        mentionSearch,
        setMentionSearch,
        handleInputChange,
        insertMention,
        getMentionedUsers,
        suggestedUsers
    };
};
