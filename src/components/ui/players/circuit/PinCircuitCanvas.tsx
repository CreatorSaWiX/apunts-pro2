import React from 'react';
import type { CircuitPinVisualState } from '../../../../lib/simulations/content/ci/types';
import { DLatch, TriStateBuffer, PhysicalPin } from './primitives/CircuitComponents';

interface PinCircuitCanvasProps {
    visual?: CircuitPinVisualState;
    onToggleExternalInput?: () => void;
}

export const PinCircuitCanvas: React.FC<PinCircuitCanvasProps> = ({ visual }) => {
    const lat = visual?.latValue ?? 0;
    const tris = visual?.trisValue ?? 1;
    const isOutputEnabled = tris === 0;
    const pinState = visual?.pinState ?? 'Z';
    const activeLines = (visual?.activeLines || {}) as Record<string, boolean | undefined>;

    const latColor = isOutputEnabled ? (lat === 1 ? '#10b981' : '#64748b') : '#475569';
    const trisColor = tris === 0 ? '#10b981' : '#f59e0b';
    const pinColor = isOutputEnabled ? (lat === 1 ? '#10b981' : '#64748b') : '#f59e0b';

    return (
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-3 select-none bg-[#090d16] overflow-hidden">
            <svg
                viewBox="0 0 680 340"
                className="w-full h-full max-h-[460px]"
                style={{ shapeRendering: 'geometricPrecision' }}
            >
                {/* Background Pattern */}
                <defs>
                    <pattern id="circuit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.3" />
                    </pattern>
                </defs>
                <rect width="680" height="340" fill="#0b0f19" />
                <rect width="680" height="340" fill="url(#circuit-grid)" />

                {/* --- 1. DATA BUS (LEFT) --- */}
                <g>
                    <line x1="45" y1="20" x2="45" y2="305" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
                    <rect x="10" y="8" width="70" height="18" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                    <text x="45" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        DATA BUS
                    </text>
                </g>

                {/* Bus -> LAT Wire */}
                <path
                    d="M 45 80 L 115 80"
                    stroke={activeLines.dataBusToLat ? '#38bdf8' : '#334155'}
                    strokeWidth={activeLines.dataBusToLat ? '2' : '1.5'}
                    fill="none"
                />
                <circle cx="45" cy="80" r="3" fill={activeLines.dataBusToLat ? '#38bdf8' : '#475569'} />

                {/* WR LAT Clock signal */}
                <path
                    d="M 65 105 L 115 105"
                    stroke={activeLines.wrLat ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    fill="none"
                />
                <text x="60" y="108" fill={activeLines.wrLat ? '#38bdf8' : '#64748b'} fontSize="8" fontFamily="monospace" textAnchor="end">
                    WR LAT
                </text>

                {/* Bus -> TRIS Wire */}
                <path
                    d="M 45 185 L 115 185"
                    stroke={activeLines.dataBusToTris ? '#38bdf8' : '#334155'}
                    strokeWidth={activeLines.dataBusToTris ? '2' : '1.5'}
                    fill="none"
                />
                <circle cx="45" cy="185" r="3" fill={activeLines.dataBusToTris ? '#38bdf8' : '#475569'} />

                {/* WR TRIS Clock signal */}
                <path
                    d="M 65 210 L 115 210"
                    stroke={activeLines.wrTris ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    fill="none"
                />
                <text x="60" y="213" fill={activeLines.wrTris ? '#38bdf8' : '#64748b'} fontSize="8" fontFamily="monospace" textAnchor="end">
                    WR TRIS
                </text>

                {/* --- 2. DATA LATCH (LAT) --- */}
                <DLatch
                    x={115}
                    y={45}
                    title="DATA LATCH"
                    subtitle="(Registre LAT)"
                    value={lat}
                    valueVariant={lat === 1 ? 'success' : 'default'}
                    clockActive={Boolean(activeLines.wrLat)}
                />

                {/* --- 3. DIRECTION LATCH (TRIS) --- */}
                <DLatch
                    x={115}
                    y={150}
                    title="TRIS LATCH"
                    subtitle="(Direcció TRIS)"
                    value={tris}
                    valueVariant={tris === 0 ? 'success' : 'warning'}
                    clockActive={Boolean(activeLines.wrTris)}
                />

                {/* Wire LAT Q -> Tri-State Input */}
                <path d="M 210 80 L 285 80" stroke={latColor} strokeWidth="2" fill="none" />
                <circle cx="210" cy="80" r="2.5" fill={latColor} />
                <text x="247" y="73" fill={latColor} fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Dada: {lat}
                </text>

                {/* Wire TRIS Q -> Tri-State Enable with Inversion Bubble */}
                <path d="M 210 185 L 320 185 L 320 112" stroke={trisColor} strokeWidth="2" fill="none" />
                <circle cx="210" cy="185" r="2.5" fill={trisColor} />
                <text x="260" y="178" fill={trisColor} fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    TRIS = {tris} ({tris === 0 ? 'Sortida' : 'Entrada / Z'})
                </text>

                {/* --- 4. TRI-STATE BUFFER --- */}
                <g>
                    <TriStateBuffer
                        x={285}
                        y={55}
                        width={60}
                        height={50}
                        enabled={isOutputEnabled}
                        color={isOutputEnabled ? '#10b981' : '#64748b'}
                    />

                    {/* Status Badge above Tri-State */}
                    <rect
                        x="275"
                        y="30"
                        width="80"
                        height="16"
                        rx="3"
                        fill={isOutputEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}
                        stroke={isOutputEnabled ? '#10b981' : '#f59e0b'}
                        strokeWidth="1"
                    />
                    <text
                        x="315"
                        y="41"
                        fill={isOutputEnabled ? '#34d399' : '#fbbf24'}
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                    >
                        {isOutputEnabled ? 'HABILITAT' : 'TALLAT (Hi-Z)'}
                    </text>
                </g>

                {/* Wire from Tri-State Output -> Physical Pin */}
                {isOutputEnabled ? (
                    <path d="M 345 80 L 490 80" stroke={pinColor} strokeWidth="2.5" fill="none" />
                ) : (
                    <g>
                        {/* Cut-off open switch */}
                        <line x1="345" y1="80" x2="375" y2="80" stroke="#64748b" strokeWidth="1.5" />
                        <circle cx="375" cy="80" r="2.5" fill="#0b0f19" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="375" y1="80" x2="395" y2="65" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="402" cy="80" r="2.5" fill="#0b0f19" stroke="#f59e0b" strokeWidth="1.5" />
                        <path d="M 402 80 L 490 80" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 3" fill="none" />
                        <text x="388" y="55" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            Tallat (Z)
                        </text>
                    </g>
                )}

                {/* Branch point down to Input Buffer (Lectura PORT) */}
                <circle cx="440" cy="80" r="3" fill={pinColor} />
                <path d="M 440 80 L 440 265 L 365 265" stroke={activeLines.pinToPortRead ? '#38bdf8' : '#334155'} strokeWidth="1.8" fill="none" />

                {/* --- 5. PHYSICAL PIN PAD (RA0) --- */}
                <PhysicalPin
                    x={490}
                    y={52}
                    pinName="RA0"
                    pinState={pinState}
                />

                {/* --- 6. INPUT BUFFER (SCHMITT TRIGGER / LECTURA PORT) --- */}
                <g>
                    {/* Read Buffer (pointing left toward Data Bus) */}
                    <polygon
                        points="365,250 315,265 365,280"
                        fill="#1e293b"
                        stroke={activeLines.pinToPortRead ? '#38bdf8' : '#334155'}
                        strokeWidth="1.5"
                    />
                    {/* Schmitt Trigger hysteresis symbol */}
                    <path d="M 347,260 L 341,260 L 341,270 L 335,270" stroke="#94a3b8" strokeWidth="1" fill="none" />
                    <text x="340" y="244" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        Buffer Schmitt
                    </text>

                    {/* Wire from buffer -> Read Gate -> Data Bus */}
                    <path
                        d="M 315 265 L 245 265"
                        stroke={activeLines.rdPort ? '#38bdf8' : '#334155'}
                        strokeWidth="1.8"
                        fill="none"
                    />

                    {/* RD PORT Control Gate */}
                    <polygon
                        points="245,254 210,265 245,276"
                        fill="#111827"
                        stroke={activeLines.rdPort ? '#38bdf8' : '#334155'}
                        strokeWidth="1.5"
                    />
                    <path
                        d="M 210 265 L 45 265"
                        stroke={activeLines.portReadToBus ? '#38bdf8' : '#334155'}
                        strokeWidth="2"
                        fill="none"
                    />
                    <circle cx="45" cy="265" r="3" fill={activeLines.portReadToBus ? '#38bdf8' : '#334155'} />

                    {/* RD PORT signal */}
                    <line x1="228" y1="295" x2="228" y2="276" stroke={activeLines.rdPort ? '#38bdf8' : '#334155'} strokeWidth="1.2" />
                    <text x="228" y="306" fill={activeLines.rdPort ? '#38bdf8' : '#64748b'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                        RD PORTA
                    </text>
                    <text x="125" y="260" fill={activeLines.portReadToBus ? '#38bdf8' : '#64748b'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                        Llegeix pin cap a W
                    </text>
                </g>

                {/* --- 7. EXPLANATION FOOTER --- */}
                <g transform="translate(45, 328)">
                    <text x="0" y="0" fill="#64748b" fontSize="8.5" fontFamily="sans-serif">
                        <tspan fontWeight="bold" fill="#94a3b8">TRIS=0 (Output):</tspan>{' '}
                        <tspan fill="#34d399">Buffer actiu</tspan> &#8594; Pin imposa 0V o 5V.{' '}
                        <tspan fontWeight="bold" fill="#94a3b8"> |  TRIS=1 (Input):</tspan>{' '}
                        <tspan fill="#f59e0b">Buffer tallat</tspan> &#8594; Pin queda en Alta Impedància (Z) sense curtcircuit.
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default PinCircuitCanvas;
