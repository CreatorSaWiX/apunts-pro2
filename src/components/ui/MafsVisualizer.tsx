import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon, MovablePoint, Line, Circle, Vector } from 'mafs';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

type MafsVisualizerProps = {
    type: string;
};

const VisSuccessio1N = () => {
    const points = Array.from({ length: 30 }, (_, i) => {
        const n = i + 1;
        return [n, 1 / n];
    });

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-5, 5], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Linia del límit y=0 */}
                <Plot.OfX y={() => 0} color={Theme.blue} weight={5} opacity={0.7} />

                {/* Funció contínua de fons per donar context */}
                <Plot.OfX y={(x) => 1 / x} color={Theme.red} weight={4} opacity={0.5} />

                {/* Punts de la successió (renderitzats després per estar a sobre) */}
                {points.map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={0.15}
                        fill={Theme.red}
                        stroke="white"
                        strokeWidth={0.02}
                        className="transition-all duration-300"
                    />
                ))}
                {/* Marques Canvas */}
                <Text x={2} y={-0.5} color={Theme.blue} size={18}>
                    Límit l = 0
                </Text>
                <LaTeX at={[3, 1]} tex="a_n = \frac{1}{n}" color={Theme.red} />
            </Mafs>
        </div>
    );
};

const VisSuccessioOscilant = () => {
    const points = Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        return [n, Math.pow(-1, n)];
    });

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-5, 5], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Línies límit (que no n'hi ha un d'únic) */}
                <Plot.OfX y={() => 1} color={Theme.green} weight={5} opacity={0.5} />
                <Plot.OfX y={() => -1} color={Theme.green} weight={5} opacity={0.5} />
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.4)"} weight={5} opacity={0.5} />

                {/* Punts de la successió */}
                {points.map(([x, y], i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={0.3}
                        fill={Theme.orange}
                        stroke="white"
                        strokeWidth={0.1}
                    />
                ))}
                {/* Marques Canvas */}
                <LaTeX at={[3, 1.3]} tex="a_n = (-1)^n" color={Theme.green} />
                <Text x={3} y={1.6} color={Theme.green} size={16}>Salt constant (Sense Límit)</Text>
            </Mafs>
        </div>
    );
};

const VisTeoremaBolzano = () => {
    const a = -2;
    const b = 3;
    const f = (x: number) => 0.5 * Math.pow(x, 2) - 2; // Arrel a x=2

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.red} weight={4} />

                {/* Interval [a,b] */}
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.2)"} weight={1} />
                <circle cx={a} cy={f(a)} r={0.15} fill={Theme.blue} stroke="white" strokeWidth={0.05} />
                <circle cx={b} cy={f(b)} r={0.15} fill={Theme.blue} stroke="white" strokeWidth={0.05} />

                {/* Punt c */}
                <circle cx={2} cy={0} r={0.2} fill={Theme.green} stroke="white" strokeWidth={0.1} />

                <Text x={a} y={f(a) - 0.5} color={Theme.blue} size={16}>f(a) {"<"} 0</Text>
                <Text x={b} y={f(b) + 0.5} color={Theme.blue} size={16}>f(b) {">"} 0</Text>
                <Text x={2.2} y={0.5} color={Theme.green} size={18}>Punt c (f(c) = 0)</Text>
                <LaTeX at={[-1, 2]} tex="f(x) \text{ contínua}" color={Theme.red} />
            </Mafs>
        </div>
    );
};

const VisDerivadaTangent = () => {
    const [a, setA] = React.useState(1.0);
    const f = (x: number) => 0.25 * Math.pow(x, 3) - x + 1;
    const df = (x: number) => 0.75 * Math.pow(x, 2) - 1;

    // Equació tangent: y = f(a) + f'(a)(x-a)
    const tangent = (x: number) => f(a) + df(a) * (x - a);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={Theme.blue} weight={4} />

                {/* Recta tangent */}
                <Plot.OfX y={tangent} color={Theme.yellow} weight={3} opacity={0.6} />

                {/* Punt de la derivada */}
                <circle cx={a} cy={f(a)} r={0.2} fill={Theme.yellow} stroke="white" strokeWidth={0.05} />

                {/* Controls de text */}
                <LaTeX at={[-2.5, 2.5]} tex={`f'(a) = ${df(a).toFixed(2)}`} color={Theme.yellow} />
                <LaTeX at={[0.5, -2.5]} tex="y = f(a) + f'(a)(x-a)" color={Theme.yellow} />

                {/* Overlay per moure a (simplificat amb inputs ja que no podem importar MovablePoint fàcilment aquí sense moure tot) */}
                {/* Utilitzem un Slider o simplement mostrem instruccions per ara si MovablePoint no està exposat o és complexe */}
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex items-center justify-between text-white text-sm">
                <span>Arrossega per moure el punt <b>a</b>:</span>
                <input
                    type="range"
                    min="-2.5"
                    max="2.5"
                    step="0.1"
                    value={a}
                    onChange={(e) => setA(parseFloat(e.target.value))}
                    className="w-48 ml-4 accent-yellow-400"
                />
                <span className="font-mono bg-black/40 px-3 py-1 rounded ml-4">a = {a.toFixed(1)}</span>
            </div>
        </div>
    );
};

const VisTaylorCentrat = () => {
    const [a, setA] = React.useState([0, 0]);
    const [n, setN] = React.useState(3);

    const f = (x: number) => Math.sin(x) + 0.5 * x;
    const df = [
        (x: number) => Math.sin(x) + 0.5 * x,
        (x: number) => Math.cos(x) + 0.5,
        (x: number) => -Math.sin(x),
        (x: number) => -Math.cos(x),
        (x: number) => Math.sin(x),
        (x: number) => Math.cos(x),
        (x: number) => -Math.sin(x)
    ];

    const taylor = (x: number) => {
        let sum = 0;
        const fact = [1, 1, 2, 6, 24, 120, 720];
        for (let i = 0; i <= n; i++) {
            sum += (df[i](a[0]) / fact[i]) * Math.pow(x - a[0], i);
        }
        return sum;
    };

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-5, 5], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} opacity={0.4} />
                <Plot.OfX y={taylor} color={Theme.yellow} weight={3} />

                <MovablePoint point={[a[0], f(a[0])]} onMove={(p) => setA([p[0], 0])} color={Theme.blue} />

                <LaTeX at={[a[0], f(a[0]) + 0.4]} tex="a" color={Theme.blue} />
                <LaTeX at={[-4, 2]} tex={`P_{${n}}(x)`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-5 border-t border-white/10">
                <div className="flex items-center gap-6 mb-4">
                    <div className="flex-1">
                        <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-wider">Grau del polinomi (n):</span>
                        <div className="flex items-center gap-4">
                            <input type="range" min="0" max="6" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-yellow-400" />
                            <span className="font-mono text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded w-8 text-center">{n}</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-400 italic">
                    Arrossega el punt <InlineMath math="a" /> per la corba. El polinomi de Taylor es "centra" en aquest valor i s'adapta a la forma local de la funció en aquell punt exacte.
                </p>
            </div>
        </div>
    );
};

const VisTaylorError = () => {
    const f = (x: number) => Math.exp(x / 2);
    // P2 centrat a 0: f(0) + f'(0)x + f''(0)/2 x^2 = 1 + 0.5x + 0.125x^2
    const p2 = (x: number) => 1 + 0.5 * x + 0.125 * x * x;
    const errorLimit = 0.2;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-2, 2], y: [0, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Zona d'error admissible */}
                <Polygon
                    points={[
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = -2 + (i / 40) * 4;
                            return [x, f(x) + errorLimit] as [number, number];
                        }),
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = 2 - (i / 40) * 4;
                            return [x, f(x) - errorLimit] as [number, number];
                        })
                    ]}
                    color={Theme.green}
                    fillOpacity={0.15}
                    weight={0}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p2} color={Theme.yellow} weight={3} />

                <LaTeX at={[0, 1.3]} tex="a=0" color={Theme.blue} />
                <LaTeX at={[1, 2.5]} tex="|R_2| \le 0.2" color={Theme.green} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                La franja <span className="text-green-400 font-bold">verda</span> representa un error màxim permès de <InlineMath math="\pm 0.2" />.
                Observa que el polinomi groc és una bona aproximació només mentre es manté dins d'aquesta franja.
                Quan <InlineMath math="|x-a|" /> creix, l'error es dispara.
            </div>
        </div>
    );
};

