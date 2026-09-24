import type { Simulation, SimulationStep } from "../../../engine/types";
import { OOPBuilder } from "../OOPBuilder";
import source_cpp_raw from "../code/insertion_sort/source.cpp?raw";

export const insertion_sort: Simulation = {
    id: "insertion_sort",
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
        //  5: void ordena_insercio(vector<int>& v, int n) {
        //  6:     for (int k = 1; k <= n - 1; ++k) {
        //  7:         int j = k - 1;
        //  8:         while (j >= 0 and v[j+1] < v[j]) {
        //  9:             swap(v[j], v[j+1]);
        // 10:             --j;
        // 11:         }
        // 12:     }
        // 13: }
        // 14:
        // 15: int main() {
        // 16:     vector<int> v = {3, 8, 5, 1, 4};
        // 17:     ordena_insercio(v, v.size());
        // 18:     for (int x : v) cout << x << " ";
        // 19:     cout << endl;
        // 20: }

        const TERM_RUN = "pro.insertion_sort.term_run";
        const TERM_OUTPUT = "pro.insertion_sort.term_output";
        const TERM_END = "pro.insertion_sort.term_end";

        const builder = new OOPBuilder()
            .setActiveFile("source.cpp")

            // ── main(): inicialitza el vector ──
            .setVariables({ "v": "[3, 8, 5, 1, 4]" })
            .setTerminalOutput([TERM_RUN])
            .addStep(16, "pro.insertion_sort.step_1")

            // ── Crida ordena_insercio(v, 5) ──
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "n": "5" })
            .addStep(17, "pro.insertion_sort.step_2")

            // ═══ k=1: inserir v[1]=8 ═══
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "1", "j": "0" })
            .addStep(7, "pro.insertion_sort.step_3")

            // while: v[1]=8 >= v[0]=3 → no entra
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "1", "j": "0" })
            .addStep(8, "pro.insertion_sort.step_4")

            // ═══ k=2: inserir v[2]=5 ═══
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "2", "j": "1" })
            .addStep(7, "pro.insertion_sort.step_5")

            // while: v[2]=5 < v[1]=8 → entra
            .setVariables({ "v": "[3, 8, 5, 1, 4]", "k": "2", "j": "1" })
            .addStep(8, "pro.insertion_sort.step_6")

            // swap(v[1], v[2]), --j → j=0
            .setVariables({ "v": "[3, 5, 8, 1, 4]", "k": "2", "j": "0" })
            .addStep(9, "pro.insertion_sort.step_7")

            // while: v[1]=5 >= v[0]=3 → atura
            .setVariables({ "v": "[3, 5, 8, 1, 4]", "k": "2", "j": "0" })
            .addStep(8, "pro.insertion_sort.step_8")

            // ═══ k=3: inserir v[3]=1 ═══
            .setVariables({ "v": "[3, 5, 8, 1, 4]", "k": "3", "j": "2" })
            .addStep(7, "pro.insertion_sort.step_9")

            // v[3]=1 < v[2]=8 → swap(v[2], v[3]), --j → j=1
            .setVariables({ "v": "[3, 5, 1, 8, 4]", "k": "3", "j": "1" })
            .addStep(9, "pro.insertion_sort.step_10")

            // v[2]=1 < v[1]=5 → swap(v[1], v[2]), --j → j=0
            .setVariables({ "v": "[3, 1, 5, 8, 4]", "k": "3", "j": "0" })
            .addStep(9, "pro.insertion_sort.step_11")

            // v[1]=1 < v[0]=3 → swap(v[0], v[1]), --j → j=-1
            .setVariables({ "v": "[1, 3, 5, 8, 4]", "k": "3", "j": "-1" })
            .addStep(9, "pro.insertion_sort.step_12")

            // while: j=-1 < 0 → atura
            .setVariables({ "v": "[1, 3, 5, 8, 4]", "k": "3", "j": "-1" })
            .addStep(8, "pro.insertion_sort.step_13")

            // ═══ k=4: inserir v[4]=4 ═══
            .setVariables({ "v": "[1, 3, 5, 8, 4]", "k": "4", "j": "3" })
            .addStep(7, "pro.insertion_sort.step_14")

            // v[4]=4 < v[3]=8 → swap(v[3], v[4]), --j → j=2
            .setVariables({ "v": "[1, 3, 5, 4, 8]", "k": "4", "j": "2" })
            .addStep(9, "pro.insertion_sort.step_15")

            // v[3]=4 < v[2]=5 → swap(v[2], v[3]), --j → j=1
            .setVariables({ "v": "[1, 3, 4, 5, 8]", "k": "4", "j": "1" })
            .addStep(9, "pro.insertion_sort.step_16")

            // while: v[2]=4 >= v[1]=3 → atura
            .setVariables({ "v": "[1, 3, 4, 5, 8]", "k": "4", "j": "1" })
            .addStep(8, "pro.insertion_sort.step_17")

            // ── Torna a main(), executa cout ──
            .clearVariables()
            .setVariables({ "v": "[1, 3, 4, 5, 8]" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT])
            .addStep(18, "pro.insertion_sort.step_18")

            // ── Fi del programa ──
            .setVariables({ "v": "[1, 3, 4, 5, 8]", "swaps": "0+1+3+2 = 6" })
            .setTerminalOutput([TERM_RUN, TERM_OUTPUT, TERM_END])
            .addStep(20, "pro.insertion_sort.step_19");

        return builder.build();
    }
};
