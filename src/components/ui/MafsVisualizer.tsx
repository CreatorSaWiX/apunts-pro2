import React from 'react';
import { Mafs, Coordinates, Plot, Theme, Text, LaTeX, Polygon } from 'mafs';
import 'katex/dist/katex.min.css';

type MafsVisualizerProps = {
    type: string;
};

const MafsVisualizer: React.FC<MafsVisualizerProps> = ({ type }) => {
    if (type === 'successio_1_n') {
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
    }

    if (type === 'successio_oscilant') {
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
    }

    if (type === 'teorema_bolzano') {
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
    }

    if (type === 'derivada_tangent') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
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
    }

    if (type === 'taylor_ln') {
        const f = (x: number) => Math.log(x);
        const p1 = (x: number) => (x - 1);
        const p2 = (x: number) => (x - 1) - 0.5 * Math.pow(x - 1, 2);
        const p3 = (x: number) => (x - 1) - 0.5 * Math.pow(x - 1, 2) + (1 / 3) * Math.pow(x - 1, 3);

        return (
            <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
                <Mafs viewBox={{ x: [0, 4], y: [-2, 2] }} pan={true} zoom={true} preserveAspectRatio={false}>
                    <Coordinates.Cartesian subdivisions={5} />
                    <Plot.OfX y={f} color={Theme.red} weight={4} />
                    <Plot.OfX y={p1} color={Theme.blue} weight={2} opacity={0.6} />
                    <Plot.OfX y={p2} color={Theme.green} weight={2} opacity={0.6} />
                    <Plot.OfX y={p3} color={Theme.yellow} weight={2} opacity={0.6} />

                    <circle cx={1} cy={0} r={0.1} fill="white" />

                    <LaTeX at={[0.5, 1.5]} tex="f(x) = \ln(x)" color={Theme.red} />
                    <LaTeX at={[3, 1.8]} tex="P_1" color={Theme.blue} />
                    <LaTeX at={[3, 0.5]} tex="P_2" color={Theme.green} />
                    <LaTeX at={[2.5, 1.2]} tex="P_3" color={Theme.yellow} />
                </Mafs>
                <div className="bg-slate-800/80 p-4 border-t border-white/10 flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] md:text-xs font-mono">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> Funció Real</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> Grau 1 (Tangent)</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> Grau 2 (Paràbola)</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full" /> Grau 3</span>
                </div>
            </div>
        );
    }

    if (type === 'extrems_relatius') {
        const f = (x: number) => {
            if (x < 0) return 0; // Domini [0,1]
            return Math.pow(x, 2 / 3) * Math.pow(x - 1, 4);
        }

        return (
            <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 my-8">
                <Mafs viewBox={{ x: [-0.2, 1.2], y: [-0.05, 0.3] }} pan={true} zoom={true} preserveAspectRatio={false}>
                    <Coordinates.Cartesian subdivisions={5} />
                    <Plot.OfX y={f} color={Theme.blue} weight={4} />

                    {/* Màxim a 1/7 ≈ 0.14 */}
                    <circle cx={1 / 7} cy={f(1 / 7)} r={0.02} fill={Theme.red} stroke="white" strokeWidth={0.01} />
                    {/* Mínims a 0 i 1 */}
                    <circle cx={0} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />
                    <circle cx={1} cy={0} r={0.02} fill={Theme.green} stroke="white" strokeWidth={0.01} />

                    <LaTeX at={[1 / 7, f(1 / 7) + 0.03]} tex="M(1/7, f(1/7))" color={Theme.red} />
                    <LaTeX at={[0.6, -0.1]} tex="x^{2/3}(x-1)^4" color={Theme.blue} />
                </Mafs>
                <div className="bg-slate-800/80 p-4 border-t border-white/10 flex justify-center gap-8 text-xs font-mono">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> Mínims (f=0)</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> Màxim relatiu</span>
                </div>
            </div>
        );
    }

    if (type === 'parametrizada_exp') {
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
    }

    if (type === 'unicitat_3x') {
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
    }

    if (type === 'integracio_trapezi') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [n, setN] = React.useState(4);
        const f = (x: number) => Math.sin(x) + 2;
        const a = 0;
        const b = 2 * Math.PI;
        const dx = (b - a) / n;
        
        const polygons = [];
        for(let i = 0; i < n; i++) {
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
    }

    if (type === 'integracio_simpson') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [n, setN] = React.useState(4); // n ha de ser parell
        const f = (x: number) => Math.sin(x) + 2;
        const a = 0;
        const b = 2 * Math.PI;
        const dx = (b - a) / n;
        
        const polygons = [];
        
        for(let i = 0; i < n; i += 2) {
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
    }

    return (
        <div className="p-4 border border-red-500/50 rounded-xl bg-red-500/10 text-red-400">
            [Error de Mafs] Tipus de visualització no trobat: {type}
        </div>
    );
};

export default MafsVisualizer;
