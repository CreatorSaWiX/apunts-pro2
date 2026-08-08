import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    convencions_cpp: {
        id: "convencions_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include "Caixa.hh"
using namespace std;

int main() {
    Caixa c(10);
    
    c.afegir(5);
    
    cout << "Tenim: " << c.quantitat() << endl;
    
    // c.afegir(-3); // Descomentar faria petar l'assert
    return 0;
}`,
            "Caixa.hh": `#ifndef CAIXA_HH
#define CAIXA_HH

class Caixa {
    int valor_; // Convenció: membre privat porta '_' final.
    
public:
    Caixa(int valor_inicial);
    void afegir(int extra);
    
    // Mètode inline integrat:
    inline int quantitat() const {
        return valor_;
    }
};

#endif`,
            "Caixa.cpp": `#include "Caixa.hh"
#include <cassert>

// Usant la llista d'inicialitzadors (:)
Caixa::Caixa(int valor_inicial) : valor_(valor_inicial) {
    assert(valor_inicial >= 0);
}

void Caixa::afegir(int extra) {
    // Control de qualitat intern amb l'assert
    assert(extra >= 0); 
    valor_ += extra;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 6, description: "pro.convencions_cpp.step_1", terminalOutput: ["pro.convencions_cpp.term_1"], variables: {} },
                { activeFile: "Caixa.cpp", line: 5, description: "pro.convencions_cpp.step_2", terminalOutput: ["pro.convencions_cpp.term_2"], variables: { "valor_inicial": "10", "c.valor_": "10" } },
                { activeFile: "Caixa.cpp", line: 6, description: "pro.convencions_cpp.step_3", terminalOutput: ["pro.convencions_cpp.term_3"], variables: { "valor_inicial": "10", "c.valor_": "10" } },
                { activeFile: "Caixa.hh", line: 5, description: "pro.convencions_cpp.step_4", terminalOutput: ["pro.convencions_cpp.term_4"], variables: { "c.valor_": "10" } },
                { activeFile: "main.cpp", line: 8, description: "pro.convencions_cpp.step_5", terminalOutput: ["pro.convencions_cpp.term_5"], variables: { "c.valor_": "10" } },
                { activeFile: "Caixa.cpp", line: 11, description: "pro.convencions_cpp.step_6", terminalOutput: ["pro.convencions_cpp.term_6"], variables: { "c.valor_": "10", "extra": "5" } },
                { activeFile: "Caixa.cpp", line: 12, description: "pro.convencions_cpp.step_7", terminalOutput: ["pro.convencions_cpp.term_7"], variables: { "c.valor_": "15" } },
                { activeFile: "main.cpp", line: 10, description: "pro.convencions_cpp.step_8", terminalOutput: ["pro.convencions_cpp.term_8"], variables: { "c.valor_": "15" } },
                { activeFile: "Caixa.hh", line: 12, description: "pro.convencions_cpp.step_9", terminalOutput: ["pro.convencions_cpp.term_9"], variables: { "c.valor_": "15" } },
                { activeFile: "main.cpp", line: 10, description: "pro.convencions_cpp.step_10", terminalOutput: ["pro.convencions_cpp.term_10", "pro.convencions_cpp.term_11"], variables: { "c.valor_": "15" } },
            ] as OOPStep[];
        }
    }
};

export const convencions_cpp: Simulation = {
    id: legacyAlgo.convencions_cpp.id,
    renderer: "oop",
    files: legacyAlgo.convencions_cpp.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.convencions_cpp.generateSteps().map((step: OOPStep) => ({
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
