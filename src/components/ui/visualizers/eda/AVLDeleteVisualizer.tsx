"use client";

import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

interface TreeNode {
    id: number;
    val: number;
    x: number;
    y: number;
    balance: number;
    height: number;
    variant?: "normal" | "new" | "unbalanced" | "rotating" | "target";
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
    // Pas 1: Arbre inicial de 10 nodes (Alçada 4)
    {
        stepTitle: "1. Arbre inicial (10 nodes, alçada 4)",
        actionDetail: "Arbre AVL inicialment equilibrat abans d'eliminar la clau 15",
        nodes: [
            { id: 50, val: 50, x: 280, y: 42, balance: 0, height: 4, variant: "normal" },
            { id: 25, val: 25, x: 145, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 75, val: 75, x: 415, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 15, val: 15, x: 85, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 35, val: 35, x: 205, y: 175, balance: 1, height: 2, variant: "normal" },
            { id: 65, val: 65, x: 355, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 85, val: 85, x: 475, y: 175, balance: 0, height: 2, variant: "normal" },
            { id: 30, val: 30, x: 165, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 80, val: 80, x: 435, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 90, val: 90, x: 515, y: 245, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 50, to: 25 },
            { from: 50, to: 75 },
            { from: 25, to: 15 },
            { from: 25, to: 35 },
            { from: 35, to: 30 },
            { from: 75, to: 65 },
            { from: 75, to: 85 },
            { from: 85, to: 80 },
            { from: 85, to: 90 },
        ],
    },

    // Pas 2: Localització de la clau 15 a eliminar
    {
        stepTitle: "2. Cerca i selecció de la clau 15 a eliminar",
        actionDetail: "Es localitza el node fulla 15 marcat per ser eliminat",
        nodes: [
            { id: 50, val: 50, x: 280, y: 42, balance: 0, height: 4, variant: "normal" },
            { id: 25, val: 25, x: 145, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 75, val: 75, x: 415, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 15, val: 15, x: 85, y: 175, balance: 0, height: 1, variant: "target" },
            { id: 35, val: 35, x: 205, y: 175, balance: 1, height: 2, variant: "normal" },
            { id: 65, val: 65, x: 355, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 85, val: 85, x: 475, y: 175, balance: 0, height: 2, variant: "normal" },
            { id: 30, val: 30, x: 165, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 80, val: 80, x: 435, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 90, val: 90, x: 515, y: 245, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 50, to: 25 },
            { from: 50, to: 75 },
            { from: 25, to: 15, variant: "rotating" },
            { from: 25, to: 35 },
            { from: 35, to: 30 },
            { from: 75, to: 65 },
            { from: 75, to: 85 },
            { from: 85, to: 80 },
            { from: 85, to: 90 },
        ],
    },

    // Pas 3: Eliminació física de 15 i detecció de desequilibri (bal = -2, Cas RL)
    {
        stepTitle: "3. Eliminació del node 15 (Desequilibri al node 25, Cas RL)",
        actionDetail: "fesq(25) queda buit -> bal(25) = -2 i bal(35) = +1: requereix rotació doble RL",
        nodes: [
            { id: 50, val: 50, x: 280, y: 42, balance: 0, height: 4, variant: "normal" },
            { id: 25, val: 25, x: 145, y: 105, balance: -2, height: 3, variant: "unbalanced" },
            { id: 75, val: 75, x: 415, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 35, val: 35, x: 205, y: 175, balance: 1, height: 2, variant: "rotating" },
            { id: 65, val: 65, x: 355, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 85, val: 85, x: 475, y: 175, balance: 0, height: 2, variant: "normal" },
            { id: 30, val: 30, x: 165, y: 245, balance: 0, height: 1, variant: "rotating" },
            { id: 80, val: 80, x: 435, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 90, val: 90, x: 515, y: 245, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 50, to: 25 },
            { from: 50, to: 75 },
            { from: 25, to: 35, variant: "rotating" },
            { from: 35, to: 30, variant: "rotating" },
            { from: 75, to: 65 },
            { from: 75, to: 85 },
            { from: 85, to: 80 },
            { from: 85, to: 90 },
        ],
    },

