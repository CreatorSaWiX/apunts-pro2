"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import { Play, Pause, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

interface TreeNode {
    id: number;
    val: number;
    x: number;
    y: number;
    balance: number;
    height: number;
    variant?: "normal" | "new" | "unbalanced" | "rotating";
}

interface TreeEdge {
    from: number;
    to: number;
    variant?: "normal" | "rotating";
}

interface StepData {
    stepTitle: string;
    actionDetail: string;
    nodes: TreeNode[];
    edges: TreeEdge[];
}

const STEPS: StepData[] = [
    // 0. Arbre inicial donat a l'enunciat
    {
        stepTitle: "1. Arbre inicial (donat a l'enunciat)",
        actionDetail: "Estat abans d'afegir la clau 11",
        nodes: [
            { id: 7, val: 7, x: 270, y: 42, balance: -1, height: 3, variant: "normal" },
            { id: 4, val: 4, x: 160, y: 105, balance: -1, height: 2, variant: "normal" },
            { id: 12, val: 12, x: 380, y: 105, balance: 1, height: 3, variant: "normal" },
            { id: 5, val: 5, x: 205, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 9, val: 9, x: 320, y: 172, balance: 0, height: 2, variant: "normal" },
            { id: 14, val: 14, x: 440, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 8, val: 8, x: 280, y: 240, balance: 0, height: 1, variant: "normal" },
            { id: 10, val: 10, x: 360, y: 240, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 7, to: 4 },
            { from: 7, to: 12 },
            { from: 4, to: 5 },
            { from: 12, to: 9 },
            { from: 12, to: 14 },
            { from: 9, to: 8 },
            { from: 9, to: 10 },
        ],
    },

    // 1. Inserció de 11 (Desequilibri LR al node 12)
    {
        stepTitle: "2. Inserció del 11 (Desequilibri al node 12)",
        actionDetail: "11 > 10: fill dret de 10 -> bal(12) = +2 (Cas LR)",
        nodes: [
            { id: 7, val: 7, x: 270, y: 42, balance: -1, height: 4, variant: "normal" },
            { id: 4, val: 4, x: 160, y: 105, balance: -1, height: 2, variant: "normal" },
            { id: 12, val: 12, x: 380, y: 105, balance: 2, height: 4, variant: "unbalanced" },
            { id: 5, val: 5, x: 205, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 9, val: 9, x: 320, y: 172, balance: -1, height: 3, variant: "rotating" },
            { id: 14, val: 14, x: 440, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 8, val: 8, x: 280, y: 240, balance: 0, height: 1, variant: "normal" },
            { id: 10, val: 10, x: 360, y: 240, balance: -1, height: 2, variant: "rotating" },
            { id: 11, val: 11, x: 395, y: 285, balance: 0, height: 1, variant: "new" },
        ],
        edges: [
            { from: 7, to: 4 },
            { from: 7, to: 12 },
            { from: 4, to: 5 },
            { from: 12, to: 9, variant: "rotating" },
            { from: 12, to: 14 },
            { from: 9, to: 8 },
            { from: 9, to: 10, variant: "rotating" },
            { from: 10, to: 11, variant: "rotating" },
        ],
    },

    // 2. Rotació doble LR - Fase 1: Rotació simple a l'esquerra al fill 9 (fa pujar el 10)
    {
        stepTitle: "3. Rotació doble LR: Fase 1 (Rotació RR al fill 9)",
        actionDetail: "El node 10 puja entre el 12 i el 9",
        nodes: [
            { id: 7, val: 7, x: 270, y: 42, balance: -1, height: 4, variant: "normal" },
            { id: 4, val: 4, x: 160, y: 105, balance: -1, height: 2, variant: "normal" },
            { id: 12, val: 12, x: 410, y: 105, balance: 2, height: 4, variant: "unbalanced" },
            { id: 5, val: 5, x: 205, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 10, val: 10, x: 335, y: 172, balance: 1, height: 3, variant: "rotating" },
            { id: 14, val: 14, x: 470, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 9, val: 9, x: 285, y: 240, balance: 0, height: 2, variant: "rotating" },
            { id: 11, val: 11, x: 375, y: 240, balance: 0, height: 1, variant: "new" },
            { id: 8, val: 8, x: 250, y: 285, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 7, to: 4 },
            { from: 7, to: 12 },
            { from: 4, to: 5 },
            { from: 12, to: 10, variant: "rotating" },
            { from: 12, to: 14 },
            { from: 10, to: 9, variant: "rotating" },
            { from: 10, to: 11, variant: "rotating" },
            { from: 9, to: 8 },
        ],
    },

    // 3. Rotació doble LR - Fase 2: Rotació simple a la dreta al node 12 (Arbre final equilibrat!)
    {
        stepTitle: "4. Rotació doble LR: Fase 2 (Rotació LL al 12) - Arbre Final",
        actionDetail: "El 10 puja com a fill de 7 amb 9 i 12 com a fills",
        nodes: [
            { id: 7, val: 7, x: 270, y: 42, balance: -1, height: 4, variant: "normal" },
            { id: 4, val: 4, x: 160, y: 105, balance: -1, height: 2, variant: "normal" },
            { id: 10, val: 10, x: 380, y: 105, balance: 0, height: 3, variant: "rotating" },
            { id: 5, val: 5, x: 205, y: 172, balance: 0, height: 1, variant: "normal" },
            { id: 9, val: 9, x: 320, y: 172, balance: 1, height: 2, variant: "normal" },
            { id: 12, val: 12, x: 440, y: 172, balance: 0, height: 2, variant: "normal" },
            { id: 8, val: 8, x: 280, y: 240, balance: 0, height: 1, variant: "normal" },
            { id: 11, val: 11, x: 400, y: 240, balance: 0, height: 1, variant: "new" },
            { id: 14, val: 14, x: 480, y: 240, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 7, to: 4 },
            { from: 7, to: 10 },
            { from: 4, to: 5 },
            { from: 10, to: 9 },
            { from: 10, to: 12 },
            { from: 9, to: 8 },
            { from: 12, to: 11 },
            { from: 12, to: 14 },
        ],
    },
];

