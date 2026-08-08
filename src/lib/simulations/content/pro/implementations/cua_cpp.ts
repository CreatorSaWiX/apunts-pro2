import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    cua_cpp: {
        id: "cua_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> Q;
    
    Q.push(10);
    Q.push(20);
    Q.push(30);
    
    int processar = Q.front();
    cout << "Atenent al primer: " << processar << endl;
    
    Q.pop();
    cout << "Següent del torn: " << Q.front() << endl;
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "pro.cua_cpp.step_1", terminalOutput: ["pro.cua_cpp.term_1"], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "pro.cua_cpp.step_2", terminalOutput: ["pro.cua_cpp.term_2"], variables: { "Q": "[]", "Q.size()": "0" } },
                { activeFile: "main.cpp", line: 8, description: "pro.cua_cpp.step_3", terminalOutput: ["pro.cua_cpp.term_3"], variables: { "Q": "[10]", "Q.size()": "1" } },
                { activeFile: "main.cpp", line: 9, description: "pro.cua_cpp.step_4", terminalOutput: ["pro.cua_cpp.term_4"], variables: { "Q": "dav[10, 20]dar", "Q.size()": "2" } },
                { activeFile: "main.cpp", line: 10, description: "pro.cua_cpp.step_5", terminalOutput: ["pro.cua_cpp.term_5"], variables: { "Q": "dav[10, 20, 30]dar", "Q.size()": "3" } },
                { activeFile: "main.cpp", line: 12, description: "pro.cua_cpp.step_6", terminalOutput: ["pro.cua_cpp.term_6"], variables: { "Q": "dav[10, 20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 13, description: "pro.cua_cpp.step_7", terminalOutput: ["pro.cua_cpp.term_7", "pro.cua_cpp.term_8"], variables: { "Q": "dav[10, 20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 15, description: "pro.cua_cpp.step_8", terminalOutput: ["pro.cua_cpp.term_9", "pro.cua_cpp.term_10"], variables: { "Q": "dav[20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 16, description: "pro.cua_cpp.step_9", terminalOutput: ["pro.cua_cpp.term_11", "pro.cua_cpp.term_12", "pro.cua_cpp.term_13"], variables: { "Q": "dav[20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 18, description: "pro.cua_cpp.step_10", terminalOutput: ["pro.cua_cpp.term_14", "pro.cua_cpp.term_15", "pro.cua_cpp.term_16", "pro.cua_cpp.term_17"], variables: {} },
            ] as OOPStep[];
        }
    }
};

export const cua_cpp: Simulation = {
    id: legacyAlgo.cua_cpp.id,
    renderer: "oop",
    files: legacyAlgo.cua_cpp.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.cua_cpp.generateSteps().map((step: OOPStep) => ({
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
