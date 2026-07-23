import { Timestamp } from 'firebase/firestore';

export interface Reaction {
    userId: string;
    username: string;
    emoji: string;
}

export interface PostReply {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    content: string;
    createdAt: Timestamp;
}

export interface CommunityPost {
    id: string;
    userId: string;
    username: string;
    userAvatar: string;
    content: string;
    subject: string; 
    createdAt: Timestamp;
    reactions: Record<string, Reaction>; // Key is userId
    isPinned: boolean;
    views?: number;
    attachments?: { url: string; name: string; type: string; size: number; thumbnailUrl?: string }[];
}