export default function AVLInsertVisualizer() {
    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const step = STEPS[currentStepIdx];
    const nodeMap = new Map<number, TreeNode>(step.nodes.map(n => [n.id, n]));

    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentStepIdx(prev => {
                if (prev >= STEPS.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1800);

        return () => clearInterval(timer);
    }, [isPlaying]);

    const prevStep = () => {
        setIsPlaying(false);
        setCurrentStepIdx(prev => Math.max(0, prev - 1));
    };

    const nextStep = () => {
        setIsPlaying(false);
        setCurrentStepIdx(prev => Math.min(STEPS.length - 1, prev + 1));
    };

    const reset = () => {
        setIsPlaying(false);
        setCurrentStepIdx(0);
    };

    const togglePlay = () => {
        if (currentStepIdx >= STEPS.length - 1) {
            setCurrentStepIdx(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(prev => !prev);
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-4 my-8 font-sans select-none not-prose px-2">
            
            {/* 1. BARRA DE CONTROLS: NOMÉS ELS 4 BOTONS */}
            <div className="w-full max-w-2xl flex items-center justify-end gap-1.5 px-2">
                <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? "Pausar" : "Reproduir pas a pas"}
                    className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isPlaying
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-900/60 hover:bg-slate-800 border-white/10 text-slate-300"
                    }`}
                >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStepIdx === 0}
                    title="Pas anterior"
                    className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                >
                    <ArrowLeft size={14} />
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={currentStepIdx === STEPS.length - 1}
                    title="Següent pas"
                    className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                >
                    <ArrowRight size={14} />
                </button>
                <button
                    type="button"
                    onClick={reset}
                    title="Reiniciar a l'estat inicial"
                    className="p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-300 transition cursor-pointer ml-0.5"
                >
                    <RotateCcw size={14} />
                </button>
            </div>

            {/* 2. ARBRE SVG AMB ANIMACIONS FRAMER-MOTION I FONS TRANSPARENT */}
            <div className="w-full max-w-2xl bg-transparent flex flex-col items-center justify-center relative select-none">
                <svg
                    viewBox="0 0 540 300"
                    className="w-full h-auto overflow-visible select-none"
                >
                    {/* Arestes animades */}
                    <g>
                        {step.edges.map((edge) => {
                            const fromNode = nodeMap.get(edge.from);
                            const toNode = nodeMap.get(edge.to);
                            if (!fromNode || !toNode) return null;

                            const isRotating = edge.variant === "rotating";

                            return (
                                <motion.line
                                    key={`edge-${edge.from}-${edge.to}`}
                                    initial={{
                                        x1: fromNode.x,
                                        y1: fromNode.y,
                                        x2: toNode.x,
                                        y2: toNode.y,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x1: fromNode.x,
                                        y1: fromNode.y,
                                        x2: toNode.x,
                                        y2: toNode.y,
                                        opacity: 1,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 28,
                                    }}
                                    stroke={isRotating ? "#a855f7" : "#334155"}
                                    strokeWidth={isRotating ? 2.4 : 1.8}
                                    strokeDasharray={isRotating ? "4 2" : undefined}
                                />
                            );
                        })}
                    </g>

                    {/* Nodes animats */}
                    <g>
                        {step.nodes.map((node) => {
                            const isUnbalanced = node.variant === "unbalanced";
                            const isNew = node.variant === "new";
                            const isRotating = node.variant === "rotating";

                            let strokeColor = "#334155";
                            let fillColor = "#0b1220";
                            let textColor = "#f1f5f9";

                            if (isUnbalanced) {
                                strokeColor = "#f43f5e";
                                fillColor = "#260e14";
                                textColor = "#fda4af";
                            } else if (isRotating) {
                                strokeColor = "#c084fc";
                                fillColor = "#1f1035";
                                textColor = "#e9d5ff";
                            } else if (isNew) {
                                strokeColor = "#38bdf8";
                                fillColor = "#081d2f";
                                textColor = "#7dd3fc";
                            }

                            const balText = node.balance > 0 ? `+${node.balance}` : `${node.balance}`;
                            const isCriticalBal = Math.abs(node.balance) >= 2;

                            return (
                                <motion.g
                                    key={`node-${node.id}`}
                                    initial={{
                                        x: node.x,
                                        y: node.y,
                                        scale: 0.1,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: node.x,
                                        y: node.y,
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    style={{
                                        transformOrigin: "0px 0px",
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 28,
                                    }}
                                >
                                    {/* Anell giratori quan el node està desequilibrat */}
                                    {isUnbalanced && (
                                        <circle
                                            cx={0}
                                            cy={0}
                                            r={24}
                                            fill="none"
                                            stroke="#f43f5e"
                                            strokeWidth="1.5"
                                            strokeDasharray="3 3"
                                            className="animate-spin"
                                            style={{ animationDuration: '6s' }}
                                        />
                                    )}

                                    {/* Cercle del node */}
                                    <circle
                                        cx={0}
                                        cy={0}
                                        r={17}
                                        fill={fillColor}
                                        stroke={strokeColor}
                                        strokeWidth={isUnbalanced || isNew || isRotating ? 2.2 : 1.6}
                                    />

                                    {/* Valor del node */}
                                    <text
                                        x={0}
                                        y={0}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill={textColor}
                                        fontSize="13"
                                        fontWeight="bold"
                                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                                    >
                                        {node.val}
                                    </text>

                                    {/* Factor d'equilibri bal */}
                                    <g transform="translate(18, -12)">
                                        <rect
                                            x="-2"
                                            y="-7"
                                            width={isCriticalBal ? 42 : 34}
                                            height={14}
                                            rx="3"
                                            fill={isCriticalBal ? "#3f121d" : "#0d1b2a"}
                                            stroke={isCriticalBal ? "#f43f5e" : "#38bdf8"}
                                            strokeWidth="0.8"
                                        />
                                        <text
                                            x={isCriticalBal ? 19 : 15}
                                            y={0}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill={isCriticalBal ? "#fb7185" : "#7dd3fc"}
                                            fontSize="9"
                                            fontWeight="bold"
                                            fontFamily="ui-monospace, monospace"
                                        >
                                            {`bal:${balText}`}
                                        </text>
                                    </g>

                                    {/* Alçada h */}
                                    <text
                                        x={0}
                                        y={27}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill="#64748b"
                                        fontSize="9"
                                        fontFamily="ui-monospace, monospace"
                                    >
                                        {`h=${node.height}`}
                                    </text>
                                </motion.g>
                            );
                        })}
                    </g>
                </svg>
            </div>

        </div>
    );
}
