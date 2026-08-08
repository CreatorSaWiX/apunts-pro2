export interface SimulationStep {
    line: number;
    description: string;
    variables: Record<string, string>;
    visual: Record<string, any>;
}

export interface Simulation {
    id: string;
    renderer: 'graph' | 'oop' | 'sql';
    code?: string;
    files?: Record<string, string>;
    generateSteps: () => SimulationStep[];
    initialState?: Record<string, any>;
}
