
import { useEffect, useState, useRef } from 'react';
import { Activity, Cpu, Database, Zap, Monitor, Minimize2, Server } from 'lucide-react';

export const PerformanceMonitor = () => {
    const [stats, setStats] = useState({
        fps: 0,
        memory: 0,
        domNodes: 0,
        dpr: 0,
        cpuLoad: 0
    });
    const [isOpen, setIsOpen] = useState(true);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const frameTime = useRef(0);

    // For CPU main thread load estimation
    const idleTimeInSecond = useRef(0);

    useEffect(() => {
        let animationFrameId: number;
        let idleCallbackId: number;

        // Estimate CPU Load using requestIdleCallback to measure free time on the main thread
        const measureIdle = (deadline: IdleDeadline) => {
            idleTimeInSecond.current += deadline.timeRemaining();
            idleCallbackId = window.requestIdleCallback(measureIdle);
        };

        if ('requestIdleCallback' in window) {
            idleCallbackId = window.requestIdleCallback(measureIdle);
        }

        const loop = (time: number) => {
            frameCount.current++;
            const delta = time - lastTime.current;

            if (delta >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / delta);

                // Memory (Chrome only)
                // @ts-ignore
                const memory = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0;

                // DOM Nodes
                const domNodes = document.getElementsByTagName('*').length;

                // Calculate CPU Load (%) based on idle time.
                // Out of 1000ms, how much was the main thread idle?
                // The rest is busy time (Load).
                let load = 0;
                if ('requestIdleCallback' in window) {
                    const idleRatio = Math.min(1, Math.max(0, idleTimeInSecond.current / delta));
                    load = Math.round((1 - idleRatio) * 100);
                } else {
                    // Fallback approximation if no requestIdleCallback (Safari):
                    // Lower FPS = Higher Load approximation
                    load = Math.max(0, Math.round(100 - (fps / 60) * 100));
                }

                setStats({
                    fps,
                    memory,
                    domNodes,
                    dpr: window.devicePixelRatio || 1,
                    cpuLoad: load
                });

                frameCount.current = 0;
                lastTime.current = time;
                idleTimeInSecond.current = 0;
            }

            frameTime.current = time;
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if ('cancelIdleCallback' in window) cancelIdleCallback(idleCallbackId);
        };
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[9999] bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-white/10 text-emerald-400 hover:bg-slate-800 transition-all shadow-lg"
            >
                <Activity size={20} />
            </button>
        );
    }

    return (
        <div className="fixed top-20 right-4 z-[9999] w-64 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl font-mono text-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Activity size={14} className="text-emerald-400" />
                    <span>PERF MONITOR</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white">
                        <Minimize2 size={12} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">

                {/* Main Thread CPU Load */}
                <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                        <div className="flex items-center gap-1.5"><Cpu size={12} /> CPU (Main Thread)</div>
                        <span className={stats.cpuLoad > 80 ? 'text-red-400 font-bold' : (stats.cpuLoad > 50 ? 'text-yellow-400' : 'text-emerald-400')}>
                            {stats.cpuLoad}%
                        </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${stats.cpuLoad > 80 ? 'bg-red-500' : (stats.cpuLoad > 50 ? 'bg-yellow-500' : 'bg-emerald-500')}`}
                            style={{ width: `${Math.min(stats.cpuLoad, 100)}%` }}
                        />
                    </div>
                </div>

                {/* FPS */}
                <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                        <div className="flex items-center gap-1.5"><Zap size={12} /> FPS</div>
                        <span className={stats.fps < 30 ? 'text-red-400 font-bold' : (stats.fps < 55 ? 'text-yellow-400' : 'text-emerald-400')}>
                            {stats.fps}
                        </span>
                    </div>
                </div>

                {/* Memory */}
                <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                        <div className="flex items-center gap-1.5"><Database size={12} /> RAM (JS Heap)</div>
                        <span className="text-sky-400">{stats.memory > 0 ? `${stats.memory} MB` : 'N/A'}</span>
                    </div>
                </div>

                {/* DOM Nodes */}
                <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                        <div className="flex items-center gap-1.5"><Server size={12} /> DOM NODES</div>
                        <span className={stats.domNodes > 1500 ? 'text-yellow-400' : 'text-slate-200'}>
                            {stats.domNodes}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                        <Monitor size={10} />
                        DPR: {stats.dpr}x
                    </div>
                    <div className="text-right">
                        React v19
                    </div>
                </div>
            </div>
        </div>
    );
};
