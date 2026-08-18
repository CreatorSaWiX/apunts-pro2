import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, { id: string; files: Record<string, string>; generateSteps: () => OOPStep[] }> = {
    stack_parentesis: {
        id: "stack_parentesis",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_parentesis
	@./test_parentesis -ni

test_parentesis: test_parentesis.cc parentesis.cc
	$(CXX) $(CXX_FLAGS) -o test_parentesis test_parentesis.cc parentesis.cc`,
            "test_parentesis.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void parentesis(istream& in, ostream& out);

TEST_CASE("seqüència correcta amb claudàtors") {
    istringstream sin("(()[[]]).");
    ostringstream sout;

    parentesis(sin, sout);

    CHECK(sout.str() == "Correcte\\n");
}`,
            "parentesis.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    while (in >> c and c != '.') {
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    if (s.empty()) out << "Correcte\\n";
    else out << "Incorrecte " << pos << endl;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.stack_parentesis.step_1", terminalOutput: ["pro.stack_parentesis.term_1", "pro.stack_parentesis.term_2"], variables: {} },
                { activeFile: "test_parentesis.cc", line: 10, description: "pro.stack_parentesis.step_2", terminalOutput: ["pro.stack_parentesis.term_3", "pro.stack_parentesis.term_4", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_parentesis.cc", line: 11, description: "pro.stack_parentesis.step_3", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_parentesis.cc", line: 14, description: "pro.stack_parentesis.step_4", terminalOutput: [], variables: {} },
                { activeFile: "parentesis.cc", line: 7, description: "pro.stack_parentesis.step_5", terminalOutput: [], variables: { "s": "[]", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_6", terminalOutput: [], variables: { "s": "[]", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 12, description: "pro.stack_parentesis.step_7", terminalOutput: [], variables: { "s": "[]", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 13, description: "pro.stack_parentesis.step_8", terminalOutput: [], variables: { "s": "[(] <- top", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 28, description: "pro.stack_parentesis.step_9", terminalOutput: [], variables: { "s": "[(]", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_10", terminalOutput: [], variables: { "s": "[(]", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 13, description: "pro.stack_parentesis.step_11", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 28, description: "pro.stack_parentesis.step_12", terminalOutput: [], variables: { "s": "[(, (]", "c": "(", "pos": "3" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_13", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")", "pos": "3" } },
                { activeFile: "parentesis.cc", line: 16, description: "pro.stack_parentesis.step_14", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")" } },
                { activeFile: "parentesis.cc", line: 17, description: "pro.stack_parentesis.step_15", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")" } },
                { activeFile: "parentesis.cc", line: 21, description: "pro.stack_parentesis.step_16", terminalOutput: [], variables: { "s": "[(, (] <- top", "top": "(" } },
                { activeFile: "parentesis.cc", line: 22, description: "pro.stack_parentesis.step_17", terminalOutput: [], variables: { "c": ")", "top": "(" } },
                { activeFile: "parentesis.cc", line: 23, description: "pro.stack_parentesis.step_18", terminalOutput: [], variables: { "s": "[(] <- top" } },
                { activeFile: "parentesis.cc", line: 28, description: "pro.stack_parentesis.step_19", terminalOutput: [], variables: { "s": "[(] <- top", "pos": "4" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_20", terminalOutput: ["pro.stack_parentesis.custom_1"], variables: { "s": "[(] <- top", "pos": "8", "c": "]" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_21", terminalOutput: ["pro.stack_parentesis.term_8"], variables: { "s": "[(] <- top", "pos": "9", "c": ")" } },
                { activeFile: "parentesis.cc", line: 23, description: "pro.stack_parentesis.step_22", terminalOutput: [], variables: { "s": "[]", "pos": "9" } },
                { activeFile: "parentesis.cc", line: 11, description: "pro.stack_parentesis.step_23", terminalOutput: [], variables: { "s": "[]", "c": "." } },
                { activeFile: "parentesis.cc", line: 31, description: "pro.stack_parentesis.step_24", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "parentesis.cc", line: 31, description: "pro.stack_parentesis.step_25", terminalOutput: ["pro.stack_parentesis.term_9"], variables: { "s": "[]" } },
                { activeFile: "test_parentesis.cc", line: 16, description: "pro.stack_parentesis.step_26", terminalOutput: [], variables: { "sout.str()": "Correcte\\n" } },
                { activeFile: "test_parentesis.cc", line: 17, description: "pro.stack_parentesis.step_27", terminalOutput: ["pro.stack_parentesis.term_10", "pro.stack_parentesis.term_11", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const stack_parentesis: Simulation = {
    id: legacyAlgo.stack_parentesis.id,
    renderer: "oop",
    files: legacyAlgo.stack_parentesis.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.stack_parentesis.generateSteps().map((step: OOPStep) => ({
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