    // Pas 4: Rotació doble RL - Fase 1: Rotació simple a la dreta LL al fill 35
    {
        stepTitle: "4. Rotació doble RL: Fase 1 (Rotació dreta LL al fill 35)",
        actionDetail: "El node 30 puja a la posició de 35 (alineació en ziga-zaga convertida a RR)",
        nodes: [
            { id: 50, val: 50, x: 280, y: 42, balance: 0, height: 4, variant: "normal" },
            { id: 25, val: 25, x: 145, y: 105, balance: -2, height: 3, variant: "unbalanced" },
            { id: 75, val: 75, x: 415, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 30, val: 30, x: 205, y: 175, balance: -1, height: 2, variant: "rotating" },
            { id: 35, val: 35, x: 245, y: 245, balance: 0, height: 1, variant: "rotating" },
            { id: 65, val: 65, x: 355, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 85, val: 85, x: 475, y: 175, balance: 0, height: 2, variant: "normal" },
            { id: 80, val: 80, x: 435, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 90, val: 90, x: 515, y: 245, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 50, to: 25 },
            { from: 50, to: 75 },
            { from: 25, to: 30, variant: "rotating" },
            { from: 30, to: 35, variant: "rotating" },
            { from: 75, to: 65 },
            { from: 75, to: 85 },
            { from: 85, to: 80 },
            { from: 85, to: 90 },
        ],
    },

    // Pas 5: Rotació doble RL - Fase 2: Rotació simple a l'esquerra RR al node 25 (Arbre final reequilibrat)
    {
        stepTitle: "5. Rotació doble RL: Fase 2 (Rotació esquerra RR al node 25) - Arbre Final",
        actionDetail: "El node 30 puja a la posició de 25 amb fills 25 i 35. Arbre completament reequilibrat!",
        nodes: [
            { id: 50, val: 50, x: 280, y: 42, balance: -1, height: 4, variant: "normal" },
            { id: 30, val: 30, x: 145, y: 105, balance: 0, height: 2, variant: "normal" },
            { id: 75, val: 75, x: 415, y: 105, balance: -1, height: 3, variant: "normal" },
            { id: 25, val: 25, x: 95, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 35, val: 35, x: 195, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 65, val: 65, x: 355, y: 175, balance: 0, height: 1, variant: "normal" },
            { id: 85, val: 85, x: 475, y: 175, balance: 0, height: 2, variant: "normal" },
            { id: 80, val: 80, x: 435, y: 245, balance: 0, height: 1, variant: "normal" },
            { id: 90, val: 90, x: 515, y: 245, balance: 0, height: 1, variant: "normal" },
        ],
        edges: [
            { from: 50, to: 30 },
            { from: 50, to: 75 },
            { from: 30, to: 25 },
            { from: 30, to: 35 },
            { from: 75, to: 65 },
            { from: 75, to: 85 },
            { from: 85, to: 80 },
            { from: 85, to: 90 },
        ],
    },
];

export default function AVLDeleteVisualizer() {
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
        }, 2000);

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
                    viewBox="0 0 560 290"
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
                        <AnimatePresence>
                            {step.nodes.map((node) => {
                                const isUnbalanced = node.variant === "unbalanced";
                                const isNew = node.variant === "new";
                                const isRotating = node.variant === "rotating";
                                const isTarget = node.variant === "target";

                                let strokeColor = "#334155";
                                let fillColor = "#0b1220";
                                let textColor = "#f1f5f9";

                                if (isUnbalanced) {
                                    strokeColor = "#f43f5e";
                                    fillColor = "#260e14";
                                    textColor = "#fda4af";
                                } else if (isTarget) {
                                    strokeColor = "#fb923c";
                                    fillColor = "#2a1508";
                                    textColor = "#fed7aa";
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
                                        exit={{ scale: 0.1, opacity: 0 }}
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
                                        {isTarget && (
                                            <circle
                                                cx={0}
                                                cy={0}
                                                r={23}
                                                fill="none"
                                                stroke="#fb923c"
                                                strokeWidth="1.5"
                                                strokeDasharray="4 2"
                                                className="animate-pulse"
                                            />
                                        )}

                                        {/* Cercle del node */}
                                        <circle
                                            cx={0}
                                            cy={0}
                                            r={17}
                                            fill={fillColor}
                                            stroke={strokeColor}
                                            strokeWidth={isUnbalanced || isNew || isRotating || isTarget ? 2.2 : 1.6}
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
                        </AnimatePresence>
                    </g>
                </svg>
            </div>

        </div>
    );
}