const VisTaylorComportament = () => {
    const [n, setN] = React.useState(2);
    const f = (x: number) => Math.cos(x);

    const p_even = (x: number) => 1 - 0.5 * x * x; // Grau 2 (M\u00e0xim)
    const p_odd = (x: number) => 1 - 0.5 * x * x - (1 / 6) * Math.pow(x, 3); // Imaginem un f'''(0) != 0 per veure punt d'inflexi\u00f3

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-2, 2], y: [-1, 2] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={2} opacity={0.3} />
                <Plot.OfX y={n === 2 ? p_even : p_odd} color={n === 2 ? Theme.red : Theme.indigo} weight={4} />

                <Circle center={[0, 1]} radius={0.1} color={Theme.yellow} />
                <LaTeX at={[0, 1.4]} tex="a=0" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10">
                <div className="flex justify-center gap-4 mb-3">
                    <button onClick={() => setN(2)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${n === 2 ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>Grau 2 (Parell)</button>
                    <button onClick={() => setN(3)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${n === 3 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>Grau 3 (Senar)</button>
                </div>
                <p className="text-xs text-slate-400 text-center italic">
                    {n === 2
                        ? "Si la primera derivada no nul·la és parell, tenim un extrem (màxim o mínim)."
                        : "Si la primera derivada no nul·la és senar, tenim un punt d'inflexió."}
                </p>
            </div>
        </div>
    );
};

const VisExtremsRelatius = () => {
    const f = (x: number) => {
        if (x < 0) return 0; // Domini [0,1]
        return Math.pow(x, 2 / 3) * Math.pow(x - 1, 4);
    }

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-0.2, 1.2], y: [-0.05, 0.3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={Theme.blue} weight={4} />
                <circle cx={1 / 7} cy={f(1 / 7)} r={0.02} fill={Theme.red} stroke="white" strokeWidth={0.01} />
                <circle cx={0} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />
                <circle cx={1} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />

                <LaTeX at={[1 / 7, f(1 / 7) + 0.03]} tex="M(1/7, f(1/7))" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex justify-center gap-8 text-xs font-mono">
                <span className="flex items-center gap-2 font-bold text-green-400">Mínims (f=0)</span>
                <span className="flex items-center gap-2 font-bold text-red-400">Màxim relatiu</span>
            </div>
        </div>
    );
};

const VisTaylorTeorema = () => {
    const [x, setX] = React.useState([1.5, 0]);
    const f = (val: number) => Math.exp(val / 2);
    const p1 = (val: number) => 1 + 0.5 * val; // Tangent a 0

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 3], y: [0, 5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p1} color={Theme.yellow} weight={3} opacity={0.6} />

                <Line.Segment point1={[x[0], f(x[0])]} point2={[x[0], p1(x[0])]} color={Theme.red} weight={4} />
                <Circle center={[x[0], f(x[0])]} radius={0.08} color={Theme.red} />
                <Circle center={[x[0], p1(x[0])]} radius={0.08} color={Theme.red} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(-0.5, Math.min(2.5, p[0])), 0])} color={Theme.red} />

                <LaTeX at={[x[0] + 0.2, (f(x[0]) + p1(x[0])) / 2]} tex="R_n(x)" color={Theme.red} />
                <LaTeX at={[0, 1.3]} tex="a" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-sm text-slate-300">
                El <span className="text-red-400 font-bold italic">Resta de Taylor</span> <InlineMath math="R_n(x)" /> és la distància vertical real entre la funció i el polinomi aproximat.
            </div>
        </div>
    );
};

const VisTaylorLagrange = () => {
    const [x, setX] = React.useState([2, 0]);
    const f = (val: number) => Math.sin(val);
    const p1 = (val: number) => val; // P1 a x=0 \u00e9s y=x

    // Per a sin(x) i P1(x)=x, l'error \u00e9s sin(x) - x. 
    // El resta de Lagrange \u00e9s f''(c)/2! * x^2 = -sin(c)/2 * x^2.
    // Trobem c tal que -sin(c)/2 * x^2 = sin(x) - x  =>  sin(c) = 2(x - sin(x)) / x^2
    const cVal = x[0] === 0 ? 0 : Math.asin(Math.max(-1, Math.min(1, 2 * (x[0] - Math.sin(x[0])) / (x[0] * x[0]))));

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 4], y: [-1, 2] }} pan={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={p1} color={Theme.yellow} weight={3} opacity={0.4} />

                {/* Punt c de Lagrange */}
                <Vector tail={[0, 0]} tip={[cVal, 0]} color={Theme.green} weight={3} opacity={0.5} />
                <Circle center={[cVal, f(cVal)]} radius={0.1} color={Theme.green} />
                <LaTeX at={[cVal, -0.4]} tex="c" color={Theme.green} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.1, Math.min(Math.PI, p[0])), 0])} color={Theme.red} />
                <LaTeX at={[x[0], -0.4]} tex="x" color={Theme.red} />

                <Line.Segment point1={[x[0], f(x[0])]} point2={[x[0], p1(x[0])]} color={Theme.red} weight={2} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400">
                El Teorema de Lagrange ens garanteix que existeix un punt <span className="text-green-400 font-bold"><InlineMath math="c \in (a,x)" /></span> on la derivada de la funció "explica" l'error comès.
            </div>
        </div>
    );
};

const VisTaylorMaclaurin = () => {
    const [mode, setMode] = React.useState(0);
    const [n, setN] = React.useState(2);

    const configs = [
        {
            label: 'exp(x)',
            f: (x: number) => Math.exp(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) { if (i > 0) f *= i; s += Math.pow(x, i) / f; }
                return s;
            },
            view: { x: [-3, 3], y: [-1, 5] }
        },
        {
            label: 'sin(x)',
            f: (x: number) => Math.sin(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) {
                    if (i > 0) f *= i;
                    if (i % 2 === 1) s += (Math.pow(-1, (i - 1) / 2) * Math.pow(x, i)) / f;
                }
                return s;
            },
            view: { x: [-5, 5], y: [-2, 2] }
        },
        {
            label: 'cos(x)',
            f: (x: number) => Math.cos(x),
            p: (x: number, n: number) => {
                let s = 0; let f = 1;
                for (let i = 0; i <= n; i++) {
                    if (i > 0) f *= i;
                    if (i % 2 === 0) s += (Math.pow(-1, i / 2) * Math.pow(x, i)) / f;
                }
                return s;
            },
            view: { x: [-5, 5], y: [-2, 2] }
        },
        {
            label: 'ln(1+x)',
            f: (x: number) => Math.log(1 + x),
            p: (x: number, n: number) => {
                let s = 0;
                for (let i = 1; i <= n; i++) {
                    s += (Math.pow(-1, i - 1) * Math.pow(x, i)) / i;
                }
                return s;
            },
            view: { x: [-0.9, 3], y: [-2, 2] }
        },
        {
            label: '1/(1-x)',
            f: (x: number) => 1 / (1 - x),
            p: (x: number, n: number) => {
                let s = 0;
                for (let i = 0; i <= n; i++) s += Math.pow(x, i);
                return s;
            },
            view: { x: [-1.5, 0.9], y: [-1, 5] }
        }
    ];

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {configs.map((c, i) => (
                    <button key={i} onClick={() => setMode(i)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all ${mode === i ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>{c.label}</button>
                ))}
            </div>
            <Mafs viewBox={{ x: configs[mode].view.x as [number, number], y: configs[mode].view.y as [number, number] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={configs[mode].f} color={Theme.blue} weight={3} opacity={0.3} />
                <Plot.OfX y={(x) => configs[mode].p(x, n)} color={Theme.yellow} weight={3} />
                <Circle center={[0, configs[mode].f(0)]} radius={0.1} color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase w-12 text-center">Grau {n}</span>
                    <input type="range" min="0" max="15" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

const VisDerivacioLogaritmica = () => {
    const [xVal, setXVal] = React.useState([1.5, 0]);
    // f(x) = x^x. \u00c9s una funci\u00f3 que creix molt r\u00e0pid.
    const f = (x: number) => x > 0 ? Math.pow(x, x) : 0;
    // ln(f(x)) = x ln(x)
    const logF = (x: number) => x > 0 ? x * Math.log(x) : -5;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 p-2">
                <Mafs viewBox={{ x: [0, 3], y: [0, 5] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />
                    <Plot.OfX y={f} color={Theme.blue} weight={3} />
                    <Circle center={[xVal[0], f(xVal[0])]} radius={0.1} color={Theme.blue} />
                    <LaTeX at={[xVal[0], f(xVal[0]) + 0.5]} tex="x^x" color={Theme.blue} />
                    <MovablePoint point={[xVal[0], 0]} onMove={(p) => setXVal([Math.max(0.1, Math.min(2.5, p[0])), 0])} color={Theme.yellow} />
                </Mafs>
                <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">Funció Original <InlineMath math="f(x) = x^x" /></div>
            </div>
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 p-2">
                <Mafs viewBox={{ x: [0, 3], y: [-1, 2] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />
                    <Plot.OfX y={logF} color={Theme.green} weight={3} />
                    <Circle center={[xVal[0], logF(xVal[0])]} radius={0.1} color={Theme.green} />
                    <LaTeX at={[xVal[0], logF(xVal[0]) + 0.4]} tex="\ln(f)" color={Theme.green} />
                </Mafs>
                <div className="p-2 text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest italic">Transformada <InlineMath math="\ln f(x) = x \ln x" /></div>
            </div>
        </div>
    );
};

const VisTeoremaRolle = () => {
    const [a, setA] = React.useState(-2);
    const [b, setB] = React.useState(2);

    // Funci\u00f3 f(x) = -(x-a)(x-b) + 1. Aix\u00f2 garanteix f(a)=1 i f(b)=1.
    const f = (x: number) => -(x - a) * (x - b) + 1;
    const c = (a + b) / 2; // El punt on f'(c)=0 per una par\u00e0bola

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* Linia horitzontal f(a)=f(b) */}
                <Line.Segment point1={[a, 1]} point2={[b, 1]} color="white" opacity={0.3} weight={2} />

                {/* Tangent horitzontal a c */}
                <Line.Segment point1={[c - 1, f(c)]} point2={[c + 1, f(c)]} color={Theme.yellow} weight={4} />
                <Circle center={[c, f(c)]} radius={0.12} color={Theme.yellow} />

                <MovablePoint point={[a, 1]} onMove={(p) => setA(Math.min(p[0], b - 1.2))} color={Theme.red} />
                <MovablePoint point={[b, 1]} onMove={(p) => setB(Math.max(p[0], a + 1.2))} color={Theme.red} />

                <LaTeX at={[c, f(c) + 0.5]} tex="f'(c) = 0" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 text-center italic leading-relaxed">
                Si <InlineMath math="f(a) = f(b)" />, obligat\u00f2riament hi ha un punt <InlineMath math="c \in (a, b)" /> on la corba "gira" i la tangent \u00e9s perfectament **horitzontal**.
            </div>
        </div>
    );
};

const VisTeoremaValorMitja = () => {
    const [a, setA] = React.useState(-2);
    const [b, setB] = React.useState(2);

    const f = (x: number) => 0.1 * Math.pow(x, 3) - 0.2 * x + 1;
    const slope = (f(b) - f(a)) / (b - a);

    // Trobem c tal que f'(c) = 0.3c^2 - 0.2 = slope => c = sqrt((slope + 0.2)/0.3)
    const cVal = Math.sqrt(Math.abs((slope + 0.2) / 0.3)) * (slope < 0 ? -1 : 1);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* Secant */}
                <Line.Segment point1={[a, f(a)]} point2={[b, f(b)]} color="white" opacity={0.3} weight={2} />

                {/* Tangent paral\u00b7lela */}
                <Line.ThroughPoints
                    point1={[cVal - 1, f(cVal) - slope]}
                    point2={[cVal + 1, f(cVal) + slope]}
                    color={Theme.yellow}
                    weight={4}
                />
                <Circle center={[cVal, f(cVal)]} radius={0.12} color={Theme.yellow} />

                <MovablePoint point={[a, f(a)]} onMove={(p) => setA(Math.min(p[0], b - 1.2))} color={Theme.red} />
                <MovablePoint point={[b, f(b)]} onMove={(p) => setB(Math.max(p[0], a + 1.2))} color={Theme.red} />

                <LaTeX at={[cVal, f(cVal) + 0.7]} tex="f'(c) = \frac{f(b)-f(a)}{b-a}" color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400 text-center italic leading-relaxed">
                El pendent de la **secant** (blanca) \u00e9s igual al pendent de la **tangent** (groga) en algun punt interior <InlineMath math="c" />.
            </div>
        </div>
    );
};

const VisReglaHopital = () => {
    const [x, setX] = React.useState([0.5, 0]);
    // Dues funcions que van a 0 quan x -> 0
    const f = (xVal: number) => Math.sin(2 * xVal);
    const g = (xVal: number) => Math.sin(xVal);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 1.5], y: [-1, 2.5] }} pan={false} zoom={true}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={g} color={Theme.red} weight={3} />

                {/* Tangents a l'origen */}
                <Line.ThroughPoints point1={[-0.5, -1]} point2={[0.5, 1]} color={Theme.blue} opacity={0.3} weight={1} />
                <Line.ThroughPoints point1={[-1, -1]} point2={[1, 1]} color={Theme.red} opacity={0.3} weight={1} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.05, Math.min(1.2, p[0])), 0])} color={Theme.yellow} />

                <Line.Segment point1={[x[0], 0]} point2={[x[0], f(x[0])]} color={Theme.blue} weight={2} />
                <Line.Segment point1={[x[0], 0]} point2={[x[0], g(x[0])]} color={Theme.red} weight={2} />

                <LaTeX at={[1.2, f(1.2)]} tex="f(x)" color={Theme.blue} />
                <LaTeX at={[1.2, g(1.2)]} tex="g(x)" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-300 italic text-center">
                A prop de l'origen (<InlineMath math="x \to a" />), el quocient <span className="text-blue-400 font-bold">f(x)</span> / <span className="text-red-400 font-bold">g(x)</span> és pràcticament el mateix que el quocient entre les seves **velocitats (tangents)**.
            </div>
        </div>
    );
};

