import { useEffect, useState, useRef, useCallback } from 'react';
import { getRtdb } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Stroke } from '../contexts/DrawContext';

export interface Cursor {
    x: number;
    y: number;
    color: string;
    username: string;
    updatedAt: number;
}

// Lazy-cached firebase/database module
let _dbModule: typeof import('firebase/database') | null = null;
const getDbModule = async () => {
    if (!_dbModule) _dbModule = await import('firebase/database');
    return _dbModule;
};

export const useMultiplayerCanvas = (
    strokes: Stroke[],
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
    currentColor: string
) => {
    const { user } = useAuth();
    const localStrokesRef = useRef<Set<string>>(new Set());



    // Throttle cursor updates
    const lastUpdate = useRef(0);
    const updateCursor = useCallback(async (x: number, y: number) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastUpdate.current > 50) { // ~20fps to reduce network load
            lastUpdate.current = now;
            const rtdb = await getRtdb();
            const { ref, set } = await getDbModule();
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
        const cleanup = async () => {
            if (user) {
                const rtdb = await getRtdb();
                const { ref, remove } = await getDbModule();
                remove(ref(rtdb, `community_canvas/presence/${user.id}`));
            }
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
        let cancelled = false;
        const unsubscribers: (() => void)[] = [];

        const setup = async () => {
            const rtdb = await getRtdb();
            if (cancelled) return;
            const { ref, onValue, onChildAdded, onChildRemoved, onChildChanged } = await getDbModule();
            if (cancelled) return;

            const strokesRef = ref(rtdb, 'community_canvas/strokes');

            // Batch incoming strokes to avoid render thrashing during initial load or bulk inserts
            let pendingStrokes: Stroke[] = [];
            let batchRafId: number | null = null;

            unsubscribers.push(onChildAdded(strokesRef, (snapshot) => {
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
            }));

            // Listen for cleared strokes
            unsubscribers.push(onChildRemoved(strokesRef, (snapshot) => {
                 if (snapshot.exists() && snapshot.key) {
                     setStrokes(prev => prev.filter(s => s.id !== snapshot.key));
                     localStrokesRef.current.delete(snapshot.key);
                 }
            }));
            
            // Listen for changed strokes (live drawing)
            unsubscribers.push(onChildChanged(strokesRef, (snapshot) => {
                if (snapshot.exists() && snapshot.key) {
                    const updatedStroke = { ...snapshot.val(), id: snapshot.key } as Stroke;
                    setStrokes(prev => prev.map(s => s.id === updatedStroke.id ? updatedStroke : s));
                }
            }));

            // Listen for full clear via lightweight metadata node
            let isInitialMeta = true;
            const metaRef = ref(rtdb, 'community_canvas/meta/lastClearedAt');
            unsubscribers.push(onValue(metaRef, (snapshot) => {
                if (isInitialMeta) {
                    isInitialMeta = false;
                    return;
                }
                setStrokes([]);
                localStrokesRef.current.clear();
            }));
        };

        setup();
        return () => {
            cancelled = true;
            unsubscribers.forEach(fn => fn());
        };
    }, [user, setStrokes]);

    const broadcastStroke = useCallback(async (stroke: Stroke) => {
        if (!user) return;
        localStrokesRef.current.add(stroke.id);
        const rtdb = await getRtdb();
        const { ref, set } = await getDbModule();
        set(ref(rtdb, `community_canvas/strokes/${stroke.id}`), stroke).catch(console.error);
    }, [user]);

    const lastLiveStrokeUpdate = useRef(0);
    const broadcastLiveStroke = useCallback(async (stroke: Stroke) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastLiveStrokeUpdate.current > 50) { // ~20fps throttle
            lastLiveStrokeUpdate.current = now;
            const rtdb = await getRtdb();
            const { ref, set } = await getDbModule();
            set(ref(rtdb, `community_canvas/strokes/${stroke.id}`), stroke).catch(console.error);
        }
    }, [user]);

    const broadcastClear = useCallback(async () => {
        if (!user) return;
        const rtdb = await getRtdb();
        const { ref, remove, set, serverTimestamp } = await getDbModule();
        remove(ref(rtdb, 'community_canvas/strokes')).catch(console.error);
        set(ref(rtdb, 'community_canvas/meta/lastClearedAt'), serverTimestamp()).catch(console.error);
    }, [user]);

    const broadcastRemoveStroke = useCallback(async (id: string) => {
        if (!user) return;
        const rtdb = await getRtdb();
        const { ref, remove } = await getDbModule();
        remove(ref(rtdb, `community_canvas/strokes/${id}`)).catch(console.error);
    }, [user]);

    return { updateCursor, broadcastStroke, broadcastLiveStroke, broadcastClear, broadcastRemoveStroke };
};
