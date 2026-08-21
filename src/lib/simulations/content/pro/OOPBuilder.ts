import { StepBuilder } from "../../engine/StepBuilder";
import type { OOPVisualState } from "../../engine/types";

export class OOPBuilder extends StepBuilder<OOPVisualState> {
    constructor() {
        super();
        this.visual = {
            activeFile: "",
            terminalOutput: []
        };
    }

    setActiveFile(fileName: string): this {
        this.visual = { ...this.visual, activeFile: fileName };
        return this;
    }

    setTerminalOutput(keys: string[], args?: Record<string, string>): this {
        // Storing keys instead of eager evaluation
        this.visual = {
            ...this.visual,
            terminalOutput: [...keys]
        };
        // Merge terminal args into step variables (we do this later via StepBuilder but here we just store keys)
        if (args) {
            this.setVariables(args);
        }
        return this;
    }

    addTerminalLine(key: string, args?: Record<string, string>): this {
        const current = this.visual.terminalOutput || [];
        this.visual = {
            ...this.visual,
            terminalOutput: [...current, key]
        };
        if (args) {
            this.setVariables(args);
        }
        return this;
    }

    clearTerminal(): this {
        this.visual = { ...this.visual, terminalOutput: [] };
        return this;
    }
}