const VisParametrizadaExp = () => {
    const [a, setA] = React.useState(0.5);
    // Per visualitzar-ho millor, fem que el gràfic sigui f(x) = e^{-(x-c)^2} si a>0 
    // o similar, però mantenint l'essència del problema.
    // x_c = 4/a. Si a=0.5, x_c=8.
    const f = (x: number) => {
        if (a === 0) return Math.exp(0.5 * x); // Cas degenerat per a=0 simplificat per visibilitat
        const exponent = 8 * x - a * (Math.pow(x, 2) + 16);
        // Protecció contra valors massa grans per al plot
        return Math.exp(Math.min(exponent, 10));
    }

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-5, 15], y: [-1, 5] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />
                <Plot.OfX y={f} color={a > 0 ? Theme.blue : Theme.red} weight={4} />

                {a !== 0 && (
                    <>
                        <circle cx={4 / a} cy={f(4 / a)} r={0.2} fill={a > 0 ? Theme.blue : Theme.red} stroke="white" />
                        <LaTeX at={[4 / a, f(4 / a) + 0.5]} tex={a > 0 ? "M\u00e0xim" : "M\u00ednim"} color="white" />
                    </>
                )}

                <LaTeX at={[10, 4]} tex={`a = ${a.toFixed(2)}`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium w-24">Paràmetre a:</span>
                    <input
                        type="range"
                        min="-0.5"
                        max="0.8"
                        step="0.05"
                        value={a}
                        onChange={(e) => setA(parseFloat(e.target.value))}
                        className="flex-1 accent-yellow-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-16 text-center">{a.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-400 italic">
                    *Nota: S'ha limitat el valor màxim de l'exponent per a la visualització.
                    Punt crític a $x = 4/a$.
                </div>
            </div>
        </div>
    );
};

const VisUnicitat3x = () => {
    const f = (x: number) => Math.pow(3, -x) - x;
    const df = (x: number) => -Math.pow(3, -x) * Math.log(3) - 1;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-2, 3], y: [-4, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Eix X per referència */}
                <Plot.OfX y={() => 0} color={"rgba(255, 255, 255, 0.2)"} weight={1} />

                {/* Funció f(x) */}
                <Plot.OfX y={f} color={Theme.blue} weight={4} />

                {/* Derivada f'(x) */}
                <Plot.OfX y={df} color={Theme.red} weight={3} opacity={0.7} />

                {/* Punt de tall (Arrel aproximada a x ≈ 0.455) */}
                <circle cx={0.455} cy={0} r={0.15} fill={Theme.green} stroke="white" strokeWidth={0.05} />

                <LaTeX at={[1.5, f(1.5) + 0.5]} tex="f(x) = 3^{-x} - x" color={Theme.blue} />
                <LaTeX at={[-1, df(-1) + 0.5]} tex="f'(x) < 0" color={Theme.red} />

                <Text x={0.6} y={0.5} color={Theme.green} size={14}>Única arrel</Text>
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-mono">
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> f(x) (Decreixent)</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> f'(x) (Sempre negativa)</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> Arrel (Bolzano)</span>
            </div>
        </div>
    );
};

const VisTeoremaFonamental = () => {
    const [x, setX] = React.useState([2, 0]);
    const f = (t: number) => 0.25 * t * t + 0.5;


    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 5], y: [-1, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea des de 0 fins a x */}
                <Polygon
                    points={[
                        [0, 0],
                        ...Array.from({ length: 40 }, (_, i) => {
                            const t = (i / 39) * x[0];
                            return [t, f(t)] as [number, number];
                        }),
                        [x[0], 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.4}
                />

                {/* Línia de la funció f(t) */}
                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                {/* El rectangle diferencial dF ≈ f(x) * dx */}
                <Polygon
                    points={[
                        [x[0], 0],
                        [x[0] + 0.4, 0],
                        [x[0] + 0.4, f(x[0])],
                        [x[0], f(x[0])]
                    ]}
                    color={Theme.yellow}
                    fillOpacity={0.6}
                />

                <MovablePoint
                    point={[x[0], 0]}
                    onMove={(p: [number, number]) => setX([Math.max(0, Math.min(4.4, p[0])), 0])}
                    color={Theme.yellow}
                />

                {/* Annotacions */}
                <LaTeX at={[x[0] / 2, f(x[0] / 2) / 2]} tex="F(x) = \small \int_0^x f" color="white" />
                <LaTeX at={[x[0] + 0.2, f(x[0]) + 0.4]} tex="f(x)" color={Theme.yellow} />
                <LaTeX at={[x[0] + 0.2, -0.4]} tex="dx" color={Theme.yellow} />

                <LaTeX at={[3, 4.5]} tex={`F(x) = \\int_0^x f(t) dt`} color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-sm text-slate-300">
                A mesura que incrementem <InlineMath math="x" /> per un trosset <InlineMath math="dx" />, l'àrea augmenta exactament en <InlineMath math="f(x) \cdot dx" />.
                <br /><span className="text-yellow-400 font-bold mt-1 inline-block">És a dir, el ritme de canvi de l'àrea és l'alçada de la funció!</span>
            </div>
        </div>
    );
};

const VisPrimitivaFamilia = () => {
    const [C, setC] = React.useState(0);
    const [x, setX] = React.useState([1, 0]);

    const f = (t: number) => Math.cos(t);
    const F = (t: number, c: number) => Math.sin(t) + c;
    const df = (t: number) => Math.cos(t);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Dibuixem 5 línies de la família de primitives */}
                {[-1.5, -0.75, 0, 0.75, 1.5].map((val) => (
                    <Plot.OfX
                        key={val}
                        y={(t) => F(t, val)}
                        color={Theme.green}
                        opacity={Math.abs(val - C) < 0.1 ? 1 : 0.2}
                        weight={Math.abs(val - C) < 0.1 ? 3 : 1}
                    />
                ))}

                <Plot.OfX y={f} color={Theme.orange} weight={3} />

                {/* Tangent interactiva */}
                <Line.ThroughPoints
                    point1={[x[0] - 0.7, F(x[0], C) - 0.7 * df(x[0])]}
                    point2={[x[0] + 0.7, F(x[0], C) + 0.7 * df(x[0])]}
                    color={Theme.yellow}
                    weight={3}
                />

                <Circle center={[x[0], F(x[0], C)]} radius={0.12} color={Theme.yellow} />
                <Vector tail={[x[0], 0]} tip={[x[0], f(x[0])]} color={Theme.orange} weight={3} />

                <MovablePoint point={[x[0], 0]} onMove={(p: [number, number]) => setX([p[0], 0])} color={Theme.orange} />

                <LaTeX at={[-3, 2.5]} tex="F(x) = \sin(x) + C" color={Theme.green} />
                <LaTeX at={[-3, -2]} tex="f(x) = \cos(x)" color={Theme.orange} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-slate-300 w-32 font-medium">Constant <InlineMath math="C" />:</span>
                    <input type="range" min="-1.5" max="1.5" step="0.75" value={C} onChange={(e) => setC(parseFloat(e.target.value))} className="flex-1 accent-green-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    <span className="font-mono text-sm w-12 text-center bg-green-500/20 text-green-400 py-1 rounded">{C}</span>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed">
                    Observa com el pendent de la tangent (groga) a la primitiva és sempre igual al valor de la funció taronja a sota.
                    No importa quina vertical (<InlineMath math="C" />) triem, la "forma" de de la corba (el pendent) només depèn de <InlineMath math="f(x)" />.
                </p>
            </div>
        </div>
    );
};

