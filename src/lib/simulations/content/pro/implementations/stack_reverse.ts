import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    stack_reverse: {
        id: "stack_reverse",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_reverse
	@./test_reverse -ni

test_reverse: test_reverse.cc reverse.cc
	$(CXX) $(CXX_FLAGS) -o test_reverse test_reverse.cc reverse.cc`,
            "test_reverse.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void reverse(istream& in, ostream& out);

TEST_CASE("dos elements") {
    istringstream sin("7 3");
    ostringstream sout;

    reverse(sin, sout);

    CHECK(sout.str() == "3 7\\n");
}`,
            "reverse.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // Anem desapilant i cridant el TOP per extreure en invers
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.stack_reverse.step_1", terminalOutput: ["pro.stack_reverse.term_1", "pro.stack_reverse.term_2"], variables: {} },
                { activeFile: "test_reverse.cc", line: 8, description: "pro.stack_reverse.step_2", terminalOutput: ["pro.stack_reverse.term_3", "pro.stack_reverse.term_4", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_reverse.cc", line: 9, description: "pro.stack_reverse.step_3", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_reverse.cc", line: 12, description: "pro.stack_reverse.step_4", terminalOutput: [], variables: {} },
                { activeFile: "reverse.cc", line: 7, description: "pro.stack_reverse.step_5", terminalOutput: [], variables: { "s": "[]", "n": "?" } },
                { activeFile: "reverse.cc", line: 9, description: "pro.stack_reverse.step_6", terminalOutput: [], variables: { "s": "[]", "n": "7" } },
                { activeFile: "reverse.cc", line: 10, description: "pro.stack_reverse.step_7", terminalOutput: [], variables: { "s": "[7] <- top", "n": "7" } },
                { activeFile: "reverse.cc", line: 9, description: "pro.stack_reverse.step_8", terminalOutput: [], variables: { "s": "[7] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 10, description: "pro.stack_reverse.step_9", terminalOutput: [], variables: { "s": "[7, 3] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 9, description: "pro.stack_reverse.step_10", terminalOutput: [], variables: { "s": "[7, 3] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 14, description: "pro.stack_reverse.step_11", terminalOutput: [], variables: { "s": "[7, 3] <- top" } },
                { activeFile: "reverse.cc", line: 15, description: "pro.stack_reverse.step_12", terminalOutput: ["pro.stack_reverse.term_5"], variables: { "s": "[7, 3] <- top" } },
                { activeFile: "reverse.cc", line: 16, description: "pro.stack_reverse.step_13", terminalOutput: [], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 14, description: "pro.stack_reverse.step_14", terminalOutput: [], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 15, description: "pro.stack_reverse.step_15", terminalOutput: ["pro.stack_reverse.term_6"], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 16, description: "pro.stack_reverse.step_16", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "reverse.cc", line: 14, description: "pro.stack_reverse.step_17", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "reverse.cc", line: 19, description: "pro.stack_reverse.step_18", terminalOutput: ["pro.stack_reverse.term_7"], variables: { "s": "[]" } },
                { activeFile: "test_reverse.cc", line: 14, description: "pro.stack_reverse.step_19", terminalOutput: [], variables: { "sout.str()": "3 7\\n" } },
                { activeFile: "test_reverse.cc", line: 15, description: "pro.stack_reverse.step_20", terminalOutput: ["pro.stack_reverse.term_8", "pro.stack_reverse.term_9", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const stack_reverse: Simulation = {
    id: legacyAlgo.stack_reverse.id,
    renderer: "oop",
    files: legacyAlgo.stack_reverse.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.stack_reverse.generateSteps().map((step: OOPStep) => ({
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
