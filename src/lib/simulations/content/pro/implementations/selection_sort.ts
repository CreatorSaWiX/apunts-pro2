import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/selection_sort/source.cpp?raw";

export const selection_sort: Simulation = {
    id: "selection_sort",
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
        //  5: int posicio_maxim(const vector<int>& v, int n) {
        //  6:     int k = 0;
        //  7:     for (int i = 1; i <= n; ++i)
        //  8:         if (v[i] > v[k]) k = i;
        //  9:     return k;
        // 10: }
        // 11:
        // 12: void ordena_seleccio(vector<int>& v, int n) {
        // 13:     for (int i = n - 1; i >= 1; --i) {
        // 14:         int k = posicio_maxim(v, i);
        // 15:         swap(v[k], v[i]);
        // 16:     }
        // 17: }
        // 18:
        // 19: int main() {
        // 20:     vector<int> v = {3, 8, 5, 1, 4};
        // 21:     ordena_seleccio(v, v.size());
        // 22:     for (int x : v) cout << x << " ";
        // 23:     cout << endl;
        // 24: }

        const TERM_RUN = "pro.selection_sort.term_run";
        const TERM_OUTPUT = "pro.selection_sort.term_output";
        const TERM_END = "pro.selection_sort.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ── main(): inicialitza el vector ──
            .setVariables({ "v": "[3, 8, 5, 1, 4]" })
            .setTerminalOutput([TERM_RUN])
            .addStep(20, "pro.selection_sort.step_1")

            // ── Crida ordena_seleccio(v, 5) ──
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "n": "5" })
            .addStep(21, "pro.selection_sort.step_2")

            // ═══ Iteració i=4 ═══
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "n": "5", "i": "4" })
            .addStep(13, "pro.selection_sort.step_3")

            // Entra a posicio_maxim(v, 4), k=0
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "0" })
            .addStep(6, "pro.selection_sort.step_4")

            // Bucle: v[1]=8 > v[0]=3 → k=1
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "1", "i_inner": "1" })
            .addStep(8, "pro.selection_sort.step_5")

            // Bucle: v[2]=5, v[3]=1, v[4]=4 cap > 8, k queda 1
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "1", "i_inner": "2→4" })
            .addStep(7, "pro.selection_sort.step_6")

            // return k=1
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "1" })
            .addStep(9, "pro.selection_sort.step_7")

            // swap(v[1], v[4]) → v canvia
            .setVariables({ "v": "[3, 4, 5, 1, 8]", "n": "5", "i": "4", "k": "1" })
            .addStep(15, "pro.selection_sort.step_8")

            // ═══ Iteració i=3 ═══
            .setVariables({ "v": "[3, 4, 5, 1, 8]", "n": "5", "i": "3" })
            .addStep(13, "pro.selection_sort.step_9")

            // posicio_maxim(v, 3) → recorre [3,4,5,1], retorna k=2
            .setVariables({ "v": "[3, 4, 5, 1, 8]", "k": "2" })
            .addStep(9, "pro.selection_sort.step_10")

            // swap(v[2], v[3])
            .setVariables({ "v": "[3, 4, 1, 5, 8]", "n": "5", "i": "3", "k": "2" })
            .addStep(15, "pro.selection_sort.step_11")

            // ═══ Iteració i=2 ═══
            .setVariables({ "v": "[3, 4, 1, 5, 8]", "n": "5", "i": "2" })
            .addStep(13, "pro.selection_sort.step_12")

            // posicio_maxim(v, 2) → recorre [3,4,1], retorna k=1
            .setVariables({ "v": "[3, 4, 1, 5, 8]", "k": "1" })
            .addStep(9, "pro.selection_sort.step_13")

            // swap(v[1], v[2])
            .setVariables({ "v": "[3, 1, 4, 5, 8]", "n": "5", "i": "2", "k": "1" })
            .addStep(15, "pro.selection_sort.step_14")

            // ═══ Iteració i=1 ═══
            .setVariables({ "v": "[3, 1, 4, 5, 8]", "n": "5", "i": "1" })
            .addStep(13, "pro.selection_sort.step_15")

            // posicio_maxim(v, 1) → recorre [3,1], retorna k=0
            .setVariables({ "v": "[3, 1, 4, 5, 8]", "k": "0" })
            .addStep(9, "pro.selection_sort.step_16")

            // swap(v[0], v[1])
            .setVariables({ "v": "[1, 3, 4, 5, 8]", "n": "5", "i": "1", "k": "0" })
            .addStep(15, "pro.selection_sort.step_17")

            // ── Torna a main(), executa cout ──
            .clearVariables()
            .setVariables({ "v": "[1, 3, 4, 5, 8]" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(22, "pro.selection_sort.step_18")

            // ── Fi del programa ──
            .setVariables({ "v": "[1, 3, 4, 5, 8]", "comparacions": "4+3+2+1 = 10" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(24, "pro.selection_sort.step_19");

        return builder.build();
    }
};
