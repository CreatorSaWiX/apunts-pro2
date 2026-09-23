import React, { useMemo } from 'react';
import { LayoutTemplate } from 'lucide-react';
import type { CircuitVisualState, CircuitRegisterItem, CircuitRegistersState } from '../../../../lib/simulations/engine/types';

interface CircuitRegistersProps {
    visual?: CircuitVisualState;
    registers?: CircuitRegistersState;
    title?: string;
    subtitle?: string;
}

function parseRegisterString(key: string, raw: string): CircuitRegisterItem {
    const parenMatch = raw.match(/^([^(]+)\s*\((.+)\)$/);
    let value = raw;
    let label: string | undefined;

    if (parenMatch) {
        value = parenMatch[1].trim();
        label = parenMatch[2].trim();
    }

    let variant: CircuitRegisterItem['variant'] = 'default';
    const upperKey = key.toUpperCase();
    const upperVal = value.toUpperCase();
    const upperLabel = (label || '').toUpperCase();

    if (upperVal.includes('Z') || upperLabel.includes('IMPED') || upperLabel.includes('FLOTANT')) {
        variant = 'warning';
    } else if (
        upperLabel.includes('SORTIDA') ||
        upperVal === '1' ||
        upperVal.includes('5V') ||
        upperLabel.includes('5V')
    ) {
        variant = 'success';
    } else if (upperKey.includes('TRIS') && (upperVal === '1' || upperVal.includes('0X01') || upperLabel.includes('ENTRADA'))) {
        variant = 'warning';
    } else if (upperKey === 'W' || upperKey.includes('WREG')) {
        variant = 'info';
    }

    return { value, label, variant };
}

const VARIANT_STYLES: Record<NonNullable<CircuitRegisterItem['variant']>, { card: string; badge: string }> = {
    success: {
        card: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-300'
    },
    warning: {
        card: 'bg-amber-950/20 border-amber-500/30 text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300'
    },
    info: {
        card: 'bg-sky-950/20 border-sky-500/30 text-sky-400',
        badge: 'bg-sky-500/10 text-sky-300'
    },
    danger: {
        card: 'bg-rose-950/20 border-rose-500/30 text-rose-400',
        badge: 'bg-rose-500/10 text-rose-300'
    },
    default: {
        card: 'bg-slate-900/40 border-slate-700/40 text-slate-300',
        badge: 'bg-white/5 text-slate-400'
    }
};

export const CircuitRegisters: React.FC<CircuitRegistersProps> = ({
    visual,
    registers: directRegisters,
    title,
    subtitle
}) => {
    const rawRegisters = directRegisters || visual?.registers;

    const regEntries: [string, CircuitRegisterItem][] = useMemo(() => {
        if (rawRegisters && Object.keys(rawRegisters).length > 0) {
            return Object.entries(rawRegisters).map(([key, item]) => {
                if (typeof item === 'string') {
                    return [key, parseRegisterString(key, item)];
                }
                return [key, item || { value: '-' }];
            });
        }

        // Backward compatibility fallback for legacy pin structures without registers map
        if (visual && 'trisValue' in visual) {
            const pinVis = visual as Record<string, any>;
            const tris = pinVis.trisValue ?? 1;
            const lat = pinVis.latValue ?? 0;
            const pinState = pinVis.pinState ?? 'Z';
            const w = pinVis.registers?.W ?? '0x00';

            return [
                ['TRISA <0>', { value: String(tris), label: tris === 0 ? 'SORTIDA' : 'ENTRADA (Z)', variant: tris === 0 ? 'success' : 'warning' }],
                ['LATA <0>', { value: String(lat), label: lat === 1 ? '5V (VDD)' : '0V (VSS)', variant: lat === 1 ? 'success' : 'default' }],
                ['PIN FÍSIC (RA0)', { value: String(pinState), label: pinState === 'Z' ? 'Flotant' : `${pinState === '1' ? '5V' : '0V'}`, variant: pinState === '1' ? 'success' : pinState === '0' ? 'default' : 'warning' }],
                ['REGISTRE W', { value: String(w), label: 'Acumulador', variant: 'info' }]
            ];
        }

        return [];
    }, [rawRegisters, visual]);

    if (regEntries.length === 0) {
        return null;
    }

    return (
        <div className="bg-[#090b10] border-t border-slate-800/80 flex flex-col relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] shrink-0">
            <div className="px-4 py-2 bg-[#0d1117] border-b border-slate-800/50 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2">
                    <LayoutTemplate size={12} className="text-slate-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        {title || 'REGISTRES SFR (PIC18)'}
                    </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                    {subtitle || `${regEntries.length} registres actius`}
                </span>
            </div>

            <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs select-none">
                {regEntries.map(([regName, regData]) => {
                    const variant = regData.variant || 'default';
                    const styles = VARIANT_STYLES[variant];

                    return (
                        <div
                            key={regName}
                            className={`p-2 rounded-lg border transition-all ${styles.card}`}
                        >
                            <div className="text-[10px] text-slate-500 font-semibold truncate" title={regName}>
                                {regName}
                            </div>
                            <div className="text-base font-bold flex items-center justify-between mt-0.5 gap-1">
                                <span className="truncate" title={regData.value}>
                                    {regData.value}
                                </span>
                                {regData.label && (
                                    <span
                                        className={`text-[10px] font-sans px-1.5 py-0.5 rounded truncate max-w-[110px] ${styles.badge}`}
                                        title={regData.label}
                                    >
                                        {regData.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CircuitRegisters;
