import React, { useEffect, useState } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import type { Cursor } from '../../hooks/useMultiplayerCanvas';
import { MousePointer2 } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface MultiplayerCursorsProps {}

const MultiplayerCursors: React.FC<MultiplayerCursorsProps> = () => {
    const { user } = useAuth();
    const [cursors, setCursors] = useState<Record<string, Cursor>>({});

    // Sync Cursors from Firebase
    useEffect(() => {
        if (!user) return;
        const presenceRef = ref(rtdb, 'community_canvas/presence');
        const unsubscribe = onValue(presenceRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const activeCursors: Record<string, Cursor> = {};
                const now = Date.now();
                
                Object.keys(data).forEach(uid => {
                    if (uid !== user.id && (now - data[uid].updatedAt < 10000)) {
                        activeCursors[uid] = data[uid];
                    }
                });
                setCursors(activeCursors);
            } else {
                setCursors({});
            }
        });
        return () => unsubscribe();
    }, [user]);

    // Local interval to prune stale cursors when no Firebase updates arrive
    useEffect(() => {
        const interval = setInterval(() => {
            setCursors(prev => {
                const now = Date.now();
                let changed = false;
                const next: Record<string, Cursor> = {};
                Object.keys(prev).forEach(uid => {
                    if (now - prev[uid].updatedAt < 10000) {
                        next[uid] = prev[uid];
                    } else {
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {Object.entries(cursors).map(([uid, cursor]) => (
                <motion.g
                    key={uid}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: cursor.x, 
                        y: cursor.y 
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                        x: { type: "spring", stiffness: 400, damping: 28, mass: 0.5 },
                        y: { type: "spring", stiffness: 400, damping: 28, mass: 0.5 },
                        opacity: { duration: 0.2 }
                    }}
                >
                    {/* Glow effect */}
                    <circle r="12" fill={`${cursor.color}33`} filter="blur(6px)" />
                    
                    {/* Custom SVG pointer */}
                    <MousePointer2 
                        size={20} 
                        color={cursor.color} 
                        fill={cursor.color} 
                        className="drop-shadow-lg"
                        style={{ transform: 'translate(-4px, -4px)' }}
                    />
                    
                    {/* Nametag */}
                    <foreignObject x="15" y="15" width="120" height="30" style={{ overflow: 'visible' }}>
                        <div 
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap shadow-md inline-block"
                            style={{ backgroundColor: cursor.color }}
                        >
                            {cursor.username}
                        </div>
                    </foreignObject>
                </motion.g>
            ))}
        </AnimatePresence>
    );
};

export default MultiplayerCursors;
