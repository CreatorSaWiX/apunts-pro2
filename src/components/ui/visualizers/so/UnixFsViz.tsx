"use client";

import { useState } from 'react';
import { m as motion } from 'framer-motion';

type HoverTarget = 'super' | 'inode' | 'bd' | 'direct' | 'indirect' | null;

const PATH_DIR_BD0 = "M 185 119 C 295 119, 315 83, 425 83";
const PATH_DIR_BD1 = "M 185 119 C 295 119, 315 109, 425 109";
const PATH_IND_IDX = "M 185 141 L 250 141";
const PATH_IDX_BD2 = "M 345 141 C 385 141, 385 137, 425 137";
const PATH_IDX_BD3 = "M 345 141 C 385 141, 385 163, 425 163";

const DIRECT_BLOCKS = [
    { id: 'BD 0', y: 72, cy: 83 },
    { id: 'BD 1', y: 98, cy: 109 },
] as const;

const INDIRECT_BLOCKS = [
    { id: 'BD 2', y: 126, cy: 137 },
    { id: 'BD 3', y: 152, cy: 163 },
] as const;

export default function UnixFsViz() {
    const [hovered, setHovered] = useState<HoverTarget>(null);

    const isSuperLit = hovered === 'super';
    const isSuperFaded = hovered !== null && hovered !== 'super';

    const isInodeStripLit = hovered === 'inode';
    const isInodeStripFaded = hovered !== null && hovered !== 'inode';

    const isBdStripLit = hovered === 'bd';
    const isBdStripFaded = hovered !== null && hovered !== 'bd';

    const isInodeBoxLit = hovered === 'inode';
    const isInodeBoxFaded = hovered === 'super' || hovered === 'bd';

    const isDirectLit = hovered === 'direct';
    const isDirectSlotFaded = hovered === 'super' || hovered === 'bd' || hovered === 'indirect';
    const isDirectPathFaded = hovered !== null && hovered !== 'direct';

    const isIndirectLit = hovered === 'indirect';
    const isIndirectSlotFaded = hovered === 'super' || hovered === 'bd' || hovered === 'direct';
    const isIndirectPathFaded = hovered !== null && hovered !== 'indirect';

    const isIndexBoxLit = hovered === 'indirect';
    const isIndexBoxFaded = hovered !== null && hovered !== 'indirect';

    const isBd01Lit = hovered === 'direct' || hovered === 'bd';
    const isBd01Faded = hovered !== null && hovered !== 'direct' && hovered !== 'bd';

    const isBd23Lit = hovered === 'indirect' || hovered === 'bd';
    const isBd23Faded = hovered !== null && hovered !== 'indirect' && hovered !== 'bd';

    return (
        <div className="w-full my-6 select-none flex flex-col items-center justify-center not-prose">
            <div className="w-full max-w-lg relative flex flex-col items-center">
                <svg
                    viewBox="0 0 580 185"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow-unixfs" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* TOP HORIZONTAL PARTITION STRIP (y=16, h=32) */}
                    <g
                        onMouseEnter={() => setHovered('super')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isSuperFaded ? 0.25 : 1}
                    >
                        <rect
                            x="30"
                            y="16"
                            width="115"
                            height="32"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth={isSuperLit ? 1.8 : 1.1}
                            strokeOpacity={isSuperLit ? 1 : 0.55}
                            filter={isSuperLit ? "url(#glow-unixfs)" : undefined}
                        />
                        <text
                            x="87.5"
                            y="32"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-amber-300 tracking-wider pointer-events-none"
                        >
                            Superbloc
                        </text>
                    </g>

                    <g
                        onMouseEnter={() => setHovered('inode')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isInodeStripFaded ? 0.25 : 1}
                    >
                        <rect
                            x="153"
                            y="16"
                            width="160"
                            height="32"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#c084fc"
                            strokeWidth={isInodeStripLit ? 1.8 : 1.1}
                            strokeOpacity={isInodeStripLit ? 1 : 0.55}
                            filter={isInodeStripLit ? "url(#glow-unixfs)" : undefined}
                        />
                        <text
                            x="233"
                            y="32"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            Taula d&apos;Inodes
                        </text>
                    </g>

                    <g
                        onMouseEnter={() => setHovered('bd')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isBdStripFaded ? 0.25 : 1}
                    >
                        <rect
                            x="321"
                            y="16"
                            width="229"
                            height="32"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isBdStripLit ? 1.8 : 1.1}
                            strokeOpacity={isBdStripLit ? 1 : 0.55}
                            filter={isBdStripLit ? "url(#glow-unixfs)" : undefined}
                        />
                        <text
                            x="435.5"
                            y="32"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                        >
                            Blocs de Dades (BD)
                        </text>
                    </g>

                    {/* ZOOM-IN RAYS FROM TAULA D'INODES TO INODE I_k */}
                    <motion.g
                        animate={{
                            opacity: isInodeStripLit ? 0.75 : hovered === null ? 0.28 : 0.1,
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <line
                            x1="162"
                            y1="48"
                            x2="49"
                            y2="80"
                            stroke="#c084fc"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                        />
                        <line
                            x1="210"
                            y1="48"
                            x2="181"
                            y2="80"
                            stroke="#c084fc"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                        />
                    </motion.g>

                    {/* BASE BLUEPRINT TRACKS */}
                    <path d={PATH_DIR_BD0} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_DIR_BD1} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_IND_IDX} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_IDX_BD2} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />
                    <path d={PATH_IDX_BD3} className="stroke-slate-300/25 dark:stroke-white/[0.08]" strokeWidth="1.2" />

                    {/* ACTIVE DIRECT POINTER CURVES */}
                    <motion.path
                        d={PATH_DIR_BD0}
                        stroke="#38bdf8"
                        strokeWidth={isDirectLit ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isDirectPathFaded ? 0.12 : 0.9 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.path
                        d={PATH_DIR_BD1}
                        stroke="#38bdf8"
                        strokeWidth={isDirectLit ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isDirectPathFaded ? 0.12 : 0.9 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* ACTIVE INDIRECT POINTER CURVES */}
                    <motion.path
                        d={PATH_IND_IDX}
                        stroke="#c084fc"
                        strokeWidth={isIndirectLit ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isIndirectPathFaded ? 0.12 : 0.9 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.path
                        d={PATH_IDX_BD2}
                        stroke="#34d399"
                        strokeWidth={isIndirectLit ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isIndirectPathFaded ? 0.12 : 0.9 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.path
                        d={PATH_IDX_BD3}
                        stroke="#34d399"
                        strokeWidth={isIndirectLit ? 2.2 : 1.5}
                        strokeLinecap="round"
                        animate={{ opacity: isIndirectPathFaded ? 0.12 : 0.9 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* KINETIC PARTICLES: DIRECT */}
                    <g opacity={isDirectPathFaded ? 0.12 : 1}>
                        <motion.circle
                            r={2.5}
                            fill="#38bdf8"
                            filter="url(#glow-unixfs)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_DIR_BD0}")` }}
                        />
                        <motion.circle
                            r={2.5}
                            fill="#38bdf8"
                            filter="url(#glow-unixfs)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, delay: 0.65, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_DIR_BD1}")` }}
                        />
                    </g>

                    {/* KINETIC PARTICLES: INDIRECT */}
                    <g opacity={isIndirectPathFaded ? 0.12 : 1}>
                        <motion.circle
                            r={2.5}
                            fill="#c084fc"
                            filter="url(#glow-unixfs)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_IND_IDX}")` }}
                        />
                        <motion.circle
                            r={2.5}
                            fill="#34d399"
                            filter="url(#glow-unixfs)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_IDX_BD2}")` }}
                        />
                        <motion.circle
                            r={2.5}
                            fill="#34d399"
                            filter="url(#glow-unixfs)"
                            initial={{ offsetDistance: "0%", opacity: 0 }}
                            animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 1.1, ease: "easeInOut" }}
                            style={{ offsetPath: `path("${PATH_IDX_BD3}")` }}
                        />
                    </g>

                    {/* LOWER LEFT: INODE ZOOM-IN BOX */}
                    <g
                        className="transition-opacity duration-200"
                        opacity={isInodeBoxFaded ? 0.25 : 1}
                    >
                        <rect
                            x="45"
                            y="80"
                            width="140"
                            height="76"
                            rx="8"
                            fill="#0b0f19"
                            stroke="#c084fc"
                            strokeWidth={isInodeBoxLit ? 1.8 : 1.1}
                            strokeOpacity={isInodeBoxLit ? 1 : 0.5}
                            filter={isInodeBoxLit ? "url(#glow-unixfs)" : undefined}
                        />
                        <text
                            x="115"
                            y="95"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9.5px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            Inode · Iₖ
                        </text>

                        {/* Sub-slot: Directes */}
                        <g
                            onMouseEnter={() => setHovered('direct')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isDirectSlotFaded ? 0.25 : 1}
                        >
                            <rect
                                x="55"
                                y="109"
                                width="120"
                                height="19"
                                rx="5"
                                fill="#0b0f19"
                                stroke="#38bdf8"
                                strokeWidth={isDirectLit ? 1.6 : 1}
                                strokeOpacity={isDirectLit ? 1 : 0.5}
                                filter={isDirectLit ? "url(#glow-unixfs)" : undefined}
                            />
                            <text
                                x="115"
                                y="118.5"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8.5px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                            >
                                Directes
                            </text>
                            <line x1="175" y1="119" x2="185" y2="119" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
                            <circle cx="185" cy="119" r="2.5" fill="#38bdf8" />
                        </g>

                        {/* Sub-slot: Indirecte */}
                        <g
                            onMouseEnter={() => setHovered('indirect')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isIndirectSlotFaded ? 0.25 : 1}
                        >
                            <rect
                                x="55"
                                y="132"
                                width="120"
                                height="19"
                                rx="5"
                                fill="#0b0f19"
                                stroke="#c084fc"
                                strokeWidth={isIndirectLit ? 1.6 : 1}
                                strokeOpacity={isIndirectLit ? 1 : 0.5}
                                filter={isIndirectLit ? "url(#glow-unixfs)" : undefined}
                            />
                            <text
                                x="115"
                                y="141.5"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[8.5px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                            >
                                Indirecte
                            </text>
                            <line x1="175" y1="141" x2="185" y2="141" stroke="#c084fc" strokeWidth="1.2" strokeOpacity="0.7" />
                            <circle cx="185" cy="141" r="2.5" fill="#c084fc" />
                        </g>
                    </g>

                    {/* MIDDLE-BOTTOM: BLOC ÍNDEX */}
                    <g
                        onMouseEnter={() => setHovered('indirect')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer transition-opacity duration-200"
                        opacity={isIndexBoxFaded ? 0.25 : 1}
                    >
                        <rect
                            x="250"
                            y="126"
                            width="95"
                            height="30"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#c084fc"
                            strokeWidth={isIndexBoxLit ? 1.8 : 1.1}
                            strokeOpacity={isIndexBoxLit ? 1 : 0.6}
                            filter={isIndexBoxLit ? "url(#glow-unixfs)" : undefined}
                        />
                        <text
                            x="297.5"
                            y="141"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="font-mono text-[9px] font-bold fill-purple-300 tracking-wider pointer-events-none"
                        >
                            Bloc Índex
                        </text>
                        <circle cx="250" cy="141" r="2.5" fill="#c084fc" />
                        <circle cx="345" cy="141" r="2.5" fill="#34d399" />
                    </g>

                    {/* RIGHT STACK: DATA BLOCKS (BD 0..3) */}
                    {DIRECT_BLOCKS.map((blk) => (
                        <g
                            key={blk.id}
                            onMouseEnter={() => setHovered('direct')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isBd01Faded ? 0.25 : 1}
                        >
                            <rect
                                x="425"
                                y={blk.y}
                                width="105"
                                height="22"
                                rx="6"
                                fill="#0b0f19"
                                stroke="#38bdf8"
                                strokeWidth={isBd01Lit ? 1.7 : 1}
                                strokeOpacity={isBd01Lit ? 1 : 0.5}
                                filter={isBd01Lit ? "url(#glow-unixfs)" : undefined}
                            />
                            <text
                                x="477.5"
                                y={blk.cy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9px] font-bold fill-sky-300 tracking-wider pointer-events-none"
                            >
                                {blk.id}
                            </text>
                            <circle cx="425" cy={blk.cy} r="2.5" fill="#38bdf8" />
                        </g>
                    ))}

                    {INDIRECT_BLOCKS.map((blk) => (
                        <g
                            key={blk.id}
                            onMouseEnter={() => setHovered('indirect')}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-pointer transition-opacity duration-200"
                            opacity={isBd23Faded ? 0.25 : 1}
                        >
                            <rect
                                x="425"
                                y={blk.y}
                                width="105"
                                height="22"
                                rx="6"
                                fill="#0b0f19"
                                stroke="#34d399"
                                strokeWidth={isBd23Lit ? 1.7 : 1}
                                strokeOpacity={isBd23Lit ? 1 : 0.5}
                                filter={isBd23Lit ? "url(#glow-unixfs)" : undefined}
                            />
                            <text
                                x="477.5"
                                y={blk.cy}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="font-mono text-[9px] font-bold fill-emerald-300 tracking-wider pointer-events-none"
                            >
                                {blk.id}
                            </text>
                            <circle cx="425" cy={blk.cy} r="2.5" fill="#34d399" />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
