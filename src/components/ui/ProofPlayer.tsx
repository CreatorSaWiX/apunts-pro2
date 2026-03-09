import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Info } from 'lucide-react';
import { proofs } from '../../content/data/proofs';
import GraphVisualizer from './GraphVisualizer';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function ProofPlayer(props: any) {
    // Defensive prop extraction: check for 'proof', 'proofId', or nested 'attributes'
    const id = props.proof || props.proofId || props.attributes?.proof;
    const proof = id ? proofs[id] : null;
    const [currentStep, setCurrentStep] = useState(0);

    if (!proof) {
        return (
            <div className="p-6 my-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex flex-col items-center gap-2">
                <span className="font-bold text-sm uppercase tracking-widest">Error de Visualització</span>
                <span className="text-xs opacity-80">No s'ha trobat la prova: <code className="bg-red-500/20 px-1.5 py-0.5 rounded">{String(id || 'undefined')}</code></span>
            </div>
        );
    }

    const step = proof.steps[currentStep];
    const progress = ((currentStep + 1) / proof.steps.length) * 100;

    const next = () => setCurrentStep(s => Math.min(s + 1, proof.steps.length - 1));
    const prev = () => setCurrentStep(s => Math.max(s - 1, 0));
    const reset = () => setCurrentStep(0);

    return (
        <div className="my-8 bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px]">
            {/* Visualizer Side */}
            <div className="relative flex-1 bg-slate-950/50 overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                <div className="absolute inset-x-0 top-0 h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-sky-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                        >
                            {step.graphData && (
                                <GraphVisualizer
                                    initialData={step.graphData}
                                    showControls={false}
                                    transparentBg={true}
                                    updateTrigger={currentStep}
                                    autoCenter={true}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Step Counter */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono text-slate-400">
                    PAS {currentStep + 1} DE {proof.steps.length}
                </div>
            </div>

            {/* Explanation Side */}
            <div className="w-full md:w-[350px] flex flex-col bg-slate-900/30 backdrop-blur-xl">
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-sky-500/20 rounded-lg">
                            <Info size={16} className="text-sky-400" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Explicació</h4>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <p className="text-slate-200 leading-relaxed text-sm">
                                {step.description}
                            </p>

                            {step.latex && (
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto">
                                    <BlockMath math={step.latex} />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <button
                        onClick={reset}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                        title="Reiniciar"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            disabled={currentStep === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white disabled:opacity-20 hover:bg-white/10 transition-all border border-white/10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            disabled={currentStep === proof.steps.length - 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${currentStep === proof.steps.length - 1
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                : 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20'
                                }`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