const VisReglaBarrow = () => {
    const [interval, setInterval] = React.useState({ a: 1, b: 3 });
    const f = (x: number) => 0.4 * x + 0.8;
    const F = (x: number) => 0.2 * x * x + 0.8 * x;

    return (
        <div className="w-full flex flex-col gap-4 my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 p-2">
                    <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.5, 3.5] }} pan={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Polygon
                            points={[[interval.a, 0], [interval.b, 0], [interval.b, f(interval.b)], [interval.a, f(interval.a)]]}
                            color={Theme.blue} fillOpacity={0.4}
                        />
                        <Plot.OfX y={f} color={Theme.blue} weight={3} />
                        <MovablePoint point={[interval.a, 0]} onMove={(p: [number, number]) => setInterval(prev => ({ ...prev, a: Math.max(0, Math.min(p[0], interval.b - 0.2)) }))} color={Theme.blue} />
                        <MovablePoint point={[interval.b, 0]} onMove={(p: [number, number]) => setInterval(prev => ({ ...prev, b: Math.min(4, Math.max(p[0], interval.a + 0.2)) }))} color={Theme.blue} />
                        <LaTeX at={[(interval.a + interval.b) / 2, 0.4]} tex="\int_a^b f" color="white" />
                    </Mafs>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 p-2">
                    <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.5, 7] }} pan={false} preserveAspectRatio={false}>
                        <Coordinates.Cartesian />
                        <Plot.OfX y={F} color={Theme.red} weight={3} />

                        <Circle center={[interval.a, F(interval.a)]} radius={0.12} color={Theme.red} />
                        <Circle center={[interval.b, F(interval.b)]} radius={0.12} color={Theme.red} />

                        <Vector tail={[interval.b, F(interval.a)]} tip={[interval.b, F(interval.b)]} color={Theme.yellow} weight={3} />
                        <Line.Segment point1={[interval.a, F(interval.a)]} point2={[interval.b, F(interval.a)]} color="white" opacity={0.3} />

                        <LaTeX at={[interval.b + 0.6, (F(interval.a) + F(interval.b)) / 2]} tex="F(b)-F(a)" color={Theme.yellow} />
                    </Mafs>
                </div>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl text-center text-sm border border-white/10 shadow-inner">
                <p className="font-light text-slate-200">
                    La <span className="text-blue-400 font-bold uppercase tracking-tighter">Àrea</span> sota la corba representa el guany total.
                    Aquest guany és exactament igual al <span className="text-yellow-400 font-bold uppercase tracking-tighter">Salt Vertical</span> en la funció primitiva.
                </p>
                <div className="mt-2 text-xl font-serif text-white italic">
                    <InlineMath math="\int_a^b f(x) dx = F(b) - F(a)" />
                </div>
            </div>
        </div>
    );
};

const VisLimitsIntegracio = () => {
    const [x, setX] = React.useState([1.5, 0]);
    const f = (t: number) => 1.8 + 1.2 * Math.sin(1.5 * t);
    const u = (val: number) => val * 0.4;
    const v = (val: number) => val + 1.5;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-0.2, 5.5], y: [-0.2, 4.5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                <Polygon
                    points={[
                        [u(x[0]), 0],
                        ...Array.from({ length: 40 }, (_, i) => {
                            const t = u(x[0]) + (i / 39) * (v(x[0]) - u(x[0]));
                            return [t, f(t)] as [number, number];
                        }),
                        [v(x[0]), 0]
                    ]}
                    color={Theme.indigo}
                    fillOpacity={0.4}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={2} opacity={0.3} />

                <MovablePoint point={[x[0], 0]} onMove={(p) => setX([Math.max(0.2, Math.min(3.5, p[0])), 0])} color={Theme.yellow} />

                {/* Vectors Velocitat del límit / Derivades */}
                <Vector tail={[v(x[0]), f(v(x[0])) / 2]} tip={[v(x[0]) + 1.2, f(v(x[0])) / 2]} color={Theme.green} weight={3} />
                <Vector tail={[u(x[0]), f(u(x[0])) / 2]} tip={[u(x[0]) + 0.5, f(u(x[0])) / 2]} color={Theme.red} weight={3} />

                <LaTeX at={[u(x[0]), -0.5]} tex="u(x)" color={Theme.red} />
                <LaTeX at={[v(x[0]), -0.5]} tex="v(x)" color={Theme.green} />

                <LaTeX at={[2.5, 4]} tex="F'(x) = f(v(x)) \cdot v'(x) - f(u(x)) \cdot u'(x)" color={Theme.indigo} />
            </Mafs>
            <div className="bg-slate-800/80 p-5 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-[10px] md:text-xs">
                    <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                        <span className="text-green-400 font-bold">Límit Superior (v):</span> Al moure <InlineMath math="x" />, el límit dret corre cap endavant, sumant àrea proporcional a la seva velocitat <InlineMath math="v'(x)" />.
                    </div>
                    <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
                        <span className="text-red-400 font-bold">Límit Inferior (u):</span> El límit esquerre també es mou, restant àrea al seu pas segons la velocitat <InlineMath math="u'(x)" />.
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisIntegracioTrapezi = () => {

    const [n, setN] = React.useState(4);
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0;
    const b = 2 * Math.PI;
    const dx = (b - a) / n;

    const polygons = [];
    for (let i = 0; i < n; i++) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        polygons.push(
            <Polygon
                key={i}
                points={[[x0, 0], [x1, 0], [x1, f(x1)], [x0, f(x0)]]}
                color={Theme.blue}
                fillOpacity={0.3}
            />
        );
    }

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 7], y: [-1, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {polygons}

                <Plot.OfX y={f} color={Theme.red} weight={4} />

                <LaTeX at={[Math.PI, 3.5]} tex="\int_0^{2\pi} (\sin(x) + 2) dx \approx T_n" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium w-32">Subintervals (n):</span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="flex-1 accent-blue-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-12 text-center">{n}</span>
                </div>
                <div className="text-xs text-slate-400 italic mt-2 text-center">
                    Mètode dels trapezis per aproximar l'àrea sota la corba d'una funció.
                </div>
            </div>
        </div>
    );
};

const VisIntegracioSimpson = () => {
    const [n, setN] = React.useState(4); // n ha de ser parell
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0;
    const b = 2 * Math.PI;
    const dx = (b - a) / n;

    const polygons = [];

    for (let i = 0; i < n; i += 2) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        const x2 = a + (i + 2) * dx;

        const y0 = f(x0);
        const y1 = f(x1);
        const y2 = f(x2);

        const h = dx;
        const P = (x: number) => {
            const term1 = y0 * (x - x1) * (x - x2) / (2 * h * h);
            const term2 = -y1 * (x - x0) * (x - x2) / (h * h);
            const term3 = y2 * (x - x0) * (x - x1) / (2 * h * h);
            return term1 + term2 + term3;
        };

        const points = [[x0, 0]];
        // Dibuixem 10 segments de recta per donar l'aparença d'una paràbola suau
        for (let j = 0; j <= 10; j++) {
            const px = x0 + (j / 10) * (2 * h);
            points.push([px, P(px)]);
        }
        points.push([x2, 0]);

        polygons.push(
            <Polygon
                key={`poly-${i}`}
                points={points as [number, number][]}
                color={Theme.green}
                fillOpacity={0.3}
            />
        );

        polygons.push(
            <circle key={`p0-${i}`} cx={x0} cy={y0} r={0.06} fill="white" />
        );
        polygons.push(
            <circle key={`p1-${i}`} cx={x1} cy={y1} r={0.06} fill="white" />
        );
        polygons.push(
            <circle key={`p2-${i}`} cx={x2} cy={y2} r={0.06} fill="white" />
        );
    }

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 7], y: [-1, 4] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {polygons}

                <Plot.OfX y={f} color={Theme.red} weight={4} />

                <LaTeX at={[Math.PI, 3.5]} tex="\int_0^{2\pi} (\sin(x) + 2) dx \approx S_n" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium w-auto">Subintervals (n parell):</span>
                    <input
                        type="range"
                        min="2"
                        max="20"
                        step="2"
                        value={n}
                        onChange={(e) => setN(parseInt(e.target.value))}
                        className="flex-1 accent-green-400"
                    />
                    <span className="font-mono bg-black/40 px-3 py-1 rounded w-12 text-center">{n}</span>
                </div>
                <div className="text-xs text-slate-400 italic mt-2 text-center">
                    El mètode de Simpson aproxima la corba usant arcs parabòlics definits per tres punts consecutius.
                </div>
            </div>
        </div>
    );
};


