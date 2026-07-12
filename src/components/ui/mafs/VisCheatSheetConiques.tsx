import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InteractionLock } from "../InteractionLock";

type MafsVisualizerProps = {
    type: string;
};


const VisCheatSheetConiques = () => {
    const [mode, setMode] = React.useState<'ellipse' | 'hiperbola' | 'hiperbola_equilatera' | 'parabola' | 'rectes' | 'diamant' | 'quadrat'>('ellipse');
    const [a, setA] = React.useState(2);
    const [b, setB] = React.useState(1.5);
    const [p, setP] = React.useState(1);
    const [k, setK] = React.useState(1);

    const renderContent = () => {
        switch (mode) {
            case 'ellipse':
                return (
                    <>
                        <Circle center={[0, 0]} radius={a} color={Theme.blue} fillOpacity={0} weight={1} strokeStyle="dashed" />
                        <Plot.OfX y={(x) => b * Math.sqrt(Math.max(0, 1 - (x * x) / (a * a)))} color={Theme.blue} weight={3} />
                        <Plot.OfX y={(x) => -b * Math.sqrt(Math.max(0, 1 - (x * x) / (a * a)))} color={Theme.blue} weight={3} />
                        <MovablePoint point={[a, 0]} onMove={([x]) => setA(Math.max(0.2, x))} color={Theme.blue} />
                        <MovablePoint point={[0, b]} onMove={([, y]) => setB(Math.max(0.2, y))} color={Theme.blue} />
                        <LaTeX at={[0, 2.5]} tex={`\\frac{x^2}{${a.toFixed(1)}^2} + \\frac{y^2}{${b.toFixed(1)}^2} = 1`} color={Theme.blue} />
                    </>
                );
            case 'hiperbola':
                return (
                    <>
                        {/* Asímptotes */}
                        <Plot.OfX y={(x) => (b / a) * x} color={'#64748b'} weight={1} style="dashed" />
                        <Plot.OfX y={(x) => -(b / a) * x} color={'#64748b'} weight={1} style="dashed" />

                        <Plot.OfX y={(x) => b * Math.sqrt(Math.max(0, (x * x) / (a * a) - 1))} color={Theme.red} weight={3} />
                        <Plot.OfX y={(x) => -b * Math.sqrt(Math.max(0, (x * x) / (a * a) - 1))} color={Theme.red} weight={3} />

                        <MovablePoint point={[a, 0]} onMove={([x]) => setA(Math.max(0.5, x))} color={Theme.red} />
                        <MovablePoint point={[1, b]} onMove={([, y]) => setB(Math.max(0.2, y))} color={Theme.red} />
                        <LaTeX at={[0, 2.5]} tex={`\\frac{x^2}{${a.toFixed(1)}^2} - \\frac{y^2}{${b.toFixed(1)}^2} = 1`} color={Theme.red} />
                    </>
                );
            case 'hiperbola_equilatera':
                return (
                    <>
                        <Plot.OfX y={(x) => k / x} color={Theme.orange} weight={3} />
                        <MovablePoint point={[Math.sqrt(Math.abs(k)), Math.sqrt(Math.abs(k)) * (k > 0 ? 1 : -1)]} onMove={([x, y]) => setK(x * y)} color={Theme.orange} />
                        <LaTeX at={[0, 2.5]} tex={`x \\cdot y = ${k.toFixed(1)}`} color={Theme.orange} />
                    </>
                );
            case 'parabola':
                return (
                    <>
                        <Plot.OfX y={(x) => Math.sqrt(2 * p * x)} color={Theme.green} weight={3} />
                        <Plot.OfX y={(x) => -Math.sqrt(2 * p * x)} color={Theme.green} weight={3} />
                        {/* Directriu */}
                        <Line.Segment point1={[-p / 2, -3]} point2={[-p / 2, 3]} color={Theme.orange} weight={2} style="dashed" />
                        <MovablePoint point={[p / 2, 0]} onMove={([x]) => setP(Math.max(0.2, x * 2))} color={Theme.green} />
                        <LaTeX at={[0, 2.5]} tex={`y^2 = 2 \\cdot ${p.toFixed(1)} \\cdot x`} color={Theme.green} />
                        <Text x={-p / 2 - 0.5} y={2} color={Theme.orange} size={12}>Directriu</Text>
                    </>
                );
            case 'rectes':
                return (
                    <>
                        <Plot.OfX y={(x) => (b / a) * x} color={Theme.yellow} weight={3} />
                        <Plot.OfX y={(x) => -(b / a) * x} color={Theme.yellow} weight={3} />
                        <MovablePoint point={[a, b]} onMove={([x, y]) => { setA(Math.max(0.2, x)); setB(Math.max(0.2, y)); }} color={Theme.yellow} />
                        <LaTeX at={[0, 2.5]} tex={`\\frac{x^2}{${a.toFixed(1)}^2} - \\frac{y^2}{${b.toFixed(1)}^2} = 0`} color={Theme.yellow} />
                    </>
                );
            case 'diamant':
                return (
                    <>
                        <Polygon points={[[a, 0], [0, a], [-a, 0], [0, -a]]} color={Theme.pink} fillOpacity={0.1} weight={3} />
                        <MovablePoint point={[a, 0]} onMove={([x]) => setA(Math.max(0.2, x))} color={Theme.pink} />
                        <LaTeX at={[0, 2.5]} tex={`|x| + |y| = ${a.toFixed(1)}`} color={Theme.pink} />
                    </>
                );
            case 'quadrat':
                return (
                    <>
                        <Polygon points={[[a, a], [-a, a], [-a, -a], [a, -a]]} color={Theme.indigo} fillOpacity={0.1} weight={3} />
                        <MovablePoint point={[a, 0]} onMove={([x]) => setA(Math.max(0.2, x))} color={Theme.indigo} />
                        <LaTeX at={[0, 2.5]} tex={`\\max(|x|, |y|) = ${a.toFixed(1)}`} color={Theme.indigo} />
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="w-full flex flex-col">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {['ellipse', 'hiperbola', 'hiperbola_equilatera', 'parabola', 'rectes', 'diamant', 'quadrat'].map((m) => (
                    <button type="button" key={m} onClick={() => setMode(m as any)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-700'}`}>
                        {m === 'ellipse' ? 'El·lipse' : 
                         m === 'hiperbola' ? 'Hipèrbola' : 
                         m === 'hiperbola_equilatera' ? 'H. Equilàtera' :
                         m === 'parabola' ? 'Paràbola' : 
                         m === 'rectes' ? 'Rectes' : 
                         m === 'diamant' ? 'Diamant' : 'Quadrat'}
                    </button>
                ))}
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                {renderContent()}
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-[10px] text-slate-400">
                <span className="text-white font-bold tracking-tighter uppercase px-2 py-1 bg-white/10 rounded mr-2">Interactiu</span>
                Mou els punts del gràfic per veure com canvia l'equació a la part superior.
            </div>
        </div>
    );
};


export default VisCheatSheetConiques;
