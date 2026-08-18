import { useState } from 'react';
import type { CommunityPost } from '../types/community';

export function useCommunityUI() {
    // UI State
    const [activeSubject, setActiveSubject] = useState<string>('all');
    const [showSubjectFilter, setShowSubjectFilter] = useState(false);
    const [showMobileFiltersMenu, setShowMobileFiltersMenu] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [postToEdit, setPostToEdit] = useState<CommunityPost | null>(null);

    // Filters & Sort State
    const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image' | 'code'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views' | 'liked'>('recent');
    const [searchQuery, setSearchQuery] = useState('');

    return {
        activeSubject, setActiveSubject,
        showSubjectFilter, setShowSubjectFilter,
        showMobileFiltersMenu, setShowMobileFiltersMenu,
        isCreateOpen, setIsCreateOpen,
        selectedPost, setSelectedPost,
        postToEdit, setPostToEdit,
        filterType, setFilterType,
        sortBy, setSortBy,
        searchQuery, setSearchQuery
    };
}
