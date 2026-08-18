import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    projecte_sencer_oop: {
        id: "projecte_sencer_oop",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.o Punt.o
	$(CXX) -o program main.o Punt.o

main.o: main.cc Punt.hpp
	$(CXX) $(CXXFLAGS) -c main.cc
	
Punt.o: Punt.cpp Punt.hpp
	$(CXX) $(CXXFLAGS) -c Punt.cpp`,
            "main.cc": `#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p1(1, 2);
    Punt p2(5, 5);
    
    p1.moure(2, 2);
    
    cout << "X de p1: " << p1.get_x() << endl;
    cout << "Punts creats: " << Punt::quants_punts() << endl;
    
    return 0;
}`,
            "Punt.hpp": `#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    double x, y;
    static int comptador; // Compartit per tots els Punts
public:
    Punt(double a, double b);
    void moure(double dx, double dy);
    
    inline double get_x() const { 
        // inline estalvia la crida de funció
        return x; 
    }
    
    static int quants_punts();
};
#endif`,
            "Punt.cpp": `#include "Punt.hpp"

// Inicialitzem l'atribut static
int Punt::comptador = 0;

Punt::Punt(double a, double b) {
    this->x = a; 
    this->y = b;
    comptador++;
}

void Punt::moure(double dx, double dy) {
    // Utilitzem 'this->' explícitament (paràmetre implícit)
    this->x += dx; 
    this->y += dy;
}

int Punt::quants_punts() {
    return comptador; // Accés a variable static
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.projecte_sencer_oop.step_1", terminalOutput: ["pro.projecte_sencer_oop.term_1"], variables: {} },
                { activeFile: "Makefile", line: 11, description: "pro.projecte_sencer_oop.step_2", terminalOutput: ["pro.projecte_sencer_oop.term_2", "pro.projecte_sencer_oop.term_3"], variables: {} },
                { activeFile: "Makefile", line: 8, description: "pro.projecte_sencer_oop.step_3", terminalOutput: ["pro.projecte_sencer_oop.term_4", "pro.projecte_sencer_oop.term_5", "pro.projecte_sencer_oop.term_6"], variables: {} },
                { activeFile: "Makefile", line: 5, description: "pro.projecte_sencer_oop.step_4", terminalOutput: ["pro.projecte_sencer_oop.term_7", "pro.projecte_sencer_oop.term_8", "pro.projecte_sencer_oop.term_9", "pro.projecte_sencer_oop.term_10"], variables: {} },
                { activeFile: "main.cc", line: 6, description: "pro.projecte_sencer_oop.step_5", terminalOutput: ["pro.projecte_sencer_oop.term_11"], variables: { "Punt::comptador": "0" } },
                { activeFile: "main.cc", line: 6, description: "pro.projecte_sencer_oop.step_6", terminalOutput: ["pro.projecte_sencer_oop.term_12"], variables: { "Punt::comptador": "0", "p1": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 6, description: "pro.projecte_sencer_oop.step_7", terminalOutput: ["pro.projecte_sencer_oop.term_13"], variables: { "Punt::comptador": "0", "p1": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1020" } },
                { activeFile: "Punt.cpp", line: 9, description: "pro.projecte_sencer_oop.step_8", terminalOutput: ["pro.projecte_sencer_oop.term_14"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 7, description: "pro.projecte_sencer_oop.step_9", terminalOutput: ["pro.projecte_sencer_oop.term_15"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 6, description: "pro.projecte_sencer_oop.step_10", terminalOutput: ["pro.projecte_sencer_oop.term_16"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1030" } },
                { activeFile: "Punt.cpp", line: 9, description: "pro.projecte_sencer_oop.step_11", terminalOutput: ["pro.projecte_sencer_oop.term_17"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1030" } },
                { activeFile: "main.cc", line: 9, description: "pro.projecte_sencer_oop.step_12", terminalOutput: ["pro.projecte_sencer_oop.term_18"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.cpp", line: 14, description: "pro.projecte_sencer_oop.step_13", terminalOutput: ["pro.projecte_sencer_oop.term_19"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "dx": "2", "dy": "2", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 11, description: "pro.projecte_sencer_oop.step_14", terminalOutput: ["pro.projecte_sencer_oop.term_20"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.hpp", line: 11, description: "pro.projecte_sencer_oop.step_15", terminalOutput: ["pro.projecte_sencer_oop.term_21"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 12, description: "pro.projecte_sencer_oop.step_16", terminalOutput: ["pro.projecte_sencer_oop.term_22", "pro.projecte_sencer_oop.term_23"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.cpp", line: 18, description: "pro.projecte_sencer_oop.step_17", terminalOutput: ["pro.projecte_sencer_oop.term_24", "pro.projecte_sencer_oop.term_25"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "main.cc", line: 15, description: "pro.projecte_sencer_oop.step_18", terminalOutput: ["pro.projecte_sencer_oop.term_26", "pro.projecte_sencer_oop.term_27", "pro.projecte_sencer_oop.term_28", "pro.projecte_sencer_oop.term_29"], variables: { "Punt::comptador": "2" } },
            ] as OOPStep[];
        }
    }
};

export const projecte_sencer_oop: Simulation = {
    id: legacyAlgo.projecte_sencer_oop.id,
    renderer: "oop",
    files: legacyAlgo.projecte_sencer_oop.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.projecte_sencer_oop.generateSteps().map((step: OOPStep) => ({
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
