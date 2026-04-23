import { Timestamp } from 'firebase/firestore';

export type PostRank = 0 | 1 | 2 | 3 | 4; 
// 0: Normal, 1: Featured, 2: Epic, 3: Legendary, 4: Mythic

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
    subject: string; // m1, m2, pro2, comunitari
    type: 'resource' | 'question' | 'link' | 'announcement';
    createdAt: Timestamp;
    reactions: Record<string, Reaction>; // Key is userId
    rank: PostRank;
    isPinned: boolean;
    reports?: number;
}
