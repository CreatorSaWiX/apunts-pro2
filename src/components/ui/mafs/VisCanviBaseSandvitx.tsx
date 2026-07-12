import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisCanviBaseSandvitx = () => {
    const [step, setStep] = React.useState(0);
    const [v_B, setV_B] = React.useState<[number, number]>([1, 1]);

    // Base B: b1=(2,0.5), b2=(0.5,1.5)
    const mB = [[2, 0.5], [0.5, 1.5]]; 
    // Base W: w1=(1,0), w2=(1,1)
    const mW = [[1, 1], [0, 1]];
    const mW_inv = [[1, -1], [0, 1]];
    
    // Aplicació f en canònica: Rotació 30º + Escalat
    const mF = [[1.5 * Math.cos(Math.PI/6), -Math.sin(Math.PI/6)], [1.5 * Math.sin(Math.PI/6), Math.cos(Math.PI/6)]];

    const v_C: [number, number] = [mB[0][0]*v_B[0] + mB[0][1]*v_B[1], mB[1][0]*v_B[0] + mB[1][1]*v_B[1]];
    const fv_C: [number, number] = [mF[0][0]*v_C[0] + mF[0][1]*v_C[1], mF[1][0]*v_C[0] + mF[1][1]*v_C[1]];
    const fv_W: [number, number] = [mW_inv[0][0]*fv_C[0] + mW_inv[0][1]*fv_C[1], mW_inv[1][0]*fv_C[0] + mW_inv[1][1]*fv_C[1]];

    const steps = [
        { 
            label: "1. Inici en Base B", 
            desc: "Comencem amb les coordenades relatives a la base B.", 
            vec: v_B, 
            grid: mB, 
            color: Theme.blue, 
            formula: "[v]_B", 
            isCanonical: false 
        },
        { 
            label: "2. Salt a Canònica", 
            desc: "Multipliquem per P(C←B) per 'desxifrar' el vector en l'espai estàndard.", 
            vec: v_C, 
            grid: [[1, 0], [0, 1]], 
            color: Theme.indigo, 
            formula: "P_{C \\leftarrow B} \\cdot [v]_B = [v]_C", 
            isCanonical: true 
        },
        { 
            label: "3. Transformació f", 
            desc: "Apliquem la matriu de l'aplicació en bases canòniques (la més fàcil).", 
            vec: fv_C, 
            grid: [[1, 0], [0, 1]], 
            color: Theme.orange, 
            formula: "M_C^C \\cdot [v]_C = [f(v)]_C", 
            isCanonical: true 
        },
        { 
            label: "4. Salt a Base W", 
            desc: "Multipliquem per P(W←C) per expressar el resultat en la base d'arribada.", 
            vec: fv_W, 
            grid: mW, 
            color: Theme.green, 
            formula: "P_{W \\leftarrow C} \\cdot [f(v)]_C = [f(v)]_W", 
            isCanonical: false 
        }
    ];

    const current = steps[step];

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden border border-white/5 rounded-2xl shadow-2xl">
            <div className="p-6 bg-slate-900/80 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{current.label}</span>
                    <p className="text-[11px] text-slate-400 italic max-w-sm leading-tight">{current.desc}</p>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {steps.map((_, s) => (
                        <button type="button"
                            key={s}
                            onClick={() => setStep(s)}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Pas {s+1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative bg-slate-900/20 min-h-[400px]">
                <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false} zoom={false}>
                    <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: 1 }} />
                    
                    {!current.isCanonical && Array.from({ length: 11 }).map((_, i) => {
                        const idx = i - 5;
                        return (
                            <React.Fragment key={idx}>
                                <Line.Segment 
                                    point1={[idx * current.grid[0][0] - 10 * current.grid[0][1], idx * current.grid[1][0] - 10 * current.grid[1][1]]}
                                    point2={[idx * current.grid[0][0] + 10 * current.grid[0][1], idx * current.grid[1][0] + 10 * current.grid[1][1]]}
                                    color="white" opacity={0.05} weight={1}
                                />
                                <Line.Segment 
                                    point1={[-10 * current.grid[0][0] + idx * current.grid[0][1], -10 * current.grid[1][0] + idx * current.grid[1][1]]}
                                    point2={[10 * current.grid[0][0] + idx * current.grid[0][1], 10 * current.grid[1][0] + idx * current.grid[1][1]]}
                                    color="white" opacity={0.05} weight={1}
                                />
                            </React.Fragment>
                        );
                    })}

                    <Vector tail={[0,0]} tip={[current.grid[0][0], current.grid[1][0]]} color={Theme.blue} weight={3} />
                    <Vector tail={[0,0]} tip={[current.grid[0][1], current.grid[1][1]]} color={Theme.red} weight={3} />
                    
                    {/* Basis vector labels with offsets to avoid axis overlap */}
                    <LaTeX at={[current.grid[0][0] + 0.3, current.grid[1][0] - 0.2]} tex="\vec{b}_1" color={Theme.blue} />
                    <LaTeX at={[current.grid[0][1] - 0.4, current.grid[1][1] + 0.3]} tex="\vec{b}_2" color={Theme.red} />

                    <Vector tail={[0, 0]} tip={current.vec} color={current.color} weight={5} />
                    {step === 0 && <MovablePoint point={v_B} onMove={setV_B} color={Theme.blue} />}
                </Mafs>
                
                {/* Modern UI Formula Overlay */}
                <div className="absolute top-4 right-4 animate-in slide-in-from-right-4 duration-500 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-4 rounded-2xl border border-white/10 shadow-2xl">
                        <span className="block text-[8px] font-black text-slate-500 uppercase mb-3 tracking-[0.2em]">Fórmula del Pas</span>
                        <div className="text-white flex justify-center scale-110 origin-center">
                            <InlineMath math={current.formula} />
                        </div>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
                    {[0, 1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${step >= s ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] scale-110' : 'bg-slate-800'}`} />
                            {s < 3 && <div className={`h-0.5 w-10 rounded-full transition-all duration-700 ${step > s ? 'bg-indigo-500' : 'bg-slate-800'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    La tècnica de la <strong className="text-white">Sandvitx</strong> ens permet aplicar una transformació f d'una base qualsevol B a una base qualsevol W, passant per la canònica.
                </p>
            </div>
        </div>
    );
};


export default VisCanviBaseSandvitx;
