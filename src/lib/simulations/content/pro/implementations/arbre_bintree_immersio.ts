import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    arbre_bintree_immersio: {
        id: "arbre_bintree_immersio",
        files: {
            "main.cpp": `#include <iostream>
#include <queue>
#include "bintree.hh"
using namespace std;
// Imprimim (Pre-Ordre Arrel, Esquerre, Dret) per profunditat sense cua
void preordre(const BinTree<int>& t) {
    if (!t.empty()) {
        cout << t.value() << " ";
        preordre(t.left());
        preordre(t.right());
    }
}
// L'Amplada per Onades sense baixar infinit! Tema 2 a l'atac BFS
void amplada(BinTree<int> t) {
    if (t.empty()) return;
    queue<BinTree<int>> cua;
    cua.push(t);
    while (!cua.empty()) {
        BinTree<int> curr = cua.front(); 
        cua.pop();
        cout << curr.value() << " ";
        if (!curr.left().empty()) cua.push(curr.left());
        if (!curr.right().empty()) cua.push(curr.right());
    }
}
int main() {
    BinTree<int> fulla_Esq(2);
    BinTree<int> fulla_Der(3);
    BinTree<int> ArbreTotal(1, fulla_Esq, fulla_Der);
    cout << "Preorde: "; preordre(ArbreTotal);
    cout << "\\nAmplada: "; amplada(ArbreTotal);
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 26, description: "pro.arbre_bintree_immersio.step_1", terminalOutput: ["pro.arbre_bintree_immersio.term_1"], variables: {} },
                { activeFile: "main.cpp", line: 28, description: "pro.arbre_bintree_immersio.step_2", terminalOutput: ["pro.arbre_bintree_immersio.term_2"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 29, description: "pro.arbre_bintree_immersio.step_3", terminalOutput: ["pro.arbre_bintree_immersio.term_3"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 8, description: "pro.arbre_bintree_immersio.step_4", terminalOutput: ["pro.arbre_bintree_immersio.term_4", "pro.arbre_bintree_immersio.term_5"], variables: { "t": "[1]" } },
                { activeFile: "main.cpp", line: 9, description: "pro.arbre_bintree_immersio.step_5", terminalOutput: ["pro.arbre_bintree_immersio.term_6", "pro.arbre_bintree_immersio.term_7"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 7, description: "pro.arbre_bintree_immersio.step_6", terminalOutput: ["pro.arbre_bintree_immersio.term_8", "pro.arbre_bintree_immersio.term_9"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 9, description: "pro.arbre_bintree_immersio.step_7", terminalOutput: ["pro.arbre_bintree_immersio.term_10", "pro.arbre_bintree_immersio.term_11"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "pro.arbre_bintree_immersio.step_8", terminalOutput: ["pro.arbre_bintree_immersio.term_12", "pro.arbre_bintree_immersio.term_13"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "pro.arbre_bintree_immersio.step_9", terminalOutput: ["pro.arbre_bintree_immersio.term_14", "pro.arbre_bintree_immersio.term_15"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 8, description: "pro.arbre_bintree_immersio.step_10", terminalOutput: ["pro.arbre_bintree_immersio.term_16", "pro.arbre_bintree_immersio.term_17"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 30, description: "pro.arbre_bintree_immersio.step_11", terminalOutput: ["pro.arbre_bintree_immersio.term_18", "pro.arbre_bintree_immersio.term_19"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 17, description: "pro.arbre_bintree_immersio.step_12", terminalOutput: ["pro.arbre_bintree_immersio.term_20", "pro.arbre_bintree_immersio.term_21"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3", "cua": "->|[1]|->" } },
                { activeFile: "main.cpp", line: 19, description: "pro.arbre_bintree_immersio.step_13", terminalOutput: ["pro.arbre_bintree_immersio.term_22", "pro.arbre_bintree_immersio.term_23"], variables: { "curr": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 20, description: "pro.arbre_bintree_immersio.step_14", terminalOutput: ["pro.arbre_bintree_immersio.term_24", "pro.arbre_bintree_immersio.term_25", "pro.arbre_bintree_immersio.term_26"], variables: { "curr": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 21, description: "pro.arbre_bintree_immersio.step_15", terminalOutput: ["pro.arbre_bintree_immersio.term_27", "pro.arbre_bintree_immersio.term_28", "pro.arbre_bintree_immersio.term_29"], variables: { "curr": "[1]", "cua": "->|[3], [2]|->" } },
                { activeFile: "main.cpp", line: 18, description: "pro.arbre_bintree_immersio.step_16", terminalOutput: ["pro.arbre_bintree_immersio.term_30", "pro.arbre_bintree_immersio.term_31", "pro.arbre_bintree_immersio.term_32", "pro.arbre_bintree_immersio.term_33"], variables: { "cua": "buit" } },
            ] as OOPStep[];
        }
    }
};

export const arbre_bintree_immersio: Simulation = {
    id: legacyAlgo.arbre_bintree_immersio.id,
    renderer: "oop",
    files: legacyAlgo.arbre_bintree_immersio.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.arbre_bintree_immersio.generateSteps().map((step: OOPStep) => ({
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
