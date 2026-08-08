import type { SimulationStep } from "./types";
import i18n from "../../../i18n/config";

export class StepBuilder {
    private steps: SimulationStep[] = [];
    private variables: Record<string, string> = {};
    private visual: Record<string, any> = {};

    setVariable(key: string, value: string) {
        this.variables[key] = value;
    }

    removeVariable(key: string) {
        delete this.variables[key];
    }

    setVariables(vars: Record<string, string>) {
        this.variables = { ...this.variables, ...vars };
    }

    setVisual(visualUpdates: Record<string, any>) {
        this.visual = { ...this.visual, ...visualUpdates };
    }
    
    replaceVisual(newVisual: Record<string, any>) {
        this.visual = newVisual;
    }
    
    getVisual() {
        return this.visual;
    }

    addStep(line: number, translationKey: string, i18nArgs?: Record<string, string>, overrideVars: Record<string, string> = {}) {
        const currentVars = { ...this.variables, ...overrideVars };
        
        // Deep clone visual so future modifications don't affect this step
        const clonedVisual = JSON.parse(JSON.stringify(this.visual));
        
        const step: SimulationStep = {
            line,
            description: i18n.t(translationKey, i18nArgs),
            variables: currentVars,
            visual: clonedVisual
        };

        this.steps.push(step);
    }

    build(): SimulationStep[] {
        return this.steps;
    }
}
