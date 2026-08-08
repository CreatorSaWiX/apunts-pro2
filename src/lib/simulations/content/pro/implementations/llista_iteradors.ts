import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    llista_iteradors: {
        id: "llista_iteradors",
        files: {
            "main.cpp": `#include <iostream>
#include <list>
using namespace std;

void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it); 
        } 
        else if (*it == -1) {
            it = L.insert(it, 0); 
            advance(it, 2); 
        } 
        else {
            it++;
        }
    }
}

int main() {
    list<int> L = {10, -1, 30};
    netejar_llista(L);
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 22, description: "pro.llista_iteradors.step_1", terminalOutput: ["pro.llista_iteradors.term_1"], variables: {} },
                { activeFile: "main.cpp", line: 23, description: "pro.llista_iteradors.step_2", terminalOutput: ["pro.llista_iteradors.term_2"], variables: { "L": "[10] <-> [-1] <-> [30]" } },
                { activeFile: "main.cpp", line: 24, description: "pro.llista_iteradors.step_3", terminalOutput: ["pro.llista_iteradors.term_3"], variables: { "L": "[10] <-> [-1] <-> [30]" } },
                { activeFile: "main.cpp", line: 6, description: "pro.llista_iteradors.step_4", terminalOutput: ["pro.llista_iteradors.term_4"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 8, description: "pro.llista_iteradors.step_5", terminalOutput: ["pro.llista_iteradors.term_5"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 9, description: "pro.llista_iteradors.step_6", terminalOutput: ["pro.llista_iteradors.term_6"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 10, description: "pro.llista_iteradors.step_7", terminalOutput: ["pro.llista_iteradors.term_7", "pro.llista_iteradors.term_8"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 8, description: "pro.llista_iteradors.step_8", terminalOutput: ["pro.llista_iteradors.term_9"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 9, description: "pro.llista_iteradors.step_9", terminalOutput: ["pro.llista_iteradors.term_10"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 12, description: "pro.llista_iteradors.step_10", terminalOutput: ["pro.llista_iteradors.term_11"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 13, description: "pro.llista_iteradors.step_11", terminalOutput: ["pro.llista_iteradors.term_12"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 0 (0x7ffe3D)" } },
                { activeFile: "main.cpp", line: 14, description: "pro.llista_iteradors.step_12", terminalOutput: ["pro.llista_iteradors.term_13"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 8, description: "pro.llista_iteradors.step_13", terminalOutput: ["pro.llista_iteradors.term_14"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 9, description: "pro.llista_iteradors.step_14", terminalOutput: ["pro.llista_iteradors.term_15"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 12, description: "pro.llista_iteradors.step_15", terminalOutput: ["pro.llista_iteradors.term_16"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 17, description: "pro.llista_iteradors.step_16", terminalOutput: ["pro.llista_iteradors.term_17"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> L.end() (0xNULL)" } },
                { activeFile: "main.cpp", line: 8, description: "pro.llista_iteradors.step_17", terminalOutput: ["pro.llista_iteradors.term_18"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> L.end() (0xNULL)" } },
                { activeFile: "main.cpp", line: 25, description: "pro.llista_iteradors.step_18", terminalOutput: ["pro.llista_iteradors.term_19", "pro.llista_iteradors.term_20"], variables: {} },
            ] as OOPStep[];
        }
    }
};

export const llista_iteradors: Simulation = {
    id: legacyAlgo.llista_iteradors.id,
    renderer: "oop",
    files: legacyAlgo.llista_iteradors.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.llista_iteradors.generateSteps().map((step: OOPStep) => ({
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
