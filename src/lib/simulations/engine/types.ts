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

export interface SQLTableColumn {
    name: string;
    type: string;
    isPk?: boolean;
    isFk?: boolean;
    references?: { table: string; column: string };
    nullable?: boolean;
    defaultValue?: string;
    check?: string;
}

export interface SQLTableSchema {
    name: string;
    columns: SQLTableColumn[];
    x?: number;
    y?: number;
}

export interface SQLRelation {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
    cardinality?: '1:1' | '1:N' | 'N:M';
}

export interface SQLDatabaseSchema {
    tables: SQLTableSchema[];
    relations: SQLRelation[];
}

export interface SQLTableData {
    columns: string[];
    rows: (string | number | boolean | null)[][];
    rowStatuses?: ('normal' | 'active' | 'filtered' | 'inserted' | 'updated' | 'deleted')[];
}

export interface SQLVisualState {
    schema?: SQLDatabaseSchema;
    activeTables?: string[];
    activeColumns?: Record<string, string[]>;
    sourceTables?: Record<string, SQLTableData>;
    resultTable?: SQLTableData;
    activeStepTitle?: string;
    explanation?: string;
    [key: string]: unknown;
}

export interface SimulationStep {
    line: number;
    description: string;
    variables: Record<string, string>;
    visual: GraphVisualState | OOPVisualState | SQLVisualState | Record<string, unknown>;
}

export interface Simulation {
    id: string;
    renderer: 'graph' | 'oop' | 'sql';
    mode?: 'schema' | 'query';
    code?: string;
    files?: Record<string, string>;
    generateSteps: () => SimulationStep[];
    initialState?: Record<string, unknown>;
}
