import type { SimulationStep } from "./types";

export class StepBuilder<V extends SimulationStep['visual'] = Record<string, unknown>> {
    private steps: SimulationStep[] = [];
    private variables: Record<string, string> = {};
    protected visual: V = {} as V;

    setVariable(key: string, value: string): this {
        this.variables[key] = value;
        return this;
    }

    removeVariable(key: string): this {
        delete this.variables[key];
        return this;
    }

    setVariables(vars: Record<string, string>): this {
        this.variables = { ...this.variables, ...vars };
        return this;
    }

    setVisual(visualUpdates: Partial<V>): this {
        this.visual = { ...this.visual, ...visualUpdates };
        return this;
    }
    
    replaceVisual(newVisual: V): this {
        this.visual = newVisual;
        return this;
    }
    
    getVisual(): V {
        return this.visual;
    }

    addStep(line: number, translationKey: string, i18nArgs?: Record<string, string>, overrideVars: Record<string, string> = {}): this {
        const currentVars = { ...this.variables, ...overrideVars, ...i18nArgs };
        
        // Deep clone visual so future modifications don't affect this step
        const clonedVisual = structuredClone(this.visual);
        
        const step: SimulationStep = {
            line,
            description: translationKey,
            variables: currentVars,
            visual: clonedVisual
        };

        this.steps.push(step);
        return this;
    }

    build(): SimulationStep[] {
        return this.steps;
    }
}