const VisAreaEntreCorbes = () => {
    const f = (x: number) => -0.5 * x * x + 3;
    const g = (x: number) => 0.5 * x + 1;
    // Punts de tall aproximats per a la visualització: x = -2.5, x = 1.5
    const a = -2.56;
    const b = 1.56;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Àrea entre f i g */}
                <Polygon
                    points={[
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = b - (i / 29) * (b - a);
                            return [x, g(x)] as [number, number];
                        })
                    ]}
                    color={Theme.yellow}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Plot.OfX y={g} color={Theme.red} weight={3} />

                <LaTeX at={[a, f(a) + 0.5]} tex="x_1" color="white" />
                <LaTeX at={[b, f(b) + 0.5]} tex="x_2" color="white" />

                <LaTeX at={[0, 4]} tex="f(x)" color={Theme.blue} />
                <LaTeX at={[2, 1.5]} tex="g(x)" color={Theme.red} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                L'àrea groga es calcula com <InlineMath math="\int_{x_1}^{x_2} (f(x) - g(x)) dx" />, on <InlineMath math="f(x)" /> és el sostre i <InlineMath math="g(x)" /> el terra.
            </div>
        </div>
    );
};

const VisTeoremaMitjana = () => {
    const f = (x: number) => Math.sin(x) + 2;
    const a = 0.5;
    const b = 4;
    // Valor mitjà aproximat per a la visualització
    const fMitja = 2.15;
    const c = 3.0; // Punt on f(c) = fMitja aproximat

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-0.5, 5], y: [-0.5, 4] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea sota la corba */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.2}
                />

                {/* Rectangle de la mitjana */}
                <Polygon
                    points={[[a, 0], [b, 0], [b, fMitja], [a, fMitja]]}
                    color={Theme.green}
                    fillOpacity={0.2}
                    weight={2}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />
                <Line.Segment point1={[a, fMitja]} point2={[b, fMitja]} color={Theme.green} weight={3} />

                <circle cx={c} cy={f(c)} r={0.15} fill={Theme.green} stroke="white" />

                <LaTeX at={[c, f(c) + 0.4]} tex="f(c)" color={Theme.green} />
                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400 leading-relaxed">
                L'àrea del <span className="text-green-400 font-bold">rectangle verd</span> és exactament igual a l'àrea <span className="text-blue-400 font-bold">blava</span> sota la corba.
                L'alçada <InlineMath math="f(c)" /> representa el valor mitjà de la funció en l'interval.
            </div>
        </div>
    );
};

