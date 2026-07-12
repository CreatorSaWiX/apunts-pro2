import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisExPissarraTopologia = () => {
    const [point, setPoint] = React.useState<[number, number]>([0.4, 0.4]);
    const [view, setView] = React.useState<'set' | 'int' | 'fr' | 'adh'>('set');
    const [epsilon, setEpsilon] = React.useState(0.2);

    // Definició del triangle A: x>=0, y>=0, x+y < 1 (segons teoria)
    const checkInside = (px: number, py: number) => px >= 0 && py >= 0 && (px + py < 1);

    // Verificació d'Interior i Frontera mostrejant la bola
    const isInsideTriangle = checkInside(point[0], point[1]);
    const samples = [[0, epsilon], [0, -epsilon], [epsilon, 0], [-epsilon, 0],
    [epsilon * 0.7, epsilon * 0.7], [-epsilon * 0.7, -epsilon * 0.7],
    [epsilon * 1, epsilon * 1], [-epsilon * 1, -epsilon * 1], // Mostres extra per precisió
    [epsilon * 0.7, -epsilon * 0.7], [-epsilon * 0.7, epsilon * 0.7]];

    const touchesInside = samples.some(s => checkInside(point[0] + s[0], point[1] + s[1])) || checkInside(point[0], point[1]);
    const touchesOutside = samples.some(s => !checkInside(point[0] + s[0], point[1] + s[1]));

    const isActuallyInterior = isInsideTriangle && !touchesOutside;
    const isActuallyBoundary = touchesInside && touchesOutside;

    return (
        <div className="w-full flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 h-auto md:h-16">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radi ε:</span>
                    <input type="range" min="0.05" max="0.4" step="0.01" value={epsilon} onChange={(e) => setEpsilon(parseFloat(e.target.value))} className="w-24 accent-blue-500" />
                </div>
                <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                    {['set', 'int', 'fr', 'adh'].map((v) => (
                        <button type="button" key={v} onClick={() => setView(v as any)} className={`px-2 py-1 rounded text-[9px] font-black transition uppercase ${view === v ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                            {v === 'set' ? 'Conjunt A' : v === 'int' ? 'A° (Int)' : v === 'fr' ? 'Fr (Front)' : ' \u0304A (Adh)'}
                        </button>
                    ))}
                </div>
            </div>

            <Mafs viewBox={{ x: [-0.2, 1.2], y: [-0.2, 1.2] }} pan={false} zoom={false}>
                <Coordinates.Cartesian subdivisions={2} />

                {/* Ombrejat del conjunt (només per a modes que inclouen interior) */}
                {view !== 'fr' && (
                    <Polygon points={[[0, 0], [1, 0], [0, 1]]} color={Theme.blue} fillOpacity={0.15} weight={0} />
                )}

                {/* Dibuix de les vores (específic per cada mode) */}
                {view === 'set' && (
                    <>
                        <Line.Segment point1={[0, 0]} point2={[1, 0]} weight={3} color={Theme.blue} />
                        <Line.Segment point1={[0, 0]} point2={[0, 1]} weight={3} color={Theme.blue} />
                        <Line.Segment point1={[1, 0]} point2={[0, 1]} weight={3} color={Theme.blue} style="dashed" />
                    </>
                )}
                {view === 'int' && (
                    <Polygon points={[[0, 0], [1, 0], [0, 1]]} color={Theme.blue} fillOpacity={0} weight={3} strokeStyle="dashed" />
                )}
                {view === 'adh' && (
                    <Polygon points={[[0, 0], [1, 0], [0, 1]]} color={Theme.blue} fillOpacity={0} weight={3} strokeStyle="solid" />
                )}
                {view === 'fr' && (
                    <Polygon points={[[0, 0], [1, 0], [0, 1]]} color={Theme.blue} fillOpacity={0} weight={3} strokeStyle="solid" />
                )}

                {/* Bola de definició */}
                <Circle center={point} radius={epsilon} color={isActuallyInterior ? Theme.green : (isActuallyBoundary ? Theme.orange : Theme.red)} fillOpacity={0.15} weight={2} />

                <MovablePoint point={point} onMove={setPoint} color={Theme.indigo} />

                {/* Fórmula sobre el punt */}
                <LaTeX
                    at={[point[0], point[1] + epsilon + 0.15]}
                    tex={isActuallyInterior ? "B(x, \\epsilon) \\subseteq A" : (isActuallyBoundary ? "B(x, \\epsilon) \\cap A \\neq \\emptyset \\wedge B \\cap A^c \\neq \\emptyset" : "B(x, \\epsilon) \\cap A = \\emptyset")}
                    color={isActuallyInterior ? Theme.green : (isActuallyBoundary ? Theme.orange : Theme.red)}
                />
            </Mafs>

            <div className="bg-slate-900 border-t border-white/5 p-5">
                <div className="mb-4">
                    <p className="text-[10px] text-slate-400 italic">
                        {view === 'set' && "Conjunt original: Inclou els eixos (línia plena) però no la hipotenusa (discontínua)."}
                        {view === 'int' && "Interior: Tots els punts amb un entorn totalment blau. Totes les vores són discontínues."}
                        {view === 'fr' && "Frontera: Punts on qualsevol bola toca el conjunt i el seu exterior simultàniament."}
                        {view === 'adh' && "Adherència: El conjunt original més tota la seva frontera (tot tancat)."}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${isActuallyInterior ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20' : 'bg-black/20 border-white/5 opacity-40'}`}>
                        <div className="text-[9px] uppercase font-black text-emerald-400 mb-2 tracking-widest flex justify-between">
                            Punt Interior
                            {isActuallyInterior && <span>✓</span>}
                        </div>
                        <div className="mb-2"><InlineMath math="B(x, \epsilon) \subseteq A" /></div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">La bola de radi $\epsilon$ està totalment dins del triangle.</p>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${isActuallyBoundary ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-black/20 border-white/5 opacity-40'}`}>
                        <div className="text-[9px] uppercase font-black text-amber-400 mb-2 tracking-widest flex justify-between">
                            Punt Frontera
                            {isActuallyBoundary && <span>✓</span>}
                        </div>
                        <div className="mb-2"><InlineMath math="B \cap A \neq \emptyset \wedge B \cap A^c \neq \emptyset" /></div>
                        <p className="text-[9px] text-slate-500 leading-relaxed">La bola talla tant el conjunt blau com el buit exterior.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default VisExPissarraTopologia;
