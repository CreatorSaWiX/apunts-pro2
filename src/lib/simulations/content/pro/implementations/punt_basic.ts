import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    punt_basic: {
        id: "punt_basic",
        files: {
            "main.cpp": `#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p(1, 2);
    
    p.moure(3, 3);
    
    cout << "Coordenada X: " << p.get_x() << endl;
    return 0;
}`,
            "Punt.hpp": `class Punt {
    double x, y;
public:
    Punt(double a, double b);
    void moure(double dx, double dy);
    double get_x() const;
};`,
            "Punt.cpp": `#include "Punt.hpp"

Punt::Punt(double a, double b) {
    x = a; 
    y = b;
}

void Punt::moure(double dx, double dy) {
    x += dx; 
    y += dy;
}

double Punt::get_x() const {
    return x;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "pro.punt_basic.step_1", terminalOutput: ["pro.punt_basic.term_1"], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "pro.punt_basic.step_2", terminalOutput: ["pro.punt_basic.term_2"], variables: { "p": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 3, description: "pro.punt_basic.step_3", terminalOutput: ["pro.punt_basic.term_3"], variables: { "p": "Punt {x: -858993460, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 4, description: "pro.punt_basic.step_4", terminalOutput: ["pro.punt_basic.term_4"], variables: { "p": "Punt {x: 1, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 5, description: "pro.punt_basic.step_5", terminalOutput: ["pro.punt_basic.term_5"], variables: { "p": "Punt {x: 1, y: 2}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 6, description: "pro.punt_basic.step_6", terminalOutput: ["pro.punt_basic.term_6"], variables: { "p": "Punt {x: 1, y: 2}" } },
                { activeFile: "main.cpp", line: 8, description: "pro.punt_basic.step_7", terminalOutput: ["pro.punt_basic.term_7"], variables: { "p": "Punt {x: 1, y: 2}" } },
                { activeFile: "Punt.cpp", line: 9, description: "pro.punt_basic.step_8", terminalOutput: ["pro.punt_basic.term_8"], variables: { "p": "Punt {x: 4, y: 2}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 10, description: "pro.punt_basic.step_9", terminalOutput: ["pro.punt_basic.term_9"], variables: { "p": "Punt {x: 4, y: 5}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 10, description: "pro.punt_basic.step_10", terminalOutput: ["pro.punt_basic.term_10"], variables: { "p": "Punt {x: 4, y: 5}" } },
                { activeFile: "Punt.cpp", line: 14, description: "pro.punt_basic.step_11", terminalOutput: ["pro.punt_basic.term_11"], variables: { "p": "Punt {x: 4, y: 5}", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 10, description: "pro.punt_basic.step_12", terminalOutput: ["pro.punt_basic.term_12", "pro.punt_basic.term_13"], variables: { "p": "Punt {x: 4, y: 5}" } },
                { activeFile: "main.cpp", line: 11, description: "pro.punt_basic.step_13", terminalOutput: ["pro.punt_basic.term_14", "pro.punt_basic.term_15", "pro.punt_basic.term_16"], variables: {} },
            ] as OOPStep[];
        }
    }
};

export const punt_basic: Simulation = {
    id: legacyAlgo.punt_basic.id,
    renderer: "oop",
    files: legacyAlgo.punt_basic.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.punt_basic.generateSteps().map((step: OOPStep) => ({
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