const VisRiemannSums = () => {
    const [n, setN] = React.useState(6);
    const [type, setType] = React.useState<'lower' | 'upper'>('lower');
    const f = (x: number) => 0.1 * x * x + 1;
    const a = 0;
    const b = 5;
    const dx = (b - a) / n;

    const rectangles = [];
    for (let i = 0; i < n; i++) {
        const x0 = a + i * dx;
        const x1 = a + (i + 1) * dx;
        const h = type === 'lower' ? f(x0) : f(x1); // Com que és creixent, ínfim és esquerra i suprem dreta
        rectangles.push(
            <Polygon
                key={i}
                points={[[x0, 0], [x1, 0], [x1, h], [x0, h]]}
                color={type === 'lower' ? Theme.blue : Theme.red}
                fillOpacity={0.3}
            />
        );
    }

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                {rectangles}
                <Plot.OfX y={f} color={Theme.red} weight={3} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => setType('lower')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase ${type === 'lower' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>Inferiors</button>
                        <button onClick={() => setType('upper')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase ${type === 'upper' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>Superiors</button>
                    </div>
                    <div className="flex items-center gap-3 flex-1 px-4">
                        <span className="text-[10px] text-slate-400 uppercase font-bold w-12">Parts: {n}</span>
                        <input type="range" min="2" max="40" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="flex-1 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisParitatIntegrals = () => {
    const [mode, setMode] = React.useState<'even' | 'odd'>('even');

    const f = mode === 'even' ? (t: number) => Math.cos(t) : (t: number) => Math.sin(t);
    const F = mode === 'even' ? (t: number) => Math.sin(t) : (t: number) => -Math.cos(t) + 1; // Integral de sin(t) des de 0 \u00e9s 1 - cos(t)

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-4 flex gap-4 bg-slate-800/50 border-b border-white/10 justify-center">
                <button onClick={() => setMode('even')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'even' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>f(x) Parella</button>
                <button onClick={() => setMode('odd')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'odd' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>f(x) Imparella</button>
            </div>
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian />
                <Plot.OfX y={f} color={Theme.orange} weight={3} opacity={0.5} />
                <Plot.OfX y={F} color={Theme.blue} weight={4} />

                <LaTeX at={[1, f(1) + 0.3]} tex="f(x)" color={Theme.orange} />
                <LaTeX at={[1, F(1) + 0.3]} tex="F(x) = \int_0^x f" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-300">
                {mode === 'even'
                    ? <p>Si <span className="text-orange-400 font-bold">f(x)</span> és **parella** (simètrica eix Y), la funció àrea **F(x)** és **imparella** (simètrica origen).</p>
                    : <p>Si <span className="text-orange-400 font-bold">f(x)</span> és **imparella**, la funció àrea **F(x)** és **parella**.</p>
                }
            </div>
        </div>
    );
};

const VisInversioLimits = () => {
    const [a, setA] = React.useState(1);
    const [b, setB] = React.useState(3);
    const f = (x: number) => 0.5 * Math.sin(x) + 1.5;

    // Càlcul de la integral aproximada (primitiva de 0.5sin(x)+1.5 és -0.5cos(x)+1.5x)
    const calcInt = (from: number, to: number) => {
        const F = (val: number) => -0.5 * Math.cos(val) + 1.5 * val;
        return F(to) - F(from);
    };

    const integralValue = calcInt(a, b);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 5], y: [-0.5, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = a + (i / 19) * (b - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={integralValue >= 0 ? Theme.blue : Theme.red}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                <MovablePoint point={[a, 0]} onMove={(p) => setA(p[0])} color={Theme.yellow} />
                <MovablePoint point={[b, 0]} onMove={(p) => setB(p[0])} color={Theme.yellow} />

                <LaTeX at={[a, -0.4]} tex="a" color={Theme.yellow} />
                <LaTeX at={[b, -0.4]} tex="b" color={Theme.yellow} />

                <LaTeX at={[2, 2.5]} tex={`\\int_{${a.toFixed(1)}}^{${b.toFixed(1)}} f(x)dx = ${integralValue.toFixed(2)}`} color="white" />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                Arrossega els punts <span className="text-yellow-400 font-bold italic">a</span> i <span className="text-yellow-400 font-bold italic">b</span>.
                Si <InlineMath math="b < a" />, la integral computa l'àrea en sentit contrari i el resultat canvia de signe (es torna <span className="text-red-400 font-bold">vermell</span>).
            </div>
        </div>
    );
};

const VisAdditivitatInterval = () => {
    const [a] = React.useState(0.5);
    const [b] = React.useState(4.5);
    const [c, setC] = React.useState(2.5);
    const f = (x: number) => 0.2 * Math.pow(x - 2.5, 2) + 0.5;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-0.5, 5.5], y: [-0.5, 3] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea [a, c] */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = a + (i / 19) * (c - a);
                            return [x, f(x)] as [number, number];
                        }),
                        [c, 0]
                    ]}
                    color={Theme.orange}
                    fillOpacity={0.3}
                />

                {/* Àrea [c, b] */}
                <Polygon
                    points={[
                        [c, 0],
                        ...Array.from({ length: 20 }, (_, i) => {
                            const x = c + (i / 19) * (b - c);
                            return [x, f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.green}
                    fillOpacity={0.3}
                />

                <Plot.OfX y={f} color={Theme.blue} weight={3} />

                <MovablePoint point={[c, 0]} onMove={(p) => setC(Math.min(Math.max(p[0], a + 0.1), b - 0.1))} color={Theme.yellow} />

                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />
                <LaTeX at={[c, -0.4]} tex="c" color={Theme.yellow} />

                <LaTeX at={[(a + c) / 2, 0.4]} tex="\int_a^c f" color={Theme.orange} />
                <LaTeX at={[(c + b) / 2, 0.4]} tex="\int_c^b f" color={Theme.green} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs text-slate-400">
                L'àrea total sota la corba des de <InlineMath math="a" /> fins a <InlineMath math="b" /> és la suma de les dues àrees de colors:
                <br /><span className="text-white font-mono mt-1 inline-block">Integral Total = <span className="text-orange-400">Integral Taronja</span> + <span className="text-green-400">Integral Verda</span></span>
            </div>
        </div>
    );
};

const VisCotaError = () => {
    const [n, setN] = React.useState(4);
    const [mode, setMode] = React.useState<'low' | 'high'>('low');

    const a = 0; const b = 3;
    const f = mode === 'low' ? (x: number) => 0.1 * x * x + 1 : (x: number) => 3 / (x + 1.2);
    
    // Theoretical M2 and M4 values
    const M2 = mode === 'low' ? 0.2 : 6 / Math.pow(1.2, 3);
    const M4 = mode === 'low' ? 0.0001 : 72 / Math.pow(1.2, 5);

    // Calculated bounds
    const cotaT = (Math.pow(b - a, 3) * M2) / (12 * n * n);
    const cotaS = (Math.pow(b - a, 5) * M4) / (180 * Math.pow(n % 2 === 0 ? n : n + 1, 4));

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            {/* 1. Curvature Mode Selection */}
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-center gap-3">
                <button 
                    onClick={() => setMode('low')} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'low' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}
                >
                    Baixa Curvatura
                </button>
                <button 
                    onClick={() => setMode('high')} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'high' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-700 text-slate-400'}`}
                >
                    Alta Curvatura
                </button>
            </div>

            {/* 2. Visual Comparison Graph */}
            <div className="h-80 relative">
                <Mafs viewBox={{ x: [-0.5, 3.5], y: [-0.5, 4] }} pan={false} preserveAspectRatio={false}>
                    <Coordinates.Cartesian />
                    
                    {/* Trapezoids visualization (Yellow) */}
                    {Array.from({ length: n }).map((_, i) => {
                        const dx = (b - a) / n;
                        const x0 = a + i * dx;
                        const x1 = a + (i + 1) * dx;
                        return <Polygon key={`t-${i}`} points={[[x0, 0], [x1, 0], [x1, f(x1)], [x0, f(x0)]]} color={Theme.yellow} fillOpacity={0.1} weight={1} />;
                    })}

                    {/* Simpson visualization (Green dots) */}
                    {Array.from({ length: n % 2 === 0 ? n : n + 1 }).map((_, i) => {
                        const sn = n % 2 === 0 ? n : n + 1;
                        const sdx = (b - a) / sn;
                        return <Circle key={`s-${i}`} center={[a + i * sdx, f(a + i * sdx)]} radius={0.05} color={Theme.green} fillOpacity={1} />;
                    })}

                    <Plot.OfX y={f} color={Theme.blue} weight={3} />
                    <LaTeX at={[1.5, f(1.5) + 0.4]} tex="f(x)" color={Theme.blue} />
                </Mafs>
                <div className="absolute top-4 right-4 flex flex-col gap-2 bg-black/60 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-500">
                        <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500 rounded" />
                        <span>TRAPEZIS: <InlineMath math="O(n^{-2})" /></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>SIMPSON: <InlineMath math="O(n^{-4})" /></span>
                    </div>
                </div>
            </div>

            {/* 3. Controls & Dashboard */}
            <div className="p-6 bg-slate-800/80 border-t border-white/10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre d'intervals (n)</span>
                        <span className="bg-indigo-500 text-white font-mono px-3 py-1 rounded-lg text-lg font-bold shadow-lg shadow-indigo-500/20">{n}</span>
                    </div>
                    <input 
                        type="range" min="2" max="30" step="1" value={n} 
                        onChange={(e) => setN(parseInt(e.target.value))} 
                        className="w-full accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 shadow-inner p-5 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <InlineMath math="E_T" />
                        </div>
                        <div className="text-[10px] font-black text-yellow-500 uppercase mb-3">Cota Error Trapezis</div>
                        <div className="text-3xl font-mono text-white mb-2 tabular-nums">
                            {cotaT.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Fórmula:</span>
                            <InlineMath math={"\\frac{(b-a)^3 M_2}{12 n^2}"} />
                        </div>
                    </div>

                    <div className="bg-slate-900 shadow-inner p-5 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <InlineMath math="E_S" />
                        </div>
                        <div className="text-[10px] font-black text-green-500 uppercase mb-3">Cota Error Simpson</div>
                        <div className="text-3xl font-mono text-white mb-2 tabular-nums">
                            {cotaS.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Fórmula:</span>
                            <InlineMath math={"\\frac{(b-a)^5 M_4}{180 n^4}"} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-center">
                    <p className="text-xs text-indigo-300">
                        Per a <InlineMath math={"n = " + n} />, el mètode de Simpson és aproximadament 
                        <span className="text-white font-bold mx-1">{(cotaT / cotaS).toFixed(0)} cops</span> 
                        més precís que el dels trapezis.
                    </p>
                </div>
            </div>
        </div>
    );
};

const VisLinealitat = () => {
    const [k, setK] = React.useState(1.5);
    const f = (x: number) => 0.5 * Math.sin(x) + 0.8;
    const g = (x: number) => 0.3 * x + 0.4;

    const a = 0.5;
    const b = 3.5;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-0.5, 4.5], y: [-0.2, 5] }} pan={false} zoom={false} preserveAspectRatio={false}>
                <Coordinates.Cartesian />

                {/* Àrea k*f (Blava - a la base) */}
                <Polygon
                    points={[
                        [a, 0],
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, k * f(x)] as [number, number];
                        }),
                        [b, 0]
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.3}
                />

                {/* Àrea g (Taronja - apilada a sobre) */}
                <Polygon
                    points={[
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = a + (i / 29) * (b - a);
                            return [x, k * f(x)] as [number, number];
                        }),
                        ...Array.from({ length: 30 }, (_, i) => {
                            const x = b - (i / 29) * (b - a);
                            return [x, k * f(x) + g(x)] as [number, number];
                        })
                    ]}
                    color={Theme.orange}
                    fillOpacity={0.3}
                />

                {/* Línies de les funcions */}
                <Plot.OfX y={(x) => k * f(x) + g(x)} color={Theme.yellow} weight={3} />
                <Plot.OfX y={(x) => k * f(x)} color={Theme.blue} weight={2} opacity={0.5} />

                <LaTeX at={[a, -0.4]} tex="a" color="white" />
                <LaTeX at={[b, -0.4]} tex="b" color="white" />

                <LaTeX at={[2, 4.5]} tex={`\\int_a^b (k\\cdot f + g) = k\\int_a^b f + \\int_a^b g`} color={Theme.yellow} />
            </Mafs>
            <div className="bg-slate-800/80 p-6 border-t border-white/10 text-white">
                <div className="flex items-center gap-6 mb-4">
                    <span className="text-sm font-medium w-32 shrink-0">Escalar <InlineMath math="k" />:</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={k}
                        onChange={(e) => setK(parseFloat(e.target.value))}
                        className="flex-1 accent-blue-400"
                    />
                    <span className="font-mono bg-blue-500/20 text-blue-400 px-3 py-1 rounded w-16 text-center">{k.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center gap-2 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-tighter">Terme <InlineMath math="k \cdot \int f" /></span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-orange-400 tracking-tighter">Terme <InlineMath math="\int g" /></span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-tighter">Integral Suma</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VisBolaInteractiva = () => {
    const [r, setR] = React.useState(1.5);
    const [isClosed, setIsClosed] = React.useState(false);
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);

    const dist = Math.sqrt(point[0] ** 2 + point[1] ** 2);
    const isIn = isClosed ? dist <= r : dist < r;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Radi:</span>
                    <input
                        type="range" min="0.5" max="2.5" step="0.1" value={r}
                        onChange={(e) => setR(parseFloat(e.target.value))}
                        className="w-32 accent-blue-500"
                    />
                    <span className="text-xs font-mono text-blue-400 w-8">{r.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
                    <button
                        onClick={() => setIsClosed(false)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${!isClosed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        OBERTA
                    </button>
                    <button
                        onClick={() => setIsClosed(true)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition ${isClosed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        TANCADA
                    </button>
                </div>
            </div>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />
                <Circle
                    center={[0, 0]}
                    radius={r}
                    color={Theme.blue}
                    fillOpacity={0.1}
                    strokeStyle={isClosed ? "solid" : "dashed"}
                />
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />
                <LaTeX at={[0, -2.5]} tex={isClosed ? `\\bar{B}(\\vec{0}, ${r.toFixed(1)}) = \\{ \\vec{x} : d(\\vec{x},\\vec{0}) \\le ${r.toFixed(1)} \\}` : `B(\\vec{0}, ${r.toFixed(1)}) = \\{ \\vec{x} : d(\\vec{x},\\vec{0}) < ${r.toFixed(1)} \\}`} color={Theme.blue} />
            </Mafs>
            <div className="p-4 bg-slate-800/80 text-[11px] text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isIn ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>El punt {isIn ? 'pertany' : 'no pertany'} a la bola.</span>
                </div>
            </div>
        </div>
    );
};

const VisExPissarraTopologia = () => {
    const [point, setPoint] = React.useState<[number, number]>([0.4, 0.4]);
    const [view, setView] = React.useState<'set' | 'int' | 'fr'>('set');
    const [epsilon, setEpsilon] = React.useState(0.2);

    // Definició del triangle A: x>=0, y>=0, x+y < 1
    const checkInside = (px: number, py: number) => px > 0 && py > 0 && (px + py < 1);

    // Verificació d'Interior i Frontera mostrejant la bola
    const isInsideTriangle = checkInside(point[0], point[1]);
    const samples = [[0, epsilon], [0, -epsilon], [epsilon, 0], [-epsilon, 0],
    [epsilon * 0.7, epsilon * 0.7], [-epsilon * 0.7, -epsilon * 0.7],
    [epsilon * 0.7, -epsilon * 0.7], [-epsilon * 0.7, epsilon * 0.7]];

    const touchesInside = samples.some(s => checkInside(point[0] + s[0], point[1] + s[1])) || checkInside(point[0], point[1]);
    const touchesOutside = samples.some(s => !checkInside(point[0] + s[0], point[1] + s[1]));

    const isActuallyInterior = isInsideTriangle && !touchesOutside;
    const isActuallyBoundary = touchesInside && touchesOutside;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radi ε:</span>
                    <input type="range" min="0.05" max="0.4" step="0.01" value={epsilon} onChange={(e) => setEpsilon(parseFloat(e.target.value))} className="w-24 accent-blue-500" />
                </div>
                <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                    {['set', 'int', 'fr'].map((v) => (
                        <button key={v} onClick={() => setView(v as any)} className={`px-2 py-1 rounded text-[9px] font-bold transition uppercase ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{v === 'set' ? 'Conjunt A' : v === 'int' ? 'A° (Int)' : 'Fr (Front)'}</button>
                    ))}
                </div>
            </div>

            <Mafs viewBox={{ x: [-0.2, 1.2], y: [-0.2, 1.2] }} pan={false} zoom={false}>
                <Coordinates.Cartesian subdivisions={2} />

                {/* Conjunt A - SEMPRE PINTAT per context */}
                <Polygon points={[[0, 0], [1, 0], [0, 1]]} color={Theme.blue} fillOpacity={0.2} strokeStyle={view === 'fr' ? 'solid' : 'dashed'} />

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

            <div className="p-5 bg-slate-800/50 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-3 rounded-xl border transition-all ${isActuallyInterior ? 'bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20' : 'bg-black/20 border-white/5 opacity-50'}`}>
                        <div className="text-[9px] uppercase font-black text-green-500 mb-2 tracking-widest">Punt Interior (Definició)</div>
                        <div className="mb-2"><InlineMath math="\exists \epsilon > 0 : B(x, \epsilon) \subseteq A" /></div>
                        <p className="text-[9px] text-slate-400 leading-relaxed">Tota la bola entra dins del color blau.</p>
                    </div>
                    <div className={`p-3 rounded-xl border transition-all ${isActuallyBoundary ? 'bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20' : 'bg-black/20 border-white/5 opacity-50'}`}>
                        <div className="text-[9px] uppercase font-black text-orange-500 mb-2 tracking-widest">Punt Frontera (Definició)</div>
                        <div className="mb-2"><InlineMath math="\forall \epsilon > 0 : B \cap A \neq \emptyset \wedge B \cap A^c \neq \emptyset" /></div>
                        <p className="text-[9px] text-slate-400 leading-relaxed">La bola toca blau i negre alhora.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};



const VisDominisComplexos = () => {
    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-5, 5], y: [-3, 3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                <Coordinates.Cartesian subdivisions={5} />

                {/* Regió del domini per a sqrt(y - sin(x)) >= 0 => y >= sin(x) */}
                <Polygon
                    points={[
                        ...Array.from({ length: 101 }, (_, i) => {
                            const x = -5 + (i * 10) / 100;
                            return [x, Math.sin(x)] as [number, number];
                        }),
                        [5, 3],
                        [-5, 3],
                    ]}
                    color={Theme.blue}
                    fillOpacity={0.2}
                    weight={2}
                />

                <Plot.OfX y={(x) => Math.sin(x)} color={Theme.blue} weight={3} />

                <LaTeX at={[0, 1.5]} tex="y \ge \sin(x)" color={Theme.blue} />
                <Text x={-4} y={2.5} color={Theme.blue} size={14}>Domini Ombrejat</Text>
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-xs text-slate-400">
                L'àrea blava representa el domini on la funció està definida. La vora és contínua perquè inclou el signe igual.
            </div>
        </div>
    );
};

const VisCheatSheetConiques = () => {
    const [mode, setMode] = React.useState<'ellipse' | 'hiperbola' | 'parabola' | 'rectes' | 'diamant'>('ellipse');
    const [a, setA] = React.useState(2);
    const [b, setB] = React.useState(1.5);
    const [p, setP] = React.useState(1);

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
            default: return null;
        }
    };

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {['ellipse', 'hiperbola', 'parabola', 'rectes', 'diamant'].map((m) => (
                    <button key={m} onClick={() => setMode(m as any)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-700'}`}>
                        {m === 'ellipse' ? 'El·lipse' : m === 'hiperbola' ? 'Hipèrbola' : m === 'parabola' ? 'Paràbola' : m === 'rectes' ? 'Rectes' : 'Diamant'}
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

const VisClassificacioConjunts = () => {
    const [type, setType] = React.useState<'obert' | 'tancat' | 'acotat' | 'compacte'>('obert');
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);

    const r = 1.5;
    const dist = Math.sqrt(point[0] ** 2 + point[1] ** 2);

    // Lògica de pertinença
    const isIn = type === 'obert' ? dist < r : dist <= r;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <div className="p-2 flex flex-wrap gap-1 bg-slate-800/50 border-b border-white/10">
                {['obert', 'tancat', 'acotat', 'compacte'].map((t) => (
                    <button key={t} onClick={() => setType(t as any)} className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-black transition-all ${type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-slate-700'}`}>{t}</button>
                ))}
            </div>

            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Conjunt Principal */}
                <Circle
                    center={[0, 0]}
                    radius={r}
                    color={Theme.blue}
                    fillOpacity={0.1}
                    strokeStyle={(type === 'obert') ? "dashed" : "solid"}
                    weight={3}
                />

                {/* Bola que l'acota (per Acotat/Compacte) */}
                {(type === 'acotat' || type === 'compacte') && (
                    <Circle center={[0, 0]} radius={2.5} color={Theme.yellow} fillOpacity={0} strokeStyle="dashed" weight={1} />
                )}

                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                {/* Labels de definició */}
                <LaTeX
                    at={[0, -2.5]}
                    tex={type === 'obert' ? "A \\cap Fr(A) = \\emptyset \\implies Obert" :
                        type === 'tancat' ? "Fr(A) \\subseteq A \\implies Tancat" :
                            type === 'acotat' ? "\\exists B(0, R) : A \\subseteq B \\implies Acotat" :
                                "Tancat + Acotat \\implies Compacte"}
                    color={Theme.blue}
                />
            </Mafs>

            <div className="bg-slate-800/80 p-4 border-t border-white/10">
                <p className="text-[11px] text-slate-300 text-center italic">
                    {type === 'obert' && "Vora discontínua: els punts del límit NO són del conjunt."}
                    {type === 'tancat' && "Vora contínua: el conjunt inclou la seva frontera."}
                    {type === 'acotat' && "Es pot tancar dins d'una bola groga finita."}
                    {type === 'compacte' && "És 'segur' l'extrem: tancat (vora plena) i no s'escapa a l'infinit."}
                </p>
            </div>
        </div>
    );
};

const VisMapsTopograficsInteractiu = () => {
    const [k, setK] = React.useState(1);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 3] }} pan={true} zoom={true}>
                <Coordinates.Cartesian />

                {/* z = x^2 - y^2 = k  =>  y = +- sqrt(x^2 - k) */}
                {k > 0 && (
                    <>
                        <Plot.OfX y={(x) => Math.sqrt(Math.max(0, x * x - k))} color={Theme.yellow} weight={3} />
                        <Plot.OfX y={(x) => -Math.sqrt(Math.max(0, x * x - k))} color={Theme.yellow} weight={3} />
                    </>
                )}
                {k < 0 && (
                    <>
                        <Plot.OfX y={(x) => Math.sqrt(Math.pow(x, 2) - k)} color={Theme.blue} weight={3} />
                        <Plot.OfX y={(x) => -Math.sqrt(Math.pow(x, 2) - k)} color={Theme.blue} weight={3} />
                    </>
                )}
                {k === 0 && (
                    <>
                        <Plot.OfX y={(x) => x} color={Theme.green} weight={3} />
                        <Plot.OfX y={(x) => -x} color={Theme.green} weight={3} />
                    </>
                )}

                <LaTeX at={[0, 2.5]} tex={`x^2 - y^2 = ${k.toFixed(1)}`} color={k > 0 ? Theme.yellow : (k < 0 ? Theme.blue : Theme.green)} />
            </Mafs>
            <div className="bg-slate-800/80 p-5 border-t border-white/10">
                <span className="text-xs text-slate-400 block mb-2 font-bold tracking-wider">Ajusta l'altura (k):</span>
                <input type="range" min="-3" max="3" step="0.5" value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="w-full accent-yellow-400" />
            </div>
        </div>
    );
};


const VisDistanciaEuclidia = () => {
    const [p1, setP1] = React.useState<[number, number]>([1, 1]);
    const [p2, setP2] = React.useState<[number, number]>([4, 3]);

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-1, 6], y: [-1, 5] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Triangle de Pitàgores */}
                <Polygon
                    points={[p1, [p2[0], p1[1]], p2]}
                    color={Theme.blue}
                    fillOpacity={0.05}
                    strokeStyle="dashed"
                    weight={1}
                />

                {/* Línia de distància real */}
                <Line.Segment point1={p1} point2={p2} color={Theme.red} weight={4} />

                {/* Labels de components */}
                <LaTeX at={[(p1[0] + p2[0]) / 2, p1[1] - 0.3]} tex={`|\\Delta x| = ${Math.abs(dx).toFixed(1)}`} color={Theme.blue} />
                <LaTeX at={[p2[0] + 0.6, (p1[1] + p2[1]) / 2]} tex={`|\\Delta y| = ${Math.abs(dy).toFixed(1)}`} color={Theme.blue} />

                {/* Punts arrossegables */}
                <MovablePoint point={p1} onMove={setP1} color={Theme.red} />
                <MovablePoint point={p2} onMove={setP2} color={Theme.red} />

                <LaTeX at={[(p1[0] + p2[0]) / 2 - 0.5, (p1[1] + p2[1]) / 2 + 0.5]} tex={`d = ${dist.toFixed(2)}`} color={Theme.red} />
            </Mafs>
        </div>
    );
};

