"use client";

import React, { useState } from 'react';
import { m as motion } from 'framer-motion';
import { Cpu, Database, Layers, CheckCircle2, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';

type SectionId = 'logic' | 'tp' | 'bypass' | 'physical' | 'ram' | null;

interface SectionInfo {
    label: string;
    desc: string;
    color: string;
}

const SECTIONS_INFO: Record<string, SectionInfo> = {
    logic: {
        label: "@L (Adreça Lògica)",
        desc: "La CPU divideix l'adreça emesa en número de pàgina (p) i desplaçament intern (d).",
        color: "#38bdf8"
    },
    tp: {
        label: "TP · Entrada de Taula (PTE)",
        desc: "La MMU indexa per p, verifica el bit de presència (V=1) i els permisos (rwx), i obté el marc físic (f).",
        color: "#34d399"
    },
    bypass: {
        label: "Desplaçament (d) · Invariant",
        desc: "La posició relativa dins de la pàgina no canvia; es transfereix intacta directament a l'adreça física.",
        color: "#a78bfa"
    },
    physical: {
        label: "@F (Adreça Física)",
        desc: "Concatena el marc físic resolt (f) amb el desplaçament original (d) per accedir al bus de memòria.",
        color: "#34d399"
    },
    ram: {
        label: "RAM (Memòria Física)",
        desc: "S'accedeix al marc f de la memòria principal i es llegeix/escriu el byte exacte a l'offset d.",
        color: "#10b981"
    }
};

// SVG Paths
const PATH_P_TO_TP   = "M 120 50 L 120 118";
const PATH_TP_TO_F   = "M 120 142 L 120 188";
const PATH_D_BYPASS  = "M 235 50 L 235 188";
const PATH_TO_RAM    = "M 290 202 C 345 202, 365 125, 420 125";

export default function PageTableViz() {
    const [hovered, setHovered] = useState<SectionId>(null);

    const isFaded = (sec: SectionId) => hovered !== null && hovered !== sec;
    const isLit   = (sec: SectionId) => hovered === sec;

    const activeInfo = hovered ? SECTIONS_INFO[hovered] : null;

    return (
        <div className="w-full my-8 select-none flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative">
                <svg
                    viewBox="0 0 680 240"
                    className="w-full h-auto overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="glow-pagetable" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gradients */}
                        <linearGradient id="grad-pt-p" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>

                        <linearGradient id="grad-pt-f" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>

                        <linearGradient id="grad-pt-ram" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>

                    {/* ============================================================== */}
                    {/* BASE INACTIVE TRACKS (Faint Blueprint Circuit)                */}
                    {/* ============================================================== */}
                    <path d={PATH_P_TO_TP}  className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_TP_TO_F}  className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" />
                    <path d={PATH_D_BYPASS} className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d={PATH_TO_RAM}   className="stroke-slate-300/30 dark:stroke-white/[0.08]" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* ============================================================== */}
                    {/* ACTIVE GLOW TRACKS                                             */}
                    {/* ============================================================== */}
                    {/* 1. p -> TP lookup */}
                    <motion.path
                        d={PATH_P_TO_TP}
                        stroke="#38bdf8"
                        strokeWidth={isLit('logic') || isLit('tp') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('logic') && isFaded('tp') ? 0.2 : 0.85 }}
                        filter="url(#glow-pagetable)"
                    />

                    {/* 2. TP -> f resolution */}
                    <motion.path
                        d={PATH_TP_TO_F}
                        stroke="url(#grad-pt-f)"
                        strokeWidth={isLit('tp') || isLit('physical') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('tp') && isFaded('physical') ? 0.2 : 0.85 }}
                        filter="url(#glow-pagetable)"
                    />

                    {/* 3. Invariant Bypass d -> d */}
                    <motion.path
                        d={PATH_D_BYPASS}
                        stroke="#a78bfa"
                        strokeWidth={isLit('bypass') ? 2.4 : 1.6}
                        strokeDasharray={isLit('bypass') ? "none" : "3 3"}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('bypass') ? 0.2 : 0.8 }}
                        filter="url(#glow-pagetable)"
                    />

                    {/* 4. Physical address to RAM */}
                    <motion.path
                        d={PATH_TO_RAM}
                        stroke="url(#grad-pt-ram)"
                        strokeWidth={isLit('physical') || isLit('ram') ? 2.2 : 1.6}
                        strokeLinecap="round"
                        animate={{ opacity: isFaded('physical') && isFaded('ram') ? 0.2 : 0.85 }}
                        filter="url(#glow-pagetable)"
                    />

                    {/* ============================================================== */}
                    {/* CONTINUOUS FLOW PARTICLES                                      */}
                    {/* ============================================================== */}
                    {/* Particle 1: p into TP index */}
                    <motion.circle
                        r={2.5}
                        fill="#38bdf8"
                        filter="url(#glow-pagetable)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_P_TO_TP}")` }}
                    />

                    {/* Particle 2: f emerging from TP to @F */}
                    <motion.circle
                        r={2.5}
                        fill="#34d399"
                        filter="url(#glow-pagetable)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: 0.7, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_TP_TO_F}")` }}
                    />

                    {/* Particle 3: Untouched d bypass (runs simultaneously!) */}
                    <motion.circle
                        r={2.5}
                        fill="#a78bfa"
                        filter="url(#glow-pagetable)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }}
                        style={{ offsetPath: `path("${PATH_D_BYPASS}")` }}
                    />

                    {/* Particle 4: @F bus access to RAM */}
                    <motion.circle
                        r={3}
                        fill="#10b981"
                        filter="url(#glow-pagetable)"
                        initial={{ offsetDistance: "0%", opacity: 0 }}
                        animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 1.4, ease: "easeInOut" }}
                        style={{ offsetPath: `path("${PATH_TO_RAM}")` }}
                    />

                    {/* ============================================================== */}
                    {/* NODE 1: ADREÇA LÒGICA @L (Top-Left)                            */}
                    {/* ============================================================== */}
                    <g
                        transform="translate(0, 0)"
                        onMouseEnter={() => setHovered('logic')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        {/* Hitbox */}
                        <rect x="25" y="16" width="270" height="40" fill="transparent" />

                        {/* Address type tag: @L */}
                        <text
                            x="40"
                            y="39"
                            textAnchor="middle"
                            className="font-mono text-[10px] font-bold tracking-wider fill-slate-400 dark:fill-slate-500 pointer-events-none"
                        >
                            @L
                        </text>

                        {/* Page (p) Box */}
                        <motion.rect
                            x="65"
                            y="22"
                            width="110"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#38bdf8"
                            strokeWidth={isLit('logic') ? 1.75 : 1.2}
                            animate={{
                                opacity: isFaded('logic') ? 0.35 : 1,
                                scale: isLit('logic') ? 1.02 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('logic') ? "url(#glow-pagetable)" : undefined}
                        />
                        <text
                            x="100"
                            y="40"
                            textAnchor="middle"
                            className="font-mono text-[12px] font-bold fill-sky-300 pointer-events-none"
                        >
                            p
                        </text>
                        <text
                            x="142"
                            y="39"
                            textAnchor="middle"
                            className="font-mono text-[8px] font-medium tracking-wider fill-sky-400/60 pointer-events-none"
                        >
                            PÀGINA
                        </text>

                        {/* Offset (d) Box */}
                        <motion.rect
                            x="180"
                            y="22"
                            width="110"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#a78bfa"
                            strokeWidth={isLit('bypass') || isLit('logic') ? 1.75 : 1.2}
                            animate={{
                                opacity: isFaded('bypass') && isFaded('logic') ? 0.35 : 1,
                                scale: isLit('bypass') ? 1.02 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('bypass') ? "url(#glow-pagetable)" : undefined}
                        />
                        <text
                            x="215"
                            y="40"
                            textAnchor="middle"
                            className="font-mono text-[12px] font-bold fill-purple-300 pointer-events-none"
                        >
                            d
                        </text>
                        <text
                            x="256"
                            y="39"
                            textAnchor="middle"
                            className="font-mono text-[8px] font-medium tracking-wider fill-purple-400/60 pointer-events-none"
                        >
                            OFFSET
                        </text>
                    </g>

                    {/* ============================================================== */}
                    {/* NODE 2: TAULA DE PÀGINES / TP (Center)                         */}
                    {/* ============================================================== */}
                    <g
                        transform="translate(65, 88)"
                        onMouseEnter={() => setHovered('tp')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        {/* Hitbox */}
                        <rect x="-10" y="-10" width="130" height="74" fill="transparent" />

                        {/* Faint entry 0 */}
                        <rect
                            x="0"
                            y="4"
                            width="110"
                            height="16"
                            rx="4"
                            fill="#0b0f19"
                            className="stroke-slate-300/20 dark:stroke-white/[0.05]"
                            strokeWidth="1"
                        />
                        <text x="10" y="15" className="font-mono text-[7.5px] fill-slate-500 pointer-events-none">
                            0 ··· V:1
                        </text>

                        {/* ACTIVE PTE ENTRY (INDEX p) */}
                        <motion.rect
                            x="0"
                            y="24"
                            width="110"
                            height="28"
                            rx="6"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('tp') ? 1.75 : 1.2}
                            animate={{
                                opacity: isFaded('tp') ? 0.35 : 1,
                                scale: isLit('tp') ? 1.04 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('tp') ? "url(#glow-pagetable)" : undefined}
                        />

                        {/* Inside PTE content */}
                        <g transform="translate(6, 42)">
                            {/* p index dot */}
                            <circle cx="2" cy="-4" r="2" fill="#38bdf8" />
                            <text x="9" y="-1" className="font-mono text-[9px] font-bold fill-sky-300 pointer-events-none">
                                p
                            </text>

                            {/* Valid flag pill */}
                            <rect x="22" y="-10" width="22" height="12" rx="3" fill="rgba(52, 211, 153, 0.15)" stroke="#34d399" strokeWidth="0.75" />
                            <text x="33" y="-1" textAnchor="middle" className="font-mono text-[7px] font-semibold fill-emerald-300 pointer-events-none">
                                V:1
                            </text>

                            {/* Permissions pill */}
                            <rect x="47" y="-10" width="23" height="12" rx="3" fill="rgba(251, 191, 36, 0.12)" stroke="#fbbf24" strokeWidth="0.75" />
                            <text x="58.5" y="-1" textAnchor="middle" className="font-mono text-[7px] font-semibold fill-amber-300 pointer-events-none">
                                rwx
                            </text>

                            {/* Resolved Frame f */}
                            <text x="86" y="-1" textAnchor="middle" className="font-mono text-[10px] font-bold fill-emerald-300 pointer-events-none">
                                f
                            </text>
                        </g>

                        {/* Faint entry 2 (swap) */}
                        <rect
                            x="0"
                            y="56"
                            width="110"
                            height="16"
                            rx="4"
                            fill="#0b0f19"
                            className="stroke-slate-300/20 dark:stroke-white/[0.05]"
                            strokeWidth="1"
                        />
                        <text x="10" y="67" className="font-mono text-[7.5px] fill-slate-600 pointer-events-none">
                            2 ··· V:0 (swap)
                        </text>

                        {/* Badge TP on the left */}
                        <text
                            x="-16"
                            y="41"
                            textAnchor="middle"
                            className="font-mono text-[8.5px] font-bold tracking-wider fill-emerald-400 pointer-events-none"
                        >
                            TP
                        </text>
                    </g>

                    {/* Small bypass indicator tag */}
                    <g
                        transform="translate(235, 118)"
                        onMouseEnter={() => setHovered('bypass')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        <rect x="-30" y="-10" width="60" height="20" fill="transparent" />
                        <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            className={`font-mono text-[8px] font-semibold tracking-wider transition-opacity duration-200 pointer-events-none ${
                                isLit('bypass') ? 'fill-purple-300' : 'fill-purple-400/50'
                            }`}
                        >
                            INVARIANT
                        </text>
                    </g>

                    {/* ============================================================== */}
                    {/* NODE 3: ADREÇA FÍSICA @F (Bottom-Left)                         */}
                    {/* ============================================================== */}
                    <g
                        transform="translate(0, 0)"
                        onMouseEnter={() => setHovered('physical')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        {/* Hitbox */}
                        <rect x="25" y="182" width="270" height="40" fill="transparent" />

                        {/* Address type tag: @F */}
                        <text
                            x="40"
                            y="205"
                            textAnchor="middle"
                            className="font-mono text-[10px] font-bold tracking-wider fill-slate-400 dark:fill-slate-500 pointer-events-none"
                        >
                            @F
                        </text>

                        {/* Frame (f) Box */}
                        <motion.rect
                            x="65"
                            y="188"
                            width="110"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('physical') ? 1.75 : 1.2}
                            animate={{
                                opacity: isFaded('physical') ? 0.35 : 1,
                                scale: isLit('physical') ? 1.02 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('physical') ? "url(#glow-pagetable)" : undefined}
                        />
                        <text
                            x="100"
                            y="206"
                            textAnchor="middle"
                            className="font-mono text-[12px] font-bold fill-emerald-300 pointer-events-none"
                        >
                            f
                        </text>
                        <text
                            x="142"
                            y="205"
                            textAnchor="middle"
                            className="font-mono text-[8px] font-medium tracking-wider fill-emerald-400/60 pointer-events-none"
                        >
                            MARC
                        </text>

                        {/* Offset (d) Box */}
                        <motion.rect
                            x="180"
                            y="188"
                            width="110"
                            height="28"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#a78bfa"
                            strokeWidth={isLit('bypass') || isLit('physical') ? 1.75 : 1.2}
                            animate={{
                                opacity: isFaded('bypass') && isFaded('physical') ? 0.35 : 1,
                                scale: isLit('bypass') ? 1.02 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('bypass') ? "url(#glow-pagetable)" : undefined}
                        />
                        <text
                            x="215"
                            y="206"
                            textAnchor="middle"
                            className="font-mono text-[12px] font-bold fill-purple-300 pointer-events-none"
                        >
                            d
                        </text>
                        <text
                            x="256"
                            y="205"
                            textAnchor="middle"
                            className="font-mono text-[8px] font-medium tracking-wider fill-purple-400/60 pointer-events-none"
                        >
                            OFFSET
                        </text>
                    </g>

                    {/* ============================================================== */}
                    {/* NODE 4: MEMÒRIA RAM FÍSICA (Right Side)                        */}
                    {/* ============================================================== */}
                    <g
                        transform="translate(420, 22)"
                        onMouseEnter={() => setHovered('ram')}
                        onMouseLeave={() => setHovered(null)}
                        className="cursor-pointer"
                    >
                        {/* Hitbox */}
                        <rect x="-10" y="-10" width="220" height="215" fill="transparent" />

                        {/* Header */}
                        <g transform="translate(0, 0)">
                            <text
                                x="100"
                                y="0"
                                textAnchor="middle"
                                className="font-mono text-[9px] font-bold tracking-widest fill-slate-400 dark:fill-slate-500 uppercase pointer-events-none"
                            >
                                MEMÒRIA RAM
                            </text>
                        </g>

                        {/* Frame 0 */}
                        <rect
                            x="0"
                            y="14"
                            width="200"
                            height="20"
                            rx="5"
                            fill="#0b0f19"
                            className="stroke-slate-300/20 dark:stroke-white/[0.05]"
                            strokeWidth="1"
                        />
                        <text x="14" y="27" className="font-mono text-[8px] fill-slate-500 pointer-events-none">
                            Marc 0
                        </text>

                        {/* Frame 1 */}
                        <rect
                            x="0"
                            y="38"
                            width="200"
                            height="20"
                            rx="5"
                            fill="#0b0f19"
                            className="stroke-slate-300/20 dark:stroke-white/[0.05]"
                            strokeWidth="1"
                        />
                        <text x="14" y="51" className="font-mono text-[8px] fill-slate-500 pointer-events-none">
                            Marc 1
                        </text>

                        {/* Ellipsis dots */}
                        <circle cx="100" cy="70" r="1.5" fill="#64748b" opacity="0.4" />
                        <circle cx="100" cy="76" r="1.5" fill="#64748b" opacity="0.4" />
                        <circle cx="100" cy="82" r="1.5" fill="#64748b" opacity="0.4" />

                        {/* TARGET FRAME (Marc f) */}
                        <motion.rect
                            x="0"
                            y="92"
                            width="200"
                            height="44"
                            rx="7"
                            fill="#0b0f19"
                            stroke="#34d399"
                            strokeWidth={isLit('ram') ? 1.8 : 1.2}
                            animate={{
                                opacity: isFaded('ram') ? 0.35 : 1,
                                scale: isLit('ram') ? 1.02 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            filter={isLit('ram') ? "url(#glow-pagetable)" : undefined}
                        />

                        {/* Frame f content */}
                        <text x="14" y="112" className="font-mono text-[9px] font-bold fill-emerald-300 pointer-events-none">
                            Marc f
                        </text>

                        {/* Intra-frame offset target indicator (+ d) */}
                        <g transform="translate(70, 96)">
                            <line x1="0" y1="18" x2="115" y2="18" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                            <circle cx="95" cy="18" r="2.5" fill="#34d399" filter="url(#glow-pagetable)" />
                            <text x="50" y="14" className="font-mono text-[7.5px] font-semibold fill-purple-300 pointer-events-none">
                                offset + d
                            </text>
                            <text x="50" y="29" className="font-mono text-[7px] fill-emerald-300/80 pointer-events-none">
                                byte [@F]
                            </text>
                        </g>

                        {/* Ellipsis dots */}
                        <circle cx="100" cy="148" r="1.5" fill="#64748b" opacity="0.4" />
                        <circle cx="100" cy="154" r="1.5" fill="#64748b" opacity="0.4" />
                        <circle cx="100" cy="160" r="1.5" fill="#64748b" opacity="0.4" />

                        {/* Frame N */}
                        <rect
                            x="0"
                            y="170"
                            width="200"
                            height="20"
                            rx="5"
                            fill="#0b0f19"
                            className="stroke-slate-300/20 dark:stroke-white/[0.05]"
                            strokeWidth="1"
                        />
                        <text x="14" y="183" className="font-mono text-[8px] fill-slate-500 pointer-events-none">
                            Marc N
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
