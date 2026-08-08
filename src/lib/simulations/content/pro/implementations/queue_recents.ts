import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    queue_recents: {
        id: "queue_recents",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_compta_recents
	@./test_compta_recents -ni

test_compta_recents: test_compta_recents.cc compta_recents.cc
	$(CXX) $(CXX_FLAGS) -o test_compta_recents test_compta_recents.cc compta_recents.cc`,
            "test_compta_recents.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void compta_recents(istream& in, ostream& out);

TEST_CASE("frontera exacta de la finestra") {
    istringstream sin("3 10\\n0 10 20");
    ostringstream sout;

    compta_recents(sin, sout);

    CHECK(sout.str() == "1 2 2\\n");
}`,
            "recents.cc": `#include <iostream>
using namespace std;
#include "queue.hh"
using namespace pro2;

void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // Evaluador extern caducant peticions antigues fora de la finestra
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Mostra quants en queden de vius (size)
            first = false;
        }
        out << endl;
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.queue_recents.step_1", terminalOutput: ["pro.queue_recents.term_1", "pro.queue_recents.term_2"], variables: {} },
                { activeFile: "test_compta_recents.cc", line: 8, description: "pro.queue_recents.step_2", terminalOutput: ["pro.queue_recents.term_3", "pro.queue_recents.term_4", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_compta_recents.cc", line: 9, description: "pro.queue_recents.step_3", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_compta_recents.cc", line: 12, description: "pro.queue_recents.step_4", terminalOutput: [], variables: {} },
                { activeFile: "recents.cc", line: 7, description: "pro.queue_recents.step_5", terminalOutput: [], variables: { "N": "3", "T": "10", "q": "front [] back" } },
                { activeFile: "recents.cc", line: 12, description: "pro.queue_recents.step_6", terminalOutput: [], variables: { "N": "3", "T": "10", "q": "front [] back" } },
                { activeFile: "recents.cc", line: 14, description: "pro.queue_recents.step_7", terminalOutput: ["pro.queue_recents.term_5"], variables: { "t": "0", "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 18, description: "pro.queue_recents.step_8", terminalOutput: [], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 23, description: "pro.queue_recents.step_9", terminalOutput: ["pro.queue_recents.term_6"], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 12, description: "pro.queue_recents.step_10", terminalOutput: [], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 14, description: "pro.queue_recents.step_11", terminalOutput: ["pro.queue_recents.term_7"], variables: { "t": "10", "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 18, description: "pro.queue_recents.step_12", terminalOutput: [], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 23, description: "pro.queue_recents.step_13", terminalOutput: ["pro.queue_recents.term_8"], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 12, description: "pro.queue_recents.step_14", terminalOutput: [], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 14, description: "pro.queue_recents.step_15", terminalOutput: ["pro.queue_recents.term_9"], variables: { "t": "20", "q": "front [0, 10, 20] back" } },
                { activeFile: "recents.cc", line: 18, description: "pro.queue_recents.step_16", terminalOutput: ["pro.queue_recents.term_10"], variables: { "q": "front [0, 10, 20] back" } },
                { activeFile: "recents.cc", line: 19, description: "pro.queue_recents.step_17", terminalOutput: ["pro.queue_recents.term_11"], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 18, description: "pro.queue_recents.step_18", terminalOutput: [], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 23, description: "pro.queue_recents.step_19", terminalOutput: ["pro.queue_recents.term_12"], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 26, description: "pro.queue_recents.step_20", terminalOutput: ["pro.queue_recents.term_13"], variables: { "q": "front [10, 20] back" } },
                { activeFile: "test_compta_recents.cc", line: 14, description: "pro.queue_recents.step_21", terminalOutput: ["pro.queue_recents.term_14", "pro.queue_recents.term_15", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const queue_recents: Simulation = {
    id: legacyAlgo.queue_recents.id,
    renderer: "oop",
    files: legacyAlgo.queue_recents.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.queue_recents.generateSteps().map((step: OOPStep) => ({
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