const VisMetodePuntsProva = () => {
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    const isIn = point[0] ** 2 + point[1] ** 2 <= 4;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} pan={false} zoom={false}>
                <Coordinates.Cartesian />

                {/* Regió del domini */}
                <Circle center={[0, 0]} radius={2} color={Theme.blue} fillOpacity={isIn ? 0.3 : 0.05} weight={3} />

                {/* Punt de test */}
                <MovablePoint point={point} onMove={setPoint} color={isIn ? Theme.green : Theme.red} />

                {/* Label dinàmic amb escapament correte i coordenades reals */}
                <LaTeX
                    at={[point[0], point[1] + 0.4]}
                    tex={isIn
                        ? `${point[0].toFixed(1)}^2 + ${point[1].toFixed(1)}^2 \\le 4 \\text{ (SÍ)}`
                        : `${point[0].toFixed(1)}^2 + ${point[1].toFixed(1)}^2 > 4 \\text{ (NO)}`
                    }
                    color={isIn ? Theme.green : Theme.red}
                />

                <LaTeX at={[0, -2.5]} tex="x^2 + y^2 \le 4" color={Theme.blue} />
            </Mafs>
            <div className="bg-slate-800/80 p-4 border-t border-white/10 text-center text-xs">
                <span className={isIn ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {isIn ? "PUNT DENTRE: Sombregem tot l'interior." : "PUNT FORA: Aquesta zona no és del domini."}
                </span>
                <br /> <span className="text-slate-500 italic">Mou el punt per provar la inecuació.</span>
            </div>
        </div>
    );
};

