import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/binary_search/source.cpp?raw";

export const binary_search: Simulation = {
    id: "binary_search",
    renderer: "oop",
    files: {
        "source.cpp": source_cpp_raw,
    },
    generateSteps: (): SimulationStep[] => {
        // Line reference for source.cpp:
        //  1: #include <iostream>
        //  2: #include <vector>
        //  3: using namespace std;
        //  4:
        //  5: int cerca_binaria(const vector<int>& a, int i, int j, int x) {
        //  6:     if (i <= j) {
        //  7:         int k = (i + j) / 2;
        //  8:         if (x < a[k]) return cerca_binaria(a, i, k - 1, x);
        //  9:         else if (x > a[k]) return cerca_binaria(a, k + 1, j, x);
        // 10:         else return k;
        // 11:     }
        // 12:     else return -1;
        // 13: }
        // 14:
        // 15: int main() {
        // 16:     vector<int> a = {1, 3, 5, 7, 9, 11, 13};
        // 17:     int pos = cerca_binaria(a, 0, a.size() - 1, 9);
        // 18:     cout << "Posicio: " << pos << endl;
        // 19: }

        const TERM_RUN = "pro.binary_search.term_run";
        const TERM_OUTPUT = "pro.binary_search.term_output";
        const TERM_END = "pro.binary_search.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ── main() ──
            .setVariables({ "a": "[1, 3, 5, 7, 9, 11, 13]" })
            .setTerminalOutput([TERM_RUN])
            .addStep(16, "pro.binary_search.step_1")

            .setVariables({ "a": "[1, 3, 5, 7, 9, 11, 13]", "x": "9" })
            .addStep(17, "pro.binary_search.step_2")

            // ═══ Crida 1: cerca_binaria(a, 0, 6, 9) ═══

            .setVariables({ "i": "0", "j": "6", "x": "9" })
            .addStep(6, "pro.binary_search.step_3")

            .setVariables({ "i": "0", "j": "6", "x": "9", "k": "3", "a[k]": "7" })
            .addStep(7, "pro.binary_search.step_4")

            // x=9 > a[3]=7 → meitat dreta
            .addStep(9, "pro.binary_search.step_5")

            // ═══ Crida 2: cerca_binaria(a, 4, 6, 9) ═══

            .setVariables({ "i": "4", "j": "6", "x": "9" })
            .addStep(6, "pro.binary_search.step_6")

            .setVariables({ "i": "4", "j": "6", "x": "9", "k": "5", "a[k]": "11" })
            .addStep(7, "pro.binary_search.step_7")

            // x=9 < a[5]=11 → meitat esquerra
            .addStep(8, "pro.binary_search.step_8")

            // ═══ Crida 3: cerca_binaria(a, 4, 4, 9) ═══

            .setVariables({ "i": "4", "j": "4", "x": "9" })
            .addStep(6, "pro.binary_search.step_9")

            .setVariables({ "i": "4", "j": "4", "x": "9", "k": "4", "a[k]": "9" })
            .addStep(7, "pro.binary_search.step_10")

            // x=9 == a[4]=9 → trobat!
            .setVariables({ "i": "4", "j": "4", "x": "9", "k": "4", "a[k]": "9", "retorn": "4" })
            .addStep(10, "pro.binary_search.step_11")

            // ── Torna a main() ──

            .clearVariables()
            .setVariables({ "a": "[1, 3, 5, 7, 9, 11, 13]", "pos": "4" })
            .addStep(17, "pro.binary_search.step_12")

            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(18, "pro.binary_search.step_13")

            .setVariables({ "pos": "4", "crides": "3" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(19, "pro.binary_search.step_14");

        return builder.build();
    }
};
