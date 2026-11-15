"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type StepMode = 'open' | 'dup2' | 'close';
type HoverItem = 'fd0' | 'fd1' | 'fd3' | 'tfo0' | 'tfo1' | null;

const PATH_FD0_TFO0 = "M 135 40 C 235 40, 265 47, 365 47";
const PATH_FD1_TFO0 = "M 135 78 C 235 78, 265 59, 365 59";
const PATH_FD1_TFO1 = "M 135 78 C 235 78, 265 107, 365 107";
const PATH_FD3_TFO1 = "M 135 116 C 235 116, 265 119, 365 119";

export default function Dup2Viz() {
    const [step, setStep] = useState<StepMode>('open');
    const [hovered, setHovered] = useState<HoverItem>(null);

    const tfo0Refs = step === 'open' ? 2 : 1;
    const tfo1Refs = step === 'dup2' ? 2 : 1;

    const fd1PointsToTfo1 = step !== 'open';
    const fd3Closed = step === 'close';

    const activeFd1Path = fd1PointsToTfo1 ? PATH_FD1_TFO1 : PATH_FD1_TFO0;
    const activeFd1Color = fd1PointsToTfo1 ? '#34d399' : '#38bdf8';

    const isNodeFaded = (node: Exclude<HoverItem, null>) => {
        if (!hovered) return false;
        if (hovered === node) return false;
        switch (hovered) {
            case 'fd0':
                return node !== 'tfo0';
            case 'fd1':
                return node !== (fd1PointsToTfo1 ? 'tfo1' : 'tfo0');
            case 'fd3':
                return node !== 'tfo1';
            case 'tfo0':
                return !(node === 'fd0' || (node === 'fd1' && !fd1PointsToTfo1));
            case 'tfo1':
                return !(
                    (node === 'fd1' && fd1PointsToTfo1) ||
                    (node === 'fd3' && !fd3Closed)
                );
        }
    };

    const isPathFaded = (link: 'fd0' | 'fd1' | 'fd3') => {
        if (!hovered) return false;
        if (link === 'fd0') return hovered !== 'fd0' && hovered !== 'tfo0';
        if (link === 'fd1') {
            const target = fd1PointsToTfo1 ? 'tfo1' : 'tfo0';
            return hovered !== 'fd1' && hovered !== target;
        }
        return hovered !== 'fd3' && hovered !== 'tfo1';
    };

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">

                {/* Minimalist Switcher */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-slate-900/60 border border-white/5 mb-3">
                    {([
                        { id: 'open', label: '1. open()' },
                        { id: 'dup2', label: '2. dup2(3, 1)' },
                        { id: 'close', label: '3. close(3)' },
                    ] as const).map((item) => {
                        const isActive = step === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setStep(item.id);
                                    setHovered(null);
                                }}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-white/10 text-white font-bold border border-white/15 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <svg
                    viewBox="0 0 560 155"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-dup2" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* COLUMN HEADERS */}
                    <text
                        x="87.5"
                        y="12"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase pointer-events-none"
                    >
                        TC (PCB)
                    </text>
                    <text
                        x="442.5"
                        y="12"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-mono text-[9px] font-semibold tracking-widest fill-slate-500 uppercase pointer-events-none"
                    >
                        TFO
                    </text>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_FD0_TFO0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_FD1_TFO0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={PATH_FD1_TFO1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />
                    <path d={PATH_FD3_TFO1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* ACTIVE POINTERS */}
                    {/* fd 0 -> TFO 0 */}
                    <path
                        d={PATH_FD0_TFO0}
                        stroke="#38bdf8"
                        strokeWidth={hovered === 'fd0' || hovered === 'tfo0' ? 2 : 1.4}
                        strokeLinecap="round"
                        filter="url(#glow-dup2)"
                        opacity={isPathFaded('fd0') ? 0.2 : 0.85}
                    />

                    {/* fd 1 -> TFO 0 (open) or TFO 1 (dup2/close) */}
                    <path
                        d={activeFd1Path}
                        stroke={activeFd1Color}
                        strokeWidth={hovered === 'fd1' ? 2.2 : 1.7}
                        strokeLinecap="round"
                        filter="url(#glow-dup2)"
                        opacity={isPathFaded('fd1') ? 0.2 : 0.95}
                    />

                    {/* fd 3 -> TFO 1 (open & dup2 only) */}
                    {!fd3Closed && (
                        <path
                            d={PATH_FD3_TFO1}
                            stroke="#818cf8"
                            strokeWidth={hovered === 'fd3' || hovered === 'tfo1' ? 2 : 1.5}
                            strokeLinecap="round"
                            filter="url(#glow-dup2)"
                            opacity={isPathFaded('fd3') ? 0.2 : 0.85}
                        />
                    )}

                    {/* KINETIC PARTICLES */}
                    <motion.circle
                        key={`p-fd0-${step}`}
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-dup2)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_FD0_TFO0}")` }}
                    />

                    <motion.circle
                        key={`p-fd1-${step}`}
                        r={2.5}
                        fill={activeFd1Color}
                        filter="url(#glow-dup2)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.9, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${activeFd1Path}")` }}
                    />

                    {!fd3Closed && (
                        <motion.circle
                            key={`p-fd3-${step}`}
                            r={2.5}
                            fill="#818cf8"
                            filter="url(#glow-dup2)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.1, repeat: Infinity, delay: 0.85, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_FD3_TFO1}")` }}
                        />
                    )}

                    {/* LEFT SLOTS: TC (PCB) */}
                    {/* fd 0 (stdin) */}
                    <g
                        onMouseEnter={() => setHovered('fd0')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isNodeFaded('fd0') ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="26"
                            width="95"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={hovered === 'fd0' ? 1.8 : 1.1}
                            strokeOpacity={hovered === 'fd0' ? 1 : 0.55}
                            filter={hovered === 'fd0' ? "url(#glow-dup2)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="40"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-sky-300 tracking-wide pointer-events-none"
                        >
                            fd 0 (stdin)
                        </text>
                        <circle cx="135" cy="40" r="2.5" fill="#38bdf8" />
                    </g>

                    {/* fd 1 (stdout) */}
                    <g
                        onMouseEnter={() => setHovered('fd1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isNodeFaded('fd1') ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="64"
                            width="95"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke={activeFd1Color}
                            strokeWidth={hovered === 'fd1' ? 1.8 : 1.3}
                            strokeOpacity={hovered === 'fd1' ? 1 : 0.8}
                            filter={hovered === 'fd1' || fd1PointsToTfo1 ? "url(#glow-dup2)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="78"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9px] font-bold tracking-wide pointer-events-none ${
                                fd1PointsToTfo1 ? 'fill-emerald-300' : 'fill-sky-300'
                            }`}
                        >
                            fd 1 (stdout)
                        </text>
                        <circle cx="135" cy="78" r="2.5" fill={activeFd1Color} />
                    </g>

                    {/* fd 3 (fd) */}
                    <g
                        onMouseEnter={() => !fd3Closed && setHovered('fd3')}
                        onMouseLeave={() => setHovered(null)}
                        className={`transition-opacity duration-200 ${fd3Closed ? 'pointer-events-none' : 'cursor-pointer'}`}
                        opacity={fd3Closed ? 0.35 : isNodeFaded('fd3') ? 0.25 : 1}
                    >
                        <rect
                            x="40"
                            y="102"
                            width="95"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke={fd3Closed ? '#64748b' : '#818cf8'}
                            strokeWidth={hovered === 'fd3' ? 1.8 : 1.1}
                            strokeOpacity={fd3Closed ? 0.65 : hovered === 'fd3' ? 1 : 0.65}
                            strokeDasharray={fd3Closed ? "3 3" : undefined}
                            filter={!fd3Closed && hovered === 'fd3' ? "url(#glow-dup2)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="116"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`font-mono text-[9px] font-bold tracking-wide pointer-events-none ${
                                fd3Closed ? 'fill-slate-400' : 'fill-indigo-300'
                            }`}
                        >
                            {fd3Closed ? '3 · lliure' : 'fd 3 (fd)'}
                        </text>
                        {!fd3Closed && <circle cx="135" cy="116" r="2.5" fill="#818cf8" />}
                    </g>

                    {/* RIGHT ENTRIES: TFO */}
                    {/* TFO 0 · tty0 */}
                    <g
                        onMouseEnter={() => setHovered('tfo0')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isNodeFaded('tfo0') ? 0.25 : 1}
                    >
                        <rect
                            x="365"
                            y="34"
                            width="155"
                            height="38"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={hovered === 'tfo0' ? 1.8 : 1.2}
                            strokeOpacity={hovered === 'tfo0' ? 1 : 0.6}
                            filter={hovered === 'tfo0' ? "url(#glow-dup2)" : undefined}
                        />
                        <text
                            x="379"
                            y="46"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-sky-300 tracking-wide pointer-events-none"
                        >
                            TFO 0 · tty0
                        </text>
                        <text
                            x="379"
                            y="60"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            refs: {tfo0Refs}
                        </text>
                        <text
                            x="506"
                            y="60"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-medium fill-slate-500 tracking-wider pointer-events-none"
                        >
                            pos_le: -
                        </text>
                        <circle cx="365" cy="47" r="2.5" fill="#38bdf8" />
                        <circle
                            cx="365"
                            cy="59"
                            r="2.5"
                            fill={fd1PointsToTfo1 ? '#64748b' : '#38bdf8'}
                            opacity={fd1PointsToTfo1 ? 0.25 : 1}
                        />
                    </g>

                    {/* TFO 1 · sortida.txt */}
                    <g
                        onMouseEnter={() => setHovered('tfo1')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isNodeFaded('tfo1') ? 0.25 : 1}
                    >
                        <rect
                            x="365"
                            y="94"
                            width="155"
                            height="38"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={hovered === 'tfo1' ? 1.8 : 1.2}
                            strokeOpacity={hovered === 'tfo1' ? 1 : 0.7}
                            filter={hovered === 'tfo1' || fd1PointsToTfo1 ? "url(#glow-dup2)" : undefined}
                        />
                        <text
                            x="379"
                            y="106"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-emerald-300 tracking-wide pointer-events-none"
                        >
                            TFO 1 · sortida.txt
                        </text>
                        <text
                            x="379"
                            y="120"
                            dominantBaseline="central"
                            className="font-mono text-[8.5px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            refs: {tfo1Refs}
                        </text>
                        <text
                            x="506"
                            y="120"
                            textAnchor="end"
                            dominantBaseline="central"
                            className="font-mono text-[8px] font-medium fill-slate-500 tracking-wider pointer-events-none"
                        >
                            pos_le: 0
                        </text>
                        <circle
                            cx="365"
                            cy="107"
                            r="2.5"
                            fill={fd1PointsToTfo1 ? '#34d399' : '#64748b'}
                            opacity={fd1PointsToTfo1 ? 1 : 0.25}
                        />
                        <circle
                            cx="365"
                            cy="119"
                            r="2.5"
                            fill={fd3Closed ? '#64748b' : '#818cf8'}
                            opacity={fd3Closed ? 0.25 : 1}
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
}
