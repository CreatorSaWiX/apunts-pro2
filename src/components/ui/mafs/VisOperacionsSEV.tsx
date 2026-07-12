import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisOperacionsSEV = () => {
    const [tab, setTab] = React.useState<'inter' | 'unio' | 'suma' | 'directa'>('inter');
    const [uVal, setUVal] = React.useState<[number, number]>([1, 1]);
    const [wVal, setWVal] = React.useState<[number, number]>([-1, 1]);

    // Snapping logic for u \in S and w \in W
    // S: y = x, W: y = -x (for Inter/Unio/Suma)
    const u = [(uVal[0] + uVal[1]) / 2, (uVal[0] + uVal[1]) / 2] as [number, number];
    const w = [(wVal[0] - wVal[1]) / 2, -(wVal[0] - wVal[1]) / 2] as [number, number];

    // For Direct Sum, let's use S: y=0 and W: x=0 (eixos)
    const uAxis = [uVal[0], 0] as [number, number];
    const wAxis = [0, wVal[1]] as [number, number];

    const currentU = (tab === 'directa') ? uAxis : u;
    const currentW = (tab === 'directa') ? wAxis : w;
    const sum = [currentU[0] + currentW[0], currentU[1] + currentW[1]] as [number, number];

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex justify-center gap-1 bg-slate-900/60 border-b border-white/5 overflow-x-auto no-scrollbar">
                {[
                    { id: 'inter', label: 'Intersecció', color: 'bg-emerald-600' },
                    { id: 'unio', label: 'Unió', color: 'bg-rose-600' },
                    { id: 'suma', label: 'Suma', color: 'bg-indigo-600' },
                    { id: 'directa', label: 'Suma Directa', color: 'bg-amber-600' }
                ].map((t) => (
                    <button type="button"
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        className={`px-3 py-1.5 rounded text-[9px] font-black uppercase transition-all whitespace-nowrap ${tab === t.id ? `${t.color} text-white shadow-lg` : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 relative overflow-hidden bg-slate-950/40">
                <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />

                    {/* S and W subspaces */}
                    {tab !== 'directa' ? (
                        <>
                            <Plot.OfX y={() => 0} color={Theme.blue} opacity={0.3} weight={1} />
                            <Plot.OfX y={() => 0} color={Theme.red} opacity={0.3} weight={1} />
                        </>
                    ) : (
                        <>
                            <Plot.OfX y={() => 0} color={Theme.blue} opacity={0.3} weight={1} />
                            <Plot.OfY x={() => 0} color={Theme.red} opacity={0.3} weight={1} />
                        </>
                    )}

                    <MovablePoint point={uVal} onMove={setUVal} color={Theme.blue} />
                    <MovablePoint point={wVal} onMove={setWVal} color={Theme.red} />

                    <Vector tail={[0, 0]} tip={currentU} color={Theme.blue} />
                    <Vector tail={[0, 0]} tip={currentW} color={Theme.red} />

                    {/* Operation Visuals */}
                    {tab === 'inter' && (
                        <Circle center={[0, 0]} radius={0.15} color={Theme.green} fillOpacity={1} />
                    )}

                    {tab === 'unio' && (
                        <>
                            <Vector tail={currentU} tip={sum} color={Theme.red} opacity={0.3} weight={1} />
                            <Vector tail={[0, 0]} tip={sum} color={Theme.pink} weight={3} />
                        </>
                    )}

                    {(tab === 'suma' || tab === 'directa') && (
                        <>
                            <Vector tail={currentU} tip={sum} color={Theme.red} opacity={0.3} weight={1} />
                            <Vector tail={currentW} tip={sum} color={Theme.blue} opacity={0.3} weight={1} />
                            <Vector tail={[0, 0]} tip={sum} color={tab === 'suma' ? Theme.indigo : Theme.orange} weight={3} />
                        </>
                    )}

                    <LaTeX at={currentU} tex="s \in S" color={Theme.blue} />
                    <LaTeX at={currentW} tex="w \in W" color={Theme.red} />
                    {tab === 'inter' && <LaTeX at={[0.3, 0.4]} tex="S \cap W = \{0_E\}" color={Theme.green} />}
                    {['unio', 'suma', 'directa'].includes(tab) && (
                        <LaTeX at={sum} tex={tab === 'unio' ? "s+w \\notin S \\cup W" : "v = s+w"} color={tab === 'unio' ? Theme.pink : (tab === 'suma' ? Theme.indigo : Theme.orange)} />
                    )}
                </Mafs>

                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl z-20 w-60">
                    <h5 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${tab === 'inter' ? 'text-emerald-400' : (tab === 'unio' ? 'text-rose-400' : (tab === 'suma' ? 'text-indigo-400' : 'text-amber-400'))}`}>
                        {tab === 'inter' ? 'Intersecció' : (tab === 'unio' ? 'Unió (No SEV)' : (tab === 'suma' ? 'Suma' : 'Suma Directa'))}
                    </h5>

                    <div className="space-y-2 text-[9px] text-slate-400 leading-relaxed italic">
                        {tab === 'inter' && (
                            <p>Els elements que pertanyen a <InlineMath math="S" /> i <InlineMath math="W" /> alhora. Si només és el zero, l'espai és el trivial.</p>
                        )}
                        {tab === 'unio' && (
                            <p>La unió NO és tancada per la suma. En sumar vectors de diferents rectes, el resultat "surt" del conjunt.</p>
                        )}
                        {tab === 'suma' && (
                            <p>El conjunt de totes les possibles sumes <InlineMath math="s+w" />. En aquest cas, la suma de dues rectes cobreix tot el pla <InlineMath math="\\mathbb{R}^2" />.</p>
                        )}
                        {tab === 'directa' && (
                            <p>Si <InlineMath math="S \cap W = \{0_E\}" />, qualsevol vector <InlineMath math="v" /> té una descomposició ÚNICA. Només hi ha un camí possible per arribar a <InlineMath math="v" />.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-3 bg-slate-900/80 border-t border-white/5 text-[10px] text-center text-slate-500 italic">
                <span className="text-white">Explora les 4 operacions</span> arrossegant los vectors de cada subespai.
            </div>
        </div>
    );
};


export default VisOperacionsSEV;
