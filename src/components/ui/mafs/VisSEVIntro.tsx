import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisSEVIntro = () => {
    const [mode, setMode] = React.useState<'sev' | 'non_sev'>('sev');
    const [u, setU] = React.useState<[number, number]>([1, 1]);
    const [v, setV] = React.useState<[number, number]>([-0.5, -0.5]);

    // SEV: y = x (Line through origin)
    // Non-SEV: y = x + 1 (Line NOT through origin)

    // Projection functions to "snap" u and v to S
    const snapToS = (pt: [number, number]): [number, number] => {
        if (mode === 'sev') {
            const avg = (pt[0] + pt[1]) / 2;
            return [avg, avg];
        } else {
            // y = x + 1 => x - y + 1 = 0. Normal (1, -1). 
            // Dist = (x0 - y0 + 1) / sqrt(2).
            // Pt = (x0, y0) - Dist * (1, -1) / sqrt(2)
            const d = (pt[0] - pt[1] + 1) / 2;
            return [pt[0] - d, pt[1] + d];
        }
    };

    const uSnapped: [number, number] = snapToS(u);
    const vSnapped: [number, number] = snapToS(v);
    const sum: [number, number] = [uSnapped[0] + vSnapped[0], uSnapped[1] + vSnapped[1]];

    const isSumInS = mode === 'sev'
        ? Math.abs(sum[0] - sum[1]) < 0.01
        : Math.abs(sum[0] - sum[1] + 1) < 0.01;

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex justify-center gap-2 bg-slate-900/60 border-b border-white/5">
                <button type="button" onClick={() => setMode('sev')} className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${mode === 'sev' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Recta SEV (y = x)</button>
                <button type="button" onClick={() => setMode('non_sev')} className={`px-3 py-1 rounded text-[10px] font-black uppercase transition-all ${mode === 'non_sev' ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>No és SEV (y = x + 1)</button>
            </div>

            <div className="flex-1 relative overflow-hidden bg-slate-950/40">
                <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />

                    {/* The Set S */}
                    <Plot.OfX
                        y={mode === 'sev' ? ((_x: number) => _x) : ((_x: number) => _x + 1)}
                        color={mode === 'sev' ? Theme.indigo : Theme.red}
                        weight={mode === 'sev' ? 2 : 4}
                        opacity={0.5}
                    />

                    <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                    <MovablePoint point={v} onMove={setV} color={Theme.red} />

                    {/* Visual vectors snapped to S */}
                    <Vector tail={[0, 0]} tip={uSnapped} color={Theme.blue} />
                    <Vector tail={[0, 0]} tip={vSnapped} color={Theme.red} />
                    <Vector tail={uSnapped} tip={sum} color={Theme.red} opacity={0.3} weight={1} />
                    <Vector tail={[0, 0]} tip={sum} color={isSumInS ? Theme.yellow : Theme.pink} weight={3} />

                    <LaTeX at={uSnapped} tex="u \in S" color={Theme.blue} />
                    <LaTeX at={vSnapped} tex="v \in S" color={Theme.red} />
                    <LaTeX at={sum} tex={isSumInS ? "u+v \\in S" : "u+v \\notin S"} color={isSumInS ? Theme.yellow : Theme.pink} />

                    {mode === 'non_sev' && <Circle center={[0, 0]} radius={0.1} color={Theme.foreground} />}
                </Mafs>

                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl z-20 w-56">
                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Verificació SEV</h5>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${mode === 'sev' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {mode === 'sev' ? "✓" : "✗"}
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium">Conté el vector nul <InlineMath math="0_E" />?</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${isSumInS ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {isSumInS ? "✓" : "✗"}
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium">Suma tancada (<InlineMath math="u+v \in S" />)?</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/5">
                            <p className="text-[8px] text-slate-500 leading-relaxed italic">
                                {mode === 'sev'
                                    ? "Com que la recta passa per l'origen, qualsevol suma de vectors de la recta es manté dins de la recta."
                                    : "En no passar per l'origen, la suma s'escapa del conjunt. No es compleix la clausura."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-slate-900/80 border-t border-white/5 text-[9px] text-center text-slate-400 italic">
                <span className="text-white">Arrossega els punts</span> sobre la recta per comprovar les condicions de subespai.
            </div>
        </div>
    );
};


export default VisSEVIntro;
