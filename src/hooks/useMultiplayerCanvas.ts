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

// Lazy-cached firebase/database module and RTDB instance
let _dbModule: typeof import('firebase/database') | null = null;
let _rtdbInstance: any = null;

const getDbModule = async () => {
    if (!_dbModule) _dbModule = await import('firebase/database');
    return _dbModule;
};

const getRtdbInstance = async () => {
    if (!_rtdbInstance) _rtdbInstance = await getRtdb();
    return _rtdbInstance;
};

export const useMultiplayerCanvas = (
    strokes: Stroke[],
    setStrokes: React.Dispatch<React.SetStateAction<Stroke[]>>,
    currentColor: string
) => {
    const { user } = useAuth();
    const localStrokesRef = useRef<Set<string>>(new Set());
    const dbRef = useRef<{ rtdb: any; db: typeof import('firebase/database') } | null>(null);

    // Warm up RTDB and Database module references
    useEffect(() => {
        let isMounted = true;
        Promise.all([getRtdbInstance(), getDbModule()]).then(([rtdb, db]) => {
            if (isMounted) {
                dbRef.current = { rtdb, db };
                if (user) {
                    const presenceRef = db.ref(rtdb, `community_canvas/presence/${user.id}`);
                    db.onDisconnect(presenceRef).remove().catch(console.error);
                }
            }
        }).catch(console.error);
        return () => { isMounted = false; };
    }, [user]);

    // Throttle cursor updates
    const lastUpdate = useRef(0);
    const updateCursor = useCallback(async (x: number, y: number) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastUpdate.current > 50) { // ~20fps to reduce network load
            lastUpdate.current = now;
            let current = dbRef.current;
            if (!current) {
                const [rtdb, db] = await Promise.all([getRtdbInstance(), getDbModule()]);
                current = { rtdb, db };
                dbRef.current = current;
            }
            const { rtdb, db } = current;
            db.set(db.ref(rtdb, `community_canvas/presence/${user.id}`), {
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
                const current = dbRef.current || { rtdb: await getRtdbInstance(), db: await getDbModule() };
                current.db.remove(current.db.ref(current.rtdb, `community_canvas/presence/${user.id}`)).catch(console.error);
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
        const current = dbRef.current || { rtdb: await getRtdbInstance(), db: await getDbModule() };
        current.db.set(current.db.ref(current.rtdb, `community_canvas/strokes/${stroke.id}`), stroke).catch(console.error);
    }, [user]);

    const lastLiveStrokeUpdate = useRef(0);
    const broadcastLiveStroke = useCallback(async (stroke: Stroke) => {
        if (!user) return;
        const now = Date.now();
        if (now - lastLiveStrokeUpdate.current > 50) { // ~20fps throttle
            lastLiveStrokeUpdate.current = now;
            const current = dbRef.current || { rtdb: await getRtdbInstance(), db: await getDbModule() };
            current.db.set(current.db.ref(current.rtdb, `community_canvas/strokes/${stroke.id}`), stroke).catch(console.error);
        }
    }, [user]);

    const broadcastClear = useCallback(async () => {
        if (!user) return;
        const current = dbRef.current || { rtdb: await getRtdbInstance(), db: await getDbModule() };
        const { ref, remove, set, serverTimestamp } = current.db;
        remove(ref(current.rtdb, 'community_canvas/strokes')).catch(console.error);
        set(ref(current.rtdb, 'community_canvas/meta/lastClearedAt'), serverTimestamp()).catch(console.error);
    }, [user]);

    const broadcastRemoveStroke = useCallback(async (id: string) => {
        if (!user) return;
        const current = dbRef.current || { rtdb: await getRtdbInstance(), db: await getDbModule() };
        current.db.remove(current.db.ref(current.rtdb, `community_canvas/strokes/${id}`)).catch(console.error);
    }, [user]);

    return { updateCursor, broadcastStroke, broadcastLiveStroke, broadcastClear, broadcastRemoveStroke };
};
