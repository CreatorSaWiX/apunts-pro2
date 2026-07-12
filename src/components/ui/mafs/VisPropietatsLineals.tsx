import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisPropietatsLineals = () => {
    const [u, setU] = React.useState<[number, number]>([2, 1]);
    const [v, setV] = React.useState<[number, number]>([-1, 2]);
    const [isLinear, setIsLinear] = React.useState(true);

    const sum = [u[0] + v[0], u[1] + v[1]] as [number, number];

    // Transformació lineal (Shear + Rotation-ish)
    const fLinear = (p: [number, number]): [number, number] => [
        p[0] * 0.8 + p[1] * 0.4,
        -p[0] * 0.2 + p[1] * 0.9
    ];

    // Transformació no lineal (Exp/Quadràtica que deforma el pla)
    const fNonLinear = (p: [number, number]): [number, number] => {
        const r = Math.sqrt(p[0]**2 + p[1]**2);
        const factor = 1 + 0.05 * r**2; // Deformació radial
        return [
            (p[0] * 0.8 + p[1] * 0.4) * factor,
            (-p[0] * 0.2 + p[1] * 0.9) * factor
        ];
    };

    const f = isLinear ? fLinear : fNonLinear;

    const fu = f(u);
    const fv = f(v);
    const fsum = f(sum);
    const fSumExpected = [fu[0] + fv[0], fu[1] + fv[1]] as [number, number];

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Control Panel */}
            <div className="p-4 bg-slate-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button type="button" 
                        onClick={() => setIsLinear(true)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${isLinear ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lineal
                    </button>
                    <button type="button" 
                        onClick={() => setIsLinear(false)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${!isLinear ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        No Lineal
                    </button>
                </div>
                
                <div className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] transition-all duration-500 ${isLinear ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    {isLinear ? "f(u + v) = f(u) + f(v)" : "f(u + v) ≠ f(u) + f(v)"}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                {/* DOMINI (E) */}
                <div className="relative border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/20">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Espai de Sortida (E)</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            <span className="text-[10px] text-slate-300 font-bold">Base del Paral·lelogram</span>
                        </div>
                    </div>

                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        {/* Parallelogram Construction */}
                        <Line.Segment point1={u} point2={sum} color="white" opacity={0.1} style="dashed" />
                        <Line.Segment point1={v} point2={sum} color="white" opacity={0.1} style="dashed" />

                        <Vector tail={[0, 0]} tip={u} color={Theme.blue} weight={3} />
                        <Vector tail={[0, 0]} tip={v} color={Theme.red} weight={3} />
                        <Vector tail={[0, 0]} tip={sum} color={Theme.green} weight={4} opacity={0.8} />

                        <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                        <MovablePoint point={v} onMove={setV} color={Theme.red} />

                        <LaTeX at={u} tex="\vec{u}" color={Theme.blue} />
                        <LaTeX at={v} tex="\vec{v}" color={Theme.red} />
                        <LaTeX at={sum} tex="\vec{u}+\vec{v}" color={Theme.green} />
                    </Mafs>
                </div>

                {/* IMATGE (F) */}
                <div className="relative bg-slate-900/10">
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Espai d'Arribada (F)</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isLinear ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            <span className="text-[10px] text-slate-300 font-bold">Transformació f(v)</span>
                        </div>
                    </div>

                    <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false} zoom={false}>
                        <Coordinates.Cartesian />
                        
                        {/* Ghost Parallelogram (Where the sum SHOULD be if it were linear) */}
                        {!isLinear && (
                            <>
                                <Line.Segment point1={fu} point2={fSumExpected} color={Theme.green} opacity={0.2} style="dashed" />
                                <Line.Segment point1={fv} point2={fSumExpected} color={Theme.green} opacity={0.2} style="dashed" />
                                <Circle center={fSumExpected} radius={0.15} color={Theme.green} fillOpacity={0.2} weight={1} />
                                <LaTeX at={[fSumExpected[0], fSumExpected[1] - 0.5]} tex="f(\vec{u})+f(\vec{v})" color={Theme.green} />
                            </>
                        )}

                        {/* Transformed Components */}
                        <Vector tail={[0, 0]} tip={fu} color={Theme.blue} opacity={0.4} weight={2} />
                        <Vector tail={[0, 0]} tip={fv} color={Theme.red} opacity={0.4} weight={2} />
                        
                        {/* THE RESULT: f(u+v) */}
                        <Vector tail={[0, 0]} tip={fsum} color={isLinear ? Theme.green : Theme.yellow} weight={4} />

                        {/* Error Vector when non-linear */}
                        {!isLinear && (
                            <Line.Segment point1={fSumExpected} point2={fsum} color={Theme.red} weight={2} />
                        )}

                        <LaTeX at={fu} tex="f(\vec{u})" color={Theme.blue} />
                        <LaTeX at={fv} tex="f(\vec{v})" color={Theme.red} />
                        <LaTeX at={fsum} tex="f(\vec{u}+\vec{v})" color={isLinear ? Theme.green : Theme.yellow} />
                    </Mafs>

                    {/* Non-linear Alert */}
                    {!isLinear && (
                        <div className="absolute bottom-4 right-4 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 px-3 py-2 rounded-xl">
                            <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-1">Error de Linealitat</span>
                            <p className="text-[10px] text-slate-400 leading-tight max-w-[120px]">
                                La transformació corba l'espai, trencant la suma de vectors.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Educational Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/5 flex items-center justify-center min-h-[60px]">
                <p className="text-[10px] text-slate-400 max-w-2xl text-center leading-relaxed">
                    {isLinear 
                        ? "Les aplicacions lineals conserven les graelles paral·leles. Si sumes dos vectors i després els transformes, arribes al mateix lloc que si primer els transformes i després els sumes."
                        : "Les funcions no lineals (com les quadràtiques o exponencials) 'estiren' o 'dobleguen' l'espai de forma desigual. Això fa que el resultat de la suma es desplaci."}
                </p>
            </div>
        </div>
    );
};


export default VisPropietatsLineals;
