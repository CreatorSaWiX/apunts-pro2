import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisEndomorfismeNilpotent = () => {
    const [v, setV] = React.useState<[number, number]>([3, 2]);
    const [step, setStep] = React.useState(0);
    
    // f(x,y) = (y, 0) -> Nilpotent de grau 2
    const v0 = v;
    const v1: [number, number] = [v[1], 0];
    const v2: [number, number] = [0, 0];
    
    const points = [v0, v1, v2];
    const currentV = points[step];

    return (
        <div className="flex flex-col bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Endomorfisme Nilpotent</span>
                    <span className="text-[12px] text-slate-400 font-serif italic font-medium tracking-tight">Aplicació Iterada: fᵏ(v) = 0</span>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {[0, 1, 2].map((s) => (
                        <button type="button"
                            key={s}
                            onClick={() => setStep(s)}
                            className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Pas {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[400px] relative bg-slate-900/20">
                <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                    <Coordinates.Cartesian />
                    
                    {/* Trails */}
                    {step > 0 && <Vector tail={[0, 0]} tip={v0} color={Theme.blue} opacity={0.05} style="dashed" />}
                    {step > 1 && <Vector tail={[0, 0]} tip={v1} color={Theme.indigo} opacity={0.1} style="dashed" />}
                    
                    <Vector tail={[0, 0]} tip={currentV} color={step === 0 ? Theme.blue : step === 1 ? Theme.indigo : Theme.red} weight={4} />
                    
                    {step === 0 && <MovablePoint point={v} onMove={setV} color={Theme.blue} />}
                    
                    <LaTeX at={currentV} tex={step === 0 ? "\\vec{v}" : step === 1 ? "f(\\vec{v})" : "f^2(\\vec{v}) = \\vec{0}"} color={step === 0 ? Theme.blue : step === 1 ? Theme.indigo : Theme.red} />
                </Mafs>

                {step === 2 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                            <div className="relative text-center p-8 rounded-3xl border border-white/10 bg-black/40">
                                <span className="text-5xl block mb-4">🌀</span>
                                <span className="text-[14px] font-black text-white uppercase tracking-[0.4em] drop-shadow-2xl">Vòrtex Nul</span>
                                <p className="text-[10px] text-slate-400 mt-2 font-mono italic">L'espai s'ha col·lapsat a l'origen.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    <strong className="text-white">Interactua:</strong> Mou el vector <span className="text-blue-400 font-bold">v</span> al Pas 0. 
                    Canvia als passos 1 i 2 per veure com l'aplicació "menja" dimensions fins a fer desaparèixer el vector al centre. 
                    Un endomorfisme nilpotent és una transformació que, tard o d'hora, ho envia tot al zero.
                </p>
            </div>
        </div>
    );
};

export default VisEndomorfismeNilpotent;
