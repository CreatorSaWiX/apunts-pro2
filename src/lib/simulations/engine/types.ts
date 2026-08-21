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

export interface SimulationStep {
    line: number;
    description: string;
    variables: Record<string, string>;
    visual: GraphVisualState | OOPVisualState | Record<string, unknown>;
}

export interface Simulation {
    id: string;
    renderer: 'graph' | 'oop' | 'sql';
    code?: string;
    files?: Record<string, string>;
    generateSteps: () => SimulationStep[];
    initialState?: Record<string, unknown>;
}
