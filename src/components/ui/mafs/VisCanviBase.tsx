import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisCanviBase = () => {
    const [u1, setU1] = React.useState<[number, number]>([1.5, 0.5]);
    const [u2, setU2] = React.useState<[number, number]>([-0.5, 1.5]);
    const [v, setV] = React.useState<[number, number]>([1, 2]);
    const [showGrid, setShowGrid] = React.useState(true);

    // Calculate coordinates (l1, l2) such that v = l1*u1 + l2*u2
    // Matrix: [u1 u2] * [l1 l2]^T = v
    const det = u1[0] * u2[1] - u1[1] * u2[0];
    const isBase = Math.abs(det) > 0.1;

    // Inverse matrix for coordinates
    const l1 = isBase ? (v[0] * u2[1] - v[1] * u2[0]) / det : 0;
    const l2 = isBase ? (u1[0] * v[1] - u1[1] * v[0]) / det : 0;

    return (
        <div className="w-full flex flex-col bg-slate-950">
            <div className="flex-1 relative overflow-hidden">
                <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} pan={false}>
                    <g opacity={showGrid ? 0.05 : 0.3}>
                        <Coordinates.Cartesian />
                    </g>

                    {/* The Skewed Basis Grid - Manual High Visibility Loop */}
                    {showGrid && isBase && (
                        <>
                            {[...Array(41)].map((_, i) => {
                                const val = i - 20;
                                return (
                                    <React.Fragment key={i}>
                                        {/* Lines parallel to u2, spaced along u1 */}
                                        <Line.ThroughPoints
                                            point1={[val * u1[0] - 20 * u2[0], val * u1[1] - 20 * u2[1]]}
                                            point2={[val * u1[0] + 20 * u2[0], val * u1[1] + 20 * u2[1]]}
                                            color={Theme.indigo} opacity={0.3} weight={1}
                                        />
                                        {/* Lines parallel to u1, spaced along u2 */}
                                        <Line.ThroughPoints
                                            point1={[-20 * u1[0] + val * u2[0], -20 * u1[1] + val * u2[1]]}
                                            point2={[20 * u1[0] + val * u2[0], 20 * u1[1] + val * u2[1]]}
                                            color={Theme.indigo} opacity={0.3} weight={1}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </>
                    )}

                    {/* Parallelogram Projection */}
                    {isBase && (
                        <>
                            <Line.Segment point1={[l1 * u1[0], l1 * u1[1]]} point2={v} color="gray" opacity={0.3} weight={1} style="dashed" />
                            <Line.Segment point1={[l2 * u2[0], l2 * u2[1]]} point2={v} color="gray" opacity={0.3} weight={1} style="dashed" />
                        </>
                    )}

                    <MovablePoint point={u1} onMove={setU1} color={Theme.blue} />
                    <MovablePoint point={u2} onMove={setU2} color={Theme.red} />
                    <MovablePoint point={v} onMove={setV} color={Theme.yellow} />

                    <Vector tail={[0, 0]} tip={u1} color={Theme.blue} weight={2} />
                    <Vector tail={[0, 0]} tip={u2} color={Theme.red} weight={2} />
                    <Vector tail={[0, 0]} tip={v} color={Theme.yellow} weight={3} />

                    <LaTeX at={u1} tex="u_1" color={Theme.blue} />
                    <LaTeX at={u2} tex="u_2" color={Theme.red} />
                    <LaTeX at={v} tex="v" color={Theme.yellow} />
                </Mafs>

                {/* Info Panel */}
                <div className="absolute top-4 right-4 w-64 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-2xl z-20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        Laboratori de Coordenades
                    </h4>

                    <div className="space-y-4">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                            <h5 className="text-[8px] font-bold text-slate-500 uppercase mb-2 italic">Vector en base canònica</h5>
                            <div className="flex justify-between items-center font-mono text-xs">
                                <span className="text-yellow-400 font-black">v =</span>
                                <div className="text-white">({v[0].toFixed(1)}, {v[1].toFixed(1)})</div>
                            </div>
                        </div>

                        <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <h5 className="text-[8px] font-bold text-indigo-400 uppercase mb-2 italic">Coordenades en base <InlineMath math={"B = \\{u_1, u_2\\}"} /></h5>
                            <div className="flex justify-between items-center font-mono text-xs">
                                <span className="text-indigo-300 font-black">v_B =</span>
                                <div className="text-white bg-indigo-500/20 px-2 rounded tracking-tighter">
                                    ({l1.toFixed(2)}, {l2.toFixed(2)})
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button type="button"
                                onClick={() => setShowGrid(!showGrid)}
                                className={`w-full py-2 rounded-lg text-[9px] font-bold uppercase transition-all border ${showGrid ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-400'}`}
                            >
                                {showGrid ? 'Amagar Graella de la Base' : 'Mostrar Graella de la Base'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] text-slate-500 leading-relaxed italic">
                            Les coordenades són els "pesos" que donem a cada vector de la base per arribar al destí.
                            <span className="text-white block mt-1">
                                <InlineMath math={`v = ${l1.toFixed(1)} \\cdot u_1 + ${l2.toFixed(1)} \\cdot u_2`} />
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-slate-900 border-t border-white/5 text-[10px] text-center text-slate-500">
                <span className="text-white font-bold tracking-tight uppercase">Base & Coordinates:</span> Mou els vectors <span className="text-blue-400">u1, u2</span> per canviar el sistema de referència.
            </div>
        </div>
    );
};


export default VisCanviBase;
