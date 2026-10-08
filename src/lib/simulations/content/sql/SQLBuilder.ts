import { StepBuilder } from "../../engine/StepBuilder";
import type { SQLVisualState, SQLDatabaseSchema, SQLTableData } from "../../engine/types";

export class SQLBuilder extends StepBuilder<SQLVisualState> {
    constructor() {
        super();
        this.visual = {
            schema: { tables: [], relations: [] },
            activeTables: [],
            activeColumns: {},
            sourceTables: {},
            resultTable: undefined,
            explanation: undefined,
            activeStepTitle: undefined
        };
    }

    setSchema(schema: SQLDatabaseSchema): this {
        this.visual = { ...this.visual, schema };
        return this;
    }

    setActiveTables(tables: string[]): this {
        this.visual = { ...this.visual, activeTables: tables };
        return this;
    }

    setActiveColumns(tableName: string, columns: string[]): this {
        const activeColumns = { ...(this.visual.activeColumns || {}), [tableName]: columns };
        this.visual = { ...this.visual, activeColumns };
        return this;
    }

    setSourceTables(sourceTables: Record<string, SQLTableData>): this {
        this.visual = { ...this.visual, sourceTables };
        return this;
    }

    updateRowStatuses(tableName: string, statuses: ('normal' | 'active' | 'filtered' | 'inserted' | 'updated' | 'deleted')[]): this {
        const sourceTables = { ...(this.visual.sourceTables || {}) };
        if (sourceTables[tableName]) {
            sourceTables[tableName] = {
                ...sourceTables[tableName],
                rowStatuses: statuses
            };
        }
        this.visual = { ...this.visual, sourceTables };
        return this;
    }

    setResultTable(resultTable: SQLTableData | undefined): this {
        this.visual = { ...this.visual, resultTable };
        return this;
    }

    setExplanation(explanation: string): this {
        this.visual = { ...this.visual, explanation };
        return this;
    }

    setActiveStepTitle(activeStepTitle: string): this {
        this.visual = { ...this.visual, activeStepTitle };
        return this;
    }
}
