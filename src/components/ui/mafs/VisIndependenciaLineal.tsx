import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from './InteractionLock';

type MafsVisualizerProps = {
    type: string;
};


const VisIndependenciaLineal = () => {
    const [u, setU] = React.useState<[number, number]>([2, 0.5]);
    const [v, setV] = React.useState<[number, number]>([0.5, 2]);
    const [l1, setL1] = React.useState(1);
    const [l2, setL2] = React.useState(1);
    const [showSpan, setShowSpan] = React.useState(false);

    const comb = [l1 * u[0] + l2 * v[0], l1 * u[1] + l2 * v[1]] as [number, number];

    // Determinant to check LI/LD
    const det = Math.abs(u[0] * v[1] - u[1] * v[0]);
    const isLD = det < 0.2; // Threshold for visual feedback

    return (
        <div className="w-full flex flex-col bg-slate-950">
            <div className="flex-1 relative overflow-hidden">
                <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false}>
                    <Coordinates.Cartesian />

                    {/* Span Visualization - Skewed Grid */}
                    {showSpan && (
                        isLD ? (
                            <Line.ThroughPoints point1={[0, 0]} point2={u} color={Theme.indigo} opacity={0.5} weight={12} />
                        ) : (
                            <>
                                <Polygon
                                    points={[
                                        [-10, -10], [10, -10], [10, 10], [-10, 10]
                                    ]}
                                    color={Theme.indigo}
                                    fillOpacity={0.15}
                                    weight={0}
                                />
                                {[...Array(21)].map((_, i) => {
                                    const val = i - 10;
                                    return (
                                        <React.Fragment key={i}>
                                            <Line.ThroughPoints
                                                point1={[val * u[0] - 10 * v[0], val * u[1] - 10 * v[1]]}
                                                point2={[val * u[0] + 10 * v[0], val * u[1] + 10 * v[1]]}
                                                color={Theme.indigo} opacity={0.2} weight={1}
                                            />
                                            <Line.ThroughPoints
                                                point1={[-10 * u[0] + val * v[0], -10 * u[1] + val * v[1]]}
                                                point2={[10 * u[0] + val * v[0], 10 * u[1] + val * v[1]]}
                                                color={Theme.indigo} opacity={0.2} weight={1}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        )
                    )}

                    {/* Parallelogram helpers */}
                    <Line.Segment point1={[l1 * u[0], l1 * u[1]]} point2={comb} color="gray" opacity={0.3} weight={1} style="dashed" />
                    <Line.Segment point1={[l2 * v[0], l2 * v[1]]} point2={comb} color="gray" opacity={0.3} weight={1} style="dashed" />

                    <MovablePoint point={u} onMove={setU} color={Theme.blue} />
                    <MovablePoint point={v} onMove={setV} color={Theme.red} />

                    <Vector tail={[0, 0]} tip={u} color={Theme.blue} />
                    <Vector tail={[0, 0]} tip={v} color={Theme.red} />

                    {/* Components along u and v */}
                    <Vector tail={[0, 0]} tip={[l1 * u[0], l1 * u[1]]} color={Theme.blue} opacity={0.5} weight={2} />
                    <Vector tail={[0, 0]} tip={[l2 * v[0], l2 * v[1]]} color={Theme.red} opacity={0.5} weight={2} />

                    <Vector tail={[0, 0]} tip={comb} color={Theme.yellow} weight={3} />

                    <LaTeX at={u} tex="u" color={Theme.blue} />
                    <LaTeX at={v} tex="v" color={Theme.red} />
                    <LaTeX at={comb} tex="w = \lambda_1 u + \lambda_2 v" color={Theme.yellow} />
                </Mafs>

                {/* Info Panel */}
                <div className="absolute top-4 right-4 w-64 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-2xl z-20">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estat del Sistema</h4>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${isLD ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                            {isLD ? 'Linealment Dependent (LD)' : 'Linealment Independent (LI)'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono">
                                <span className="text-blue-400 font-bold italic"><InlineMath math={"\\lambda_1"} /> (Escalar u)</span>
                                <span className="text-white bg-blue-500/20 px-1 rounded">{l1.toFixed(1)}</span>
                            </div>
                            <input type="range" min="-2" max="2" step="0.1" value={l1} onChange={(e) => setL1(parseFloat(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-mono">
                                <span className="text-red-400 font-bold italic"><InlineMath math={"\\lambda_2"} /> (Escalar v)</span>
                                <span className="text-white bg-red-500/20 px-1 rounded">{l2.toFixed(1)}</span>
                            </div>
                            <input type="range" min="-2" max="2" step="0.1" value={l2} onChange={(e) => setL2(parseFloat(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        <button type="button"
                            onClick={() => setShowSpan(!showSpan)}
                            className={`w-full py-2 rounded-lg text-[9px] font-bold uppercase transition-all border ${showSpan ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400'}`}
                        >
                            {showSpan ? 'Amagar Subespai Generat' : 'Mostrar Subespai Generat (Span)'}
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                        <p className="text-[9px] text-slate-500 italic leading-relaxed">
                            {isLD
                                ? "Els vectors són col·lineals (LD). El subespai generat és només una RECTA."
                                : "Els vectors apunten en direccions diferents (LI). El subespai generat és tot el PLA."}
                        </p>
                        <div className="bg-black/20 p-2 rounded text-[9px] font-mono text-slate-300">
                            Rang(u, v) = {isLD ? '1' : '2'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-slate-900 border-t border-white/5 text-[10px] text-center text-slate-500">
                <span className="text-white font-bold tracking-tight">LABORATORI DE GENERADORS:</span> Mou els punts <span className="text-blue-400">u</span> i <span className="text-red-400">v</span> per canviar la base del subespai.
            </div>
        </div>
    );
};


export default VisIndependenciaLineal;
