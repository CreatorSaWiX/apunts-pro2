import React from 'react';

/**
 * Reusable D Latch / Flip-Flop component for digital circuit canvases.
 */
interface DLatchProps {
    x: number;
    y: number;
    width?: number;
    height?: number;
    title: string;
    subtitle?: string;
    value: number | string;
    clockActive?: boolean;
    valueVariant?: 'success' | 'warning' | 'default';
}

export const DLatch: React.FC<DLatchProps> = ({
    x,
    y,
    width = 95,
    height = 75,
    title,
    subtitle,
    value,
    clockActive = false,
    valueVariant = 'default'
}) => {
    const isSuccess = valueVariant === 'success';
    const isWarning = valueVariant === 'warning';

    const badgeBg = isSuccess ? '#064e3b' : isWarning ? '#78350f' : '#1e293b';
    const badgeBorder = isSuccess ? '#10b981' : isWarning ? '#f59e0b' : '#475569';
    const badgeText = isSuccess ? '#34d399' : isWarning ? '#fcd34d' : '#cbd5e1';

    const cx = x + width / 2;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={4}
                fill="#111827"
                stroke="#334155"
                strokeWidth={1.5}
            />
            <text x={cx} y={y + 15} fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {title}
            </text>
            {subtitle && (
                <text x={cx} y={y + 25} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    {subtitle}
                </text>
            )}

            {/* D Pin */}
            <text x={x + 9} y={y + 39} fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                D
            </text>
            {/* Q Pin */}
            <text x={x + width - 8} y={y + 39} fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end">
                Q
            </text>

            {/* Clock triangle */}
            <path
                d={`M ${x} ${y + 56} L ${x + 7} ${y + 60} L ${x} ${y + 64}`}
                fill="none"
                stroke={clockActive ? '#38bdf8' : '#64748b'}
                strokeWidth={1.5}
            />

            {/* Value Badge */}
            <rect
                x={cx - 15}
                y={y + 33}
                width={30}
                height={20}
                rx={3}
                fill={badgeBg}
                stroke={badgeBorder}
                strokeWidth={1}
            />
            <text
                x={cx}
                y={y + 47}
                fill={badgeText}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
                textAnchor="middle"
            >
                {value}
            </text>
        </g>
    );
};

/**
 * Reusable Tri-State Buffer with optional inverted enable input.
 */
interface TriStateBufferProps {
    x: number;
    y: number;
    width?: number;
    height?: number;
    enabled: boolean;
    invertedEnable?: boolean;
    color?: string;
    label?: string;
}

export const TriStateBuffer: React.FC<TriStateBufferProps> = ({
    x,
    y,
    width = 60,
    height = 50,
    enabled,
    invertedEnable = true,
    color,
    label = 'TRI'
}) => {
    const strokeColor = color || (enabled ? '#10b981' : '#64748b');
    const midY = y + height / 2;
    const rightX = x + width;

    return (
        <g>
            <polygon
                points={`${x},${y} ${rightX},${midY} ${x},${y + height}`}
                fill={enabled ? '#1e293b' : '#0f172a'}
                stroke={strokeColor}
                strokeWidth="1.8"
            />
            <text
                x={x + width * 0.35}
                y={midY + 4}
                fill={enabled ? '#34d399' : '#64748b'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
            >
                {label}
            </text>

            {/* Enable line and bubble */}
            {invertedEnable ? (
                <circle
                    cx={x + width * 0.58}
                    cy={y + height + 3}
                    r={3.5}
                    fill="#0b0f19"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                />
            ) : (
                <line
                    x1={x + width * 0.58}
                    y1={y + height}
                    x2={x + width * 0.58}
                    y2={y + height + 6}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                />
            )}
        </g>
    );
};

/**
 * Reusable Physical Pin & Status Display component.
 */
interface PhysicalPinProps {
    x: number;
    y: number;
    pinName: string;
    pinState: '0' | '1' | 'Z';
}

export const PhysicalPin: React.FC<PhysicalPinProps> = ({ x, y, pinName, pinState }) => {
    const isOne = pinState === '1';
    const isZero = pinState === '0';

    const padBorder = isOne ? '#10b981' : isZero ? '#64748b' : '#f59e0b';
    const badgeBg = isOne
        ? 'rgba(16, 185, 129, 0.12)'
        : isZero
        ? 'rgba(100, 116, 139, 0.12)'
        : 'rgba(245, 158, 11, 0.12)';
    const textPrimary = isOne ? '#34d399' : isZero ? '#cbd5e1' : '#fbbf24';
    const textDesc = isOne ? '5V (VDD)' : isZero ? '0V (VSS)' : 'Alta Impedància';

    return (
        <g>
            {/* Metal Pad Frame */}
            <rect x={x} y={y + 5} width={46} height={46} rx={4} fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <line x1={x} y1={y + 5} x2={x + 46} y2={y + 51} stroke="#334155" strokeWidth="1" />
            <line x1={x} y1={y + 51} x2={x + 46} y2={y + 5} stroke="#334155" strokeWidth="1" />
            <rect x={x + 10} y={y + 15} width={26} height={26} rx={2} fill="#0f172a" stroke="#64748b" strokeWidth="1" />
            <text x={x + 23} y={y + 32} fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {pinName}
            </text>

            {/* Pin State Status Card */}
            <g transform={`translate(${x + 58}, ${y})`}>
                <rect
                    x="0"
                    y="0"
                    width="112"
                    height="56"
                    rx="5"
                    fill={badgeBg}
                    stroke={padBorder}
                    strokeWidth="1.5"
                />
                <text x="56" y="14" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">
                    ESTAT DEL PIN
                </text>
                <text
                    x="56"
                    y="35"
                    fill={textPrimary}
                    fontSize="16"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                >
                    {pinState === 'Z' ? 'ESTAT Z' : `NIVELL ${pinState}`}
                </text>
                <text
                    x="56"
                    y="48"
                    fill={isOne ? '#10b981' : isZero ? '#94a3b8' : '#f59e0b'}
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                >
                    {textDesc}
                </text>
            </g>
        </g>
    );
};
