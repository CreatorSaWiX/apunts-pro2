import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    iteradors_reversos: {
        id: "iteradors_reversos",
        files: {
            "main.cpp": `#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> L = {10, 20, 30};
    
    // Enfoc 1: Intentat recórrer endarrere manualment (Desaconsellat)
    auto it = L.end();
    it--; // Risc alt: L.end() apunta a la cel·la fora dels límits
    
    // Enfoc 2: L'ús de reverse_iterator (Estàndard)
    auto rit = L.rbegin();
    while (rit != L.rend()) {
        *rit += 5;
        rit++; // '++' avança de manera bidireccional automàtica a C++
    }
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 6, description: "pro.iteradors_reversos.step_1", terminalOutput: ["pro.iteradors_reversos.term_1"], variables: { "L": "[10, 20, 30]" } },
                { activeFile: "main.cpp", line: 9, description: "pro.iteradors_reversos.step_2", terminalOutput: ["pro.iteradors_reversos.term_2"], variables: { "L": "[10, 20, 30] ∅", "it": "0xNULL (Fora de rang)" } },
                { activeFile: "main.cpp", line: 10, description: "pro.iteradors_reversos.step_3", terminalOutput: ["pro.iteradors_reversos.term_3"], variables: { "L": "[10, 20, 30]", "it": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 13, description: "pro.iteradors_reversos.step_4", terminalOutput: ["pro.iteradors_reversos.term_4"], variables: { "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 14, description: "pro.iteradors_reversos.step_5", terminalOutput: ["pro.iteradors_reversos.term_5"], variables: { "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 15, description: "pro.iteradors_reversos.step_6", terminalOutput: ["pro.iteradors_reversos.term_6"], variables: { "L_virtual_inv": "[35, 20, 10]", "rit": "-> 35 (0x7ffe1A)", "L_real": "[10, 20, 35]" } },
                { activeFile: "main.cpp", line: 16, description: "pro.iteradors_reversos.step_7", terminalOutput: ["pro.iteradors_reversos.term_7"], variables: { "L_virtual_inv": "[35, 20, 10]", "rit": "-> 20 (0x7ffe2C)", "L_real": "[10, 20, 35]" } },
                { activeFile: "main.cpp", line: 15, description: "pro.iteradors_reversos.step_8", terminalOutput: ["pro.iteradors_reversos.term_8"], variables: { "L_virtual_inv": "[35, 25, 10]", "rit": "-> 25 (0x7ffe2C)", "L_real": "[10, 25, 35]" } },
                { activeFile: "main.cpp", line: 15, description: "pro.iteradors_reversos.step_9", terminalOutput: ["pro.iteradors_reversos.term_9"], variables: { "L_virtual_inv": "[35, 25, 15]", "rit": "-> 15 (0x7ffe3F)", "L_real": "[15, 25, 35]" } },
                { activeFile: "main.cpp", line: 20, description: "pro.iteradors_reversos.step_10", terminalOutput: ["pro.iteradors_reversos.term_10", "pro.iteradors_reversos.term_11"], variables: { "L_real": "[15, 25, 35]" } },
            ] as OOPStep[];
        }
    }
};

export const iteradors_reversos: Simulation = {
    id: legacyAlgo.iteradors_reversos.id,
    renderer: "oop",
    files: legacyAlgo.iteradors_reversos.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.iteradors_reversos.generateSteps().map((step: OOPStep) => ({
            line: step.line,
            description: step.description,
            variables: step.variables,
            visual: {
                activeFile: step.activeFile,
                terminalOutput: step.terminalOutput
            }
        }));
    }
};
