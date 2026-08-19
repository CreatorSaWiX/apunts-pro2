import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

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
                const snap = await getDocs(collection(db, 'usernames'));
                if (!isMounted) return;
                setAllUsers(snap.docs.map(doc => ({ 
                    id: doc.data().uid, 
                    username: doc.id, 
                    avatar: doc.data().avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.id}` 
                })));
            } catch (err) {
                console.error("Error fetching users for mentions", err);
            }
        };
        fetchUsers();
        return () => { isMounted = false; };
    }, [user, isLoading]);

    const handleInputChange = (val: string, cursorPosition: number) => {
        const textBeforeCursor = val.substring(0, cursorPosition);
        const match = textBeforeCursor.match(/@([a-zA-Z0-9_]*)$/);

        if (match) {
            setMentionSearch({ query: match[1], startIdx: match.index! });
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
        const mentionedUsernames = Array.from(new Set(text.match(/@([a-zA-Z0-9_]+)/g)?.map(u => u.substring(1)) || []));
        return allUsers.filter(u => mentionedUsernames.includes(u.username) && u.id !== currentUserId);
    };

    const suggestedUsers = mentionSearch 
        ? allUsers.filter(u => u.username.toLowerCase().includes(mentionSearch.query.toLowerCase())).slice(0, 5)
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
