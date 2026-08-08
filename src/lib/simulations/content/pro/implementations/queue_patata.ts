import type { Simulation, SimulationStep } from "../../../engine/types";

export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

const legacyAlgo: Record<string, any> = {
    queue_patata: {
        id: "queue_patata",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_patata_calenta
	@./test_patata_calenta -ni

test_patata_calenta: test_patata_calenta.cc patata_calenta.cc
	$(CXX) $(CXX_FLAGS) -o test_patata_calenta test_patata_calenta.cc patata_calenta.cc`,
            "test_patata_calenta.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void patata_calenta(istream& in, ostream& out);

TEST_CASE("N=3, k=1") {
    istringstream sin("3 1");
    ostringstream sout;

    patata_calenta(sin, sout);

    CHECK(sout.str() == "2 1\\nSupervivent: 3\\n");
}`,
            "patata.cc": `#include <iostream>
using namespace std;
#include "queue.hh"
using namespace pro2;

void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Noms i gent dins del joc
        }
        
        bool first = true;
        while (q.size() > 1) { // Fins que sobrevisqui només 1 individu
            // Fem K girs cap a fi de la cua
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // La pobra anima davantera rep l'expulsió immediata
            out << q.front();
            q.pop(); 
            first = false;
        }
        
        if (!first) out << endl;
        if (q.size() == 1) {
            out << "Supervivent: " << q.front() << endl;
        }
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "pro.queue_patata.step_1", terminalOutput: ["pro.queue_patata.term_1", "pro.queue_patata.term_2"], variables: {} },
                { activeFile: "test_patata_calenta.cc", line: 8, description: "pro.queue_patata.step_2", terminalOutput: ["pro.queue_patata.term_3", "pro.queue_patata.term_4", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_patata_calenta.cc", line: 9, description: "pro.queue_patata.step_3", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_patata_calenta.cc", line: 12, description: "pro.queue_patata.step_4", terminalOutput: [], variables: {} },
                { activeFile: "patata.cc", line: 7, description: "pro.queue_patata.step_5", terminalOutput: [], variables: { "N": "3", "k": "1", "q": "front [] back" } },
                { activeFile: "patata.cc", line: 10, description: "pro.queue_patata.step_6", terminalOutput: [], variables: { "q": "front [1, 2, 3] back", "N": "3", "k": "1" } },
                { activeFile: "patata.cc", line: 14, description: "pro.queue_patata.step_7", terminalOutput: [], variables: { "q": "front [1, 2, 3] back" } },
                { activeFile: "patata.cc", line: 16, description: "pro.queue_patata.step_8", terminalOutput: [], variables: { "q": "front [1, 2, 3] back" } },
                { activeFile: "patata.cc", line: 17, description: "pro.queue_patata.step_9", terminalOutput: [], variables: { "q": "front [2, 3] back", "front": "1" } },
                { activeFile: "patata.cc", line: 19, description: "pro.queue_patata.step_10", terminalOutput: ["pro.queue_patata.term_5"], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 25, description: "pro.queue_patata.step_11", terminalOutput: [], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 26, description: "pro.queue_patata.step_12", terminalOutput: ["pro.queue_patata.term_6"], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 27, description: "pro.queue_patata.step_13", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 14, description: "pro.queue_patata.step_14", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 16, description: "pro.queue_patata.step_15", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 17, description: "pro.queue_patata.step_16", terminalOutput: [], variables: { "q": "front [1] back", "front": "3" } },
                { activeFile: "patata.cc", line: 19, description: "pro.queue_patata.step_17", terminalOutput: [], variables: { "q": "front [1, 3] back" } },
                { activeFile: "patata.cc", line: 25, description: "pro.queue_patata.step_18", terminalOutput: ["pro.queue_patata.term_7"], variables: { "q": "front [1, 3] back" } },
                { activeFile: "patata.cc", line: 27, description: "pro.queue_patata.step_19", terminalOutput: [], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 14, description: "pro.queue_patata.step_20", terminalOutput: ["pro.queue_patata.term_8"], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 31, description: "pro.queue_patata.step_21", terminalOutput: ["pro.queue_patata.term_9", "pro.queue_patata.term_10"], variables: { "q": "front [3]" } },
                { activeFile: "test_patata_calenta.cc", line: 14, description: "pro.queue_patata.step_22", terminalOutput: ["pro.queue_patata.term_11", "pro.queue_patata.term_12", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
};

export const queue_patata: Simulation = {
    id: legacyAlgo.queue_patata.id,
    renderer: "oop",
    files: legacyAlgo.queue_patata.files,
    generateSteps: (): SimulationStep[] => {
        return legacyAlgo.queue_patata.generateSteps().map((step: OOPStep) => ({
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
