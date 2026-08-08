import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    pila_cpp: {
        id: "pila_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> S;
    
    S.push(10);
    S.push(20);
    S.push(30);
    
    int top = S.top();
    cout << "Cim actual: " << top << endl;
    
    S.pop();
    cout << "Nou cim: " << S.top() << endl;
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "pro.pila_cpp.step_1", terminalOutput: ["pro.pila_cpp.term_1"], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "pro.pila_cpp.step_2", terminalOutput: ["pro.pila_cpp.term_2"], variables: { "S": "[]", "S.size()": "0" } },
                { activeFile: "main.cpp", line: 8, description: "pro.pila_cpp.step_3", terminalOutput: ["pro.pila_cpp.term_3"], variables: { "S": "[10] <- dalt", "S.size()": "1" } },
                { activeFile: "main.cpp", line: 9, description: "pro.pila_cpp.step_4", terminalOutput: ["pro.pila_cpp.term_4"], variables: { "S": "[10, 20] <- dalt", "S.size()": "2" } },
                { activeFile: "main.cpp", line: 10, description: "pro.pila_cpp.step_5", terminalOutput: ["pro.pila_cpp.term_5"], variables: { "S": "[10, 20, 30] <- dalt", "S.size()": "3" } },
                { activeFile: "main.cpp", line: 12, description: "pro.pila_cpp.step_6", terminalOutput: ["pro.pila_cpp.term_6"], variables: { "S": "[10, 20, 30] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 13, description: "pro.pila_cpp.step_7", terminalOutput: ["pro.pila_cpp.term_7", "pro.pila_cpp.term_8"], variables: { "S": "[10, 20, 30] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 15, description: "pro.pila_cpp.step_8", terminalOutput: ["pro.pila_cpp.term_9", "pro.pila_cpp.term_10"], variables: { "S": "[10, 20] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 16, description: "pro.pila_cpp.step_9", terminalOutput: ["pro.pila_cpp.term_11", "pro.pila_cpp.term_12", "pro.pila_cpp.term_13"], variables: { "S": "[10, 20] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 18, description: "pro.pila_cpp.step_10", terminalOutput: ["pro.pila_cpp.term_14", "pro.pila_cpp.term_15", "pro.pila_cpp.term_16", "pro.pila_cpp.term_17"], variables: {} },
            ] as OOPStep[];
        }
    }
};

export const pila_cpp: Simulation = {
    id: legacyAlgo.pila_cpp.id,
    renderer: "oop",
    files: legacyAlgo.pila_cpp.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.pila_cpp.generateSteps().map((step: OOPStep) => ({
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