const VisEx72a = () => {
    const [point, setPoint] = React.useState<[number, number]>([1, 1]);
    const val = 1 + point[0] * point[1];
    const isInDomain = val > 0;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8 flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Condició: $1 + xy &gt; 0$</span>
                    <span className="text-sm font-mono text-white">$1 + ({point[0].toFixed(2)}) \\cdot ({point[1].toFixed(2)}) = {val.toFixed(2)}$</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isInDomain ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isInDomain ? '✓ Dins del Domini' : '✗ Fora del Domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Ombrejat del domini xy > -1 per quadrants */}
                {/* Quadrant 1 i 3 (Sempre vàlids) */}
                <Polygon points={[[0, 0], [5, 0], [5, 5], [0, 5]]} color={Theme.blue} fillOpacity={0.3} weight={0} />
                <Polygon points={[[0, 0], [-5, 0], [-5, -5], [0, -5]]} color={Theme.blue} fillOpacity={0.3} weight={0} />

                {/* Quadrant 2 (xy > -1 => y < -1/x) */}
                <Polygon
                    points={[
                        [0, 0], [-5, 0],
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = -5 + i * 0.125;
                            if (x >= -0.1) return null;
                            return [x, -1 / x] as [number, number];
                        }).filter(p => p !== null) as [number, number][],
                        [-0.2, 5], [0, 5], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.3} weight={0}
                />

                {/* Quadrant 4 (xy > -1 => y > -1/x) */}
                <Polygon
                    points={[
                        [0, 0], [5, 0],
                        ...Array.from({ length: 41 }, (_, i) => {
                            const x = 5 - i * 0.125;
                            if (x <= 0.1) return null;
                            return [x, -1 / x] as [number, number];
                        }).filter(p => p !== null) as [number, number][],
                        [0.2, -5], [0, -5], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.3} weight={0}
                />

                {/* Fronteres */}
                <Plot.OfX y={(x) => -1 / x} color={Theme.indigo} weight={2} style="dashed" opacity={0.6} />

                {/* Punt interactiu */}
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />

                {/* Indicador de punt */}
                <LaTeX at={[point[0], point[1] + 0.4]} tex={`(${point[0].toFixed(1)}, ${point[1].toFixed(1)})`} />
            </Mafs>
        </div>
    );
};

const VisEx72b = () => {
    const [point, setPoint] = React.useState<[number, number]>([Math.PI / 2, 2]);
    const val = point[1] * Math.sin(point[0]);
    const isInDomain = val >= 0;

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8 flex flex-col">
            <div className="p-4 bg-slate-800/50 border-b border-white/10 flex justify-between items-center h-20">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Condició: $y \\sin(x) \\ge 0$</span>
                    <span className="text-sm font-mono text-white">val = {val.toFixed(2)}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all shadow-lg ${isInDomain ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {isInDomain ? '✓ Dins del Domini' : '✗ Fora del Domini'}
                </div>
            </div>
            <Mafs viewBox={{ x: [-2 * Math.PI, 2 * Math.PI], y: [-4, 4] }} pan={false}>
                <Coordinates.Cartesian />

                {/* Ombrejat de zones (Casos sin(x)*y >= 0) amb Outline */}
                <Polygon points={[[-2 * Math.PI, 0], [-Math.PI, 0], [-Math.PI, 4], [-2 * Math.PI, 4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[0, 0], [Math.PI, 0], [Math.PI, 4], [0, 4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[-Math.PI, 0], [0, 0], [0, -4], [-Math.PI, -4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />
                <Polygon points={[[Math.PI, 0], [2 * Math.PI, 0], [2 * Math.PI, -4], [Math.PI, -4]]} color={Theme.blue} fillOpacity={0.15} weight={2} />

                {/* Punt interactiu */}
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />
            </Mafs>
        </div>
    );
};

const VisEx74a = () => {
    const [point, setPoint] = React.useState<[number, number]>([1.5, 2]);
    const x = point[0], y = point[1];
    const isInDomain = (x * y > 0) && (y > x * x - 1);

    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 6] }} pan={false}>
                <Coordinates.Cartesian />
                
                {/* Quadrant 1: y > x^2 - 1 i x,y > 0 */}
                <Polygon 
                    points={[
                        [0, 0], [1, 0],
                        ...Array.from({ length: 31 }, (_, i) => {
                            const xi = 1 + i * 0.1;
                            return [xi, xi*xi - 1] as [number, number];
                        }),
                        [4, 15], [0, 15]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />

                {/* Quadrant 3: y > x^2 - 1 i x,y < 0 
                    Només existeix quan x^2 - 1 < 0 => x entre -1 i 0 */}
                <Polygon 
                    points={[
                        [0, 0], 
                        ...Array.from({ length: 21 }, (_, i) => {
                            const xi = -i * 0.05;
                            return [xi, xi*xi - 1] as [number, number];
                        }),
                        [-1, 0], [0, 0]
                    ]}
                    color={Theme.blue} fillOpacity={0.12} weight={0}
                />

                <Plot.OfX y={(x) => x * x - 1} color={Theme.indigo} weight={2} style="dashed" />
                <MovablePoint point={point} onMove={setPoint} color={isInDomain ? Theme.green : Theme.red} />
                <LaTeX at={[point[0], point[1] + 0.4]} tex={`(${point[0].toFixed(1)}, ${point[1].toFixed(1)})`} />
            </Mafs>
            <div className="p-3 bg-slate-950 text-center border-t border-white/10">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isInDomain ? 'text-green-400' : 'text-red-400'}`}>
                    {isInDomain ? "Dins del domini" : "Fora del domini"}
                </span>
            </div>
        </div>
    );
};

const VisEx74b = () => {
    return (
        <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 6] }} pan={false}>
                <Coordinates.Cartesian />
                {/* Ombrejat suau per context */}
                <Polygon points={[[0, 15], [4, 15], [4, 0], [1, 0], [0, 0]]} color={Theme.blue} fillOpacity={0.05} weight={0} />
                <Polygon points={[[0, 0], [0, -1], [-4, 15], [-4, 0]]} color={Theme.blue} fillOpacity={0.05} weight={0} />

                {/* Corba de nivell y = 1/x */}
                <Plot.OfX y={(x) => 1 / x} color={Theme.red} weight={3} />
                
                {/* Punt (1,1) */}
                <Circle center={[1, 1]} radius={0.08} color={Theme.red} fillOpacity={1} />
                <LaTeX at={[1.5, 1.5]} tex="(1,1)" color={Theme.red} />
                <LaTeX at={[3, 0.7]} tex="y = 1/x" color={Theme.red} />
            </Mafs>
        </div>
    );
};

const VISUALIZERS: Record<string, React.ComponentType<any>> = {
    'successio_1_n': VisSuccessio1N,
    'successio_oscilant': VisSuccessioOscilant,
    'teorema_bolzano': VisTeoremaBolzano,
    'derivada_tangent': VisDerivadaTangent,
    'taylor_centrat': VisTaylorCentrat,
    'taylor_error': VisTaylorError,
    'taylor_comportament': VisTaylorComportament,
    'extrems_relatius': VisExtremsRelatius,
    'taylor_teorema': VisTaylorTeorema,
    'taylor_lagrange': VisTaylorLagrange,
    'taylor_maclaurin': VisTaylorMaclaurin,
    'derivacio_logaritmica': VisDerivacioLogaritmica,
    'teorema_rolle': VisTeoremaRolle,
    'teorema_valor_mitja': VisTeoremaValorMitja,
    'regla_hopital': VisReglaHopital,
    'parametrizada_exp': VisParametrizadaExp,
    'unicitat_3x': VisUnicitat3x,
    'teorema_fonamental': VisTeoremaFonamental,
    'primitiva_familia': VisPrimitivaFamilia,
    'regla_barrow': VisReglaBarrow,
    'limits_integracio': VisLimitsIntegracio,
    'integracio_trapezi': VisIntegracioTrapezi,
    'integracio_simpson': VisIntegracioSimpson,
    'area_entre_corbes': VisAreaEntreCorbes,
    'teorema_mitjana': VisTeoremaMitjana,
    'riemann_sums': VisRiemannSums,
    'paritat_integrals': VisParitatIntegrals,
    'cota_error': VisCotaError,
    'propietat_inversio': VisInversioLimits,
    'propietat_additivitat': VisAdditivitatInterval,
    'propietat_linealitat': VisLinealitat,
    'ex_7_1_a': VisExPissarraTopologia,
    'ex_7_1_b': VisClassificacioConjunts,
    'ex_7_2_a': VisEx72a,
    'ex_7_2_b': VisEx72b,
    'ex_7_4_a': VisEx74a,
    'ex_7_4_b': VisEx74b,
    'vis_bola_interactiva': VisBolaInteractiva,
    'vis_ex_pissarra_topologia': VisExPissarraTopologia,
    'vis_dominis_complexos': VisDominisComplexos,
    'vis_cheat_sheet_coniques': VisCheatSheetConiques,
    'vis_maps_topografics_interactiu': VisMapsTopograficsInteractiu,
    'vis_distancia_euclidia': VisDistanciaEuclidia,
    'vis_metode_punts_prova': VisMetodePuntsProva,
    'vis_classificacio_conjunts': VisClassificacioConjunts,
};




const MafsVisualizer: React.FC<MafsVisualizerProps> = ({ type }) => {
    const Component = VISUALIZERS[type];
    if (!Component) {
        return (
            <div className="p-4 border border-red-500/50 rounded-xl bg-red-500/10 text-red-400">
                [Error de Mafs] Tipus de visualització no trobat: {type}
            </div>
        );
    }
    return <Component />;
};

export default MafsVisualizer;
