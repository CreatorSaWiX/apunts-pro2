export interface GraphVisualState {
    highlights?: Record<string | number, string>;
    nodeLabels?: Record<string | number, string>;
    links?: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[];
    [key: string]: unknown;
}

export interface OOPVisualState {
    activeFile: string;
    terminalOutput: string[];
    [key: string]: unknown;
}

export interface CircuitRegisterItem {
    value: string;
    label?: string;
    description?: string;
    variant?: 'default' | 'success' | 'warning' | 'info' | 'danger';
}

export type CircuitRegistersState = Record<string, string | CircuitRegisterItem | undefined>;

export interface CircuitVisualState {
    activeLines?: Record<string, boolean | undefined>;
    registers?: CircuitRegistersState;
    [key: string]: unknown;
}

export interface SimulationStep {
    line: number;
    description: string;
    variables: Record<string, string>;
    visual: GraphVisualState | OOPVisualState | CircuitVisualState | Record<string, unknown>;
}

export interface Simulation {
    id: string;
    renderer: 'graph' | 'oop' | 'sql' | 'circuit';
    circuitType?: string;
    circuitLabel?: string;
    code?: string;
    files?: Record<string, string>;
    generateSteps: () => SimulationStep[];
    initialState?: Record<string, unknown>;
}
