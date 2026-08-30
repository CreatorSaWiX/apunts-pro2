import { useEffect, useState, useRef, useCallback } from 'react';
import { rtdb } from '../lib/firebase';
import { ref, onValue, set, push, onChildAdded, onChildRemoved, onChildChanged, remove, serverTimestamp } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import type { Stroke } from '../contexts/DrawContext';

export interface Cursor {
    x: number;
    y: number;
    color: string;
    username: string;
    updatedAt: number;
}

export const useMultiplayerCanvas = (
    strokes: Stroke[],
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
    currentColor: string
) => {
    const { user } = useAuth();
    const localStrokesRef = useRef<Set<string>>(new Set());



    // Throttle cursor updates
    const lastUpdate = useRef(0);
    const updateCursor = useCallback((x: number, y: number) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastUpdate.current > 50) { // ~20fps to reduce network load
            lastUpdate.current = now;
            set(ref(rtdb, `community_canvas/presence/${user.id}`), {
                x,
                y,
                color: currentColor,
                username: user.username || 'Anon',
                updatedAt: Date.now()
            }).catch(console.error);
        }
    }, [user, currentColor]);

    // Cleanup cursor on unmount
    useEffect(() => {
        const cleanup = () => {
            if (user) remove(ref(rtdb, `community_canvas/presence/${user.id}`));
        };
        window.addEventListener('beforeunload', cleanup);
        return () => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [user]);

    // Sync Completed Strokes
    useEffect(() => {
        if (!user) return;

        const strokesRef = ref(rtdb, 'community_canvas/strokes');

        // Batch incoming strokes to avoid render thrashing during initial load or bulk inserts
        let pendingStrokes: Stroke[] = [];
        let batchRafId: number | null = null;

        const unsubscribeAdded = onChildAdded(strokesRef, (snapshot) => {
            if (snapshot.exists() && snapshot.key) {
                const newStroke = { ...snapshot.val(), id: snapshot.key } as Stroke;
                if (!localStrokesRef.current.has(newStroke.id)) {
                    pendingStrokes.push(newStroke);
                    localStrokesRef.current.add(newStroke.id);
                    
                    if (batchRafId) cancelAnimationFrame(batchRafId);
                    batchRafId = requestAnimationFrame(() => {
                        setStrokes(prev => [...prev, ...pendingStrokes]);
                        pendingStrokes = [];
                    });
                }
            }
        });

        // Listen for cleared strokes
        const unsubscribeRemoved = onChildRemoved(strokesRef, (snapshot) => {
             if (snapshot.exists() && snapshot.key) {
                 setStrokes(prev => prev.filter(s => s.id !== snapshot.key));
                 localStrokesRef.current.delete(snapshot.key);
             }
        });
        
        // Listen for changed strokes (live drawing)
        const unsubscribeChanged = onChildChanged(strokesRef, (snapshot) => {
            if (snapshot.exists() && snapshot.key) {
                const updatedStroke = { ...snapshot.val(), id: snapshot.key } as Stroke;
                setStrokes(prev => prev.map(s => s.id === updatedStroke.id ? updatedStroke : s));
            }
        });

        // Listen for full clear via lightweight metadata node instead of downloading all strokes on every change
        let isInitialMeta = true;
        const metaRef = ref(rtdb, 'community_canvas/meta/lastClearedAt');
        const unsubscribeMeta = onValue(metaRef, (snapshot) => {
            if (isInitialMeta) {
                isInitialMeta = false;
                return;
            }
            setStrokes([]);
            localStrokesRef.current.clear();
        });

        return () => {
            unsubscribeAdded();
            unsubscribeRemoved();
            unsubscribeChanged();
            unsubscribeMeta();
        };
    }, [user, setStrokes]);

    const broadcastStroke = useCallback((stroke: Stroke) => {
        if (!user) return;
        localStrokesRef.current.add(stroke.id);
        const strokesRef = ref(rtdb, `community_canvas/strokes/${stroke.id}`);
        set(strokesRef, stroke).catch(console.error);
    }, [user]);

    const lastLiveStrokeUpdate = useRef(0);
    const broadcastLiveStroke = useCallback((stroke: Stroke) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastLiveStrokeUpdate.current > 50) { // ~20fps throttle
            lastLiveStrokeUpdate.current = now;
            const strokesRef = ref(rtdb, `community_canvas/strokes/${stroke.id}`);
            set(strokesRef, stroke).catch(console.error);
        }
    }, [user]);

    const broadcastClear = useCallback(() => {
        if (!user) return;
        remove(ref(rtdb, 'community_canvas/strokes')).catch(console.error);
        set(ref(rtdb, 'community_canvas/meta/lastClearedAt'), serverTimestamp()).catch(console.error);
    }, [user]);

    const broadcastRemoveStroke = useCallback((id: string) => {
        if (!user) return;
        remove(ref(rtdb, `community_canvas/strokes/${id}`)).catch(console.error);
    }, [user]);

    return { updateCursor, broadcastStroke, broadcastLiveStroke, broadcastClear, broadcastRemoveStroke };
};
