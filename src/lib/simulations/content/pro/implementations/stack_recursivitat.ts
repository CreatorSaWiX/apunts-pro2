import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    stack_recursivitat: {
        id: "stack_recursivitat",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_recursivitat
	@./test_recursivitat -ni

test_recursivitat: test_recursivitat.cc recursivitat.cc
	$(CXX) $(CXX_FLAGS) -o test_recursivitat test_recursivitat.cc recursivitat.cc`,
            "test_recursivitat.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void escriu(int n, ostream& out);

TEST_CASE("n = 2") {
    ostringstream sout;

    escriu(2, sout);

    CHECK(sout.str() == " 2 1 1");
}`,
            "recursivitat.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterant contínuament fins haver desapilat tota acció virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // El simulador real apila dreta i després esquerra. Aquí ho
            // adaptem a la recursivitat pura de dalt a baix iterativa.
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.stack_recursivitat.step_1", terminalOutput: ["pro.stack_recursivitat.term_1", "pro.stack_recursivitat.term_2"], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 8, description: "pro.stack_recursivitat.step_2", terminalOutput: ["pro.stack_recursivitat.term_3", "pro.stack_recursivitat.term_4", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 9, description: "pro.stack_recursivitat.step_3", terminalOutput: [], variables: { "sout": "ostringstream" } },
                { activeFile: "test_recursivitat.cc", line: 11, description: "pro.stack_recursivitat.step_4", terminalOutput: [], variables: {} },
                { activeFile: "recursivitat.cc", line: 7, description: "pro.stack_recursivitat.step_5", terminalOutput: [], variables: { "n": "2", "s": "[]" } },
                { activeFile: "recursivitat.cc", line: 8, description: "pro.stack_recursivitat.step_6", terminalOutput: [], variables: { "s": "[2] <- top", "n": "2" } },
                { activeFile: "recursivitat.cc", line: 11, description: "pro.stack_recursivitat.step_7", terminalOutput: [], variables: { "s": "[2] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "pro.stack_recursivitat.step_8", terminalOutput: [], variables: { "s": "[2] <- top", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_9", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 15, description: "pro.stack_recursivitat.step_10", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 16, description: "pro.stack_recursivitat.step_11", terminalOutput: ["pro.stack_recursivitat.term_5"], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 19, description: "pro.stack_recursivitat.step_12", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 20, description: "pro.stack_recursivitat.step_13", terminalOutput: [], variables: { "s": "[1, 1] <- top", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 11, description: "pro.stack_recursivitat.step_14", terminalOutput: [], variables: { "s": "[1, 1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "pro.stack_recursivitat.step_15", terminalOutput: [], variables: { "s": "[1, 1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_16", terminalOutput: [], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 16, description: "pro.stack_recursivitat.step_17", terminalOutput: ["pro.stack_recursivitat.term_6"], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 20, description: "pro.stack_recursivitat.step_18", terminalOutput: [], variables: { "s": "[1, 0, 0] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 12, description: "pro.stack_recursivitat.step_19", terminalOutput: [], variables: { "s": "[1, 0, 0] <- top", "v": "0" } },
                { activeFile: "recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_20", terminalOutput: [], variables: { "s": "[1, 0] <- top", "v": "0" } },
                { activeFile: "recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_21", terminalOutput: [], variables: { "s": "[1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "pro.stack_recursivitat.step_22", terminalOutput: [], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_23", terminalOutput: [], variables: { "s": "[]", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 16, description: "pro.stack_recursivitat.step_24", terminalOutput: ["pro.stack_recursivitat.term_7"], variables: { "s": "[]", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 20, description: "pro.stack_recursivitat.step_25", terminalOutput: [], variables: { "s": "[0, 0] -> []", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 11, description: "pro.stack_recursivitat.step_26", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "test_recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_27", terminalOutput: [], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 13, description: "pro.stack_recursivitat.step_28", terminalOutput: ["pro.stack_recursivitat.term_8", "pro.stack_recursivitat.term_9", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const stack_recursivitat: Simulation = {
    id: legacyAlgo.stack_recursivitat.id,
    renderer: "oop",
    files: legacyAlgo.stack_recursivitat.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.stack_recursivitat.generateSteps().map((step: OOPStep) => ({
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
